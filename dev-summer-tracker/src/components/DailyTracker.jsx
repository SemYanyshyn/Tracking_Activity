import DailyEntryForm from './DailyEntryForm.jsx'
import DailyEntryList from './DailyEntryList.jsx'

function DailyTracker({
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

      <DailyEntryForm
        editingId={editingId}
        error={error}
        form={form}
        onCancelEdit={onCancelEdit}
        onChange={onChange}
        onSubmit={onSubmit}
      />

      <DailyEntryList entries={entries} onEdit={onEdit} onDelete={onDelete} />
    </section>
  )
}

export default DailyTracker
