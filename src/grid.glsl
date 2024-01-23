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
uniform vec2 u_offset;
uniform vec4 u_background_color;
uniform vec4 u_line_color;

vec3 drawGrid(vec2 center, vec3 color, vec3 lineColor, float spacing, float width, float zoom) {
    spacing *= zoom;
    vec2 cells = abs(fract(center * u_graphic_resolution / spacing) - 0.5);
    float distToEdge = (0.5 - max(cells.x, cells.y)) * spacing;
    float lines = smoothstep(0., width, distToEdge);
    color = mix(lineColor,color,lines);
    return color;
}
void main() {
    vec2 center = v_uv; // center screen
    vec2 offset = (u_offset / u_graphic_resolution) * u_camera_zoom;
    vec2 distFromCenter = (center + offset)  - (u_camera / u_graphic_resolution) * u_camera_zoom;
    vec3 gridColor = drawGrid(distFromCenter, u_background_color.rgb, u_line_color.rgb, u_spacing, u_width,  u_camera_zoom);
    fragColor.a = 1.;
    fragColor.rgb = gridColor * fragColor.a; // excalibur expects pre-multiplied colors in shaders

}