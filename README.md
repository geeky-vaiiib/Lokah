# Lokah

Created and maintained by **geeky-vaiiib**  
Many Worlds, One You.

Lokah lets you talk to human-feeling alternate versions of yourself: short, grounded, reflective chats that explore unchosen paths without drifting into therapy-speak or poetic abstraction.

## Quick Start

```sh
git clone https://github.com/geeky-vaiiib/Lokah.git
cd Lokah
npm ci
npm run dev
```

Visit: http://localhost:8080

## Scripts
- dev: local development (Vite)
- build: production bundle
- test: vitest suite
- lint: eslint check

## Stack
Vite + React + TypeScript + Tailwind + shadcn-ui + Framer Motion + Supabase Edge Functions

## Design Tokens
Gradient: #B693FF → #71D0E3 → #97FFE0  
Background: #0B0C10 / #0E1A2E / #13213A  
Text: #FFFFFF / Muted #BFC6D0  
Glow: drop-shadow(0 0 10px rgba(151,255,224,0.3))

## Production Build
```sh
npm run build
npm run preview
```
Deploy the `dist` directory to Vercel / Netlify / Cloudflare Pages.

## License
© 2025 geeky-vaiiib. All rights reserved.

