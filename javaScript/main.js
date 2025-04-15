class Game {
  constructor(container, color, height, width, levelData) {
    this.color = color;
    this.height = height;
    this.width = width;
    this.container = container;
    this.level = new Level(levelData);
    container.style.backgroundColor = this.color;
    container.style.height = this.height + "px";
    container.style.width = this.width + "px";
    container.style.position = "relative";

    this.ball = new Ball("darkblue", 30, 30, 50, 2);
    this.brickList = this.level.bricks;
    this.paddle = new Paddle("darkred", 15, 120, 20);
  }
  start() {
    this.container.appendChild(this.ball.ball);
    this.brickList.forEach((brick) => {
      this.container.appendChild(brick.dom);
    });

    this.container.appendChild(this.paddle.paddle);
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      console.log(key);
      switch (key) {
        case "ArrowLeft":
          this.paddle.moveLeft();
          break;
        case "ArrowRight":
          this.paddle.moveRight(this.width);
          break;
      }
    });
  }

  update() {
    this.ball.move();
    this.ball.checkCollisionWithBricks(this.brickList);
    this.ball.checkCollisionWithWall(this.width, this.height);
    this.ball.checkCollisionWithPaddle(this.paddle);
  }

  updateView() {
    this.ball.updateBall();
    this.brickList.forEach((brick) => {
      brick.updateView();
    });
  }
}
class Score {
  constructor(container, bricks) {
    container.height = "50px";
    container.width = "100px";
    container.innerHTML = "SCORE" + this.score(bricks);
    container.classList.add("score");
    this.updateScore(container, bricks);
  }

  updateScore(container, bricks) {
    const currentScore = this.score(bricks);
    container.innerHTML = "SCORE: " + currentScore;
  }
  score(bricks) {
    let scoreid = 0;
    bricks.forEach((brick) => {
      if (!brick.show) {
        scoreid++;
      }
    });
    return scoreid;
  }
}
class Ball {
  constructor(color, height, width, borderRadius, speed) {
    this.color = color;
    this.height = height;
    this.width = width;
    this.borderRadius = borderRadius;
    this.speed = speed;
    this.x = 200;
    this.y = 250;
    this.directionY = -Math.sin((45 * Math.PI) / 180);
    this.directionX = -Math.cos((45 * Math.PI) / 180);
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
      alert("GAMEOVER!");
      score.updateScore(scoreDiv, game.brickList);
      clearInterval(interval);
      interval = null;
      game.ball.x = 200;
      game.ball.y = 250;
      game.ball.directionX = -Math.cos((45 * Math.PI) / 180);
      game.ball.directionY = -Math.sin((45 * Math.PI) / 180);
      game.brickList.forEach((brick) => {
        brick.show = true;
        brick.updateView();
      });
      game.updateView();
    }

    if (this.y < 0) {
      this.directionY = Math.abs(this.directionY);
    }
  }
  checkCollisionWithBricks(bricks) {
    bricks.forEach((brick) => {
      if (!brick.show) {
        return;
      }

      if (
        this.y <= brick.y + brick.height && //balls top and bricks bottom collision
        this.x <= brick.x + brick.width && //balls left and bricks right collision
        this.y + this.height >= brick.y && //balls bottom and bricks top collision
        this.x + this.width >= brick.x
      ) {
        this.directionY = -1 * this.directionY;
        brick.show = false;
      }
    });
  }
  checkCollisionWithPaddle(paddle) {
    console.log(paddle.y);
    if (
      this.x <= paddle.x + paddle.width &&
      this.y + this.height >= paddle.y &&
      this.x + this.width >= paddle.x
    ) {
      this.directionY = -1 * this.directionY;
    }
  }
}
class Brick {
  constructor(color, height, width, x, y) {
    this.color = color;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.show = true;

    const brickBox = document.createElement("div");
    brickBox.classList.add("brick");
    brickBox.style.backgroundColor = this.color;
    brickBox.style.height = this.height + "px";
    brickBox.style.width = this.width + "px";
    brickBox.style.left = this.x + "px";
    brickBox.style.top = this.y + "px";
    this.dom = brickBox;
  }
  updateView() {
    if (this.show === false) {
      this.dom.style.display = "none";
    }

    if (this.show === true) {
      this.dom.style.display = "inline-block";
    }
    // });
  }
}
class Level {
  constructor(levelData) {
    this.bricks = this.createBricks(levelData);
  }

  createBricks(levelData) {
    const bricks = [];
    for (let i = 0; i < levelData.length; i++) {
      const data = levelData[i];
      bricks.push(
        new Brick(data.color, data.height, data.width, data.x, data.y)
      );
    }
    return bricks;
  }
}
class Paddle {
  constructor(color, height, width) {
    this.color = color;
    this.height = height;
    this.width = width;
    this.x = 0;
    this.y = 385;
    // Create a paddle
    this.paddle = document.createElement("div");
    this.paddle.style.backgroundColor = this.color;
    this.paddle.style.height = this.height + "px";
    this.paddle.style.width = this.width + "px";
    this.paddle.style.position = "absolute";
    this.paddle.style.left = this.x + "px";
    this.paddle.style.top = this.y + "px";
  }
  moveRight(gameWidth) {
    if (this.x + this.width < gameWidth) {
      this.x += 8;
      this.paddle.style.left = this.x + "px";
    }
  }

  moveLeft() {
    if (this.x > 0) {
      this.x -= 8;
      this.paddle.style.left = this.x + "px";
    }
  }
}
//levelDatas
const level1Data = [
  { color: "gray", height: 50, width: 100, x: 20, y: 0 },
  { color: "lightyellow", height: 50, width: 100, x: 130, y: 0 },
  { color: "lightgreen", height: 50, width: 100, x: 240, y: 0 },
  { color: "lightgreen", height: 50, width: 100, x: 350, y: 0 },

  { color: "lightyellow", height: 50, width: 100, x: 90, y: 60 },
  { color: "lightgreen", height: 50, width: 100, x: 190, y: 60 },
  { color: "gray", height: 50, width: 100, x: 290, y: 60 },
];
const level2Data = [
  { color: "green", height: 50, width: 100, x: 0, y: 0 },
  { color: "pink", height: 50, width: 100, x: 110, y: 50 },
  { color: "brown", height: 50, width: 100, x: 220, y: 0 },
];
const level3Data = [
  { color: "orange", height: 50, width: 100, x: 0, y: 0 },
  { color: "gray", height: 50, width: 100, x: 110, y: 50 },
  { color: "yellow", height: 50, width: 100, x: 220, y: 100 },
];

const levels = [level1Data, level2Data, level3Data];
let currentLevel = 0;
let interval = null;
let game;
let score;

const firstDiv = document.getElementById("main");
firstDiv.style.height = "1200px";

const scoreDiv = document.createElement("div");

const gameDiv = document.createElement("div");
gameDiv.style.display = "flex";
gameDiv.style.position = "relative";
firstDiv.appendChild(scoreDiv);
firstDiv.appendChild(gameDiv);

//button container

//button Container
const buttonDiv = document.createElement("div");
buttonDiv.style.display = "flex";
buttonDiv.style.justifyContent = "space-between";
buttonDiv.style.width = "500px";
const startButton = document.createElement("button");
startButton.innerHTML = "START";

buttonDiv.appendChild(startButton);

const reSetButton = document.createElement("button");
reSetButton.innerHTML = "RE-SET";

buttonDiv.appendChild(reSetButton);

const nextButton = document.createElement("button");
nextButton.innerHTML = "NEXT";
buttonDiv.appendChild(nextButton);

firstDiv.appendChild(buttonDiv);

//eventListener

function loadLevel(i) {
  clearInterval(interval);
  interval = null;
  gameDiv.innerHTML = "";
  game = new Game(gameDiv, "lightblue", 400, 500, levels[i]);
  game.start();
  score = new Score(scoreDiv, game.brickList);
}

loadLevel(currentLevel);

startButton.addEventListener("click", () => {
  if (!interval) {
    let levelCompleted = false;

    interval = setInterval(() => {
      game.update();
      game.updateView();
      score.updateScore(scoreDiv, game.brickList);

      if (!levelCompleted) {
        const allBricksHidden = game.brickList.every(
          (brick) => brick.dom.style.display === "none"
        );
        if (allBricksHidden) {
          levelCompleted = true;
          // alert("UPGRADED TO NEXT LEVEL");

          currentLevel++;
          loadLevel(currentLevel);
        }
      }
    }, 10);
  }
});

reSetButton.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
  game.ball.x = 200;
  game.ball.y = 250;
  game.ball.directionX = -Math.cos((45 * Math.PI) / 180);
  game.ball.directionY = -Math.sin((45 * Math.PI) / 180);
  game.brickList.forEach((brick) => {
    brick.show = true;
    brick.updateView();
  });
  game.updateView();
  score.updateScore(scoreDiv, game.brickList);
});

nextButton.addEventListener("click", () => {
  score.updateScore(scoreDiv, game.brickList);

  if (currentLevel < levels.length - 1) {
    currentLevel++;
    loadLevel(currentLevel);
  } else {
    alert("You finished all levels! 🎉");
  }
});
