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

const depositSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1'),
});

type DepositFormData = z.infer<typeof depositSchema>;

export default function DepositForm() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
  });

  const onSubmit = async (data: DepositFormData) => {
    try {
      setIsLoading(true);
      setError('');
      
      await paymentApi.deposit(data.amount);
      
      setSuccess(`Successfully deposited $${data.amount.toFixed(2)}`);
      reset();
    } catch (error) {
      const err = error as AxiosError;
      setError(err.message || 'Deposit failed. Please try again.');
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
          Add money to your wallet
        </Typography>
        
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
          {isLoading ? 'Processing...' : 'Deposit Money'}
        </Button>
      </Stack>
    </form>
  );
}