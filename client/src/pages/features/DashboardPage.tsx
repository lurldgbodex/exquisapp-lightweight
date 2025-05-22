import { Box, Typography, Paper, Stack, Button, Avatar, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuthGuard from '../../hooks/useAuthGuard';
import { 
  AccountBalanceWallet as WalletIcon,
  Send as SendIcon,
  Add as AddIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { walletApi } from '../../features/wallet/api';
import { authApi } from '../../features/auth/api';
import { paymentApi } from '../../features/transact/api';
import TransactionList from '../../components/TransactionList';
import type { Transaction } from '../../types';
import RecentContacts from '../../components/RecentContacts';


export default function DashboardPage() {
  useAuthGuard();

  const { data: wallet, isLoading: walletLoading, error: walletError } = useQuery({
    queryKey: ['wallet'],
    queryFn: walletApi.getWallet,
  });

  const { data: user, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getMe,
  });

  const { data: transactions, isLoading: transactionsLoading, error: transactionError } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => paymentApi.transactions(),
  });

  if (walletLoading || !user) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (walletError || userError || transactionError) {
    throw  walletError || userError || transactionError
  }

  return (
    <Box sx={{ p: { xs: 0, sm: 3}}} >
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back,{' '}
          <Box component="span" sx={{ color: '#005ea6' }}>
            {user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1)}
          </Box>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your account today
        </Typography>
      </Box>

      {/* Balance Card */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" mb={1}>
          Your balance
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" fontWeight="bold">
            ${wallet?.balance}
          </Typography>
          <Avatar sx={{ bgcolor: '#003087' }}>
            <WalletIcon />
          </Avatar>
        </Stack>
      </Paper>

      {/* Quick Actions */}
      <Box mb={4}>
        <Typography variant="h6" mb={2}>
          Quick actions
        </Typography>
        <Stack direction="row" spacing={2} mb={4}>
          <Button
            component={Link}
            to="/wallet"
            variant="contained"
            startIcon={<SendIcon />}
            sx={{ flex: 1, py: 2, borderRadius: 2 }}
          >
            Send
          </Button>
          <Button
            component={Link}
            to="/wallet"
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ flex: 1, py: 2, borderRadius: 2 }}
          >
            Add Money
          </Button>
        </Stack>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
        {/* Recent Transactions */}
        <Paper elevation={0} sx={{ p: 3, flex: 2, borderRadius: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Recent activity</Typography>
            <Button 
              component={Link} 
              to="/transactions" 
              size="small" 
              endIcon={<HistoryIcon />}
            >
              View all
            </Button>
          </Stack>
          
          {transactionsLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : transactions?.deposits.length || transactions?.transfers.length ? (
            <>
              {transactions.deposits.slice(0,2).map((transaction: Transaction) => (
                <TransactionList
                  key={transaction.id}
                  transaction={transaction}
                  type="deposit"
                  currentUserId={user?.id}
                />
              ))}
              {transactions.transfers.slice(0, 3).map((transaction: Transaction) => {
                <TransactionList
                  key={transaction.id}
                  transaction={transaction}
                  type="transfer"
                  currentUserId={user?.id}
                />
              })}
            </>
          ) : (
            <Typography color="text.secondary" textAlign="center" py={4}>
              No recent transactions
            </Typography>
          )}
        </Paper>

        {/* Recent Contacts */}
        <Paper elevation={0} sx={{ p: 3, flex: 1, borderRadius: 3 }}>
          <Typography variant="h6" mb={3}>Frequent contacts</Typography>
          <RecentContacts
            transactions={transactions?.transfers || []}
            currentUserId={user?.id}
          />
        </Paper>
      </Stack>
    </Box>
  );
}