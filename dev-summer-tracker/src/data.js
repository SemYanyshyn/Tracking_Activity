export const DAILY_ENTRIES_KEY = 'dev-summer-tracker:daily-entries'
export const PROJECTS_KEY = 'dev-summer-tracker:projects'
export const ROADMAP_KEY = 'dev-summer-tracker:roadmap-items'
export const WEEKLY_REVIEWS_KEY = 'dev-summer-tracker:weekly-reviews'

export const STORAGE_KEYS = [
  DAILY_ENTRIES_KEY,
  PROJECTS_KEY,
  ROADMAP_KEY,
  WEEKLY_REVIEWS_KEY,
]

export const STORAGE_SAVE_ERROR =
  'Could not save data in this browser. Export a backup and check browser storage settings.'

export const PROJECT_STATUSES = [
  'Idea',
  'In Progress',
  'Testing',
  'Deployed',
  'Finished',
]

export const ROADMAP_AREAS = [
  'React',
  'JavaScript',
  'CSS',
  'English',
  'Full-stack',
  'Career',
]

export const ROADMAP_STATUSES = ['Not Started', 'In Progress', 'Repeat', 'Done']
export const ROADMAP_PRIORITIES = ['Low', 'Medium', 'High']

export const WEEKLY_SCORE_FIELDS = [
  { id: 'reactScore', label: 'React score' },
  { id: 'projectScore', label: 'Project score' },
  { id: 'englishScore', label: 'English score' },
  { id: 'gymScore', label: 'Gym score' },
  { id: 'restScore', label: 'Rest score' },
]

export const tabs = [
  { id: 'dashboard', label: 'Dashboard', title: 'Dashboard' },
  { id: 'daily', label: 'Daily Tracker', title: 'Daily Tracker' },
  { id: 'projects', label: 'Projects', title: 'Projects' },
  { id: 'roadmap', label: 'Roadmap', title: 'Roadmap' },
  { id: 'weekly', label: 'Weekly Review', title: 'Weekly Review' },
]

export function getTodayDate() {
  const today = new Date()
  return getDateKey(today)
}

export function getDateKey(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 10)
}

export function getCurrentWeekRange() {
  const today = new Date(`${getTodayDate()}T00:00:00`)
  const dayOfWeek = today.getDay()
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - daysFromMonday)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  return {
    start: getDateKey(weekStart),
    end: getDateKey(weekEnd),
  }
}

export function formatWeekRange(weekRange) {
  return `${weekRange.start} - ${weekRange.end}`
}

export function isEntryInWeek(entry, weekRange) {
  return entry.date >= weekRange.start && entry.date <= weekRange.end
}

export function countUniqueDoneDays(entries, field) {
  return new Set(entries.filter((entry) => entry[field]).map((entry) => entry.date))
    .size
}

export function average(entries, field) {
  const values = entries
    .map((entry) => Number(entry[field]))
    .filter((value) => Number.isFinite(value))

  if (values.length === 0) {
    return null
  }

  const total = values.reduce((sum, value) => sum + value, 0)
  return Math.round((total / values.length) * 10) / 10
}

export function getLatestText(entries, field) {
  const latestEntry = [...entries]
    .sort((a, b) => b.date.localeCompare(a.date))
    .find((entry) => entry[field])

  return latestEntry ? latestEntry[field] : ''
}

export function createEmptyForm() {
  return {
    date: getTodayDate(),
    reactDone: false,
    projectDone: false,
    englishDone: false,
    movementDone: false,
    pomodoros: '0',
    mainResult: '',
    mood: '5',
    energy: '5',
    tomorrowFocus: '',
    notes: '',
  }
}

export function createEmptyProjectForm() {
  return {
    name: '',
    status: 'Idea',
    stack: '',
    deadline: '',
    githubUrl: '',
    deployUrl: '',
    nextTask: '',
    notes: '',
  }
}

export function createEmptyRoadmapForm() {
  return {
    area: 'React',
    topic: '',
    status: 'Not Started',
    priority: 'Medium',
    resource: '',
    notes: '',
  }
}

export function createEmptyWeeklyReviewForm() {
  return {
    weekRange: formatWeekRange(getCurrentWeekRange()),
    bestResult: '',
    mainProblem: '',
    nextFocus: '',
    reactScore: '5',
    projectScore: '5',
    englishScore: '5',
    gymScore: '5',
    restScore: '5',
  }
}

export function readStorageArray(key) {
  try {
    if (typeof localStorage === 'undefined') {
      return []
    }

    const savedValue = localStorage.getItem(key)
    const parsedValue = savedValue ? JSON.parse(savedValue) : []

    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

export function saveStorageArray(key, value) {
  try {
    if (typeof localStorage === 'undefined') {
      return STORAGE_SAVE_ERROR
    }

    localStorage.setItem(key, JSON.stringify(Array.isArray(value) ? value : []))
    return ''
  } catch {
    return STORAGE_SAVE_ERROR
  }
}

export function loadDailyEntries() {
  return readStorageArray(DAILY_ENTRIES_KEY).map(normalizeImportedDailyEntry)
}

export function loadProjects() {
  return readStorageArray(PROJECTS_KEY).map(normalizeImportedProject)
}

export function loadRoadmapItems() {
  return readStorageArray(ROADMAP_KEY).map(normalizeImportedRoadmapItem)
}

export function loadWeeklyReviews() {
  return readStorageArray(WEEKLY_REVIEWS_KEY).map(normalizeImportedWeeklyReview)
}

export function createEntryId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function validateForm(form) {
  const pomodoros = Number(form.pomodoros)
  const mood = Number(form.mood)
  const energy = Number(form.energy)

  if (!form.date) {
    return 'Date is required.'
  }

  if (!isValidDateKey(form.date)) {
    return 'Date must be a valid YYYY-MM-DD date.'
  }

  if (!Number.isFinite(pomodoros) || pomodoros < 0) {
    return 'Pomodoro count cannot be negative.'
  }

  if (!Number.isFinite(mood) || mood < 1 || mood > 10) {
    return 'Mood must be between 1 and 10.'
  }

  if (!Number.isFinite(energy) || energy < 1 || energy > 10) {
    return 'Energy must be between 1 and 10.'
  }

  return ''
}

export function formToEntry(form, currentId) {
  return {
    id: currentId || createEntryId(),
    date: form.date,
    reactDone: form.reactDone,
    projectDone: form.projectDone,
    englishDone: form.englishDone,
    movementDone: form.movementDone,
    pomodoros: Number(form.pomodoros),
    mainResult: form.mainResult.trim(),
    mood: Number(form.mood),
    energy: Number(form.energy),
    tomorrowFocus: form.tomorrowFocus.trim(),
    notes: form.notes.trim(),
  }
}

export function entryToForm(entry) {
  const safeEntry = normalizeImportedDailyEntry(entry)

  return {
    date: safeEntry.date,
    reactDone: safeEntry.reactDone,
    projectDone: safeEntry.projectDone,
    englishDone: safeEntry.englishDone,
    movementDone: safeEntry.movementDone,
    pomodoros: String(safeEntry.pomodoros),
    mainResult: safeEntry.mainResult,
    mood: String(safeEntry.mood),
    energy: String(safeEntry.energy),
    tomorrowFocus: safeEntry.tomorrowFocus,
    notes: safeEntry.notes,
  }
}

export function validateProjectForm(form) {
  return form.name.trim() ? '' : 'Project name cannot be empty.'
}

export function projectFormToItem(form, currentId) {
  return {
    id: currentId || createEntryId(),
    name: form.name.trim(),
    status: form.status,
    stack: form.stack.trim(),
    deadline: form.deadline,
    githubUrl: form.githubUrl.trim(),
    deployUrl: form.deployUrl.trim(),
    nextTask: form.nextTask.trim(),
    notes: form.notes.trim(),
  }
}

export function projectToForm(project) {
  const safeProject = normalizeImportedProject(project)

  return {
    name: safeProject.name,
    status: safeProject.status,
    stack: safeProject.stack,
    deadline: safeProject.deadline,
    githubUrl: safeProject.githubUrl,
    deployUrl: safeProject.deployUrl,
    nextTask: safeProject.nextTask,
    notes: safeProject.notes,
  }
}

export function validateRoadmapForm(form) {
  return form.topic.trim() ? '' : 'Topic cannot be empty.'
}

export function roadmapFormToItem(form, currentId) {
  return {
    id: currentId || createEntryId(),
    area: form.area,
    topic: form.topic.trim(),
    status: form.status,
    priority: form.priority,
    resource: form.resource.trim(),
    notes: form.notes.trim(),
  }
}

export function roadmapItemToForm(item) {
  const safeItem = normalizeImportedRoadmapItem(item)

  return {
    area: safeItem.area,
    topic: safeItem.topic,
    status: safeItem.status,
    priority: safeItem.priority,
    resource: safeItem.resource,
    notes: safeItem.notes,
  }
}

export function validateWeeklyReviewForm(form) {
  const hasInvalidScore = WEEKLY_SCORE_FIELDS.some((field) => {
    const score = Number(form[field.id])
    return !Number.isFinite(score) || score < 1 || score > 10
  })

  return hasInvalidScore ? 'Scores must be from 1 to 10.' : ''
}

export function weeklyReviewFormToItem(form, currentId) {
  return {
    id: currentId || createEntryId(),
    weekRange: form.weekRange.trim(),
    bestResult: form.bestResult.trim(),
    mainProblem: form.mainProblem.trim(),
    nextFocus: form.nextFocus.trim(),
    reactScore: Number(form.reactScore),
    projectScore: Number(form.projectScore),
    englishScore: Number(form.englishScore),
    gymScore: Number(form.gymScore),
    restScore: Number(form.restScore),
  }
}

export function weeklyReviewToForm(review) {
  const safeReview = normalizeImportedWeeklyReview(review)

  return {
    weekRange: safeReview.weekRange,
    bestResult: safeReview.bestResult,
    mainProblem: safeReview.mainProblem,
    nextFocus: safeReview.nextFocus,
    reactScore: String(safeReview.reactScore),
    projectScore: String(safeReview.projectScore),
    englishScore: String(safeReview.englishScore),
    gymScore: String(safeReview.gymScore),
    restScore: String(safeReview.restScore),
  }
}

export function getWeeklyAverage(review) {
  const total = WEEKLY_SCORE_FIELDS.reduce(
    (sum, field) => sum + Number(review[field.id]),
    0,
  )
  return Math.round((total / WEEKLY_SCORE_FIELDS.length) * 10) / 10
}

export function getStatusClass(status) {
  return toSafeString(status).toLowerCase().replaceAll(' ', '-') || 'unknown'
}

export function getPriorityClass(priority) {
  return toSafeString(priority).toLowerCase() || 'medium'
}

export function normalizeLink(url) {
  const safeUrl = toSafeString(url).trim()

  if (!safeUrl) {
    return '#'
  }

  if (safeUrl.startsWith('http://') || safeUrl.startsWith('https://')) {
    return safeUrl
  }

  return `https://${safeUrl}`
}

function toSafeString(value) {
  return typeof value === 'string' ? value : ''
}

function toSafeId(value) {
  return value ? String(value) : createEntryId()
}

function toSafeScore(value) {
  const score = Number(value)

  if (!Number.isFinite(score)) {
    return 5
  }

  return Math.min(10, Math.max(1, Math.round(score)))
}

function toSafeNonNegativeNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.max(0, Math.round(number)) : 0
}

function toSafeOption(value, options, fallback) {
  return options.includes(value) ? value : fallback
}

function isValidDateKey(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00`)
  return Number.isFinite(date.getTime()) && getDateKey(date) === value
}

function toSafeDate(value) {
  return isValidDateKey(value) ? value : getTodayDate()
}

function normalizeImportedDailyEntry(entry) {
  return {
    id: toSafeId(entry?.id),
    date: toSafeDate(entry?.date),
    reactDone: Boolean(entry?.reactDone),
    projectDone: Boolean(entry?.projectDone),
    englishDone: Boolean(entry?.englishDone),
    movementDone: Boolean(entry?.movementDone),
    pomodoros: toSafeNonNegativeNumber(entry?.pomodoros),
    mainResult: toSafeString(entry?.mainResult),
    mood: toSafeScore(entry?.mood),
    energy: toSafeScore(entry?.energy),
    tomorrowFocus: toSafeString(entry?.tomorrowFocus),
    notes: toSafeString(entry?.notes),
  }
}

function normalizeImportedProject(project) {
  return {
    id: toSafeId(project?.id),
    name: toSafeString(project?.name) || 'Untitled project',
    status: toSafeOption(project?.status, PROJECT_STATUSES, 'Idea'),
    stack: toSafeString(project?.stack),
    deadline: toSafeString(project?.deadline),
    githubUrl: toSafeString(project?.githubUrl),
    deployUrl: toSafeString(project?.deployUrl),
    nextTask: toSafeString(project?.nextTask),
    notes: toSafeString(project?.notes),
  }
}

function normalizeImportedRoadmapItem(item) {
  return {
    id: toSafeId(item?.id),
    area: toSafeOption(item?.area, ROADMAP_AREAS, 'React'),
    topic: toSafeString(item?.topic) || 'Untitled topic',
    status: toSafeOption(item?.status, ROADMAP_STATUSES, 'Not Started'),
    priority: toSafeOption(item?.priority, ROADMAP_PRIORITIES, 'Medium'),
    resource: toSafeString(item?.resource),
    notes: toSafeString(item?.notes),
  }
}

function normalizeImportedWeeklyReview(review) {
  return {
    id: toSafeId(review?.id),
    weekRange: toSafeString(review?.weekRange) || formatWeekRange(getCurrentWeekRange()),
    bestResult: toSafeString(review?.bestResult),
    mainProblem: toSafeString(review?.mainProblem),
    nextFocus: toSafeString(review?.nextFocus),
    reactScore: toSafeScore(review?.reactScore),
    projectScore: toSafeScore(review?.projectScore),
    englishScore: toSafeScore(review?.englishScore),
    gymScore: toSafeScore(review?.gymScore),
    restScore: toSafeScore(review?.restScore),
  }
}

export function normalizeImportedData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Backup file must contain an object.')
  }

  return {
    dailyEntries: Array.isArray(data.dailyEntries)
      ? data.dailyEntries.map(normalizeImportedDailyEntry)
      : [],
    projects: Array.isArray(data.projects)
      ? data.projects.map(normalizeImportedProject)
      : [],
    roadmapItems: Array.isArray(data.roadmapItems)
      ? data.roadmapItems.map(normalizeImportedRoadmapItem)
      : [],
    weeklyReviews: Array.isArray(data.weeklyReviews)
      ? data.weeklyReviews.map(normalizeImportedWeeklyReview)
      : [],
  }
}
