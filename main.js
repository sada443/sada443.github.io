const countDisplay = document.getElementById('count');
const incrementBtn = document.getElementById('increment-btn');

let count = 0;

incrementBtn.addEventListener('click', () => {
  count++;
  countDisplay.textContent = count;
});
