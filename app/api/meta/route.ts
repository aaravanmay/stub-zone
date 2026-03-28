import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = 'https://mlb26.theshow.com/apis/meta_data.json';
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch meta data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
