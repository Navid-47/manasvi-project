const STORAGE_KEY = 'tm_payments';

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

function writeToStorage(payments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  } catch {
    // ignore
  }
}

function generateId(existing) {
  const prefix = 'TXN-';
  const nums = existing
    .map((p) => {
      const part = String(p.id || '').replace(prefix, '');
      const n = parseInt(part, 10);
      return Number.isFinite(n) ? n : 0;
    })
    .filter((n) => n > 0);
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}${String(next).padStart(4, '0')}`;
}

export function getAllPayments() {
  return readFromStorage();
}

export function getPaymentById(id) {
  return readFromStorage().find((p) => String(p.id) === String(id)) || null;
}

export function createPayment(payload) {
  const existing = readFromStorage();
  const id = generateId(existing);
  const now = new Date().toISOString();
  const payment = {
    id,
    status: 'Success',
    createdAt: now,
    ...payload,
  };
  const next = [payment, ...existing];
  writeToStorage(next);
  return payment;
}

export function updatePayment(id, patch) {
  const existing = readFromStorage();
  const next = existing.map((p) =>
    String(p.id) === String(id) ? { ...p, ...patch } : p
  );
  writeToStorage(next);
  return next.find((p) => String(p.id) === String(id)) || null;
}
