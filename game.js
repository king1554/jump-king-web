const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.5;
const JUMP_POWER = 12;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 40;

let stage = 0;
const stages = [
  [
    { x: 150, y: 550, w: 100, h: 10 },
    { x: 80, y: 450, w: 100, h: 10 },
    { x: 220, y: 350, w: 100, h: 10 },
    { x: 120, y: 250, w: 100, h: 10 },
    { x: 200, y: 150, w: 100, h: 10 }
  ],
  [
    { x: 50, y: 500, w: 80, h: 10 },
    { x: 270, y: 400, w: 80, h: 10 },
    { x: 120, y: 300, w: 80, h: 10 },
    { x: 220, y: 200, w: 80, h: 10 },
    { x: 100, y: 100, w: 80, h: 10 }
  ]
];

let player = {
  x: canvas.width / 2 - PLAYER_WIDTH / 2,
  y: canvas.height - PLAYER_HEIGHT - 10,
  vx: 0,
  vy: 0,
  onGround: false,
  charging: false,
  charge: 0
};

function drawPlayer() {
  // 사람 형태로 그리기
  const centerX = player.x + PLAYER_WIDTH / 2;
  const headRadius = 10;
  // 머리
  ctx.fillStyle = '#ffe0bd';
  ctx.beginPath();
  ctx.arc(centerX, player.y + headRadius, headRadius, 0, Math.PI * 2);
  ctx.fill();
  // 몸통
  ctx.strokeStyle = '#ffe0bd';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(centerX, player.y + headRadius * 2);
  ctx.lineTo(centerX, player.y + PLAYER_HEIGHT - 10);
  ctx.stroke();
  // 팔
  ctx.beginPath();
  ctx.moveTo(centerX, player.y + headRadius * 2 + 5);
  ctx.lineTo(centerX - 12, player.y + headRadius * 2 + 18);
  ctx.moveTo(centerX, player.y + headRadius * 2 + 5);
  ctx.lineTo(centerX + 12, player.y + headRadius * 2 + 18);
  ctx.stroke();
  // 다리
  ctx.beginPath();
  ctx.moveTo(centerX, player.y + PLAYER_HEIGHT - 10);
  ctx.lineTo(centerX - 10, player.y + PLAYER_HEIGHT + 10);
  ctx.moveTo(centerX, player.y + PLAYER_HEIGHT - 10);
  ctx.lineTo(centerX + 10, player.y + PLAYER_HEIGHT + 10);
  ctx.stroke();
}

function drawPlatforms() {
  ctx.fillStyle = '#964B00';
  for (const pf of stages[stage]) {
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
  for (const pf of stages[stage]) {
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

  // 스테이지 클리어
  if (player.y < 0 && stage < stages.length - 1) {
    stage++;
    player.x = canvas.width / 2 - PLAYER_WIDTH / 2;
    player.y = canvas.height - PLAYER_HEIGHT - 10;
    player.vx = 0;
    player.vy = 0;
  }
}

function drawGauge() {
  // 점프 게이지 바
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.strokeRect(player.x, player.y - 20, 80, 10);
  ctx.fillStyle = '#0f0';
  ctx.fillRect(player.x, player.y - 20, Math.min(player.charge * 2, 80), 10);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlatforms();
  drawPlayer();
  if (player.charging) drawGauge();
  // 스테이지 표시
  ctx.fillStyle = '#fff';
  ctx.font = '18px sans-serif';
  ctx.fillText(`Stage: ${stage + 1}`, 10, 30);
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
// 부드러운 좌우 이동
let leftPressed = false, rightPressed = false;
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') leftPressed = true;
  if (e.code === 'ArrowRight') rightPressed = true;
});
document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') leftPressed = false;
  if (e.code === 'ArrowRight') rightPressed = false;
});
setInterval(() => {
  if (player.charging && player.charge < 40) player.charge += 1;
  // 좌우 이동 가속
  if (leftPressed && !rightPressed) player.vx = -3;
  else if (rightPressed && !leftPressed) player.vx = 3;
  else player.vx = 0;
}, 16);

gameLoop();
