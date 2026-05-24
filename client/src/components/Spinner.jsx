const Spinner = ({ size = 'md', label = 'Loading' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`inline-block animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 ${sizeClasses[size]}`} />
      {label && <span className="text-sm font-semibold text-slate-700">{label}</span>}
    </div>
  );
};

export default Spinner;
