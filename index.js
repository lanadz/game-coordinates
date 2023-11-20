window.onload = () => {

  const canvas = document.getElementById('coordinate-system');
  const ctx = canvas.getContext('2d');
  const step = 25;
  let history = [];

  // Draw the coordinate system
  drawCoordinateSystem();

  ({ x: generatedX, y: generatedY } = generateRandomPoint());
  renderPoint(generatedX, generatedY);
  console.log("generated point: ", generatedX, generatedY);
  const adjustmentY = 10;

  // Guessing
  document.getElementById('jump').addEventListener('click', function(e) {
    e.preventDefault();
    let guessX = document.getElementById('x').value;
    let guessY = document.getElementById('y').value;

    // Convert guess coordinates to canvas coordinates
    let canvasX = guessX * step + canvas.width / 2;
    let canvasY = canvas.height / 2 - guessY * step;

    const redBall = document.getElementById('redBall');
    redBall.classList.remove('hidden');
    redBall.style.left = (canvasX - 8) + 'px';
    redBall.style.top = (canvasY - 8 + adjustmentY) + 'px';
    // Draw projection lines
    ctx.strokeStyle = 'pink';
    ctx.beginPath();
    ctx.moveTo(canvasX, canvasY);
    ctx.lineTo(canvasX, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvasX, canvasY);
    ctx.lineTo(canvas.width / 2, canvasY);
    ctx.stroke();

    if (guessX > 10 || guessY > 10 || guessX < -10 || guessY < -10) {
      // Check if the guess is out of bounds
      drawWrongGuess(guessX, guessY)
      document.getElementById('result').innerHTML = 'RedBall flew away!';

      history.push({ x: guessX, y: guessY, status: "incorrect" });

    } else if (guessX == generatedX && guessY == generatedY) {
      document.getElementById('result').innerHTML = 'You guessed right!';
      document.getElementById('result').classList.add('green');
      document.getElementById('result').classList.remove('red');

      history.push({ x: guessX, y: guessY, status: "correct" });

      drawCorrectGuess(guessX, guessY);
      ({ x: generatedX, y: generatedY } = generateRandomPoint());
      renderPoint(generatedX, generatedY);

    } else {
      document.getElementById('result').innerHTML = 'You guessed wrong!';
      document.getElementById('result').classList.add('red');
      document.getElementById('result').classList.remove('green');

      history.push({ x: guessX, y: guessY, status: "incorrect" });
      drawWrongGuess(guessX, guessY)
    }

    renderHistory();
  });

  document.getElementById('clean').addEventListener('click', function(e) {
    e.preventDefault();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoordinateSystem();
    ({ x: generatedX, y: generatedY } = generateRandomPoint());
    renderPoint(generatedX, generatedY);
    history = [];
    document.getElementById('result').innerHTML = '';

    redBall.classList.add('hidden');
    renderHistory();
  });

  // render history
  function renderHistory() {
    const historyElement = document.getElementById('history');
    historyElement.innerHTML = ''; // Clear the history element

    history.forEach((guess, index) => {
      let ulElement = document.createElement('ul');

      const listItem = document.createElement('li');
      listItem.textContent = `${index + 1}: (${guess.x}, ${guess.y})`;

      if (guess.status === 'incorrect') {
        listItem.classList.add('incorrect');
      } else {
        listItem.classList.add('correct');
      }

      ulElement.appendChild(listItem);
      historyElement.appendChild(ulElement);
    });
  }

  function drawWrongGuess(x, y) {
    ctx.beginPath();
    ctx.strokeStyle = 'red';

    ctx.moveTo(canvas.width / 2 + x*step - 5, canvas.height / 2 - y*step - 5);
    ctx.lineTo(canvas.width / 2 + x*step + 5, canvas.height / 2 - y*step + 5);

    // Draw the second line of the cross
    ctx.moveTo(canvas.width / 2 + x*step + 5, canvas.height / 2 - y*step - 5);
    ctx.lineTo(canvas.width / 2 + x*step - 5, canvas.height / 2 - y*step + 5);

    ctx.stroke();
  }

  function drawCorrectGuess(x, y) {
    ctx.beginPath();
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.arc(canvas.width / 2 + x*step, canvas.height / 2 - y*step, 5, 0, 2 * Math.PI);
    ctx.fill();
  }

  function generateRandomPoint() {
    // Generate random coordinates
    let x = Math.floor(Math.random() * 11 - 5);
    let y = Math.floor(Math.random() * 11 - 5);
    return { x: x, y: y };
  }

  function renderPoint(x, y) {
    // Draw a point at the guessed coordinates
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.fillStyle = 'lime';
    ctx.arc(canvas.width / 2 + x*step, canvas.height / 2 - y*step, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  function drawCoordinateSystem() {
    // Draw the axes
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Draw the markers on X-axis
    for (let i = step; i < canvas.width; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, canvas.height / 2 - 5);
      ctx.lineTo(i, canvas.height / 2 + 5);
      ctx.stroke();

      // Draw the label
      let label = (i - canvas.width / 2) / step;
      ctx.fillText(label, i - 5, canvas.height / 2 - 10);
    }

    // Draw the markers on Y-axis
    for (let i = step; i < canvas.height; i += step) {
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 5, i);
      ctx.lineTo(canvas.width / 2 + 5, i);
      ctx.stroke();

      // Draw the label
      let label = (canvas.height / 2 - i) / step;
      ctx.fillText(label, canvas.width / 2 + 10, i + 5);
    }

    // Draw arrow on axis-X
    ctx.beginPath();
    ctx.moveTo(canvas.width - 10, canvas.height / 2 - 5);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.lineTo(canvas.width - 10, canvas.height / 2 + 5);
    ctx.stroke();

    // Draw arrow on axis-Y
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 5, 10);
    ctx.lineTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2 + 5, 10);
    ctx.stroke();
  }

  document.getElementById('writeCoordinates').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoordinateSystem();
    ({ x: generatedX, y: generatedY } = generateRandomPoint());
    renderPoint(generatedX, generatedY);
    history = [];
    document.getElementById('result').innerHTML = '';

    redBall.classList.add('hidden');
    renderHistory();
  });
}
