class FillRectRenderer
{
    // Fill Rectangle Renderer
    // Uses the context2d.rect / fill methods to drawn on the context
    // Ultimately, this also means we must create a palette containing RGB data

    constructor(canvas)
    {
        this.context2d = canvas.getContext("2d");
        
        this.palette = this.getPalette()
        this.width = canvas.width;
        this.height = canvas.height;

     
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

        
        let pal = getDemoPalette();
        let palette = new Array(256);
        let ndx = 0;
        console.log(pal.length)
        let palNdx = 0;
        for(; ndx < pal.length; ndx += 3)
        {
            let newrgb = C(  pal[ndx],
                             pal[ndx + 1],
                             pal[ndx + 2]  )

            palette[palNdx] = newrgb;
            palNdx += 1;
        }
        let white = 'rgb(255,255,255)';
        
        for(; palNdx < palette.length; palNdx ++)
        {
            palette[palNdx] = white
        }
        return palette;            
    }

    render( buffer, buffWidth, buffHeight)
    {
        let palette = this.palette;
        let ctx = this.context2d;
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


class ImageDataRenderer
{
    // Render an image data structure
    constructor(canvas)
    {
        this.context2d = canvas.getContext("2d");
        this.imageData = this.context2d.createImageData(canvas.width, canvas.height );
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        this.palette = this.getPalette();

        console.log(this.canvasHeight, this.canvasWidth)

        let idNdx = 0
        let imgData = this.imageData.data;
        for(let ndx = 0; ndx < canvas.width * canvas.height; ndx ++)
        {
            imgData[idNdx ]    = 0;
            imgData[idNdx + 1] = 0;
            imgData[idNdx + 2] = 0;
            imgData[idNdx + 3] = 255;
            idNdx += 4;
        }
    }
    getPalette()
    {
        let pal = getDemoPalette();
        let palette = new Array(256*3);
        let ndx = 0;
        for(; ndx < pal.length; ndx ++)
            palette[ndx] = pal[ndx] * 4;
        
        for(; ndx < palette.length; ++ndx)
            palette[ndx] = 255;

        return palette;            

    }
    render( buffer, buffWidth, buffHeight)
    {
        let imgData = this.imageData;
        let palette = this.palette;
        let imdNdx = 0;

        for(var ycnt = 0; ycnt < this.canvasHeight; ycnt ++)
        {
            for(var xcnt = 0; xcnt < this.canvasWidth; xcnt++)
            {

                let bndx = Math.floor(ycnt / 4) * buffWidth + Math.floor(xcnt / 4);
                let buffLookup = buffer[ bndx ];
                let r =  palette[buffLookup*3];
                let g = palette[buffLookup*3 + 1];
                let b = palette[buffLookup*3 + 2];
                
                imgData.data[imdNdx]     = r;
                imgData.data[imdNdx + 1] = g;
                imgData.data[imdNdx + 2] = b;
                imgData.data[imdNdx + 3] = 255;
                
                imdNdx += 4;
            }
    
        }
        
        this.context2d.putImageData(imgData, 0, 0);
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
        this.renderClass = ImageDataRenderer;
        //this.renderClass = FillRectRenderer;
        
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


        this.resetFire();
        let canvas = this.shadowRoot.querySelector("#demofirecanvas");


        if(this.renderer == null)
            this.renderer = new this.renderClass(canvas);

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

        this.renderer.render( pfBuffer, fbWidth, fbHeight);
    }

}

customElements.define("exp-demofire-comp", DemoFire);



function getDemoPalette()
{
    let pal = [
        0,   0,   0,   0,   1,   1,   0,   4,   5,   0,   7,   9,
        0,   8,  11,   0,   9,  12,  15,   6,   8,  25,   4,   4,
       33,   3,   3,  40,   2,   2,  48,   2,   2,  55,   1,   1,
       63,   0,   0,  63,   0,   0,  63,   3,   0,  63,   7,   0,
       63,  10,   0,  63,  13,   0,  63,  16,   0,  63,  20,   0,
       63,  23,   0,  63,  26,   0,  63,  29,   0,  63,  33,   0,
       63,  36,   0,  63,  39,   0,  63,  39,   0,  63,  40,   0,
       63,  40,   0,  63,  41,   0,  63,  42,   0,  63,  42,   0,
       63,  43,   0,  63,  44,   0,  63,  44,   0,  63,  45,   0,
       63,  45,   0,  63,  46,   0,  63,  47,   0,  63,  47,   0,
       63,  48,   0,  63,  49,   0,  63,  49,   0,  63,  50,   0,
       63,  51,   0,  63,  51,   0,  63,  52,   0,  63,  53,   0,
       63,  53,   0,  63,  54,   0,  63,  55,   0,  63,  55,   0,
       63,  56,   0,  63,  57,   0,  63,  57,   0,  63,  58,   0,
       63,  58,   0,  63,  59,   0,  63,  60,   0,  63,  60,   0,
       63,  61,   0,  63,  62,   0,  63,  62,   0,  63,  63,   0];

    return pal;

}


