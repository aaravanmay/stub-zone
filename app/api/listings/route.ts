import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const params = new URLSearchParams();

    const forwardKeys = [
      'type', 'page', 'sort_by', 'rarity', 'order',
      'name', 'min_buy_price', 'max_buy_price',
      'min_sell_price', 'max_sell_price',
      'display_position', 'team', 'series_id',
      'min_rank', 'max_rank',
    ];

    for (const key of forwardKeys) {
      const value = searchParams.get(key);
      if (value !== null) {
        params.set(key, value);
      }
    }

    const url = `https://mlb26.theshow.com/apis/listings.json?${params.toString()}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch listings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
