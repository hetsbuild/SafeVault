export interface AuthUser {
  _id: string;
  name: string;
  email?: string;
  hasFace?: boolean;
}

const KEY = "safeVault_user";

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function updateUser(patch: Partial<AuthUser>) {
  const user = getUser();
  if (user) setUser({ ...user, ...patch });
}

export function clearUser() {
  localStorage.removeItem(KEY);
}