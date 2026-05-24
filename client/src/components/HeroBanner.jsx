import { Link } from 'react-router-dom';

const HeroBanner = () => (
  <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-4 py-8 text-white shadow-2xl sm:px-6 sm:py-12 lg:px-8">
    <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="relative z-10">
        <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.35em] text-slate-200">
          Premium delivery • curated menus
        </span>
        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Crafted meals delivered hot, fresh, and right when you want them.
        </h1>
        <p className="mt-5 max-w-2xl text-slate-300 sm:text-lg">
          Discover top-rated restaurants, chef-curated dishes, and exclusive offers for your next delicious order.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Order Now
          </Link>
          <Link
            to="/restaurants"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm text-slate-100 transition hover:bg-white/20"
          >
            Explore Restaurants
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { value: '20min', label: 'Avg Delivery' },
            { value: '4.9/5', label: 'Top rated' },
            { value: '120+', label: 'Restaurant partners' },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 px-4 py-4 shadow-lg backdrop-blur-sm sm:px-5">
              <p className="text-2xl font-semibold text-white">{item.value}</p>
              <p className="mt-1 text-sm text-slate-300">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -right-10 top-1/3 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-[-1rem] h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1555992336-03a23c13fdb8?auto=format&fit=crop&w=1200&q=80"
            alt="Gourmet food delivery"
            loading="lazy"
            className="h-full min-h-[280px] w-full object-cover sm:min-h-[420px]"
          />
          <div className="absolute left-5 top-5 rounded-3xl bg-white/90 px-4 py-3 text-slate-950 shadow-xl backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Featured restaurant</p>
            <p className="mt-2 font-semibold">The Spice Atelier</p>
          </div>
          <div className="absolute bottom-5 left-5 flex gap-3">
            <div className="rounded-3xl bg-white/95 px-4 py-3 text-slate-950 shadow-xl backdrop-blur-sm">
              <p className="text-sm font-semibold">Chef special</p>
              <p className="text-xs text-slate-500">Premium bowls</p>
            </div>
            <div className="rounded-3xl bg-slate-900/95 px-4 py-3 text-white shadow-xl backdrop-blur-sm">
              <p className="text-sm font-semibold">30% off</p>
              <p className="text-xs text-slate-300">on your first order</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroBanner;
