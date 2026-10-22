export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-center my-3">
      <span>{message}</span>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  )
}
