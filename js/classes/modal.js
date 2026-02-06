class ModalBox{
    constructor(element_clicked, container_id = "modalPopup", ancestor_element = null, data = null){
        this.target = ancestor_element == null ? element_clicked.target : ancestor_element
        this.data = data != null ? data : false
        let container_div = new DOMElement({
            tagName: "div",
            id: container_id,
            attributes: [{"key":"tab-index", "value":"-1"}],
            classes: "hidden fixed inset-0 z-50 flex justify-center items-center overflow-y-auto overflow-x-hidden w-full h-screen bg-gray-900/75",
            parentElement: document.body
        })
        this.container = container_div.getNode()
        let first_level = new DOMElement({
            tagName: "div",
            classes: "relative px-3 mx-0 w-full",
            parentElement: this.container
        })
        let second_level = new DOMElement({
            tagName: "div",
            classes: "modalbox-main relative bg-white rounded-lg shadow-sm bg-gray-700 border border-black",
            parentElement: first_level.getNode()
        })
        let header = new DOMElement({
            tagName: "div",
            id: container_id+"-modalbox-header",
            classes: "flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600 border-gray-200",
            parentElement: second_level.getNode()
        })
        let h3 = new DOMElement({
            tagName: "h3",
            id: container_id+"-modalbox-title",
            attributes: [{"key":"data-i18n", "value":""}],
            classes: "text-xl font-semibold text-gray-900 dark:text-white",
            parentElement: header.getNode()
        })
        let button = new DOMElement({
            tagName: "button",
            id: container_id+"-modalbox-title",
            attributes: [{"key":"type", "value":"button"}, {"key":"data-modal-hide", "value":this.container.id}],
            classes: "text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white",
            parentElement: header.getNode(),
            html: "<svg class='w-3 h-3' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 14'><path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'/></svg>"
        })
        button.getNode().addEventListener("click", (e) => {this.container.remove()})
        let span = new DOMElement({
            tagName: "span",
            id: container_id+"-modalbox-title",
            attributes: [{"key":"data-i18n", "value":""}],
            classes: "sr-only",
            parentElement: button.getNode(),
            text: "Close modal"
        })
        let body = new DOMElement({
            tagName: "div",
            id: container_id+"-modalbox-body",
            attributes: [{"key":"data-i18n", "value":""}],
            classes: "p-4",
            parentElement: second_level.getNode(),
            text: "Close modal"
        })
        let footer = new DOMElement({
            tagName: "div",
            id: container_id+"-modalbox-footer",
            attributes: [{"key":"data-i18n", "value":""}],
            classes: "flex items-center gap-2 p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600",
            parentElement: second_level.getNode()
        })
        let button1 = new DOMElement({
            tagName: "button",
            id: container_id+"-modalbox-button1",
            attributes: [{"key":"type", "value":"button"}, {"key":"data-i18n", "value":""},{"key":"data-modal-hide", "value":this.container.id}],
            classes: "hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
            parentElement: footer.getNode(),
        })
        let button2 = new DOMElement({
            tagName: "button",
            id: container_id+"-modalbox-button2",
            attributes: [{"key":"type", "value":"button"}, {"key":"data-i18n", "value":""},{"key":"data-modal-hide", "value":this.container.id}],
            classes: "hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
            parentElement: footer.getNode(),
        })
    }
    design = (style) => {
        //TODO: Customize modal colors, icons and fonts.
    }
    build = (modal_type) => {
        document.body.appendChild(this.container)
        //Build modal pop up structure
        switch(modal_type){
            case "citizen_info": this.show_citizen_info(); break
            case "cannot_assign_role": this.show_cannot_assign_role(); break
            case "confirm_citizen_exile": this.show_confirm_citizen_exile(); break
            case "alert_zone_searched": this.show_alert_zone_searched(); break
            case "alert_no_pregnancy": this.show_alert_no_pregnancy(); break
            case "alert_pregnancy_successful": this.show_alert_pregnancy_successful(); break
            case "progress": this.progress_modal(); break
        }
        return this
    }
    show = () => {
        this.container.classList.remove("hidden")
    }
    hide = () => {
        this.container.classList.add("hidden")
    }
    close = () => {
        this.container.remove()
    }
    show_citizen_info = () => {
        let citizen = colony.citizens.get(Number(this.target.dataset.citizenId)), p, s, s1, d
        //Build modal structure for citizen's information.
        document.querySelector("#"+this.container.id+"-modalbox-title").innerHTML = translate(language, citizen.name)
        //citizen.modalStyle = "small"
        let parent_element = document.querySelector("#"+this.container.id+"-modalbox-body")
        parent_element.innerHTML = ""
        //Gender / Status
        p = new DOMElement({
            tagName: "p",
            classes: "flex justify-between text-sm pt-1 text-gray-400",
            parentElement: parent_element
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode()
        })
        s1 = new DOMElement({
            tagName: "span",
            parentElement: s.getNode(),
            text: translate(language, "Gender", "", "capitalized")+": "
        })
        s1 = new DOMElement({
            tagName: "span",
            classes: "font-bold",
            parentElement: s.getNode(),
            text: translate(language, citizen.gender, "", "capitalized")
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode()
        })
        s1 = new DOMElement({
            tagName: "span",
            parentElement: s.getNode(),
            text: translate(language, "Status", "", "capitalized")+": "
        })
        s1 = new DOMElement({
            tagName: "span",
            classes: "font-bold",
            parentElement: s.getNode(),
            text: translate(language, citizen.status, "", "capitalized")
        })
        //Role / Experience
        p = new DOMElement({
            tagName: "p",
            classes: "flex justify-between text-sm pt-1 text-gray-400",
            parentElement: parent_element
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode()
        })
        s1 = new DOMElement({
            tagName: "span",
            parentElement: s.getNode(),
            text: translate(language, "Role", "", "capitalized")+": "
        })
        s1 = new DOMElement({
            tagName: "span",
            classes: "font-bold",
            parentElement: s.getNode(),
            text: translate(language, citizen.role, "", "capitalized")
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode()
        })
        s1 = new DOMElement({
            tagName: "span",
            parentElement: s.getNode(),
            text: translate(language, "Experience", "", "capitalized")+": "
        })
        s1 = new DOMElement({
            tagName: "span",
            classes: "font-bold",
            parentElement: s.getNode(),
            text: Math.floor(citizen.xp).toString()
        })
        //Birthweek / Age
        p = new DOMElement({
            tagName: "p",
            classes: "flex justify-between text-sm pt-1 text-gray-400",
            parentElement: parent_element
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode()
        })
        s1 = new DOMElement({
            tagName: "span",
            parentElement: s.getNode(),
            text: translate(language, "Birth week", "", "capitalized")+": "
        })
        s1 = new DOMElement({
            tagName: "span",
            classes: "font-bold",
            parentElement: s.getNode(),
            text: citizen.birthWeek.toString()
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode()
        })
        s1 = new DOMElement({
            tagName: "span",
            parentElement: s.getNode(),
            text: translate(language, "Age", "", "capitalized")+": "
        })
        s1 = new DOMElement({
            tagName: "span",
            classes: "font-bold",
            parentElement: s.getNode(),
            text: citizen.ageYears.toString()
        })
        s1 = new DOMElement({
            tagName: "span",
            classes: "ms-1",
            parentElement: s.getNode(),
            text: translate(language, "years")+", "
        })
        s1 = new DOMElement({
            tagName: "span",
            classes: "font-bold",
            parentElement: s.getNode(),
            text: citizen.ageWeeks.toString()
        })
        s1 = new DOMElement({
            tagName: "span",
            classes: "ms-1",
            parentElement: s.getNode(),
            text: translate(language, "weeks")
        })
        //Left hand / Right hand
        p = new DOMElement({
            tagName: "p",
            classes: "flex justify-between text-sm pt-1 text-gray-400",
            parentElement: parent_element
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode()
        })
        s1 = new DOMElement({
            tagName: "span",
            parentElement: s.getNode(),
            text: translate(language, "Left hand", "", "capitalized")+": "
        })
        let left_hand_object = !citizen.body.hands.left.toString() ? translate(language, "empty", "f", "capitalized") : translate(language, citizen.body.hands.left.toString())
        s1 = new DOMElement({
            tagName: "span",
            classes: "font-bold",
            parentElement: s.getNode(),
            text: left_hand_object["f"]
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode()
        })
        s1 = new DOMElement({
            tagName: "span",
            parentElement: s.getNode(),
            text: translate(language, "Right hand", "", "capitalized")+": "
        })
        let right_hand_object = !citizen.body.hands.left.toString() ? translate(language, "empty", "f", "capitalized") : translate(language, citizen.body.hands.left.toString())
        s1 = new DOMElement({
            tagName: "span",
            classes: "font-bold",
            parentElement: s.getNode(),
            text: right_hand_object["f"]
        })
        //Outfit / Fertility
        p = new DOMElement({
            tagName: "p",
            classes: "flex justify-between text-sm pt-1 text-gray-400",
            parentElement: parent_element
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode()
        })
        s1 = new DOMElement({
            tagName: "span",
            parentElement: s.getNode(),
            text: translate(language, "Outfit", "", "capitalized")+": "
        })
        let outfit = citizen.body.outfit ? translate(language, "yes", "", "capitalized") : translate(language, "no", "", "capitalized")
        s1 = new DOMElement({
            tagName: "span",
            classes: "font-bold",
            parentElement: s.getNode(),
            text: outfit
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode()
        })
        s1 = new DOMElement({
            tagName: "span",
            parentElement: s.getNode(),
            text: translate(language, "Fertility", "", "capitalized")+": "
        })
        s1 = new DOMElement({
            tagName: "span",
            classes: "font-bold",
            parentElement: s.getNode(),
            text: citizen.fertility.value.toString()
        })
        d = new DOMElement({
            tagName: "div",
            classes: "my-2 px-2 pb-1 border border-gray-800 rounded bg-gray-600 text-ms text-white",
            parentElement: parent_element
        })
        //Own attributes list.
        p = new DOMElement({
            tagName: "p",
            classes: "mt-1 text-sm",
            parentElement: d.getNode(),
            text: translate(language, "Atributos propios")
        })
        p = new DOMElement({
            tagName: "div",
            classes: "gap-3 flex justify-between",
            parentElement: d.getNode()
        })
        citizen.attributes.forEach((attribute) => {
            let eng_attribute = translate("EN", attribute, "", formatResult = "", false)
            s = new DOMElement({
                tagName: "span",
                classes: `grow mt-1 px-1 text-center border border-gray-800 rounded bg-gray-700 text-xs font-bold ${attributes_colors["EN"][eng_attribute].text}`,
                parentElement: p.getNode(),
                text: translate(language, attribute, "", "uppercase")
            })
        })
        //Wished attributes list.
        p = new DOMElement({
            tagName: "p",
            classes: "mt-1 text-sm",
            parentElement: d.getNode(),
            text: translate(language, "Atributos propios")
        })
        p = new DOMElement({
            tagName: "div",
            classes: "gap-3 flex justify-between",
            parentElement: d.getNode()
        })
        citizen.wishedAttributes.forEach((attribute) => {
            let eng_attribute = translate("EN", attribute, "", formatResult = "", false)
            s = new DOMElement({
                tagName: "span",
                classes: `grow mt-1 px-1 text-center border border-gray-800 rounded bg-gray-700 text-xs font-bold ${attributes_colors["EN"][eng_attribute].text}`,
                parentElement: p.getNode(),
                text: translate(language, attribute, "", "uppercase")
            })
        })
        //Hated attribute.
        p = new DOMElement({
            tagName: "p",
            classes: "mt-1 text-sm",
            parentElement: d.getNode(),
            text: translate(language, "Atributos propios")
        })
        p = new DOMElement({
            tagName: "div",
            classes: "gap-3 flex justify-between",
            parentElement: d.getNode()
        })
        let eng_attribute = translate("EN", citizen.hatedAttribute, "", formatResult = "", false)
        s = new DOMElement({
            tagName: "span",
            classes: `mt-1 px-2 text-center border border-gray-800 rounded bg-gray-700 text-xs font-bold ${attributes_colors["EN"][eng_attribute].text}`,
            parentElement: p.getNode(),
            text: translate(language, citizen.hatedAttribute, "", "uppercase")
        })
        document.querySelector("#"+this.container.id+"-modalbox-button1").innerText = translate(language, "Ok")
        document.querySelector("#"+this.container.id+"-modalbox-button1").classList.remove("hidden")
        document.querySelector("#"+this.container.id+"-modalbox-button1").addEventListener("click", (e) => {
            this.container.remove()
        })
    }
    show_cannot_assign_role = () => {
        let citizen = colony.citizens.get(Number(this.target.dataset.citizenId)), p, s, s1, d
        //Build modal structure for citizen's information.
        document.querySelector("#"+this.container.id+"-modalbox-title").innerHTML = translate(language, citizen.name)
        //citizen.modalStyle = "small"
        let parent_element = document.querySelector("#"+this.container.id+"-modalbox-body")
        parent_element.innerHTML = ""
        p = new DOMElement({
            tagName: "p",
            classes: "flex justify-between font-bold text-sm py-1 text-gray-400",
            parentElement: parent_element
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode()
        })
        s1 = new DOMElement({
            tagName: "span",
            parentElement: s.getNode(),
            text: translate(language, "Warning!", "", "capitalized")
        })
        p = new DOMElement({
            tagName: "p",
            classes: "flex justify-between text-sm pt-1 text-gray-400",
            parentElement: parent_element
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode()
        })
        s1 = new DOMElement({
            tagName: "span",
            parentElement: s.getNode(),
            text: translate(language, "You cannot change this citizen's role because his or her status is not \"idle\".")
        })
        document.querySelector("#"+this.container.id+"-modalbox-button1").innerText = translate(language, "Ok")
        document.querySelector("#"+this.container.id+"-modalbox-button1").classList.remove("hidden")
        document.querySelector("#"+this.container.id+"-modalbox-button1").addEventListener("click", (e) => {
            this.container.remove()
        })
    }
    show_confirm_citizen_exile = () => {
        let citizen = colony.citizens.get(Number(this.target.dataset.citizenId)), p, s
        //Build modal structure for citizen's information.
        document.querySelector("#"+this.container.id+"-modalbox-title").innerHTML = translate(language, citizen.name)
        //citizen.modalStyle = "small"
        let parent_element = document.querySelector("#"+this.container.id+"-modalbox-body")
        parent_element.innerHTML = ""
        //Gender / Status
        p = new DOMElement({
            tagName: "p",
            classes: "flex justify-between font-bold text-sm pt-1 text-gray-400 mb-2",
            parentElement: parent_element
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode(),
            text: translate(language, "Warning!", "", "capitalized"),
            id: "confirmExileCitizenText"
        })
        p = new DOMElement({
            tagName: "p",
            classes: "flex justify-between text-sm pt-1 text-gray-400 mb-2",
            parentElement: parent_element
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode(),
            text: translate(language, "Are you sure you want to exile this citizen?", "", "capitalized")
        })
        p = new DOMElement({
            tagName: "p",
            classes: "flex justify-between text-sm pt-1 text-gray-400 mb-2",
            parentElement: parent_element
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode(),
            text: translate(language, "Your citizen will disappear from your colony", "", "capitalized")+"."
        })
        p = new DOMElement({
            tagName: "p",
            classes: "flex justify-between text-sm pt-1 text-gray-400",
            parentElement: parent_element
        })
        s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode(),
            text: translate(language, "If you are decided to exile this citizen choose 'Ok', otherwise choose 'Cancel'.", "", "capitalized")
        })
        //Show "OK" button.
        document.querySelector("#"+this.container.id+"-modalbox-button1").innerText = translate(language, "Ok")
        document.querySelector("#"+this.container.id+"-modalbox-button1").classList.remove("hidden")
        document.querySelector("#"+this.container.id+"-modalbox-button1").addEventListener("click", (e) => {
            //Clear modal texts.
            parent_element.querySelectorAll("span").forEach(span => span.innerText = "")
            //Remove citizen from colony.
            colony.citizens.delete(citizen.id)
            document.getElementById(`accordion-citizen-${citizen.id}-div`).remove()
            //Update text and buttons.
            document.getElementById("confirmExileCitizenText").innerText = translate(language, "The citizen has been exiled from your colony", "", "capitalized")+"."
            document.querySelector("#"+this.container.id+"-modalbox-button1").classList.add("hidden")
        })
        //Show "Cancel" button.
        document.querySelector("#"+this.container.id+"-modalbox-button2").innerText = translate(language, "Cancel")
        document.querySelector("#"+this.container.id+"-modalbox-button2").classList.remove("hidden")
        document.querySelector("#"+this.container.id+"-modalbox-button2").addEventListener("click", (e) => {
            this.container.remove()
        })
    }
    show_alert_zone_searched = () => {
        //Build modal structure for citizen's information.
        document.querySelector("#"+this.container.id+"-modalbox-title").innerHTML = translate(language, "Zone researched!")
        let parent_element = document.querySelector("#"+this.container.id+"-modalbox-body")
        parent_element.innerHTML = ""
        if(this.data && this.data.paragraphs && this.data.paragraphs.length){
            this.data.paragraphs.forEach((paragraph_text) => {
                p = new DOMElement({
                    tagName: "p",
                    classes: "flex justify-between text-sm py-1 text-gray-400",
                    parentElement: parent_element
                })
                p.appendContent(translate(language, paragraph_text))
            })
        }
        document.querySelector("#"+this.container.id+"-modalbox-button1").innerText = translate(language, "Ok")
        document.querySelector("#"+this.container.id+"-modalbox-button1").classList.remove("hidden")
        document.querySelector("#"+this.container.id+"-modalbox-button1").addEventListener("click", (e) => {
            this.container.remove()
        })
    }
    show_alert_pregnancy_successful = () => {
        //Build modal structure for message.
        document.querySelector("#"+this.container.id+"-modalbox-title").innerHTML = translate(language, "Good news!")
        let parent_element = document.querySelector("#"+this.container.id+"-modalbox-body")
        parent_element.innerHTML = ""
        if(this.data && this.data.paragraphs && this.data.paragraphs.length){
            this.data.paragraphs.forEach((paragraph_text) => {
                p = new DOMElement({
                    tagName: "p",
                    classes: "flex justify-between text-sm py-1 text-gray-400",
                    parentElement: parent_element
                })
                p.appendContent(paragraph_text)
            })
        }
        document.querySelector("#"+this.container.id+"-modalbox-button1").innerText = translate(language, "Ok")
        document.querySelector("#"+this.container.id+"-modalbox-button1").classList.remove("hidden")
        document.querySelector("#"+this.container.id+"-modalbox-button1").addEventListener("click", (e) => {
            this.container.remove()
        })
    }
    show_alert_no_pregnancy = () => {
        //Build modal structure for message.
        document.querySelector("#"+this.container.id+"-modalbox-title").innerHTML = translate(language, "Not this time...")
        let parent_element = document.querySelector("#"+this.container.id+"-modalbox-body")
        parent_element.innerHTML = ""
        if(this.data && this.data.paragraphs && this.data.paragraphs.length){
            this.data.paragraphs.forEach((paragraph_text) => {
                p = new DOMElement({
                    tagName: "p",
                    classes: "flex justify-between text-sm py-1 text-gray-400",
                    parentElement: parent_element
                })
                p.appendContent(translate(language, paragraph_text))
            })
        }
        document.querySelector("#"+this.container.id+"-modalbox-button1").innerText = translate(language, "Ok")
        document.querySelector("#"+this.container.id+"-modalbox-button1").classList.remove("hidden")
        document.querySelector("#"+this.container.id+"-modalbox-button1").addEventListener("click", (e) => {
            this.container.remove()
        })
    }
    progress_modal = (title_text = "Warning!") => {
        let title = document.getElementById(this.container.id+"-modalbox-title")
        let body = document.getElementById(this.container.id+"-modalbox-body")
        title.innerHTML= translate(language, title_text)
        title.classList.remove("text-base")
        title.classList.add("text-xl")
        title.parentElement.classList.remove("text-base", "py-2", "ps-4", "p-4")
        title.parentElement.classList.add("text-xl", "p-4")
        body.classList.remove("py-1", "px-4", "p-4")
        body.classList.add("p-4")
        body.innerHTML = ""
        let p = new element("p", "text-base py-2 text-gray-400", [{"key":"data-i18n","value":""}], body)
        if(this.data && this.data.paragraphs && this.data.paragraphs.length){
            this.data.paragraphs.forEach((paragraph_text) => {
                p.create(); p.appendContent(translate(language, paragraph_text))
            })
        } else {
            p.create(); p.appendContent(translate(language, "You are about to change all life progress in your colony!"))
            p.create(); p.appendContent(translate(language, "This means that if the file is uploaded succesfully, all last progress will be replaced by the one described in your file."))
            p.create(); p.appendContent(translate(language, "If you are decided to update your progress choose 'Ok', otherwise choose 'Cancel'."))
        }
        let button1 = document.getElementById(this.container.id+"-modalbox-button1")
        let button2 = document.getElementById(this.container.id+"-modalbox-button2")
        button1.classList.remove("hidden")
        button2.classList.remove("hidden")
        if(!this.data || this.data.buttons == undefined || this.data.buttons == null){
            button1.innerText = translate(language, "Ok")
            button2.innerText = translate(language, "Cancel")
        } else {
            button1.innerText = translate(language, this.data.buttons[0].text)
            button2.innerText = translate(language, this.data.buttons[1].text)
            button1.addEventListener("click", this.data.buttons[0].handler)
            button2.addEventListener("click", this.data.buttons[1].handler)
        }
    }
}