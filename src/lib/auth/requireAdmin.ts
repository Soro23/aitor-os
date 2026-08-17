import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "./getUser";

export class UnauthorizedError extends Error {
  constructor(message = "No autenticado.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "No autorizado.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Defensa en profundidad para Server Actions de escritura: comprueba sesion
 * (getUser) y pertenencia a app_admins (RPC is_admin(), via RLS/security
 * definer). La frontera real vive en Postgres — esto es la segunda capa.
 */
export async function requireAdmin() {
  const user = await getUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  const supabase = await createClient();
  const { data: isAdmin, error } = await supabase.rpc("is_admin");

  if (error || !isAdmin) {
    throw new ForbiddenError();
  }

  return user;
}

/**
 * Variante para Server Components (layouts/pages), donde lanzar un error
 * dispara el error boundary en vez de redirigir. Usada por
 * app/admin/(protected)/layout.tsx como segunda capa junto a middleware.ts.
 */
export async function requireAdminOrRedirect() {
  try {
    return await requireAdmin();
  } catch {
    redirect("/admin/login");
  }
}
