const CategoryCard = ({ category }) => (
  <div className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5">
    <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-lg transition group-hover:bg-slate-800">
      {category.icon}
    </div>
    <h3 className="mt-6 text-xl font-semibold text-slate-900">{category.name}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
  </div>
);

export default CategoryCard;
