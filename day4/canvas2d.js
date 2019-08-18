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
  vec2 transformedPosition = position / resolution * 2.0 - 1.0;
  gl_PointSize = 2.0;
  gl_Position = vec4(transformedPosition, 0, 1);
 }
`;

const fShaderSource = `
precision mediump float;

uniform vec4 color;

void main() {
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

const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);

const colorUniformLocation = gl.getUniformLocation(program, 'color');
gl.uniform4fv(colorUniformLocation, [200, 0, 0, 255]);

const triangles = [
  // first triangle
  0, 150, // top left
  150, 150, // top right
  0, 0, // bottom left

  // second triangle
  0, 0, // bottom left
  150, 150, // top right
  150, 0, // bottom right
];

const positionData = new Float32Array(triangles);

const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);

const attributeSize = 2;
const type = gl.FLOAT;
const normalized = false;
const stride = 0;
const offset = 0;

gl.vertexAttribPointer(positionPointer, attributeSize, type, normalized, stride, offset);
gl.enableVertexAttribArray(positionPointer);

gl.drawArrays(gl.TRIANGLES, 0, positionData.length / 2);
