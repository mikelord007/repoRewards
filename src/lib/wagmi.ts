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
      http: ["https://virtual.mainnet.eu.rpc.tenderly.co/5405bc8a-e533-412a-af01-e7d60a3ccd57"],
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
    [tenderlyChain.id]: http("https://virtual.mainnet.eu.rpc.tenderly.co/5405bc8a-e533-412a-af01-e7d60a3ccd57"),
    [sepolia.id]: http(), // default
  },
  ssr: true,
});

