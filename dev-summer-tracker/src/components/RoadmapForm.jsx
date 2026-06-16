import {
  ROADMAP_AREAS,
  ROADMAP_PRIORITIES,
  ROADMAP_STATUSES,
} from '../data.js'

function RoadmapForm({
  editingId,
  error,
  form,
  onCancelEdit,
  onChange,
  onSubmit,
}) {
  return (
    <form className="daily-form roadmap-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label className="field">
          <span>Area</span>
          <select
            value={form.area}
            onChange={(event) => onChange('area', event.target.value)}
          >
            {ROADMAP_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Topic</span>
          <input
            type="text"
            value={form.topic}
            placeholder="Example: React useEffect"
            onChange={(event) => onChange('topic', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Status</span>
          <select
            value={form.status}
            onChange={(event) => onChange('status', event.target.value)}
          >
            {ROADMAP_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Priority</span>
          <select
            value={form.priority}
            onChange={(event) => onChange('priority', event.target.value)}
          >
            {ROADMAP_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>Resource</span>
        <input
          type="text"
          value={form.resource}
          placeholder="Docs, course, article, video..."
          onChange={(event) => onChange('resource', event.target.value)}
        />
      </label>

      <label className="field">
        <span>Notes</span>
        <textarea
          rows="4"
          value={form.notes}
          placeholder="What to repeat, blockers, examples to build..."
          onChange={(event) => onChange('notes', event.target.value)}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="primary-button">
          {editingId ? 'Save roadmap item' : 'Add roadmap item'}
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

export default RoadmapForm
