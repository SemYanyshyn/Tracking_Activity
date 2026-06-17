function DailyEntryList({ canEdit, entries, onDelete, onEdit }) {
  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <h3>No daily entries yet</h3>
        <p>
          {canEdit
            ? 'Add your first progress record with the form above.'
            : 'No public daily entries are available yet.'}
        </p>
      </div>
    )
  }

  return (
    <section className="entries-section">
      <h3>Daily entries</h3>
      <div className="entries-list">
        {entries.map((entry) => (
          <article className="entry-card" key={entry.id}>
            <div className="entry-header">
              <div>
                <h4>{entry.date}</h4>
                <p>
                  {entry.pomodoros} pomodoros · mood {entry.mood}/10 · energy{' '}
                  {entry.energy}/10
                </p>
              </div>
              {canEdit && (
                <div className="entry-actions">
                  <button type="button" onClick={() => onEdit(entry)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => onDelete(entry.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>

            <ul className="done-list">
              <li className={entry.reactDone ? 'done' : ''}>React</li>
              <li className={entry.projectDone ? 'done' : ''}>Pet Project</li>
              <li className={entry.englishDone ? 'done' : ''}>English</li>
              <li className={entry.movementDone ? 'done' : ''}>Gym / Walk</li>
            </ul>

            {entry.mainResult && (
              <p>
                <strong>Main result:</strong> {entry.mainResult}
              </p>
            )}
            {entry.tomorrowFocus && (
              <p>
                <strong>Tomorrow focus:</strong> {entry.tomorrowFocus}
              </p>
            )}
            {entry.notes && (
              <p>
                <strong>Notes:</strong> {entry.notes}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default DailyEntryList
