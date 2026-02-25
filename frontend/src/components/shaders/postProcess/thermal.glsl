// Thermal (FLIR) Post-Process Shader
// Simulates forward-looking infrared camera with Ironbow palette

uniform sampler2D colorTexture;

in vec2 v_textureCoordinates;

vec3 ironbow(float t) {
  // Ironbow (hot metal) color palette
  vec3 c0 = vec3(0.0, 0.0, 0.15);  // dark blue
  vec3 c1 = vec3(0.1, 0.0, 0.5);   // purple
  vec3 c2 = vec3(0.5, 0.0, 0.5);   // magenta
  vec3 c3 = vec3(0.8, 0.1, 0.1);   // red
  vec3 c4 = vec3(1.0, 0.4, 0.0);   // orange
  vec3 c5 = vec3(1.0, 0.8, 0.0);   // yellow
  vec3 c6 = vec3(1.0, 1.0, 0.6);   // light yellow
  vec3 c7 = vec3(1.0, 1.0, 1.0);   // white (hottest)

  float step = 1.0 / 7.0;

  if (t < step) return mix(c0, c1, t / step);
  if (t < 2.0 * step) return mix(c1, c2, (t - step) / step);
  if (t < 3.0 * step) return mix(c2, c3, (t - 2.0 * step) / step);
  if (t < 4.0 * step) return mix(c3, c4, (t - 3.0 * step) / step);
  if (t < 5.0 * step) return mix(c4, c5, (t - 4.0 * step) / step);
  if (t < 6.0 * step) return mix(c5, c6, (t - 5.0 * step) / step);
  return mix(c6, c7, (t - 6.0 * step) / step);
}

void main() {
  vec4 color = texture(colorTexture, v_textureCoordinates);

  // Convert to luminance (simulated thermal)
  float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));

  // Apply thermal palette
  vec3 thermal = ironbow(luminance);

  // Slight noise for realism
  float noise = fract(sin(dot(v_textureCoordinates * czm_frameNumber * 0.001, vec2(12.9898, 78.233))) * 43758.5453);
  thermal += vec3(noise * 0.02);

  out_FragColor = vec4(thermal, 1.0);
}
