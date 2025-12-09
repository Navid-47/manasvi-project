const STORAGE_KEY = 'tm_bookings';

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(bookings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch {
    // ignore
  }
}

function generateId(existing) {
  const prefix = 'BKG-';
  const nums = existing
    .map((b) => {
      const part = String(b.id || '').replace(prefix, '');
      const n = parseInt(part, 10);
      return Number.isFinite(n) ? n : 0;
    })
    .filter((n) => n > 0);
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
}

export function getAllBookings() {
  return readFromStorage();
}

export function getBookingById(id) {
  return readFromStorage().find((b) => String(b.id) === String(id)) || null;
}

export function createBooking(payload) {
  const existing = readFromStorage();
  const id = generateId(existing);
  const now = new Date().toISOString();
  const booking = {
    id,
    status: 'Pending',
    createdAt: now,
    ...payload,
  };
  const next = [booking, ...existing];
  writeToStorage(next);
  return booking;
}

export function updateBooking(id, patch) {
  const existing = readFromStorage();
  const next = existing.map((b) =>
    String(b.id) === String(id) ? { ...b, ...patch } : b
  );
  writeToStorage(next);
  return next.find((b) => String(b.id) === String(id)) || null;
}
