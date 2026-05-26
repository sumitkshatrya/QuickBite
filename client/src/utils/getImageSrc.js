const isValidUrl = (value) => {
  if (typeof value !== 'string') return false;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim();
const API_ORIGIN = rawApiUrl ? new URL(rawApiUrl).origin : '';

const normalizeRelativeUploadPath = (value) => {
  if (typeof value !== 'string') return '';

  const normalized = value.trim().replace(/\\/g, '/');
  if (!normalized) return '';

  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized;
  }

  if (normalized.startsWith('/uploads/')) {
    return API_ORIGIN ? `${API_ORIGIN}${normalized}` : normalized;
  }

  if (normalized.startsWith('uploads/')) {
    return API_ORIGIN ? `${API_ORIGIN}/${normalized}` : `/${normalized}`;
  }

  return '';
};

export const getImageSrc = (value, fallback = '') => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return isValidUrl(trimmed) ? trimmed : normalizeRelativeUploadPath(trimmed) || fallback;
  }

  if (value && typeof value === 'object') {
    const candidates = [value.url, value.secure_url, value.image, value.src];
    const match = candidates.find((candidate) => {
      if (typeof candidate !== 'string') return false;
      const trimmed = candidate.trim();
      return isValidUrl(trimmed) || Boolean(normalizeRelativeUploadPath(trimmed));
    });

    if (!match) return fallback;

    const trimmed = match.trim();
    return isValidUrl(trimmed) ? trimmed : normalizeRelativeUploadPath(trimmed) || fallback;
  }

  return fallback;
};
