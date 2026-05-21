import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const table = url.searchParams.get("table");

  if (!table) {
    return NextResponse.json({ error: "Table required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", auth.user.id);

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "No data" }, { status: 500 });
  }

  const rows = Array.isArray(data) ? data : [data];
  if (!rows.length) {
    return NextResponse.json({ error: "No data" }, { status: 404 });
  }

  const csvHeaders = Object.keys(rows[0]).join(",");
  const csvRows = rows
    .map((row: Record<string, unknown>) =>
      Object.values(row)
        .map((v) => (typeof v === "string" && v.includes(",") ? `"${v}"` : v))
        .join(",")
    )
    .join("\n");

  const csv = `${csvHeaders}\n${csvRows}`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${table}.csv"`,
    },
  });
}
