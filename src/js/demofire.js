/* 
HTML Custom Element Component that displays the classic Demo Dire.
*/
export class DemoFire extends HTMLElement
{
    constructor()
    {
        super();

        // Canvas width and height
        this.width = this.getIntAttribute("width", 320);
        this.height = this.getIntAttribute("height", 200);

        this.pixelSize = 4; 
        
        this.fireBufferWidth = this.width / this.pixelSize;
        this.fireBufferHeight = this.height / this.pixelSize;

        this.frameBuffer = new Array(this.fireBufferHeight*this.fireBufferWidth).fill(0)
        this.preFrameBuffer = new Array(this.fireBufferHeight*this.fireBufferWidth).fill(0)

        const template = document.createElement('template');
        template.innerHTML = this.template(this.width, this.height);
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));

        this.context2d = null;

        this.isRunning = false;
        this.triggerStop = false;
        
    }

    getIntAttribute(attrname, defaultval)
    {
        return parseInt(this.getAttribute(attrname)) || defaultval;
    }
    template(w,h)
    {
        return `
          <canvas id="demofirecanvas" width="${w}" height="${h}"></canvas>
        `;
    }

    resetFire()
    {
        this.frameBuffer.fill(0);
        this.preFrameBuffer.fill(0);
    }
    startFire()
    {
        this.resetFire();
        let canvas = this.shadowRoot.querySelector("#demofirecanvas");
        this.context2d = canvas.getContext("2d");
        this.isRunning = true;
        this.runBurnFrame();
        console.log("Fire Started");
        console.log(getPalette());
    }

    stopFire()
    {
        this.isRunning = false;
        console.log("Fire Stopped");
    }

    runBurnFrame()
    {

        if(this.isRunning)
            requestAnimationFrame(()=>this.runBurnFrame());
    }

}

customElements.define("exp-demofire-comp", DemoFire);

function getPalette()
{
    function C(r,g,b)
    {
        r = r * 4;
        b = b * 4;
        g = g * 4;
        return `rgb(${r.toString()},${g.toString()},${b.toString()})`;
    }
    var W = C(63,63,63);
    let palette = [
    C( 0,   0,   0), C( 0,   1,   1), C( 0,   4,   5), C( 0,   7,   9),
    C( 0,   8,  11), C( 0,   9,  12), C(15,   6,   8), C(25,   4,   4),
    C(33,   3,   3), C(40,   2,   2), C(48,   2,   2), C(55,   1,   1),
    C(63,   0,   0), C(63,   0,   0), C(63,   3,   0), C(63,   7,   0),
    C(63,  10,   0), C(63,  13,   0), C(63,  16,   0), C(63,  20,   0),
    C(63,  23,   0), C(63,  26,   0), C(63,  29,   0), C(63,  33,   0),
    C(63,  36,   0), C(63,  39,   0), C(63,  39,   0), C(63,  40,   0),
    C(63,  40,   0), C(63,  41,   0), C(63,  42,   0), C(63,  42,   0),
    C(63,  43,   0), C(63,  44,   0), C(63,  44,   0), C(63,  45,   0),
    C(63,  45,   0), C(63,  46,   0), C(63,  47,   0), C(63,  47,   0),
    C(63,  48,   0), C(63,  49,   0), C(63,  49,   0), C(63,  50,   0),
    C(63,  51,   0), C(63,  51,   0), C(63,  52,   0), C(63,  53,   0),
    C(63,  53,   0), C(63,  54,   0), C(63,  55,   0), C(63,  55,   0),
    C(63,  56,   0), C(63,  57,   0), C(63,  57,   0), C(63,  58,   0),
    C(63,  58,   0), C(63,  59,   0), C(63,  60,   0), C(63,  60,   0),
    C(63,  61,   0), C(63,  62,   0), C(63,  62,   0), C(63,  63,   0),
    W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W,
    W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W,
    W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W,
    W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W,
    W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W,
    W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W,
    W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W,
    W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W]; 
    
    return palette;            
}
