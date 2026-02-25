// Projective Texture Fragment Shader
// Applies projected camera image with falloff and blending

precision highp float;

varying vec3 v_positionEC;
varying vec3 v_normalEC;
varying vec4 v_projTexCoord;
varying vec2 v_st;

uniform sampler2D u_cameraTexture;
uniform float u_opacity;
uniform float u_falloff;

void main() {
  vec3 projCoord = v_projTexCoord.xyz / v_projTexCoord.w;
  
  // Convert from [-1,1] to [0,1]
  vec2 texCoord = projCoord.xy * 0.5 + 0.5;
  
  // Check if we're within the projection frustum
  bool inFrustum = texCoord.x >= 0.0 && texCoord.x <= 1.0 &&
                   texCoord.y >= 0.0 && texCoord.y <= 1.0 &&
                   projCoord.z > 0.0;

  if (inFrustum) {
    vec4 texColor = texture2D(u_cameraTexture, texCoord);
    
    // Distance-based falloff
    float dist = length(texCoord - vec2(0.5));
    float falloff = 1.0 - smoothstep(0.0, u_falloff, dist);
    
    // Normal-based opacity (don't project on surfaces facing away)
    float normalDot = max(dot(normalize(v_normalEC), vec3(0.0, 0.0, 1.0)), 0.0);
    float alpha = texColor.a * u_opacity * falloff * normalDot;
    
    gl_FragColor = vec4(texColor.rgb, alpha);
  } else {
    discard;
  }
}
