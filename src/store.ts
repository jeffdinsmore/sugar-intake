import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Entry = {
  id: string
  dateISO: string // yyyy-mm-dd
  grams: number
  note?: string
}

type SugarStore = {
  entries: Entry[]
  addEntry: (grams: number, note?: string, dateISO?: string) => void
  removeEntry: (id: string) => void
  getTotalForDate: (dateISO: string) => number
}

export const useSugarStore = create<SugarStore>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (grams, note, dateISO) => {
        const date = dateISO ?? new Date().toLocaleDateString("en-CA").slice(0, 10)
        const id = crypto.randomUUID()
        set({ entries: [...get().entries, { id, grams, note, dateISO: date }] })
      },
      removeEntry: (id) => {
        set({ entries: get().entries.filter(e => e.id !== id) })
      },
      getTotalForDate: (dateISO) => {
        return get().entries
          .filter(e => e.dateISO === dateISO)
          .reduce((sum, e) => sum + e.grams, 0)
      },
    }),
    { name: 'sugar-intake-tracker' }
  )
)
