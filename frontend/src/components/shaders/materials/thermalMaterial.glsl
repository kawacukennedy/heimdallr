// Thermal Material Shader
// Applied to entities for iron-bow thermal appearance

uniform float u_minTemp;
uniform float u_maxTemp;

vec3 thermalPalette(float t) {
  vec3 c0 = vec3(0.0, 0.0, 0.2);
  vec3 c1 = vec3(0.5, 0.0, 0.5);
  vec3 c2 = vec3(1.0, 0.0, 0.0);
  vec3 c3 = vec3(1.0, 0.5, 0.0);
  vec3 c4 = vec3(1.0, 1.0, 0.0);
  vec3 c5 = vec3(1.0, 1.0, 1.0);
  
  float step = 0.2;
  if (t < step) return mix(c0, c1, t / step);
  if (t < 2.0 * step) return mix(c1, c2, (t - step) / step);
  if (t < 3.0 * step) return mix(c2, c3, (t - 2.0 * step) / step);
  if (t < 4.0 * step) return mix(c3, c4, (t - 3.0 * step) / step);
  return mix(c4, c5, (t - 4.0 * step) / step);
}

czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  
  float luminance = dot(material.diffuse, vec3(0.299, 0.587, 0.114));
  float temp = clamp((luminance - u_minTemp) / (u_maxTemp - u_minTemp), 0.0, 1.0);
  
  material.diffuse = thermalPalette(temp);
  material.emission = material.diffuse * 0.2;
  
  return material;
}
