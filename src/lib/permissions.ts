import type { Role } from "@prisma/client";

export type Permission =
  | "products:write"
  | "categories:write"
  | "inventory:write"
  | "orders:read"
  | "users:write"
  | "settings:write";

// Única fuente de verdad de quién puede hacer qué. Para agregar un rol nuevo
// alcanza con sumar una entrada acá — nada más en el código debería tener
// `if (role === ...)` repetido.
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "products:write",
    "categories:write",
    "inventory:write",
    "orders:read",
    "users:write",
    "settings:write",
  ],
  ADMIN: ["products:write", "categories:write", "inventory:write", "orders:read"],
  EDITOR: ["products:write"],
  INVENTORY: ["inventory:write"],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  INVENTORY: "Inventario",
};
