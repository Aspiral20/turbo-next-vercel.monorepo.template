# How to use this template.

The template is based on [Turbo](https://turborepo.com/) and `micro-frontends` using [Next.js](https://nextjs.org/) with deployment on [Vercel](https://vercel.com/).

#### branch: `feat/next-auth`: view `docs` -> `web-security` for more information.

<!-- Here, I've added schematic. -->
```
/
└── main
    ├── feat/next-auth (admin)
    │   ├── feat/next-intl-auth (admin + core)
    └── feat/next-intl (core)
```

Each branch represents a pre-configured starting point you can check out depending on what features you need:

| Branch | Packages affected | What it adds |
| ------ | ----------------- | ------------ |
| `main` | — | Bare monorepo scaffold — no auth, no i18n |
| `feat/next-auth` | `admin` | Adds [NextAuth.js](https://next-auth.js.org/) authentication to the admin app |
| `feat/next-intl` | `core` | Adds [next-intl](https://next-intl-docs.vercel.app/) internationalisation to the core app |
| `feat/next-intl-auth` | `admin` + `core` | Combines both — auth on admin and i18n on core |

Start from `main` if you want a clean slate. Check out `feat/next-intl-auth` if you need both features out of the box. The feature branches are kept in sync with `main` so you can always cherry-pick changes back.

## All Technologies

- Package Manager: [Yarn](https://yarnpkg.com/)
- Monorepo Builder: [Turbo](https://turborepo.org/)
- React Framework: [Next.js](https://nextjs.org/)
- Language: [TypeScript](https://www.typescriptlang.org/)
- Styles: [TailwindCSS](https://tailwindcss.com/)
- Linter: [Biome](https://github.com/vercel/biome)
- Formatting: [Biome](https://github.com/vercel/biome)
- Deployment: [Vercel](https://vercel.com/)

## Project Structure
```
/
├── package.json               # Root workspace config (Turbo + Yarn workspaces)
├── turbo.json                 # Turborepo pipeline config
├── tsconfig.json              # Root TypeScript config (optional)
├── yarn.lock
├── packages/                  # All micro-frontends + shared packages live here
│   ├── shared/                # Shared utilities, UI, hooks, types, etc.
│   │   ├── package.json
│   │   └── src/
│   │
│   ├── micro-frontend-a/      # Example micro-frontend (Next.js app)
│   │   ├── package.json
│   │   ├── next.config.js/ts  # Transpile shared packages here
│   │   ├── public/
│   │   ├── src/
│   │   ├── tsconfig.json
│   │   └── vercel.json        # Optional deployment config
│   │
│   └── micro-frontend-b/      # Another micro-frontend (optional)
│       ├── package.json
│       ├── next.config.js/ts
│       ├── public/
│       ├── src/
│       ├── tsconfig.json
│       └── vercel.json
│
└── README.md

```

# Explanation of Each Part

A quick explanation of each part of the project structure.

## Root

---

| File            | Purpose                                                                      |
| --------------- | ---------------------------------------------------------------------------- |
| `package.json`  | Defines Yarn workspaces (`packages/*`) for micro-frontends + shared packages |
| `turbo.json`    | Defines build / dev pipeline across micro-frontends                          |
| `tsconfig.json` | Shared TypeScript configuration (optional)                                   |

## Packages

---

This folder contains:
1. Shared package 
   -  Reusable code across micro-frontends 
   - Must be added to transpilePackages and dependencies of each frontend 
2. Micro-frontends 
   - Independent Next.js apps 
   - Can be deployed individually to Vercel 
   - Have their own configs (next.config, vercel.json, tsconfig)

## Micro-Frontend Requirements

---

Each micro-frontend must include:

1. Transpile shared packages (`next.config.js/ts`)
```ts
const nextConfig = {
  transpilePackages: ["shared"],
};
```

2. Add shared package as dependency (`package.json`)
```json
{
  "dependencies": {
    "shared": "*"
  }
}
```

3. Optional Vercel config
```json
{
  "installCommand": "yarn install",
  "buildCommand": "yarn build",
  "framework": "nextjs"
}
```

## Turborepo Commands

---

From the root:

| Command | Description |
| ------- | ----------- |
| `yarn dev` | Run dev all micro-frontends |
| `yarn build` | Build all micro-frontends |