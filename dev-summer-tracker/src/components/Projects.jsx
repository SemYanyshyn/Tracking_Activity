import ProjectForm from './ProjectForm.jsx'
import ProjectList from './ProjectList.jsx'

function Projects({
  canEdit,
  editingId,
  error,
  form,
  onCancelEdit,
  onChange,
  onDelete,
  onEdit,
  onStatusChange,
  onSubmit,
  projects,
}) {
  return (
    <section className="projects-tracker">
      <div className="tab-heading">
        <p className="section-label">Projects</p>
        <h2>Portfolio project tracker</h2>
      </div>

      {canEdit && (
        <ProjectForm
          editingId={editingId}
          error={error}
          form={form}
          onCancelEdit={onCancelEdit}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      )}

      <ProjectList
        canEdit={canEdit}
        projects={projects}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    </section>
  )
}

export default Projects
