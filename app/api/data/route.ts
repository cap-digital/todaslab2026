import { NextResponse } from "next/server";

const SUPABASE_FN = "https://cqrpbiepyeypbkizwacu.supabase.co/functions/v1/TodasLab2026";
const PUBLISHABLE_KEY = "sb_publishable_YN9YKLw6sludrgf9T2i_1g_Dcm8dIiK";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(SUPABASE_FN, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PUBLISHABLE_KEY}`,
        apikey: PUBLISHABLE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "Functions" }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Supabase respondeu ${res.status}` },
        { status: 502 }
      );
    }

    const json = await res.json();
    return NextResponse.json(json, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Falha ao buscar dados" },
      { status: 502 }
    );
  }
}
