const STORAGE_KEY = 'tm_wallets';

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeToStorage(wallets) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
  } catch {
  }
}

function normalizeWallet(value) {
  const balance = Number(value && value.balance) || 0;
  const transactions = Array.isArray(value && value.transactions) ? value.transactions : [];
  return { balance, transactions };
}

export function getWalletForUser(email) {
  const key = email || 'guest';
  const all = readFromStorage();
  const existing = all[key];
  if (existing) {
    return normalizeWallet(existing);
  }
  const fresh = { balance: 0, transactions: [] };
  all[key] = fresh;
  writeToStorage(all);
  return fresh;
}

export function saveWalletForUser(email, wallet) {
  const key = email || 'guest';
  const all = readFromStorage();
  all[key] = normalizeWallet(wallet || {});
  writeToStorage(all);
  return all[key];
}

export function updateWalletForUser(email, patch) {
  const current = getWalletForUser(email);
  const next = { ...current, ...patch };
  return saveWalletForUser(email, next);
}
