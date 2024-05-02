precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

vec2 noise2x2(vec2 p) {
  float x = dot(p, vec2(123.4, 234.5));
  float y = dot(p, vec2(345.6, 456.7));
  vec2 noise = vec2(x, y);
  noise = sin(noise);
  noise = noise * 43758.5453;
  noise = fract(noise);
  return noise;
}

void main() {
    float maxRadius = 0.5;
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv = gl_FragCoord.xy / u_resolution.y;
  vec3 color = vec3(0.0);
  uv = uv * 8.0;
  vec2 currentGridId = floor(uv);
  vec2 currentGridCoord = fract(uv);
  color = vec3(currentGridCoord, 0.0);
  currentGridCoord = currentGridCoord - 0.5;
  color = vec3(currentGridCoord, 0.0);
  float minDistFromPixel = 10.0;

  for (float i = -1.0; i <= 1.0; i++) {
    for (float j = -1.0; j <= 1.0; j++) {
      vec2 adjGridCoords = vec2(i, j);
      vec2 pointOnAdjGrid = adjGridCoords;
      vec2 noise = noise2x2(currentGridId + adjGridCoords);
      pointOnAdjGrid = adjGridCoords+ + sin(u_time*2.0 * noise) * 0.5;
      float dist = length(currentGridCoord + - pointOnAdjGrid)/(uv.y*.3);
      minDistFromPixel = min(dist, minDistFromPixel);
    }
  }
  color = vec3(smoothstep(.2, 1.0, 1.0- minDistFromPixel)) ;
  color*= uv.y/12.0;
  //color += vec3(0.1, 0.1, 0.1);
  //color *= vec3(uv.y/8.0, 0, uv.x/8.0);
  gl_FragColor = vec4(color,uv.y/8.0 -.3);
}