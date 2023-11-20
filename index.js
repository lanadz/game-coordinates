window.onload = () => {

  const canvas = document.getElementById('coordinate-system');
  const ctx = canvas.getContext('2d');
  const step = 25;
  let history = [];
  let mode = 'write'; // or 'plot'
  const adjustmentY = 10;

  setMode('write');
  drawCoordinateSystem();
  ({ x: generatedX, y: generatedY } = generateRandomPoint());
  renderPoint(generatedX, generatedY);

  function setMode(newMode) {
    mode = newMode;

    if (mode === 'write') {
      document.getElementById('writeCoordinates').classList.add('active');
      document.getElementById('plotPoint').classList.remove('active');
      document.getElementById('instructions').innerHTML = "Write (x, y) to get to the green point!"
      document.getElementById('x').removeAttribute('readonly');
      document.getElementById('y').removeAttribute('readonly');
      document.getElementById('jump').classList.remove('hidden');
      togglePlot();
    } else {
      document.getElementById('writeCoordinates').classList.remove('active');
      document.getElementById('plotPoint').classList.add('active');
      document.getElementById('instructions').innerHTML = "Plot a point on the coordinate system for (x,y)"
      document.getElementById('x').setAttribute('readonly', true);
      document.getElementById('y').setAttribute('readonly', true);
      document.getElementById('jump').classList.add('hidden');
      togglePlot();
    }
  }

  function drawRedBall(canvasX, canvasY) {
    const redBall = document.getElementById('redBall');
    redBall.classList.remove('hidden');
    redBall.style.left = (canvasX - 8) + 'px';
    redBall.style.top = (canvasY - 8 + adjustmentY) + 'px';

  }

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

  document.getElementById('writeCoordinates').addEventListener('click', function(e) {
    e.preventDefault();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoordinateSystem();
    ({ x: generatedX, y: generatedY } = generateRandomPoint());
    renderPoint(generatedX, generatedY);
    history = [];
    document.getElementById('result').innerHTML = '';
    document.getElementById('x').value = 0;
    document.getElementById('y').value = 0;

    setMode('write');

    redBall.classList.add('hidden');
    renderHistory();
  });

  document.getElementById('plotPoint').addEventListener('click', function(e) {
    e.preventDefault();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoordinateSystem();
    ({ x: generatedX, y: generatedY } = generateRandomPoint());
    document.getElementById('x').value = generatedX;
    document.getElementById('y').value = generatedY;
    history = [];
    document.getElementById('result').innerHTML = '';

    setMode('plot');

    redBall.classList.add('hidden');
    renderHistory();
  });

   // Guessing
   document.getElementById('jump').addEventListener('click', function(e) {
    e.preventDefault();
    let guessX = document.getElementById('x').value;
    let guessY = document.getElementById('y').value;

    // Convert guess coordinates to canvas coordinates
    let canvasX = guessX * step + canvas.width / 2;
    let canvasY = canvas.height / 2 - guessY * step;

    drawRedBall(canvasX, canvasY);
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
    document.getElementById('result').innerHTML = '';

    togglePlot();
    redBall.classList.add('hidden');
  });

  function togglePlot() {
    if (mode === 'plot') {
      document.getElementById('coordinate-system').addEventListener('click', handleClickOnCanvas);
    } else {
      document.getElementById('coordinate-system').removeEventListener('click', handleClickOnCanvas);
    }
    history = [];
    renderHistory();
  }

  function handleClickOnCanvas(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Call your function to plot a point
    plotPoint(x, y);
  }

  function plotPoint(x, y) {
    // Adjust x and y to snap to the closest integer on the coordinate system
    const adjustedX = Math.round(x / step) * step;
    const adjustedY = Math.round(y / step) * step;

    const humanX = (adjustedX - canvas.width / 2) / step;
    const humanY = (canvas.height / 2 - adjustedY) / step;
    const correctX = document.getElementById('x').value;
    const correctY = document.getElementById('y').value;

    if (humanX == correctX && humanY == correctY) {
      history.push({ x: humanX, y: humanY, status: "correct" });
      ctx.strokeStyle = 'darkred';
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(adjustedX, adjustedY, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      drawRedBall(adjustedX, adjustedY);
      ({ x: generatedX, y: generatedY } = generateRandomPoint());
      document.getElementById('x').value = generatedX;
      document.getElementById('y').value = generatedY;
    } else {
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'gray';
      ctx.beginPath();
      ctx.arc(adjustedX, adjustedY, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      history.push({ x: humanX, y: humanY, status: "incorrect" });
    }


    renderHistory();
  }
}

