import { CompetitorListing } from '@/types';

interface FetchOptions {
  keyword: string;
  category: string;
  maxResults?: number;
}

// Cache for API results (24 hour TTL)
const cache = new Map<string, { data: CompetitorListing[]; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(options: FetchOptions): string {
  return `${options.keyword}-${options.category}`.toLowerCase();
}

function getCachedData(key: string): CompetitorListing[] | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCachedData(key: string, data: CompetitorListing[]): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Fetch Etsy listings
 */
export async function fetchEtsyListings(options: FetchOptions): Promise<CompetitorListing[]> {
  try {
    const response = await fetch(
      `https://openapi.etsy.com/v3/application/listings/active?` +
      `keywords=${encodeURIComponent(options.keyword)}` +
      `&limit=${options.maxResults || 50}`,
      {
        headers: {
          'x-api-key': process.env.ETSY_API_KEY || '',
        },
        next: { revalidate: 86400 } // Cache for 24 hours
      }
    );

    if (!response.ok) {
      console.error('Etsy API error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results
      .filter((listing: any) => listing.price && listing.title)
      .map((listing: any) => {
        const price = listing.price.amount / listing.price.divisor;
        const favorites = listing.num_favorers || 0;

        return {
          source: 'etsy' as const,
          title: listing.title,
          price,
          salesVolume: estimateSalesFromFavorites(favorites),
          url: listing.url,
          confidence: favorites > 50 ? ('high' as const) : favorites > 20 ? ('medium' as const) : ('low' as const)
        };
      });
  } catch (error) {
    console.error('Etsy API fetch error:', error);
    return [];
  }
}

/**
 * Estimate monthly sales from Etsy favorites
 * Heuristic: 2-5% of favorited items convert per month
 */
function estimateSalesFromFavorites(favorites: number): number {
  return Math.max(1, Math.round(favorites * 0.03));
}

/**
 * Get eBay OAuth token
 */
async function getEbayAppToken(): Promise<string> {
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('eBay credentials not configured');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope'
  });

  if (!response.ok) {
    throw new Error('Failed to get eBay token');
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Fetch eBay listings with ACTUAL sales data
 */
export async function fetchEbayListings(options: FetchOptions): Promise<CompetitorListing[]> {
  try {
    const token = await getEbayAppToken();

    const response = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?` +
      `q=${encodeURIComponent(options.keyword)}` +
      `&limit=${options.maxResults || 50}` +
      `&filter=conditionIds:{1000|1500}`, // New or like-new only
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
          'X-EBAY-C-ENDUSERCTX': 'affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>'
        }
      }
    );

    if (!response.ok) {
      console.error('eBay API error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();

    if (!data.itemSummaries || !Array.isArray(data.itemSummaries)) {
      return [];
    }

    return data.itemSummaries
      .filter((item: any) => item.price && item.price.value)
      .map((item: any) => {
        const soldQty = parseInt(item.quantitySold || item.unitsSold || '0', 10);

        return {
          source: 'ebay' as const,
          title: item.title,
          price: parseFloat(item.price.value),
          salesVolume: soldQty > 0 ? soldQty : undefined, // Real sales data!
          url: item.itemWebUrl,
          confidence: soldQty > 0 ? ('high' as const) : ('medium' as const)
        };
      });
  } catch (error) {
    console.error('eBay API fetch error:', error);
    return [];
  }
}

/**
 * Fetch Amazon listings via RapidAPI
 */
export async function fetchAmazonListings(options: FetchOptions): Promise<CompetitorListing[]> {
  try {
    const response = await fetch(
      `https://real-time-amazon-data.p.rapidapi.com/search?` +
      `query=${encodeURIComponent(options.keyword)}` +
      `&page=1` +
      `&country=US`,
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
          'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
        }
      }
    );

    if (!response.ok) {
      console.error('Amazon API error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();

    if (!data.data || !data.data.products || !Array.isArray(data.data.products)) {
      return [];
    }

    return data.data.products
      .filter((product: any) => product.product_price && product.product_title)
      .slice(0, options.maxResults || 30)
      .map((product: any) => {
        const price = parseFloat(product.product_price.replace(/[^0-9.]/g, ''));
        const reviews = parseInt(product.product_num_ratings || '0', 10);

        return {
          source: 'amazon' as const,
          title: product.product_title,
          price,
          salesVolume: estimateSalesFromReviews(reviews),
          url: product.product_url,
          confidence: reviews > 100 ? ('high' as const) : reviews > 20 ? ('medium' as const) : ('low' as const)
        };
      });
  } catch (error) {
    console.error('Amazon API fetch error:', error);
    return [];
  }
}

/**
 * Estimate monthly sales from Amazon review count
 * Heuristic: 1-2% of customers leave reviews, average product lifetime ~2 years
 */
function estimateSalesFromReviews(reviewCount: number): number {
  if (reviewCount === 0) return 0;
  const totalSales = reviewCount / 0.015; // 1.5% review rate
  const monthlySales = totalSales / 24; // Spread over 24 months
  return Math.max(1, Math.round(monthlySales));
}

/**
 * Remove duplicate listings based on title similarity
 */
function removeDuplicates(listings: CompetitorListing[]): CompetitorListing[] {
  const seen = new Set<string>();
  const unique: CompetitorListing[] = [];

  for (const listing of listings) {
    // Normalize title for comparison
    const normalized = listing.title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .slice(0, 5) // Use first 5 words
      .join(' ');

    if (!seen.has(normalized)) {
      seen.add(normalized);
      unique.push(listing);
    }
  }

  return unique;
}

/**
 * Main function to fetch competitor data from all sources
 */
export async function fetchCompetitorData(options: FetchOptions): Promise<CompetitorListing[]> {
  // Check cache first
  const cacheKey = getCacheKey(options);
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('Returning cached competitor data');
    return cached;
  }

  console.log('Fetching fresh competitor data...');

  // Fetch from all APIs in parallel
  const [etsyData, ebayData, amazonData] = await Promise.allSettled([
    fetchEtsyListings(options),
    fetchEbayListings(options),
    fetchAmazonListings(options)
  ]);

  const results: CompetitorListing[] = [];

  if (etsyData.status === 'fulfilled') {
    console.log(`Etsy: ${etsyData.value.length} listings`);
    results.push(...etsyData.value);
  }

  if (ebayData.status === 'fulfilled') {
    console.log(`eBay: ${ebayData.value.length} listings`);
    results.push(...ebayData.value);
  }

  if (amazonData.status === 'fulfilled') {
    console.log(`Amazon: ${amazonData.value.length} listings`);
    results.push(...amazonData.value);
  }

  // Remove duplicates and sort by confidence
  const unique = removeDuplicates(results);
  const sorted = unique.sort((a, b) => {
    const confidenceScore = { high: 3, medium: 2, low: 1 };
    return confidenceScore[b.confidence] - confidenceScore[a.confidence];
  });

  // Cache the results
  setCachedData(cacheKey, sorted);

  console.log(`Total unique competitors: ${sorted.length}`);

  return sorted;
}
