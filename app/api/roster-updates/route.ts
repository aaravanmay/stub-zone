import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    let url: string;
    if (id) {
      url = `https://mlb26.theshow.com/apis/roster_update.json?id=${encodeURIComponent(id)}`;
    } else {
      url = 'https://mlb26.theshow.com/apis/roster_updates.json';
    }

    const res = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch roster updates';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
