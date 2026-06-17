import {
  getStatusClass,
  normalizeLink,
  PROJECT_STATUSES,
} from '../data.js'

function ProjectCard({ canEdit, project, onDelete, onEdit, onStatusChange }) {
  return (
    <article className="project-card">
      <div className="project-card-header">
        <div>
          <span className={`status-badge status-${getStatusClass(project.status)}`}>
            {project.status}
          </span>
          <h3>{project.name}</h3>
        </div>
        {canEdit && (
          <div className="entry-actions">
            <button type="button" onClick={() => onEdit(project)}>
              Edit
            </button>
            <button type="button" onClick={() => onDelete(project.id)}>
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="project-meta">
        {project.stack && (
          <p>
            <strong>Stack:</strong> {project.stack}
          </p>
        )}
        {project.deadline && (
          <p>
            <strong>Deadline:</strong> {project.deadline}
          </p>
        )}
        {project.nextTask && (
          <p>
            <strong>Next task:</strong> {project.nextTask}
          </p>
        )}
        {project.notes && (
          <p>
            <strong>Notes:</strong> {project.notes}
          </p>
        )}
      </div>

      <div className="project-links">
        {project.githubUrl && (
          <a
            href={normalizeLink(project.githubUrl)}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        )}
        {project.deployUrl && (
          <a
            href={normalizeLink(project.deployUrl)}
            target="_blank"
            rel="noreferrer"
          >
            Deploy
          </a>
        )}
      </div>

      {canEdit && (
        <label className="status-control">
          <span>Change status</span>
          <select
            value={project.status}
            onChange={(event) => onStatusChange(project.id, event.target.value)}
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      )}
    </article>
  )
}

function ProjectList({ canEdit, onDelete, onEdit, onStatusChange, projects }) {
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <h3>No projects yet</h3>
        <p>
          {canEdit
            ? 'Add your first portfolio project with the form above.'
            : 'No public projects are available yet.'}
        </p>
      </div>
    )
  }

  return (
    <section className="projects-section">
      <h3>All projects</h3>
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            canEdit={canEdit}
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </section>
  )
}

export default ProjectList
