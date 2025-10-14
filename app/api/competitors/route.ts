import { NextRequest, NextResponse } from 'next/server';
import { fetchCompetitorData } from '@/lib/competitor-apis';

export async function POST(request: NextRequest) {
  try {
    const { keyword, category } = await request.json();

    if (!keyword || !category) {
      return NextResponse.json(
        { error: 'Keyword and category are required' },
        { status: 400 }
      );
    }

    const competitors = await fetchCompetitorData({
      keyword,
      category,
      maxResults: 50
    });

    return NextResponse.json({
      competitors,
      count: competitors.length
    });

  } catch (error) {
    console.error('Competitor API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competitor data' },
      { status: 500 }
    );
  }
}
