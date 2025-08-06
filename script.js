document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("snakeGame");
  const ctx = canvas.getContext("2d");

  const gameContainer = document.querySelector(".game-container");
  const codeSnippetPanel = document.querySelector(".code-snippet-panel");
  const startScreen = document.getElementById("start-screen");
  const gameOverScreen = document.getElementById("game-over-screen");
  const winScreen = document.getElementById("win-screen");
  const foodDotsContainer = document.getElementById("food-dots");

  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  const playAgainButton = document.getElementById("play-again-button");
  const skipButton = document.getElementById("skip-button");

  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
  const closeMenuButton = document.getElementById("close-menu-button");
  const mobileNavLinks = document.querySelectorAll(".mobile-menu-nav a");

  const gridSize = 20;
  const TOTAL_FOOD = 10;
  let canvasSize, snake, food, direction, score, isGameOver, gameLoopInterval;

  function setupGame() {
    canvasSize = {
      width: Math.floor(canvas.clientWidth / gridSize) * gridSize,
      height: Math.floor(canvas.clientHeight / gridSize) * gridSize,
    };
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    resetUI();
  }

  function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = "right";
    score = 0;
    isGameOver = false;

    startScreen.style.display = "none";
    gameOverScreen.style.display = "none";
    winScreen.style.display = "none";

    updateFoodCounter(true);
    placeFood();

    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, 120);
  }

  function gameLoop() {
    if (isGameOver) return;
    clearCanvas();
    moveSnake();
    checkCollisions();
    draw();
  }

  function endGame() {
    isGameOver = true;
    clearInterval(gameLoopInterval);
    gameOverScreen.style.display = "block";
  }

  function winGame() {
    isGameOver = true;
    clearInterval(gameLoopInterval);
    winScreen.style.display = "block";
  }

  function resetUI() {
    gameOverScreen.style.display = "none";
    winScreen.style.display = "none";
    startScreen.style.display = "block";
    updateFoodCounter(true);
  }

  function clearCanvas() {
    ctx.fillStyle = "#011627";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function draw() {
    ctx.fillStyle = "#43D9AD";
    snake.forEach((segment) => {
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize - 1,
        gridSize - 1
      );
    });
    ctx.fillStyle = "#FEA55F";
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize - 1,
      gridSize - 1
    );
  }

  function updateFoodCounter(reset = false) {
    foodDotsContainer.innerHTML = "";
    for (let i = 0; i < TOTAL_FOOD; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      if (reset || i >= score) {
        dot.classList.add("lit");
      }
      foodDotsContainer.appendChild(dot);
    }
  }

  function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      updateFoodCounter();
      if (score >= TOTAL_FOOD) {
        winGame();
      } else {
        placeFood();
      }
    } else {
      snake.pop();
    }
  }

  function checkCollisions() {
    const head = snake[0];
    const hitWall =
      head.x < 0 ||
      head.x * gridSize >= canvas.width ||
      head.y < 0 ||
      head.y * gridSize >= canvas.height;
    if (hitWall) {
      endGame();
    }
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        endGame();
        break;
      }
    }
  }

  function placeFood() {
    let foodX, foodY, onSnake;
    do {
      onSnake = false;
      foodX = Math.floor(Math.random() * (canvas.width / gridSize));
      foodY = Math.floor(Math.random() * (canvas.height / gridSize));
      for (const segment of snake) {
        if (segment.x === foodX && segment.y === foodY) {
          onSnake = true;
          break;
        }
      }
    } while (onSnake);
    food = { x: foodX, y: foodY };
  }

  function handleKeyDown(event) {
    const key = event.key;
    if (key === "ArrowUp" && direction !== "down") direction = "up";
    else if (key === "ArrowDown" && direction !== "up") direction = "down";
    else if (key === "ArrowLeft" && direction !== "right") direction = "left";
    else if (key === "ArrowRight" && direction !== "left") direction = "right";
  }
  // Fungsi untuk membuka menu
  function openMenu() {
    mobileMenuOverlay.classList.add("open");
  }

  // Fungsi untuk menutup menu
  function closeMenu() {
    mobileMenuOverlay.classList.remove("open");
  }

  document.addEventListener("keydown", handleKeyDown);
  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", startGame);
  playAgainButton.addEventListener("click", startGame);

  skipButton.addEventListener("click", () => {
    gameContainer.style.display = "none";
    codeSnippetPanel.style.display = "flex"; // ini FLEX bukan block
    codeSnippetPanel.classList.add("fade-in-up");
    mobileMenuButton.addEventListener("click", openMenu);
    closeMenuButton.addEventListener("click", closeMenu);
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  });

  setupGame();
});

document.addEventListener("DOMContentLoaded", function () {
  // Logika untuk Accordion di tampilan mobile
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;

      // Toggle class 'open' pada konten
      content.classList.toggle("open");

      // Ubah ikon panah
      const arrow = header.querySelector("span");
      if (content.classList.contains("open")) {
        arrow.innerHTML = "&#x25BC;"; // Panah ke bawah
      } else {
        arrow.innerHTML = "&#x25B6;"; // Panah ke kanan
      }
    });
  });
});
