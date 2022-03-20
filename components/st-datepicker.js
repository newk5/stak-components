//adapted from https://github.com/TylerPottsDev/custom-date-picker with some additional features and fixes

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

let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


let yearDiff = 10;
const template = document.createElement("template");
template.innerHTML = `
   <style>
            :host{
               
                display:inline-block;
                box-sizing: border-box;            
            }
            .disabled{
                opacity: 0.7;
                cursor: not-allowed !important;
            }

            
            .date-picker {
                position: relative;
              
                height: 33px;
                cursor: pointer;
                user-select: none;
                display: inline-block;
            }
           
            .day:hover{
                background-color: #61a2c7;
                border-radius: 25px;
            } 
            
            .selected-date {
                align-items: center;
                background: #e1e1e1;
                padding: 8px;
                border-radius: 4px;
                border-color: transparent; 
               width:90px;
               position: relative;
                top: -6px;
                outline:none;
                
            }

            .dates {
                
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                z-index: 1;
                background-color: #caddf5;
                border-radius: 5px;
                border-color: transparent;
                width: 289px;
                border-radius: 10px;
            }
         
            .dates.active {
                display: block;
            }

            .month {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #EEE;
                background: #374d68;
                color: white;
                font-weight: bold;
                border-radius: 7px;
                border: transparent;
            }
            .validationFailed{
            color:#d52d2d !important;
            }

            .arrows {
                width: 55px;
                height: 55px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #ffffff;
               
            }

             .arrows:hover {
                background-color: #61a2c7;
                border-radius:5px;
               
            }

           .arrows:active {
                background-color: #61a2c7; 
            }

            .days {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                height: 200px;
            }
            .day { 
                border-radius: 25px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #0c0c0c;
                height: 34px;
                font-size:0.8rem;
            }
            .day.selected {
                background-color: #61a2c7;
            }
           
            .input-label{
               
                font-weight: bold;
                position: relative;
              
                top: -3px;
                padding-right: 8px;
            }
            .mth{
                position: relative;
                left: 16px;
            }
             .inputWrapper{
                position:relative;
                 
            }
           
           select option {
               color: black;
            }
            select:not(:checked) {
               color: white;
               cursor:pointer;
            }
           
            select {
                padding:8px;
                border:none;
                
            background:transparent;
                font-weight:bold;
               
            }
          
          
            .emptySelectedDate{ 
                 min-height: 19px;
                min-width: 95px;
            }

            .block-label {
                display: block;
                padding-bottom: 13px;
                padding-left: 1px;
                top:3px;
              }
              .block-wrapper {
                display:inline-grid;
                position: relative;
                top: -35px;
              }
              .selected-date:hover {
                background:  #d9d9d9 ;
              }
              .selected-date:focus {
                background: #d9d9d9;
              }
        </style>
       
           <div tabindex="0"  class="date-picker">
           <div class="inputWrapper">
            <label class="input-label"> </label>  
            <input readonly="true" class="selected-date"></input>
            </div>
            
            <div class="dates">
                <div  class="month">
                    <div  class="arrows prev-mth"> &lt; </div>
                    <div  class="mth"></div>
                    <div  class="year">
                       <select id="yearsCombo" >
  
  </select>
                    </div>
                    <div  class="arrows next-mth">&gt;</div>
                </div>
                <div class="days"></div>
            </div>
           
        </div>
        
`;

class Datepicker extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
       
      
    }

    connectedCallback() {

        if (this.getAttribute("disabled") == "true") {
            this.disable();
        }

        if (this.getAttribute("yearInterval") != null) {
           yearDiff = parseInt(this.getAttribute("yearInterval"));
        }

        if (this.getGlobalMonths() != null){
            months = this.getGlobalMonths();
        }

        if (this.getAttribute("months") != null) {
            months = this.getAttribute("months").split(",");
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
            let input = this.shadowRoot.querySelector(".selected-date");
            input.style.width = this.getAttribute("width");
            this.getWrapper().style.width = this.getAttribute("width");
        }
        if (this.getAttribute("customStyle") != null) {
            this.shadowRoot.appendChild(stylesheet(this.getAttribute("customStyle")));
        }

        let currentDate = new Date();
        let day = currentDate.getDate();
        let month = currentDate.getMonth();
        let year = currentDate.getFullYear();

        let selectedDay = day;
        let selectedMonth = month;
        let selectedYear = year;

        const datePickerElement = this.shadowRoot.querySelector(".date-picker");
        const selectedDateElement = this.shadowRoot.querySelector(".selected-date");
        const datesElement = this.shadowRoot.querySelector(".dates");
        const monthElement = this.shadowRoot.querySelector(".mth");
        const nextMonthElement = this.shadowRoot.querySelector(".next-mth");
        const prevMonthElement = this.shadowRoot.querySelector(".prev-mth");
        const yearElement = this.shadowRoot.querySelector(".year");
        const daysElement = this.shadowRoot.querySelector(".days");

        var self = this;

        datePickerElement.addEventListener("focusout", e => {
            const leavingParent = !datePickerElement.contains(e.relatedTarget);

            if (leavingParent) {
                datesElement.classList.remove("active");
            }

        }, true);
        const formatDate = d => {
            let day = d.getDate();
            if (day < 10) {
                day = "0" + day;
            }

            let month = d.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }

            let year = d.getFullYear();

            return day + " / " + month + " / " + year;
        };
        let years = [];
        let currentYear = new Date().getFullYear();

        for (var i = currentYear; i <= currentYear + yearDiff; i++) {
            years.push(i);
        }
        for (var i = currentYear; i >= currentYear - yearDiff; i--) {
            if (i != currentYear)
                years.push(i);
        }


        years.sort();
        years.reverse();
        let yearsCombo = this.getYearsCombo();
        years.forEach(year => {
            var option = document.createElement("option");
            option.text = year + "";
            yearsCombo.add(option);
        })
        yearsCombo.value = currentYear + "";


        yearsCombo.addEventListener("change", function (e) {

        })

        const populateDates = e => {
            daysElement.innerHTML = "";
            let amount_days = 31;

            if (month == 1) {
                amount_days = 28;
            } else if (month == 3 || month == 6 || month == 8 || month == 10) {
                amount_days = 30;
            }

            for (let i = 0; i < amount_days; i++) {
                const day_element = document.createElement("div");
                day_element.classList.add("day");
                day_element.textContent = i + 1;

                if (
                    selectedDay == i + 1 &&
                    selectedYear == year &&
                    selectedMonth == month
                ) {
                    day_element.classList.add("selected");
                }

                day_element.addEventListener("mousedown", function () {
                    let comboYear = self.getYearsCombo().value;
                    let newDate = new Date(comboYear + "-" + (month + 1) + "-" + (i + 1));
                    selectedDay = i + 1;
                    selectedMonth = month;
                    selectedYear = comboYear;


                    selectedDateElement.value = formatDate(newDate);
                    selectedDateElement.dataset.value = newDate;
                    datesElement.classList.toggle("active");
                    populateDates();
                    self.setValue(newDate);


                });

                daysElement.appendChild(day_element);
            }
        };

        const checkEventPathForClass = (path, selector) => {
            for (let i = 0; i < path.length; i++) {
                if (path[i].classList && path[i].classList.contains(selector)) {
                    return true;
                }
            }

            return false;
        };




        monthElement.textContent = months[month];


        populateDates();

        // when the input is clicked
        datePickerElement.addEventListener("click", e => {
            if (!this.disabled) {
                let path = e.path || (e.composedPath && e.composedPath());
                if (path[0].id != "yearsCombo") {
                    if (!checkEventPathForClass(path, "dates")) {
                        datesElement.classList.toggle("active");
                        let element = this.isOutOfViewport(datesElement);
                        if (element.right.offScreen) {
                            datesElement.style.left = element.right.amount + "px";
                        } else {
                            datesElement.style.left = "0px";
                        }

                    }
                }

            }
        });
        //when the next month button is clicked
        nextMonthElement.addEventListener("click", e => {
            month++;
            if (month > 11) {
                month = 0;
                year++;

            }
            this.onMonthChange(year);
            monthElement.textContent = months[month];
            populateDates();
        });
        //when the previous month button is clicked
        prevMonthElement.addEventListener("click", e => {
            month--;
            if (month < 0) {
                month = 11;
                year--;
            }
            this.onMonthChange(year);
            monthElement.textContent = months[month];
            populateDates();
        });

        if (this.getAttribute("epoch") != null) {
            this.setValueAsEpoch(parseInt(this.getAttribute("epoch")))
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

    getGlobalMonths(){
        try {
            return window.__$STAK.attributes.datepicker.months;
        } catch (error) {

        }
        return null;
    }

    getStyle() {
        try {
            return window.__$STAK.styles.datepicker;
        } catch (error) {

        }
        return null;
    }


    isRequired() {
        let input = this.shadowRoot.querySelector(".selected-date")
        return input.required;
    }

    validate() {

        if (this.isRequired()) {
            if (this.getValue() == null || this.getValue() == undefined || this.getValue() == "") {
                this.applyFailedValidationState();
            }
        }
    }

    /*!
    from https://gomakethings.com/how-to-check-if-any-part-of-an-element-is-out-of-the-viewport-with-vanilla-js/
    with some changes
 * Check if an element is out of the viewport
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}  elem The element to check
 * @return {Object}     A set of booleans for each side of the element
 */
    isOutOfViewport(elem) {

        // Get element's bounding
        let bounding = elem.getBoundingClientRect();

        let out = {
            bottom: { amount: 0, offScreen: false },
            right: { amount: 0, offScreen: false }
        };

        out.bottom.amount = window.innerHeight - bounding.bottom;
        out.bottom.offScreen = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);

        out.right.amount = window.innerWidth - bounding.right;
        out.right.offScreen = bounding.right > (window.innerWidth || document.documentElement.clientWidth);


        return out;

    };

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

    onMonthChange(year) {
        this.getYearsCombo().value = year + "";
    }
    setReadOnly(val) {
        this.getInput().readOnly = val;
    }
    setLabel(text) {
        let label = this.shadowRoot.querySelector(".input-label");
        label.innerHTML = text;
    }

    getWrapper() {
        return this.shadowRoot.querySelector(".inputWrapper");
    }

    getValue() {
        return this.selectedDate;
    }

    setValue(val) {
        this.selectedDate = val;
        this.shadowRoot.querySelector(".selected-date").dataset.value = val;
        if (val != null) {
            this.shadowRoot.querySelector(".selected-date").classList.remove("emptySelectedDate");
            this.shadowRoot.querySelector(".inputWrapper").classList.remove("emptyWrapper");
            this.shadowRoot.querySelector(".selected-date").innerText = val.toLocaleDateString().replaceAll("/", " / ");
        } else {
            this.shadowRoot.querySelector(".selected-date").innerText = "";
            this.shadowRoot.querySelector(".selected-date").classList.add("emptySelectedDate");
            this.shadowRoot.querySelector(".inputWrapper").classList.add("emptyWrapper");
        }

    }

    setValueAsEpoch(val) {
        this.setValue(new Date(val));

    }

    getEpoch() {
        if (this.selectedDate == null)
            return null;
        return this.selectedDate.getTime();
    }

    setRequired(val) {
        let input = this.shadowRoot.querySelector(".selected-date");
        input.required = val;
        if (val) {

            let label = this.shadowRoot.querySelector(".input-label");
            let text = label.innerHTML + " *";

            this.setLabel(text);
        }
    }

    getYearsCombo() {
        return this.shadowRoot.querySelector("#yearsCombo");
    }

    getInput() {
        let input = this.shadowRoot.querySelector(".selected-date");
        return input;
    }

    enable() {
        let input = this.shadowRoot.querySelector(".selected-date");
        input.disabled = false;
        input.classList.remove("disabled");

    }

    disable() {
        let input = this.shadowRoot.querySelector(".selected-date");
        input.disabled = true;
        input.classList.add("disabled");

    }

}
window.customElements.define("st-datepicker", Datepicker);
