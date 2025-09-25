import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { BACKEND_URL } from './config';
import {
  AppBar, Toolbar, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, CircularProgress, Box, Grid, Stack
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type Item = {
  id?: number;
  name: string;
  price: number;
};

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);

  const total = useMemo(() => items.reduce((sum, it) => sum + Number(it.price), 0), [items]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/items`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addItem = async (evt: FormEvent) => {
    evt.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const body = { name: name.trim(), price: parseFloat(price) };
      if (!body.name || isNaN(body.price)) throw new Error('Enter name and valid price');
      const res = await fetch(`${BACKEND_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(await res.text());
      setName('');
      setPrice('');
      setSuccess('Item added!');
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Edit dialog handlers
  const openEditDialog = (item: Item) => {
    setEditItem(item);
    setEditDialogOpen(true);
  };
  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditItem(null);
  };
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editItem) return;
    setEditItem({ ...editItem, [e.target.name]: e.target.value });
  };
  const saveEdit = async () => {
    if (!editItem || !editItem.id) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${BACKEND_URL}/items/${editItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editItem.name, price: parseFloat(editItem.price as any) })
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess('Item updated!');
      closeEditDialog();
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Delete dialog handlers
  const openDeleteDialog = (item: Item) => {
    setDeleteItem(item);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteItem(null);
  };
  const confirmDelete = async () => {
    if (!deleteItem || !deleteItem.id) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${BACKEND_URL}/items/${deleteItem.id}`, {
        method: 'DELETE'
      });
      if (!res.ok && res.status !== 204) throw new Error(await res.text());
      setSuccess('Item deleted!');
      closeDeleteDialog();
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <AddShoppingCartIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">Shopping</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3 }} component="form" onSubmit={addItem} elevation={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>Add Item</Typography>
              <Stack spacing={2}>
                <TextField label="Item name" value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required fullWidth />
                <TextField label="Price" type="number" inputProps={{ step: '0.01', min: '0' }} value={price} onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)} required fullWidth />
                <Button type="submit" variant="contained" size="large">Add</Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 2 }} elevation={3}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6">Items</Typography>
                <Typography color="text.secondary">Total: ${total.toFixed(2)}</Typography>
              </Stack>
              {loading ? (
                <Stack alignItems="center" sx={{ py: 6 }}>
                  <CircularProgress />
                </Stack>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Typography color="text.secondary">No items yet</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        items.map((it: Item) => (
                          <TableRow key={it.id} hover>
                            <TableCell>{it.name}</TableCell>
                            <TableCell align="right">${Number(it.price).toFixed(2)}</TableCell>
                            <TableCell align="right">
                              <IconButton color="primary" onClick={() => openEditDialog(it)}><EditIcon /></IconButton>
                              <IconButton color="error" onClick={() => openDeleteDialog(it)}><DeleteIcon /></IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
          <TextField label="Item name" name="name" value={editItem?.name || ''} onChange={handleEditChange} required />
          <TextField label="Price" name="price" type="number" inputProps={{ step: '0.01' }} value={editItem?.price || ''} onChange={handleEditChange} required />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button onClick={saveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>Are you sure you want to delete "{deleteItem?.name}"?</DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for error/success */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>
    </Box>
  );
}
