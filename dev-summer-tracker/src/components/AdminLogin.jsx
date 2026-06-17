function AdminLogin({
  authEmail,
  authError,
  authLoading,
  authMessage,
  authPassword,
  canEdit,
  isSupabaseConfigured,
  onEmailChange,
  onLogin,
  onLogout,
  onPasswordChange,
  session,
}) {
  const statusText = canEdit ? 'Admin mode' : 'Read-only mode'

  return (
    <section className="admin-section" aria-label="Admin login">
      <div className="admin-status-row">
        <p className="section-label">Access</p>
        <span className={canEdit ? 'admin-status admin' : 'admin-status readonly'}>
          {statusText}
        </span>
      </div>

      {session ? (
        <div className="admin-session">
          <p>
            Signed in as <strong>{session.user.email}</strong>
          </p>
          {!canEdit && (
            <p className="data-error">This account is not allowed to edit data.</p>
          )}
          <button
            type="button"
            className="data-button"
            disabled={authLoading}
            onClick={onLogout}
          >
            {authLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      ) : (
        <form className="admin-form" onSubmit={onLogin}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={authEmail}
              autoComplete="email"
              disabled={authLoading || !isSupabaseConfigured}
              onChange={(event) => onEmailChange(event.target.value)}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={authPassword}
              autoComplete="current-password"
              disabled={authLoading || !isSupabaseConfigured}
              onChange={(event) => onPasswordChange(event.target.value)}
            />
          </label>

          <button
            type="submit"
            className="primary-button"
            disabled={authLoading || !isSupabaseConfigured}
          >
            {authLoading ? 'Checking...' : 'Login'}
          </button>
        </form>
      )}

      {!isSupabaseConfigured && (
        <p className="data-error">Supabase env variables are not configured.</p>
      )}
      {authMessage && <p className="data-message">{authMessage}</p>}
      {authError && <p className="data-error">{authError}</p>}
    </section>
  )
}

export default AdminLogin
