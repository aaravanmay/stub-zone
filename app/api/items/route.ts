import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const params = new URLSearchParams();

    searchParams.forEach((value, key) => {
      params.set(key, value);
    });

    const url = `https://mlb26.theshow.com/apis/items.json?${params.toString()}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch items';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
