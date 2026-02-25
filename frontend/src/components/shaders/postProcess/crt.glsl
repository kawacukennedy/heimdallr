// CRT Monitor Post-Process Shader
// Simulates retro CRT display with scanlines, curvature, and chromatic aberration

uniform sampler2D colorTexture;
uniform float scanlineIntensity;
uniform float chromaticAberration;
uniform float pixelSize;

in vec2 v_textureCoordinates;

void main() {
  vec2 uv = v_textureCoordinates;

  // Barrel distortion (CRT curvature)
  vec2 center = uv - 0.5;
  float dist = dot(center, center);
  uv = uv + center * dist * 0.1;

  // Chromatic aberration
  float r = texture(colorTexture, uv + vec2(chromaticAberration, 0.0)).r;
  float g = texture(colorTexture, uv).g;
  float b = texture(colorTexture, uv - vec2(chromaticAberration, 0.0)).b;
  vec3 color = vec3(r, g, b);

  // Scanlines
  float scanline = sin(uv.y * 600.0 * pixelSize) * scanlineIntensity * 0.5 + (1.0 - scanlineIntensity * 0.5);
  color *= scanline;

  // Slight green tint
  color *= vec3(0.9, 1.0, 0.9);

  // Phosphor glow
  color += vec3(0.0, 0.02, 0.0);

  // Vignette
  float vignette = 1.0 - dist * 2.0;
  vignette = clamp(vignette, 0.0, 1.0);
  color *= vignette;

  // Flicker
  float flicker = 0.98 + 0.02 * sin(czm_frameNumber * 0.3);
  color *= flicker;

  // Clamp for out-of-bounds UVs
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    color = vec3(0.0);
  }

  out_FragColor = vec4(color, 1.0);
}
