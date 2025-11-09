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
  {
    type: "function",
    name: "getOrganizationCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getOrganization",
    stateMutability: "view",
    inputs: [{ name: "_orgId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "strategy", type: "address" },
          { name: "yieldSource", type: "address" },
          { name: "token", type: "address" },
          { name: "management", type: "address" },
          { name: "totalPrincipal", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "addPrincipal",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_orgId", type: "uint256" },
      { name: "_amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const;


