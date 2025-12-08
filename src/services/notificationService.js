const STORAGE_KEY = 'tm_notifications';

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeToStorage(data) {
  try {
    const safe = data && typeof data === 'object' ? data : {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch {
    // ignore
  }
}

function notifyChange() {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new Event('tm_notifications_updated'));
  } catch {
    // ignore
  }
}

function scopeKey(role, email) {
  if (role === 'admin') return 'admin';
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) return null;
  return `customer:${normalizedEmail}`;
}

function generateId(existing) {
  const base = Date.now();
  const rand = Math.floor(Math.random() * 1000000);
  const prefix = 'NTF-';
  const existingIds = Array.isArray(existing) ? existing.map((n) => String(n.id || '')) : [];
  let candidate = `${prefix}${base}-${rand}`;
  let counter = 1;
  while (existingIds.includes(candidate) && counter < 5) {
    candidate = `${prefix}${base}-${rand + counter}`;
    counter += 1;
  }
  return candidate;
}

function getListForScope(role, email) {
  const key = scopeKey(role, email);
  if (!key) return [];
  const all = readFromStorage();
  const list = all[key];
  return Array.isArray(list) ? list : [];
}

function setListForScope(role, email, list) {
  const key = scopeKey(role, email);
  if (!key) return;
  const all = readFromStorage();
  all[key] = Array.isArray(list) ? list : [];
  writeToStorage(all);
  notifyChange();
}

export function getNotifications(role, email) {
  return getListForScope(role, email);
}

export function addNotification(role, email, title) {
  if (!title) return null;
  const existing = getListForScope(role, email);
  const now = new Date();
  const notification = {
    id: generateId(existing),
    title,
    time: now.toLocaleString(),
    createdAt: now.toISOString(),
    read: false,
  };
  const next = [notification, ...existing].slice(0, 30);
  setListForScope(role, email, next);
  return notification;
}

export function markAllAsRead(role, email) {
  const existing = getListForScope(role, email);
  if (!existing.length) return;
  const next = existing.map((n) => ({ ...n, read: true }));
  setListForScope(role, email, next);
}

export function addCustomerNotification(email, title) {
  return addNotification('customer', email, title);
}

export function addAdminNotification(title) {
  return addNotification('admin', null, title);
}

export function getNotificationsForUser(user) {
  if (!user) return [];
  const role = user.role === 'admin' ? 'admin' : 'customer';
  return getNotifications(role, user.email);
}

export function markAllAsReadForUser(user) {
  if (!user) return;
  const role = user.role === 'admin' ? 'admin' : 'customer';
  markAllAsRead(role, user.email);
}
