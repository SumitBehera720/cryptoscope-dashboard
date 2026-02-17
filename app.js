/* ════════════════════════════════════════════════════
   CryptoScope Pro — Application Logic
   app.js
════════════════════════════════════════════════════ */


/* ── Config ─────────────────────────────────────── */

const CONFIG = {
  COINGECKO_API_KEY:   localStorage.getItem('cs_apikey') || '',
  REFRESH_INTERVAL:    60000,
  SIMULATION_INTERVAL: 4000,
  API_BASE:            'https://api.coingecko.com/api/v3',
};


/* ── Static Coin Data (20 coins) ─────────────────── */

const COINS = [
  { id: 'bitcoin',        name: 'Bitcoin',        symbol: 'BTC',   emoji: '₿',  color: '#f7931a', price: 67842.14, change24h:  2.34, marketCap: 1.33e12, volume: 28.4e9 },
  { id: 'ethereum',       name: 'Ethereum',        symbol: 'ETH',   emoji: 'Ξ',  color: '#627eea', price:  3541.88, change24h: -1.12, marketCap:  425e9,  volume: 14.2e9 },
  { id: 'tether',         name: 'Tether',          symbol: 'USDT',  emoji: '₮',  color: '#26a17b', price:     1.00, change24h:  0.01, marketCap:  115e9,  volume: 65.1e9 },
  { id: 'solana',         name: 'Solana',          symbol: 'SOL',   emoji: '◎',  color: '#9945ff', price:   185.42, change24h:  4.67, marketCap:   86e9,  volume:  5.3e9 },
  { id: 'bnb',            name: 'BNB',             symbol: 'BNB',   emoji: '⬡',  color: '#f3ba2f', price:   571.30, change24h:  0.88, marketCap:   83e9,  volume:  2.1e9 },
  { id: 'xrp',            name: 'XRP',             symbol: 'XRP',   emoji: '✕',  color: '#346aa9', price:     0.534,change24h: -0.55, marketCap:   59e9,  volume:  1.8e9 },
  { id: 'dogecoin',       name: 'Dogecoin',        symbol: 'DOGE',  emoji: 'Ð',  color: '#c2a633', price:     0.162,change24h:  3.21, marketCap:   23e9,  volume:  1.2e9 },
  { id: 'cardano',        name: 'Cardano',         symbol: 'ADA',   emoji: '₳',  color: '#3cc8c8', price:     0.452,change24h: -2.10, marketCap:   16e9,  volume:  0.6e9 },
  { id: 'avalanche-2',    name: 'Avalanche',       symbol: 'AVAX',  emoji: '🔺', color: '#e84142', price:    38.76, change24h:  5.44, marketCap: 15.8e9,  volume:  0.9e9 },
  { id: 'polkadot',       name: 'Polkadot',        symbol: 'DOT',   emoji: '⬤',  color: '#e6007a', price:     8.12, change24h: -3.30, marketCap: 11.2e9,  volume:  0.5e9 },
  { id: 'chainlink',      name: 'Chainlink',       symbol: 'LINK',  emoji: '🔗', color: '#2a5ada', price:    14.22, change24h:  1.88, marketCap:  8.4e9,  volume:  0.4e9 },
  { id: 'litecoin',       name: 'Litecoin',        symbol: 'LTC',   emoji: 'Ł',  color: '#bfbbbb', price:    84.33, change24h: -0.91, marketCap:  6.3e9,  volume:  0.3e9 },
  { id: 'uniswap',        name: 'Uniswap',         symbol: 'UNI',   emoji: '🦄', color: '#ff007a', price:     9.88, change24h:  2.15, marketCap:  5.9e9,  volume:  0.3e9 },
  { id: 'stellar',        name: 'Stellar',         symbol: 'XLM',   emoji: '✦',  color: '#7d96b2', price:     0.112,change24h:  1.03, marketCap:  3.2e9,  volume:  0.2e9 },
  { id: 'monero',         name: 'Monero',          symbol: 'XMR',   emoji: '⬡',  color: '#ff6600', price:   168.50, change24h: -0.44, marketCap:  3.1e9,  volume:  0.1e9 },
  { id: 'ethereum-classic',name:'Ethereum Classic',symbol: 'ETC',   emoji: 'Ξ',  color: '#328332', price:    26.40, change24h:  0.72, marketCap:  3.0e9,  volume:  0.2e9 },
  { id: 'cosmos',         name: 'Cosmos',          symbol: 'ATOM',  emoji: '⚛',  color: '#6f4caf', price:     8.54, change24h: -1.60, marketCap:  3.3e9,  volume:  0.2e9 },
  { id: 'near',           name: 'NEAR Protocol',   symbol: 'NEAR',  emoji: '∞',  color: '#00c08b', price:     5.92, change24h:  3.44, marketCap:  6.5e9,  volume:  0.4e9 },
  { id: 'aptos',          name: 'Aptos',           symbol: 'APT',   emoji: '🅐',  color: '#2dd8a3', price:     9.14, change24h:  1.22, marketCap:  3.8e9,  volume:  0.3e9 },
  { id: 'sui',            name: 'Sui',             symbol: 'SUI',   emoji: '💧', color: '#4da2ff', price:     1.42, change24h:  6.10, marketCap:  3.6e9,  volume:  0.5e9 },
];

const FX = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.8, INR: 83.2 };

/* Coin descriptions for detail modal */
const COIN_DESC = {
  bitcoin:          'Bitcoin is the first and most well-known cryptocurrency, created in 2009 by the pseudonymous Satoshi Nakamoto. It operates on a decentralized peer-to-peer network using proof-of-work consensus.',
  ethereum:         'Ethereum is a decentralized platform that enables smart contracts and decentralized applications (dApps). It introduced programmable blockchain and is the foundation of most DeFi and NFT ecosystems.',
  tether:           'Tether (USDT) is the largest stablecoin by market cap, pegged 1:1 to the US Dollar. It provides a stable medium of exchange within the cryptocurrency ecosystem.',
  solana:           'Solana is a high-performance blockchain supporting fast, low-cost transactions through its unique Proof of History consensus. It hosts a thriving DeFi and NFT ecosystem.',
  bnb:              'BNB is the native token of the BNB Chain ecosystem, originally launched as Binance Exchange token. It powers the BNB Smart Chain and grants fee discounts on Binance.',
  xrp:              'XRP is the native digital asset on the XRP Ledger, designed for fast cross-border payments. It enables financial institutions to source liquidity for payments in emerging markets.',
  dogecoin:         'Dogecoin started as a meme cryptocurrency in 2013 but grew into a large community-driven project. It is widely used for tipping and microtransactions.',
  cardano:          'Cardano is a proof-of-stake blockchain platform built on peer-reviewed research. It aims to provide a more secure and scalable infrastructure for decentralized applications.',
  'avalanche-2':    'Avalanche is a fast, low-cost, eco-friendly blockchain with sub-second finality. It supports EVM compatibility and its unique subnet architecture enables custom blockchain deployment.',
  polkadot:         'Polkadot enables cross-blockchain transfers of any data or asset. Its parachain architecture allows specialized blockchains to interoperate securely.',
  chainlink:        'Chainlink is a decentralized oracle network that connects smart contracts with real-world data, APIs, and payment systems, enabling hybrid smart contracts.',
  litecoin:         'Litecoin is one of the earliest altcoins, designed as a lighter version of Bitcoin with faster block times and a different hashing algorithm (Scrypt).',
  uniswap:          'Uniswap is the leading decentralized exchange (DEX) on Ethereum, pioneering the automated market maker (AMM) model for permissionless token swaps.',
  stellar:          'Stellar is an open-source network for fast, low-cost cross-asset value transfers, with a focus on connecting financial institutions and reducing transaction costs.',
  monero:           'Monero is a privacy-focused cryptocurrency using ring signatures and stealth addresses to obscure transaction details, providing strong anonymity for users.',
  'ethereum-classic':'Ethereum Classic is the original Ethereum blockchain that maintained the unaltered history after the 2016 DAO hard fork, emphasizing immutability.',
  cosmos:           'Cosmos is an ecosystem of interoperable blockchains connected via the IBC protocol. It aims to create an "Internet of Blockchains" with the Tendermint consensus engine.',
  near:             'NEAR Protocol is a user-friendly, carbon-neutral blockchain with sharding technology (Nightshade) for scalability and low transaction fees.',
  aptos:            'Aptos is a Layer 1 blockchain built by former Meta/Diem engineers, using the Move programming language for safe and flexible smart contracts.',
  sui:              'Sui is a Layer 1 blockchain and smart contract platform designed for low-latency, high-throughput applications using the Move language.',
};


/* ── State ───────────────────────────────────────── */

const state = {
  coins:         JSON.parse(JSON.stringify(COINS)),
  filtered:      JSON.parse(JSON.stringify(COINS)),
  selectedId:    localStorage.getItem('cs_selectedId') || 'bitcoin',
  days:          parseInt(localStorage.getItem('cs_days'))    || 1,
  chartType:     localStorage.getItem('cs_chartType')         || 'line',
  theme:         localStorage.getItem('cs_theme')             || 'auto',
  watchlist:     JSON.parse(localStorage.getItem('cs_watch')  || '[]'),
  portfolio:     JSON.parse(localStorage.getItem('cs_port')   || '[]'),
  alerts:        JSON.parse(localStorage.getItem('cs_alerts') || '[]'),
  charts:        {},
  historyCache:  {},
  isVisible:     true,
  liveMode:      false,
  _liveInterval: null,
  _simInterval:  null,
  modalCoinId:   null,
};


/* ── Helpers ─────────────────────────────────────── */

const fmt     = n => n >= 1e12 ? '$'+(n/1e12).toFixed(2)+'T' : n >= 1e9 ? '$'+(n/1e9).toFixed(2)+'B' : '$'+(n/1e6).toFixed(2)+'M';
const fmtP    = n => n >= 1000 ? '$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}) : n >= 1 ? '$'+n.toFixed(4) : '$'+n.toFixed(6);
const fmtC    = n => (n >= 0 ? '+' : '')+n.toFixed(2)+'%';
const nowTime = () => new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
const save    = (k,v) => localStorage.setItem(k,JSON.stringify(v));
const coinById = id => state.coins.find(c => c.id === id);


/* ── Seeded Random (stable sim history) ──────────── */

function seededRandom(seed) {
  let s = seed;
  return () => { s = (s*1664525+1013904223)&0xffffffff; return (s>>>0)/0xffffffff; };
}

function makeHistory(coin, days) {
  const key = `${coin.id}_${days}`;
  if (state.historyCache[key]) return state.historyCache[key];
  const pts = days===1?48:days===7?168:360;
  const interval = (days*86400000)/pts;
  const now = Date.now();
  const seed = coin.id.split('').reduce((a,c)=>a+c.charCodeAt(0), days*997);
  const rand = seededRandom(seed);
  let p = coin.price*(0.88+rand()*0.15);
  const out = [];
  for (let i=0;i<pts;i++) { p=Math.max(p*(1+(rand()-0.488)*0.018),0.00001); out.push([now-(pts-i)*interval,p]); }
  out[out.length-1][1] = coin.price;
  state.historyCache[key] = out;
  return out;
}


/* ── Visibility API ──────────────────────────────── */

document.addEventListener('visibilitychange', () => { state.isVisible = !document.hidden; });


/* ════════════════════════════════════════════════════
   THEME — auto-detect + manual override
════════════════════════════════════════════════════ */

function resolveTheme() {
  if (state.theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return state.theme;
}

function applyTheme(theme) {
  state.theme = theme;
  const resolved = resolveTheme();
  document.documentElement.setAttribute('data-theme', resolved);
  const btn = document.getElementById('theme-btn');
  btn.textContent = theme === 'auto' ? '🔄' : resolved === 'dark' ? '🌙' : '☀️';
  btn.title = theme === 'auto' ? 'Auto theme (click to override)' : `${resolved} mode`;
  localStorage.setItem('cs_theme', theme);
}

/* Cycle: auto → dark → light → auto */
document.getElementById('theme-btn').addEventListener('click', () => {
  const next = state.theme === 'auto' ? 'dark' : state.theme === 'dark' ? 'light' : 'auto';
  applyTheme(next);
  renderPriceChart();
  if (state.charts.dist) {
    state.charts.dist.data.datasets[0].borderColor = resolveTheme()==='dark'?'#0f0f1a':'#ffffff';
    state.charts.dist.update();
  }
  showToast(next === 'auto' ? '🔄 Theme: auto-detect' : next === 'dark' ? '🌙 Dark mode' : '☀️ Light mode');
});

/* Listen for OS preference change when in auto mode */
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
  if (state.theme === 'auto') applyTheme('auto');
});


/* ════════════════════════════════════════════════════
   TAB SWITCHING
════════════════════════════════════════════════════ */

document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected','true');
    const id = 'tab-'+tab.dataset.tab;
    document.getElementById(id).classList.add('active');
    if (tab.dataset.tab==='portfolio') renderPortfolioTab();
    if (tab.dataset.tab==='watchlist') renderWatchlistTab();
    if (tab.dataset.tab==='alerts')    renderAlertsTab();
    if (tab.dataset.tab==='explore')   renderExploreTab();
  });
});

function switchTab(name) {
  document.querySelectorAll('.nav-tab').forEach(t => { if (t.dataset.tab===name) t.click(); });
}


/* ════════════════════════════════════════════════════
   MARKET TAB
════════════════════════════════════════════════════ */

function renderMetrics() {
  const c = state.coins;
  const totalMcap = c.reduce((s,x)=>s+x.marketCap,0);
  const totalVol  = c.reduce((s,x)=>s+x.volume,0);
  const gainers   = c.filter(x=>x.change24h>0).length;
  const top       = [...c].sort((a,b)=>b.change24h-a.change24h)[0];
  const btcDom    = ((c[0].marketCap/totalMcap)*100).toFixed(1);
  const avgChg    = (c.reduce((s,x)=>s+x.change24h,0)/c.length).toFixed(2);

  document.getElementById('metrics-grid').innerHTML = `
    <div class="metric-card"><div class="m-icon">🌐</div><div class="m-label">Market Cap</div><div class="m-value" style="font-size:18px">${fmt(totalMcap)}</div><div class="m-change ${avgChg>=0?'up':'down'}">${avgChg>=0?'↑':'↓'} ${avgChg>=0?'Bullish':'Bearish'}</div></div>
    <div class="metric-card"><div class="m-icon">📊</div><div class="m-label">24H Volume</div><div class="m-value" style="font-size:18px">${fmt(totalVol)}</div><div class="m-change neu">Across ${c.length} coins</div></div>
    <div class="metric-card"><div class="m-icon">🚀</div><div class="m-label">Top Gainer</div><div class="m-value" style="font-size:18px">${top.symbol}</div><div class="m-change up">${fmtC(top.change24h)} today</div></div>
    <div class="metric-card"><div class="m-icon">📈</div><div class="m-label">Coins Up</div><div class="m-value">${gainers}<span style="font-size:13px;color:var(--muted)">/${c.length}</span></div><div class="m-change ${gainers>c.length/2?'up':'down'}">${gainers>c.length/2?'↑ Bullish':'↓ Bearish'}</div></div>
    <div class="metric-card"><div class="m-icon">₿</div><div class="m-label">BTC Dominance</div><div class="m-value">${btcDom}<span style="font-size:13px;color:var(--muted)">%</span></div><div class="m-change neu">Of total market</div></div>
    <div class="metric-card"><div class="m-icon">📉</div><div class="m-label">Avg 24H Change</div><div class="m-value" style="font-size:18px">${avgChg>0?'+':''}${avgChg}<span style="font-size:13px;color:var(--muted)">%</span></div><div class="m-change ${avgChg>=0?'up':'down'}">${avgChg>=0?'Overall positive':'Overall negative'}</div></div>
  `;
}

function renderCoinList() {
  const el    = document.getElementById('coin-list');
  const coins = state.filtered;

  if (!coins.length) {
    el.innerHTML = `<div style="padding:30px 20px;text-align:center;color:var(--muted);font-size:13px">
      No coins found for "<strong>${document.getElementById('search-input').value}</strong>"<br>
      <button onclick="clearSearch()" style="margin-top:10px;background:var(--surface2);border:1px solid var(--border);color:var(--muted2);padding:5px 12px;border-radius:8px;font-size:11px;cursor:pointer;font-family:'Syne',sans-serif">Clear search</button>
    </div>`;
    return;
  }

  el.innerHTML = coins.map((c,i) => {
    const starred = state.watchlist.includes(c.id);
    const sel     = state.selectedId === c.id;
    return `<div class="coin-row ${sel?'selected':''}" role="listitem" tabindex="0" data-coin-id="${c.id}" aria-label="${c.name}, ${fmtP(c.price)}, ${fmtC(c.change24h)} today">
      <div class="c-rank">${i+1}</div>
      <div class="c-logo" style="background:${c.color}">${c.emoji}</div>
      <div class="c-info"><div class="c-name">${c.name}</div><div class="c-sym">${c.symbol}</div></div>
      <div class="c-right">
        <div class="c-price" id="cp-${c.id}">${fmtP(c.price)}</div>
        <div class="c-chg ${c.change24h>=0?'up':'down'}" id="cc-${c.id}">${fmtC(c.change24h)}</div>
      </div>
      <button class="star-btn ${starred?'active':''}" data-watch-id="${c.id}" aria-label="${starred?'Remove from':'Add to'} watchlist" aria-pressed="${starred}">${starred?'⭐':'☆'}</button>
    </div>`;
  }).join('');

  document.getElementById('coin-tags').innerHTML = state.coins.slice(0,5).map(c =>
    `<div class="ct-btn ${state.selectedId===c.id?'active':''}" data-coin-tag="${c.id}" style="cursor:pointer" role="button" tabindex="0">${c.symbol}</div>`
  ).join('');
}

function renderPriceChart() {
  const coin = coinById(state.selectedId);
  if (!coin) return;
  const resolved  = resolveTheme();
  const bg        = resolved==='dark'?'#16162a':'#ffffff';
  const gridColor = resolved==='dark'?'#1e1e35':'#ebebf8';
  const rangeLabel= state.days===1?'24H':state.days===7?'7D':'30D';

  document.getElementById('chart-subtitle').textContent = `${coin.name} · ${rangeLabel} · ${fmtP(coin.price)} (${fmtC(coin.change24h)})`;

  const ctx = document.getElementById('price-chart').getContext('2d');
  if (state.charts.price) state.charts.price.destroy();

  const history = makeHistory(coin, state.days);
  const labels  = history.map(p => {
    const d = new Date(p[0]);
    return state.days===1
      ? d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})
      : d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
  });
  const values = history.map(p=>p[1]);
  const isUp   = values[values.length-1] >= values[0];
  const color  = isUp?'#00d4aa':'#ff4d6d';
  const isBar  = state.chartType==='bar';

  const grad = ctx.createLinearGradient(0,0,0,300);
  grad.addColorStop(0, isUp?'rgba(0,212,170,0.28)':'rgba(255,77,109,0.28)');
  grad.addColorStop(1,'rgba(0,0,0,0)');

  state.charts.price = new Chart(ctx, {
    type: isBar?'bar':'line',
    data: { labels, datasets: [{ data:values, borderColor:color, borderWidth:isBar?0:2, backgroundColor:isBar?color+'88':grad, fill:!isBar, tension:0.4, pointRadius:0, pointHoverRadius:5, pointHoverBackgroundColor:color, borderRadius:isBar?4:0 }] },
    options: {
      responsive:true, maintainAspectRatio:false,
      interaction:{ intersect:false, mode:'index' },
      animation:{ duration:600, easing:'easeInOutQuart' },
      plugins: {
        legend:{ display:false },
        tooltip:{ backgroundColor:bg, borderColor:color, borderWidth:1, titleColor:resolved==='dark'?'#eeeef8':'#111128', bodyColor:color, titleFont:{family:'Syne',size:11}, bodyFont:{family:'Space Mono',size:11}, callbacks:{label:c=>' '+fmtP(c.raw)} }
      },
      scales: {
        x:{ ticks:{color:'#6868a0',font:{family:'Space Mono',size:9},maxTicksLimit:8}, grid:{color:gridColor}, border:{color:'transparent'} },
        y:{ ticks:{color:'#6868a0',font:{family:'Space Mono',size:9},callback:v=>fmtP(v)}, grid:{color:gridColor}, border:{color:'transparent'} }
      }
    }
  });
}

function renderHeatmap() {
  document.getElementById('heatmap').innerHTML = state.coins.map(c => {
    const intensity = Math.min(Math.abs(c.change24h)/8,1);
    const bg        = c.change24h>=0?`rgba(0,212,170,${0.15+intensity*0.5})`:`rgba(255,77,109,${0.15+intensity*0.5})`;
    const tc        = c.change24h>=0?'#00d4aa':'#ff4d6d';
    return `<div class="heatmap-cell" style="background:${bg}" data-heatmap-coin="${c.id}" tabindex="0" role="button" aria-label="${c.name}: ${fmtC(c.change24h)}">
      <div class="hm-sym" style="color:${tc}">${c.symbol}</div>
      <div class="hm-chg" style="color:${tc}">${fmtC(c.change24h)}</div>
      <div class="hm-price" style="color:${tc}">${fmtP(c.price)}</div>
    </div>`;
  }).join('');
}

function renderDistChart() {
  const top5   = state.coins.slice(0,5);
  const total  = state.coins.reduce((s,c)=>s+c.marketCap,0);
  const colors = ['#7c5cfc','#00d4aa','#ff6b35','#ffc542','#54a0ff'];
  document.getElementById('dist-legend').innerHTML = top5.map((c,i) =>
    `<div class="leg-item"><div class="leg-dot" style="background:${colors[i]}"></div><span class="leg-label">${c.symbol}</span><span class="leg-pct">${((c.marketCap/total)*100).toFixed(1)}%</span></div>`
  ).join('');
  const ctx = document.getElementById('dist-chart').getContext('2d');
  if (state.charts.dist) state.charts.dist.destroy();
  state.charts.dist = new Chart(ctx, {
    type:'doughnut',
    data:{ labels:top5.map(c=>c.symbol), datasets:[{data:top5.map(c=>c.marketCap),backgroundColor:colors,borderWidth:3,borderColor:resolveTheme()==='dark'?'#0f0f1a':'#ffffff',hoverOffset:6}] },
    options:{ responsive:true,maintainAspectRatio:false,cutout:'68%',animation:{duration:800},plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>` ${c.label}: ${fmt(c.raw)}`}}} }
  });
}

function renderConverter() {
  const sel = document.getElementById('conv-from');
  if (!sel.options.length) state.coins.forEach(c => { const o=document.createElement('option');o.value=c.id;o.textContent=c.symbol;sel.appendChild(o); });
  calcConvert();
}

function calcConvert() {
  const coin = coinById(document.getElementById('conv-from').value);
  const to   = document.getElementById('conv-to').value;
  const amt  = parseFloat(document.getElementById('conv-amount').value)||0;
  if (!coin||!amt) { document.getElementById('conv-result').textContent='—'; return; }
  const result = coin.price*amt*FX[to];
  const sym    = {USD:'$',EUR:'€',GBP:'£',JPY:'¥',INR:'₹'}[to]||'';
  document.getElementById('conv-result').textContent = sym+result.toLocaleString('en-US',{maximumFractionDigits:2});
  document.getElementById('conv-label').textContent  = `${amt} ${coin.symbol} = ${sym}${result.toLocaleString('en-US',{maximumFractionDigits:2})} ${to}`;
}

function renderMovers() {
  const sorted = [...state.coins].sort((a,b)=>b.change24h-a.change24h);
  const rows   = [...sorted.slice(0,3),...sorted.slice(-3).reverse()];
  document.getElementById('movers-table').innerHTML = rows.map((c,i) =>
    `<tr style="${i===3?'border-top:1px solid var(--border)':''}">
      <td style="padding:5px 4px;font-weight:700">${c.symbol}</td>
      <td style="padding:5px 4px;color:var(--muted)">${fmtP(c.price)}</td>
      <td style="padding:5px 4px;color:var(--${c.change24h>=0?'up':'down'});text-align:right">${fmtC(c.change24h)}</td>
    </tr>`
  ).join('');
}


/* ── Event Delegation ────────────────────────────── */

document.getElementById('coin-list').addEventListener('click', e => {
  const star = e.target.closest('[data-watch-id]');
  const row  = e.target.closest('[data-coin-id]');
  if (star) { e.stopPropagation(); toggleWatch(star.dataset.watchId); return; }
  if (row)  openCoinModal(row.dataset.coinId);
});

document.getElementById('coin-list').addEventListener('keydown', e => {
  if (e.key!=='Enter'&&e.key!==' ') return;
  const star = e.target.closest('[data-watch-id]');
  const row  = e.target.closest('[data-coin-id]');
  if (star) { e.preventDefault(); toggleWatch(star.dataset.watchId); return; }
  if (row)  { e.preventDefault(); openCoinModal(row.dataset.coinId); }
});

document.getElementById('heatmap').addEventListener('click', e => {
  const cell = e.target.closest('[data-heatmap-coin]');
  if (cell) { selectCoin(cell.dataset.heatmapCoin); switchTab('market'); }
});

document.getElementById('coin-tags').addEventListener('click', e => {
  const tag = e.target.closest('[data-coin-tag]');
  if (tag) selectCoin(tag.dataset.coinTag);
});


/* ════════════════════════════════════════════════════
   COIN DETAIL MODAL
════════════════════════════════════════════════════ */

async function openCoinModal(id) {
  const coin = coinById(id);
  if (!coin) return;
  state.modalCoinId = id;

  const modal = document.getElementById('coin-modal');
  const content = document.getElementById('modal-content');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Render immediately with local data
  content.innerHTML = buildModalHTML(coin, null);
  drawModalChart(coin);

  // If live, fetch extra detail from API
  if (state.liveMode && CONFIG.COINGECKO_API_KEY) {
    try {
      const res  = await fetch(`${CONFIG.API_BASE}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`, { headers: apiHeaders() });
      const data = await res.json();
      content.innerHTML = buildModalHTML(coin, data);
      drawModalChart(coin);
    } catch (_) { /* keep local render */ }
  }
}

function buildModalHTML(coin, apiData) {
  const desc    = apiData?.description?.en?.replace(/<[^>]+>/g,'') || COIN_DESC[coin.id] || 'No description available.';
  const ath     = apiData?.market_data?.ath?.usd;
  const atl     = apiData?.market_data?.atl?.usd;
  const supply  = apiData?.market_data?.circulating_supply;
  const maxSup  = apiData?.market_data?.max_supply;
  const rank    = apiData?.market_cap_rank || (state.coins.indexOf(coin)+1);
  const website = apiData?.links?.homepage?.[0];
  const twitter = apiData?.links?.twitter_screen_name;
  const reddit  = apiData?.links?.subreddit_url;

  const isUp = coin.change24h >= 0;

  return `
    <div class="modal-header">
      <div class="modal-logo" style="background:${coin.color}">${coin.emoji}</div>
      <div style="flex:1">
        <div class="modal-name">${coin.name} <span style="font-size:13px;color:var(--muted);font-weight:400;font-family:'Space Mono',monospace">${coin.symbol}</span></div>
        <div style="font-size:11px;color:var(--muted);font-family:'Space Mono',monospace">Rank #${rank}</div>
      </div>
      <div style="text-align:right">
        <div class="modal-price" style="color:${isUp?'var(--up)':'var(--down)'}">${fmtP(coin.price)}</div>
        <div class="modal-change ${isUp?'up':'down'}">${fmtC(coin.change24h)} (24H)</div>
      </div>
    </div>

    <div class="modal-stats">
      <div class="modal-stat"><div class="modal-stat-label">Market Cap</div><div class="modal-stat-value">${fmt(coin.marketCap)}</div></div>
      <div class="modal-stat"><div class="modal-stat-label">24H Volume</div><div class="modal-stat-value">${fmt(coin.volume)}</div></div>
      ${ath  ? `<div class="modal-stat"><div class="modal-stat-label">All-Time High</div><div class="modal-stat-value" style="color:var(--up)">${fmtP(ath)}</div></div>` : ''}
      ${atl  ? `<div class="modal-stat"><div class="modal-stat-label">All-Time Low</div><div class="modal-stat-value" style="color:var(--down)">${fmtP(atl)}</div></div>` : ''}
      ${supply ? `<div class="modal-stat"><div class="modal-stat-label">Circulating</div><div class="modal-stat-value">${(supply/1e6).toFixed(2)}M</div></div>` : ''}
      ${maxSup ? `<div class="modal-stat"><div class="modal-stat-label">Max Supply</div><div class="modal-stat-value">${(maxSup/1e6).toFixed(2)}M</div></div>` : ''}
    </div>

    <div class="modal-chart-wrap"><canvas id="modal-chart"></canvas></div>

    ${desc ? `<div class="modal-desc">${desc.slice(0,600)}${desc.length>600?'…':''}</div>` : ''}

    <div class="modal-links">
      ${website ? `<a class="modal-link" href="${website}" target="_blank" rel="noopener">🌐 Website</a>` : ''}
      ${twitter ? `<a class="modal-link" href="https://twitter.com/${twitter}" target="_blank" rel="noopener">𝕏 Twitter</a>` : ''}
      ${reddit  ? `<a class="modal-link" href="${reddit}"  target="_blank" rel="noopener">🟠 Reddit</a>`  : ''}
      <a class="modal-link" href="https://www.coingecko.com/en/coins/${coin.id}" target="_blank" rel="noopener">🦎 CoinGecko</a>
    </div>

    <div class="modal-actions">
      <button class="btn btn-primary" onclick="selectCoin('${coin.id}');closeModal();switchTab('market')" style="flex:1">📊 View Chart</button>
      <button class="btn btn-outline" onclick="toggleWatch('${coin.id}')" style="flex:1">${state.watchlist.includes(coin.id)?'⭐ Watchlisted':'☆ Add to Watchlist'}</button>
    </div>
  `;
}

function drawModalChart(coin) {
  requestAnimationFrame(() => {
    const canvas = document.getElementById('modal-chart');
    if (!canvas) return;
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
    const history = makeHistory(coin, 7);
    const values  = history.map(p=>p[1]);
    const labels  = history.map(p=>new Date(p[0]).toLocaleDateString('en-US',{month:'short',day:'numeric'}));
    const isUp    = values[values.length-1]>=values[0];
    const color   = isUp?'#00d4aa':'#ff4d6d';
    const resolved= resolveTheme();
    const bg      = resolved==='dark'?'#16162a':'#ffffff';
    const grad    = canvas.getContext('2d').createLinearGradient(0,0,0,200);
    grad.addColorStop(0, isUp?'rgba(0,212,170,0.25)':'rgba(255,77,109,0.25)');
    grad.addColorStop(1,'rgba(0,0,0,0)');
    new Chart(canvas.getContext('2d'), {
      type:'line',
      data:{labels,datasets:[{data:values,borderColor:color,borderWidth:2,backgroundColor:grad,fill:true,tension:0.4,pointRadius:0,pointHoverRadius:4}]},
      options:{
        responsive:true,maintainAspectRatio:false,
        interaction:{intersect:false,mode:'index'},
        plugins:{legend:{display:false},tooltip:{backgroundColor:bg,borderColor:color,borderWidth:1,bodyColor:color,bodyFont:{family:'Space Mono',size:10},callbacks:{label:c=>' '+fmtP(c.raw)}}},
        scales:{x:{display:false},y:{ticks:{color:'#6868a0',font:{family:'Space Mono',size:8},callback:v=>fmtP(v)},grid:{color:resolved==='dark'?'#1e1e35':'#ebebf8'},border:{color:'transparent'}}}
      }
    });
  });
}

function closeModal() {
  document.getElementById('coin-modal').style.display = 'none';
  document.body.style.overflow = '';
  state.modalCoinId = null;
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('coin-modal').addEventListener('click', e => { if (e.target===document.getElementById('coin-modal')) closeModal(); });
document.addEventListener('keydown', e => { if (e.key==='Escape' && state.modalCoinId) closeModal(); });


/* ════════════════════════════════════════════════════
   EXPLORE TAB
════════════════════════════════════════════════════ */

let exploreLoaded = false;

function renderExploreTab() {
  if (exploreLoaded) return; // don't re-fetch on every tab switch
  exploreLoaded = true;
  fetchFearGreed();
  fetchGlobalStats();
  fetchTrending();
  fetchNews();
}

/* ── Fear & Greed Index ──────────────────────────── */

async function fetchFearGreed() {
  try {
    // alternative.me provides a free Fear & Greed API
    const res  = await fetch('https://api.alternative.me/fng/?limit=7&format=json');
    const data = await res.json();
    renderFearGreed(data.data);
  } catch (_) {
    renderFearGreedFallback();
  }
}

function renderFearGreed(data) {
  const today   = data[0];
  const score   = parseInt(today.value);
  const label   = today.value_classification;
  const updated = new Date(today.timestamp*1000).toLocaleDateString('en-US',{month:'short',day:'numeric'});

  document.getElementById('fng-updated').textContent = `Updated ${updated}`;

  // Color based on score
  const color = score<=25?'#ff4d6d':score<=45?'#ff6b35':score<=55?'#ffc542':score<=75?'#9fdb6b':'#00d4aa';

  document.getElementById('fng-score').textContent = score;
  document.getElementById('fng-score').style.color  = color;
  document.getElementById('fng-label').textContent  = label;

  drawGauge(score, color);

  // History bars (last 7 days)
  document.getElementById('fng-history').innerHTML = data.slice(0,7).map((d,i) => {
    const s = parseInt(d.value);
    const c = s<=25?'#ff4d6d':s<=45?'#ff6b35':s<=55?'#ffc542':s<=75?'#9fdb6b':'#00d4aa';
    const label = i===0?'Today':i===1?'Yesterday':`${i}d ago`;
    return `<div class="fng-hist-row">
      <span class="fng-hist-label">${label}</span>
      <div class="fng-hist-bar-wrap"><div class="fng-hist-bar" style="width:${s}%;background:${c}"></div></div>
      <span class="fng-hist-val" style="color:${c}">${s}</span>
    </div>`;
  }).join('');
}

function renderFearGreedFallback() {
  // Use a simulated value when API is unreachable
  const score = 58 + Math.floor(Math.random()*10);
  renderFearGreed([
    { value: score, value_classification: score>60?'Greed':'Neutral', timestamp: Date.now()/1000 },
    { value: 52, value_classification:'Neutral', timestamp: (Date.now()-86400000)/1000 },
    { value: 47, value_classification:'Fear', timestamp: (Date.now()-172800000)/1000 },
    { value: 61, value_classification:'Greed', timestamp: (Date.now()-259200000)/1000 },
    { value: 55, value_classification:'Neutral', timestamp: (Date.now()-345600000)/1000 },
    { value: 42, value_classification:'Fear', timestamp: (Date.now()-432000000)/1000 },
    { value: 70, value_classification:'Greed', timestamp: (Date.now()-518400000)/1000 },
  ]);
}

function drawGauge(score, color) {
  const canvas = document.getElementById('fng-gauge');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);

  const cx=W/2, cy=H-14, r=90;
  const startAngle = Math.PI;
  const endAngle   = 2*Math.PI;

  // Background arc
  ctx.beginPath();
  ctx.arc(cx,cy,r,startAngle,endAngle);
  ctx.lineWidth = 14;
  ctx.strokeStyle = resolveTheme()==='dark'?'#1e1e35':'#e0e0f0';
  ctx.lineCap = 'round';
  ctx.stroke();

  // Gradient arc
  const grad = ctx.createLinearGradient(cx-r,cy,cx+r,cy);
  grad.addColorStop(0,'#ff4d6d');
  grad.addColorStop(0.3,'#ff6b35');
  grad.addColorStop(0.5,'#ffc542');
  grad.addColorStop(0.7,'#9fdb6b');
  grad.addColorStop(1,'#00d4aa');

  ctx.beginPath();
  ctx.arc(cx,cy,r,startAngle,startAngle+(score/100)*Math.PI);
  ctx.lineWidth = 14;
  ctx.strokeStyle = grad;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Needle
  const angle = Math.PI + (score/100)*Math.PI;
  const nx = cx + (r-20)*Math.cos(angle);
  const ny = cy + (r-20)*Math.sin(angle);
  ctx.beginPath();
  ctx.moveTo(cx,cy);
  ctx.lineTo(nx,ny);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Center dot
  ctx.beginPath();
  ctx.arc(cx,cy,5,0,Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
}

/* ── Global Stats ────────────────────────────────── */

async function fetchGlobalStats() {
  try {
    if (!CONFIG.COINGECKO_API_KEY) throw new Error('no key');
    const res  = await fetch(`${CONFIG.API_BASE}/global`, { headers: apiHeaders() });
    const data = (await res.json()).data;
    renderGlobalStats({
      totalMcap:   data.total_market_cap?.usd,
      totalVol:    data.total_volume?.usd,
      btcDom:      data.market_cap_percentage?.btc,
      ethDom:      data.market_cap_percentage?.eth,
      activeCrypto:data.active_cryptocurrencies,
      mcapChange:  data.market_cap_change_percentage_24h_usd,
    });
  } catch (_) {
    // Fallback: derive from local coin data
    const coins = state.coins;
    const totalMcap = coins.reduce((s,c)=>s+c.marketCap,0);
    const btc = coins[0], eth = coins[1];
    renderGlobalStats({
      totalMcap,
      totalVol:    coins.reduce((s,c)=>s+c.volume,0),
      btcDom:      (btc.marketCap/totalMcap)*100,
      ethDom:      (eth.marketCap/totalMcap)*100,
      activeCrypto:20,
      mcapChange:  coins.reduce((s,c)=>s+c.change24h,0)/coins.length,
    });
  }
}

function renderGlobalStats(d) {
  const up = d.mcapChange >= 0;
  document.getElementById('global-stats').innerHTML = `
    <div class="gs-row"><span class="gs-key">Total Market Cap</span><span class="gs-value">${fmt(d.totalMcap)}</span></div>
    <div class="gs-row"><span class="gs-key">24H Volume</span><span class="gs-value">${fmt(d.totalVol)}</span></div>
    <div class="gs-row"><span class="gs-key">BTC Dominance</span><span class="gs-value" style="color:var(--neutral)">${d.btcDom?.toFixed(1)}%</span></div>
    <div class="gs-row"><span class="gs-key">ETH Dominance</span><span class="gs-value" style="color:#627eea">${d.ethDom?.toFixed(1)}%</span></div>
    <div class="gs-row"><span class="gs-key">Active Cryptos</span><span class="gs-value">${d.activeCrypto?.toLocaleString()}</span></div>
    <div class="gs-row"><span class="gs-key">24H Cap Change</span><span class="gs-value" style="color:var(--${up?'up':'down'})">${up?'+':''}${d.mcapChange?.toFixed(2)}%</span></div>
  `;
}

/* ── Trending ────────────────────────────────────── */

async function fetchTrending() {
  try {
    if (!CONFIG.COINGECKO_API_KEY) throw new Error('no key');
    const res  = await fetch(`${CONFIG.API_BASE}/search/trending`, { headers: apiHeaders() });
    const data = await res.json();
    renderTrending(data.coins.slice(0,7).map(c=>c.item));
  } catch (_) {
    renderTrendingFallback();
  }
}

function renderTrending(items) {
  document.getElementById('trending-list').innerHTML = items.map((c,i) => `
    <div class="trending-item">
      <span class="trending-rank">#${i+1}</span>
      ${c.small ? `<img class="trending-logo" src="${c.small}" alt="${c.name}" onerror="this.style.display='none'">` : `<div class="trending-logo" style="background:#7c5cfc;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:700">${c.symbol?.slice(0,2)}</div>`}
      <div class="trending-info">
        <div class="trending-name">${c.name}</div>
        <div class="trending-sym">${c.symbol}</div>
      </div>
      <span class="trending-price">#${c.market_cap_rank||'—'}</span>
    </div>`).join('');
}

function renderTrendingFallback() {
  // Show top movers from local data as "trending"
  const trending = [...state.coins].sort((a,b)=>Math.abs(b.change24h)-Math.abs(a.change24h)).slice(0,7);
  document.getElementById('trending-list').innerHTML = trending.map((c,i) => `
    <div class="trending-item" onclick="selectCoin('${c.id}');switchTab('market')">
      <span class="trending-rank">#${i+1}</span>
      <div class="trending-logo" style="background:${c.color};display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;font-weight:700">${c.emoji}</div>
      <div class="trending-info">
        <div class="trending-name">${c.name}</div>
        <div class="trending-sym">${c.symbol}</div>
      </div>
      <span class="trending-price" style="color:var(--${c.change24h>=0?'up':'down'})">${fmtC(c.change24h)}</span>
    </div>`).join('');
}

/* ── News Feed ───────────────────────────────────── */

async function fetchNews() {
  const grid = document.getElementById('news-grid');
  grid.innerHTML = Array(6).fill('<div class="skeleton" style="height:140px;border-radius:14px"></div>').join('');

  try {
    // CryptoCompare has a free news endpoint - no key needed
    const res  = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=popular');
    const data = await res.json();
    if (data.Data && data.Data.length) {
      renderNews(data.Data.slice(0,12));
      return;
    }
    throw new Error('no data');
  } catch (_) {
    renderNewsFallback();
  }
}

function renderNews(articles) {
  document.getElementById('news-grid').innerHTML = articles.map(a => {
    const ago = getTimeAgo(a.published_on*1000);
    return `<a class="news-card" href="${a.url}" target="_blank" rel="noopener">
      <div class="news-source">${a.source_info?.name||a.source||'Crypto News'}</div>
      <div class="news-title">${a.title}</div>
      <div class="news-desc">${a.body?.slice(0,120)||''}</div>
      <div class="news-meta">${ago}<span class="news-dot"></span>${a.categories||'General'}</div>
    </a>`;
  }).join('');
}

function renderNewsFallback() {
  // Static placeholder cards when no API access
  const fallback = [
    { title: 'Bitcoin Tests Key Resistance After Strong Weekly Close', source: 'CoinDesk', time: '2h ago', cat: 'Bitcoin', desc: 'BTC consolidates near all-time highs as bulls look to establish new support.' },
    { title: 'Ethereum Developers Finalize Next Upgrade Timeline', source: 'The Block', time: '4h ago', cat: 'Ethereum', desc: 'Core devs confirm the next network upgrade schedule following successful testnet runs.' },
    { title: 'DeFi Total Value Locked Reaches New Monthly High', source: 'Decrypt', time: '5h ago', cat: 'DeFi', desc: 'Decentralized finance protocols see renewed capital inflows amid market optimism.' },
    { title: 'Solana NFT Volume Surges as New Collections Launch', source: 'NFT Plazas', time: '6h ago', cat: 'NFTs', desc: 'Solana-based NFT marketplaces report record trading volumes this week.' },
    { title: 'Institutional Crypto Adoption Grows in Asia-Pacific', source: 'CoinTelegraph', time: '8h ago', cat: 'Adoption', desc: 'Major financial institutions across APAC expand cryptocurrency offerings for clients.' },
    { title: 'Regulatory Clarity Expected as New Framework Proposed', source: 'Reuters', time: '10h ago', cat: 'Regulation', desc: 'Lawmakers introduce comprehensive digital asset bill aimed at defining crypto categories.' },
  ];
  document.getElementById('news-grid').innerHTML = fallback.map(a =>
    `<div class="news-card" style="cursor:default">
      <div class="news-source">${a.source}</div>
      <div class="news-title">${a.title}</div>
      <div class="news-desc">${a.desc}</div>
      <div class="news-meta">${a.time}<span class="news-dot"></span>${a.cat}</div>
    </div>`
  ).join('');
}

function getTimeAgo(ts) {
  const diff = Date.now()-ts;
  const mins = Math.floor(diff/60000);
  if (mins<60)   return `${mins}m ago`;
  if (mins<1440) return `${Math.floor(mins/60)}h ago`;
  return `${Math.floor(mins/1440)}d ago`;
}

document.getElementById('news-refresh').addEventListener('click', () => {
  exploreLoaded = false;
  renderExploreTab();
  showToast('↻ News refreshed');
});


/* ════════════════════════════════════════════════════
   WATCHLIST
════════════════════════════════════════════════════ */

function toggleWatch(id) {
  const idx = state.watchlist.indexOf(id);
  if (idx>-1) state.watchlist.splice(idx,1);
  else        state.watchlist.push(id);
  save('cs_watch',state.watchlist);
  renderCoinList();
  const coin = coinById(id);
  showToast(idx>-1?`Removed ${coin?.symbol} from watchlist`:`⭐ ${coin?.symbol} added to watchlist`);
}

function renderWatchlistTab() {
  const el      = document.getElementById('watchlist-grid');
  const watched = state.coins.filter(c=>state.watchlist.includes(c.id));

  if (state.charts.sparklines) Object.values(state.charts.sparklines).forEach(ch=>{ try{ch.destroy();}catch(_){} });
  state.charts.sparklines = {};

  if (!watched.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">⭐</div><div class="empty-text">No coins in watchlist.<br>Click ☆ next to any coin to add it.</div></div>`;
    return;
  }

  el.innerHTML = `<div class="watchlist-header" aria-hidden="true">
    <div style="width:30px;flex-shrink:0"></div>
    <span class="wh-name">Coin</span>
    <span class="wh-price" style="margin-left:auto">Price</span>
    <span class="wh-chg">24H</span>
    <span class="wh-mcap">Mkt Cap</span>
    <span class="wh-spark" style="width:80px"></span>
  </div>` + watched.map(c => `
    <div class="watch-card" data-watch-nav="${c.id}" tabindex="0" role="button">
      <div class="wc-logo" style="background:${c.color}">${c.emoji}</div>
      <div class="wc-info"><div class="wc-name">${c.name}</div><div class="wc-sym">${c.symbol}</div></div>
      <div class="wc-price" id="wc-price-${c.id}">${fmtP(c.price)}</div>
      <div class="wc-chg ${c.change24h>=0?'up':'down'}" id="wc-chg-${c.id}">${fmtC(c.change24h)}</div>
      <div class="wc-mcap">${fmt(c.marketCap)}</div>
      <canvas class="wc-spark" id="mini-${c.id}"></canvas>
    </div>`).join('');

  watched.forEach(c => {
    const h      = makeHistory(c,1).slice(-20).map(p=>p[1]);
    const isUp   = c.change24h>=0;
    const canvas = document.getElementById('mini-'+c.id);
    if (!canvas) return;
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
    state.charts.sparklines[c.id] = new Chart(canvas.getContext('2d'), {
      type:'line',
      data:{ labels:h.map((_,i)=>i), datasets:[{data:h,borderColor:isUp?'#00d4aa':'#ff4d6d',borderWidth:1.5,fill:false,tension:0.4,pointRadius:0}] },
      options:{ responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{enabled:false}},scales:{x:{display:false},y:{display:false}},animation:{duration:0},layout:{padding:2} }
    });
  });
}

document.getElementById('watchlist-grid').addEventListener('click', e => {
  const card = e.target.closest('[data-watch-nav]');
  if (card) { openCoinModal(card.dataset.watchNav); }
});

document.getElementById('watchlist-grid').addEventListener('keydown', e => {
  if (e.key!=='Enter'&&e.key!==' ') return;
  const card = e.target.closest('[data-watch-nav]');
  if (card) { e.preventDefault(); openCoinModal(card.dataset.watchNav); }
});


/* ════════════════════════════════════════════════════
   PORTFOLIO
════════════════════════════════════════════════════ */

function initPortfolioSelects() {
  ['p-coin','a-coin'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel && !sel.options.length) {
      state.coins.forEach(c => { const o=document.createElement('option');o.value=c.id;o.textContent=`${c.symbol} — ${c.name}`;sel.appendChild(o); });
    }
  });
}

document.getElementById('p-amount').addEventListener('input', e => {
  const val=parseFloat(e.target.value), hint=document.getElementById('p-amount-hint');
  if (!e.target.value) { e.target.classList.remove('invalid','valid');hint.textContent='';return; }
  if (isNaN(val)||val<=0) { e.target.classList.add('invalid');e.target.classList.remove('valid');hint.className='field-hint error';hint.textContent='Must be greater than 0'; }
  else { e.target.classList.add('valid');e.target.classList.remove('invalid');hint.className='field-hint ok';hint.textContent='✓ Valid amount'; }
});

document.getElementById('p-buy').addEventListener('input', e => {
  const val=parseFloat(e.target.value), hint=document.getElementById('p-buy-hint');
  if (!e.target.value) { e.target.classList.remove('invalid','valid');hint.textContent='';return; }
  if (isNaN(val)||val<0) { e.target.classList.add('invalid');e.target.classList.remove('valid');hint.className='field-hint error';hint.textContent='Must be a positive number'; }
  else { e.target.classList.add('valid');e.target.classList.remove('invalid');hint.className='field-hint ok';hint.textContent='✓ Valid price'; }
});

document.getElementById('a-price').addEventListener('input', e => {
  const val=parseFloat(e.target.value), hint=document.getElementById('a-price-hint');
  const coin = coinById(document.getElementById('a-coin').value);
  if (!e.target.value) { e.target.classList.remove('invalid','valid');hint.textContent='';return; }
  if (isNaN(val)||val<=0) { e.target.classList.add('invalid');e.target.classList.remove('valid');hint.className='field-hint error';hint.textContent='Must be greater than 0'; }
  else { e.target.classList.add('valid');e.target.classList.remove('invalid');hint.className='field-hint ok';hint.textContent=coin?`Current: ${fmtP(coin.price)}`:'✓ Valid'; }
});

document.getElementById('p-add-btn').addEventListener('click', () => {
  const coinId=document.getElementById('p-coin').value;
  const amtEl=document.getElementById('p-amount'), buyEl=document.getElementById('p-buy');
  const amount=parseFloat(amtEl.value), buyPrice=parseFloat(buyEl.value)||null;
  if (!amount||amount<=0) { amtEl.classList.add('invalid');document.getElementById('p-amount-hint').className='field-hint error';document.getElementById('p-amount-hint').textContent='Enter a valid amount';showToast('⚠️ Please fix errors','warn');return; }
  const existing=state.portfolio.find(h=>h.coinId===coinId);
  if (existing) { existing.amount+=amount; if(buyPrice) existing.buyPrice=buyPrice; }
  else state.portfolio.push({coinId,amount,buyPrice});
  save('cs_port',state.portfolio);
  amtEl.value='';buyEl.value='';
  amtEl.classList.remove('invalid','valid');buyEl.classList.remove('invalid','valid');
  document.getElementById('p-amount-hint').textContent='';document.getElementById('p-buy-hint').textContent='';
  renderPortfolioTab();
  showToast('✅ Holding added!');
});

document.getElementById('p-clear-btn').addEventListener('click', () => {
  if (!state.portfolio.length) return;
  state.portfolio=[];save('cs_port',state.portfolio);renderPortfolioTab();showToast('Holdings cleared');
});

function renderPortfolioTab() {
  initPortfolioSelects();
  const holdings = state.portfolio.map(h => {
    const coin=coinById(h.coinId);
    if (!coin) return null;
    const value=coin.price*h.amount, cost=h.buyPrice?h.buyPrice*h.amount:null;
    const pnl=cost?value-cost:null, pnlPct=cost?((value-cost)/cost)*100:null;
    return {...h,coin,value,cost,pnl,pnlPct};
  }).filter(Boolean);

  const totalValue=holdings.reduce((s,h)=>s+h.value,0);
  const totalCost=holdings.filter(h=>h.cost).reduce((s,h)=>s+h.cost,0);
  const totalPnl=totalCost?totalValue-totalCost:null;
  const totalPnlPct=totalCost?((totalValue-totalCost)/totalCost)*100:null;

  document.getElementById('portfolio-summary').innerHTML = `
    <div class="ps-card"><div class="ps-value">${totalValue?fmt(totalValue):'$0'}</div><div class="ps-label">Portfolio Value</div></div>
    <div class="ps-card"><div class="ps-value" style="color:${totalPnl===null?'var(--muted)':totalPnl>=0?'var(--up)':'var(--down)'}">${totalPnl===null?'N/A':fmtC(totalPnlPct)}</div><div class="ps-label">Total Return</div></div>
    <div class="ps-card"><div class="ps-value">${holdings.length}</div><div class="ps-label">Holdings</div></div>
  `;
  document.getElementById('holdings-count').textContent = holdings.length?`${holdings.length} coin${holdings.length>1?'s':''}`:'No holdings yet';

  const list=document.getElementById('holdings-list');
  if (!holdings.length) { list.innerHTML='<div class="empty-state"><div class="empty-icon">💼</div><div class="empty-text">Add your first holding above</div></div>';return; }

  list.innerHTML = holdings.map((h,i) => `
    <div class="holding-row" role="listitem">
      <div class="c-logo" style="background:${h.coin.color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff;flex-shrink:0">${h.coin.emoji}</div>
      <div class="h-info"><div class="h-name">${h.coin.name}</div><div class="h-detail">${h.amount} ${h.coin.symbol} @ ${fmtP(h.coin.price)}</div></div>
      <div class="h-right"><div class="h-value">${fmtP(h.value)}</div><div class="h-pnl ${h.pnl===null?'':h.pnl>=0?'up':'down'}">${h.pnl===null?'No buy price':fmtC(h.pnlPct)}</div></div>
      <button class="btn btn-danger" style="padding:5px 9px;font-size:11px" data-remove-holding="${i}">✕</button>
    </div>`).join('');

  const colors=['#7c5cfc','#00d4aa','#ff6b35','#ffc542','#54a0ff','#ff4d6d','#a78bfa','#34d399'];
  document.getElementById('portfolio-legend').innerHTML = holdings.map((h,i) =>
    `<div class="leg-item"><div class="leg-dot" style="background:${colors[i%colors.length]}"></div><span class="leg-label">${h.coin.symbol}</span><span class="leg-pct">${totalValue?((h.value/totalValue)*100).toFixed(1):0}%</span></div>`
  ).join('');

  const ctx=document.getElementById('portfolio-chart').getContext('2d');
  if (state.charts.portfolio) state.charts.portfolio.destroy();
  state.charts.portfolio = new Chart(ctx, {
    type:'doughnut',
    data:{ labels:holdings.map(h=>h.coin.symbol), datasets:[{data:holdings.map(h=>h.value),backgroundColor:holdings.map((_,i)=>colors[i%colors.length]),borderWidth:3,borderColor:resolveTheme()==='dark'?'#0f0f1a':'#ffffff',hoverOffset:6}] },
    options:{ responsive:true,maintainAspectRatio:false,cutout:'60%',animation:{duration:600},plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>` ${c.label}: ${fmtP(c.raw)}`}}} }
  });
}

document.getElementById('holdings-list').addEventListener('click', e => {
  const btn=e.target.closest('[data-remove-holding]');
  if (btn) { state.portfolio.splice(parseInt(btn.dataset.removeHolding),1);save('cs_port',state.portfolio);renderPortfolioTab();showToast('Holding removed'); }
});


/* ════════════════════════════════════════════════════
   ALERTS
════════════════════════════════════════════════════ */

document.getElementById('a-add-btn').addEventListener('click', () => {
  const coinId=document.getElementById('a-coin').value, cond=document.getElementById('a-cond').value;
  const priceEl=document.getElementById('a-price'), target=parseFloat(priceEl.value);
  if (!target||target<=0) { priceEl.classList.add('invalid');document.getElementById('a-price-hint').className='field-hint error';document.getElementById('a-price-hint').textContent='Enter a valid price';showToast('⚠️ Enter a valid price','warn');return; }
  const coin=coinById(coinId);
  state.alerts.push({id:Date.now(),coinId,cond,target,triggered:false,createdAt:new Date().toLocaleString()});
  save('cs_alerts',state.alerts);
  priceEl.value='';priceEl.classList.remove('invalid','valid');document.getElementById('a-price-hint').textContent='';
  renderAlertsTab();
  showToast(`🔔 Alert: ${coin.symbol} ${cond} ${fmtP(target)}`);
  updateAlertBadge();
});

document.getElementById('a-clear-btn').addEventListener('click', () => { state.alerts=[];save('cs_alerts',state.alerts);renderAlertsTab();updateAlertBadge(); });

function renderAlertsTab() {
  initPortfolioSelects();
  const el=document.getElementById('alerts-list');
  document.getElementById('alerts-count').textContent=state.alerts.length?`${state.alerts.length} alert${state.alerts.length>1?'s':''}`:' No alerts set';
  if (!state.alerts.length) { el.innerHTML='<div class="empty-state"><div class="empty-icon">🔔</div><div class="empty-text">No alerts set yet</div></div>';return; }
  el.innerHTML=state.alerts.map((a,i)=>{
    const coin=coinById(a.coinId);if(!coin)return'';
    return `<div class="alert-row ${a.triggered?'triggered':''}" role="listitem">
      <div style="font-size:20px">${a.triggered?'🔔':'🔕'}</div>
      <div class="a-info"><div class="a-title">${coin.symbol} ${a.cond==='above'?'rises above':'drops below'} ${fmtP(a.target)}</div><div class="a-detail">Current: ${fmtP(coin.price)} · Set: ${a.createdAt}</div></div>
      <span class="a-status ${a.triggered?'triggered':'active'}">${a.triggered?'TRIGGERED':'WATCHING'}</span>
      <button class="btn btn-danger" style="padding:5px 9px;font-size:11px" data-remove-alert="${i}">✕</button>
    </div>`;
  }).join('');
}

document.getElementById('alerts-list').addEventListener('click', e => {
  const btn=e.target.closest('[data-remove-alert]');
  if (btn) { state.alerts.splice(parseInt(btn.dataset.removeAlert),1);save('cs_alerts',state.alerts);renderAlertsTab();updateAlertBadge(); }
});

function checkAlerts() {
  let triggered=false;
  state.alerts.forEach(a=>{
    if(a.triggered)return;
    const coin=coinById(a.coinId);if(!coin)return;
    if((a.cond==='above'&&coin.price>=a.target)||(a.cond==='below'&&coin.price<=a.target)){
      a.triggered=true;triggered=true;showToast(`🚨 ${coin.symbol} is ${a.cond} ${fmtP(a.target)}!`,'alert');
    }
  });
  if(triggered){save('cs_alerts',state.alerts);updateAlertBadge();}
}

function updateAlertBadge() {
  const active=state.alerts.filter(a=>!a.triggered).length;
  const badge=document.getElementById('alert-count');
  if(active>0){badge.style.display='flex';badge.textContent=active;}else badge.style.display='none';
}

document.getElementById('alert-bell').addEventListener('click',()=>switchTab('alerts'));


/* ── Select Coin ─────────────────────────────────── */

function selectCoin(id) {
  state.selectedId=id;
  localStorage.setItem('cs_selectedId',id);
  Object.keys(state.historyCache).forEach(k=>{if(k.startsWith(id+'_'))delete state.historyCache[k];});
  renderCoinList();
  renderPriceChartSmart();
}


/* ── Time & Chart Type ───────────────────────────── */

document.querySelectorAll('.t-btn').forEach(b => {
  b.addEventListener('click',()=>{
    document.querySelectorAll('.t-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    state.days=parseInt(b.dataset.days);
    localStorage.setItem('cs_days',state.days);
    Object.keys(state.historyCache).forEach(k=>{if(k.startsWith(state.selectedId+'_'))delete state.historyCache[k];});
    renderPriceChartSmart();
  });
});

document.querySelectorAll('.ct-btn').forEach(b => {
  b.addEventListener('click',()=>{
    document.querySelectorAll('.ct-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    state.chartType=b.dataset.type;
    localStorage.setItem('cs_chartType',state.chartType);
    renderPriceChartSmart();
  });
});


/* ── Search ──────────────────────────────────────── */

function clearSearch() {
  document.getElementById('search-input').value='';
  document.getElementById('search-clear').style.display='none';
  state.filtered=[...state.coins];
  renderCoinList();
}

document.getElementById('search-input').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase();
  document.getElementById('search-clear').style.display=q?'block':'none';
  state.filtered=q?state.coins.filter(c=>c.name.toLowerCase().includes(q)||c.symbol.toLowerCase().includes(q)):[...state.coins];
  renderCoinList();
});

document.getElementById('search-input').addEventListener('keydown',e=>{if(e.key==='Escape')clearSearch();});
document.getElementById('search-clear').addEventListener('click',clearSearch);


/* ── Converter ───────────────────────────────────── */

['conv-amount','conv-from','conv-to'].forEach(id=>{
  document.getElementById(id).addEventListener('input',calcConvert);
  document.getElementById(id).addEventListener('change',calcConvert);
});


/* ── Export CSV ──────────────────────────────────── */

document.getElementById('export-btn').addEventListener('click',()=>{
  const h=['Rank','Name','Symbol','Price (USD)','24H Change (%)','Market Cap','Volume'];
  const rows=state.coins.map((c,i)=>[i+1,c.name,c.symbol,c.price.toFixed(6),c.change24h.toFixed(2),c.marketCap.toFixed(0),c.volume.toFixed(0)]);
  const csv=[h,...rows].map(r=>r.join(',')).join('\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download=`cryptoscope_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  showToast('✅ CSV exported!');
});


/* ── Keyboard Shortcuts ──────────────────────────── */

document.addEventListener('keydown',e=>{
  if (e.target.tagName==='INPUT'||e.target.tagName==='SELECT') return;
  if (state.modalCoinId) return; // modal handles Escape separately
  const k=e.key.toLowerCase();
  if      (k==='/')              { e.preventDefault();document.getElementById('search-input').focus(); }
  else if (k==='escape')           clearSearch();
  else if (k==='t')                document.getElementById('theme-btn').click();
  else if (k==='d')                document.querySelector('[data-days="1"]').click();
  else if (k==='w')                document.querySelector('[data-days="7"]').click();
  else if (k==='m')                document.querySelector('[data-days="30"]').click();
  else if (k==='l')                document.querySelector('[data-type="line"]').click();
  else if (k==='b')                document.querySelector('[data-type="bar"]').click();
  else if (k>='1'&&k<='9') { const idx=parseInt(k)-1; if(state.coins[idx]) selectCoin(state.coins[idx].id); }
});


/* ── Toast ───────────────────────────────────────── */

function showToast(msg,type='') {
  const existing=document.querySelectorAll('.toast');
  if(existing.length>=3) existing[0].remove();
  const t=document.createElement('div');
  t.className='toast'+(type?' '+type:'');
  t.textContent=msg;
  t.setAttribute('role','alert');
  document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity .3s';setTimeout(()=>t.remove(),300);},3200);
}


/* ════════════════════════════════════════════════════
   COINGECKO API LAYER
════════════════════════════════════════════════════ */

function apiHeaders() {
  const h={'Accept':'application/json'};
  if(CONFIG.COINGECKO_API_KEY) h['x-cg-demo-api-key']=CONFIG.COINGECKO_API_KEY;
  return h;
}

async function fetchLivePrices() {
  const ids=COINS.map(c=>c.id).join(',');
  const url=`${CONFIG.API_BASE}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=25&page=1&sparkline=false&price_change_percentage=24h`;
  const res=await fetch(url,{headers:apiHeaders()});
  if(!res.ok) throw new Error(`CoinGecko ${res.status}`);
  const data=await res.json();
  data.forEach(item=>{
    const coin=state.coins.find(c=>c.id===item.id);
    if(!coin)return;
    coin.price     = item.current_price             ?? coin.price;
    coin.change24h = item.price_change_percentage_24h ?? coin.change24h;
    coin.marketCap = item.market_cap                ?? coin.marketCap;
    coin.volume    = item.total_volume              ?? coin.volume;
  });
  state.filtered.forEach(f=>{ const l=state.coins.find(c=>c.id===f.id);if(l){f.price=l.price;f.change24h=l.change24h;f.marketCap=l.marketCap;f.volume=l.volume;} });
}

async function fetchPriceHistory(coinId, days) {
  const key=`${coinId}_${days}`;
  if(state.historyCache[key]) return state.historyCache[key];
  const res=await fetch(`${CONFIG.API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,{headers:apiHeaders()});
  if(!res.ok) throw new Error(`History ${res.status}`);
  const data=await res.json();
  state.historyCache[key]=data.prices;
  return data.prices;
}

function setApiStatus(mode) {
  const pill=document.getElementById('api-status-pill');
  const banner=document.getElementById('demo-banner');
  if(mode==='live'){
    banner.style.cssText='background:rgba(0,212,170,0.05);border-bottom:1px solid rgba(0,212,170,0.2);padding:8px 20px;text-align:center;font-size:11px;font-family:Space Mono,monospace;color:var(--up);display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;position:relative;z-index:10;transition:all 0.4s ease';
    banner.innerHTML='✅ Live data connected · <span class="api-status live"><span class="api-dot"></span>LIVE</span> · Refreshing every 60s · <button onclick="showApiKeyModal()" style="background:rgba(0,212,170,.1);border:1px solid rgba(0,212,170,.3);color:var(--up);padding:2px 8px;border-radius:5px;font-size:10px;font-family:Space Mono,monospace;cursor:pointer">⚙ Manage Key</button>';
  } else if(mode==='error'){
    banner.innerHTML='⚠️ API error — showing simulated data. <span id="api-status-pill" class="api-status demo"><span class="api-dot"></span>DEMO MODE</span> <button onclick="showApiKeyModal()" style="margin-left:6px;background:rgba(255,197,66,.1);border:1px solid rgba(255,197,66,.3);color:var(--neutral);padding:2px 8px;border-radius:5px;font-size:10px;cursor:pointer">🔑 Check Key</button>';
  }
}

function showApiKeyModal() {
  const existing=document.getElementById('api-modal');
  if(existing)existing.remove();
  const modal=document.createElement('div');
  modal.id='api-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px';
  modal.innerHTML=`
    <div style="background:var(--surface);border:1px solid var(--border2);border-radius:20px;padding:32px;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.5);animation:slideUp 0.3s ease">
      <div style="font-size:22px;font-weight:800;margin-bottom:6px">🔑 CoinGecko API Key</div>
      <div style="font-size:12px;color:var(--muted);font-family:'Space Mono',monospace;margin-bottom:20px">Free tier · 30 calls/min · No credit card needed</div>
      <ol style="font-size:13px;color:var(--muted2);line-height:2.2;margin-bottom:20px;padding-left:18px">
        <li>Go to <a href="https://www.coingecko.com/en/api" target="_blank" style="color:var(--accent2)">coingecko.com/en/api</a></li>
        <li>Click <strong style="color:var(--text)">Get Free API Key</strong></li>
        <li>Copy your <strong style="color:var(--text)">Demo API Key</strong> and paste below</li>
      </ol>
      <input type="text" id="api-key-input" placeholder="CG-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" style="width:100%;background:var(--surface2);border:1px solid var(--border2);border-radius:10px;padding:11px 14px;color:var(--text);font-family:'Space Mono',monospace;font-size:12px;outline:none;margin-bottom:8px"/>
      <div id="api-key-hint" style="font-size:11px;font-family:'Space Mono',monospace;color:var(--muted);min-height:16px;margin-bottom:16px"></div>
      <div style="display:flex;gap:10px">
        <button id="api-key-save" style="flex:1;padding:11px;border-radius:10px;background:linear-gradient(135deg,var(--accent),rgba(124,92,252,.7));color:#fff;border:none;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;cursor:pointer">✅ Save & Connect</button>
        <button id="api-key-cancel" style="padding:11px 16px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);color:var(--muted);font-family:'Syne',sans-serif;font-size:13px;cursor:pointer">Skip</button>
      </div>
      ${CONFIG.COINGECKO_API_KEY?`<button id="api-key-clear" style="width:100%;margin-top:10px;padding:8px;border-radius:10px;background:rgba(255,77,109,.1);border:1px solid rgba(255,77,109,.3);color:var(--down);font-family:'Syne',sans-serif;font-size:12px;cursor:pointer">🗑 Remove Key & Use Simulation</button>`:''}
    </div>`;
  document.body.appendChild(modal);
  if(CONFIG.COINGECKO_API_KEY) document.getElementById('api-key-input').value=CONFIG.COINGECKO_API_KEY;

  document.getElementById('api-key-save').addEventListener('click',async()=>{
    const key=document.getElementById('api-key-input').value.trim();
    const hint=document.getElementById('api-key-hint');
    if(!key){hint.style.color='var(--down)';hint.textContent='⚠️ Please enter your API key';return;}
    hint.style.color='var(--muted)';hint.textContent='⏳ Testing connection...';
    document.getElementById('api-key-save').disabled=true;
    try{
      CONFIG.COINGECKO_API_KEY=key;
      await fetchLivePrices();
      localStorage.setItem('cs_apikey',key);
      hint.style.color='var(--up)';hint.textContent='✅ Connected!';
      setTimeout(()=>{modal.remove();startLiveMode();},600);
    }catch(err){
      CONFIG.COINGECKO_API_KEY='';
      hint.style.color='var(--down)';hint.textContent='❌ Invalid key or network error. Try again.';
      document.getElementById('api-key-save').disabled=false;
    }
  });
  document.getElementById('api-key-cancel').addEventListener('click',()=>modal.remove());
  const clearBtn=document.getElementById('api-key-clear');
  if(clearBtn) clearBtn.addEventListener('click',()=>{CONFIG.COINGECKO_API_KEY='';localStorage.removeItem('cs_apikey');modal.remove();startSimMode();showToast('API key removed');});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
}

async function startLiveMode() {
  state.liveMode=true;
  setApiStatus('live');
  try{
    await fetchLivePrices();
    state.historyCache={};
    renderAll();
    showToast('✅ Live data connected!');
  }catch(err){
    setApiStatus('error');showToast('⚠️ API error','warn');startSimMode();return;
  }
  if(state._liveInterval) clearInterval(state._liveInterval);
  state._liveInterval=setInterval(async()=>{
    if(!state.isVisible)return;
    try{
      await fetchLivePrices();
      renderMetrics();renderCoinList();renderMovers();calcConvert();checkAlerts();
      updateWatchlistPrices();updateCoinListPrices();
      document.getElementById('last-update').textContent='Updated '+nowTime();
    }catch(_){}
  },CONFIG.REFRESH_INTERVAL);
  if(state._simInterval){clearInterval(state._simInterval);state._simInterval=null;}
}

function startSimMode() {
  state.liveMode=false;
  if(state._liveInterval){clearInterval(state._liveInterval);state._liveInterval=null;}
  if(state._simInterval) clearInterval(state._simInterval);
  state._simInterval=setInterval(simulateLive,CONFIG.SIMULATION_INTERVAL);
}

function updateWatchlistPrices() {
  state.watchlist.forEach(id=>{
    const coin=coinById(id);if(!coin)return;
    const p=document.getElementById('wc-price-'+id),c=document.getElementById('wc-chg-'+id);
    if(p)p.textContent=fmtP(coin.price);
    if(c){c.textContent=fmtC(coin.change24h);c.className='wc-chg '+(coin.change24h>=0?'up':'down');}
  });
}

function updateCoinListPrices() {
  state.coins.forEach(c=>{
    const p=document.getElementById('cp-'+c.id),ch=document.getElementById('cc-'+c.id);
    if(p)p.textContent=fmtP(c.price);
    if(ch){ch.textContent=fmtC(c.change24h);ch.className='c-chg '+(c.change24h>=0?'up':'down');}
  });
}

function renderAll() {
  renderMetrics();renderCoinList();renderPriceChart();renderHeatmap();renderDistChart();renderMovers();calcConvert();updateAlertBadge();
  document.getElementById('last-update').textContent='Updated '+nowTime();
}

async function renderPriceChartSmart() {
  if(!state.liveMode){renderPriceChart();return;}
  const coin=coinById(state.selectedId);if(!coin)return;
  try{
    const history=await fetchPriceHistory(coin.id,state.days);
    const resolved=resolveTheme(),bg=resolved==='dark'?'#16162a':'#ffffff',gridColor=resolved==='dark'?'#1e1e35':'#ebebf8';
    document.getElementById('chart-subtitle').textContent=`${coin.name} · ${state.days===1?'24H':state.days===7?'7D':'30D'} · ${fmtP(coin.price)} (${fmtC(coin.change24h)})`;
    const labels=history.map(p=>{const d=new Date(p[0]);return state.days===1?d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}):d.toLocaleDateString('en-US',{month:'short',day:'numeric'});});
    const values=history.map(p=>p[1]),isUp=values[values.length-1]>=values[0],color=isUp?'#00d4aa':'#ff4d6d',isBar=state.chartType==='bar';
    const ctx=document.getElementById('price-chart').getContext('2d');
    if(state.charts.price)state.charts.price.destroy();
    const grad=ctx.createLinearGradient(0,0,0,300);
    grad.addColorStop(0,isUp?'rgba(0,212,170,0.28)':'rgba(255,77,109,0.28)');grad.addColorStop(1,'rgba(0,0,0,0)');
    state.charts.price=new Chart(ctx,{
      type:isBar?'bar':'line',
      data:{labels,datasets:[{data:values,borderColor:color,borderWidth:isBar?0:2,backgroundColor:isBar?color+'88':grad,fill:!isBar,tension:0.4,pointRadius:0,pointHoverRadius:5,pointHoverBackgroundColor:color,borderRadius:isBar?4:0}]},
      options:{responsive:true,maintainAspectRatio:false,interaction:{intersect:false,mode:'index'},animation:{duration:600,easing:'easeInOutQuart'},plugins:{legend:{display:false},tooltip:{backgroundColor:bg,borderColor:color,borderWidth:1,titleColor:resolved==='dark'?'#eeeef8':'#111128',bodyColor:color,titleFont:{family:'Syne',size:11},bodyFont:{family:'Space Mono',size:11},callbacks:{label:c=>' '+fmtP(c.raw)}}},scales:{x:{ticks:{color:'#6868a0',font:{family:'Space Mono',size:9},maxTicksLimit:8},grid:{color:gridColor},border:{color:'transparent'}},y:{ticks:{color:'#6868a0',font:{family:'Space Mono',size:9},callback:v=>fmtP(v)},grid:{color:gridColor},border:{color:'transparent'}}}}
    });
  }catch(_){renderPriceChart();}
}


/* ── Simulation ──────────────────────────────────── */

function simulateLive() {
  if(!state.isVisible)return;
  state.coins.forEach(c=>{c.price=Math.max(c.price*(1+(Math.random()-0.5)*0.004),0.00001);c.change24h+=(Math.random()-0.5)*0.12;});
  state.filtered.forEach(f=>{const l=state.coins.find(c=>c.id===f.id);if(l){f.price=l.price;f.change24h=l.change24h;}});
  renderMetrics();renderCoinList();renderMovers();calcConvert();checkAlerts();
  updateWatchlistPrices();updateCoinListPrices();
  document.getElementById('last-update').textContent='Updated '+nowTime();
}


/* ── Restore Preferences ─────────────────────────── */

function restorePreferences() {
  const days=parseInt(localStorage.getItem('cs_days'))||1;
  document.querySelectorAll('.t-btn').forEach(b=>b.classList.toggle('active',parseInt(b.dataset.days)===days));
  const type=localStorage.getItem('cs_chartType')||'line';
  document.querySelectorAll('.ct-btn').forEach(b=>b.classList.toggle('active',b.dataset.type===type));
}


/* ════════════════════════════════════════════════════
   BOOT
════════════════════════════════════════════════════ */

function init() {
  // Auto-detect theme on first visit
  if (!localStorage.getItem('cs_theme')) {
    state.theme = 'auto';
  }
  applyTheme(state.theme);
  restorePreferences();
  initPortfolioSelects();
  renderConverter();
  renderMetrics();
  renderCoinList();
  renderPriceChart();
  renderHeatmap();
  renderDistChart();
  renderMovers();
  updateAlertBadge();
  document.getElementById('last-update').textContent = 'Updated '+nowTime();

  // Add API key button to banner
  const banner = document.getElementById('demo-banner');
  const keyBtn = document.createElement('button');
  keyBtn.textContent = '🔑 Add API Key';
  keyBtn.style.cssText = 'margin-left:8px;padding:3px 10px;border-radius:6px;background:rgba(124,92,252,.15);border:1px solid rgba(124,92,252,.3);color:var(--accent);font-size:10px;font-family:Space Mono,monospace;cursor:pointer';
  keyBtn.addEventListener('click', showApiKeyModal);
  banner.appendChild(keyBtn);

  if (CONFIG.COINGECKO_API_KEY) {
    startLiveMode();
  } else {
    startSimMode();
  }
}

init();