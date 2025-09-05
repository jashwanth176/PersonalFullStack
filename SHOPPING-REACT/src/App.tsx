import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { BACKEND_URL } from './config'

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

  useEffect(() => {
    load()
  }, [])

  const addItem = async (evt: FormEvent) => {
    evt.preventDefault()
    setError(null)
    try {
      const res = await fetch(`${BACKEND_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: parseFloat(price) })
      })
      if (!res.ok) throw new Error(await res.text())
      setName('')
      setPrice('')
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui', margin: 24 }}>
      <h1>Shopping Items</h1>

      <form onSubmit={addItem} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Item name" value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required />
        <input placeholder="Price" type="number" step="0.01" value={price} onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)} required />
        <button type="submit">Add</button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
  {items.map((it: Item) => (
          <li key={it.id}>{it.name} — ${it.price.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  )
}
