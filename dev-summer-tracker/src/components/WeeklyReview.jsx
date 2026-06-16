import WeeklyReviewForm from './WeeklyReviewForm.jsx'
import WeeklyReviewList from './WeeklyReviewList.jsx'

function WeeklyReview({
  editingId,
  error,
  form,
  onCancelEdit,
  onChange,
  onDelete,
  onEdit,
  onSubmit,
  reviews,
}) {
  return (
    <section className="weekly-review-tracker">
      <div className="tab-heading">
        <p className="section-label">Weekly Review</p>
        <h2>Sunday planning review</h2>
      </div>

      <article className="sunday-card">
        <p className="section-label">Sunday planning</p>
        <h3>Review the week, choose the next focus, and protect recovery.</h3>
      </article>

      <WeeklyReviewForm
        editingId={editingId}
        error={error}
        form={form}
        onCancelEdit={onCancelEdit}
        onChange={onChange}
        onSubmit={onSubmit}
      />

      <WeeklyReviewList reviews={reviews} onEdit={onEdit} onDelete={onDelete} />
    </section>
  )
}

export default WeeklyReview
