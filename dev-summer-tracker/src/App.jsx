import { useEffect, useRef, useState } from 'react'
import './App.css'
import {
  clearDailyEntriesFromSupabase,
  deleteDailyEntryFromSupabase,
  loadDailyEntriesFromSupabase,
  saveDailyEntryToSupabase,
  syncDailyEntriesToSupabase,
} from './dailyEntriesApi.js'
import Dashboard from './components/Dashboard.jsx'
import DailyTracker from './components/DailyTracker.jsx'
import Header from './components/Header.jsx'
import Projects from './components/Projects.jsx'
import Roadmap from './components/Roadmap.jsx'
import Tabs from './components/Tabs.jsx'
import WeeklyReview from './components/WeeklyReview.jsx'
import {
  createEmptyForm,
  createEmptyProjectForm,
  createEmptyRoadmapForm,
  createEmptyWeeklyReviewForm,
  DAILY_ENTRIES_KEY,
  entryToForm,
  formToEntry,
  getTodayDate,
  loadDailyEntries,
  loadProjects,
  loadRoadmapItems,
  loadWeeklyReviews,
  normalizeImportedData,
  projectFormToItem,
  projectToForm,
  PROJECTS_KEY,
  ROADMAP_KEY,
  roadmapFormToItem,
  roadmapItemToForm,
  saveStorageArray,
  STORAGE_KEYS,
  tabs,
  validateForm,
  validateProjectForm,
  validateRoadmapForm,
  validateWeeklyReviewForm,
  weeklyReviewFormToItem,
  weeklyReviewToForm,
  WEEKLY_REVIEWS_KEY,
} from './data.js'

function App() {
  const importInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [dailyEntries, setDailyEntries] = useState(loadDailyEntries)
  const initialDailyEntriesRef = useRef(dailyEntries)
  const [dailyForm, setDailyForm] = useState(createEmptyForm)
  const [editingDailyId, setEditingDailyId] = useState(null)
  const [dailyError, setDailyError] = useState('')
  const [projects, setProjects] = useState(loadProjects)
  const [projectForm, setProjectForm] = useState(createEmptyProjectForm)
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [projectError, setProjectError] = useState('')
  const [roadmapItems, setRoadmapItems] = useState(loadRoadmapItems)
  const [roadmapForm, setRoadmapForm] = useState(createEmptyRoadmapForm)
  const [editingRoadmapId, setEditingRoadmapId] = useState(null)
  const [roadmapError, setRoadmapError] = useState('')
  const [weeklyReviews, setWeeklyReviews] = useState(loadWeeklyReviews)
  const [weeklyReviewForm, setWeeklyReviewForm] = useState(
    createEmptyWeeklyReviewForm,
  )
  const [editingWeeklyReviewId, setEditingWeeklyReviewId] = useState(null)
  const [weeklyReviewError, setWeeklyReviewError] = useState('')
  const [backupMessage, setBackupMessage] = useState('')
  const [backupError, setBackupError] = useState('')
  const [storageError, setStorageError] = useState('')
  const [syncMessage, setSyncMessage] = useState('')
  const [syncError, setSyncError] = useState('')
  const currentTab = tabs.find((tab) => tab.id === activeTab)

  function scheduleStorageError(error) {
    const timeoutId = window.setTimeout(() => setStorageError(error), 0)
    return () => window.clearTimeout(timeoutId)
  }

  useEffect(() => {
    const error = saveStorageArray(DAILY_ENTRIES_KEY, dailyEntries)
    return error ? scheduleStorageError(error) : undefined
  }, [dailyEntries])

  useEffect(() => {
    let shouldUpdate = true

    async function loadCloudDailyEntries() {
      const {
        data,
        error: supabaseError,
        skipped,
      } = await loadDailyEntriesFromSupabase()

      if (!shouldUpdate || skipped) {
        return
      }

      if (supabaseError) {
        setSyncError('Could not load Daily Tracker records from Supabase.')
        return
      }

      if (data.length === 0 && initialDailyEntriesRef.current.length > 0) {
        const syncResult = await syncDailyEntriesToSupabase(
          initialDailyEntriesRef.current,
        )

        if (syncResult.error) {
          setSyncError('Could not upload local Daily Tracker records to Supabase.')
          return
        }

        setSyncError('')
        setSyncMessage('Local Daily Tracker records uploaded to Supabase.')
        return
      }

      setDailyEntries(data)
      setSyncError('')
      setSyncMessage('Daily Tracker synced from Supabase.')
    }

    loadCloudDailyEntries()

    return () => {
      shouldUpdate = false
    }
  }, [])

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

  function updateDailyForm(field, value) {
    setDailyForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  function resetDailyForm() {
    setDailyForm(createEmptyForm())
    setEditingDailyId(null)
    setDailyError('')
  }

  async function handleDailySubmit(event) {
    event.preventDefault()

    const error = validateForm(dailyForm)

    if (error) {
      setDailyError(error)
      return
    }

    const nextEntry = formToEntry(dailyForm, editingDailyId)

    setDailyEntries((entries) => {
      if (!editingDailyId) {
        return [nextEntry, ...entries]
      }

      return entries.map((entry) =>
        entry.id === editingDailyId ? nextEntry : entry,
      )
    })

    resetDailyForm()

    const { error: supabaseError, skipped } =
      await saveDailyEntryToSupabase(nextEntry)

    if (skipped) {
      return
    }

    if (supabaseError) {
      setSyncMessage('')
      setSyncError('Could not save this daily entry to Supabase.')
      return
    }

    setSyncError('')
    setSyncMessage('Daily entry synced to Supabase.')
  }

  function handleEditDailyEntry(entry) {
    setDailyForm(entryToForm(entry))
    setEditingDailyId(entry.id)
    setDailyError('')
    setActiveTab('daily')
  }

  async function handleDeleteDailyEntry(entryId) {
    setDailyEntries((entries) => entries.filter((entry) => entry.id !== entryId))

    if (editingDailyId === entryId) {
      resetDailyForm()
    }

    const { error: supabaseError, skipped } =
      await deleteDailyEntryFromSupabase(entryId)

    if (skipped) {
      return
    }

    if (supabaseError) {
      setSyncMessage('')
      setSyncError('Could not delete this daily entry from Supabase.')
      return
    }

    setSyncError('')
    setSyncMessage('Daily entry deleted from Supabase.')
  }

  function updateProjectForm(field, value) {
    setProjectForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  function resetProjectForm() {
    setProjectForm(createEmptyProjectForm())
    setEditingProjectId(null)
    setProjectError('')
  }

  function handleProjectSubmit(event) {
    event.preventDefault()

    const error = validateProjectForm(projectForm)

    if (error) {
      setProjectError(error)
      return
    }

    const nextProject = projectFormToItem(projectForm, editingProjectId)

    setProjects((currentProjects) => {
      if (!editingProjectId) {
        return [nextProject, ...currentProjects]
      }

      return currentProjects.map((project) =>
        project.id === editingProjectId ? nextProject : project,
      )
    })

    resetProjectForm()
  }

  function handleEditProject(project) {
    setProjectForm(projectToForm(project))
    setEditingProjectId(project.id)
    setProjectError('')
    setActiveTab('projects')
  }

  function handleDeleteProject(projectId) {
    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== projectId),
    )

    if (editingProjectId === projectId) {
      resetProjectForm()
    }
  }

  function handleChangeProjectStatus(projectId, status) {
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === projectId ? { ...project, status } : project,
      ),
    )
  }

  function updateRoadmapForm(field, value) {
    setRoadmapForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  function resetRoadmapForm() {
    setRoadmapForm(createEmptyRoadmapForm())
    setEditingRoadmapId(null)
    setRoadmapError('')
  }

  function handleRoadmapSubmit(event) {
    event.preventDefault()

    const error = validateRoadmapForm(roadmapForm)

    if (error) {
      setRoadmapError(error)
      return
    }

    const nextItem = roadmapFormToItem(roadmapForm, editingRoadmapId)

    setRoadmapItems((items) => {
      if (!editingRoadmapId) {
        return [nextItem, ...items]
      }

      return items.map((item) =>
        item.id === editingRoadmapId ? nextItem : item,
      )
    })

    resetRoadmapForm()
  }

  function handleEditRoadmapItem(item) {
    setRoadmapForm(roadmapItemToForm(item))
    setEditingRoadmapId(item.id)
    setRoadmapError('')
    setActiveTab('roadmap')
  }

  function handleDeleteRoadmapItem(itemId) {
    setRoadmapItems((items) => items.filter((item) => item.id !== itemId))

    if (editingRoadmapId === itemId) {
      resetRoadmapForm()
    }
  }

  function handleChangeRoadmapStatus(itemId, status) {
    setRoadmapItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, status } : item)),
    )
  }

  function updateWeeklyReviewForm(field, value) {
    setWeeklyReviewForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  function resetWeeklyReviewForm() {
    setWeeklyReviewForm(createEmptyWeeklyReviewForm())
    setEditingWeeklyReviewId(null)
    setWeeklyReviewError('')
  }

  function handleWeeklyReviewSubmit(event) {
    event.preventDefault()

    const error = validateWeeklyReviewForm(weeklyReviewForm)

    if (error) {
      setWeeklyReviewError(error)
      return
    }

    const nextReview = weeklyReviewFormToItem(
      weeklyReviewForm,
      editingWeeklyReviewId,
    )

    setWeeklyReviews((reviews) => {
      if (!editingWeeklyReviewId) {
        return [nextReview, ...reviews]
      }

      return reviews.map((review) =>
        review.id === editingWeeklyReviewId ? nextReview : review,
      )
    })

    resetWeeklyReviewForm()
  }

  function handleEditWeeklyReview(review) {
    setWeeklyReviewForm(weeklyReviewToForm(review))
    setEditingWeeklyReviewId(review.id)
    setWeeklyReviewError('')
    setActiveTab('weekly')
  }

  function handleDeleteWeeklyReview(reviewId) {
    setWeeklyReviews((reviews) =>
      reviews.filter((review) => review.id !== reviewId),
    )

    if (editingWeeklyReviewId === reviewId) {
      resetWeeklyReviewForm()
    }
  }

  function resetAllForms() {
    resetDailyForm()
    resetProjectForm()
    resetRoadmapForm()
    resetWeeklyReviewForm()
  }

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
    setBackupError('')
    setBackupMessage('Data exported as JSON backup.')
  }

  function handleImportClick() {
    importInputRef.current?.click()
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
        setStorageError('')
        setBackupMessage('Data imported successfully.')

        syncDailyEntriesToSupabase(importedData.dailyEntries).then(
          ({ error, skipped }) => {
            if (skipped) {
              return
            }

            if (error) {
              setSyncMessage('')
              setSyncError('Imported daily entries could not sync to Supabase.')
              return
            }

            setSyncError('')
            setSyncMessage('Imported daily entries synced to Supabase.')
          },
        )
      } catch {
        setBackupMessage('')
        setBackupError('Import failed. Please upload a valid backup JSON file.')
      }
    }

    reader.onerror = () => {
      setBackupMessage('')
      setBackupError('Import failed. Could not read this file.')
    }

    reader.readAsText(file)
    event.target.value = ''
  }

  async function handleClearAllData() {
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
    setBackupError('')
    setStorageError('')
    setBackupMessage('All local app data was cleared.')

    const { error: supabaseError, skipped } =
      await clearDailyEntriesFromSupabase()

    if (skipped) {
      return
    }

    if (supabaseError) {
      setSyncMessage('')
      setSyncError('Could not clear Daily Tracker records from Supabase.')
      return
    }

    setSyncError('')
    setSyncMessage('Daily Tracker records were cleared from Supabase.')
  }

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

    if (activeTab === 'projects') {
      return (
        <Projects
          projects={projects}
          form={projectForm}
          editingId={editingProjectId}
          error={projectError}
          onSubmit={handleProjectSubmit}
          onChange={updateProjectForm}
          onCancelEdit={resetProjectForm}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onStatusChange={handleChangeProjectStatus}
        />
      )
    }

    if (activeTab === 'roadmap') {
      return (
        <Roadmap
          items={roadmapItems}
          form={roadmapForm}
          editingId={editingRoadmapId}
          error={roadmapError}
          onSubmit={handleRoadmapSubmit}
          onChange={updateRoadmapForm}
          onCancelEdit={resetRoadmapForm}
          onEdit={handleEditRoadmapItem}
          onDelete={handleDeleteRoadmapItem}
          onStatusChange={handleChangeRoadmapStatus}
        />
      )
    }

    if (activeTab === 'weekly') {
      return (
        <WeeklyReview
          reviews={weeklyReviews}
          form={weeklyReviewForm}
          editingId={editingWeeklyReviewId}
          error={weeklyReviewError}
          onSubmit={handleWeeklyReviewSubmit}
          onChange={updateWeeklyReviewForm}
          onCancelEdit={resetWeeklyReviewForm}
          onEdit={handleEditWeeklyReview}
          onDelete={handleDeleteWeeklyReview}
        />
      )
    }

    return (
      <>
        <p className="section-label">{currentTab.label}</p>
        <h2>{currentTab.title}</h2>
        <p className="placeholder-text">
          This section is ready for the next implementation step.
        </p>
      </>
    )
  }

  return (
    <div className="app-shell">
      <Header
        backupError={backupError}
        backupMessage={backupMessage}
        importInputRef={importInputRef}
        storageError={storageError}
        syncError={syncError}
        syncMessage={syncMessage}
        onClear={handleClearAllData}
        onExport={handleExportData}
        onImportClick={handleImportClick}
        onImportFile={handleImportFile}
      />

      <Tabs activeTab={activeTab} tabs={tabs} onChange={setActiveTab} />

      <main className="content-panel">{renderTabContent()}</main>
    </div>
  )
}

export default App
