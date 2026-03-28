import type {
  Item,
  ListingsResponse,
  RosterUpdate,
  SingleListing,
} from './types';

function buildQuery(params: Record<string, string>): string {
  const searchParams = new URLSearchParams(params);
  return searchParams.toString();
}

export async function fetchListings(
  params: Record<string, string> = {}
): Promise<ListingsResponse> {
  const query = buildQuery(params);
  const res = await fetch(`/api/listings?${query}`);
  if (!res.ok) throw new Error('Failed to fetch listings');
  return res.json();
}

export async function fetchListing(uuid: string): Promise<SingleListing> {
  const res = await fetch(`/api/listings/${uuid}`);
  if (!res.ok) throw new Error('Failed to fetch listing');
  return res.json();
}

export async function fetchItems(
  params: Record<string, string> = {}
): Promise<ListingsResponse> {
  const query = buildQuery(params);
  const res = await fetch(`/api/items?${query}`);
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export async function searchPlayers(name: string): Promise<Item[]> {
  const query = buildQuery({ name });
  const res = await fetch(`/api/players/search?${query}`);
  if (!res.ok) throw new Error('Failed to search players');
  return res.json();
}

export async function fetchRosterUpdates(): Promise<RosterUpdate[]> {
  const res = await fetch('/api/roster-updates');
  if (!res.ok) throw new Error('Failed to fetch roster updates');
  return res.json();
}

export async function fetchMetaData(): Promise<any> {
  const res = await fetch('/api/meta');
  if (!res.ok) throw new Error('Failed to fetch meta data');
  return res.json();
}
