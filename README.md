# RepoRewards

A Web3 hackathon project that helps organizations fund open-source contributors using the Octant protocol. The app distributes yield from pooled funds to contributors — similar to a Kickstarter for open-source.

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

## GitHub OAuth (Contributors)

Environment variables (set in `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_OAUTH_STATE_SECRET=replace_with_random_32_bytes_hex_or_base64
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Supabase schema (run in SQL editor):

```
-- contributor_profiles table
create table if not exists public.contributor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade unique,
  github_id bigint not null unique,
  login text not null,
  name text,
  avatar_url text,
  html_url text,
  created_at timestamptz not null default now()
);
alter table public.contributor_profiles enable row level security;
```

Flow:
- On `Contributor Onboarding`, “Connect GitHub” sends the user to `/api/github/login` which redirects to GitHub.
- Callback at `/api/github/callback` exchanges the code, fetches the profile, upserts `users` (by wallet) and `contributor_profiles`, then redirects back to onboarding.
- The page fetches `/api/contributors/{wallet}` and shows GitHub name/avatar.

