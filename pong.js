const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 12;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVelX = BALL_SPEED;
let ballVelY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let playerScore = 0;
let aiScore = 0;

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp within canvas
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Game loop
function update() {
    // Ball movement
    ballX += ballVelX;
    ballY += ballVelY;

    // Ball collision with top/bottom walls
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballVelY *= -1;
        ballY = Math.max(0, Math.min(canvas.height - BALL_SIZE, ballY));
    }

    // Ball collision with player paddle
    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballVelX = Math.abs(ballVelX);
        // Add variation based on hit position
        let hitPos = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
        ballVelY += hitPos * 0.08;
    }

    // Ball collision with AI paddle
    if (
        ballX + BALL_SIZE >= AI_X &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballVelX = -Math.abs(ballVelX);
        let hitPos = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
        ballVelY += hitPos * 0.08;
    }

    // Ball out of bounds (score)
    if (ballX < 0) {
        aiScore++;
        resetBall(-1);
    }
    if (ballX + BALL_SIZE > canvas.width) {
        playerScore++;
        resetBall(1);
    }

    // AI paddle movement (basic tracking)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    let ballCenter = ballY + BALL_SIZE / 2;
    if (aiCenter < ballCenter - 10) {
        aiY += PADDLE_SPEED;
    } else if (aiCenter > ballCenter + 10) {
        aiY -= PADDLE_SPEED;
    }
    // Clamp AI paddle
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Reset ball after score
function resetBall(direction) {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballVelX = BALL_SPEED * direction;
    ballVelY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = "#0ff";
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

    // Draw score
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, canvas.width / 2 - 40, 40);
    ctx.fillText(aiScore, canvas.width / 2 + 20, 40);
}

// Main loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();