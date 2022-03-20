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
            vertical-align:middle;
            margin-bottom: 14px;
            box-sizing: border-box;   
            font-family: inherit;
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
                top: -4px;
                position: relative;
                left: 2px;
               
                padding-right:8px;
               
            }
            .inputWrapper{
                display: inline-block;
                margin-top:10px;
                margin-right:10px;
                position: relative;
               
            }
          
           
            .block-label {
              padding-bottom: 13px;
              padding-left: 1px;
              top:9px;
            }
            .block-wrapper {
              display:inline-grid;
              position: relative;
              top: -41px;
            }
        </style>
          <div class="inputWrapper wrapper" >
            <label class="input-label"> </label>   
            <textarea   class="primary-input" type="textarea"></textarea>
         
        </div>
`;

class Textarea extends HTMLElement {
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
    if (this.getAttribute("rows") != null) {
      this.setRows(this.getAttribute("rows"));
    }
    if (this.getAttribute("cols") != null) {
      this.setCols(this.getAttribute("cols"));
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

  isRequired() {
    let input = this.getInput()
    return input.required;
  }

  getStyle() {
    try {
      return window.__$STAK.styles.textarea;
    } catch (error) {

    }
    return null;
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
    return label.textContent;
  }

  setRows(val) {
    this.getInput().setAttribute("rows", val)
  }

  getRows(val) {
    parseInt(this.getInput().getAttribute("rows"));
  }

  setCols(val) {
    this.getInput().setAttribute("cols", val)
  }

  getCols(val) {
    parseInt(this.getInput().getAttribute("cols"));
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
    label.innerHTML = text;
  }

  event(ev, callback) {
    this.shadowRoot.querySelector("textarea").addEventListener(ev, callback);
  }

  setRequired(val) {
    let input = this.shadowRoot.querySelector("textarea");
    input.required = val;
    if (val) {

      let label = this.shadowRoot.querySelector(".input-label");
      let text = label.innerHTML + " *";

      this.setLabel(text);
    }
  }

  getInput() {
    let input = this.shadowRoot.querySelector("textarea");
    return input;
  }

  getValue() {
    let input = this.shadowRoot.querySelector("textarea");
    return input.value;
  }
  setValue(val) {
    this.getInput().value = val;
  }

  enable() {
    let input = this.shadowRoot.querySelector("textarea");
    input.disabled = false;
    input.classList.remove("disabled");

  }

  disable() {
    let input = this.shadowRoot.querySelector("textarea");
    input.disabled = true;
    input.classList.add("disabled");

  }




}
window.customElements.define('st-textarea', Textarea);