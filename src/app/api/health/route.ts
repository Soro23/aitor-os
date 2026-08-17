import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Healthcheck para Coolify: debe responder rapido y sin informacion
 * sensible (ver skill healthcheck-validator). Comprueba conectividad a
 * Postgres via la RPC is_admin() (security definer, no expone datos) en
 * vez de consultar una tabla — no se comprueban GoTrue/Storage por
 * separado, Coolify ya los monitoriza como recursos propios.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc("is_admin");

    if (error) {
      return NextResponse.json({ status: "error" }, { status: 503 });
    }

    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 503 });
  }
}
