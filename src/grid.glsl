#version 300 es
precision mediump float;

in vec2 v_uv; // built in from excalibur

out vec4 fragColor;

uniform vec2 u_resolution; // built in uniform from excalibur
uniform vec2 u_graphic_resolution; // built in uniform from excalibur
uniform float u_spacing;
uniform float u_width;
uniform vec2 u_camera;
uniform float u_camera_zoom;

vec3 drawGrid(vec2 center, vec3 color, vec3 lineColor, float spacing, float width, float zoom) {
    spacing *= zoom;
    // center = center + (zoom * u_graphic_resolution);
    vec2 cells = abs(fract(center * u_graphic_resolution / spacing) - 0.5);
    float distToEdge = (0.5 - max(cells.x, cells.y)) * spacing;
    float lines = smoothstep(0.91, 0.99, distToEdge);
    color = mix(lineColor,color,lines);
    return color;
}
void main() {
    vec3 white = vec3(1.);
    vec3 black = vec3(0.);
    vec2 center = v_uv; // center screen
    vec2 distFromCenter = center - (u_camera / u_graphic_resolution) * u_camera_zoom;
    vec3 gridColor = drawGrid(distFromCenter, black, white, u_spacing, u_width,  u_camera_zoom);
    fragColor.a = 1.0;
    fragColor.rgb = gridColor * fragColor.a; // excalibur expects pre-multiplied colors in shaders

}