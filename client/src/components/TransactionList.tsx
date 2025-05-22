import { Avatar, Chip, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import type { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  type: 'deposit' | 'transfer';
  currentUserId?: string;
}

export default function TransactionItem({ 
  transaction, 
  type,
  currentUserId 
}: TransactionItemProps) {
  const isCredit = type === 'deposit' || 
                  (type === 'transfer' && transaction.toUserId === currentUserId);
  
  const amountPrefix = isCredit ? '+' : '-';
  const amountColor = isCredit ? 'success.main' : 'error.main';
  
  const getTransactionTitle = () => {
    if (type === 'deposit') return 'Wallet Deposit';
    if (isCredit) return `Received from ${transaction.fromUserId}`;
    return `Sent to ${transaction.toUserId}`;
  };

  const getStatusColor = () => {
    switch(transaction.status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };
  return (
    <Paper elevation={1} sx={{ mb: 1, borderRadius: 2 }}>
      <ListItem alignItems="flex-start" sx={{ py: 2 }}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: isCredit ? '#4CAF50' : '#F44336' }}>
            {amountPrefix}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="medium">
                {getTransactionTitle()}
              </Typography>
              <Chip 
                label={transaction.status} 
                color={getStatusColor()}
                size="small"
              />
            </Stack>
          }
          secondary={
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                {format(new Date(transaction.createdAt), 'MMM dd, yyyy - h:mm a')}
              </Typography>
              <Typography
                variant="body1"
                color={amountColor}
                fontWeight="bold"
              >
                {amountPrefix}${Math.abs(transaction.amount).toFixed(2)}
              </Typography>
            </Stack>
          }
        />
      </ListItem>
    </Paper>
  );
}