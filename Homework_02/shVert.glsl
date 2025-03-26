#version 300 es
layout(location = 0) in vec3 aPos;

uniform vec2 uOffset;

void main() {
    vec3 pos = aPos + vec3(uOffset, 0.0);
    gl_Position = vec4(pos, 1.0);
}
