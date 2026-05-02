const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// 🔊 Sounds
const jumpSound = new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3");
const coinSound = new Audio("https://www.soundjay.com/buttons/sounds/button-09.mp3");

// 🏃 Player
let player = {
    lane: 1,
    y: 500,
    vy: 0,
    jumping: false
};

let lanes = [100, 200, 300];
let obstacles = [];
let coins = [];

let score = 0;
let speed = 5;
let gameRunning = true;

// 🎮 Keyboard
document.addEventListener("keydown", e => {
    if (!gameRunning) return;

    if (e.key === "ArrowLeft" && player.lane > 0) player.lane--;
    if (e.key === "ArrowRight" && player.lane < 2) player.lane++;

    if (e.key === "ArrowUp" && !player.jumping) jump();
});

// 📱 Touch (swipe)
let startX = 0, startY = 0;

canvas.addEventListener("touchstart", e => {
    let t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
});

canvas.addEventListener("touchend", e => {
    if (!gameRunning) return;

    let t = e.changedTouches[0];
    let dx = t.clientX - startX;
    let dy = t.clientY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30 && player.lane < 2) player.lane++;
        else if (dx < -30 && player.lane > 0) player.lane--;
    } else {
        if (dy < -30 && !player.jumping) jump();
    }
});

// 🦘 Jump
function jump() {
    player.vy = -10;
    player.jumping = true;
    jumpSound.currentTime = 0;
    jumpSound.play();
}

// 🚧 Obstacles
function createObstacle() {
    obstacles.push({
        lane: Math.floor(Math.random() * 3),
        y: -50
    });
}

// 🪙 Coins
function createCoin() {
    coins.push({
        lane: Math.floor(Math.random() * 3),
        y: -50
    });
}

setInterval(createObstacle, 1200);
setInterval(createCoin, 1000);

// 🔁 Update
function update() {
    if (!gameRunning) return;

    // gravity
    player.vy += 0.5;
    player.y += player.vy;

    if (player.y >= 500) {
        player.y = 500;
        player.jumping = false;
    }

    // obstacles
    obstacles.forEach((obs, i) => {
        obs.y += speed;

        if (
            obs.lane === player.lane &&
            obs.y > player.y - 40 &&
            obs.y < player.y + 40
        ) {
            endGame();
        }

        if (obs.y > 600) {
            obstacles.splice(i, 1);
            score++;
        }
    });

    // coins
    coins.forEach((c, i) => {
        c.y += speed;

        if (
            c.lane === player.lane &&
            c.y > player.y - 40 &&
            c.y < player.y + 40
        ) {
            coins.splice(i, 1);
            score += 5;
            coinSound.currentTime = 0;
            coinSound.play();
        }

        if (c.y > 600) coins.splice(i, 1);
    });

    // speed increase
    if (score % 20 === 0) speed += 0.01;

    document.getElementById("score").innerText = "Score: " + score;
}

// 🎨 Draw
let bgOffset = 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🌆 scrolling background illusion
    bgOffset += speed;
    ctx.fillStyle = "#444";
    ctx.fillRect(50, 0, 300, 600);

    ctx.strokeStyle = "white";
    ctx.setLineDash([20, 20]);
    ctx.lineDashOffset = -bgOffset;
    ctx.beginPath();
    ctx.moveTo(150, 0);
    ctx.lineTo(150, 600);
    ctx.moveTo(250, 0);
    ctx.lineTo(250, 600);
    ctx.stroke();
    ctx.setLineDash([]);

    // 🧍 player (emoji style)
    ctx.font = "30px Arial";
    ctx.fillText("🏃", lanes[player.lane] - 15, player.y);

    // 🚧 obstacles
    ctx.font = "30px Arial";
    obstacles.forEach(o => {
        ctx.fillText("🚧", lanes[o.lane] - 15, o.y);
    });

    // 🪙 coins
    ctx.font = "25px Arial";
    coins.forEach(c => {
        ctx.fillText("🪙", lanes[c.lane] - 12, c.y);
    });
}

// 💀 Game Over
function endGame() {
    gameRunning = false;
    document.getElementById("gameOver").style.display = "block";
}

// 🔄 Restart
function restart() {
    location.reload();
}

// 🔁 Loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();