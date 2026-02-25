// Water Effect Material Shader
// Animated water surface for oceanic rendering

uniform float u_time;
uniform vec4 u_waterColor;
uniform float u_waveAmplitude;
uniform float u_waveFrequency;

czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  
  vec2 st = materialInput.st;
  
  // Animated wave pattern
  float wave1 = sin(st.x * u_waveFrequency + u_time * 0.5) * u_waveAmplitude;
  float wave2 = sin(st.y * u_waveFrequency * 0.8 + u_time * 0.3) * u_waveAmplitude * 0.7;
  float wave3 = sin((st.x + st.y) * u_waveFrequency * 0.6 + u_time * 0.7) * u_waveAmplitude * 0.5;
  
  float combinedWave = wave1 + wave2 + wave3;
  
  // Perturb normal for specular reflections
  vec3 perturbedNormal = normalize(vec3(
    combinedWave * 0.1,
    combinedWave * 0.1,
    1.0
  ));
  
  material.normal = perturbedNormal;
  material.diffuse = u_waterColor.rgb;
  material.alpha = u_waterColor.a;
  material.specular = 0.8;
  material.shininess = 64.0;
  
  // Fresnel-like rim effect
  float fresnel = pow(1.0 - abs(dot(perturbedNormal, vec3(0.0, 0.0, 1.0))), 3.0);
  material.diffuse = mix(material.diffuse, vec3(0.8, 0.9, 1.0), fresnel * 0.3);
  
  return material;
}
