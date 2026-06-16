# PROJECT_REVIEW.md

Дата огляду: 2026-06-17

Цей документ є технічним оглядом поточного стану проєкту `Dev Summer Tracker`. Початковий review був створений без зміни функціональності застосунку; нижче додано окремий розділ `Fixes Applied` для подальшого точкового bugfix pass.

## Fixes Applied

Дата fix pass: 2026-06-17.

Після початкового review були точково виправлені найважливіші технічні ризики без зміни основної функціональності:

- `loadDailyEntries()`, `loadProjects()`, `loadRoadmapItems()` і `loadWeeklyReviews()` тепер використовують спільний safe loader і завжди повертають масив. Invalid JSON, missing storage і non-array values повертають `[]`.
- Запис у `localStorage` тепер проходить через `saveStorageArray()` з `try/catch`. Якщо browser storage недоступний або переповнений, app не падає, а показує user-friendly storage error у data section.
- Dashboard average mood/energy тепер ігнорує invalid або missing numeric values. Якщо valid values немає, UI показує `No data`.
- Imported daily entry dates тепер приймаються тільки у валідному форматі `YYYY-MM-DD`; missing або invalid dates замінюються на today's date.
- Direct `localStorage` loaders тепер теж нормалізують дані через ті самі normalizers, що й import flow.
- Edit helpers `entryToForm()`, `projectToForm()`, `roadmapItemToForm()` і `weeklyReviewToForm()` тепер безпечно обробляють missing fields.
- `validateForm()` тепер вимагає валідну дату у форматі `YYYY-MM-DD`, а не лише non-empty date.
- `getStatusClass()`, `getPriorityClass()` і `normalizeLink()` тепер безпечно обробляють missing або non-string values.
- Додані `.gitignore` правила для персональних/generated analytics files:
  - `analytics/progress_data.json`
  - `analytics/.matplotlib-cache/`
  - `analytics/charts/*.png`
  - `public/charts/*.png`
- Додано `analytics/requirements.txt` з Python dependencies:
  - `pandas`
  - `matplotlib`

Verification після fix pass:

```text
npm run build - passed, no warnings
npm run lint - passed, no warnings
```

Цей розділ supersedes відповідні findings у секції "Top problems to fix" для localStorage safety, Dashboard `NaN`, imported daily dates, safe edit/helper functions і analytics ignore/dependency files.

## 1. Project overview

### Що робить застосунок

`Dev Summer Tracker` - персональний веб-застосунок для відстеження літнього прогресу front-end навчання, пет-проєктів, англійської, фізичної активності, Pomodoro-сесій, настрою, енергії, roadmap-задач і weekly review.

Застосунок працює повністю в браузері. Дані зберігаються в `localStorage`, без backend, authentication або зовнішніх UI-бібліотек.

### Основні реалізовані фічі

- Dashboard з поточною weekly статистикою.
- Daily Tracker з CRUD для щоденних записів.
- Projects tracker з CRUD, статусами, GitHub/Deploy посиланнями.
- Roadmap tracker з CRUD, фільтрами, статусами, priority badges і progress percentage.
- Weekly Review для Sunday planning.
- Export Data у JSON.
- Import Data з JSON.
- Clear All Data з `window.confirm`.
- Темна візуальна тема.
- Python analytics folder зі скриптом для генерації PNG-графіків.
- Dashboard секція для перегляду Python-generated charts через `/charts/...`.

### Поточний tech stack

- React `19.2.6`
- React DOM `19.2.6`
- Vite `8.0.12`
- JavaScript + JSX
- Plain CSS
- Browser `localStorage`
- Python script для analytics
- Python dependencies: `pandas`, `matplotlib`
- ESLint

### Чи відповідає ідеї "Dev Summer Tracker"

Так. Поточний застосунок добре відповідає ідеї персонального літнього трекера для розробника:

- React learning покривається Daily Tracker, Dashboard і Roadmap.
- Pet projects покриваються Projects і Daily Tracker.
- English покривається Daily Tracker і Roadmap.
- Gym/walking покривається Daily Tracker.
- Pomodoro count покривається Daily Tracker, Dashboard і Python charts.
- Mood/energy покриваються Daily Tracker, Dashboard і Python charts.
- Weekly reviews реалізовані окремою вкладкою.
- Job preparation partially represented через roadmap areas `Career`, main goal і weekly planning.

## 2. File structure

Файлове дерево без `node_modules`, `dist`, `.git`:

```text
.
├── .gitignore
├── README.md
├── PROJECT_REVIEW.md
├── analytics
│   ├── README.md
│   ├── charts
│   │   └── .gitkeep
│   └── generate_charts.py
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public
│   ├── charts
│   │   └── .gitkeep
│   ├── favicon.svg
│   └── icons.svg
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── assets
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components
│   │   ├── AnalyticsCharts.jsx
│   │   ├── DailyEntryForm.jsx
│   │   ├── DailyEntryList.jsx
│   │   ├── DailyTracker.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DataControls.jsx
│   │   ├── Header.jsx
│   │   ├── ProjectForm.jsx
│   │   ├── ProjectList.jsx
│   │   ├── Projects.jsx
│   │   ├── Roadmap.jsx
│   │   ├── RoadmapForm.jsx
│   │   ├── RoadmapList.jsx
│   │   ├── Tabs.jsx
│   │   ├── WeeklyReview.jsx
│   │   ├── WeeklyReviewForm.jsx
│   │   └── WeeklyReviewList.jsx
│   ├── data.js
│   ├── index.css
│   └── main.jsx
└── vite.config.js
```

### Важливі файли та папки

- `package.json`: npm scripts, React/Vite dependencies.
- `vite.config.js`: Vite config з React plugin.
- `eslint.config.js`: ESLint flat config.
- `index.html`: HTML entry point, favicon.
- `src/main.jsx`: React entry point, mount у `#root`.
- `src/App.jsx`: центральний container, state management, CRUD handlers, import/export/clear logic, tab rendering.
- `src/data.js`: constants, localStorage keys, form factories, validation, conversion helpers, import normalization, dashboard helpers.
- `src/App.css`: основні стилі компонентів, cards, grids, forms, responsive layout.
- `src/index.css`: global CSS variables, dark theme base, body/reset styles.
- `src/components/*`: reusable React components після refactor.
- `analytics/generate_charts.py`: Python analytics script.
- `analytics/README.md`: інструкція для Python analytics.
- `analytics/charts`: archive output для generated charts.
- `public/charts`: Vite-served chart output, доступний у browser через `/charts/file.png`.
- `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`: наразі не використовуються в app.
- `public/icons.svg`: наразі не використовується напряму.

## 3. Dependencies

Поточний `package.json`:

```json
{
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "vite": "^8.0.12"
  }
}
```

### Runtime dependencies

- `react`: UI library, functional components, state/effects.
- `react-dom`: renders React app into DOM.

### Dev dependencies

- `vite`: dev server and production build tool.
- `@vitejs/plugin-react`: React support for Vite.
- `eslint`: static linting.
- `@eslint/js`: recommended JS lint rules.
- `eslint-plugin-react-hooks`: rules for React hooks.
- `eslint-plugin-react-refresh`: Vite/React refresh lint rules.
- `globals`: browser globals for ESLint config.
- `@types/react`, `@types/react-dom`: TypeScript type packages. This project is JavaScript-only, so they are not required for app runtime and are not strictly necessary unless editor tooling relies on them.

### Python dependencies

The analytics script uses:

- `pandas`
- `matplotlib`

These are not npm dependencies. They are listed in `analytics/requirements.txt`, and `analytics/README.md` also instructs users to install them manually:

```bash
pip install pandas matplotlib
```

### Unnecessary dependencies

- No unnecessary runtime npm dependencies detected.
- `@types/react` and `@types/react-dom` are optional for a JavaScript-only project.
- Unused static assets exist: `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/icons.svg`.

## 4. App architecture

### Overall structure

The app uses one main React state container in `App.jsx`. The state and handlers are passed down into presentational/form/list components through props.

There is no React Router. Tab navigation is implemented with local state:

- `activeTab` stores current tab id.
- `Tabs` renders tab buttons from `tabs` constant.
- `renderTabContent()` conditionally renders the selected tab component.

### Main components

- `Header`: top app header, app name/subtitle, wraps `DataControls`.
- `DataControls`: Export Data, Import Data, Clear All Data buttons and messages.
- `Tabs`: tab navigation buttons.
- `Dashboard`: current week stats, main goal, latest text insights, analytics chart section.
- `AnalyticsCharts`: renders chart image cards from `/charts/*.png`; shows placeholder if image is missing.
- `DailyTracker`: tab wrapper for daily form and list.
- `DailyEntryForm`: controlled form for daily progress.
- `DailyEntryList`: renders daily entries with edit/delete buttons.
- `Projects`: tab wrapper for project form and list.
- `ProjectForm`: controlled form for project data.
- `ProjectList`: renders project cards, links, badges, status selector.
- `Roadmap`: tab wrapper for roadmap form/list, local filters and roadmap progress.
- `RoadmapForm`: controlled form for roadmap item.
- `RoadmapList`: renders filtered roadmap items and status selector.
- `WeeklyReview`: tab wrapper with Sunday planning card, form and list.
- `WeeklyReviewForm`: controlled weekly review form.
- `WeeklyReviewList`: previous reviews and average score display.

### State management

State is managed with React `useState` in `App.jsx`:

- Main persisted arrays:
  - `dailyEntries`
  - `projects`
  - `roadmapItems`
  - `weeklyReviews`
- Form state:
  - `dailyForm`
  - `projectForm`
  - `roadmapForm`
  - `weeklyReviewForm`
- Editing state:
  - `editingDailyId`
  - `editingProjectId`
  - `editingRoadmapId`
  - `editingWeeklyReviewId`
- Error/message state:
  - `dailyError`
  - `projectError`
  - `roadmapError`
  - `weeklyReviewError`
  - `backupMessage`
  - `backupError`

Each persisted array is synchronized to `localStorage` with a separate `useEffect`.

### Tab navigation

Tabs are defined in `src/data.js`:

```js
export const tabs = [
  { id: 'dashboard', label: 'Dashboard', title: 'Dashboard' },
  { id: 'daily', label: 'Daily Tracker', title: 'Daily Tracker' },
  { id: 'projects', label: 'Projects', title: 'Projects' },
  { id: 'roadmap', label: 'Roadmap', title: 'Roadmap' },
  { id: 'weekly', label: 'Weekly Review', title: 'Weekly Review' },
]
```

`Tabs` receives `activeTab`, `tabs`, and `onChange`. Clicking a tab calls `setActiveTab(tab.id)`.

## 5. Data models

### `dailyEntries`

Stored as an array of objects:

```js
{
  id: string,
  date: string, // YYYY-MM-DD
  reactDone: boolean,
  projectDone: boolean,
  englishDone: boolean,
  movementDone: boolean,
  pomodoros: number,
  mainResult: string,
  mood: number, // 1-10
  energy: number, // 1-10
  tomorrowFocus: string,
  notes: string
}
```

Created from `formToEntry()` in `src/data.js`.

### `projects`

Stored as an array of objects:

```js
{
  id: string,
  name: string,
  status: 'Idea' | 'In Progress' | 'Testing' | 'Deployed' | 'Finished',
  stack: string,
  deadline: string, // date string or empty
  githubUrl: string,
  deployUrl: string,
  nextTask: string,
  notes: string
}
```

Created from `projectFormToItem()`.

### `roadmapItems`

Stored as an array of objects:

```js
{
  id: string,
  area: 'React' | 'JavaScript' | 'CSS' | 'English' | 'Full-stack' | 'Career',
  topic: string,
  status: 'Not Started' | 'In Progress' | 'Repeat' | 'Done',
  priority: 'Low' | 'Medium' | 'High',
  resource: string,
  notes: string
}
```

Created from `roadmapFormToItem()`.

### `weeklyReviews`

Stored as an array of objects:

```js
{
  id: string,
  weekRange: string,
  bestResult: string,
  mainProblem: string,
  nextFocus: string,
  reactScore: number, // 1-10
  projectScore: number, // 1-10
  englishScore: number, // 1-10
  gymScore: number, // 1-10
  restScore: number // 1-10
}
```

Created from `weeklyReviewFormToItem()`.

## 6. localStorage

### Keys used

Defined in `src/data.js`:

```js
export const DAILY_ENTRIES_KEY = 'dev-summer-tracker:daily-entries'
export const PROJECTS_KEY = 'dev-summer-tracker:projects'
export const ROADMAP_KEY = 'dev-summer-tracker:roadmap-items'
export const WEEKLY_REVIEWS_KEY = 'dev-summer-tracker:weekly-reviews'
```

### Data stored under each key

- `dev-summer-tracker:daily-entries`: JSON array of `dailyEntries`.
- `dev-summer-tracker:projects`: JSON array of `projects`.
- `dev-summer-tracker:roadmap-items`: JSON array of `roadmapItems`.
- `dev-summer-tracker:weekly-reviews`: JSON array of `weeklyReviews`.

### Export/import compatibility

Export creates this structure:

```json
{
  "dailyEntries": [],
  "projects": [],
  "roadmapItems": [],
  "weeklyReviews": [],
  "exportedAt": "ISO date string"
}
```

Import uses `normalizeImportedData(data)` and reads the same four arrays. `exportedAt` is ignored safely. Missing arrays become empty arrays.

Direct `localStorage` loading and JSON import now both pass data through normalization helpers before the app uses it.

## 7. Feature checklist

| Feature | Status | Notes |
|---|---|---|
| Dashboard | Done | Shows current week stats, main goal, latest main result, tomorrow focus and chart section. |
| Daily Tracker | Done | Add, edit, delete, validation, localStorage persistence. |
| Projects | Done | Add, edit, delete, status changes, badges, optional GitHub/Deploy links. |
| Roadmap | Done | Add, edit, delete, status changes, filters, priority badges, progress percentage. |
| Weekly Review | Done | Add, edit, delete, score validation, Sunday planning card. |
| Export data | Done | Exports clean JSON with four arrays and `exportedAt`. |
| Import data | Done | Imports JSON and normalizes values. |
| Clear all data | Done | Confirms before clearing. Note: state sync writes empty arrays back to localStorage keys after removal. |
| Python analytics folder/script | Done | Uses pandas/matplotlib, handles empty/missing fields, saves charts into `analytics/charts` and `public/charts`. |
| Responsive design | Done | CSS includes desktop/mobile grids and media queries. Visual browser QA is still recommended after future UI changes. |

## 8. Code quality review

### Readability

Overall readability is good. The code uses simple functional components, direct names, and straightforward handlers. The project stays within the requested constraints: no backend, no auth, no router, no external UI library.

### Component separation

Component separation is good for the current app size:

- Each major tab has a wrapper component.
- Forms and lists are separated.
- Header, Tabs, DataControls and AnalyticsCharts are reusable.

`App.jsx` still owns most state and CRUD handlers. That is acceptable for a small app, but it is becoming long.

### Repeated code

There is repeated CRUD/form logic:

- update form field
- reset form
- submit form
- edit item
- delete item

This repetition keeps the code explicit and beginner-friendly, but future growth may benefit from a small shared reducer/helper pattern.

### Naming

Naming is generally clear:

- `dailyEntries`, `projects`, `roadmapItems`, `weeklyReviews`
- `formToEntry`, `projectFormToItem`, `roadmapFormToItem`
- `validateForm`, `validateProjectForm`, `validateRoadmapForm`

Minor naming issue: `validateForm` is generic but only validates the daily tracker form. A clearer name would be `validateDailyForm`.

### Validation

Implemented:

- Daily:
  - date required
  - date must be valid `YYYY-MM-DD`
  - pomodoro cannot be negative
  - mood 1-10
  - energy 1-10
- Projects:
  - project name required
- Roadmap:
  - topic required
- Weekly Review:
  - all scores 1-10

Possible gaps:

- Project URLs are not validated.
- Weekly `weekRange` can be empty.

### Error handling

Good:

- Import handles invalid JSON with an error message.
- Load helpers catch JSON parse errors.
- Direct localStorage loaders normalize arrays before the app uses them.
- Browser storage writes are wrapped and show a user-facing error instead of crashing.
- Python script handles missing `progress_data.json` and invalid JSON.

Needs attention:

- Project URLs are normalized for display but not validated for correctness.
- Import replaces all existing data without a preview step.

### Possible bugs

1. `Clear All Data` removes keys, but state updates trigger `useEffect` and write empty arrays back to the same keys.
2. Analytics charts require a manual export/rename/run/refresh flow. The UI cannot generate them directly because there is no backend.
3. Individual delete actions are immediate and cannot be undone.

### UX problems

- Individual Delete buttons do not ask for confirmation and do not provide undo.
- Import replaces all existing data immediately after file load. There is no preview or confirmation.
- Analytics chart cards show missing placeholders until the Python script is run and the page is refreshed.
- Dashboard stats are current-week only; there is no visible way to inspect older weeks in the UI.

### Mobile responsiveness

CSS includes media queries at `980px` and `720px`. Important grids collapse to fewer columns or one column:

- header
- tabs
- stats
- forms
- project cards
- roadmap filters
- score grids
- analytics charts

The responsive approach is simple and appropriate. A visual mobile browser pass is still recommended before treating the UI as fully polished.

## 9. Build and runtime checks

### `npm run build`

Result: passed.

Command output:

```text
> dev-summer-tracker@0.0.0 build
> vite build

vite v8.0.16 building client environment for production...
transforming...✓ 35 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-sqwz44Qv.css   13.70 kB │ gzip:  3.32 kB
dist/assets/index-BrTDTj8c.js   227.28 kB │ gzip: 68.01 kB

✓ built in 63ms
```

Build warnings: none detected.

### `npm run lint`

Result: passed.

Command output:

```text
> dev-summer-tracker@0.0.0 lint
> eslint .
```

Lint warnings/errors: none detected.

### Console/runtime issues detectable from code

No direct console errors are obvious from static inspection under normal valid data.

Potential runtime/UX risks still detectable from code:

- `Clear All Data` clears user data but the persistence effects write empty arrays back to storage keys.
- Analytics images remain static until the Python script is run again and the browser is refreshed.
- Import replaces existing data immediately after a valid JSON file is selected.

Browser console was not opened during this report pass.

## 10. Top problems to fix

### Resolved

- Direct localStorage loaders now always return arrays and normalize daily entries, projects, roadmap items and weekly reviews.
- `localStorage` writes are wrapped in `saveStorageArray()` and show a user-friendly storage error instead of crashing.
- Dashboard mood/energy averages ignore invalid or missing values, preventing `NaN`.
- Imported and directly loaded daily entry dates are normalized to valid `YYYY-MM-DD` dates.
- Form-to-edit helpers now tolerate missing fields.
- Status, priority and link helpers now tolerate missing or non-string values.
- Personal/generated analytics files are ignored, and `analytics/requirements.txt` exists.

### Critical

No unresolved critical issues found in the current stability pass.

### Important

1. `Clear All Data` semantics are slightly inconsistent. It removes keys, then state sync writes empty arrays back to the same keys. User data is cleared, but keys are not truly removed.
2. Analytics workflow is manual. Users must export JSON, save/rename it as `analytics/progress_data.json`, run Python, then refresh the browser.
3. No automated tests cover CRUD, import/export, dashboard calculations, or localStorage migration.
4. Import replaces existing data immediately without a preview or confirmation step.
5. Individual delete actions do not have confirmation or undo.

### Nice to have

6. `App.jsx` is getting large and repetitive. It is still readable, but future features would benefit from shared helpers or reducers.
7. There are unused assets and optional type packages. `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/icons.svg`, `@types/react`, and `@types/react-dom` can be reviewed later.

## 11. Suggested next improvements

Do not implement these unless explicitly requested later:

- Add a simple data migration/version field to exported JSON.
- Add browser/E2E smoke tests for:
  - adding/editing/deleting entries
  - import/export
  - clear all data
  - dashboard calculations
- Add confirmation or undo for individual delete actions.
- Add URL validation for project GitHub/Deploy links.
- Add week selector to Dashboard for previous weeks.
- Add a UI note that Python charts are static files and require running the script again after data changes.
- Remove unused assets if they are not planned for future UI work.
- Consider extracting repeated CRUD patterns only if the app continues to grow.

## 12. Important code snippets

### `App.jsx`: central state and localStorage sync

```jsx
const [activeTab, setActiveTab] = useState(tabs[0].id)
const [dailyEntries, setDailyEntries] = useState(loadDailyEntries)
const [projects, setProjects] = useState(loadProjects)
const [roadmapItems, setRoadmapItems] = useState(loadRoadmapItems)
const [weeklyReviews, setWeeklyReviews] = useState(loadWeeklyReviews)

useEffect(() => {
  const error = saveStorageArray(DAILY_ENTRIES_KEY, dailyEntries)
  return error ? scheduleStorageError(error) : undefined
}, [dailyEntries])

useEffect(() => {
  const error = saveStorageArray(PROJECTS_KEY, projects)
  return error ? scheduleStorageError(error) : undefined
}, [projects])

useEffect(() => {
  const error = saveStorageArray(ROADMAP_KEY, roadmapItems)
  return error ? scheduleStorageError(error) : undefined
}, [roadmapItems])

useEffect(() => {
  const error = saveStorageArray(WEEKLY_REVIEWS_KEY, weeklyReviews)
  return error ? scheduleStorageError(error) : undefined
}, [weeklyReviews])
```

### `App.jsx`: tab rendering

```jsx
function renderTabContent() {
  if (activeTab === 'dashboard') {
    return <Dashboard entries={dailyEntries} />
  }

  if (activeTab === 'daily') {
    return (
      <DailyTracker
        entries={dailyEntries}
        form={dailyForm}
        editingId={editingDailyId}
        error={dailyError}
        onSubmit={handleDailySubmit}
        onChange={updateDailyForm}
        onCancelEdit={resetDailyForm}
        onEdit={handleEditDailyEntry}
        onDelete={handleDeleteDailyEntry}
      />
    )
  }

  // projects, roadmap, weekly follow the same conditional pattern.
}
```

### `data.js`: localStorage keys

```js
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
```

### `data.js`: daily form validation and conversion

```js
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
```

### `data.js`: import normalization

```js
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
```

### `Dashboard.jsx`: current week calculations

```jsx
const weekRange = getCurrentWeekRange()
const weekEntries = entries.filter((entry) => isEntryInWeek(entry, weekRange))
const hasWeekData = weekEntries.length > 0
const reactDays = countUniqueDoneDays(weekEntries, 'reactDone')
const projectDays = countUniqueDoneDays(weekEntries, 'projectDone')
const englishDays = countUniqueDoneDays(weekEntries, 'englishDone')
const movementDays = countUniqueDoneDays(weekEntries, 'movementDone')
const totalPomodoros = weekEntries.reduce(
  (sum, entry) => sum + Number(entry.pomodoros),
  0,
)
const averageMood = average(weekEntries, 'mood')
const averageEnergy = average(weekEntries, 'energy')
const latestMainResult = getLatestText(weekEntries, 'mainResult')
const tomorrowFocus = getLatestText(weekEntries, 'tomorrowFocus')
```

### `App.jsx`: export/import/clear logic

```jsx
function handleExportData() {
  const backupData = {
    dailyEntries,
    projects,
    roadmapItems,
    weeklyReviews,
    exportedAt: new Date().toISOString(),
  }
  const blob = new Blob([JSON.stringify(backupData, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `dev-summer-tracker-backup-${getTodayDate()}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function handleImportFile(event) {
  const file = event.target.files?.[0]

  if (!file) {
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    try {
      const importedData = normalizeImportedData(JSON.parse(reader.result))

      setDailyEntries(importedData.dailyEntries)
      setProjects(importedData.projects)
      setRoadmapItems(importedData.roadmapItems)
      setWeeklyReviews(importedData.weeklyReviews)
      resetAllForms()
      setBackupError('')
      setBackupMessage('Data imported successfully.')
    } catch {
      setBackupMessage('')
      setBackupError('Import failed. Please upload a valid backup JSON file.')
    }
  }

  reader.readAsText(file)
  event.target.value = ''
}

function handleClearAllData() {
  const confirmed = window.confirm(
    'Clear all app data? This cannot be undone. Export a backup first if needed.',
  )

  if (!confirmed) {
    return
  }

  STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
  setDailyEntries([])
  setProjects([])
  setRoadmapItems([])
  setWeeklyReviews([])
  resetAllForms()
}
```

### `analytics/generate_charts.py`: data loading and output dirs

```python
BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "progress_data.json"
CHARTS_DIR = BASE_DIR / "charts"
PUBLIC_CHARTS_DIR = BASE_DIR.parent / "public" / "charts"
OUTPUT_DIRS = [CHARTS_DIR, PUBLIC_CHARTS_DIR]

def load_data():
    if not DATA_FILE.exists():
        print(f"Missing data file: {DATA_FILE}")
        return {
            "dailyEntries": [],
            "projects": [],
            "roadmapItems": [],
            "weeklyReviews": [],
        }

    try:
        with DATA_FILE.open("r", encoding="utf-8") as file:
            data = json.load(file)
    except json.JSONDecodeError:
        print(f"Could not read JSON from: {DATA_FILE}")
        data = {}

    return {
        "dailyEntries": data.get("dailyEntries", []) or [],
        "projects": data.get("projects", []) or [],
        "roadmapItems": data.get("roadmapItems", []) or [],
        "weeklyReviews": data.get("weeklyReviews", []) or [],
    }
```

### `analytics/generate_charts.py`: chart saving

```python
def save_chart(fig, filename):
    fig.tight_layout()

    for output_dir in OUTPUT_DIRS:
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / filename
        fig.savefig(output_path, dpi=150)
        print(f"Generated {output_path}")

    plt.close(fig)
```

### `analytics/generate_charts.py`: generated charts

The script currently generates:

- `pomodoro_per_day.png`
- `weekly_pomodoro.png`
- `mood_energy_over_time.png`
- `habit_heatmap.png`
- `roadmap_progress_by_area.png`
- `project_statuses.png`

It saves each chart into:

- `analytics/charts`
- `public/charts`
