import { useMemo, useState } from 'react'
import { useSugarStore } from './store'
import './index.css'

function todayISO() {
  return new Date().toLocaleDateString("en-CA").slice(0, 10)
}

export default function App() {
  const [grams, setGrams] = useState<string>('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(todayISO())

  const entries = useSugarStore(s => s.entries)
  const addEntry = useSugarStore(s => s.addEntry)
  const removeEntry = useSugarStore(s => s.removeEntry)
  const getTotalForDate = useSugarStore(s => s.getTotalForDate)
  console.log("entries: ", entries);
  const totalToday = useMemo(() => getTotalForDate(date), [date, getTotalForDate])

  console.log("entries: ", entries);

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const n = Number(grams)
    if (!Number.isFinite(n) || n < 0) { alert('Enter grams as a non-negative number.'); return }
    addEntry(n, note.trim() || undefined, date)
    setGrams('')
    setNote('')
  }

  const entriesForDate = entries
    .filter(e => e.dateISO === date)
    .sort((a, b) => a.id.localeCompare(b.id)) // stable-ish order

  const last7Dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().slice(0, 10)
  })

  return (
    <div className="container">
      <h1>Sugar Intake Tracker</h1>

      <form className="card" onSubmit={submit}>
        <div className="row">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div className="row">
          <label>Grams</label>
          <input
            inputMode="decimal"
            placeholder="e.g. 24"
            value={grams}
            onChange={e => setGrams(e.target.value)}
          />
        </div>
        <div className="row">
          <label>Note (optional)</label>
          <input
            placeholder="e.g. yogurt, soda, grapes"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
        <button type="submit">Add</button>
      </form>

      <div className="summary card">
        <h2>{date} Total</h2>
        <div className="big">{totalToday} g</div>
        <p>Goal idea: try ≤ 30 g/day for two weeks.</p>
      </div>

      <div className="card">
        <h2>Entries for {date}</h2>
        {entriesForDate.length === 0 ? (
          <p className="muted">No entries yet.</p>
        ) : (
          <ul className="list">
            {entriesForDate.map(e => (
              <li key={e.id}>
                <span>{e.grams} g{e.note ? ` — ${e.note}` : ''}</span>
                <button className="danger" onClick={() => removeEntry(e.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h2>Last 7 Days</h2>
        <ul className="grid7">
          {last7Dates.map(d => (
            <li key={d} className={`day ${d === date ? 'active' : ''}`} onClick={() => setDate(d)}>
              <div className="day-date">{d.slice(5)}</div>
              <div className="day-total">{getTotalForDate(d)} g</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
