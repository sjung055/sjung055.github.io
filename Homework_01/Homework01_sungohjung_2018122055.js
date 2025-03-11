// Global constants
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');

if (!gl){
    console.error('WebGL2 is not supported in your browser.');
}

canvas.width = 500;
canvas.height = 500;


gl.viewport(0,0, canvas.width, canvas.height);
// Start rendering
render();

function render() {
    const halfHeight = canvas.height/2;
    const halfWidth = canvas.width/2;

    gl.enable(gl.SCISSOR_TEST);
    // red
    gl.scissor(0, halfHeight, halfWidth, halfHeight);
    gl.clearColor(1, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // green
    gl.scissor(halfWidth, halfHeight, halfWidth, halfHeight);
    gl.clearColor(0, 1, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // blue
    gl.scissor(0, 0, halfWidth, halfHeight);
    gl.clearColor(0, 0, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // yellow
    gl.scissor(halfWidth, 0, halfWidth, halfHeight);
    gl.clearColor(1, 1, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.disable(gl.SCISSOR_TEST);
}

window.addEventListener('resize', () => {
    if (window.innerWidth > window.innerHeight){
        canvas.width = window.innerHeight;
        canvas.height = window.innerHeight;    
    }else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth;  
    }
    gl.viewport(0,0, canvas.width, canvas.height);
    render();
});
