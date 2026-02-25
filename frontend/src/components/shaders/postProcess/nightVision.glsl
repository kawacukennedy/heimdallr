// Night Vision Post-Process Shader
// Simulates military night vision goggles with green phosphor effect

uniform sampler2D colorTexture;
uniform float noiseAmount;
uniform float intensity;

in vec2 v_textureCoordinates;

// Simplex noise function
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec4 color = texture(colorTexture, v_textureCoordinates);

  // Convert to luminance
  float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));

  // Apply green tint
  vec3 nightVision = vec3(0.1, luminance * intensity, 0.1);

  // Add noise
  float noise = random(v_textureCoordinates + fract(czm_frameNumber * 0.01)) * noiseAmount;
  nightVision += vec3(noise * 0.5, noise, noise * 0.5);

  // Vignette effect
  vec2 center = v_textureCoordinates - 0.5;
  float vignette = 1.0 - dot(center, center) * 1.5;
  nightVision *= vignette;

  // Scanlines
  float scanline = sin(v_textureCoordinates.y * 800.0) * 0.04 + 1.0;
  nightVision *= scanline;

  out_FragColor = vec4(nightVision, 1.0);
}
