import {
  getPriorityClass,
  getStatusClass,
  normalizeLink,
  ROADMAP_STATUSES,
} from '../data.js'

function RoadmapCard({ item, onDelete, onEdit, onStatusChange }) {
  const isResourceLink =
    item.resource.startsWith('http://') ||
    item.resource.startsWith('https://') ||
    item.resource.startsWith('www.')

  return (
    <article className="roadmap-item-card">
      <div className="project-card-header">
        <div>
          <div className="badge-row">
            <span className="area-badge">{item.area}</span>
            <span className={`status-badge status-${getStatusClass(item.status)}`}>
              {item.status}
            </span>
            <span
              className={`priority-badge priority-${getPriorityClass(
                item.priority,
              )}`}
            >
              {item.priority}
            </span>
          </div>
          <h3>{item.topic}</h3>
        </div>
        <div className="entry-actions">
          <button type="button" onClick={() => onEdit(item)}>
            Edit
          </button>
          <button type="button" onClick={() => onDelete(item.id)}>
            Delete
          </button>
        </div>
      </div>

      <div className="project-meta">
        {item.resource && (
          <p>
            <strong>Resource:</strong>{' '}
            {isResourceLink ? (
              <a href={normalizeLink(item.resource)} target="_blank" rel="noreferrer">
                {item.resource}
              </a>
            ) : (
              item.resource
            )}
          </p>
        )}
        {item.notes && (
          <p>
            <strong>Notes:</strong> {item.notes}
          </p>
        )}
      </div>

      <label className="status-control">
        <span>Change status</span>
        <select
          value={item.status}
          onChange={(event) => onStatusChange(item.id, event.target.value)}
        >
          {ROADMAP_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
    </article>
  )
}

function RoadmapList({ filteredItems, items, onDelete, onEdit, onStatusChange }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h3>No roadmap items yet</h3>
        <p>Add your first learning topic with the form above.</p>
      </div>
    )
  }

  if (filteredItems.length === 0) {
    return (
      <div className="empty-state">
        <h3>No items match these filters</h3>
        <p>Change Area or Status filters to see more roadmap items.</p>
      </div>
    )
  }

  return (
    <section className="roadmap-section">
      <h3>All roadmap items</h3>
      <div className="roadmap-items-list">
        {filteredItems.map((item) => (
          <RoadmapCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </section>
  )
}

export default RoadmapList
