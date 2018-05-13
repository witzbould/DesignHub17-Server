// Socket config
const SOCKET_URL = `http://${window.location.hostname}:${window.location.port}`;
const socket = io(SOCKET_URL);

// Wobble config
var yoff = 0.0; // 2nd dimension of perlin noise
const width = 400;
const height = 400;
const r = 150;
const angle = 360;
const steps = 10; // more creates more "pulsating"
let amplitude; // 0 - 1
let intensity = 1; // 0.1 - 30
let increase = 0.05;
let speed = 0.005;
const x0 = width / 2;
const y0 = height / 2;
const OUTER_RADIUS = 150;
let c;
let ctx;
let song;
let bendX;
let bendY;
let orange;
let transOrange;
let grey;
let isEdgy = false;
// extra steps to curve out start and end points
// Activation leads to problems when following the cursor -> disabled for now.
// const extraSteps = 2 * (angle / steps);
const extraSteps = 0;

// Testing with mouse
const FOLLOW_MOUSE = false;

function setup() {
  orange = color(255, 92, 67);
  transOrange = color(255, 92, 67, 255 / 2);
  grey = color(63, 68, 68);
  c = createCanvas(width, height);
  ctx = c.drawingContext;
  // song.loop();
  analyzer = new p5.Amplitude();

  // Patch the input to an volume analyzer
  analyzer.setInput(song);

  angleMode(DEGREES);
}

function draw() {
  background(grey);

  fill(255);

  var rms = analyzer.getLevel();
  // adjust to music
  amplitude = map(rms, 0.01, 1, 0.3, 1);
  if (amplitude > 0.4) {
    //   isEdgy = true;
    // intensity = 30;
  } else {
    //   isEdgy = false;
    // intensity = 1;
  }
  speed = map(rms, 0.01, 1, 0.005, 0.05);
  //   intensity = map(rms, 0.01, 1, 0.01, 30);

  if (FOLLOW_MOUSE) {
    bendX = mouseX;
    bendY = mouseY;
  }

  drawBobble(1);
  drawBobble(2);

  // increment y dimension for noise
  yoff += speed;

  // Center Point
  stroke(255, 255, 255);
  strokeWeight(5);
  fill(grey);
  ellipse(x0, y0, 75, 75);

  // dotted circle (using canvas instead of p5)
  ctx.beginPath();
  ctx.setLineDash([1, 5]);
  ctx.arc(width / 2, height / 2, OUTER_RADIUS, 0, TWO_PI);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);

  // text("mouse: " + mouseX + " / "+ mouseY, 10, 10);
}

function drawBobble(salt) {
  beginShape();
  stroke(orange);
  fill(transOrange);

  for (let i = 0; i < angle + extraSteps; i += angle / steps) {
    var rad = TWO_PI * i / angle;
    var val = map(
      noise(Math.cos(rad*salt) * intensity + 1, Math.sin(rad*salt) * intensity + 1, yoff),
      0,
      1,
      amplitude,
      1
    );

    var x = x0 + Math.cos(rad) * r * val;
    var y = y0 + Math.sin(rad) * r * val;

    if (bendX && bendY) {
      let distFromVertex = int(dist(x, y, bendX, bendY));
      let distFromCenter = int(dist(x0, y0, bendX, bendY));
      let diff = distFromCenter - distFromVertex;

      if (diff > 0) {
        x =
          x +
          Math.cos(Math.atan2(bendY - y, bendX - x)) *
            map(distFromVertex, 0, 100, 0, 30);
        y =
          y +
          Math.sin(Math.atan2(bendY - y, bendX - x)) *
            map(distFromVertex, 0, 100, 0, 30);
      }
    }

    if (isEdgy) {
        vertex(x, y);
    } else {
        curveVertex(x, y);
    }
    // ellipse(x, y, 10);
  }
  endShape(CLOSE);
}

function preload() {
  song = loadSound("assets/music.mp3");
}

function playPause() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function switchEdgy() {
    isEdgy = !isEdgy;
}

function movePointAtAngle (point, angle, distance) {
  return [
      point[0] + (sin(angle) * distance),
      point[1] - (cos(angle) * distance)
  ];
}

// Connect Socket
socket.on('connect', () => {
  console.log('Connected to WebSocket!');
})

socket.on('bobble', data => {
  const res = JSON.parse(data);
  console.log(res);
  if (res.action === 'CHANGE_DIRECTION') {
    [bendX, bendY] = movePointAtAngle([x0, y0], res.payload.angle, 250);
  }

  if (res.action === 'STOP_DIRECTION') {
    [bendX, bendY] = [null, null]
  }

  if (res.action === 'PLAYPAUSE') {
    playPause();
  }

  if (res.action === 'SWITCH_EDGY') {
    switchEdgy();
  }
  console.log('current pointer:', bendX, bendY);
})