import { PROJECT_STATUSES } from '../data.js'

function ProjectForm({
  editingId,
  error,
  form,
  onCancelEdit,
  onChange,
  onSubmit,
}) {
  return (
    <form className="daily-form project-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label className="field">
          <span>Project name</span>
          <input
            type="text"
            value={form.name}
            placeholder="Example: Dev Summer Tracker"
            onChange={(event) => onChange('name', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Status</span>
          <select
            value={form.status}
            onChange={(event) => onChange('status', event.target.value)}
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Stack</span>
          <input
            type="text"
            value={form.stack}
            placeholder="React, Vite, CSS"
            onChange={(event) => onChange('stack', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Deadline</span>
          <input
            type="date"
            value={form.deadline}
            onChange={(event) => onChange('deadline', event.target.value)}
          />
        </label>
      </div>

      <div className="form-grid wide">
        <label className="field">
          <span>GitHub URL</span>
          <input
            type="text"
            value={form.githubUrl}
            placeholder="https://github.com/..."
            onChange={(event) => onChange('githubUrl', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Deploy URL</span>
          <input
            type="text"
            value={form.deployUrl}
            placeholder="https://..."
            onChange={(event) => onChange('deployUrl', event.target.value)}
          />
        </label>
      </div>

      <label className="field">
        <span>Next task</span>
        <input
          type="text"
          value={form.nextTask}
          placeholder="What is the next concrete step?"
          onChange={(event) => onChange('nextTask', event.target.value)}
        />
      </label>

      <label className="field">
        <span>Notes</span>
        <textarea
          rows="4"
          value={form.notes}
          placeholder="Ideas, blockers, decisions..."
          onChange={(event) => onChange('notes', event.target.value)}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="primary-button">
          {editingId ? 'Save project' : 'Add project'}
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

export default ProjectForm
