# Zaal Donate Button

Birthday + donate page for ZAOstock 2026. Hosted at `birthday.zaostock.com`.

## What it does

- Big PayPal CTA → `paypal.com/paypalme/zaalpanthaki`
- Crypto secondary → Giveth project (`sustaining-zao-festivals-creativity-technology`)
- Hub link → `donate.zaostock.com` for the full 2-path UI
- 3D party room scene (R3F + drei)
- ZAO ecosystem brand-pill grid (The ZAO, ZAOstock, WaveWarZ, ZABAL, BetterCallZaal, Press Release Marketplace)
- Photo strip (WaveWarZ + cipher + ZABAL)
- Shoutout to Samantha (@candytoyboxyt) who designed the original

## Stack

- Vite + React 19
- @react-three/fiber + @react-three/drei + three
- Tailwind v4 (via @tailwindcss/vite)
- motion (framer-motion successor)
- canvas-confetti

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run preview
```

## Deploy

Connect the repo to Vercel. Framework auto-detects Vite. Add custom domain `birthday.zaostock.com` in Vercel project settings.

## Origin

Forked from `CandyToyBox/Zaal-s-Birthday` — original 3D party scene by Samantha. Iterated by Zaal + Claude for ZAOstock 2026 launch.
