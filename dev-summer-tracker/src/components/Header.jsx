import AdminLogin from './AdminLogin.jsx'
import DataControls from './DataControls.jsx'

function Header({
  authEmail,
  authError,
  authLoading,
  authMessage,
  authPassword,
  backupError,
  backupMessage,
  canEdit,
  importInputRef,
  isSupabaseConfigured,
  session,
  storageError,
  syncError,
  syncMessage,
  onClear,
  onEmailChange,
  onExport,
  onImportClick,
  onImportFile,
  onLogin,
  onLogout,
  onPasswordChange,
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
      <div className="header-side">
        <AdminLogin
          authEmail={authEmail}
          authError={authError}
          authLoading={authLoading}
          authMessage={authMessage}
          authPassword={authPassword}
          canEdit={canEdit}
          isSupabaseConfigured={isSupabaseConfigured}
          session={session}
          onEmailChange={onEmailChange}
          onLogin={onLogin}
          onLogout={onLogout}
          onPasswordChange={onPasswordChange}
        />
        <DataControls
          backupError={backupError}
          backupMessage={backupMessage}
          canEdit={canEdit}
          importInputRef={importInputRef}
          storageError={storageError}
          syncError={syncError}
          syncMessage={syncMessage}
          onClear={onClear}
          onExport={onExport}
          onImportClick={onImportClick}
          onImportFile={onImportFile}
        />
      </div>
    </header>
  )
}

export default Header
