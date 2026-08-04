# Harbs & Seeds

Bilingual (English + Urdu) mobile app for herbs and seeds: benefits, cautions, usage, and pictures — with a large offline SQLite library and online fallback that saves new finds locally.

## Features

- Offline-first SQLite catalog with **50,000+** herb/seed entries
- English ↔ Urdu language toggle
- Benefits, harms/cautions, and usage details
- Local search first; if missing/weak, Wikipedia + image lookup, then cache offline
- Favorites, modern botanical UI

## Run

```bash
npm install
npx expo start
```

Then press `a` for Android emulator/device, `i` for iOS, or scan the QR code with Expo Go.

## Notes

- First launch builds the offline database once (progress screen).
- Educational content only — not medical advice.
- Generated catalog entries use structured bilingual templates plus curated real herbs for popular items.
