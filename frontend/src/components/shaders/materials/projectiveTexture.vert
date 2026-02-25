// Projective Texture Vertex Shader
// Projects a camera image onto scene geometry

attribute vec3 position;
attribute vec3 normal;
attribute vec2 st;

varying vec3 v_positionEC;
varying vec3 v_normalEC;
varying vec4 v_projTexCoord;
varying vec2 v_st;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

void main() {
  vec4 worldPosition = u_modelMatrix * vec4(position, 1.0);
  v_positionEC = (u_viewMatrix * worldPosition).xyz;
  v_normalEC = normalize((u_viewMatrix * u_modelMatrix * vec4(normal, 0.0)).xyz);
  v_projTexCoord = u_projectionMatrix * worldPosition;
  v_st = st;
  
  gl_Position = czm_modelViewProjection * vec4(position, 1.0);
}
