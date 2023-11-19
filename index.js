window.onload = () => {

  const canvas = document.getElementById('coordinate-system');
  const ctx = canvas.getContext('2d');
  const step = 25;

  // Draw the axes
  ctx.beginPath();
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

  document.getElementById('jump').addEventListener('click', function(e) {
    e.preventDefault();
    let guessX = document.getElementById('x').value;
    let guessY = document.getElementById('y').value;

    // Convert guess coordinates to canvas coordinates
    let canvasX = guessX * step + canvas.width / 2;
    let canvasY = canvas.height / 2 - guessY * step;

    const redBall = document.getElementById('redBall');
    redBall.classList.remove('hidden');
    redBall.style.left = canvasX - 8 + 'px';
    redBall.style.top = canvasY - 8 + 'px';
    // Draw projection lines
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(canvasX, canvasY);
    ctx.lineTo(canvasX, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvasX, canvasY);
    ctx.lineTo(canvas.width / 2, canvasY);
    ctx.stroke();

    if (guessX == generatedX && guessY == generatedY) {
      document.getElementById('result').innerHTML = 'You guessed right!';
    } else {
      document.getElementById('result').innerHTML = 'You guessed wrong!';
    }
  });

  function generateRandomPoint() {
    // Generate random coordinates
    let x = Math.floor(Math.random() * 11 - 5);
    let y = Math.floor(Math.random() * 11 - 5);
    // Draw a point at the guessed coordinates
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.arc(canvas.width / 2 + x*step, canvas.height / 2 - y*step, 5, 0, 2 * Math.PI);
    ctx.fill();
    return { x: x, y: y };
  }

  ({ x: generatedX, y: generatedY } = generateRandomPoint());
  console.log("generated point: ", generatedX, generatedY);
}
