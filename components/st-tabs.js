const stylesheet = (href) => {
    const el = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = href;
    return el;
};
const style = (content) => {
    const el = document.createElement('style');

    el.innerHTML = content;
    return el;
};


const templateTab = document.createElement('template');
templateTab.innerHTML = `
<style>
 
.tab-header {
    border: none;
    padding-left: 9px;
    padding-right: 10px;
    padding-top: 6px;
    padding-bottom: 5px;
    background: transparent;
    cursor:pointer;
}
.tab-header:hover {
    border-bottom: solid #4b8cc7;

}
.tab-header-active{
    font-weight: bold;
    border-bottom: solid #4b8cc7;
}
.tab-content {
    display:none;
    padding:15px;
    position:absolute;
}
.visible {
    display:block;
}


</style>

<button  class="tab-header" type="button" ></button>
<div class="tab-content"> 
    <slot></slot>
</div>

`;

class Tab extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(templateTab.content.cloneNode(true));

    }

    connectedCallback() {
        this.render();

    }

    render() {
        this.getHeader().innerText = this.getAttribute('header');
        this.setAttribute("active", false);
        if (this.getStyle() != null) {
            this.shadowRoot.appendChild(style(this.getStyle()));
        }
        if (this.getAttribute("customStyle") != null) {
            this.shadowRoot.appendChild(stylesheet(this.getAttribute("customStyle")));
        }
        if (this.getAttribute("extraStyles") != null) {
            this.shadowRoot.appendChild(style(this.getAttribute("extraStyles")));
        }
    }

    getHeader() {
        return this.shadowRoot.querySelector("button");
    }
    event(ev, callback) {
        this.getHeader().addEventListener(ev, callback);
    }

    getWrapper() {
        return this.shadowRoot.querySelector(".tab-content");
    }
    toggleActive() {
        let content =  this.getWrapper();
        content.classList.toggle("visible")
        if (content.style.display === "block") {
            content.style.display = "none";
            this.setAttribute("active", false);
            this.getHeader().classList.toggle("tab-header-active")
        } else {
            content.style.display = "block";
            this.setAttribute("active", true);
            this.getHeader().classList.toggle("tab-header-active")
        }
    }

    isActive() {
        let a = this.getAttribute("active");
        return a == "true";
    }

    getHeaderText() {
        return this.getHeader().textContent;
    }

    getStyle() {
        try {
            return window.__$STAK.styles.tab;
        } catch (error) {

        }
        return null;
    }


}
window.customElements.define('st-tab', Tab);



const template = document.createElement('template');
template.innerHTML = ` 
<style>
:host {
 
}
</style>
<slot></slot>
`;

class Tabs extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

    }

    connectedCallback() {
        this.render();
    }

    render() {
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            this.attachTabClickListeners();
        })
        if (this.getStyle() != null) {
            this.shadowRoot.appendChild(style(this.getStyle()));
        }
        if (this.getAttribute("customStyle") != null) {
            this.shadowRoot.appendChild(stylesheet(this.getAttribute("customStyle")));
        }

        if (this.getAttribute("extraStyles") != null) {
            this.shadowRoot.appendChild(style(this.getAttribute("extraStyles")));
        }

    }


    getStyle() {
        try {
            return window.__$STAK.styles.tabs;
        } catch (error) {

        }
        return null;
    }

    attachTabClickListeners() {
        let acc = this.children;

        for (let i = 0; i < acc.length; i++) {
            let tab = acc[i];
            if (i == 0){
                tab.toggleActive();
            }
            this.addClickHandler(tab, tab.getHeader(), this)
        }
    }

    addClickHandler(elem, button, self) {
        button.addEventListener('click', function (e) {

            if (!elem.isActive()){
                elem.toggleActive();
             
            }
           
            let fromList = elem;
            let active = self.children
            let arr = Array.prototype.slice.call(active);


            arr.forEach(function (fromLoop) {
                if (fromList != fromLoop && fromLoop.isActive()) {
                    fromLoop.toggleActive();
                }

            });



        }, false);
    }
}
window.customElements.define('st-tabs', Tabs);