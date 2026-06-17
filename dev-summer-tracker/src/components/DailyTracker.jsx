import DailyEntryForm from './DailyEntryForm.jsx'
import DailyEntryList from './DailyEntryList.jsx'

function DailyTracker({
  canEdit,
  editingId,
  entries,
  error,
  form,
  onCancelEdit,
  onChange,
  onDelete,
  onEdit,
  onSubmit,
}) {
  return (
    <section className="daily-tracker">
      <div className="tab-heading">
        <p className="section-label">Daily Tracker</p>
        <h2>Daily progress form</h2>
      </div>

      {canEdit && (
        <DailyEntryForm
          editingId={editingId}
          error={error}
          form={form}
          onCancelEdit={onCancelEdit}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      )}

      <DailyEntryList
        canEdit={canEdit}
        entries={entries}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </section>
  )
}

export default DailyTracker
