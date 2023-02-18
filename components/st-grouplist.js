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

let backgroundColor = "white";
let inputBorderHoverColor = "#299ecc";
let groupBackgroundHoverColor = "#84daff77";
let optionBackgroundHoverColor = groupBackgroundHoverColor; //same for now


template.innerHTML = `
    <style> 
    :host {
        position:absolute;
        display: none;
    }
    .box {
        max-height: 500px;
        width: 250px;
        border: solid black 2px;
        border-radius: 4px;
        overflow-y: auto;
        overflow-x: clip;
        background-color:${backgroundColor};
    }

    .seachInputWrapper {
        padding: 3px;
        width: inherit;
        display: flex;
        max-width: 250px;
        outline: 0;
        border: solid 1px;
        border-color: black;
        border-radius: 19px;
        border-width: 2px;
        margin: 5px;
    }

    .seachInputWrapper:hover {
        border-color: ${inputBorderHoverColor};
    }

    .searchInput {
        border: solid 0px;
        border-radius: 10px;
        margin-left: 5px;
        outline: 0;
        width: 100%;
    }

    label {
        font-family: Arial;
        font-size: 14px;
    }

    .titleLabel {
        padding: 5px;

        margin: 5px;
    }

    .groupParent {
        display: flex;
        flex-wrap: wrap;
        padding-top: 5px;
        width: inherit;
        cursor: pointer;
    }

    .groupParent:hover {
        background-color: ${groupBackgroundHoverColor};
    }

    .groupOptions {
        display: none;
        flex-basis: 100%;
    }

    .groupOption {
        cursor: pointer;
        padding: 3px;
    }

    .groupOption:hover {
        background-color: ${optionBackgroundHoverColor};
    }

    .groupOptionLabel {
        margin-left: 15px;
    }

    .groupLabel {
        font-weight: bold;
    }

    .groupListWrapper {
        padding: 2px;
    }

    /* icons*/

    /* search icon*/
    .svg-icon.search-icon {
        width: 22px;
        height: 22px;
        stroke: #111516;
        stroke-width: 2px;
        position: relative;
        top: 1px;

    }

    .svg-icon.search-icon:focus .search-path,
    .svg-icon.search-icon:hover .search-path {
        stroke: #299ecc;
    }

    /* triangles*/
    .triangle-right {
        margin: 5px;
        transform: rotate(90deg);

    }

    .triangle-down {
        margin: 5px;
        transform: rotate(180deg);
        position: relative;
        top: -2px;
        display: none;
    }
    </style>

    <div class="box" tabindex="0">
        <div class="titleLabel"><label>Select</label></div>
        <hr />
            <div class="boxInnerWrapper">

                <div class="seachInputWrapper">
                    <svg class="svg-icon search-icon" aria-labelledby="title desc" role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.9 19.7">
                        <g class="search-path" fill="none" stroke="#848F91">
                            <path stroke-linecap="square" d="M18.5 18.3l-5.4-5.4" />
                            <circle cx="8" cy="8" r="7" />
                        </g>
                    </svg>
                    <input type="text" placeholder="Search ..." onkeyup="this.getRootNode().host.onFilter(this)" name="searchInput"
                        class="searchInput"></input>
                </div>

                <div class="groupListWrapper">
                    <hr />

                </div>
            </div>
    </div>

`;

class GroupList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

    }

    connectedCallback() {

        let groups = {};
        let groupTitles = {};
        let arr = Array.prototype.slice.call(this.children);
        arr.forEach(c => {
            let group = c.getAttribute("group");
            let option = {
                label: c.text,
                value: c.value,
                title: c.getAttribute("optionTitle")
            }
            if (!groups.hasOwnProperty(group)) {
                groups[group] = [];
                groupTitles[group] = c.getAttribute("groupTitle");
            }
            groups[group].push(option);


        })
        for (const [group, optionsArr] of Object.entries(groups)) {
            this.addOptionGroup({ name: group, groupTitle: groupTitles[group], options: optionsArr });
        }

        if (this.getAttribute("label") != null) {
            this.setTitleLabel(this.getAttribute("label"));
        }


        if (this.getAttribute("placeholder") != null) {
            this.getSearchInput().placeholder = (this.getAttribute("placeholder"));
        }



        let self = this;
        //right click event listener
        let el = window.document.querySelector(this.getAttribute("for"));
        if (el != null && el != undefined) {
            el.addEventListener('contextmenu', (event) => {
                let x = event.clientY;
                let y = event.clientX;
                self.open(x, y);
                event.preventDefault();
                return false;
            })
        }

        //unfocus
        this.addEventListener('focusout', (event) => {
            self.hide();
            event.preventDefault();
            return false;
        }, false)


        //user specific css

        if (this.getGlobalStyle() != null) { //from the global variable
            this.shadowRoot.appendChild(style(this.getGlobalStyle()));
        }

        if (this.getAttribute("customStyle") != null) { //link to a css file
            this.shadowRoot.appendChild(stylesheet(this.getAttribute("customStyle")));
        }
        if (this.getAttribute("extraStyles") != null) { //creates a new <style> </style> with this string inside
            this.shadowRoot.appendChild(style(this.getAttribute("extraStyles")));
        }

    }

    setTitleLabel(text) {
        let titleDiv = this.shadowRoot.querySelector(".titleLabel label");
        titleDiv.innerText = text;
    }

    getSearchInput() {
        let inp = this.shadowRoot.querySelector(".searchInput");
        return inp;
    }

    open(x, y) {
        let box = this.shadowRoot.querySelector(".box");

        this.style.display = "block";
        this.style.top = x + "px";
        this.style.left = y + "px";
        box.focus();
    }

    hide() {
        this.style.display = "none";
        this.minimizeAllGroups();
        this.getSearchInput().value = "";
    }

    addOptionGroup(group) {
        let groupName = group.name;
        let groupTitle = (group.groupTitle == null || group.groupTitle == undefined) ? "" : group.groupTitle;
        let optionsAsHtml = [];

        group.options.forEach(opt => {
            optionsAsHtml.push(this.buildOptionHTML(group, opt));
        });

        let html = `

        <div class="group">
                <div class="groupParent" onclick="this.getRootNode().host.toggleOptionGroup(this)" data-opened="false">
                    <svg class="triangle-right" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" width="14px" height="14px" viewBox="0 0 100 100">
                        <polygon points="45 15, 80 80, 0 80" />
                    </svg>
                    <svg class="triangle-down" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" width="14px" height="14px" viewBox="0 0 100 100">
                        <polygon points="40 15, 80 80, 0 80" />
                    </svg>
                    <div class="groupName" title="${groupTitle}">
                        <label class="groupLabel">${groupName}</label>
                    </div>
                </div>

                <div class="groupOptions">
                    ${optionsAsHtml.join("\n")}
                </div>


        </div>

        `;
        let groupsList = this.shadowRoot.querySelector(".groupListWrapper");
        groupsList.insertAdjacentHTML("beforeend", html)

    }
    buildOptionHTML(group, opt) {
        let optionValue = opt.value;
        let optionLabel = opt.label;
        let optionTitle = (opt.title == null || opt.title == undefined) ? "" : opt.title;

        let html = `
                <div class="groupOption" title="${optionTitle}" data-value="${optionValue}" data-group="${group.name}" data-label="${optionLabel}" onclick="this.getRootNode().host.selectOption(this)">
                    <label class="groupOptionLabel" style=" cursor: pointer;">${optionLabel}</label>
                </div>
                  
        `;
        return html;
    }

    //toggles the visibility of a specific group
    toggleOptionGroup(group) {

        let triangleRight = group.children[0];
        let triangleDown = group.children[1];
        let groupOption = group.nextElementSibling;

        if (group.dataset.opened == "false") {
            group.dataset.opened = "true";
            triangleRight.style.display = "none";
            triangleDown.style.display = "block";
            groupOption.style.display = "block";
        } else {
            triangleRight.style.display = "block";
            triangleDown.style.display = "none";
            groupOption.style.display = "none";
            group.dataset.opened = "false";
        }

    }
    selectOption(opt) {
        this.hide();
        if (this.onSelectEvent != null) {
            this.onSelectEvent({ name: opt.dataset.group, value: opt.dataset.value, label: opt.dataset.label });
        }

    }
    onSelect(event) {
        this.onSelectEvent = event;
    }

    minimizeAllGroups() {
        let groups = this.shadowRoot.querySelectorAll('.group');
        let self = this;
        [].forEach.call(groups, function (group) {
            let groupParent = group.children[0];
            let alreadyOpened = groupParent.dataset.opened == "true";

            group.style.display = "block";
            if (alreadyOpened) {
                self.toggleOptionGroup(groupParent);
            }
              //for each option
             let optionsDiv = group.children[1];
             let options = optionsDiv.children;
             for (let i = 0; i < options.length; i++) {
                 const option = options[i];
                 option.style.display = "block";
             }

        });
    }

    getGlobalStyle() {
        try {
            return window.__$STAK.styles.grouplist;
        } catch (error) {

        }
        return null;
    }


    onFilter(input) {
        let expr = input.value;
        let showAll = expr == "";


        let groups = this.shadowRoot.querySelectorAll('.group');
        let self = this;
        //for each group
        [].forEach.call(groups, function (group) {
            let groupParent = group.children[0];
            let alreadyOpened = groupParent.dataset.opened == "true";
            if (showAll) {
                group.style.display = "block";
                if (alreadyOpened) {
                    self.toggleOptionGroup(groupParent);        
                }
                  //for each option
                    let optionsDiv = group.children[1];
                    let options = optionsDiv.children;
                    for (let i = 0; i < options.length; i++) {
                        const option = options[i];
                        option.style.display = "block";
                    }


            } else {
                let optionsDiv = group.children[1];
                let options = optionsDiv.children;
                let found = false;

                //for each option
                for (let i = 0; i < options.length; i++) {
                    const option = options[i];
                    let label = option.dataset.label.toLowerCase();
                    if (label.includes(expr)) {
                        found = true;
                        option.style.display = "block";
                    } else {
                        option.style.display = "none";
                    }

                }

                if (!found) {
                    group.style.display = "none";
                } else {

                    if (!alreadyOpened) {
                        self.toggleOptionGroup(groupParent);
                    }

                    group.style.display = "block";

                }
            }

        });
    }
}

window.customElements.define("st-grouplist", GroupList);
