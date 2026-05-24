const OfferCard = ({ offer }) => (
  <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-6">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{offer.tag}</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-950">{offer.title}</h3>
      </div>
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500 shadow-sm">
        {offer.icon}
      </div>
    </div>
    <p className="mt-5 text-sm leading-6 text-slate-600">{offer.description}</p>
    <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-slate-900">
      <span>{offer.button}</span>
      <span className="text-rose-500">→</span>
    </div>
  </div>
);

export default OfferCard;
