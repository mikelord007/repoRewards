export const repoRewardsAbi = [
  {
    type: "function",
    name: "registerOrganization",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_yieldSource", type: "address" },
      { name: "_management", type: "address" },
      { name: "_name", type: "string" },
    ],
    outputs: [],
  },
] as const;


