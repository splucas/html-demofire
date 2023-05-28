class FillRectRenderer
{
    // Fill Rectangle Renderer
    // Uses the context2d.rect / fill methods to drawn on the context
    // Ultimately, this also means we must create a palette containing RGB data

    constructor()
    {
        this.palette = this.getPalette()
    }

    getPalette()
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

    render(context, buffer, buffWidth, buffHeight)
    {
        let palette = this.palette;
        let ctx = context;
        let pixSize = 4;
        for(let ycnt = 0; ycnt < buffHeight-2; ycnt ++)
        {
            for (let xcnt = 0; xcnt< buffWidth; xcnt ++) 
            {
                let bndx = ycnt * buffWidth + xcnt;
                var col = palette[buffer[bndx]];
                
                ctx.beginPath();
                ctx.rect(xcnt * pixSize, ycnt * pixSize, pixSize, pixSize)
                ctx.fillStyle = col;
                ctx.fill();
            }
        }        
    }
}




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
        
        this.fireBufferWidth = Math.floor(this.width / this.pixelSize);
        this.fireBufferHeight = Math.floor(this.height / this.pixelSize);

        this.frameBuffer = new Array(this.fireBufferHeight*this.fireBufferWidth).fill(0)
        this.preFrameBuffer = new Array(this.fireBufferHeight*this.fireBufferWidth).fill(0)

        const template = document.createElement('template');
        template.innerHTML = this.template(this.width, this.height);
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));

        this.context2d = null;

        this.isRunning = false;
        this.triggerStop = false;

        this.renderer = null;
        this.renderClass = FillRectRenderer;
        
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
        // Don't restart it if already running...
        if(this.isRunning || this.triggerStop) return;

        if(this.renderer == null)
            this.renderer = new this.renderClass();

        this.resetFire();
        let canvas = this.shadowRoot.querySelector("#demofirecanvas");
        this.context2d = canvas.getContext("2d");
        this.isRunning = true;
        this.triggerStop = false;
        this.runBurnFrame(0);
    }

    stopFire()
    {
        this.triggerStop = true;
    }

    runBurnFrame(stopFrames)
    {
        this.drawFrame();
        if(this.triggerStop)
        {
            stopFrames += 1;
            if(stopFrames > 60)
            {
                this.isRunning = false;
                this.triggerStop = false;
            }
        }
        if(this.isRunning)
            requestAnimationFrame(()=>this.runBurnFrame(stopFrames));
    }

    drawFrame()
    {
        let fbWidth     = this.fireBufferWidth;
        let fbHeight    = this.fireBufferHeight;
        let fBuffer     = this.frameBuffer;
        let pfBuffer    = this.preFrameBuffer;

        var ndx = 0;
        for(ndx = fbWidth + 1; ndx < (fbHeight - 1) * fbWidth - 1; ndx++) 
        {
            /* Average the eight neighbours. */
            let sum = pfBuffer[ndx - fbWidth - 1] 
                    + pfBuffer[ndx - fbWidth    ] 
                    + pfBuffer[ndx - fbWidth + 1] 
                    + pfBuffer[ndx - 1] 
                    + pfBuffer[ndx + 1] 
                    + pfBuffer[ndx + fbWidth - 1] 
                    + pfBuffer[ndx + fbWidth    ] 
                    + pfBuffer[ndx + fbWidth + 1];
                    
            let avg = Math.floor(sum / 8);

            if (!(sum & 3) && (avg > 0 || ndx >= (fbHeight - 4) * fbWidth)) 
            {
                    avg--;
            }

            if(!this.triggerStop)
                if(avg < 0) avg = 255;

            fBuffer[ndx] = avg;
        }

        for(ndx = 0; ndx < (fbHeight - 2) * fbWidth; ndx++) 
        {
            pfBuffer[ndx] = fBuffer[ndx + fbWidth];
        }

        this.renderer.render(this.context2d, pfBuffer, fbWidth, fbHeight);
    }

}

customElements.define("exp-demofire-comp", DemoFire);


