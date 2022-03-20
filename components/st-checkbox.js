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

const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;



const template = document.createElement("template");
template.innerHTML = `
    <style> 
           :host {
               display:inline-block;
               box-sizing: border-box;
           }
             .validationFailed{
              color:#d52d2d !important;
              }
            .disabled{
                  opacity: 0.7;
                  cursor: not-allowed !important;
              }
           
             .input-label{
                padding-right:2px;
                position:relative;
                font-weight:bold;
                top:3px;
                 
              }
              .inputWrapper{
                 padding:7px;
                 top: -7px;
                 position: relative;
              }
              .block-label {
                padding-bottom: 13px;
                padding-left: 1px;
              }
              .block-wrapper {
                display:grid;
                position: relative;
                top: -28px;
               
              }
              input[type=checkbox] {
                  position: relative;
                  cursor: pointer;
                  -moz-appearance:initial;
              }
               input[type=checkbox]:before {
                  content: "";
                  display: block;
                  position: relative;
                  width: 16px;
                  height: 16px;
                 padding:1px;
                  border: 2px solid #555555;
                  background-color: #e4e4e5;
                  border-radius: 3px;
                  ${isFirefox ? 'top:11px' :''}
          }
              input[type=checkbox]:checked:after {
                  content: "";
                  display: block;
                  width: 5px;
                  padding:1px;
                  height: 10px;
                  border: solid black;
                  border-width: 0 2px 2px 0;
                  -webkit-transform: rotate(45deg);
                  -ms-transform: rotate(45deg);
                  transform: rotate(45deg);
                  position: absolute;
                  ${isFirefox ? 'top:12px' :'top:2px'};
                  left: 6px;
          }
          </style>
          <div class="inputWrapper" >
             <div class="innerWrapper">
             <label class="input-label"></label>   
               <input class="primary-input" type="checkbox"></input>
             
            </div>
           
          </div>
  `;

class Checkbox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

    }

    connectedCallback() {
        this.render();
    }

    render() {

        if (this.getAttribute("disabled") == "true") {
            this.disable();
        }

        if (this.getAttribute("label") != null) {
            this.setLabel(this.getAttribute("label"));
        }
        if (this.getAttribute("value") != null) {
            this.setValue(this.getAttribute("value") == "true");
        }
        if (
            this.getAttribute("readOnly") == "true" ||
            this.getAttribute("readonly") == "true"
        ) {
            this.setReadOnly(true);
        }


        if (this.getAttribute("display") == "block") {
            let wrapper = this.shadowRoot.querySelector(".innerWrapper");
            wrapper.classList.add("block-wrapper");
            let label = this.shadowRoot.querySelector(".input-label");
            label.classList.add("block-label");
            if (isFirefox){
                let st = "input[type=checkbox]:before { top: 0px; }";
                this.shadowRoot.appendChild(style(st));
                st = "input[type=checkbox]:checked::after { top: 2px; }";
                this.shadowRoot.appendChild(style(st));
            }

        }
        if (this.getAttribute("required") == "true") {
            this.setRequired(true);
        }
        if (this.getAttribute("width") != null) {
            this.getWrapper().style.width = this.getAttribute("width");
            this.getInput().style.width = this.getAttribute("width");
        }
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
            return window.__$STAK.styles.checkbox;
        } catch (error) {

        }
        return null;
    }

    isRequired() {
        let input = this.shadowRoot.querySelector("input");
        return input.required;
    }

    validate() {
        if (this.isRequired()) {
            if (
                this.getValue() == null ||
                this.getValue() == undefined ||
                this.getValue() == ""
            ) {
                this.applyFailedValidationState();
                this.setAttribute("valid", false);
            } else {
                this.setAttribute("valid", true);
            }
        } else {
            this.setAttribute("valid", true);
        }
    }

    isValid() {
        if (!this.isRequired()) {
            return true;
        }
        return (
            this.getValue() != null &&
            this.getValue() != undefined &&
            this.getValue() != ""
        );
    }

    clear() {
        this.setValue(null);
        this.clearFailedState();
    }

    clearFailedState() {
        let label = this.shadowRoot.querySelector(".input-label");
        label.classList.remove("validationFailed");
    }

    applyFailedValidationState() {
        let label = this.shadowRoot.querySelector(".input-label");
        label.classList.add("validationFailed");
    }

    getLabelText() {
        let label = this.shadowRoot.querySelector(".input-label");
        return label.innerText;
    }

    getWrapper() {
        return this.shadowRoot.querySelector(".inputWrapper");
    }


    setReadOnly(val) {
        this.getInput().readOnly = val;
    }
    setLabel(text) {
        let label = this.shadowRoot.querySelector(".input-label");
        label.innerText = text;
    }

    event(ev, callback) {
        this.getInput().addEventListener(ev, callback);
    }

    setRequired(val) {
        let input = this.shadowRoot.querySelector("input");
        input.required = val;
        if (val) {
            let label = this.shadowRoot.querySelector(".input-label");
            let text = label.innerText + " *";

            this.setLabel(text);
        }
    }

    getInput() {
        let input = this.shadowRoot.querySelector("input");
        return input;
    }

    getValue() {
        let input = this.shadowRoot.querySelector("input");
        return input.checked;
    }

    setValue(val) {
        this.getInput().checked = val;
    }

    enable() {
        let input = this.shadowRoot.querySelector("input");
        input.disabled = false;
        input.classList.remove("disabled");
    }

    disable() {
        let input = this.shadowRoot.querySelector("input");
        input.disabled = true;
        input.classList.add("disabled");
    }


}
window.customElements.define("st-checkbox", Checkbox);
