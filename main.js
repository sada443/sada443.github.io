// Start game functionality
const startScreen = document.getElementById('start-screen');
const gameContent = document.getElementById('game-content');
const startButton = document.getElementById('start-button');
const headerElement = document.getElementById('header');

// Initially pause the game loop
let gameStarted = false;

function startGame() {
    startScreen.classList.add('hidden');
    gameContent.classList.remove('hidden');
    gameContent.classList.add('fade-in');
    gameStarted = true;
    
    // Initialize game state
    state = {
        money: 0,
        clickPower: 1,
        clickUpgradeCost: 20,
        businesses: {
            lemonade: {
                count: 0,
                baseCost: 10,
                baseIncome: 0.1,
                cost: 10
            },
            coffee: {
                count: 0,
                baseCost: 50,
                baseIncome: 1,
                cost: 50
            }
        },
        animationParticles: []
    };
    
    // Initial update
    updateDisplays();
}

startButton.addEventListener('click', startGame);

// Modify your game loop to only run when the game has started
let lastUpdate = Date.now();
let intervalId;

function changeBackgroundColor() {
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  headerElement.style.backgroundColor = randomColor;
}

function gameLoop() {
  if (gameStarted) {
    
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastUpdate) / 1000; // Convert to seconds
    
    // Update money based on actual elapsed time
    state.money += calculateIncomePerSecond() * deltaTime;

    // Only update displays if values changed significantly
    if (Math.abs(deltaTime) >= 0.1) { // Update every 100ms
      updateDisplays();
      lastUpdate = currentTime;

      // Check if the count is above 100 and start changing the background color
      if (state.money > 10000 && !intervalId) {
        intervalId = setInterval(changeBackgroundColor, 1000);
      } else if (state.money <= 1000 && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        document.body.style.backgroundColor = ''; // Reset the background color
      }
    }
  }
  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);

// Initialize DOM elements
const clickPowerDisplayButton = document.getElementById('click-power-display');
const moneyDisplay = document.getElementById('count');
const clickPowerDisplay = document.getElementById('click-power');
const clickUpgradeBtn = document.getElementById('upgrade-click');
const clickUpgradeCostDisplay = document.getElementById('click-upgrade-cost');

// Business elements
const businessElements = {
  lemonade: {
      countDisplay: document.getElementById('lemonade-count'),
      costDisplay: document.getElementById('lemonade-cost'),
      buyButton: document.getElementById('buy-lemonade')
  },
  coffee: {
      countDisplay: document.getElementById('coffee-count'),
      costDisplay: document.getElementById('coffee-cost'),
      buyButton: document.getElementById('buy-coffee')
  }
};

// Helper Functions
function formatMoney(amount) {
  return amount.toFixed(2);
}

function calculateIncomePerSecond() {
  let income = 0;
  for (let [business, data] of Object.entries(state.businesses)) {
      income += data.baseIncome * data.count * data.count * data.baseIncome * data.count;  
  }
  return income;
}

function updateButtonState(button, cost) {
  const isAffordable = state.money >= cost;
  button.disabled = !isAffordable;
  
  const costSpan = button.querySelector('span');
  if (costSpan) {
      costSpan.className = isAffordable ? 'cost affordable' : 'cost';
  }
}

function createMoneyParticle(x, y, amount) {
  const particle = document.createElement('div');
  particle.className = 'money-particle';
  particle.textContent = `+丰${formatMoney(amount)}`;
  
  const randomX = x + (Math.random() - 0.5) * 40;
  const randomY = y - 20;
  
  particle.style.left = `${randomX}px`;
  particle.style.top = `${randomY}px`;
  
  document.body.appendChild(particle);
  
  setTimeout(() => {
      particle.remove();
  }, 1000);
}

// Update Functions
function updateDisplays() {
  moneyDisplay.textContent = formatMoney(state.money);
  clickPowerDisplay.textContent = formatMoney(state.clickPower);
  clickPowerDisplayButton.textContent = formatMoney(state.clickPower);
  clickUpgradeCostDisplay.textContent = formatMoney(state.clickUpgradeCost);
  
  // Update business displays
  for (let [business, elements] of Object.entries(businessElements)) {
      elements.countDisplay.textContent = state.businesses[business].count;
      elements.costDisplay.textContent = formatMoney(state.businesses[business].cost);
      updateButtonState(elements.buyButton, state.businesses[business].cost);
  }
  
  // Update upgrade button
  updateButtonState(clickUpgradeBtn, state.clickUpgradeCost);
  
  // Update income rate
  document.getElementById('income-rate').textContent = formatMoney(calculateIncomePerSecond());
}

// Event Handlers
document.getElementById('increment-btn').addEventListener('click', (e) => {
  state.money += state.clickPower;
  updateDisplays();
  
  // Create money particle
  const rect = e.target.getBoundingClientRect();
  createMoneyParticle(e.clientX, e.clientY, state.clickPower);
});

clickUpgradeBtn.addEventListener('click', () => {
  if (state.money >= state.clickUpgradeCost) {
      state.money -= state.clickUpgradeCost;
      state.clickPower *= 2;
      state.clickUpgradeCost *= 2;
      updateDisplays();
  }
  
});

// Business purchase handlers
for (let [business, elements] of Object.entries(businessElements)) {
  elements.buyButton.addEventListener('click', () => {
      let businessData = state.businesses[business];
      if (state.money >= businessData.cost) {
          state.money -= businessData.cost;
          businessData.count++;
          businessData.cost = Math.floor(businessData.baseCost * Math.pow(1.15, businessData.count));
          updateDisplays();
      }
  });
}

