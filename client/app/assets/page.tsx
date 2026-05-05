'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Heading from '../utils/Heading';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  CloudDownload, Lock, Search, ChevronLeft, ChevronRight,
  LocalFireDepartment, Download, Remove, ExpandMore,
} from '@mui/icons-material';
import {
  useGetPublishedAssetsQuery,
  useCreateAssetPaymentOrderMutation,
  usePurchaseAssetMutation,
} from '@/redux/features/assets/assetsApi';

declare global {
  interface Window { Razorpay: any; }
}

// Collapsible filter section
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-white/10 py-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-bold text-white">{title}</span>
        {open ? (
          <Remove sx={{ fontSize: 18, opacity: 0.5 }} />
        ) : (
          <ExpandMore sx={{ fontSize: 18, opacity: 0.5 }} />
        )}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default function AssetsPage() {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState('Login');
  const { user } = useSelector((state: any) => state.auth);
  const { data, isLoading, refetch } = useGetPublishedAssetsQuery({});
  const [createPaymentOrder] = useCreateAssetPaymentOrderMutation();
  const [purchaseAsset] = usePurchaseAssetMutation();

  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [paying, setPaying] = useState<string | null>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const assets: any[] = data?.assets || [];
  const trending = assets.filter((a: any) => a.isTrending);

  // Build unique categories with counts
  const categoryMap: Record<string, number> = {};
  assets.forEach((a: any) => {
    if (a.category) categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;
  });
  const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  const freeCount = assets.filter((a: any) => !a.isPaid).length;
  const paidCount = assets.filter((a: any) => a.isPaid).length;

  const filtered = assets
    .filter((a: any) => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.title?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q);
      const matchCat = selectedCategories.length === 0 || selectedCategories.includes(a.category);
      const matchPrice = priceFilter === 'all' || (priceFilter === 'free' && !a.isPaid) || (priceFilter === 'paid' && a.isPaid);
      return matchSearch && matchCat && matchPrice;
    })
    .sort((a: any, b: any) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? db - da : da - db;
    });

  useEffect(() => {
    if (trending.length <= 1) return;
    const timer = setInterval(() => setCarouselIdx((i) => (i + 1) % trending.length), 5000);
    return () => clearInterval(timer);
  }, [trending.length]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function handleDownload(asset: any, e?: React.MouseEvent) {
    e?.preventDefault(); e?.stopPropagation();
    if (!user) { setOpen(true); return; }
    setDownloading(asset._id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/get-asset-download/${asset._id}`, { credentials: 'include' });
      const json = await res.json();
      if (!json.success) { toast.error(json.message || 'Access denied'); return; }
      window.open(json.fileUrl, '_blank');
    } catch {
      toast.error('Failed to get download link');
    } finally {
      setDownloading(null);
    }
  }

  async function handlePurchase(asset: any, e?: React.MouseEvent) {
    e?.preventDefault(); e?.stopPropagation();
    if (!user) { setOpen(true); return; }
    setPaying(asset._id);
    try {
      const res: any = await createPaymentOrder(asset._id).unwrap();
      if (!res?.order) { toast.error('Failed to initiate payment'); return; }
      const options = {
        key: res.key, amount: res.order.amount, currency: res.order.currency,
        name: 'BB Edits Platform', description: asset.title, order_id: res.order.id,
        handler: async function (response: any) {
          try {
            await purchaseAsset({ id: asset._id, razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature }).unwrap();
            toast.success('Purchase successful! You can now download.');
            refetch();
          } catch (e: any) { toast.error(e?.data?.message || 'Purchase verification failed'); }
        },
        prefill: { name: user?.name || '', email: user?.email || '' },
        theme: { color: '#7c3aed' },
        modal: { ondismiss: () => setPaying(null) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      toast.error(e?.data?.message || 'Payment failed');
      setPaying(null);
    }
  }

  // Sidebar JSX (used both in desktop + mobile drawer)
  const sidebarContent = (
    <div>
      {/* Search */}
      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/60" sx={{ fontSize: 17 }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assets..."
          className="h-10 w-full rounded-xl border border-purple-500/30 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40"
        />
      </div>

      {/* Sort */}
      <FilterSection title="Sort By">
        <div className="space-y-2">
          {(['newest', 'oldest'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortOrder(s)}
              className="flex w-full items-center gap-3 text-sm"
            >
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${sortOrder === s ? 'border-purple-500 bg-purple-500' : 'border-white/30'}`}>
                {sortOrder === s && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <span className={sortOrder === s ? 'text-white font-semibold' : 'text-white/50'}>
                {s === 'newest' ? 'Newest First' : 'Oldest First'}
              </span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection title="Price">
        <div className="space-y-2">
          {([
            { key: 'all', label: 'All', count: assets.length },
            { key: 'free', label: 'Free', count: freeCount },
            { key: 'paid', label: 'Paid', count: paidCount },
          ] as const).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setPriceFilter(key)}
              className="flex w-full items-center gap-3 text-sm"
            >
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${priceFilter === key ? 'border-purple-500 bg-purple-500' : 'border-white/30'}`}>
                {priceFilter === key && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <span className={`flex-1 text-left ${priceFilter === key ? 'text-white font-semibold' : 'text-white/50'}`}>
                {label}
              </span>
              <span className="text-xs text-white/30">({count})</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Categories */}
      {categories.length > 0 && (
        <FilterSection title="Categories">
          <div className="space-y-2.5">
            {categories.map(([cat, count]) => {
              const checked = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className="flex w-full items-center gap-3 text-sm"
                >
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition ${checked ? 'border-purple-500 bg-purple-500' : 'border-white/30'}`}>
                    {checked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className={`flex-1 text-left ${checked ? 'text-white font-semibold' : 'text-white/50'}`}>{cat}</span>
                  <span className="text-xs text-white/30">({count})</span>
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Reset */}
      {(selectedCategories.length > 0 || priceFilter !== 'all' || search) && (
        <button
          onClick={() => { setSelectedCategories([]); setPriceFilter('all'); setSearch(''); }}
          className="mt-4 w-full rounded-xl border border-red-500/30 bg-red-500/10 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
        >
          Reset all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0720]">
        <Heading title="Free &amp; Premium Assets - BBEdits" description="Download free and premium design assets" keywords="Assets, Downloads, Free, Templates, Design" />
        <Header open={open} setOpen={setOpen} activeItem={0} setRoute={setRoute} route={route} />

        {/* HERO / TRENDING CAROUSEL */}
        {!isLoading && trending.length > 0 && (
          <section className="relative pt-[70px]">
            <div className="relative h-[420px] overflow-hidden sm:h-[500px] lg:h-[560px]">
              {trending.map((asset: any, idx: number) => (
                <div
                  key={asset._id}
                  className={`absolute inset-0 transition-opacity duration-700 ${idx === carouselIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  {asset.thumbnail?.url ? (
                    <img src={asset.thumbnail.url} alt={asset.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#0d0720] via-purple-950 to-[#0d0720]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
                  <div className="absolute inset-0 flex items-end pb-10 pl-6 sm:pl-12 lg:pl-20">
                    <div className="max-w-xl">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase text-white">
                          <LocalFireDepartment sx={{ fontSize: 14 }} />Trending
                        </span>
                        {asset.category && (
                          <span className="rounded-full border border-purple-400/40 px-3 py-1 text-xs font-medium text-purple-200 backdrop-blur-sm">
                            {asset.category}
                          </span>
                        )}
                      </div>
                      <h1 className="text-3xl font-black uppercase leading-none tracking-tight text-white sm:text-4xl lg:text-5xl">
                        {asset.title}
                      </h1>
                      {asset.description && (
                        <p className="mt-3 line-clamp-2 text-sm text-white/70">{asset.description}</p>
                      )}
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${asset.isPaid ? 'bg-amber-400 text-amber-950' : 'bg-emerald-500 text-white'}`}>
                          {asset.isPaid ? `₹${asset.price}` : 'FREE'}
                        </span>
                        {!asset.isPaid || asset.hasPurchased ? (
                          <button onClick={(e) => handleDownload(asset, e)} disabled={downloading === asset._id}
                            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-2.5 text-sm font-bold text-white transition hover:from-purple-700 hover:to-violet-700 disabled:opacity-60 shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                            <Download sx={{ fontSize: 17 }} />
                            {downloading === asset._id ? 'Fetching...' : 'Download Now'}
                          </button>
                        ) : (
                          <button onClick={(e) => handlePurchase(asset, e)} disabled={paying === asset._id}
                            className="flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-bold text-amber-950 transition hover:bg-amber-300 disabled:opacity-60">
                            <Lock sx={{ fontSize: 16 }} />
                            {paying === asset._id ? 'Opening...' : `Buy ₹${asset.price}`}
                          </button>
                        )}
                        <Link href={`/assets/${asset._id}`} className="rounded-full border border-purple-400/40 px-6 py-2.5 text-sm font-medium text-purple-100 backdrop-blur-sm transition hover:bg-purple-500/20">
                          View Details &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {trending.length > 1 && (
                <>
                  <button onClick={() => setCarouselIdx((i) => (i - 1 + trending.length) % trending.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-purple-600/60">
                    <ChevronLeft />
                  </button>
                  <button onClick={() => setCarouselIdx((i) => (i + 1) % trending.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-purple-600/60">
                    <ChevronRight />
                  </button>
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {trending.map((_: any, i: number) => (
                      <button key={i} onClick={() => setCarouselIdx(i)}
                        className={`h-1.5 rounded-full transition-all ${i === carouselIdx ? 'w-8 bg-purple-400' : 'w-1.5 bg-white/40'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* MAIN: sidebar + grid */}
        <main className={trending.length > 0 ? '' : 'pt-[80px]'}>
          <div className="w-full px-4 py-10 sm:px-6 lg:px-10">

            {/* Mobile: filter toggle button */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">Digital Downloads</p>
                <h2 className="text-2xl font-black uppercase text-white">All Assets</h2>
              </div>
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="rounded-xl border border-purple-500/30 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
              >
                Filters {(selectedCategories.length > 0 || priceFilter !== 'all') ? `(${selectedCategories.length + (priceFilter !== 'all' ? 1 : 0)})` : ''}
              </button>
            </div>

            {/* Mobile sidebar drawer */}
            {sidebarOpen && (
              <div className="mb-6 rounded-2xl border border-purple-500/20 bg-white/5 p-5 lg:hidden">
                {sidebarContent}
              </div>
            )}

            <div className="flex gap-8">
              {/* ── LEFT SIDEBAR (desktop) ── */}
              <aside className="hidden w-60 shrink-0 lg:block">
                <div className="sticky top-28 rounded-2xl border border-purple-500/20 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400">Filters</h2>
                    {(selectedCategories.length > 0 || priceFilter !== 'all' || search) && (
                      <button
                        onClick={() => { setSelectedCategories([]); setPriceFilter('all'); setSearch(''); }}
                        className="text-[11px] font-semibold text-red-400 hover:text-red-300"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  {sidebarContent}
                </div>
              </aside>

              {/* ── RIGHT CONTENT ── */}
              <section className="min-w-0 flex-1">
                {/* Results header */}
                <div className="mb-6 flex items-baseline gap-2">
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">Digital Downloads</p>
                    <h2 className="text-2xl font-black uppercase text-white sm:text-3xl">All Assets</h2>
                  </div>
                  {!isLoading && (
                    <span className="ml-auto text-sm text-white/40">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
                  )}
                </div>

                {/* Grid */}
                {isLoading ? (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-72 animate-pulse rounded-2xl border border-purple-500/10 bg-purple-900/20" />
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="py-24 text-center">
                    <CloudDownload sx={{ fontSize: 48 }} className="mx-auto text-purple-500/30" />
                    <p className="mt-4 text-white/30">No assets found</p>
                    <button
                      onClick={() => { setSelectedCategories([]); setPriceFilter('all'); setSearch(''); setSortOrder('newest'); }}
                      className="mt-4 text-sm font-semibold text-purple-400 hover:text-purple-300"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((asset: any) => (
                      <AssetCard
                        key={asset._id}
                        asset={asset}
                        onDownload={handleDownload}
                        onPurchase={handlePurchase}
                        isDownloading={downloading === asset._id}
                        isPaying={paying === asset._id}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>

        <Footer />
    </div>
  );
}

function AssetCard({ asset, onDownload, onPurchase, isDownloading, isPaying }: any) {
  const canDownload = !asset.isPaid || asset.hasPurchased;
  return (
    <Link href={`/assets/${asset._id}`} className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#110b2e] to-[#0d0720] border border-purple-500/20 shadow-[0_0_20px_rgba(147,51,234,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]">
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-900/30 to-violet-900/20">
        {asset.thumbnail?.url ? (
          <img src={asset.thumbnail.url} alt={asset.title} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <CloudDownload sx={{ fontSize: 44 }} className="text-purple-500/30" />
          </div>
        )}
        <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow ${asset.isPaid ? 'bg-amber-400 text-amber-950' : 'bg-emerald-500 text-white'}`}>
          {asset.isPaid ? `₹${asset.price}` : 'Free'}
        </span>
        {asset.isTrending && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-amber-400 backdrop-blur-sm">
            <LocalFireDepartment sx={{ fontSize: 12 }} />Trending
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {asset.category && (
          <span className="mb-1 text-[11px] font-bold uppercase tracking-widest text-purple-400">{asset.category}</span>
        )}
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white">{asset.title}</h3>
        {asset.description && (
          <p className="mt-1.5 line-clamp-2 text-xs text-white/40">{asset.description}</p>
        )}
        {asset.downloadCount > 0 && (
          <p className="mt-2 flex items-center gap-1 text-[11px] text-white/30">
            <Download sx={{ fontSize: 12 }} />{asset.downloadCount} downloads
          </p>
        )}
        <div className="mt-auto pt-4">
          {canDownload ? (
            <button onClick={(e) => onDownload(asset, e)} disabled={isDownloading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:from-purple-700 hover:to-violet-700 disabled:opacity-60 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <Download sx={{ fontSize: 15 }} />
              {isDownloading ? 'Fetching...' : 'Download'}
            </button>
          ) : (
            <button onClick={(e) => onPurchase(asset, e)} disabled={isPaying}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-amber-600 disabled:opacity-60">
              <Lock sx={{ fontSize: 14 }} />
              {isPaying ? 'Opening...' : `Buy ₹${asset.price}`}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
