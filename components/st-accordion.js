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
.accordion {
    background-color: #eee;
    color: #444;
    cursor: pointer;
    padding: 18px;
    width: 100%;
    text-align: left;
    border: none;
    outline: none;
    transition: 0.3s;
    
}


.active-accordion, .accordion:hover {
    background-color: #ccc;
}

.accordion-panel {
    padding: 15px;
    background-color: white;
    display: none;
    overflow: hidden;
}
</style>

<button  class="accordion" type="button" ></button>
<div class="accordion-panel"> 
<slot></slot>

</div>

`;

class AccordionTab extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(templateTab.content.cloneNode(true));

    }

    connectedCallback() {
        this.render();

    }

    render() {
        this.shadowRoot.querySelector('button').innerText = this.getAttribute('name');
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

    getButton() {
        return this.shadowRoot.querySelector("button");
    }
    event(ev, callback) {
        this.getButton().addEventListener(ev, callback);
    }

    getPanel() {
        return this.shadowRoot.querySelector(".accordion-panel");
    }
    toggleActive() {
        let panel = this.shadowRoot.querySelector(".accordion-panel");
        panel.classList.toggle("active-accordion")
        if (panel.style.display === "block") {
            panel.style.display = "none";
            this.setAttribute("active", false);
        } else {
            panel.style.display = "block";
            this.setAttribute("active", true);
        }
    }

    isActive() {
        let a = this.getAttribute("active");
        return a == "true";
    }

    getHeader() {
        return this.getButton().textContent;
    }

    getStyle() {
        try {
            return window.__$STAK.styles.accordionTab;
        } catch (error) {

        }
        return null;
    }


}
window.customElements.define('st-accordion-tab', AccordionTab);



const template = document.createElement('template');
template.innerHTML = `
<slot></slot>
`;

class Accordion extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.events = {}
    }

    event(name, callback) {
        this.events[name] = callback;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (this.getAttribute("tabChanged") != null) {
            this.event("tabChanged", window[this.getAttribute("tabChanged")]);
        }
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            this.attachAccordionListeners();
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
            return window.__$STAK.styles.accordion;
        } catch (error) {

        }
        return null;
    }

    attachAccordionListeners() {
        let acc = this.children;

        for (let i = 0; i < acc.length; i++) {
            let tab = acc[i];
            this.addClickHandler(tab, tab.getButton(), this)
        }
    }

    addClickHandler(elem, button, self) {
        button.addEventListener('click', function (e) {

          
            let fromList = elem;
            let active = self.children
            let arr = Array.prototype.slice.call(active);
            let lastActive = arr.filter(tab => tab.isActive())[0];
          
            if (lastActive != null){
                lastActive.toggleActive();
            }
           
            elem.toggleActive();

            let changedEvent = new CustomEvent("tabChanged", {
                detail: {
                    old: lastActive == undefined ? null : lastActive,
                    new: fromList
                }
            })
            if ("tabChanged" in self.events) {
                self.events.tabChanged(changedEvent);
            }


        }, false);
    }
}
window.customElements.define('st-accordion', Accordion);