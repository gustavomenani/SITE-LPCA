import { NextResponse } from "next/server";
import { getResourcesDocument } from "@/lib/data";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getResourcesDocument());
}
