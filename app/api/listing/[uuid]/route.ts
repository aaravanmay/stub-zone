import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;
    const url = `https://mlb26.theshow.com/apis/listing.json?uuid=${encodeURIComponent(uuid)}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch listing';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
