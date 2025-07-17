const canvas = document.getElementById("starsCanvas");
const ctx = canvas.getContext("2d");

let width, height;
let stars = [], glowingPlanets = [], shootingStars = [], comets = [], parallaxStars = [];

let satellite = {
  centerX: 0,
  centerY: 0,
  radius: 100,
  angle: 0,
  speed: 0.01,
};

let spaceship = {
  x: -50,
  y: 0,
  speed: 0.7,
};

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

function createStars(count) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2,
      speed: Math.random() * 0.3 + 0.05,
    });
  }
}

function createPlanets(count) {
  glowingPlanets = [];
  for (let i = 0; i < count; i++) {
    glowingPlanets.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 8 + Math.random() * 10,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
    });
  }
}

function createParallaxStars(count) {
  parallaxStars = [];
  for (let i = 0; i < count; i++) {
    parallaxStars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      speed: 0.03 + Math.random() * 0.07,
    });
  }
}

function createShootingStar() {
  shootingStars.push({
    x: Math.random() * width,
    y: Math.random() * height / 2,
    length: 200 + Math.random() * 100,
    speed: 4 + Math.random() * 2,
    angle: Math.PI / 4,
    alpha: 1,
  });
}

function createComet() {
  comets.push({
    x: -100,
    y: Math.random() * height / 2,
    length: 100,
    speed: 2 + Math.random(),
    angle: 0.2 + Math.random() * 0.1,
    tail: [],
    alpha: 1,
  });
}

// --- Draw Functions ---

function drawStars() {
  ctx.fillStyle = "white";
  for (let star of stars) {
    star.y += star.speed;
    if (star.y > height) star.y = 0;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawParallaxStars() {
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  for (let star of parallaxStars) {
    star.x -= star.speed;
    if (star.x < 0) star.x = width;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlanets() {
  for (let planet of glowingPlanets) {
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(
      planet.x, planet.y, 0,
      planet.x, planet.y, planet.radius
    );
    gradient.addColorStop(0, planet.color);
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

function drawShootingStars() {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let star = shootingStars[i];
    star.x += star.speed * Math.cos(star.angle);
    star.y += star.speed * Math.sin(star.angle);
    star.alpha -= 0.008;

    ctx.strokeStyle = `rgba(255,255,255,${star.alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(star.x - star.length, star.y - star.length);
    ctx.stroke();

    if (star.alpha <= 0) shootingStars.splice(i, 1);
  }
}

function drawComets() {
  for (let i = comets.length - 1; i >= 0; i--) {
    const comet = comets[i];
    comet.x += comet.speed * Math.cos(comet.angle);
    comet.y += comet.speed * Math.sin(comet.angle);

    comet.tail.push({ x: comet.x, y: comet.y });
    if (comet.tail.length > 20) comet.tail.shift();

    for (let j = 0; j < comet.tail.length; j++) {
      const pos = comet.tail[j];
      ctx.fillStyle = `rgba(255, 255, 255, ${j / comet.tail.length})`;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    if (comet.x > width || comet.y > height) {
      comets.splice(i, 1);
    }
  }
}

function drawSatellite() {
  satellite.angle += satellite.speed;
  const x = satellite.centerX + satellite.radius * Math.cos(satellite.angle);
  const y = satellite.centerY + satellite.radius * Math.sin(satellite.angle);

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.arc(satellite.centerX, satellite.centerY, satellite.radius, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawSpaceship() {
  spaceship.x += spaceship.speed;
  if (spaceship.x > width + 50) {
    spaceship.x = -50;
    spaceship.y = height * (0.6 + Math.random() * 0.3);
  }

  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.beginPath();
  ctx.moveTo(spaceship.x, spaceship.y);
  ctx.lineTo(spaceship.x - 10, spaceship.y + 4);
  ctx.lineTo(spaceship.x - 10, spaceship.y - 4);
  ctx.closePath();
  ctx.fill();
}

function drawNebulaFog() {
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, width
  );

  // Adjusted opacity for better visibility
  gradient.addColorStop(0, "rgba(128, 0, 128, 0.2)");     // more intense center
  gradient.addColorStop(0.5, "rgba(75, 0, 130, 0.15)");    // added indigo touch mid
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.05)");         // smooth outer fade

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// --- FINAL ANIMATE FUNCTION ---

function animate() {
  ctx.clearRect(0, 0, width, height);
  drawStars();
  drawParallaxStars();
  drawPlanets();
  drawComets();
  drawShootingStars();
  drawNebulaFog();
  drawSatellite();
  drawSpaceship();
  requestAnimationFrame(animate);
}

// --- FINAL SETUP ---

window.addEventListener("resize", () => {
  resizeCanvas();
  createStars(150);
  createPlanets(3);
  createParallaxStars(50);
  satellite.centerX = width / 2;
  satellite.centerY = height / 2;
});

resizeCanvas();
createStars(150);
createPlanets(3);
createParallaxStars(50);
satellite.centerX = width / 2;
satellite.centerY = height / 2;
spaceship.y = height * 0.8;

animate();

setInterval(() => {
  createShootingStar();
}, 5000 + Math.random() * 5000);

setInterval(() => {
  createComet();
}, 15000 + Math.random() * 15000);
