import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { BACKEND_URL } from './config'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Snackbar,
  Alert,
  Stack,
  Box
} from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'

type Item = {
  id?: number
  name: string
  price: number
}

export default function App() {
  const [items, setItems] = useState<Item[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const total = useMemo(() => items.reduce((sum, it) => sum + it.price, 0), [items])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BACKEND_URL}/items`)
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setItems(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const addItem = async (evt: FormEvent) => {
    evt.preventDefault()
    setError(null)
    try {
      const body = { name: name.trim(), price: parseFloat(price) }
      if (!body.name || isNaN(body.price)) throw new Error('Enter name and valid price')
      const res = await fetch(`${BACKEND_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error(await res.text())
      setName('')
      setPrice('')
      setSaved(true)
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} align="center">
                            <Typography color="text.secondary">No items yet</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        items.map((it: Item) => (
                          <TableRow key={it.id} hover>
                            <TableCell>{it.name}</TableCell>
                            <TableCell align="right">${it.price.toFixed(2)}</TableCell>
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

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
      <Snackbar open={saved} autoHideDuration={2000} onClose={() => setSaved(false)}>
        <Alert severity="success" onClose={() => setSaved(false)}>Item added</Alert>
      </Snackbar>
    </Box>
  )
}
