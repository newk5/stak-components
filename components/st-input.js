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
const template = document.createElement('template');
template.innerHTML = `
  <style> 
          :host{
           
            display:inline-block;
            box-sizing: border-box;            
          }
          .primary-input {
            background: #e4e4e5;
            border: none;
            outline:none;
            padding: 11px;
            border-radius: 3px;
            box-sizing: border-box;
            position: relative;
            top: -6px;
         
           
          }
           .validationFailed{
            color:#d52d2d !important;
            }
          .disabled{
                opacity: 0.7;
                cursor: not-allowed !important;
            }
          .primary-input:hover {
                background: #d9d9d9;
            }
          .primary-input:focus {
            background: #d9d9d9;
            }
           .input-label{
                font-weight: bold;
                position: relative;
                padding-right:15px;
                top: -4px;
               
            }
            .inputWrapper{
                position: relative;
                top: 1px;
            }

            .block-label {
                padding-bottom: 13px;
                padding-left: 1px;
                top:3px;
              }
              .block-wrapper {
                display:inline-grid;
                position: relative;
                top: -35px;
              }
          
        </style>
          <div class="inputWrapper" >
            <label class="input-label"> </label>   
            <input   class="primary-input" type="text"></input>
         
        </div>
`;

class Input extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));


    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (this.getAttribute("disabled") == "true") {
            this.disable();
        }


        if (this.getAttribute("value") != null) {
            this.setValue(this.getAttribute("value"));
        }

        if (this.getAttribute("label") != null) {
            this.setLabel(this.getAttribute("label"));
        }
        if (this.getAttribute("readOnly") == "true" || this.getAttribute("readonly") == "true") {
            this.setReadOnly(true);
        }
        if (this.getAttribute("placeholder") != null) {
            this.setPlaceholder(this.getAttribute("placeholder"));
        }
        if (this.getAttribute("display") == "block") {
            let wrapper = this.shadowRoot.querySelector(".inputWrapper");
            wrapper.classList.add("block-wrapper");
            let label = this.shadowRoot.querySelector(".input-label");
            label.classList.add("block-label");
        }
        if (this.getAttribute("required") == "true") {
            this.setRequired(true);
        }
        if (this.getAttribute("width") != null) {
            this.getWrapper().style.width = "100%";
            this.getInput().style.width = "100%";
            this.shadowRoot.appendChild(style(":host { width: " + this.getAttribute("width") + "}"));
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
            return window.__$STAK.styles.input;
        } catch (error) {

        }
        return null;
    }

    isRequired() {
        let input = this.shadowRoot.querySelector("input")
        return input.required;
    }

    validate() {

        if (this.isRequired()) {
            if (this.getValue() == null || this.getValue() == undefined || this.getValue() == "") {
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
        return this.getValue() != null && this.getValue() != undefined && this.getValue() != "";
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
        return label.innerHTML;
    }


    getWrapper() {
        return this.shadowRoot.querySelector(".inputWrapper");
    }

    setPlaceholder(text) {
        this.getInput().setAttribute("placeholder", text)
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
            let text = label.innerHTML + " *";

            this.setLabel(text);
        }
    }

    getInput() {
        let input = this.shadowRoot.querySelector("input");
        return input;
    }

    getValue() {
        let input = this.shadowRoot.querySelector("input");
        return input.value;
    }

    setValue(val) {
        this.getInput().value = val;
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
window.customElements.define('st-input', Input);