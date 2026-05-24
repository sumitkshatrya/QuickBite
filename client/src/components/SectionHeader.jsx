const SectionHeader = ({ title, subtitle }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{subtitle}</p>
      <h2 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">{title}</h2>
    </div>
    <span className="text-sm text-slate-500">Swipe through the best picks for today</span>
  </div>
);

export default SectionHeader;
