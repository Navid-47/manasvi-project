const STORAGE_KEY = 'tm_users';

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

function writeToStorage(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.isArray(users) ? users : []));
  } catch {
    // ignore
  }
}

function generateId(existing) {
  const nums = existing
    .map((u) => {
      const n = parseInt(String(u.id || ''), 10);
      return Number.isFinite(n) ? n : 0;
    })
    .filter((n) => n > 0);
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return String(next);
}

function seedIfEmpty(users) {
  if (users && users.length > 0) return users;
  const now = new Date().toISOString();
  const seedAdmin = {
    id: '1',
    name: 'Admin',
    email: 'admin@travelmanasvi.com',
    password: 'admin123',
    role: 'admin',
    createdAt: now,
  };
  const seeded = [seedAdmin];
  writeToStorage(seeded);
  return seeded;
}

export function getAllUsers() {
  const users = readFromStorage();
  return seedIfEmpty(Array.isArray(users) ? users : []);
}

export function getUserByEmail(email) {
  if (!email) return null;
  const target = String(email).trim().toLowerCase();
  const users = getAllUsers();
  return (
    users.find((u) => String(u.email || '').trim().toLowerCase() === target) || null
  );
}

export function createUser(payload) {
  const users = getAllUsers();
  const email = String(payload.email || '').trim().toLowerCase();
  if (!email) {
    throw new Error('Email is required');
  }
  const existing = users.find((u) => String(u.email || '').trim().toLowerCase() === email);
  if (existing) {
    throw new Error('User already exists');
  }
  const now = new Date().toISOString();
  const id = generateId(users);
  const user = {
    id,
    name: payload.name || email.split('@')[0] || 'User',
    email,
    password: String(payload.password || ''),
    role: payload.role || 'customer',
    createdAt: now,
  };
  const next = [user, ...users];
  writeToStorage(next);
  return user;
}
