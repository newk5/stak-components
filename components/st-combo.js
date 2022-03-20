const stylesheet = href => {
  const el = document.createElement("link");
  el.rel = "stylesheet";
  el.href = href;
  return el;
};
const style = (content) => {
  const el = document.createElement('style');

  el.innerHTML = content;
  return el;
};
const template = document.createElement("template");
template.innerHTML = `
  <style> 
        :host {
          display: inline-block;
          box-sizing: border-box;
        }
          select {
              background: #e4e4e5;
              border: none;
              outline: none;
              padding: 10px;
              border-radius: 3px;
              position: relative;
              top: 1px;
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
                font-weight: bold;
                position: relative;
                padding: 4px;
                top: 1px;
              
            }
            .inputWrapper{
                
                position: relative;
                top: -6px;                
                margin-right:10px;
            }
            .block-label {
              padding-bottom: 13px;
              padding-left: 1px;
              top:11px;
            }
            .block-wrapper {
              display:inline-grid;
              position: relative;
              top: -41px;
            }
            .primary-input:hover {
              background: #d9d9d9;
            }
            .primary-input:focus {
              background: #d9d9d9;
            }
            
        </style>
          <div class="inputWrapper"  >
          
                <label class="input-label"></label>   
                <select class="primary-input" id="combo" >
             
                </select>
             
            <div>
    
        </div>
`;

class Combo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

  }

  connectedCallback() {
    this.render();

    if (this.getAttribute("value") != null) {
      this.setValue(this.getAttribute("value"));
    }
    let input = this.getInput();


    let arr = Array.prototype.slice.call(this.children);
    arr.forEach(c => {
      input.add(c);
    })

  }

  event(ev, callback) {
    this.getInput().addEventListener(ev, callback);
  }

  render() {
    let input = this.getInput();

    if (this.getAttribute("data") != null) {
      let data = JSON.parse(this.getAttribute("data"));

      data.forEach(opt => {
        var option = document.createElement("option");
        option.text = opt.text;
        option.value = opt.value;
        input.add(option);
      })

      input.value = "";
    }

    if (this.getAttribute("disabled") == "true") {
      this.disable();
    }

    if (this.getAttribute("label") != null) {
      this.setLabel(this.getAttribute("label"));
    }
    if (
      this.getAttribute("readOnly") == "true" ||
      this.getAttribute("readonly") == "true"
    ) {
      this.setReadOnly(true);
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
      return window.__$STAK.styles.combo;
    } catch (error) {

    }
    return null;
  }


  isRequired() {
    let input = this.getHorasInput();
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

  setLabel(t) {
    let label = this.shadowRoot.querySelector(".input-label");
    label.innerText = t;
  }

  getWrapper() {
    return this.shadowRoot.querySelector(".inputWrapper");
  }

  setValue(val) {
    if (val == null) {
      this.getInput().value = "";
      return;
    }
    this.getInput().value = val;

  }

  setRequired(val) {
    let inputs = this.shadowRoot.querySelectorAll("select");
    inputs.required = val;

    let label = this.shadowRoot.querySelector(".input-label");
    let text = label.innerText + " *";

    this.setLabel(text);

  }

  getInput() {
    let input = this.shadowRoot.querySelector("select");
    return input;
  }



  getValue() {
    return this.getInput().value;

  }

  enable() {
    let input = this.getInput();

    input.disabled = false;

    this.getWrapper().classList.remove("disabled");
  }

  disable() {
    let input = this.getInput();

    input.disabled = true;

    this.getWrapper().classList.add("disabled");
  }


}
window.customElements.define("st-combo", Combo);
