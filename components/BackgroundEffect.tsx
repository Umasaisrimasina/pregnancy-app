import React, { useEffect, useRef } from 'react';

const BackgroundEffect: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        // Shaders
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            
            varying vec2 v_texCoord;
            uniform sampler2D u_image;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;
            
            // Optimized Simplex noise
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
            
            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                                   -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy));
                vec2 x0 = v - i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod289(i);
                vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                                        + i.x + vec3(0.0, i1.x, 1.0));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                                        dot(x12.zw,x12.zw)), 0.0);
                m = m*m;
                m = m*m;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
                vec3 g;
                g.x = a0.x * x0.x + h.x * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            // Kawase dual-pass blur for smoother quality
            vec4 blur(sampler2D tex, vec2 uv, float radius) {
                vec2 pixelSize = 1.0 / u_resolution;
                vec4 color = vec4(0.0);
                
                // Kawase downsample pattern (5 taps)
                float r = radius * 3.0;
                color += texture2D(tex, uv) * 4.0;
                color += texture2D(tex, uv + vec2(-r, -r) * pixelSize);
                color += texture2D(tex, uv + vec2( r, -r) * pixelSize);
                color += texture2D(tex, uv + vec2(-r,  r) * pixelSize);
                color += texture2D(tex, uv + vec2( r,  r) * pixelSize);
                color /= 8.0;
                
                // Second pass for extra smoothness
                vec4 color2 = vec4(0.0);
                float r2 = radius * 5.0;
                color2 += color * 4.0;
                color2 += texture2D(tex, uv + vec2(-r2, 0.0) * pixelSize);
                color2 += texture2D(tex, uv + vec2( r2, 0.0) * pixelSize);
                color2 += texture2D(tex, uv + vec2(0.0, -r2) * pixelSize);
                color2 += texture2D(tex, uv + vec2(0.0,  r2) * pixelSize);
                color2 /= 8.0;
                
                return color2;
            }
            
            void main() {
                vec2 uv = v_texCoord;
                
                // Flip Y for correct image orientation
                vec2 mousePos = vec2(u_mouse.x, 1.0 - u_mouse.y);
                
                // --- SWIRL EFFECT ---
                vec2 center = mousePos;
                float dist = distance(uv, center);
                float radius = 0.5;
                float strength = 0.5; // Mix amount
                
                // Falloff
                float percent = clamp(1.0 - dist / radius, 0.0, 1.0);
                
                // FIX: Use sin(time) for gentle oscillation
                float theta = percent * percent * (6.0 + sin(u_time * 2.5) * 1.0); 
                
                float s = sin(theta);
                float c = cos(theta);
                
                vec2 SwirledUV = vec2(
                    dot(uv - center, vec2(c, -s)),
                    dot(uv - center, vec2(s, c))
                );
                SwirledUV += center;
                
                // Apply swirl based on distance
                uv = mix(uv, SwirledUV, strength * percent);

                // --- NOISE & BLINDS (Subtle) ---
                float noiseVal = snoise(uv * 10.0 + u_time * 0.6) * 0.005;
                uv += noiseVal;
                
                // Fetch sharp and blurred
                vec4 sharp = texture2D(u_image, uv);
                vec4 blurred = blur(u_image, uv, 170.4 * 0.01);
                
                // Mix 130% blur
                vec4 color = mix(sharp, blurred, 1.3);
                
                // Vignette for extra polish
                float vignette = 1.0 - smoothstep(0.5, 1.5, length(v_texCoord - 0.5) * 1.5);
                color.rgb *= vignette;
                
                gl_FragColor = color;
            }
        `;

        // Compile Shader
        const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
            const program = gl.createProgram();
            if (!program) return null;
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('Program link error:', gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                return null;
            }
            return program;
        };

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader) return;

        const program = createProgram(gl, vertexShader, fragmentShader);
        if (!program) return;

        // Locations
        const positionLocation = gl.getAttribLocation(program, 'a_position');
        const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
        const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
        const timeLocation = gl.getUniformLocation(program, 'u_time');
        const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
        const imageLocation = gl.getUniformLocation(program, 'u_image');

        // Buffers
        const positionBuffer = gl.createBuffer();
        if (!positionBuffer) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]), gl.STATIC_DRAW);

        const texCoordBuffer = gl.createBuffer();
        if (!texCoordBuffer) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 1, 1, 1, 0, 0,
            0, 0, 1, 1, 1, 0
        ]), gl.STATIC_DRAW);

        // Texture
        const texture = gl.createTexture();
        if (!texture) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

        const image = new Image();
        image.crossOrigin = 'anonymous';
        // Ensure this path matches where we copy the file
        image.src = '/background-style/my bg.jpg';
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        };

        // State declaration for the render loop
        const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, vx: 0, vy: 0 };
        let time = 0;
        let animationFrameId: number;

        const resize = () => {
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        window.addEventListener('resize', resize);
        resize();

        const handleMouseMove = (e: MouseEvent) => {
            mouse.targetX = e.clientX / window.innerWidth;
            mouse.targetY = 1.0 - (e.clientY / window.innerHeight);
        };
        document.addEventListener('mousemove', handleMouseMove);

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                mouse.targetX = e.touches[0].clientX / window.innerWidth;
                mouse.targetY = 1.0 - (e.touches[0].clientY / window.innerHeight);
            }
        };
        document.addEventListener('touchmove', handleTouchMove);

        const render = () => {
            // Springy mouse physics
            const stiffness = 0.08;
            const damping = 0.75;
            const forceX = (mouse.targetX - mouse.x) * stiffness;
            const forceY = (mouse.targetY - mouse.y) * stiffness;
            mouse.vx = (mouse.vx + forceX) * damping;
            mouse.vy = (mouse.vy + forceY) * damping;
            mouse.x += mouse.vx;
            mouse.y += mouse.vy;

            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!reducedMotion) {
                time += 0.016;
            }

            gl.useProgram(program);
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.uniform1f(timeLocation, time);
            gl.uniform2f(mouseLocation, mouse.x, mouse.y);
            gl.uniform1i(imageLocation, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
            gl.enableVertexAttribArray(texCoordLocation);
            gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', resize);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(animationFrameId);

            // Cleanup
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(positionBuffer);
            gl.deleteBuffer(texCoordBuffer);
            gl.deleteTexture(texture);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
        />
    );
};

export default BackgroundEffect;
