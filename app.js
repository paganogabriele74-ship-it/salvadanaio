const goal = 4680;
const baseMonths = [
  { month: "Dic 2025", gabri: 1400, rossi: 100 },
  { month: "Gen 2026", gabri: 207.62, rossi: 250.31 },
  { month: "Feb 2026", gabri: 120, rossi: 159 },
  { month: "Mar 2026", gabri: 136.19, rossi: 80 },
  { month: "Apr 2026", gabri: 176.65, rossi: 70.33 },
  { month: "Mag 2026", gabri: 167.96, rossi: 90.36 },
  { month: "Giu 2026", gabri: 103.64, rossi: 0 },
  { month: "Lug 2026", gabri: 0, rossi: 0 },
  { month: "Ago 2026", gabri: 0, rossi: 0 },
  { month: "Set 2026", gabri: 0, rossi: 0 },
  { month: "Ott 2026", gabri: 0, rossi: 0 },
  { month: "Nov 2026", gabri: 0, rossi: 0 },
  { month: "Dic 2026", gabri: 0, rossi: 0 },
  { month: "Gen 2027", gabri: 0, rossi: 0 },
  { month: "Feb 2027", gabri: 0, rossi: 0 },
  { month: "Mar 2027", gabri: 0, rossi: 0 }
];

const costs = [
  { name: "Volo", qty: "2 persone", total: 1720 },
  { name: "Alloggio", qty: "11 notti", total: 990 },
  { name: "Trasferimenti", qty: "1 budget", total: 150 },
  { name: "Pasti", qty: "24 pasti/giorni persona", total: 720 },
  { name: "Escursioni", qty: "2 esperienze", total: 500 },
  { name: "Visto", qty: "2 persone", total: 100 },
  { name: "Assicurazione", qty: "2 persone", total: 100 },
  { name: "Shopping & souvenir", qty: "2 quote", total: 200 },
  { name: "Extra", qty: "2 quote", total: 200 }
];

const storageKey = "salvadanaio-vacanza-depositi";
const moneyFormatter = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });
const percentFormatter = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 1 });

const elements = {
  savedTotal: document.querySelector("#savedTotal"),
  goalTotal: document.querySelector("#goalTotal"),
  remainingTotal: document.querySelector("#remainingTotal"),
  gabriTotal: document.querySelector("#gabriTotal"),
  rossiTotal: document.querySelector("#rossiTotal"),
  monthlyPace: document.querySelector("#monthlyPace"),
  progressPercent: document.querySelector("#progressPercent"),
  progressFill: document.querySelector("#progressFill"),
  monthList: document.querySelector("#monthList"),
  costList: document.querySelector("#costList"),
  expensesSummary: document.querySelector("#expensesSummary"),
  feed: document.querySelector("#depositFeed"),
  history: document.querySelector("#depositHistory"),
  form: document.querySelector("#savingForm"),
  amount: document.querySelector("#amount"),
  person: document.querySelector("#person"),
  note: document.querySelector("#note"),
  impact: document.querySelector("#impactPreview"),
  submitButton: document.querySelector(".deposit-experience .primary-button"),
  cancelEditButton: document.querySelector("#cancelEditButton"),
  menuButton: document.querySelector("#menuButton"),
  appTopbar: document.querySelector(".app-topbar"),
  homeMenuItem: document.querySelector("#homeMenuItem"),
  depositMenuItem: document.querySelector("#depositMenuItem"),
  statsMenuItem: document.querySelector("#statsMenuItem"),
  expensesMenuItem: document.querySelector("#expensesMenuItem"),
  homeViews: document.querySelectorAll(".home-view"),
  depositView: document.querySelector("#depositView"),
  statsView: document.querySelector("#statsView"),
  expensesView: document.querySelector("#expensesView"),
  statsContent: document.querySelector("#statsContent"),
  statsSwitchIndicator: document.querySelector("#statsSwitchIndicator"),
  statsTabs: document.querySelectorAll(".stats-tab"),
  bigDepositToast: document.querySelector("#bigDepositToast"),
  smallDepositToast: document.querySelector("#smallDepositToast"),
  tinyDepositToast: document.querySelector("#tinyDepositToast"),
  moneyRiseLayer: document.querySelector("#moneyRiseLayer"),
  fireworkToast: document.querySelector("#fireworkToast"),
  fireworkPhrase: document.querySelector("#fireworkPhrase"),
  fireworkLayer: document.querySelector("#fireworkLayer"),
  reset: document.querySelector("#resetButton"),
  dailyMotivation: document.querySelector("#dailyMotivation"),
  heroQuote: document.querySelector("#heroQuote"),
  heroVideoA: document.querySelector("#heroVideoA"),
  heroVideoB: document.querySelector("#heroVideoB")
};

let deposits = JSON.parse(localStorage.getItem(storageKey) || "[]");
deposits = deposits.map((item, index) => item.id ? item : { ...item, id: `old-${index}-${item.date || Date.now()}` });
localStorage.setItem(storageKey, JSON.stringify(deposits));
let editingDepositId = null;

const dailyMotivations = [
  "Ogni giorno che passa siete piu vicini alla partenza.",
  "Un piccolo deposito oggi diventa un ricordo enorme domani.",
  "State costruendo il viaggio un passo alla volta.",
  "La meta si avvicina ogni volta che mettete qualcosa da parte.",
  "Il futuro profuma gia di valigie e biglietti.",
  "Anche pochi euro contano quando il sogno e vostro.",
  "Il salvadanaio sta gia raccontando la prossima avventura."
];

const heroQuotes = [
  "Ogni deposito conta.",
  "La partenza si avvicina.",
  "State creando ricordi.",
  "Il viaggio sta nascendo.",
  "Il sogno diventa biglietto.",
  "Un passo alla volta.",
  "Sempre piu vicini."
];
const bigDepositMessages = [
  "Passo da viaggio.",
  "La meta si avvicina.",
  "Deposito importante.",
  "Bella spinta.",
  "Il salvadanaio vola.",
  "Ricordi in arrivo.",
  "Ottimo colpo.",
  "Sempre piu vicini."
];
const smallDepositMessages = [
  "Bel passo.",
  "Ottimo ritmo.",
  "Si cresce.",
  "Buon deposito.",
  "Sempre avanti.",
  "Bella mossa.",
  "Un altro pezzo.",
  "Ci sta."
];
const tinyDepositMessages = [
  "Bel salto avanti.",
  "La meta si avvicina.",
  "Questo conta davvero.",
  "Ottima spinta.",
  "State andando forte.",
  "Il viaggio ringrazia.",
  "Altro passo importante.",
  "Sempre piu vicini."
];
const fireworkMotivations = [
  "Questo deposito cambia il ritmo.",
  "Il viaggio oggi sembra molto piu vicino.",
  "State trasformando il sogno in partenza.",
  "Questa e una spinta enorme.",
  "Il salvadanaio ha appena fatto un salto."
];
let bigDepositMessageIndex = 0;
let smallDepositMessageIndex = 0;
let tinyDepositMessageIndex = 0;
let fireworkMessageIndex = 0;

let heroQuoteIndex = 0;
let activeStatsMode = "gabri";

function money(value) {
  return moneyFormatter.format(value);
}

function calculate() {
  const baseGabri = baseMonths.reduce((sum, item) => sum + item.gabri, 0);
  const baseRossi = baseMonths.reduce((sum, item) => sum + item.rossi, 0);
  const extraGabri = deposits.reduce((sum, item) => {
    if (item.person === "Gabri") return sum + item.amount;
    if (item.person === "Insieme") return sum + item.amount / 2;
    return sum;
  }, 0);
  const extraRossi = deposits.reduce((sum, item) => {
    if (item.person === "Rossi") return sum + item.amount;
    if (item.person === "Insieme") return sum + item.amount / 2;
    return sum;
  }, 0);
  const gabri = baseGabri + extraGabri;
  const rossi = baseRossi + extraRossi;
  const saved = gabri + rossi;
  return {
    gabri,
    rossi,
    saved,
    remaining: Math.max(goal - saved, 0),
    progress: Math.min((saved / goal) * 100, 100)
  };
}

function renderStats() {
  const totals = calculate();
  const emptyMonths = baseMonths.filter((item) => item.gabri + item.rossi === 0).length || 1;
  elements.savedTotal.textContent = money(totals.saved);
  elements.remainingTotal.textContent = money(totals.remaining);
  elements.gabriTotal.textContent = money(totals.gabri);
  elements.rossiTotal.textContent = money(totals.rossi);
  elements.monthlyPace.textContent = `${money(totals.remaining / emptyMonths)} / mese`;
  elements.progressPercent.textContent = `${percentFormatter.format(totals.progress)}%`;
  elements.progressFill.style.width = `${totals.progress}%`;
}

function renderMonths() {
  const activeMonths = baseMonths.filter((item) => item.gabri + item.rossi > 0);
  const lastMonth = activeMonths[activeMonths.length - 1];
  const bestMonth = activeMonths.reduce((best, item) => (item.gabri + item.rossi > best.gabri + best.rossi ? item : best), activeMonths[0]);
  const totalActive = activeMonths.reduce((sum, item) => sum + item.gabri + item.rossi, 0);
  const average = totalActive / Math.max(activeMonths.length, 1);
  const sparkMax = Math.max(...activeMonths.map((item) => item.gabri + item.rossi), 1);
  const sparkBars = activeMonths.map((item) => {
    const total = item.gabri + item.rossi;
    const height = Math.max((total / sparkMax) * 100, 8);
    return `<span style="--h:${height}%" title="${item.month}: ${money(total)}"></span>`;
  }).join("");

  elements.monthList.innerHTML = `
    <div class="quick-stat">
      <span>Ultimo mese</span>
      <strong>${lastMonth.month}</strong>
      <em>${money(lastMonth.gabri + lastMonth.rossi)}</em>
    </div>
    <div class="quick-stat">
      <span>Miglior mese</span>
      <strong>${bestMonth.month}</strong>
      <em>${money(bestMonth.gabri + bestMonth.rossi)}</em>
    </div>
    <div class="quick-stat">
      <span>Media raccolta</span>
      <strong>${money(average)}</strong>
      <em>al mese attivo</em>
    </div>
    <div class="spark-panel">
      <div>
        <span>Andamento</span>
        <strong>${activeMonths.length} mesi attivi</strong>
      </div>
      <div class="spark-bars">${sparkBars}</div>
    </div>
  `;
}

function renderCosts() {
  const maxCost = Math.max(...costs.map((item) => item.total), 1);
  const totalCost = costs.reduce((sum, item) => sum + item.total, 0);
  const biggest = costs.reduce((best, item) => item.total > best.total ? item : best, costs[0]);
  elements.expensesSummary.innerHTML = `
    <div class="expense-hero-card">
      <span>Totale previsto</span>
      <strong>${money(totalCost)}</strong>
      <em>budget completo del viaggio</em>
    </div>
    <div class="expense-side-card">
      <span>Voce piu grande</span>
      <strong>${biggest.name}</strong>
      <em>${money(biggest.total)}</em>
    </div>
  `;
  elements.costList.innerHTML = costs.map((item) => `
    <div class="cost-row premium-cost-row">
      <div>
        <div class="row-title">${item.name}</div>
        <div class="row-note">${item.qty}</div>
        <div class="bar cost-premium-bar"><span style="--w:${(item.total / maxCost) * 100}%"></span></div>
      </div>
      <div class="cost-price">
        <strong>${money(item.total)}</strong>
        <small>${percentFormatter.format((item.total / totalCost) * 100)}%</small>
      </div>
    </div>
  `).join("");
}

function renderStatsView() {
  const totals = calculate();
  const gabriShare = totals.saved ? (totals.gabri / totals.saved) * 100 : 0;
  const rossiShare = totals.saved ? (totals.rossi / totals.saved) * 100 : 0;
  const activeMonths = baseMonths.filter((item) => item.gabri + item.rossi > 0);
  const gabriAverage = totals.gabri / Math.max(activeMonths.length, 1);
  const rossiAverage = totals.rossi / Math.max(activeMonths.length, 1);
  const modes = {
    gabri: {
      label: "Gabri",
      total: totals.gabri,
      share: gabriShare,
      average: gabriAverage,
      colorClass: "mode-gabri",
      note: `${percentFormatter.format(gabriShare)}% del salvadanaio`,
      detailOne: "Quota personale",
      detailTwo: "Media mese attivo"
    },
    rossi: {
      label: "Rossi",
      total: totals.rossi,
      share: rossiShare,
      average: rossiAverage,
      colorClass: "mode-rossi",
      note: `${percentFormatter.format(rossiShare)}% del salvadanaio`,
      detailOne: "Quota personale",
      detailTwo: "Media mese attivo"
    },
    insieme: {
      label: "Insieme",
      total: totals.saved,
      share: totals.progress,
      average: totals.saved / Math.max(activeMonths.length, 1),
      colorClass: "mode-insieme",
      note: `${percentFormatter.format(totals.progress)}% dell'obiettivo`,
      detailOne: "Totale raccolto",
      detailTwo: "Media insieme"
    }
  };
  const mode = modes[activeStatsMode];
  const difference = Math.abs(totals.gabri - totals.rossi);

  elements.statsTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.stat === activeStatsMode);
  });
  moveStatsIndicator();

  elements.statsContent.innerHTML = `
    <section class="stats-hero ${mode.colorClass}">
      <div class="stats-main-copy">
        <span>${mode.label}</span>
        <strong>${money(mode.total)}</strong>
        <em>${mode.note}</em>
      </div>
      <div class="stats-orb" style="--p:${Math.min(mode.share, 100)}">
        <span>${percentFormatter.format(mode.share)}%</span>
      </div>
    </section>
    <section class="stats-cards">
      <div>
        <span>${mode.detailOne}</span>
        <strong>${money(mode.total)}</strong>
      </div>
      <div>
        <span>${mode.detailTwo}</span>
        <strong>${money(mode.average)}</strong>
      </div>
      <div>
        <span>Differenza Gabri/Rossi</span>
        <strong>${money(difference)}</strong>
      </div>
    </section>
    <section class="duel-bar">
      <div class="duel-labels">
        <span>Gabri ${percentFormatter.format(gabriShare)}%</span>
        <span>Rossi ${percentFormatter.format(rossiShare)}%</span>
      </div>
      <div class="duel-track">
        <span class="gabri-fill" style="--w:${gabriShare}%"></span>
        <span class="rossi-fill" style="--w:${rossiShare}%"></span>
      </div>
    </section>
  `;
}

function renderFeed() {
  const emptyState = `
    <div class="deposit-row">
      <div class="avatar">EUR</div>
      <div>
        <div class="row-title">Nessun deposito extra</div>
        <div class="row-note">Quando spostate soldi su Revolut, segnateli qui.</div>
      </div>
      <div class="row-value">${money(0)}</div>
    </div>
  `;

  if (!deposits.length) {
    elements.feed.innerHTML = emptyState;
    elements.history.innerHTML = emptyState;
    return;
  }

  const rows = deposits.slice().reverse().map((item) => `
    <div class="deposit-row rich-deposit-row">
      <div class="avatar ${item.person.toLowerCase()}-avatar">${item.person.slice(0, 1)}</div>
      <div class="deposit-info">
        <div class="deposit-main-line">
          <div>
            <div class="row-title">${item.person}</div>
            <div class="row-note">${item.note || "Deposito salvato"} - ${item.date}</div>
          </div>
          <div class="row-value">${money(item.amount)}</div>
        </div>
        <div class="deposit-mini-bar"><span style="--w:${Math.min((item.amount / 250) * 100, 100)}%"></span></div>
      </div>
      <div class="deposit-actions">
        <div class="deposit-buttons">
          <button class="deposit-action edit-action" type="button" data-edit-id="${item.id}" aria-label="Modifica deposito">
            <span>✎</span>
            Modifica
          </button>
          <button class="deposit-action delete-action" type="button" data-delete-id="${item.id}" aria-label="Elimina deposito">
            <span>×</span>
            Elimina
          </button>
        </div>
      </div>
    </div>
  `).join("");

  elements.feed.innerHTML = rows;
  elements.history.innerHTML = rows;
  bindDepositActions();
}

function bindDepositActions() {
  document.querySelectorAll("[data-edit-id]").forEach((button) => {
    button.addEventListener("click", () => startEditDeposit(button.dataset.editId));
  });
  document.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", () => deleteDeposit(button.dataset.deleteId));
  });
}

function renderImpact() {
  const amount = Number(elements.amount.value || 0);
  elements.impact.textContent = `+${percentFormatter.format((amount / goal) * 100)}%`;
}

function renderDailyMotivation() {
  const dayIndex = Math.floor(Date.now() / 86400000) % dailyMotivations.length;
  elements.dailyMotivation.textContent = dailyMotivations[dayIndex];
}

function rotateHeroQuote() {
  elements.heroQuote.classList.add("quote-out");
  setTimeout(() => {
    heroQuoteIndex = (heroQuoteIndex + 1) % heroQuotes.length;
    elements.heroQuote.textContent = heroQuotes[heroQuoteIndex];
    elements.heroQuote.classList.remove("quote-out");
  }, 260);
}

function saveDeposit(event) {
  event.preventDefault();
  const amount = Number(String(elements.amount.value).replace(",", "."));
  if (!amount || amount <= 0) return;
  elements.form.classList.add("is-saving");
  if (editingDepositId) {
    deposits = deposits.map((item) => item.id === editingDepositId ? {
      ...item,
      person: elements.person.value,
      amount,
      note: elements.note.value.trim()
    } : item);
  } else {
    deposits.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      person: elements.person.value,
      amount,
      note: elements.note.value.trim(),
      date: new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short" }).format(new Date())
    });
  }
  localStorage.setItem(storageKey, JSON.stringify(deposits));
  setTimeout(() => {
    elements.form.reset();
    elements.form.classList.remove("is-saving");
    stopEditDeposit();
    renderAll();
    if (amount >= 160) {
      showFireworkCelebration();
    } else if (amount >= 99.99) {
      showBigDepositToast();
      burstConfetti(120);
    } else if (amount >= 50) {
      showTinyDepositToast();
    } else {
      showSmallDepositToast();
      burstConfetti(42);
    }
  }, 720);
}

function showBigDepositToast() {
  elements.bigDepositToast.querySelector("strong").textContent = bigDepositMessages[bigDepositMessageIndex];
  bigDepositMessageIndex = (bigDepositMessageIndex + 1) % bigDepositMessages.length;
  elements.bigDepositToast.classList.remove("is-visible");
  void elements.bigDepositToast.offsetWidth;
  elements.bigDepositToast.classList.add("is-visible");
  setTimeout(() => elements.bigDepositToast.classList.remove("is-visible"), 2400);
}

function showSmallDepositToast() {
  elements.smallDepositToast.textContent = smallDepositMessages[smallDepositMessageIndex];
  smallDepositMessageIndex = (smallDepositMessageIndex + 1) % smallDepositMessages.length;
  elements.smallDepositToast.classList.remove("is-visible");
  void elements.smallDepositToast.offsetWidth;
  elements.smallDepositToast.classList.add("is-visible");
  setTimeout(() => elements.smallDepositToast.classList.remove("is-visible"), 1800);
}

function showTinyDepositToast() {
  elements.tinyDepositToast.querySelector("strong").textContent = tinyDepositMessages[tinyDepositMessageIndex];
  tinyDepositMessageIndex = (tinyDepositMessageIndex + 1) % tinyDepositMessages.length;
  elements.tinyDepositToast.classList.remove("is-visible");
  void elements.tinyDepositToast.offsetWidth;
  elements.tinyDepositToast.classList.add("is-visible");
  launchMoneyRise();
  setTimeout(() => elements.tinyDepositToast.classList.remove("is-visible"), 1600);
}

function launchMoneyRise() {
  for (let i = 0; i < 18; i += 1) {
    const bill = document.createElement("span");
    bill.className = "money-bill";
    bill.style.left = `${8 + Math.random() * 84}vw`;
    bill.style.animationDelay = `${Math.random() * 0.45}s`;
    bill.style.setProperty("--x", `${(Math.random() - 0.5) * 80}px`);
    bill.style.setProperty("--r", `${(Math.random() - 0.5) * 38}deg`);
    elements.moneyRiseLayer.append(bill);
    setTimeout(() => bill.remove(), 2100);
  }
}

function showFireworkCelebration() {
  elements.fireworkPhrase.textContent = fireworkMotivations[fireworkMessageIndex];
  fireworkMessageIndex = (fireworkMessageIndex + 1) % fireworkMotivations.length;
  elements.fireworkToast.classList.remove("is-visible", "is-second", "is-changing");
  void elements.fireworkToast.offsetWidth;
  elements.fireworkToast.classList.add("is-visible");
  launchFireworks();

  setTimeout(() => {
    elements.fireworkToast.classList.add("is-changing");
    setTimeout(() => {
      elements.fireworkPhrase.textContent = "Continua cosi.";
      elements.fireworkToast.classList.remove("is-changing");
      elements.fireworkToast.classList.add("is-second");
      launchFireworks();
    }, 420);
  }, 5000);

  setTimeout(() => {
    elements.fireworkToast.classList.remove("is-visible", "is-second", "is-changing");
  }, 8420);
}

function launchFireworks() {
  const colors = ["#ffc857", "#ff6f63", "#0aa39f", "#b9f0db", "#ffffff"];
  for (let burst = 0; burst < 5; burst += 1) {
    const x = 18 + Math.random() * 64;
    const y = 18 + Math.random() * 34;
    for (let i = 0; i < 18; i += 1) {
      const spark = document.createElement("span");
      const angle = (Math.PI * 2 * i) / 18;
      const distance = 48 + Math.random() * 44;
      spark.className = "firework-spark";
      spark.style.left = `${x}vw`;
      spark.style.top = `${y}vh`;
      spark.style.background = colors[(i + burst) % colors.length];
      spark.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      spark.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
      spark.style.animationDelay = `${burst * 0.13}s`;
      elements.fireworkLayer.append(spark);
      setTimeout(() => spark.remove(), 1600);
    }
  }
}

function startEditDeposit(id) {
  const item = deposits.find((deposit) => deposit.id === id);
  if (!item) return;
  editingDepositId = id;
  elements.person.value = item.person;
  elements.amount.value = item.amount;
  elements.note.value = item.note || "";
  elements.submitButton.textContent = "Aggiorna deposito";
  elements.cancelEditButton.classList.remove("is-hidden");
  renderImpact();
  showDeposit();
}

function stopEditDeposit() {
  editingDepositId = null;
  elements.submitButton.textContent = "Salva deposito";
  elements.cancelEditButton.classList.add("is-hidden");
}

function deleteDeposit(id) {
  deposits = deposits.filter((item) => item.id !== id);
  if (editingDepositId === id) {
    elements.form.reset();
    stopEditDeposit();
  }
  localStorage.setItem(storageKey, JSON.stringify(deposits));
  renderAll();
}

function resetDeposits() {
  deposits = [];
  localStorage.removeItem(storageKey);
  renderAll();
}

function burstConfetti(count = 24) {
  const colors = ["#ff6f63", "#ffc857", "#0aa39f", "#b9f0db", "#497c58"];
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.25}s`;
    document.body.append(piece);
    setTimeout(() => piece.remove(), 2200);
  }
}

function drawSparkles() {
  const canvas = document.querySelector("#sparkles");
  const ctx = canvas.getContext("2d");
  const dots = Array.from({ length: 42 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 2 + 0.8,
    a: Math.random() * Math.PI * 2
  }));

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach((dot) => {
      dot.a += 0.004;
      ctx.beginPath();
      ctx.arc(
        dot.x * canvas.width + Math.cos(dot.a) * 10,
        dot.y * canvas.height + Math.sin(dot.a) * 10,
        dot.r * devicePixelRatio,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.10)";
      ctx.fill();
    });
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  frame();
}

function renderAll() {
  renderStats();
  renderMonths();
  renderCosts();
  renderStatsView();
  renderFeed();
  renderImpact();
  renderDailyMotivation();
}

elements.form.addEventListener("submit", saveDeposit);
elements.amount.addEventListener("input", renderImpact);
elements.reset.addEventListener("click", resetDeposits);
elements.cancelEditButton.addEventListener("click", () => {
  elements.form.reset();
  stopEditDeposit();
  renderImpact();
});
elements.menuButton.addEventListener("click", showHome);
elements.homeMenuItem.addEventListener("click", showHome);
elements.depositMenuItem.addEventListener("click", showDeposit);
elements.statsMenuItem.addEventListener("click", showStats);
elements.expensesMenuItem.addEventListener("click", showExpenses);
elements.statsTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    if (activeStatsMode === tab.dataset.stat) return;
    activeStatsMode = tab.dataset.stat;
    animateStatsChange();
  });
});

function animateStatsChange() {
  moveStatsIndicator();
  elements.statsContent.classList.add("is-switching");
  setTimeout(() => {
    renderStatsView();
    elements.statsContent.classList.remove("is-switching");
    elements.statsContent.classList.add("has-switched");
    setTimeout(() => elements.statsContent.classList.remove("has-switched"), 420);
  }, 180);
}

function moveStatsIndicator() {
  const activeTab = [...elements.statsTabs].find((tab) => tab.dataset.stat === activeStatsMode);
  if (!activeTab || !elements.statsSwitchIndicator) return;
  elements.statsSwitchIndicator.style.width = `${activeTab.offsetWidth}px`;
  elements.statsSwitchIndicator.style.transform = `translateX(${activeTab.offsetLeft}px)`;
}

function showHome() {
  elements.homeViews.forEach((view) => view.classList.remove("is-hidden"));
  elements.depositView.classList.add("is-hidden");
  elements.statsView.classList.add("is-hidden");
  elements.expensesView.classList.add("is-hidden");
  elements.homeMenuItem.classList.add("is-active");
  elements.depositMenuItem.classList.remove("is-active");
  elements.statsMenuItem.classList.remove("is-active");
  elements.expensesMenuItem.classList.remove("is-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showDeposit() {
  elements.homeViews.forEach((view) => view.classList.add("is-hidden"));
  elements.depositView.classList.remove("is-hidden");
  elements.statsView.classList.add("is-hidden");
  elements.expensesView.classList.add("is-hidden");
  elements.homeMenuItem.classList.remove("is-active");
  elements.depositMenuItem.classList.add("is-active");
  elements.statsMenuItem.classList.remove("is-active");
  elements.expensesMenuItem.classList.remove("is-active");
  elements.depositView.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showStats() {
  elements.homeViews.forEach((view) => view.classList.add("is-hidden"));
  elements.depositView.classList.add("is-hidden");
  elements.statsView.classList.remove("is-hidden");
  elements.expensesView.classList.add("is-hidden");
  elements.homeMenuItem.classList.remove("is-active");
  elements.depositMenuItem.classList.remove("is-active");
  elements.statsMenuItem.classList.add("is-active");
  elements.expensesMenuItem.classList.remove("is-active");
  elements.statsView.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showExpenses() {
  elements.homeViews.forEach((view) => view.classList.add("is-hidden"));
  elements.depositView.classList.add("is-hidden");
  elements.statsView.classList.add("is-hidden");
  elements.expensesView.classList.remove("is-hidden");
  elements.homeMenuItem.classList.remove("is-active");
  elements.depositMenuItem.classList.remove("is-active");
  elements.statsMenuItem.classList.remove("is-active");
  elements.expensesMenuItem.classList.add("is-active");
  elements.expensesView.scrollIntoView({ behavior: "smooth", block: "start" });
}

renderAll();
drawSparkles();
setInterval(rotateHeroQuote, 30000);
window.addEventListener("resize", moveStatsIndicator);
