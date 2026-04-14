type StoredRoleMap = {
  byId: Record<string, string>;
  byEmail: Record<string, string>;
};

type StoredProfileMap = {
  byId: Record<string, string>;
  byEmail: Record<string, string>;
};

const ROLE_STORAGE_KEY = "identity-user-role-map-v2";
const PROFILE_STORAGE_KEY = "identity-user-profile-map-v1";
const AUTH_USER_STORAGE_KEY = "auth-user";

export function normalizeRoleName(roleName?: string | null): string | null {
  if (!roleName) return null;

  const normalized = roleName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .toUpperCase();

  if (normalized === "ADMIN") return "ADMIN";
  if (normalized === "ROL_FACULTAD" || normalized === "FACULTAD") return "FACULTAD";
  if (normalized === "ROL_PLANEACION" || normalized === "PLANEACION") return "PLANEACION";
  if (
    normalized === "ROL_DIRECTOR_DE_PROGRAMA" ||
    normalized === "DIRECTOR_DE_PROGRAMA"
  ) {
    return "DIRECTOR_DE_PROGRAMA";
  }

  return normalized;
}

export function getRoleDisplayName(roleName?: string | null): string {
  const normalized = normalizeRoleName(roleName);

  switch (normalized) {
    case "ADMIN":
      return "Admin";
    case "FACULTAD":
      return "Rol Facultad";
    case "PLANEACION":
      return "Rol Planeacion";
    case "DIRECTOR_DE_PROGRAMA":
      return "Rol Director de Programa";
    default:
      return roleName ?? "Sin rol visible";
  }
}

export function canViewDashboardSection(
  sectionName: string,
  roleName?: string | null,
): boolean {
  const normalized = normalizeRoleName(roleName);

  if (normalized === "ADMIN") return true;
  if (sectionName === "Administración") return false;
  if (sectionName === "Auditoría") return normalized === "DIRECTOR_DE_PROGRAMA";

  return true;
}

export function getBestUserDisplayName(params: {
  userId?: string | null;
  email?: string | null;
  userName?: string | null;
}): string {
  const storedName = findStoredFullName({
    userId: params.userId,
    email: params.email,
  });

  if (storedName) return storedName;
  if (params.userName && params.userName !== params.email) return params.userName;
  if (params.email) return prettifyEmailName(params.email);

  return "Usuario autenticado";
}

export function findStoredRole(params: {
  userId?: string | null;
  email?: string | null;
}): string | null {
  const storage = readRoleStorage();

  if (params.userId && storage.byId[params.userId]) return storage.byId[params.userId];
  if (params.email && storage.byEmail[params.email]) return storage.byEmail[params.email];
  if (params.email === "admin@example.com") return "Admin";

  return null;
}

export function storeUserRole(params: {
  userId?: string | null;
  email?: string | null;
  roleName: string;
}) {
  if (typeof window === "undefined") return;

  const storage = readRoleStorage();

  if (params.userId) storage.byId[params.userId] = params.roleName;
  if (params.email) storage.byEmail[params.email] = params.roleName;

  window.localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(storage));
}

export function findStoredFullName(params: {
  userId?: string | null;
  email?: string | null;
}): string | null {
  const storage = readProfileStorage();

  if (params.userId && storage.byId[params.userId]) return storage.byId[params.userId];
  if (params.email && storage.byEmail[params.email]) return storage.byEmail[params.email];

  return null;
}

export function storeUserProfile(params: {
  userId?: string | null;
  email?: string | null;
  fullName: string;
}) {
  if (typeof window === "undefined") return;

  const storage = readProfileStorage();

  if (params.userId) storage.byId[params.userId] = params.fullName;
  if (params.email) storage.byEmail[params.email] = params.fullName;

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(storage));
}

export function removeStoredUserProfile(params: {
  userId?: string | null;
  email?: string | null;
}) {
  if (typeof window === "undefined") return;

  const storage = readProfileStorage();

  if (params.userId) delete storage.byId[params.userId];
  if (params.email) delete storage.byEmail[params.email];

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(storage));
}

export function removeStoredUserRole(params: {
  userId?: string | null;
  email?: string | null;
}) {
  if (typeof window === "undefined") return;

  const storage = readRoleStorage();

  if (params.userId) delete storage.byId[params.userId];
  if (params.email) delete storage.byEmail[params.email];

  window.localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(storage));
}

export function readPersistedAuthUser<T>(): T | null {
  if (typeof window === "undefined") return null;

  try {
    const rawValue = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return rawValue ? (JSON.parse(rawValue) as T) : null;
  } catch {
    return null;
  }
}

export function persistAuthUser<T>(user: T | null) {
  if (typeof window === "undefined") return;

  if (!user) {
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

function readRoleStorage(): StoredRoleMap {
  if (typeof window === "undefined") {
    return { byId: {}, byEmail: {} };
  }

  try {
    const rawValue = window.localStorage.getItem(ROLE_STORAGE_KEY);
    if (!rawValue) return { byId: {}, byEmail: {} };

    const parsed = JSON.parse(rawValue);
    if (!parsed || typeof parsed !== "object") return { byId: {}, byEmail: {} };

    return {
      byId:
        parsed.byId && typeof parsed.byId === "object"
          ? (parsed.byId as Record<string, string>)
          : {},
      byEmail:
        parsed.byEmail && typeof parsed.byEmail === "object"
          ? (parsed.byEmail as Record<string, string>)
          : {},
    };
  } catch {
    return { byId: {}, byEmail: {} };
  }
}

function readProfileStorage(): StoredProfileMap {
  if (typeof window === "undefined") {
    return { byId: {}, byEmail: {} };
  }

  try {
    const rawValue = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!rawValue) return { byId: {}, byEmail: {} };

    const parsed = JSON.parse(rawValue);
    if (!parsed || typeof parsed !== "object") return { byId: {}, byEmail: {} };

    return {
      byId:
        parsed.byId && typeof parsed.byId === "object"
          ? (parsed.byId as Record<string, string>)
          : {},
      byEmail:
        parsed.byEmail && typeof parsed.byEmail === "object"
          ? (parsed.byEmail as Record<string, string>)
          : {},
    };
  } catch {
    return { byId: {}, byEmail: {} };
  }
}

function prettifyEmailName(email: string): string {
  const namePart = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  if (!namePart) return email;

  return namePart.replace(/\b\w/g, (char) => char.toUpperCase());
}
