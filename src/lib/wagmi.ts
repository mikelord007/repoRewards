import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import { http } from "wagmi";
import { defineChain } from "viem";

export const tenderlyChain = defineChain({
  id: 1337,
  name: "Tenderly Virtual Mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://virtual.mainnet.eu.rpc.tenderly.co/418c4044-1824-4f17-88fd-3541421b25c6"],
    },
  },
  blockExplorers: {
    default: {
      name: "Tenderly",
      url: "https://dashboard.tenderly.co",
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: "RepoRewards",
  projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect project ID
  chains: [tenderlyChain, sepolia],
  transports: {
    [tenderlyChain.id]: http("https://virtual.mainnet.eu.rpc.tenderly.co/418c4044-1824-4f17-88fd-3541421b25c6"),
    [sepolia.id]: http(), // default
  },
  ssr: true,
});

