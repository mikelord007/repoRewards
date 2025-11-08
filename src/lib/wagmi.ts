import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, localhost } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RepoRewards",
  projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect project ID
  chains: [mainnet, sepolia, localhost],
  ssr: true,
});

