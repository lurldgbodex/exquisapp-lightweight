import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  CircularProgress,
  Stack
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import TransactionItem from '../../components/TransactionList';
import useAuthGuard from '../../hooks/useAuthGuard';
import { paymentApi } from '../../features/transact/api';
import type { Transaction } from '../../types';


export default function TransactionsPage() {
  useAuthGuard();
  const [filter, setFilter] = useState<'all' | 'deposit' | 'transfer'>('all');
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['all-transactions'],
    queryFn: () => paymentApi.transactions(),
  });

  const handleFilterChange = (_: React.SyntheticEvent, newValue: 'all' | 'deposit' | 'transfer') => {
    setFilter(newValue);
  };

  const filteredTransactions = () => {
    if (!transactions) return [];
    
    switch(filter) {
      case 'deposit':
        return transactions.deposits;
      case 'transfer':
        return transactions.transfers;
      default:
        return [...transactions.deposits, ...transactions.transfers]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  };

  return (
    <Box sx={{ p: { xs: 0, sm: 3 }}}>
      <Typography variant="h4" gutterBottom>
        Transaction History
      </Typography>
      
      <Paper elevation={0} sx={{ mb: 3, borderRadius: 3}}>
        <Tabs 
          value={filter} 
          onChange={handleFilterChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#003087',
            }
          }}
        >
          <Tab label="All" value="all" />
          <Tab label="Deposits" value="deposit" />
          <Tab label="Transfers" value="transfer" />
        </Tabs>
      </Paper>

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : filteredTransactions().length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={4}>
          No transactions found
        </Typography>
      ) : (
        <Stack spacing={2}>
          {filteredTransactions().map((transaction: Transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              type={transaction.transactionType}
              currentUserId={transactions?.currentUserId}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}