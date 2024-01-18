class GameObject {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Paddle extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
  }
}

class Ball extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.moveDirX = Math.random() > 0.5 ? 1 : -1;
    this.moveDirY = Math.random() > 0.5 ? 1 : -1;
    this.speed = 6;
  }
}

let volumeOn = false;
let gamePaused = false;

let volumeButton = document.getElementById("volume-button");

volumeButton.addEventListener("click", () => {
  if (volumeOn) {
    volumeButton.classList.remove("bi-volume-up");
    volumeButton.classList.add("bi-volume-mute");
  } else {
    volumeButton.classList.remove("bi-volume-mute");
    volumeButton.classList.add("bi-volume-up");
  }
  volumeOn = !volumeOn;
});

let /** @type {HTMLCanvasElement} */ canvas =
    document.getElementById("game-canvas");
canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;
let ctx = canvas.getContext("2d");
let scorePlayer1 = 0;
let scorePlayer2 = 0;
let [
  /** @type {Ball} */ ball,
  /** @type {Paddle} */ player1,
  /** @type {Paddle} */ player2,
] = gameInit(canvas, ctx);

function gameInit(
  /** @type {HTMLCanvasElement} */ canvas,
  /** @type {CanvasRenderingContext2D} */ ctx
) {
  let ball = new Ball(
    canvas.width / 2,
    canvas.height / 2,
    (canvas.width / 100) * 2,
    (canvas.width / 100) * 2
  );

  let player1 = new Paddle(
    (canvas.width / 100) * 5,
    canvas.height / 2,
    (canvas.width / 100) * 2,
    (canvas.height / 100) * 20
  );
  let player2 = new Paddle(
    (canvas.width / 100) * 94,
    canvas.height / 2,
    (canvas.width / 100) * 2,
    (canvas.height / 100) * 20
  );
  return [ball, player1, player2];
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px Arial";
  ctx.font = "30px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText(
    `Player 1: ${scorePlayer1}   Player 2: ${scorePlayer2}`,
    canvas.width / 2,
    (canvas.height / 100) * 5
  );
  if (gamePaused) {
    ctx.font = "60px 'Press Start 2P'";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
  }
  ctx.beginPath();
  ctx.rect(ball.x, ball.y, ball.width, ball.height);
  ctx.rect(player1.x, player1.y, player1.width, player1.height);
  ctx.rect(player2.x, player2.y, player2.width, player2.height);
  ctx.fillStyle = "white";
  ctx.closePath();
  ctx.fill();
}

function pauseGame() {
  gamePaused = !gamePaused;
  if (!gamePaused) {
    gameLoop();
  }
}

document.addEventListener("keydown", (e) => {
  if ((e.key === "ArrowUp" || e.key === "w") && player1.y > 0) {
    player1.y -= 10;
  } else if (
    (e.key === "ArrowDown" || e.key === "s") &&
    player1.y < canvas.height - player1.height
  ) {
    player1.y += 10;
  } else if (e.code === "Space") {
    pauseGame();
  }
});

function gameLoop() {
  // Reflection player 1
  if (
    ball.x <= player1.x + player1.width &&
    ball.x >= player1.x &&
    ball.y >= player1.y &&
    ball.y <= player1.y + player1.height
  ) {
    const playerBounceSound = new Audio("../sounds/sound2.mp3");
    if (volumeOn) {
      playerBounceSound.play();
    }
    ball.moveDirX *= -1;
  } else if (
    ball.x >= player2.x - player2.width &&
    ball.x <= player2.x &&
    ball.y >= player2.y &&
    ball.y <= player2.y + player2.height
  ) {
    const playerBounceSound = new Audio("../sounds/sound2.mp3");
    if (volumeOn) {
      playerBounceSound.play();
    }
    ball.moveDirX *= -1;
  }
  // Top and bottom
  if (ball.y <= 0 || ball.y >= canvas.height - ball.height) {
    const wallBounceSound = new Audio("../sounds/sound1.mp3");
    if (volumeOn) {
      wallBounceSound.play();
    }
    ball.moveDirY *= -1;
  }

  // Left and right
  if (ball.moveDirX === 1) {
    ball.x += ball.speed;
  } else {
    ball.x -= ball.speed;
  }

  if (ball.moveDirY === 1) {
    ball.y += ball.speed;
  } else {
    ball.y -= ball.speed;
  }

  if (ball.x <= -(canvas.width / 100) * 5) {
    scorePlayer2++;
    [
      /** @type {Ball} */ ball,
      /** @type {Paddle} */ player1,
      /** @type {Paddle} */ player2,
    ] = gameInit(canvas, ctx);
  } else if (ball.x >= canvas.width + (canvas.width / 100) * 5) {
    scorePlayer1++;
    [
      /** @type {Ball} */ ball,
      /** @type {Paddle} */ player1,
      /** @type {Paddle} */ player2,
    ] = gameInit(canvas, ctx);
  }

  if (player2.y < ball.y && player2.y < canvas.height - player2.height) {
    player2.y += 5;
  } else if (player2.y > ball.y && player2.y > 0) {
    player2.y -= 5;
  }

  draw();
  if (!gamePaused) {
    window.requestAnimationFrame(gameLoop);
  }
}
window.requestAnimationFrame(gameLoop);
