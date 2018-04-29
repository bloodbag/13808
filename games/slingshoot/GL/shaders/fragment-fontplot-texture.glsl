#version 150

uniform sampler2D fontTex;

in vec2 fragTexCoord;

out vec4 finalColor;

void main() {
    finalColor = texture(fontTex, fragTexCoord);
}