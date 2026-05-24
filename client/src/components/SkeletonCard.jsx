const SkeletonCard = () => (
  <div className="animate-pulse overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
    <div className="h-52 w-full rounded-[1.5rem] bg-slate-200" />
    <div className="mt-5 space-y-3">
      <div className="h-5 w-3/4 rounded-full bg-slate-200" />
      <div className="h-4 w-1/2 rounded-full bg-slate-200" />
      <div className="flex flex-wrap gap-2">
        <span className="h-8 w-20 rounded-full bg-slate-200" />
        <span className="h-8 w-16 rounded-full bg-slate-200" />
        <span className="h-8 w-24 rounded-full bg-slate-200" />
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="h-8 w-24 rounded-full bg-slate-200" />
        <div className="h-10 w-24 rounded-full bg-slate-200" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
