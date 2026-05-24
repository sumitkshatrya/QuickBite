import { useEffect, useState } from 'react';
import { uploadImage } from '../services/api.js';

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const maxFileSize = 2 * 1024 * 1024;

export default function ImageUpload({ label, value, onChange }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(value || '');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!file) return undefined;

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!file) {
      setPreview(value || '');
    }
  }, [value, file]);

  const handleFileChange = (event) => {
    setError('');
    const selected = event.target.files?.[0];

    if (!selected) {
      setFile(null);
      return;
    }

    if (!allowedTypes.includes(selected.type)) {
      setError('Only JPEG, PNG, WebP, and GIF images are allowed.');
      return;
    }

    if (selected.size > maxFileSize) {
      setError('Image must be 2MB or smaller.');
      return;
    }

    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image before uploading.');
      return;
    }

    setError('');
    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const result = await uploadImage(formData);
      onChange(result.url);
      setFile(null);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500"
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      {preview && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">Preview</p>
          <img src={preview} alt="Preview" className="h-44 w-full rounded-3xl object-cover" />
        </div>
      )}
      <input type="hidden" value={value} readOnly />
    </div>
  );
}
