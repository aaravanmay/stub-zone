export const RARITY_COLORS: Record<
  string,
  { dot: string; bg: string; text: string; gradient: string }
> = {
  'Red Diamond': {
    dot: '#ff2d55',
    bg: 'rgba(255,45,85,0.12)',
    text: '#ff2d55',
    gradient: 'linear-gradient(135deg, #ff2d55, #ff6b8a)',
  },
  Diamond: {
    dot: '#5bc0eb',
    bg: 'rgba(91,192,235,0.12)',
    text: '#5bc0eb',
    gradient: 'linear-gradient(135deg, #5bc0eb, #9dd9f3)',
  },
  Gold: {
    dot: '#ffd166',
    bg: 'rgba(255,209,102,0.12)',
    text: '#ffd166',
    gradient: 'linear-gradient(135deg, #ffd166, #ffe29e)',
  },
  Silver: {
    dot: '#a8b8d0',
    bg: 'rgba(168,184,208,0.12)',
    text: '#a8b8d0',
    gradient: 'linear-gradient(135deg, #a8b8d0, #c8d4e4)',
  },
  Bronze: {
    dot: '#d4915c',
    bg: 'rgba(212,145,92,0.12)',
    text: '#d4915c',
    gradient: 'linear-gradient(135deg, #d4915c, #e4b88c)',
  },
  Common: {
    dot: '#5a6e8a',
    bg: 'rgba(90,110,138,0.12)',
    text: '#5a6e8a',
    gradient: 'linear-gradient(135deg, #5a6e8a, #7a8ea8)',
  },
};

export const POSITIONS = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'] as const;

export const PITCHING_POSITIONS = ['SP', 'RP', 'CP'] as const;

export const ALL_POSITIONS = [...POSITIONS, ...PITCHING_POSITIONS] as const;

export const TEAMS: { abbr: string; name: string }[] = [
  { abbr: 'ARI', name: 'Arizona Diamondbacks' },
  { abbr: 'ATL', name: 'Atlanta Braves' },
  { abbr: 'BAL', name: 'Baltimore Orioles' },
  { abbr: 'BOS', name: 'Boston Red Sox' },
  { abbr: 'CHC', name: 'Chicago Cubs' },
  { abbr: 'CWS', name: 'Chicago White Sox' },
  { abbr: 'CIN', name: 'Cincinnati Reds' },
  { abbr: 'CLE', name: 'Cleveland Guardians' },
  { abbr: 'COL', name: 'Colorado Rockies' },
  { abbr: 'DET', name: 'Detroit Tigers' },
  { abbr: 'HOU', name: 'Houston Astros' },
  { abbr: 'KC', name: 'Kansas City Royals' },
  { abbr: 'LAA', name: 'Los Angeles Angels' },
  { abbr: 'LAD', name: 'Los Angeles Dodgers' },
  { abbr: 'MIA', name: 'Miami Marlins' },
  { abbr: 'MIL', name: 'Milwaukee Brewers' },
  { abbr: 'MIN', name: 'Minnesota Twins' },
  { abbr: 'NYM', name: 'New York Mets' },
  { abbr: 'NYY', name: 'New York Yankees' },
  { abbr: 'OAK', name: 'Oakland Athletics' },
  { abbr: 'PHI', name: 'Philadelphia Phillies' },
  { abbr: 'PIT', name: 'Pittsburgh Pirates' },
  { abbr: 'SD', name: 'San Diego Padres' },
  { abbr: 'SF', name: 'San Francisco Giants' },
  { abbr: 'SEA', name: 'Seattle Mariners' },
  { abbr: 'STL', name: 'St. Louis Cardinals' },
  { abbr: 'TB', name: 'Tampa Bay Rays' },
  { abbr: 'TEX', name: 'Texas Rangers' },
  { abbr: 'TOR', name: 'Toronto Blue Jays' },
  { abbr: 'WSH', name: 'Washington Nationals' },
];

export const SERIES_MAP: Record<number, string> = {
  1337: 'Live',
  10001: 'Rookie',
  10002: 'Breakout',
  10003: 'All-Star',
  10004: 'Veteran',
  10005: 'Postseason',
  10006: 'Awards',
  10007: 'Signature',
  10008: 'Prime',
  10009: 'Finest',
  10010: 'Future Stars',
  10011: 'Prospect',
  10012: 'Monthly Awards',
  10013: 'Topps Now',
  10014: '2nd Half',
  10015: 'Milestone',
  10016: 'Takeover',
};

export const RARITY_ORDER = [
  'Red Diamond',
  'Diamond',
  'Gold',
  'Silver',
  'Bronze',
  'Common',
] as const;

export const PACK_ODDS = {
  diamond: 0.01,
  gold: 0.04,
  silver: 0.15,
  bronze: 0.4,
  common: 0.4,
} as const;

export const TAX_RATE = 0.1;
