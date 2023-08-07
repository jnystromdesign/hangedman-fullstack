export const AppError = (props: {
  appError: string | false;
  refreshApp: () => void;
}) => {
  const { appError, refreshApp } = props;
  return appError ? (
    <div className="dialog dialog--error">
      <h2>We encountered a problem</h2>
      <p>{appError} </p>
      <button onClick={refreshApp}>Refresh app to try to fix it</button>
    </div>
  ) : null;
};
