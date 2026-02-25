// Bloom Post-Process Shader
// Enhances bright areas with a glow effect

uniform sampler2D colorTexture;
uniform float bloomIntensity;

in vec2 v_textureCoordinates;

void main() {
  vec4 color = texture(colorTexture, v_textureCoordinates);

  // Extract bright areas
  float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
  vec3 bloom = vec3(0.0);

  if (brightness > 0.7) {
    // Sample surrounding pixels for blur
    float offset = 0.003;
    for (int x = -2; x <= 2; x++) {
      for (int y = -2; y <= 2; y++) {
        vec2 sampleUV = v_textureCoordinates + vec2(float(x), float(y)) * offset;
        bloom += texture(colorTexture, sampleUV).rgb;
      }
    }
    bloom /= 25.0;
    bloom *= bloomIntensity;
  }

  out_FragColor = vec4(color.rgb + bloom, 1.0);
}
