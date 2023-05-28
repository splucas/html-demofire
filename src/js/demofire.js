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
        this.shadowRoot.appendChild(document.importNode(template.content, true))
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

    startFire()
    {
        console.log("FIRE STARTED!");
    }


}

customElements.define("exp-demofire-comp", DemoFire);