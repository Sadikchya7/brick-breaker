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

    this.ball = new Ball("darkblue", 30, 30, 50, 1);
    this.brickList = this.level.bricks;
  }
  start() {
    this.container.appendChild(this.ball.ball);
    this.brickList.forEach((brick) => {
      this.container.appendChild(brick.dom);
    });
  }

  update() {
    this.ball.move();
    this.ball.checkCollisionWithBricks(this.brickList);
    this.ball.checkCollisionWithWall(this.width, this.height);
  }

  updateView() {
    this.ball.updateBall();
    this.brickList.forEach((brick) => {
      brick.updateView();
    });
  }
}
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
    brickBox.style.backgroundColor = this.color;
    brickBox.style.height = this.height + "px";
    brickBox.style.width = this.width + "px";
    brickBox.style.position = "absolute";
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
//levelDatas
const level1Data = [
  { color: "black", height: 50, width: 100, x: 0, y: 0 },
  { color: "black", height: 50, width: 100, x: 110, y: 0 },
  { color: "black", height: 50, width: 100, x: 220, y: 0 },
];
const level2Data = [
  { color: "green", height: 50, width: 100, x: 0, y: 0 },
  { color: "green", height: 50, width: 100, x: 110, y: 50 },
  { color: "green", height: 50, width: 100, x: 220, y: 0 },
];
const level3Data = [
  { color: "orange", height: 50, width: 100, x: 0, y: 0 },
  { color: "orange", height: 50, width: 100, x: 110, y: 50 },
  { color: "orange", height: 50, width: 100, x: 220, y: 100 },
];

const levels = [level1Data, level2Data, level3Data];
let currentLevel = 0;
let interval = null;
let game;

const firstDiv = document.getElementById("main");
firstDiv.style.height = "1200px";

const gameDiv = document.createElement("div");
gameDiv.style.display = "flex";
gameDiv.style.position = "relative";
firstDiv.appendChild(gameDiv);

//button container

const buttonDiv = document.createElement("div");
buttonDiv.style.display = "flex";
buttonDiv.style.justifyContent = "space-between";
buttonDiv.style.width = "500px";

const startButton = document.createElement("button");
startButton.innerHTML = "START";
startButton.style.height = 40 + "px";
startButton.style.width = 100 + "px";
startButton.style.display = "inline-flex";
startButton.style.backgroundColor = "red";
startButton.style.position = "relative";
startButton.style.alignItems = "center";
buttonDiv.appendChild(startButton);

const reSetButton = document.createElement("button");
reSetButton.innerHTML = "RE-SET";
reSetButton.style.height = 40 + "px";
reSetButton.style.width = 100 + "px";
reSetButton.style.display = "inline-flex";
reSetButton.style.backgroundColor = "red";
reSetButton.style.position = "relative";
reSetButton.style.alignItems = "center";
buttonDiv.appendChild(reSetButton);

const nextButton = document.createElement("button");
nextButton.innerHTML = "NEXT";
nextButton.style.height = 40 + "px";
nextButton.style.width = 100 + "px";
nextButton.style.display = "inline-flex";
nextButton.style.backgroundColor = "red";
nextButton.style.alignItems = "center";
nextButton.style.position = "relative";
buttonDiv.appendChild(nextButton);

firstDiv.appendChild(buttonDiv);

//eventListener

function loadLevel(i) {
  clearInterval(interval);
  interval = null;
  gameDiv.innerHTML = "";
  game = new Game(gameDiv, "lightblue", 400, 500, levels[i]);
  game.start();
}

loadLevel(currentLevel);

startButton.addEventListener("click", () => {
  if (!interval) {
    interval = setInterval(() => {
      game.update();
      game.updateView();
    }, 10);
  }
});

reSetButton.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
  game.ball.x = 0;
  game.ball.y = 200;
  game.ball.directionX = Math.cos((45 * Math.PI) / 180) + 3;
  game.ball.directionY = Math.sin((45 * Math.PI) / 180) + 1;
  game.brickList.forEach((brick) => {
    brick.show = true;
    brick.updateView();
  });
  game.updateView();
});

nextButton.addEventListener("click", () => {
  if (currentLevel < levels.length - 1) {
    currentLevel++;
    loadLevel(currentLevel);
  } else {
    alert("You finished all levels! 🎉");
  }
});
