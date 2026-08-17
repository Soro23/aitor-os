import { NextResponse } from "next/server";
import { getGithubActivity } from "@/lib/github/get-activity";

/** Endpoint publico de solo lectura — consumo client-side futuro, opcional. */
export async function GET() {
  const activity = await getGithubActivity();

  if (!activity) {
    return NextResponse.json({ error: "GitHub activity not configured" }, { status: 404 });
  }

  return NextResponse.json(activity);
}
