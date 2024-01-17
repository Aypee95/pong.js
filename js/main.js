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
  }
}

let font = new FontFace(
  "PressStart2P",
  "url(../../../static/fonts/PressStart2P-Regular.ttf)"
);
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
  font.load().then((font) => {
    document.fonts.add(font);
    console.log("Font loaded");
    ctx.font = "30px PressStart2P";
    ctx.textAlign = "center";
    ctx.fillText(
      `Player 1: ${scorePlayer1}   Player 2: ${scorePlayer2}`,
      canvas.width / 2,
      (canvas.height / 100) * 5
    );
  });
  ctx.beginPath();
  ctx.rect(ball.x, ball.y, ball.width, ball.height);
  ctx.rect(player1.x, player1.y, player1.width, player1.height);
  ctx.rect(player2.x, player2.y, player2.width, player2.height);
  ctx.fillStyle = "white";
  ctx.closePath();
  ctx.fill();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "w") {
    player1.y -= 10;
  } else if (e.key === "ArrowDown" || e.key === "s") {
    player1.y += 10;
  }
});

function gameLoop() {
  // Reflection player 1
  if (
    ball.x <= player1.x &&
    ball.y >= player1.y &&
    ball.y <= player1.y + player1.height
  ) {
    ball.moveDirX *= -1;
  }
  // Reflection player 2
  if (
    ball.x >= player2.x &&
    ball.y >= player2.y &&
    ball.y <= player2.y + player2.height
  ) {
    ball.moveDirX *= -1;
  }
  // Top and bottom
  if (ball.y <= 0 || ball.y >= canvas.height - ball.height) {
    ball.moveDirY *= -1;
  }
  // Left and right

  if (ball.moveDirX === 1) {
    ball.x += 5;
  } else {
    ball.x -= 5;
  }

  if (ball.moveDirY === 1) {
    ball.y += 5;
  } else {
    ball.y -= 5;
  }

  if (ball.x <= 0) {
    scorePlayer2++;
    ball = undefined;
    player1 = undefined;
    player2 = undefined;
    [
      /** @type {Ball} */ ball,
      /** @type {Paddle} */ player1,
      /** @type {Paddle} */ player2,
    ] = gameInit(canvas, ctx);
  } else if (ball.x >= canvas.width - ball.width) {
    scorePlayer1++;
    ball = undefined;
    player1 = undefined;
    player2 = undefined;
    [
      /** @type {Ball} */ ball,
      /** @type {Paddle} */ player1,
      /** @type {Paddle} */ player2,
    ] = gameInit(canvas, ctx);
  }

  console.log(ball);
  draw();
  window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);
