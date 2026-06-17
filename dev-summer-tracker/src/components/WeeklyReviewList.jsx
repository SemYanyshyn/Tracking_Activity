import { getWeeklyAverage, WEEKLY_SCORE_FIELDS } from '../data.js'

function WeeklyReviewList({ canEdit, onDelete, onEdit, reviews }) {
  if (reviews.length === 0) {
    return (
      <div className="empty-state">
        <h3>No weekly reviews yet</h3>
        <p>
          {canEdit
            ? 'Add your first Sunday review with the form above.'
            : 'No public weekly reviews are available yet.'}
        </p>
      </div>
    )
  }

  return (
    <section className="weekly-reviews-section">
      <h3>Previous weekly reviews</h3>
      <div className="weekly-reviews-list">
        {reviews.map((review) => (
          <article className="weekly-review-card" key={review.id}>
            <div className="entry-header">
              <div>
                <h4>{review.weekRange || 'Untitled week'}</h4>
                <p>Average score: {getWeeklyAverage(review)}/10</p>
              </div>
              {canEdit && (
                <div className="entry-actions">
                  <button type="button" onClick={() => onEdit(review)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => onDelete(review.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>

            <ul className="score-list">
              {WEEKLY_SCORE_FIELDS.map((field) => (
                <li key={field.id}>
                  <span>{field.label.replace(' score', '')}</span>
                  <strong>{review[field.id]}/10</strong>
                </li>
              ))}
            </ul>

            <div className="weekly-review-notes">
              {review.bestResult && (
                <p>
                  <strong>Best result:</strong> {review.bestResult}
                </p>
              )}
              {review.mainProblem && (
                <p>
                  <strong>Main problem:</strong> {review.mainProblem}
                </p>
              )}
              {review.nextFocus && (
                <p>
                  <strong>Next focus:</strong> {review.nextFocus}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WeeklyReviewList
