import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Button, 
  TextField, 
  Stack, 
  Alert,
  Typography,
  InputAdornment
} from '@mui/material';
import { paymentApi } from '../features/transact/api';
import type { AxiosError } from 'axios';

const transferSchema = z.object({
  recipientId: z.string().uuid('Invalid recipient id'),
  amount: z.number().min(1, 'Amount must be at least 1'),
});

type TransferFormData = z.infer<typeof transferSchema>;

export default function SendMoneyForm() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  });

  const onSubmit = async (data: TransferFormData) => {
    try {
      setIsLoading(true);
      setError('');
      
      await paymentApi.transfer({
        paid_to: data.recipientId,
        amount: data.amount,
      });
      
      setSuccess(`Successfully sent $${data.amount.toFixed(2)}`);
      reset();
    } catch (error) {
      const err = error as AxiosError;
      setError(err.message || 'Transfer failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {success && (
          <Alert severity="success" onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        <Typography variant="subtitle1">
          Send money to another user
        </Typography>
        
        <TextField
          label="Recipient's ID"
          fullWidth
          {...register('recipientId')}
          error={!!errors.recipientId}
          helperText={errors.recipientId?.message}
        />
        
        <TextField
          label="Amount"
          type="number"
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          {...register('amount', { valueAsNumber: true })}
          error={!!errors.amount}
          helperText={errors.amount?.message}
        />
        
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? 'Sending...' : 'Send Money'}
        </Button>
      </Stack>
    </form>
  );
}