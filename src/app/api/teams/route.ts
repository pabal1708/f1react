// src/app/api/teams/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://f1api.dev/api/current/teams", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "Error al consultar el endpoint externo" },
        { status: res.status }
      );
    }

    const data = await res.json();

    const teams = Array.isArray(data?.teams) ? data.teams : data?.response;

    if (!Array.isArray(teams)) {
      return NextResponse.json(
        { ok: false, error: "Formato inesperado en la API externa" },
        { status: 502 }
      );
    }

    return NextResponse.json(teams);
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
