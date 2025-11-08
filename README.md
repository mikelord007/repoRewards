# RepoRewards

A Web3 hackathon project that helps organizations fund open-source contributors using the Optent protocol. The app distributes yield from pooled funds to contributors — similar to a Kickstarter for open-source.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (UI components)
- **wagmi + viem** (Ethereum wallet interactions)
- **RainbowKit** (Wallet connection UI)
- **React Query** (Data fetching)
- **Lucide Icons**

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your WalletConnect Project ID:

   - Get a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Update `src/lib/wagmi.ts` with your project ID

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── org/
│   │   ├── onboarding/page.tsx     # Organization onboarding
│   │   └── dashboard/page.tsx      # Organization dashboard
│   └── contributor/
│       ├── onboarding/page.tsx     # Contributor onboarding
│       └── dashboard/page.tsx      # Contributor dashboard
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── WalletConnect.tsx
│   └── Card.tsx
├── lib/
│   ├── utils.ts                    # Utility functions
│   ├── mockData.ts                 # Mock data
│   └── wagmi.ts                    # Wagmi configuration
├── hooks/
│   └── useWallet.ts                # Wallet hook
└── styles/
    └── globals.css                  # Global styles
```

## Pages

- `/` - Landing page with hero section and "How it works"
- `/org/onboarding` - Organization onboarding form
- `/org/dashboard` - Organization dashboard with funding pools
- `/contributor/onboarding` - Contributor onboarding (wallet + GitHub)
- `/contributor/dashboard` - Contributor dashboard with rewards

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Notes

- This is a frontend-only implementation with mock data
- WalletConnect Project ID is required for wallet connections
- All contract interactions are currently mocked
- Ready for integration with backend/contracts repo

