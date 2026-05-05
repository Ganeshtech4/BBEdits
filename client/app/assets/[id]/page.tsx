'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Protected from '../../hooks/useProtected';
import Heading from '../../utils/Heading';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  CloudDownload, Lock, ArrowBack, LocalFireDepartment,
  Download, ChevronLeft, ChevronRight, Tag, Category, Share,
} from '@mui/icons-material';
import {
  useGetPublishedAssetByIdQuery,
  useCreateAssetPaymentOrderMutation,
  usePurchaseAssetMutation,
} from '@/redux/features/assets/assetsApi';

declare global {
  interface Window { Razorpay: any; }
}

export default function AssetDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState('Login');
  const { user } = useSelector((state: any) => state.auth);

  const { data, isLoading, refetch } = useGetPublishedAssetByIdQuery(id, { skip: !id });
  const [createPaymentOrder] = useCreateAssetPaymentOrderMutation();
  const [purchaseAsset] = usePurchaseAssetMutation();

  const [activeImg, setActiveImg] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [paying, setPaying] = useState(false);

  const asset: any = data?.asset || null;

  // Build image list: cover + gallery
  const images: string[] = [];
  if (asset?.thumbnail?.url) images.push(asset.thumbnail.url);
  if (Array.isArray(asset?.thumbnails)) {
    asset.thumbnails.forEach((t: any) => { if (t?.url && !images.includes(t.url)) images.push(t.url); });
  }

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  async function handleDownload() {
    if (!user) { setOpen(true); return; }
    setDownloading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/get-asset-download/${id}`, { credentials: 'include' });
      const json = await res.json();
      if (!json.success) { toast.error(json.message || 'Access denied'); return; }
      window.open(json.fileUrl, '_blank');
    } catch {
      toast.error('Failed to get download link');
    } finally {
      setDownloading(false);
    }
  }

  async function handlePurchase() {
    if (!user) { setOpen(true); return; }
    setPaying(true);
    try {
      const res: any = await createPaymentOrder(id).unwrap();
      if (!res?.order) { toast.error('Failed to initiate payment'); return; }
      const options = {
        key: res.key,
        amount: res.order.amount,
        currency: res.order.currency,
        name: 'BB Edits Platform',
        description: asset.title,
        order_id: res.order.id,
        handler: async function (response: any) {
          try {
            await purchaseAsset({ id, razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature }).unwrap();
            toast.success('Purchase successful! You can now download.');
            refetch();
          } catch (e: any) { toast.error(e?.data?.message || 'Purchase verification failed'); }
        },
        prefill: { name: user?.name || '', email: user?.email || '' },
        theme: { color: '#06b6d4' },
        modal: { ondismiss: () => setPaying(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      toast.error(e?.data?.message || 'Payment failed');
      setPaying(false);
    }
  }

  const canDownload = asset && (!asset.isPaid || asset.hasPurchased);

  return (
    <Protected>
      <div className="min-h-screen bg-white dark:bg-[#0f1117]">
        <Heading
          title={asset ? `${asset.title} — BBEdits` : 'Asset Details'}
          description={asset?.description || 'Download this digital asset from BBEdits'}
          keywords={[asset?.category, ...(asset?.tags || [])].filter(Boolean).join(', ')}
        />
        <Header open={open} setOpen={setOpen} activeItem={0} setRoute={setRoute} route={route} />

        <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/assets"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowBack sx={{ fontSize: 17 }} />
            Back to Assets
          </Link>

          {isLoading ? (
            <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
              <div className="space-y-3">
                <div className="aspect-video w-full animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => <div key={i} className="h-20 w-20 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />)}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-10 w-3/4 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-5 w-1/4 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ) : !asset ? (
            <div className="py-24 text-center">
              <CloudDownload sx={{ fontSize: 56 }} className="mx-auto text-slate-300 dark:text-slate-700" />
              <p className="mt-4 text-slate-500 dark:text-slate-400">Asset not found</p>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1fr_400px]">

              {/* ── LEFT: Images ── */}
              <div>
                {/* Main image */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 aspect-video">
                  {images.length > 0 ? (
                    <img
                      src={images[activeImg]}
                      alt={asset.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <CloudDownload sx={{ fontSize: 64 }} className="text-slate-300 dark:text-slate-700" />
                    </div>
                  )}
                  {/* Prev/Next arrows for multiple images */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                      >
                        <ChevronLeft />
                      </button>
                      <button
                        onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                      >
                        <ChevronRight />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {images.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`shrink-0 overflow-hidden rounded-xl transition ${activeImg === i ? 'ring-2 ring-cyan-500 ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                      >
                        <img src={src} alt="" className="h-20 w-20 object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Description block */}
                {asset.description && (
                  <div className="mt-8">
                    <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">About this Asset</h2>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {asset.description}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {asset.tags?.length > 0 && (
                  <div className="mt-6">
                    <h2 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                      <Tag sx={{ fontSize: 14 }} />
                      Tags
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {asset.tags.map((tag: string) => (
                        <span key={tag} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── RIGHT: Product info ── */}
              <div>
                <div className="lg:sticky lg:top-28">
                  {/* Badges */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {asset.isTrending && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <LocalFireDepartment sx={{ fontSize: 14 }} />
                        Trending
                      </span>
                    )}
                    {asset.category && (
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        <Category sx={{ fontSize: 13 }} />
                        {asset.category}
                      </span>
                    )}
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${asset.isPaid ? 'bg-amber-400 text-amber-950' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                      {asset.isPaid ? `₹${asset.price}` : 'FREE'}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl font-black uppercase leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    {asset.title}
                  </h1>

                  {/* Download count */}
                  {asset.downloadCount > 0 && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                      <Download sx={{ fontSize: 16 }} />
                      {asset.downloadCount} {asset.downloadCount === 1 ? 'download' : 'downloads'}
                    </p>
                  )}

                  {/* Price block */}
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4">
                      {asset.isPaid ? (
                        <div>
                          <span className="text-4xl font-black text-slate-900 dark:text-white">₹{asset.price}</span>
                          {asset.hasPurchased && (
                            <span className="ml-3 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                              Purchased ✓
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">FREE</span>
                      )}
                    </div>

                    {canDownload ? (
                      <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                      >
                        <Download sx={{ fontSize: 18 }} />
                        {downloading ? 'Preparing download…' : 'Download Now'}
                      </button>
                    ) : (
                      <button
                        onClick={handlePurchase}
                        disabled={paying}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-amber-600 disabled:opacity-60"
                      >
                        <Lock sx={{ fontSize: 17 }} />
                        {paying ? 'Opening payment…' : `Buy for ₹${asset.price}`}
                      </button>
                    )}

                    {!user && (
                      <p className="mt-3 text-center text-xs text-slate-400">
                        You need to be logged in to download.{' '}
                        <button onClick={() => setOpen(true)} className="font-semibold text-cyan-600 underline-offset-2 hover:underline dark:text-cyan-400">Sign in</button>
                      </p>
                    )}
                  </div>

                  {/* Meta info */}
                  <div className="mt-5 space-y-2 rounded-2xl border border-slate-200 bg-white p-5 text-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Access</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{asset.isPaid ? 'One-time purchase' : 'Free for all'}</span>
                    </div>
                    {asset.fileUrlType && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Hosted on</span>
                        <span className="font-semibold capitalize text-slate-900 dark:text-white">
                          {asset.fileUrlType === 'googledrive' ? 'Google Drive' : asset.fileUrlType === 'bunnynet' ? 'Bunny.net' : 'Custom'}
                        </span>
                      </div>
                    )}
                    {asset.category && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Category</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{asset.category}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </Protected>
  );
}
