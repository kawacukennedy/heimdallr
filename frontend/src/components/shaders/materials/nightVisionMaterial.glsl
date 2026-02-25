// Night Vision Material Shader
// Applied to individual entities/primitives for a night vision appearance

uniform float u_intensity;
uniform float u_noiseScale;

czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  
  vec2 st = materialInput.st;
  
  // Green tint with luminance preservation
  float luminance = dot(material.diffuse, vec3(0.299, 0.587, 0.114));
  material.diffuse = vec3(0.1, luminance * u_intensity, 0.1);
  
  // Add noise
  float noise = fract(sin(dot(st * u_noiseScale, vec2(12.9898, 78.233))) * 43758.5453);
  material.diffuse += vec3(noise * 0.05, noise * 0.1, noise * 0.05);
  
  // Slight glow
  material.emission = vec3(0.0, luminance * 0.1, 0.0);
  
  return material;
}
