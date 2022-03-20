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
const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
let minutesText = "Minutes";
let hoursText = "Hours";
template.innerHTML = `
  <style> 
  :host {
    display:inline-block;
    box-sizing: border-box;
}
    
          select {
            background: #e4e4e5;
            border: none;
            outline: none;
            padding: 9px;
            border-radius: 3px;
            position: relative;
            top: -10px;
            box-sizing: border-box;
            
          }

          select:hover{
            background: #d9d9d9;
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
              padding-right:12px;
              top: 1px;
               
            }
            .inputWrapper{
               
                position: relative;
                top: -5px;
                margin-top:10px;
                margin-right:10px;
            }
            .innerWrapper {
              min-width: 60px;
               display:flex;
            }

            .block-label {
              padding-bottom: 13px;
              padding-left: 1px;
             
            }
            .block-wrapper {
              display:inline-grid;
              position: relative;
              top:-25px;
            }
            
        </style>
          <div class="inputWrapper" >
            <div style="display:flex">
              <div class="innerWrapper">
                <label id="labelHours" class="input-label">${hoursText} </label>   
                <select id="hours" ></select>
              </div>
              <div class="innerWrapper" style="margin-left:10px;">
                <label id="labelMinutes" class="input-label">${minutesText}</label>   
                <select id="minutes" ></select>
              </div>
            <div>
    
        </div>
`;

class TimePicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));



  }

  connectedCallback() {
    this.render();

    if (this.getAttribute("value") != null) {
      this.setValue(this.getAttribute("value"));
    }
  }

  render() {
    if (this.getAttribute("disabled") == "true") {
      this.disable();
    }



    if (this.getAttribute("readOnly") == "true" || this.getAttribute("readonly") == "true") {
      this.setReadOnly(true);
    }

    if (this.getAttribute("display") == "block") {
      let wrappers = this.shadowRoot.querySelectorAll(".innerWrapper");


      Object.values(wrappers).forEach(wrapper => {
        wrapper.classList.add("block-wrapper");
      })

      let labels = this.shadowRoot.querySelectorAll(".input-label");
      Object.values(labels).forEach(label => {
        label.classList.add("block-label");
      })

    }
    if (this.getAttribute("required") == "true") {
      this.setRequired(true);
    }
    if (this.getAttribute("width") != null) {
      this.getWrapper().style.width = this.getAttribute("width");
    }

    if (this.getAttribute("minutesLabel") != null) {
      let label = this.shadowRoot.querySelector("#labelMinutes");
      minutesText = this.getAttribute("minutesLabel");
      label.textContent = minutesText;
    }
    if (this.getAttribute("hoursLabel") != null) {
      let label = this.shadowRoot.querySelector("#labelHours");
      hoursText = this.getAttribute("labelHours");
      label.textContent = hoursText;
    }
    if (minutesText == "" || hoursText == "") {
      this.shadowRoot.appendChild(style(".inputWrapper { top: 16px }"));
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


    let today = new Date();
    let comboHours = this.getHoursInput();
    for (let i = 0; i <= 23; i++) {
      let option = document.createElement("option");
      option.text = (i <= 9 ? "0" + i : i);
      comboHours.add(option);
    }
    let comboMinutes = this.getMinutesInput();
    for (let i = 0; i <= 59; i++) {
      let option = document.createElement("option");
      option.text = (i <= 9 ? "0" + i : i);
      comboMinutes.add(option);
    }
    comboHours.value = "";
    comboMinutes.value = "";

  }

  isRequired() {
    let input = this.getHoursInput()
    return input.required;
  }

  getStyle() {
    try {
      return window.__$STAK.styles.timepicker;
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
    let labels = this.shadowRoot.querySelectorAll(".input-label");
    Object.values(labels).forEach(label => {
      label.classList.remove("validationFailed");
    })

  }

  applyFailedValidationState() {
    let labels = this.shadowRoot.querySelectorAll(".input-label");
    Object.values(labels).forEach(label => {
      label.classList.add("validationFailed");
    })

  }

  getLabelText() {
    return hoursText + " & " + minutesText;
  }

  getWrapper() {
    return this.shadowRoot.querySelector(".inputWrapper");
  }

  setValue(val) {
    if (val == null) {
      this.getHoursInput().value = "";
      this.getMinutesInput().value = "";
      return;
    }
    try {
      let h = parseInt(val.split(":")[0]);
      let m = parseInt(val.split(":")[1]);

      this.getHoursInput().value = (h <= 9 ? "0" + h : h);
      this.getMinutesInput().value = (m <= 9 ? "0" + m : m);
    } catch (e) {

    }

  }

  setRequired(val) {

    let inputs = this.shadowRoot.querySelectorAll("select");

    Object.values(inputs).forEach(input => {
      input.required = val;
    })

    if (val) {
      let label = this.shadowRoot.querySelector("#labelMinutes");
      label.textContent = minutesText + " *";

      let labelHours = this.shadowRoot.querySelector("#labelHours");
      labelHours.textContent = hoursText + " *";

    }
  }

  getHoursInput() {
    let input = this.shadowRoot.querySelector("#hours");
    return input;
  }

  getMinutesInput() {
    let input = this.shadowRoot.querySelector("#minutes");
    return input;
  }

  getValue() {
    try {
      let input = this.shadowRoot.querySelector("#hours");
      let input2 = this.shadowRoot.querySelector("#minutes");

      if (input.value == null || input2.value == null || input.value == "" || input2.value == "") {
        return null;
      }

      let v1 = parseInt(input.value);
      let v2 = parseInt(input2.value);



      v1 = (v1 < 10 ? "0" + v1 : v1);
      v2 = (v2 < 10 ? "0" + v2 : v2);
      return (v1 + ":" + v2);
    } catch (e) {

    }
    return null;

  }

  enable() {
    let input = this.shadowRoot.querySelector("#hours");
    let input2 = this.shadowRoot.querySelector("#minutes");
    input.disabled = false;
    input2.disabled = false;
    this.getWrapper().classList.remove("disabled");

  }

  disable() {
    let input = this.shadowRoot.querySelector("#hours");
    let input2 = this.shadowRoot.querySelector("#minutes");
    input.disabled = true;
    input2.disabled = true;
    this.getWrapper().classList.add("disabled");

  }



}
window.customElements.define('st-timepicker', TimePicker);