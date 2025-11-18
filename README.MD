# How to use this template.

The template is based on [Turbo](https://turborepo.com/) and `micro-frontends` using [Next.js](https://nextjs.org/) with deployment on [Vercel](https://vercel.com/).

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