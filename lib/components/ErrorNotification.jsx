function ErrorNotification() {
  return (
    <div className="card mb-3 mt-3" style={{ width: '100%' }}>
      <div className="card-header text-white bg-danger">Error</div>
      <div className="card-body">
        <p className="card-text">An unexpected error occurred. Contact support if this issue continues.</p>
      </div>
    </div>
  );
}

export default ErrorNotification;
