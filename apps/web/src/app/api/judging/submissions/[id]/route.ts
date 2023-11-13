import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const body = await req.json();

    return NextResponse.json(body);
}

export const runtime = "edge";
