import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import type { Transaction } from '../types';

interface RecentContactsProps {
  transactions: Transaction[];
  currentUserId?: string;
}

export default function RecentContacts({ transactions, currentUserId }: RecentContactsProps) {
  const contacts = transactions.reduce((acc, transaction) => {
    const contactId = transaction.fromUserId === currentUserId 
      ? transaction.toUserId 
      : transaction.fromUserId;
    
    if (contactId && !acc.some(c => c.id === contactId)) {
      acc.push({
        id: contactId,
        name: `User ${contactId.slice(0, 4)}`,
        email: `${contactId.slice(0, 4)}@example.com`
      });
    }
    return acc;
  }, [] as Array<{ id: string; name: string; email: string }>);

  if (contacts.length === 0) {
    return (
      <Typography color="text.secondary" textAlign="center" py={4}>
        No frequent contacts
      </Typography>
    );
  }

  return (
    <List sx={{ width: '100%' }}>
      {contacts.slice(0, 5).map((contact) => (
        <ListItem 
          key={contact.id} 
          sx={{
            px: 0,
            borderRadius: 1,
            '&:hover': { backgroundColor: 'action.hover' }
          }}
        >
          <ListItemAvatar>
            <Avatar>{contact.name.charAt(0)}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={contact.name}
            secondary={contact.email}
          />
        </ListItem>
      ))}
    </List>
  );
}