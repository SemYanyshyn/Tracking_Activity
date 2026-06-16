function DataControls({
  backupError,
  backupMessage,
  importInputRef,
  storageError,
  onClear,
  onExport,
  onImportClick,
  onImportFile,
}) {
  return (
    <section className="data-section" aria-label="Data backup settings">
      <div>
        <p className="data-warning">
          Data is stored locally in this browser. Export backups regularly.
        </p>
        <p className="data-hint">
          Export your data as JSON and use it with the Python analytics script.
        </p>
        {backupMessage && <p className="data-message">{backupMessage}</p>}
        {backupError && <p className="data-error">{backupError}</p>}
        {storageError && <p className="data-error">{storageError}</p>}
      </div>
      <div className="data-actions">
        <button type="button" className="data-button" onClick={onExport}>
          Export Data
        </button>
        <button type="button" className="data-button" onClick={onImportClick}>
          Import Data
        </button>
        <button type="button" className="data-button danger" onClick={onClear}>
          Clear All Data
        </button>
        <input
          ref={importInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden-file-input"
          onChange={onImportFile}
        />
      </div>
    </section>
  )
}

export default DataControls
