import { WEEKLY_SCORE_FIELDS } from '../data.js'

function WeeklyReviewForm({
  editingId,
  error,
  form,
  onCancelEdit,
  onChange,
  onSubmit,
}) {
  return (
    <form className="daily-form weekly-review-form" onSubmit={onSubmit}>
      <label className="field">
        <span>Week range</span>
        <input
          type="text"
          value={form.weekRange}
          placeholder="2026-06-15 - 2026-06-21"
          onChange={(event) => onChange('weekRange', event.target.value)}
        />
      </label>

      <div className="review-text-grid">
        <label className="field">
          <span>Best result</span>
          <textarea
            rows="3"
            value={form.bestResult}
            placeholder="What moved you forward most?"
            onChange={(event) => onChange('bestResult', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Main problem</span>
          <textarea
            rows="3"
            value={form.mainProblem}
            placeholder="What blocked or slowed progress?"
            onChange={(event) => onChange('mainProblem', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Next focus</span>
          <textarea
            rows="3"
            value={form.nextFocus}
            placeholder="What should get priority next week?"
            onChange={(event) => onChange('nextFocus', event.target.value)}
          />
        </label>
      </div>

      <div className="score-grid">
        {WEEKLY_SCORE_FIELDS.map((field) => (
          <label className="field" key={field.id}>
            <span>{field.label}</span>
            <input
              type="number"
              min="1"
              max="10"
              value={form[field.id]}
              onChange={(event) => onChange(field.id, event.target.value)}
            />
          </label>
        ))}
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="primary-button">
          {editingId ? 'Save review' : 'Add weekly review'}
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

export default WeeklyReviewForm
