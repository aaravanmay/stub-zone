import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const name = searchParams.get('name') ?? '';

    const params = new URLSearchParams();
    if (name) {
      params.set('name', name);
    }
    // Use mlb_card type to only return player cards (not equipment, stadiums, etc.)
    params.set('type', 'mlb_card');

    const url = `https://mlb26.theshow.com/apis/items.json?${params.toString()}`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to search players';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
