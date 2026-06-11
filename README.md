# Profile Generator

Generate real geocoded profiles using Mapbox.

## Setup

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Add environment variable: `VITE_MAPBOX_TOKEN=your_token`
4. Deploy

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_MAPBOX_TOKEN` | Your Mapbox public token |

## Features

- Profile Generator (name + phone + DOB + real address)
- Address Generator (real geocoded addresses via Mapbox)
- Name Generator
- Phone Generator
- By Country or By Map (draw bbox) selection
- CSV export
- 8 countries: FR, GB, DE, US, ES, IT, NL, BE
