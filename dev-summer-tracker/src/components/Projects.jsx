import ProjectForm from './ProjectForm.jsx'
import ProjectList from './ProjectList.jsx'

function Projects({
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

      <ProjectForm
        editingId={editingId}
        error={error}
        form={form}
        onCancelEdit={onCancelEdit}
        onChange={onChange}
        onSubmit={onSubmit}
      />

      <ProjectList
        projects={projects}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    </section>
  )
}

export default Projects
