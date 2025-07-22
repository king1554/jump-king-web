const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.5;
const JUMP_POWER = 12;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 40;

let player = {
  x: canvas.width / 2 - PLAYER_WIDTH / 2,
  y: canvas.height - PLAYER_HEIGHT - 10,
  vx: 0,
  vy: 0,
  onGround: false,
  charging: false,
  charge: 0
};

const platforms = [
  { x: 150, y: 550, w: 100, h: 10 },
  { x: 80, y: 450, w: 100, h: 10 },
  { x: 220, y: 350, w: 100, h: 10 },
  { x: 120, y: 250, w: 100, h: 10 },
  { x: 200, y: 150, w: 100, h: 10 }
];

function drawPlayer() {
  ctx.fillStyle = "#ff0";
  ctx.fillRect(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
}

function drawPlatforms() {
  ctx.fillStyle = "#964B00";
  for (const pf of platforms) {
    ctx.fillRect(pf.x, pf.y, pf.w, pf.h);
  }
}

function updatePlayer() {
  if (!player.onGround) {
    player.vy += GRAVITY;
  }
  player.x += player.vx;
  player.y += player.vy;

  // 바닥 충돌
  if (player.y + PLAYER_HEIGHT > canvas.height) {
    player.y = canvas.height - PLAYER_HEIGHT;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  // 플랫폼 충돌
  for (const pf of platforms) {
    if (
      player.x + PLAYER_WIDTH > pf.x &&
      player.x < pf.x + pf.w &&
      player.y + PLAYER_HEIGHT > pf.y &&
      player.y + PLAYER_HEIGHT - player.vy <= pf.y
    ) {
      player.y = pf.y - PLAYER_HEIGHT;
      player.vy = 0;
      player.onGround = true;
    }
  }

  // 좌우 화면 밖 방지
  if (player.x < 0) player.x = 0;
  if (player.x + PLAYER_WIDTH > canvas.width) player.x = canvas.width - PLAYER_WIDTH;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlatforms();
  drawPlayer();
  // 점프 차징 바
  if (player.charging) {
    ctx.fillStyle = "#0f0";
    ctx.fillRect(player.x, player.y - 10, player.charge * 2, 5);
  }
}

function gameLoop() {
  updatePlayer();
  draw();
  requestAnimationFrame(gameLoop);
}

// 점프 차징 및 발사
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && player.onGround && !player.charging) {
    player.charging = true;
    player.charge = 0;
  }
});
document.addEventListener('keyup', (e) => {
  if (e.code === 'Space' && player.charging) {
    player.charging = false;
    player.vy = -JUMP_POWER - player.charge / 2;
    player.onGround = false;
    player.charge = 0;
  }
});
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') player.vx = -3;
  if (e.code === 'ArrowRight') player.vx = 3;
});
document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') player.vx = 0;
});

setInterval(() => {
  if (player.charging && player.charge < 40) player.charge += 1;
}, 16);

gameLoop();
