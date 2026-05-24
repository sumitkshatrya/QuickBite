const Loader = ({ label = 'Loading…' }) => (
  <div className="flex min-h-[16rem] items-center justify-center rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-slate-600 shadow-sm">
    <div className="flex items-center gap-4 text-base font-semibold">
      <span className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      {label}
    </div>
  </div>
);

export default Loader;
