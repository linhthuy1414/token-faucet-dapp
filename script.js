const STORAGE_KEY = 'token-faucet-dapp';
const CLAIM_AMOUNT = 10;
const COOLDOWN_MS = 30 * 1000;

const connectWalletButton = document.getElementById('connect-wallet');
const claimTokenButton = document.getElementById('claim-token');
const walletStatus = document.getElementById('wallet-status');
const tokenBalance = document.getElementById('token-balance');
const claimCount = document.getElementById('claim-count');
const claimStatus = document.getElementById('claim-status');
const historyList = document.getElementById('history-list');
const emptyState = document.getElementById('empty-state');
const resetDataButton = document.getElementById('reset-data');

let appState = loadState();
let timer = null;

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {
    wallet: '',
    balance: 0,
    claimCount: 0,
    lastClaimAt: null,
    history: [],
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function createMockWallet() {
  const random = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `0x${random}`;
}

function shortenWallet(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getRemainingSeconds() {
  if (!appState.lastClaimAt) return 0;
  const diff = COOLDOWN_MS - (Date.now() - appState.lastClaimAt);
  return Math.max(0, Math.ceil(diff / 1000));
}

function renderHistory() {
  historyList.innerHTML = '';

  if (appState.history.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  appState.history.slice().reverse().forEach((item) => {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `
      <div class="history-left">
        <strong>+${item.amount} TEST</strong>
        <span>${item.wallet}</span>
      </div>
      <div class="history-right">
        <strong>${item.hash}</strong>
        <span>${item.time}</span>
      </div>
    `;
    historyList.appendChild(li);
  });
}

function updateCooldownView() {
  const seconds = getRemainingSeconds();

  if (!appState.wallet) {
    claimStatus.textContent = 'Chưa sẵn sàng';
    claimTokenButton.disabled = true;
    return;
  }

  if (seconds > 0) {
    claimStatus.textContent = `Chờ ${seconds} giây để nhận tiếp`;
    claimTokenButton.disabled = true;
  } else {
    claimStatus.textContent = 'Có thể nhận token';
    claimTokenButton.disabled = false;
  }
}

function renderApp() {
  walletStatus.textContent = appState.wallet
    ? `Đã kết nối ví: ${shortenWallet(appState.wallet)}`
    : 'Chưa kết nối ví.';
  tokenBalance.textContent = `${appState.balance} TEST`;
  claimCount.textContent = String(appState.claimCount);
  connectWalletButton.textContent = appState.wallet ? 'Đổi ví mô phỏng' : 'Kết nối ví';
  renderHistory();
  updateCooldownView();
}

function startCooldownTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    updateCooldownView();
    if (getRemainingSeconds() <= 0 && appState.wallet) {
      clearInterval(timer);
      timer = null;
      updateCooldownView();
    }
  }, 1000);
}

connectWalletButton.addEventListener('click', () => {
  appState.wallet = createMockWallet();
  saveState();
  renderApp();
});

claimTokenButton.addEventListener('click', () => {
  if (!appState.wallet || getRemainingSeconds() > 0) {
    return;
  }

  appState.balance += CLAIM_AMOUNT;
  appState.claimCount += 1;
  appState.lastClaimAt = Date.now();
  appState.history.push({
    amount: CLAIM_AMOUNT,
    wallet: shortenWallet(appState.wallet),
    hash: `0x${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`,
    time: new Date().toLocaleString('vi-VN'),
  });

  saveState();
  renderApp();
  startCooldownTimer();
});

resetDataButton.addEventListener('click', () => {
  const confirmed = window.confirm('Ông chủ có chắc muốn xóa toàn bộ dữ liệu mô phỏng không?');
  if (!confirmed) return;

  appState = {
    wallet: '',
    balance: 0,
    claimCount: 0,
    lastClaimAt: null,
    history: [],
  };

  saveState();
  renderApp();
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

renderApp();
if (appState.wallet && getRemainingSeconds() > 0) {
  startCooldownTimer();
}
