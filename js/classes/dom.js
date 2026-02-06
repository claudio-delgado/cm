class DOMElement{
    //General DOM node update and manipulation
    static exists = (element_selector) => {
        return document.querySelector(element_selector) !== undefined
    }
    static hide = (element_selectors_array) => {
        element_selectors_array.forEach(elem_selector => document.querySelectorAll(elem_selector).forEach(elem => elem.classList.add("hidden")))
    }
    static show = (element_selectors_array) => {
        element_selectors_array.forEach(elem_selector => document.querySelectorAll(elem_selector).forEach(elem => elem.classList.remove("hidden")))
    }
    static are_hidden = (element_selectors_array) => {
        let are_hidden = true
        element_selectors_array.forEach(elem_selector => {
            document.querySelectorAll(elem_selector).forEach(elem => are_hidden &&= elem.classList.contains("hidden"))
        })
        return are_hidden
    }
    static is_hidden = (element_selector) => {
        let is_hidden = true
        document.querySelectorAll(element_selector).forEach(elem => is_hidden &&= elem.classList.contains("hidden"))
        return is_hidden
    }
    static set_text = (element_selector, text) => {
        document.querySelectorAll(element_selector).forEach(elem => elem.innerText = text)
    }
    static set_attributes = (element_selector, attributes_array) => {
        document.querySelectorAll(element_selector).forEach(elem => {
            attributes_array.forEach(value => {
                elem.setAttribute(Object.keys(value)[0], Object.values(value)[0])
            })
        })
    }
    static has_classes = (element_selector, classes_array) => {
        let result = true
        document.querySelectorAll(element_selector).forEach(elem => {
            classes_array.forEach(class_name => {
                result &&= elem.classList.contains(class_name)
            })
        })
        return result
    }
    static add_classes = (element_selector, classes_array) => {
        document.querySelectorAll(element_selector).forEach(elem => {
            classes_array.forEach(class_name => {
                elem.classList.add(class_name)
            })
        })
    }
    static remove_classes = (element_selector, classes_array) => {
        document.querySelectorAll(element_selector).forEach(elem => {
            classes_array.forEach(class_name => {
                elem.classList.remove(class_name)
            })
        })
    }
    /**
     * dom_data = {"tagName" (mandatory), "id" (optional), "classes" (optional), "parentElement" (optional), "attributes" (optional), "autoCreation": [true|false] (default: auto), "text" (optional)}
     * classes = string with space separated class names
     * attributes = [{"key": "attribute_name", "value": "attribute_value"}, ...]
    */
    constructor(dom_data){
        this.id = (dom_data.id ? dom_data.id : "")
        this.tagName = dom_data.tagName
        this.classes = (dom_data.classes ? dom_data.classes : "")
        this.parentElement = (dom_data.parentElement ? dom_data.parentElement : null)
        this.attributes = (dom_data.attributes ? dom_data.attributes : [])
        this.innerText = (dom_data.text ? dom_data.text : "")
        this.innerHTML = (dom_data.html ? dom_data.html : "")
        this.textGender = (dom_data.gender ? dom_data.gender : "")
        if(dom_data.autoCreation === null || dom_data.autoCreation === undefined || dom_data.autoCreation === true){
            this.draw(this.first_child ? true : false)
        }
    }
    draw(firstChild = false){
        this.element = document.createElement(this.tagName)
        this.element.id = this.id
        this.attributes.forEach((value) => {
            this.element.setAttribute(value.key, value.value)
        })
        this.element.classList = this.classes
        //Set div as parent last child.
        if(this.parentElement){
            if(firstChild){
                this.parentElement.insertBefore(this.element, this.parentElement.firstChild)
            } else {
                this.parentElement.appendChild(this.element)
            }
            if(this.innerText) this.appendText(this.innerText)
            if(this.innerHTML) this.appendHTML(this.innerHTML)
        }
    }
    appendText(text){
        this.element.innerText = (typeof text === "string") ? text : ""
    }
    appendContent(content){
        if(typeof content === "string"){
            this.element.innerText = content
        } else {
            this.element.appendChild(content)
        }
    }
    appendHTML(html){
        this.element.innerHTML+= html
    }
    getNode(){
        return this.element
    }
}

class Accordion extends DOMElement{
    static button_svg = "<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>"
    constructor(accordion_data){
        accordion_data.autoCreation = false
        accordion_data.tagName = "div"
        super(accordion_data)
        this.accordion_header = accordion_data.accordion_header
        this.accordion_body = accordion_data.accordion_body
        this.attributes = accordion_data.attributes ? accordion_data.attributes : []
        this.collapsed = true
        this.draw()
    }
    draw = (firstChild = false) => {
        if(this.parentElement){
            //Accordion container.
            let div = new DOMElement({
                tagName: this.tagName,
                classes: "w-100 border border-gray-800 bg-gray-600",
                parentElement: this.parentElement,
                attributes: this.attributes,
                id: `accordion-${this.id}-div`
            })
            this.element = div.getNode()
            //If it has to be the first child, move from current child position to first parent's child.
            if(firstChild){
                this.parentElement.getElementById(div.id).remove()
                this.parentElement.insertBefore(this.element, this.parentElement.firstChild)
            }
            
            //Accordion header.
            let h2 = new DOMElement({
                tagName: "h2",
                classes: "unread-notification",
                parentElement: div.getNode(),
                id: `accordion-${this.id}-header`,
            })
            let b = new DOMElement({
                tagName: "button",
                classes: "unattached-click font-medium flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 gap-3",
                parentElement: h2.getNode(),
                attributes: [
                    {key: "type", value: "button"}, {key: "data-accordion-target", value: `#accordion-${this.id}-body`},
                    {key: "aria-expanded", value: "false"}, {key: "aria-controls", value: `accordion-${this.id}-body`}
                ], 
                id: `accordion-${this.id}-header-button`,
            })
            this.button = b.getNode() 
            var s = new DOMElement({
                tagName: "span",
                parentElement: b.getNode(),
                id: `accordion-${this.id}-header-button-group`,
            })
            var s1 = new DOMElement({
                tagName: "span",
                classes: "new text-xs px-1.5 py-0.5 hidden rounded-sm bg-blue-900 text-blue-300 me-3",
                parentElement: s.getNode(),
                attributes: [{key: "gender", value: this.textGender.charAt(0).toLowerCase()}, {key: "data-i18n", value: ""}],
                text: "NEW"
            })
            b.appendHTML(Accordion.button_svg)
            this.accordion_header(s.getNode().id)
            
            //Accordion body.
            let d_body = new DOMElement({
                tagName: "div",
                id: `accordion-${this.id}-body`,
                classes: "hidden p-1",
                parentElement: div.getNode(),
                attributes: [{"key":"aria-labelledby","value":`accordion-${this.id}-header`}]
            })
            this.accordion_body(d_body.getNode().id)
            this.enable_behavior()
        }
    }
    expand = () => {
        //Trying to expand accordion item
        if (this.collapsed) {
            const accordion_item_body = this.element.querySelector("div")
            let parent_elem = accordion_item_body.closest("[data-accordion]")
            parent_elem.querySelectorAll("[aria-labelledby]").forEach((elem) => {
                if(elem != accordion_item_body){
                    elem.classList.add("hidden")
                }
            })
            parent_elem.querySelectorAll("svg").forEach((elem) => {
                if(elem != this.button.querySelector("svg") && !elem.classList.contains("rotate-180")){
                    elem.classList.add("rotate-180")
                }
            })
            accordion_item_body.classList.remove('hidden');
            this.button.setAttribute('aria-expanded', 'true');
            this.button.children[1].classList.remove("rotate-180")
            this.button.classList.remove("text-gray-500", "text-gray-400")
            this.button.classList.add("bg-gray-800", "text-gray-900", "text-white")
            this.collapsed = false
        }
    }
    collapse = () => {
        //Trying to collapse accordion item
        if (!this.collapsed) {
            const accordion_item_body = this.element.querySelector("div")
            accordion_item_body.classList.add('hidden');
            this.button.setAttribute('aria-expanded', 'false');
            this.button.children[1].classList.add("rotate-180")
            this.button.classList.remove("bg-gray-800", "text-gray-900", "text-white")
            this.button.classList.add("text-gray-500", "text-gray-400")
            this.collapsed = true
        }
    }
    enable_behavior() {
        const attach_click = (e) => {
            if(e.target.classList.contains("new")){
                return
            }
            //Trying to expand accordion item
            const accordion_item_body = document.querySelector(this.button.getAttribute('data-accordion-target'))
            if (accordion_item_body.classList.contains('hidden')) {
                this.expand()
            } else {
                this.collapse()
            }
        }
        if(this.button.classList.contains("unattached-click")){
            this.button.addEventListener("click", attach_click)
            this.button.classList.remove("unattached-click")
        }
    }
}

class GenerativeAccordion extends Accordion{
    constructor(accordion_data){
        super(accordion_data)
        this.title = accordion_data.title_id ? document.getElementById(accordion_data.title_id) : null
        this.callback = accordion_data.callback ? accordion_data.callback : () => {}
        this.parms = accordion_data.parms ? accordion_data.parms : null
        //Structure properties
        this.body_element = null
        this.collapsable = null
        this.clickable = null
        this.draw()
    }
    expand = () => {
        this.clickable.classList.add("bg-gray-900")
        this.collapsable.classList.add("fa-chevron-up")
        this.collapsable.classList.remove("fa-chevron-down")
        this.body_element.classList.remove("hidden")
        this.callback(this.parms)
        colony.active_accordion = this
    }
    collapse = () => {
        this.collapsable.classList.add("fa-chevron-down")
        this.body_element.classList.add("hidden")
        this.clickable.classList.remove("bg-gray-900")
        this.collapsable.classList.remove("fa-chevron-up")
        //Remove accordion body (must be generated in next expansion)
        this.body_element.innerHTML = ""
        //Check if body_element has a hidden panel as sibling element.
        let body_element_panel = document.getElementById(this.body_element.id+"-panel") 
        if(body_element_panel){
            colony.active_panel.close()
        }
        colony.active_accordion = null
    }
    draw = () => {
        let title_element = this.title ? this.title : null
        let body_element_id = this.title != null && this.title.getAttribute("data-body") != undefined ? this.title.getAttribute("data-body") : null
        this.body_element = body_element_id != null ? document.getElementById(body_element_id) : null
        if(title_element != null && this.body_element != null){
            title_element.querySelectorAll(".clickable").forEach((elem) => {
                elem.addEventListener("click", (e) => {
                    //Find other custom accordions with same accordion class.
                    let accordion_group = title_element.getAttribute("data-group")
                    document.querySelectorAll(`div[data-group="${accordion_group}"]:not(#${title_element.id})`).forEach((elem) => {
                        //Collapse these custom accordions with same accordion class.
                        //1) Remove up arrow icon and set a down arrow if necessary.
                        let arrow = document.getElementById(elem.id).querySelector("i.fa-chevron-up")
                        if(arrow){
                            arrow.classList.remove("fa-chevron-up")
                            arrow.classList.add("fa-chevron-down")
                        }
                        //2) Hide accordion body.
                        let body_id = document.getElementById(elem.id).getAttribute("data-body")
                        document.getElementById(body_id).classList.add("hidden")
                        //3) Remove accordion body content.
                        document.getElementById(body_id).innerHTML = ""
                        //4) Change accordion title background color.
                        document.querySelector(`#${elem.id} p`).classList.remove("bg-gray-800", "bg-gray-900")
                    })
                    this.collapsable = e.target.closest(".clickable").querySelector("i.collapsable")
                    this.clickable = e.target.closest(".clickable")
                    //Check if "New" label is present in the accordion title.
                    let new_label = this.clickable.querySelector(".new")
                    if(new_label){
                        this.update_unread_notifications(-1)
                        new_label.remove()
                    }
                    //Collapse generative accordion?
                    if(this.collapsable.classList.contains("fa-chevron-up")){
                        this.collapse()
                    } else { //Expand generative accordion
                        this.expand()
                    }
                })
            })
        } else {
            console.log("Error while trying to attach custom accordion events to #" + this.title.id)
        }
    }
    //Keeps going up the DOM tree until no more unread notifications are found. Update its number (adding or substracting 1) on each level.
    update_unread_notifications = (value_change = -1) => {
        let current_node = this.clickable.querySelector(".new")
        let has_unread_notification = false, has_unread_positive_notifications = false, going_up = false
        do {
            do{
                current_node = current_node.parentElement
                //Check if another node with same id exists but instead of with suffix -body is -title.
                if(current_node.id && current_node.id.endsWith("-body")){
                    let possible_title_id = current_node.id.replace("-body", "-title")
                    let possible_title_node = document.getElementById(possible_title_id)
                    has_unread_notification = possible_title_node.querySelectorAll(".unread-notification") && possible_title_node.querySelectorAll(".unread-notification").length > 0
                    if(has_unread_notification) current_node = possible_title_node.querySelector(".unread-notification")
                } else {
                    has_unread_notification = false
                }
                has_unread_positive_notifications = has_unread_notification && current_node.innerHTML !== "0"
                going_up = current_node && current_node.id != "accordion-menu" && !has_unread_positive_notifications
            } while(going_up)
            if(has_unread_positive_notifications){
                let new_value = parseInt(current_node.innerHTML) + value_change
                current_node.innerHTML = new_value.toString()
                if(new_value > 0){
                    current_node.classList.remove("hidden")
                } else {
                    current_node.classList.add("hidden")
                }
            } else {
                if(has_unread_notification){
                    current_node.classList.add("hidden")
                }
            }
        } while(has_unread_notification)
    }
}

class Webpanel{
    constructor(data){
        //data is an object with additional information about the object used on the panel.
        this.language = data.language
        this.panel_name = data.name
        this.panel_icon = data.icon
        this.caller_accordion_body = document.getElementById(data.accordionBodyId)
        this.parent = this.caller_accordion_body.parentElement
        this.accordion_body = this.caller_accordion_body.cloneNode(false)
        this.accordion_body.id+="-panel"
        this.accordion_body.classList.add("webpanel")
        this.caller_accordion_body.after(this.accordion_body)
        this.caller_accordion_body.classList.add("hidden")
        this.is_displayed = false
        this.builder = data.buildContent
        this.close_callback = data.callback ? data.callback : false
        this.draw()
    }
    draw = () => {
        let p, s, s1
        p = new DOMElement({
            tagName: "p",
            classes: "flex justify-between items-center mx-1 mt-1 p-1 ps-2 bg-gray-800 border border-gray-800 text-gray-200",
            parentElement: this.accordion_body
        })
        s = new DOMElement({
            tagName: "span",
            classes: "grow",
            parentElement: p.getNode(),
        })
        i = new DOMElement({
            tagName: "i",
            classes: this.panel_icon + " me-1",
            parentElement: s.getNode(),
        })
        s1 = new DOMElement({
            tagName: "span",
            attributes: [{"key":"data-i18n", "value":""}],
            parentElement: s.getNode(),
            text: translate(language, this.panel_name)
        })
        i = new DOMElement({
            tagName: "i",
            classes: "closable mt-0 me-1",
            parentElement: p.getNode(),
            html: "<svg class='w-3 h-3' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 14'><path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'/></svg>"
        })
        let self = this
        i.getNode().addEventListener("click", function(e) {
            self.close()
        })
        d = new DOMElement({
            tagName: "div",
            classes: "flex flex-wrap gap-1 justify-between mx-1 mb-1 p-1 bg-gray-500 border border-gray-800 text-gray-200",
            parentElement: this.accordion_body,
            id: `${this.accordion_body.id}-body`
        })
        this.builder(d.getNode())
    }
    close = () => {
        this.accordion_body.remove()
        this.caller_accordion_body.classList.remove("hidden")
        colony.active_panel = null
        if(this.close_callback) this.close_callback()
    }
}