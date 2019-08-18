const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

const vShaderSource =
`
#define M_PI 3.1415926535897932384626433832795

attribute vec2 position;
uniform float width;
uniform vec2 resolution;

void main() {
  // float x = position.x / width * 2.0 - 1.0;
  vec2 transformedPosition = position / resolution * 2.0 - 1.0;
  gl_PointSize = 2.0;
  // gl_Position = vec4(x, cos(x * M_PI), 0, 1);
  gl_Position = vec4(transformedPosition, 0, 1);
 }
`;

const fShaderSource = `
precision mediump float;

uniform vec4 color;

void main() {
  //gl_FragColor = vec4(1, 0, 0, 1);
  gl_FragColor = color / 255.0;
}
`;

function compileShader(shader, source) {
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const log = gl.getShaderInfoLog(shader);

  if (log) {
    throw new Error(log);
  }

  console.log(gl.getShaderInfoLog(vertexShader));
}

compileShader(vertexShader, vShaderSource);
compileShader(fragmentShader, fShaderSource);

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);
gl.useProgram(program);

const positionPointer = gl.getAttribLocation(program, 'position');

// const widthUniformLocation = gl.getUniformLocation(program, 'width');
const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
// gl.uniform1f(widthUniformLocation, canvas.width);
gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);

const colorUniformLocation = gl.getUniformLocation(program, 'color');
gl.uniform4fv(colorUniformLocation, [200, 0, 0, 255]);

//const points = [];
const lines = [];
//let prevLineY = 0;
const triangles = [
  0, 0, // v1 (x, y)
  canvas.width / 2, canvas.height, // v2 (x, y)
  canvas.width, 0, // v3 (x, y)
];

/*
for (let i = 0; i < canvas.width - 5; i+=5) {
  // points.push(i, i);
  lines.push(i, prevLineY);
  const y =  Math.random() * canvas.height;
  lines.push(i + 5, y);

  prevLineY = y;
}
*/
// const positionData = new Float32Array(points);
// const positionData = new Float32Array(lines);
const positionData = new Float32Array(triangles);

const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
// Change line width
//gl.lineWidth(10);

const attributeSize = 2;
const type = gl.FLOAT;
const normalized = false;
const stride = 0;
const offset = 0;

gl.vertexAttribPointer(positionPointer, attributeSize, type, normalized, stride, offset);
gl.enableVertexAttribArray(positionPointer);

//gl.drawArrays(gl.POINTS, 0, positionData.length / 2);
//gl.drawArrays(gl.LINES, 0, positionData.length / 2);
gl.drawArrays(gl.TRIANGLES, 0, positionData.length / 2);
