# 📡 CryptoScope Pro

**A real-time cryptocurrency dashboard built with vanilla HTML, CSS, and JavaScript.**

Live prices · Fear & Greed Index · Crypto News · Portfolio Tracker · Price Alerts · Coin Detail Pages

🔗 **Live Demo:** [sumitbehera720.github.io/cryptoscope-dashboard](https://sumitbehera720.github.io/cryptoscope-dashboard/)

---

## 🖥️ Preview

```
📊 Market  |  🌐 Explore  |  💼 Portfolio  |  ⭐ Watchlist  |  🔔 Alerts
```

- **Market tab** — Live price chart, top 20 coins, heatmap, market share doughnut, converter, top movers
- **Explore tab** — Fear & Greed gauge, global market stats, trending coins, live crypto news feed
- **Portfolio tab** — Track holdings, P&L calculation, allocation chart
- **Watchlist tab** — Pinned coins with sparkline charts
- **Alerts tab** — Price crossing notifications

---

## ✨ Features

### 📊 Market Dashboard
- Real-time price chart (Line / Bar) for any of the 20 tracked coins
- 24H / 7D / 30D time range selector
- Market heatmap with color-coded 24H performance
- Market share doughnut chart (top 5 by market cap)
- Currency converter (USD, EUR, GBP, JPY, INR)
- Top gainers & losers table
- CSV export of all coin data
- Live metric cards: total market cap, volume, BTC dominance, avg change

### 🌐 Explore
- **Fear & Greed Index** — animated semicircle gauge with needle, 7-day history bars (via alternative.me free API)
- **Global Market Stats** — total cap, volume, BTC/ETH dominance, active cryptos
- **🔥 Trending Coins** — top CoinGecko search results
- **📰 Crypto News** — 12 live headlines (via CryptoCompare free API), refreshable

### 🔍 Coin Detail Modal
Click any coin to open a full detail panel:
- Current price, 24H change, market cap, volume
- All-Time High / All-Time Low (with API key)
- Circulating & max supply
- 7-day mini chart
- Coin description
- Links to Website, Twitter, Reddit, CoinGecko

### 💼 Portfolio Tracker
- Add holdings with optional buy price
- Live P&L calculation per holding
- Total portfolio value & return %
- Allocation doughnut chart
- Persistent via localStorage

### ⭐ Watchlist
- Star any coin from the market list
- Sparkline mini-charts per coin
- Click any row to open coin detail

### 🔔 Price Alerts
- Set "above" or "below" price triggers
- Toast notification when triggered
- Alert badge on bell icon
- Persistent via localStorage

### 🎨 UI & UX
- **Dark / Light / Auto theme** — auto-detects your OS preference, cycles on click
- Smooth animations: fadeUp on load, shimmer skeletons while loading, slideUp modal
- Responsive layout — works on mobile, tablet, desktop
- Keyboard shortcuts (see below)
- ARIA labels and semantic HTML for accessibility

---

## 🚀 Getting Started

### 1. Clone or Download

```bash
git clone https://github.com/yourusername/cryptoscope-pro.git
cd cryptoscope-pro
```

Or just download the ZIP and extract it.

### 2. Open in Browser

No build step, no npm, no dependencies to install.

```bash
# Simply open index.html in your browser
open index.html
```

That's it. The dashboard loads immediately with simulated data.

### 3. Connect Live Data (Optional)

To get **real prices** from CoinGecko:

1. Go to [coingecko.com/en/api](https://www.coingecko.com/en/api)
2. Sign up for a free account
3. Copy your **Demo API Key**
4. Open the dashboard → click **🔑 Add API Key** in the yellow banner
5. Paste your key and click **Save & Connect**

The key is saved to `localStorage` — you only need to enter it once.

> **Free tier limits:** 30 calls/minute, which is well within what this app uses (1 call/60 seconds).

---

## 📁 Project Structure

```
cryptoscope-pro/
├── index.html      # HTML structure — all 5 tabs, coin modal, nav
├── styles.css      # All styles — themes, layout, components, animations
└── app.js          # All logic — API, charts, state, events, rendering
```

Pure vanilla stack — zero frameworks, zero build tools, zero dependencies beyond Chart.js (loaded via CDN).

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search bar |
| `1` – `9` | Select coin by rank |
| `D` | 24H time range |
| `W` | 7D time range |
| `M` | 30D time range |
| `L` | Line chart |
| `B` | Bar chart |
| `T` | Cycle theme (auto → dark → light) |
| `Esc` | Clear search / Close modal |

---

## 🌐 APIs Used

| API | Purpose | Key Required |
|-----|---------|-------------|
| [CoinGecko](https://www.coingecko.com/en/api) | Live prices, history, trending, global stats, coin detail | Yes (free) |
| [Alternative.me](https://alternative.me/crypto/fear-and-greed-index/) | Fear & Greed Index | No |
| [CryptoCompare](https://min-api.cryptocompare.com/) | Crypto news headlines | No |

When no CoinGecko key is set, the app runs entirely on **simulated data** — prices drift realistically every 4 seconds using a seeded random algorithm, so the UI stays fully interactive.

---

## 📈 Tracked Coins (20)

| # | Coin | Symbol |
|---|------|--------|
| 1 | Bitcoin | BTC |
| 2 | Ethereum | ETH |
| 3 | Tether | USDT |
| 4 | Solana | SOL |
| 5 | BNB | BNB |
| 6 | XRP | XRP |
| 7 | Dogecoin | DOGE |
| 8 | Cardano | ADA |
| 9 | Avalanche | AVAX |
| 10 | Polkadot | DOT |
| 11 | Chainlink | LINK |
| 12 | Litecoin | LTC |
| 13 | Uniswap | UNI |
| 14 | Stellar | XLM |
| 15 | Monero | XMR |
| 16 | Ethereum Classic | ETC |
| 17 | Cosmos | ATOM |
| 18 | NEAR Protocol | NEAR |
| 19 | Aptos | APT |
| 20 | Sui | SUI |

---

## 💾 Local Storage Keys

The app persists user preferences automatically:

| Key | Stores |
|-----|--------|
| `cs_apikey` | CoinGecko API key |
| `cs_theme` | Theme preference (auto/dark/light) |
| `cs_selectedId` | Last selected coin |
| `cs_days` | Last time range (1/7/30) |
| `cs_chartType` | Last chart type (line/bar) |
| `cs_watch` | Watchlist coin IDs |
| `cs_port` | Portfolio holdings |
| `cs_alerts` | Price alerts |

---

## 🛠️ Customization

### Add more coins
In `app.js`, extend the `COINS` array:

```js
{ id: 'pepe', name: 'Pepe', symbol: 'PEPE', emoji: '🐸', color: '#4caf50', price: 0.000012, change24h: 5.2, marketCap: 5e9, volume: 0.8e9 },
```

The `id` must match the CoinGecko coin ID (find it in the URL: `coingecko.com/en/coins/pepe`).

### Change refresh interval
In `app.js` at the top:

```js
const CONFIG = {
  REFRESH_INTERVAL: 60000,    // Live API refresh (ms) — min 60000 on free tier
  SIMULATION_INTERVAL: 4000,  // Simulation tick when no API key
};
```

### Add supported currencies
In `app.js`, extend the `FX` object and add `<option>` tags in `index.html`:

```js
const FX = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.8, INR: 83.2, CAD: 1.36 };
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout change |
|-----------|--------------|
| `< 1100px` | Explore grid: 3 → 2 columns |
| `< 1060px` | Main grid: side-by-side → stacked |
| `< 800px` | Portfolio & Explore: single column |
| `< 680px` | Bottom grid & news: single column |
| `< 600px` | Chart height reduced, modal padding reduced |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">

**Designed & Developed by Sumit Behera**

*CryptoScope Pro · 2025*

</div>
