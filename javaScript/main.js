class Ball {
  constructor(color, height, width, borderRadius, speed) {
    this.color = color;
    this.height = height;
    this.width = width;
    this.borderRadius = borderRadius;
    this.speed = speed;
    this.x = 0;
    this.y = 200;
    this.directionY = Math.sin((45 * Math.PI) / 180) + 1;
    this.directionX = Math.cos((45 * Math.PI) / 180) + 3;
    // Create a ball
    this.ball = document.createElement("div");
    this.ball.style.backgroundColor = this.color;
    this.ball.style.height = this.height + "px";
    this.ball.style.width = this.width + "px";
    this.ball.style.borderRadius = this.borderRadius + "%";
    this.ball.style.position = "absolute";
    this.ball.style.left = this.x + "px";
    this.ball.style.top = this.y + "px";
  }

  move() {
    this.x += this.speed * this.directionX;
    this.y += this.speed * this.directionY;
  }
  updateBall() {
    this.ball.style.left = this.x + "px";
    this.ball.style.top = this.y + "px";
  }
  checkCollisionWithWall(gameWidth, gameHeight) {
    if (this.x + this.width >= gameWidth) {
      this.directionX = -this.directionX;
    }

    if (this.x <= 0) {
      this.directionX = Math.abs(this.directionX);
    }

    if (this.y + this.height > gameHeight) {
      this.directionY = -this.directionY;
    }

    if (this.y < 0) {
      this.directionY = Math.abs(this.directionY);
    }
  }
  checkCollisionWithBrick(brick) {
    if (!brick.show) {
      return;
    }
    // const ballContainer = {
    //   width: this.width,
    //   x: this.x,
    //   y: this.y,
    // };
    // const brickContainer = {
    //   width: brick.width,
    //   height: brick.height,
    // };
    console.log(brick.show);

    if (
      this.y <= brick.y + brick.height && //balls top and bricks bottom collision
      this.x <= brick.x + brick.width && //balls left and bricks right collision
      this.y + this.height >= brick.y && //balls bottom and bricks top collision
      this.x + this.width >= brick.x
    ) {
      this.directionY = -1 * this.directionY;
      brick.show = false;
    }
  }
}
class Brick {
  constructor(color, height, width, x, y, numberOfbricks) {
    this.color = color;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.show = true;
    this.numbers = numberOfbricks;
    this.bricks = [];

    this.brick = document.createElement("div");
    this.brick.style.backgroundColor = this.color;
    this.brick.style.height = this.height + "px";
    this.brick.style.width = this.width + "px";
    this.brick.style.position = "absolute";
    this.brick.style.left = this.x + "px";
    this.brick.style.top = this.y + "px";
  }
  updateView() {
    if (this.show === false) {
      this.brick.style.display = "none";
    }

    if (this.show === true) {
      this.brick.style.display = "inline-block";
    }
  }
}
class Game {
  constructor(container, color, height, width) {
    this.color = color;
    this.height = height;
    this.width = width;

    this.container = container;

    container.style.backgroundColor = this.color;
    container.style.height = this.height + "px";
    container.style.width = this.width + "px";
    container.style.position = "absolute";

    const ball = new Ball("darkblue", 30, 30, 50, 1);
    const brick = new Brick("black", 50, 100, 300, 0, 2);
    this.ball = ball;
    this.brick = brick;
  }
  start() {
    this.container.appendChild(this.ball.ball);
    this.container.appendChild(this.brick.brick);
  }

  update() {
    this.ball.move();
    this.ball.checkCollisionWithBrick(this.brick);
    this.ball.checkCollisionWithWall(this.width, this.height);
  }

  updateView() {
    this.ball.updateBall();
    this.brick.updateView();
  }
}

const gameDiv = document.getElementById("main");
const game = new Game(gameDiv, "lightblue", 400, 500);
game.start();
// gameDiv.appendChild(brick.brick);
// gameDiv.appendChild(ball.ball);

setInterval(() => {
  // debugger;
  game.update();
  game.updateView();
}, 10);
