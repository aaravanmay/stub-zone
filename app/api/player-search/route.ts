import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const name = searchParams.get('name') ?? '';

    const params = new URLSearchParams();
    if (name) {
      params.set('name', name);
    }
    params.set('type', 'mlb_card');

    // The items.json endpoint ignores the name filter, but listings.json supports it.
    // Each listing contains an "item" sub-object with player card data.
    const url = `https://mlb26.theshow.com/apis/listings.json?${params.toString()}`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    const data = await res.json();

    // Extract the item (player card) from each listing
    const items = (data.listings ?? []).map((listing: any) => listing.item).filter(Boolean);

    return NextResponse.json({ results: items });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to search players';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
