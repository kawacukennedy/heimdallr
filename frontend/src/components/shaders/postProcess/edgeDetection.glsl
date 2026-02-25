// Edge Detection Post-Process Shader
// Sobel operator edge detection

uniform sampler2D colorTexture;
uniform vec4 edgeColor;
uniform float threshold;

in vec2 v_textureCoordinates;

float luminance(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec2 texel = vec2(1.0) / czm_viewport.zw;

  // Sample 3x3 neighborhood
  float tl = luminance(texture(colorTexture, v_textureCoordinates + vec2(-texel.x, texel.y)).rgb);
  float t  = luminance(texture(colorTexture, v_textureCoordinates + vec2(0.0, texel.y)).rgb);
  float tr = luminance(texture(colorTexture, v_textureCoordinates + vec2(texel.x, texel.y)).rgb);
  float l  = luminance(texture(colorTexture, v_textureCoordinates + vec2(-texel.x, 0.0)).rgb);
  float r  = luminance(texture(colorTexture, v_textureCoordinates + vec2(texel.x, 0.0)).rgb);
  float bl = luminance(texture(colorTexture, v_textureCoordinates + vec2(-texel.x, -texel.y)).rgb);
  float b  = luminance(texture(colorTexture, v_textureCoordinates + vec2(0.0, -texel.y)).rgb);
  float br = luminance(texture(colorTexture, v_textureCoordinates + vec2(texel.x, -texel.y)).rgb);

  // Sobel operator
  float gx = -tl - 2.0*l - bl + tr + 2.0*r + br;
  float gy = -tl - 2.0*t - tr + bl + 2.0*b + br;
  float edge = sqrt(gx*gx + gy*gy);

  vec4 originalColor = texture(colorTexture, v_textureCoordinates);

  if (edge > threshold) {
    out_FragColor = edgeColor;
  } else {
    out_FragColor = originalColor * 0.3;
  }
}
