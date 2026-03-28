export interface ConquestReward {
  id: string;
  name: string;
  type: string;
  estimatedValue: number;
}

export interface ConquestMap {
  id: string;
  name: string;
  rewards: ConquestReward[];
  estimatedMinutes: number;
}

export const CONQUEST_MAPS: ConquestMap[] = [
  {
    id: 'usa-map',
    name: 'USA Map',
    rewards: [
      { id: 'usa-1', name: '10 Standard Packs', type: 'pack', estimatedValue: 15000 },
      { id: 'usa-2', name: '5000 Stubs', type: 'stubs', estimatedValue: 5000 },
      { id: 'usa-3', name: 'Headliners Choice Pack', type: 'pack', estimatedValue: 30000 },
      { id: 'usa-4', name: 'Ballin is a Habit Pack', type: 'pack', estimatedValue: 20000 },
    ],
    estimatedMinutes: 180,
  },
  {
    id: 'mystery-map-1',
    name: 'Mystery Map: Hidden Legends',
    rewards: [
      { id: 'mm1-1', name: 'Diamond Choice Pack', type: 'pack', estimatedValue: 25000 },
      { id: 'mm1-2', name: '3000 Stubs', type: 'stubs', estimatedValue: 3000 },
      { id: 'mm1-3', name: '5 Standard Packs', type: 'pack', estimatedValue: 7500 },
    ],
    estimatedMinutes: 90,
  },
  {
    id: 'team-affinity-conquest',
    name: 'Team Affinity Conquest',
    rewards: [
      { id: 'tac-1', name: 'Team Affinity Points (x3)', type: 'progression', estimatedValue: 10000 },
      { id: 'tac-2', name: '2000 Stubs', type: 'stubs', estimatedValue: 2000 },
      { id: 'tac-3', name: 'Show Pack Bundle (5)', type: 'pack', estimatedValue: 7500 },
    ],
    estimatedMinutes: 60,
  },
  {
    id: 'all-star-conquest',
    name: 'All-Star Conquest',
    rewards: [
      { id: 'asc-1', name: 'All-Star Series Choice Pack', type: 'pack', estimatedValue: 35000 },
      { id: 'asc-2', name: '8000 Stubs', type: 'stubs', estimatedValue: 8000 },
      { id: 'asc-3', name: 'Gold Choice Pack', type: 'pack', estimatedValue: 5000 },
      { id: 'asc-4', name: '10 Standard Packs', type: 'pack', estimatedValue: 15000 },
    ],
    estimatedMinutes: 120,
  },
  {
    id: 'spring-cleanup',
    name: 'Spring Cleanup',
    rewards: [
      { id: 'sc-1', name: '3 Standard Packs', type: 'pack', estimatedValue: 4500 },
      { id: 'sc-2', name: '1500 Stubs', type: 'stubs', estimatedValue: 1500 },
    ],
    estimatedMinutes: 45,
  },
];
