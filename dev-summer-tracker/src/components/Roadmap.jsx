import { useState } from 'react'
import { ROADMAP_AREAS, ROADMAP_STATUSES } from '../data.js'
import RoadmapForm from './RoadmapForm.jsx'
import RoadmapList from './RoadmapList.jsx'

function Roadmap({
  editingId,
  error,
  form,
  items,
  onCancelEdit,
  onChange,
  onDelete,
  onEdit,
  onStatusChange,
  onSubmit,
}) {
  const [areaFilter, setAreaFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const doneItems = items.filter((item) => item.status === 'Done').length
  const progress = items.length === 0 ? 0 : Math.round((doneItems / items.length) * 100)
  const filteredItems = items.filter((item) => {
    const areaMatches = areaFilter === 'All' || item.area === areaFilter
    const statusMatches = statusFilter === 'All' || item.status === statusFilter
    return areaMatches && statusMatches
  })

  return (
    <section className="roadmap-tracker">
      <div className="tab-heading">
        <p className="section-label">Roadmap</p>
        <h2>Learning roadmap tracker</h2>
      </div>

      <article className="roadmap-progress">
        <div>
          <p className="section-label">Progress</p>
          <h3>{progress}% complete</h3>
          <span>
            {doneItems} of {items.length} topics done
          </span>
        </div>
        <div className="progress-bar" aria-label="Roadmap progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      </article>

      <RoadmapForm
        editingId={editingId}
        error={error}
        form={form}
        onCancelEdit={onCancelEdit}
        onChange={onChange}
        onSubmit={onSubmit}
      />

      <div className="filters-row">
        <label className="field">
          <span>Filter by Area</span>
          <select
            value={areaFilter}
            onChange={(event) => setAreaFilter(event.target.value)}
          >
            <option value="All">All Areas</option>
            {ROADMAP_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Filter by Status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Statuses</option>
            {ROADMAP_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <RoadmapList
        items={items}
        filteredItems={filteredItems}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    </section>
  )
}

export default Roadmap
