import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Box, Typography, Paper, Button, Tabs, Tab, CircularProgress, Container } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import TransactionItem from '../../components/TransactionList';
import { authApi } from '../../features/auth/api';
import { walletApi } from '../../features/wallet/api';
import useAuthGuard from '../../hooks/useAuthGuard';
import { paymentApi } from '../../features/transact/api';
import type { Transaction } from '../../types';
import SendMoneyForm from '../../components/SendMoneyForm';
import DepositForm from '../../components/DepositForm';


export default function WalletPage() {
  useAuthGuard();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('action') === 'deposit' ? 1 : 
                    searchParams.get('action') === 'request' ? 2 : 0;
  const [tabValue, setTabValue] = useState(initialTab);

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: walletApi.getWallet,
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getMe,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: () => paymentApi.transactions(),
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (walletLoading || !user) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box py={3}>
        {/* Wallet Balance Card */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Available Balance
          </Typography>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            ${wallet?.balance}
          </Typography>
        </Paper>

        {/* Transaction Tabs */}
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Send Money" />
          <Tab label="Add Money" />
        </Tabs>

        {/* Tab Panels */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          {tabValue === 0 && <SendMoneyForm  />}
          {tabValue === 1 && <DepositForm />}
        </Paper>

        {/* Transaction History */}
        <Typography variant="h6" mb={2}>
          Recent Transactions
        </Typography>
        
        {transactionsLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : transactions?.deposits.length || transactions?.transfers.length ? (
          <>
            {transactions.deposits.slice(0, 3).map((transaction: Transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction} 
                type="deposit"
                currentUserId={user.id}
              />
            ))}
            {transactions.transfers.slice(0, 7).map((transaction: Transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction} 
                type="transfer"
                currentUserId={user.id}
              />
            ))}
            <Box textAlign="center" mt={2}>
              <Button 
                component={Link}
                to="/transactions"
                variant="text"
                size="small"
              >
                View All Transactions
              </Button>
            </Box>
          </>
        ) : (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No transactions yet
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
}