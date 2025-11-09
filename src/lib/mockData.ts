export interface FundingPool {
  id: string;
  name: string;
  goal: string;
  totalFunds: string;
  yieldDistributed: string;
  contributors: number;
  createdAt: string;
  repo?: string;
}

export interface Contribution {
  id: string;
  repository: string;
  pullRequest: string;
  amount: string;
  status: "pending" | "claimed";
  claimedAt?: string;
}

export const mockFundingPools: FundingPool[] = [
  {
    id: "1",
    name: "Web3 Infrastructure",
    goal: "$50,000",
    totalFunds: "$32,500",
    yieldDistributed: "$2,100",
    contributors: 12,
    createdAt: "2024-01-15",
    repo: "https://github.com/reporewards/web3-infrastructure",
  },
  {
    id: "2",
    name: "DeFi Protocol",
    goal: "$100,000",
    totalFunds: "$78,900",
    yieldDistributed: "$5,400",
    contributors: 28,
    createdAt: "2024-02-01",
    repo: "https://github.com/reporewards/defi-protocol",
  },
  {
    id: "3",
    name: "Developer Tooling",
    goal: "$40,000",
    totalFunds: "$15,600",
    yieldDistributed: "$1,250",
    contributors: 9,
    createdAt: "2024-03-10",
    repo: "https://github.com/reporewards/dev-tooling",
  },
];

export const mockContributions: Contribution[] = [
  {
    id: "1",
    repository: "repo-rewards/contracts",
    pullRequest: "#42",
    amount: "$150",
    status: "claimed",
    claimedAt: "2024-01-20",
  },
  {
    id: "2",
    repository: "repo-rewards/frontend",
    pullRequest: "#15",
    amount: "$75",
    status: "pending",
  },
  {
    id: "3",
    repository: "repo-rewards/docs",
    pullRequest: "#8",
    amount: "$50",
    status: "claimed",
    claimedAt: "2024-01-18",
  },
];

