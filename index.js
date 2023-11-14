window.onload = () => {
  container = document.getElementById('grid');
  // we have 1444 squares, 38 squares in a row and 38 rows
  // origin will be in the middle of the grid meaning 19 * 38 + 19 = 741
  const totalSquares = 1444;

  for (i = 0; i < totalSquares; i++) {
    let div = container.appendChild(document.createElement('div'));
    div.style.left = `${(i % 38) * 20}px`;
    div.style.top = `${Math.floor(i / 38) * 20}px`;
  }

  const boundaryModCoordinate = 19;
  const originDivIndex = totalSquares/2 - boundaryModCoordinate ;
  const axisStartIndex = originDivIndex - boundaryModCoordinate;
  const axisEndIndex = originDivIndex + boundaryModCoordinate;
  const rowColCount = 38;
  const redBallSize = 30;
  let stateX = 0;
  let stateY = 0;

  const redBall = document.getElementById('redBall')

  let origin = container.children[originDivIndex];
  origin.classList.add('origin');

  // Axis X
  let axisX = [];

  for (let i = axisStartIndex; i < axisEndIndex; i++) {
  axisX.push(container.children[i]);
  }
  axisX.forEach((sq) => sq.classList.add('thick-line-bottom'));

  // Axis Y
  let axisY = [];

  for (let i = 0; i < totalSquares; i += boundaryModCoordinate) {
    if (i % 2 == 1 ){ // to avoid drawing the second line
      axisY.push(container.children[i]);
    }
  }
  axisY.forEach((sq) => sq.classList.add('thick-line-left'));

  // Draw arrow x
  container.children[originDivIndex + boundaryModCoordinate - 1].classList.add('right-axis-end');
  const arrowRight = container.appendChild(document.createElement('div'));
  arrowRight.classList.add('arrow-right');

  // Draw arrow y
  container.children[boundaryModCoordinate + 1 ].classList.add('top-axis-end');
  const arrowUp = container.appendChild(document.createElement('div'));
  arrowUp.classList.add('arrow-up');

  function moveBall(xVal, yVal) {
    let x = 0;
    let y = 0;
    [x, y] = convertToGridCoordinates(xVal, yVal);
    [x, y] = shiftForBallSize(x, y);

    return [x, y];
  }

  function shiftForBallSize(x, y) {
    x = x - redBallSize / 2;
    return [x, y];
  }

  function render(el, x, y) {
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }

  function convertToGridCoordinates(x,y) {
    let xGrid = 0;
    let yGrid= 0;

    if (x > -boundaryModCoordinate && x < boundaryModCoordinate &&
      y > -boundaryModCoordinate && y < boundaryModCoordinate) {
      xGrid = boundaryModCoordinate * 20 + x * 20;
      yGrid= boundaryModCoordinate * 20 - (y + 1) * 20;

    } else {
      alert('Red ball fell off the grid. Please try again.');
    }

  return [xGrid, yGrid];
  }

  // Form and coords input handling
  const form=document.getElementById("coords");

  function submitForm(event) {
    let xVal = parseInt(form.x.value);
    let yVal = parseInt(form.y.value);
    event.preventDefault();
    render(redBall, ...moveBall(xVal, yVal));
    validate(xVal, yVal);
  }

  form.addEventListener('submit', submitForm);

  // Initial render
  render(redBall, ...moveBall(0, 0));

  // block spawning
  const block = document.getElementById('block');

  function spawnBlock() {
    let xVal = Math.floor(Math.random() * 36) - 18;
    let yVal = Math.floor(Math.random() * 36) - 18;
    [x, y] = convertToGridCoordinates(xVal, yVal);
    block.classList.remove('hidden');
    render(block, x - 18, y + 20);

    const point = document.getElementById('point');
    render(point, x - 3, y + 17);

    return [xVal, yVal];
  }

  function generate() {
    [x, y] = spawnBlock();
    const instructions = document.getElementById('instructions');
    instructions.innerHTML = `(${x}, ${y})`;
    return [x, y];
  }

  [stateX, stateY] = generate();

  function validate(x, y) {
    let xVal = parseInt(form.x.value);
    let yVal = parseInt(form.y.value);

    if (xVal == stateX && yVal == stateY) {
      [stateX, stateY] = generate();
    }
  }

  // not needed atm
  function convertedToSingleIndex(xVal, yVal) {
    // bottom left
    return -yVal * rowColCount + xVal + originDivIndex;
  }
}
