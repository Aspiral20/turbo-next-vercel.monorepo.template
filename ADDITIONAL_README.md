# Additional Description

### 0. Change the directory for micro-services inside `package.json` file in root directory of your project..

`package.json`
```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

### 1. Install dependencies

```bash
yarn install
```

### 2. Create micro-frontend

Create new Next.js micro-frontend.

```bash
npx create-next-app@latest ./packages/micro-frontend
```

### 3. Configure package.json files for your project and micro-frontends

Change the name of the project in package.json files. For example: name, description, author, version...

`packages/shared` - shared code between micro-frontends.

If you want to add the `shared packages` for your micro frontends (which you will use in micro-frontends) you should add the configuration for directory of `shared package` to each micro-frontend.

#### How to add new `shared package` to your micro-frontend ?

1. Add the directory of `shared package` to `transpilePackages` in `next.config.ts` file of your micro-frontend.
```ts
const nextConfig: NextConfig = {
  transpilePackages: ["shared"],
};
```

2. Add the `shared package` to `dependencies` in `package.json` file of your micro-frontend.

`packages/micro-frontend/package.json`
```json
{
  "dependencies": {
    "shared": "*"
  }
}
```

### Deployment on Vercel (optional)

`packages/micro-frontend/vercel.json`
```json
{
  "installCommand": "yarn install",
  "buildCommand": "yarn build",
  "framework": "nextjs"
}
```

### Commands (from root directory)

#### Run dev all micro-frontends

```bash
yarn dev
```

#### Build all micro-frontends

```bash
yarn build
```