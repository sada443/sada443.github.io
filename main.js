console.log("Hello from the main.js file!");

// Get the main content element and the button
const mainContent = document.getElementById('main-content');
const changeColorBtn = document.getElementById('change-color-btn');

// Add a click event listener to the button
changeColorBtn.addEventListener('click', () => {
  // Generate a random hex color code
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

  // Set the background color of the main content
  mainContent.style.backgroundColor = randomColor;
});
