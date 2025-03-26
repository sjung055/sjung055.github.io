
import { resizeAspectRatio, setupText } from './util/util.js';
import { Shader, readShaderFile } from './util/shader.js';

const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');
let shader;   // shader program
let vao;      // vertex array object
let offset = { x:0.0, y:0.0 } ;

function initWebGL() {
    if (!gl) {
        console.error('WebGL 2 is not supported by your browser.');
        return false;
    }

    canvas.width = 600; // condition 1) the initial canvas size is 600x600
    canvas.height = 600; // condition 1) the initial canvas size is 600x600
    
    // condition 7) With the 'resizeAspectRatio()' function, maintain the aspect ratio of the canvas with 1:1. 
    resizeAspectRatio(gl, canvas);

    // Initialize WebGL settings
    gl.viewport(0, 0, canvas.width, canvas.height);
    /////////////////////////// modified ///////////////////////////
    gl.clearColor(0.0, 0.0, 0.0, 1.0); //background color: black
    /////////////////////////// modified ///////////////////////////
    
    return true;
}

async function initShader() {
    const vertexShaderSource = await readShaderFile('shVert.glsl');
    const fragmentShaderSource = await readShaderFile('shFrag.glsl');
    shader = new Shader(gl, vertexShaderSource, fragmentShaderSource);
}

function setupKeyboardEvents() {
    const step = 0.01; // condition 3) One arrow key press moves the square by 0.01.
    const halfSize = 0.1;
    const limit = 1.0 - halfSize;

    const keys = {
        ArrowUp:    () => {
            if (offset.y + step <= limit) offset.y += step;
        },
        ArrowDown:  () => {
            if (offset.y - step >= -limit) offset.y -= step;
        },
        ArrowLeft:  () => {
            if (offset.x - step >= -limit) offset.x -= step;
        },
        ArrowRight: () => {
            if (offset.x + step <= limit) offset.x += step;
        }
    };

    document.addEventListener('keydown', (event) => {
        if (event.key in keys){
            keys[event.key]();
            shader.setVec2('uOffset', offset.x, offset.y);
        }
    });
}

function setupBuffers() {
    // condition 2) the squre's side length is 0.2 and the square is located at the center of the canvas
    const vertices = new Float32Array([
        -0.1,  0.1, 0.0,  // Top-left
        -0.1, -0.1, 0.0,  // Bottom-left
         0.1, -0.1, 0.0,  // Bottom-right
         0.1,  0.1, 0.0   // Top-right
    ]);

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    shader.setAttribPointer('aPos', 3, gl.FLOAT, false, 0, 0);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); // condition 5) Draw the square without index and use TRIANGLE_FAN for primitive type

    requestAnimationFrame(() => render());
}

async function main() {
    try {

        // WebGL 초기화
        if (!initWebGL()) {
            throw new Error('WebGL 초기화 실패');
        }

        // 셰이더 초기화
        await initShader();

        // setup text overlay (see util.js)
        // condition 7) Display the text "Use arrow keys to move the rectangle" on the canvas
        setupText(canvas, "Use arrow keys to move the rectangle", 1);

        // 나머지 초기화
        setupBuffers(shader);

        shader.use();

        ////////////////////////////////// added ///////////////////////////////////
        shader.setVec2('uOffset', offset.x, offset.y);
        setupKeyboardEvents();
        ////////////////////////////////// added ///////////////////////////////////

        // 렌더링 시작
        render();

        return true;

    } catch (error) {
        console.error('Failed to initialize program:', error);
        alert('프로그램 초기화에 실패했습니다.');
        return false;
    }
}

// call main function
main().then(success => {
    if (!success) {
        console.log('프로그램을 종료합니다.');
        return;
    }
}).catch(error => {
    console.error('프로그램 실행 중 오류 발생:', error);
});
