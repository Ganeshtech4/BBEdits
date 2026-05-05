"use client";
import React, { useRef, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import { Edit, Delete, Add, CloudDownload, Check, Visibility, VisibilityOff, ArrowBack, Close, AddPhotoAlternate } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import {
  useGetAdminAssetsQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
} from "@/redux/features/assets/assetsApi";
import { AdminButton, AdminCard, AdminInput, AdminSectionIntro, AdminSelect } from "../ui/admin-ui";

type AssetImage = { url: string; public_id?: string };

const emptyForm = {
  title: "",
  description: "",
  fileUrl: "",
  fileUrlType: "custom" as "googledrive" | "bunnynet" | "custom",
  price: "0",
  category: "",
  tags: "",
  isPublished: true,
  isTrending: false,
  thumbnail: null as string | null,
  thumbnailExisting: null as AssetImage | null,
  gallery: [] as string[],
  galleryExisting: [] as AssetImage[],
};

type FormState = typeof emptyForm;

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

export default function AdminAssets() {
  const { data, isLoading, refetch } = useGetAdminAssetsQuery({});
  const [createAsset] = useCreateAssetMutation();
  const [updateAsset] = useUpdateAssetMutation();
  const [deleteAsset] = useDeleteAssetMutation();

  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const thumbInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const assets: any[] = data?.assets || [];
  const totalDownloads = assets.reduce((s: number, a: any) => s + (a.downloadCount || 0), 0);

  function goCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setView("create");
  }

  function goEdit(row: any) {
    setEditingId(row._id || row.id);
    setForm({
      title: row.title || "",
      description: row.description || "",
      fileUrl: row.fileUrl || "",
      fileUrlType: row.fileUrlType || "custom",
      price: String(row.price ?? "0"),
      category: row.category || "",
      tags: Array.isArray(row.tags) ? row.tags.join(", ") : "",
      isPublished: row.isPublished || false,
      isTrending: row.isTrending || false,
      thumbnail: null,
      thumbnailExisting: row.thumbnail?.url ? row.thumbnail : null,
      gallery: [],
      galleryExisting: Array.isArray(row.thumbnails) ? row.thumbnails : [],
    });
    setView("edit");
  }

  function goList() { setView("list"); }

  async function handleThumbFile(file: File) {
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    const b64 = await readFileAsDataURL(file);
    setForm((f) => ({ ...f, thumbnail: b64, thumbnailExisting: null }));
  }

  function removeThumb() { setForm((f) => ({ ...f, thumbnail: null, thumbnailExisting: null })); }

  async function handleGalleryFiles(files: FileList) {
    const b64s: string[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) b64s.push(await readFileAsDataURL(file));
    }
    setForm((f) => ({ ...f, gallery: [...f.gallery, ...b64s] }));
  }

  function removeGalleryNew(idx: number) {
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }));
  }

  function removeGalleryExisting(idx: number) {
    setForm((f) => ({ ...f, galleryExisting: f.galleryExisting.filter((_, i) => i !== idx) }));
  }

  async function handleSave() {
    if (!form.title.trim() || !form.fileUrl.trim()) {
      toast.error("Title and File URL are required");
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        title: form.title.trim(),
        description: form.description.trim(),
        fileUrl: form.fileUrl.trim(),
        fileUrlType: form.fileUrlType,
        price: Number(form.price) || 0,
        category: form.category.trim(),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        isPublished: form.isPublished,
        isTrending: form.isTrending,
      };

      if (form.thumbnail) {
        payload.thumbnail = form.thumbnail;
      } else if (form.thumbnailExisting?.url) {
        payload.thumbnail = form.thumbnailExisting.url;
      } else {
        payload.thumbnail = "";
      }

      payload.thumbnails = [
        ...form.galleryExisting.map((g) => g.url),
        ...form.gallery,
      ];

      if (editingId) {
        await updateAsset({ id: editingId, ...payload }).unwrap();
        toast.success("Asset updated");
      } else {
        await createAsset(payload).unwrap();
        toast.success("Asset created");
      }
      refetch();
      goList();
    } catch (e: any) {
      toast.error(e?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAsset(id).unwrap();
      toast.success("Asset deleted");
      setDeleteId(null);
      refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Delete failed");
    }
  }

  async function handleTogglePublish(row: any) {
    try {
      await updateAsset({ id: row._id || row.id, isPublished: !row.isPublished }).unwrap();
      toast.success(row.isPublished ? "Unpublished" : "Published");
      refetch();
    } catch { toast.error("Update failed"); }
  }

  const coverPreview = form.thumbnail || form.thumbnailExisting?.url || null;

  const rows = assets.map((a: any) => ({ ...a, id: a._id }));

  const columns: GridColDef[] = [
    {
      field: "thumbnail",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (p) => {
        const url = p.value?.url || "";
        return (
          <div className="flex h-full items-center">
            {url ? (
              <img src={url} alt="" className="h-9 w-9 rounded-xl object-cover" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <CloudDownload sx={{ fontSize: 17, opacity: 0.4 }} />
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: "title", headerName: "Title", flex: 1, minWidth: 180,
      renderCell: (p) => <span className="font-medium text-slate-900 dark:text-slate-100">{p.value}</span>,
    },
    {
      field: "category", headerName: "Category", width: 130,
      renderCell: (p) => p.value ? (
        <Chip label={p.value} size="small" sx={{ borderRadius: "10px", fontSize: 12 }} />
      ) : <span className="text-slate-400">&mdash;</span>,
    },
    {
      field: "price", headerName: "Price", width: 100,
      renderCell: (p) => p.value > 0
        ? <Chip label={`₹${p.value}`} size="small" color="warning" sx={{ borderRadius: "10px", fontWeight: 600 }} />
        : <Chip label="Free" size="small" color="success" sx={{ borderRadius: "10px", fontWeight: 600 }} />,
    },
    {
      field: "downloadCount", headerName: "Downloads", width: 110,
      renderCell: (p) => <span className="text-slate-600 dark:text-slate-400">{p.value || 0}</span>,
    },
    {
      field: "fileUrlType", headerName: "Host", width: 120,
      renderCell: (p) => {
        const labels: Record<string, string> = { googledrive: "Google Drive", bunnynet: "Bunny.net", custom: "Custom" };
        return <Chip label={labels[p.value] || p.value} size="small" variant="outlined" sx={{ borderRadius: "10px", fontSize: 11 }} />;
      },
    },
    {
      field: "isTrending", headerName: "Trending", width: 100,
      renderCell: (p) => p.value
        ? <Chip label="Trending" size="small" color="warning" sx={{ borderRadius: "10px", fontWeight: 600 }} />
        : <span className="text-slate-400">&mdash;</span>,
    },
    {
      field: "isPublished", headerName: "Status", width: 100,
      renderCell: (p) => p.value
        ? <Chip icon={<Check sx={{ fontSize: 14 }} />} label="Live" size="small" color="success" sx={{ borderRadius: "10px" }} />
        : <Chip label="Draft" size="small" sx={{ borderRadius: "10px" }} />,
    },
    {
      field: "actions", headerName: "", width: 120, sortable: false, filterable: false,
      renderCell: (p) => (
        <div className="flex items-center gap-1">
          <Tooltip title={p.row.isPublished ? "Unpublish" : "Publish"}>
            <IconButton size="small" onClick={() => handleTogglePublish(p.row)}>
              {p.row.isPublished ? <VisibilityOff sx={{ fontSize: 17 }} /> : <Visibility sx={{ fontSize: 17 }} />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => goEdit(p.row)}><Edit sx={{ fontSize: 17 }} /></IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => setDeleteId(p.row.id)}>
              <Delete sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  // â”€â”€ VIEW: LIST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (view === "list") {
    return (
      <div className="p-4 lg:p-6">
        <AdminCard className="p-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                Digital Products
              </p>
              <h2 className="mt-0.5 text-xl font-bold text-slate-900 dark:text-slate-50">Assets</h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
                  {assets.length} total
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {assets.filter((a: any) => !a.isPaid).length} free
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {assets.filter((a: any) => a.isPaid).length} paid
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  {totalDownloads} downloads
                </span>
              </div>
            </div>
            <AdminButton onClick={goCreate} className="flex items-center gap-1.5 shrink-0">
              <Add sx={{ fontSize: 17 }} />
              Add Asset
            </AdminButton>
          </div>

          {/* DataGrid */}
          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={isLoading}
              autoHeight
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              disableRowSelectionOnClick
              sx={{
                border: "none",
                borderTop: "1px solid",
                borderTopColor: "divider",
                borderRadius: 0,
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "background.paper",
                  fontWeight: 600,
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                },
                "& .MuiDataGrid-row:hover": { backgroundColor: "action.hover" },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid",
                  borderColor: "divider",
                },
              }}
            />
          </Box>
        </AdminCard>

        {/* Delete confirm */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <AdminCard className="w-full max-w-sm p-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">Delete Asset?</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                This will permanently delete the asset and its images. Users who purchased it will lose access.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <AdminButton variant="secondary" onClick={() => setDeleteId(null)}>Cancel</AdminButton>
                <AdminButton
                  onClick={() => handleDelete(deleteId)}
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
                >
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          </div>
        )}
      </div>
    );
  }

  // â”€â”€ VIEW: CREATE / EDIT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="p-4 lg:p-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={goList}
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ArrowBack sx={{ fontSize: 17 }} />
          Back to Assets
        </button>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2">
            <div
              onClick={() => setForm((f) => ({ ...f, isPublished: !f.isPublished }))}
              className={`relative h-6 w-11 rounded-full transition-colors ${form.isPublished ? "bg-cyan-500" : "bg-slate-300 dark:bg-slate-700"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.isPublished ? "translate-x-5" : ""}`}
              />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {form.isPublished ? "Published" : "Draft"}
            </span>
          </label>
          <AdminButton onClick={handleSave} disabled={saving} className="min-w-[120px]">
            {saving ? "Saving..." : editingId ? "Save Changes" : "Publish Asset"}
          </AdminButton>
        </div>
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">

        {/* â”€â”€ LEFT COLUMN â”€â”€ */}
        <div className="space-y-5">

          {/* Basic Information */}
          <AdminCard>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Title *</label>
                <AdminInput
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Complete Photoshop Brushes Pack"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe what is included in this asset..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-cyan-400"
                />
              </div>
            </div>
          </AdminCard>

          {/* Cover Image */}
          <AdminCard>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">Cover Image</h2>
            {coverPreview ? (
              <div className="relative w-full overflow-hidden rounded-2xl">
                <img src={coverPreview} alt="Cover" className="h-56 w-full object-cover" />
                <button
                  onClick={removeThumb}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <Close sx={{ fontSize: 16 }} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => thumbInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleThumbFile(file);
                }}
                className={`flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition ${
                  dragging
                    ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-950/30"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                }`}
              >
                <AddPhotoAlternate sx={{ fontSize: 32, opacity: 0.4 }} />
                <p className="text-sm text-slate-500">Click or drag to upload cover image</p>
              </div>
            )}
            <input
              ref={thumbInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleThumbFile(e.target.files[0])}
            />
          </AdminCard>

          {/* Gallery */}
          <AdminCard>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">Gallery</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {form.galleryExisting.map((img, i) => (
                <div key={`ex-${i}`} className="relative aspect-square overflow-hidden rounded-xl">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  <button
                    onClick={() => removeGalleryExisting(i)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <Close sx={{ fontSize: 12 }} />
                  </button>
                </div>
              ))}
              {form.gallery.map((b64, i) => (
                <div key={`new-${i}`} className="relative aspect-square overflow-hidden rounded-xl">
                  <img src={b64} alt="" className="h-full w-full object-cover" />
                  <button
                    onClick={() => removeGalleryNew(i)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <Close sx={{ fontSize: 12 }} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => galleryInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-slate-300 dark:border-slate-800"
              >
                <Add sx={{ fontSize: 22 }} />
                <span className="text-[11px]">Add</span>
              </button>
            </div>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleGalleryFiles(e.target.files)}
            />
          </AdminCard>

          {/* File Delivery */}
          <AdminCard>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">File Delivery</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">File URL *</label>
                <AdminInput
                  value={form.fileUrl}
                  onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                  placeholder="https://drive.google.com/... or CDN link"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Host Type</label>
                <AdminSelect
                  value={form.fileUrlType}
                  onChange={(e) => setForm((f) => ({ ...f, fileUrlType: e.target.value as any }))}
                >
                  <option value="googledrive">Google Drive</option>
                  <option value="bunnynet">Bunny.net</option>
                  <option value="custom">Custom URL</option>
                </AdminSelect>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* â”€â”€ RIGHT COLUMN â”€â”€ */}
        <div className="space-y-5">

          {/* Pricing */}
          <AdminCard>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">Pricing</h2>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Price (₹) &mdash; set 0 for free
              </label>
              <AdminInput
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0"
              />
              <p className="mt-2 text-xs text-slate-400">
                {Number(form.price) > 0 ? `Paid asset at ₹${form.price}` : "Free to download"}
              </p>
            </div>
          </AdminCard>

          {/* Organisation */}
          <AdminCard>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">Organisation</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <AdminInput
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="e.g. Brushes, Templates, LUTs"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tags <span className="text-slate-400">(comma separated)</span>
                </label>
                <AdminInput
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="photoshop, free, brushes"
                />
              </div>
            </div>
          </AdminCard>

          {/* Visibility */}
          <AdminCard>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">Visibility</h2>
            <button
              onClick={() => setForm((f) => ({ ...f, isPublished: !f.isPublished }))}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition ${
                form.isPublished
                  ? "border-cyan-200 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-950/40"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {form.isPublished ? "Published" : "Draft"}
                </p>
                <p className="text-xs text-slate-400">
                  {form.isPublished ? "Visible to all users" : "Only visible to admins"}
                </p>
              </div>
              <div
                className={`relative h-6 w-11 rounded-full transition-colors ${form.isPublished ? "bg-cyan-500" : "bg-slate-300 dark:bg-slate-700"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.isPublished ? "translate-x-5" : ""}`}
                />
              </div>
            </button>
          </AdminCard>

          {/* Trending / Highlight */}
          <AdminCard>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">Trending / Highlight</h2>
            <button
              onClick={() => setForm((f) => ({ ...f, isTrending: !f.isTrending }))}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition ${
                form.isTrending
                  ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {form.isTrending ? "Trending" : "Not Trending"}
                </p>
                <p className="text-xs text-slate-400">
                  {form.isTrending ? "Shows in hero carousel on assets page" : "Enable to feature in carousel"}
                </p>
              </div>
              <div
                className={`relative h-6 w-11 rounded-full transition-colors ${form.isTrending ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.isTrending ? "translate-x-5" : ""}`}
                />
              </div>
            </button>
          </AdminCard>

          {/* Save */}
          <AdminButton
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 text-sm font-bold"
          >
            {saving ? "Saving..." : editingId ? "Save Changes" : "Publish Asset"}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
