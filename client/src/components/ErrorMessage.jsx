const ErrorMessage = ({ title = 'Oops, something went wrong', message, action }) => (
  <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-slate-900 shadow-sm">
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-rose-700">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-2xl">!</span>
        <div>
          <p className="text-lg font-semibold">{title}</p>
          {message && <p className="mt-1 text-sm text-rose-700">{message}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  </div>
);

export default ErrorMessage;
