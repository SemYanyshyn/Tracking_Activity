import DataControls from './DataControls.jsx'

function Header({
  backupError,
  backupMessage,
  importInputRef,
  storageError,
  syncError,
  syncMessage,
  onClear,
  onExport,
  onImportClick,
  onImportFile,
}) {
  return (
    <header className="app-header">
      <div>
        <p className="app-kicker">Personal summer progress tracker</p>
        <h1>Dev Summer Tracker</h1>
        <p className="app-subtitle">
          Track learning, projects, health, reviews, and job preparation.
        </p>
      </div>
      <DataControls
        backupError={backupError}
        backupMessage={backupMessage}
        importInputRef={importInputRef}
        storageError={storageError}
        syncError={syncError}
        syncMessage={syncMessage}
        onClear={onClear}
        onExport={onExport}
        onImportClick={onImportClick}
        onImportFile={onImportFile}
      />
    </header>
  )
}

export default Header
