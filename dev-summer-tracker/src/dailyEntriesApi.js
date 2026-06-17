import { isSupabaseConfigured, supabase } from './supabaseClient.js'

const DAILY_ENTRIES_TABLE = 'daily_entries'

function rowToDailyEntry(row) {
  return {
    id: row.id,
    date: row.date,
    reactDone: Boolean(row.react_done),
    projectDone: Boolean(row.project_done),
    englishDone: Boolean(row.english_done),
    movementDone: Boolean(row.movement_done),
    pomodoros: Number(row.pomodoro_count) || 0,
    mainResult: row.main_result || '',
    mood: Number(row.mood) || 5,
    energy: Number(row.energy) || 5,
    tomorrowFocus: row.tomorrow_focus || '',
    notes: row.notes || '',
  }
}

function dailyEntryToRow(entry) {
  return {
    id: entry.id,
    date: entry.date,
    react_done: entry.reactDone,
    project_done: entry.projectDone,
    english_done: entry.englishDone,
    movement_done: entry.movementDone,
    pomodoro_count: entry.pomodoros,
    mood: entry.mood,
    energy: entry.energy,
    main_result: entry.mainResult,
    tomorrow_focus: entry.tomorrowFocus,
    notes: entry.notes,
  }
}

export async function loadDailyEntriesFromSupabase() {
  if (!isSupabaseConfigured) {
    return { data: null, error: null, skipped: true }
  }

  const { data, error } = await supabase
    .from(DAILY_ENTRIES_TABLE)
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error, skipped: false }
  }

  return { data: data.map(rowToDailyEntry), error: null, skipped: false }
}

export async function saveDailyEntryToSupabase(entry) {
  if (!isSupabaseConfigured) {
    return { error: null, skipped: true }
  }

  const { error } = await supabase
    .from(DAILY_ENTRIES_TABLE)
    .upsert(dailyEntryToRow(entry))

  return { error, skipped: false }
}

export async function deleteDailyEntryFromSupabase(entryId) {
  if (!isSupabaseConfigured) {
    return { error: null, skipped: true }
  }

  const { error } = await supabase
    .from(DAILY_ENTRIES_TABLE)
    .delete()
    .eq('id', entryId)

  return { error, skipped: false }
}

export async function clearDailyEntriesFromSupabase() {
  if (!isSupabaseConfigured) {
    return { error: null, skipped: true }
  }

  const { error } = await supabase
    .from(DAILY_ENTRIES_TABLE)
    .delete()
    .not('id', 'is', null)

  return { error, skipped: false }
}

export async function syncDailyEntriesToSupabase(entries) {
  if (!isSupabaseConfigured) {
    return { error: null, skipped: !isSupabaseConfigured }
  }

  const clearResult = await clearDailyEntriesFromSupabase()

  if (clearResult.error) {
    return { error: clearResult.error, skipped: false }
  }

  if (entries.length === 0) {
    return { error: null, skipped: false }
  }

  const { error } = await supabase
    .from(DAILY_ENTRIES_TABLE)
    .upsert(entries.map(dailyEntryToRow))

  return { error, skipped: false }
}
