function DailyEntryForm({
  editingId,
  error,
  form,
  onCancelEdit,
  onChange,
  onSubmit,
}) {
  return (
    <form className="daily-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label className="field">
          <span>Date</span>
          <input
            type="date"
            value={form.date}
            onChange={(event) => onChange('date', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Pomodoro count</span>
          <input
            type="number"
            min="0"
            value={form.pomodoros}
            onChange={(event) => onChange('pomodoros', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Mood</span>
          <input
            type="number"
            min="1"
            max="10"
            value={form.mood}
            onChange={(event) => onChange('mood', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Energy</span>
          <input
            type="number"
            min="1"
            max="10"
            value={form.energy}
            onChange={(event) => onChange('energy', event.target.value)}
          />
        </label>
      </div>

      <div className="checkbox-grid">
        <label>
          <input
            type="checkbox"
            checked={form.reactDone}
            onChange={(event) => onChange('reactDone', event.target.checked)}
          />
          React done
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.projectDone}
            onChange={(event) => onChange('projectDone', event.target.checked)}
          />
          Pet Project done
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.englishDone}
            onChange={(event) => onChange('englishDone', event.target.checked)}
          />
          English done
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.movementDone}
            onChange={(event) => onChange('movementDone', event.target.checked)}
          />
          Gym or Walk done
        </label>
      </div>

      <div className="form-grid wide">
        <label className="field">
          <span>Main result</span>
          <input
            type="text"
            value={form.mainResult}
            placeholder="What was the main result today?"
            onChange={(event) => onChange('mainResult', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Tomorrow focus</span>
          <input
            type="text"
            value={form.tomorrowFocus}
            placeholder="What should be first tomorrow?"
            onChange={(event) => onChange('tomorrowFocus', event.target.value)}
          />
        </label>
      </div>

      <label className="field">
        <span>Notes</span>
        <textarea
          rows="4"
          value={form.notes}
          placeholder="Extra thoughts, blockers, ideas..."
          onChange={(event) => onChange('notes', event.target.value)}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="primary-button">
          {editingId ? 'Save changes' : 'Add daily entry'}
        </button>
        {editingId && (
          <button
            type="button"
            className="secondary-button"
            onClick={onCancelEdit}
          >
            Cancel edit
          </button>
        )}
      </div>
    </form>
  )
}

export default DailyEntryForm
