panelClasses = {
    "assignRole": {"i":"fa-handshake-simple", "text":"font-bold grow", "bg":"bg-gray-900"},
    "newExpedition": {"i":"fa-location-dot", "text":"font-bold grow", "bg":"bg-gray-900"},
}

class panel{
    constructor(panelName, data, objectName, objectId, optionName){
        //data is an object with additional information about the object used on the panel.
        this.panelName = panelName
        this.objectName = objectName
        this.objectId = objectId
        this.optionName = optionName
        this.data = data
        this.previousOptionsPanelId = objectName+(objectId ? "-"+objectId : "")+"-"+optionName
        this.previousPanel = ""
        this.isDisplayed = false
    }
    hidePreviousOptions(){
        this.previousPanel = document.querySelector("#"+this.previousOptionsPanelId)
        this.previousPanelTitle = document.querySelector("#"+this.previousOptionsPanelId+"-title")
        this.previousPanel.classList.remove("hidden"); this.previousPanel.classList.add("hidden")
        this.previousPanelTitle.classList.remove("hidden"); this.previousPanelTitle.classList.add("hidden")
    }
    showPreviousOptions(){
        this.previousPanel = document.querySelector("#"+this.previousOptionsPanelId)
        this.previousPanelTitle = document.querySelector("#"+this.previousOptionsPanelId+"-title")
        this.previousPanel.classList.remove("hidden")
        this.previousPanelTitle.classList.remove("hidden")
    }
    removePanel(){
        document.querySelector("#"+this.objectName+(this.objectId ? "-"+this.objectId : "")+"-"+this.panelName+"-title").remove()
        document.querySelector("#"+this.objectName+(this.objectId ? "-"+this.objectId : "")+"-"+this.panelName).remove()
    }
    buildPanel(){
        let parentDiv = document.querySelector(this.data.parentId)
        let paragraphBg
        
        //Build title div.
        //--Build div, add paragraph
        d1 = new element("div", "border border-gray-300 border-gray-800 bg-gray-900 text-gray-200 text-xs", [], parentDiv, this.objectName+(this.objectId ? "-"+this.objectId : "")+"-"+this.panelName+"-title")
        d1.create()
        p = new element("p", "flex justify-between items-center p-1 ps-2 text-xs "+paragraphBg, [], d1.getNode())
        p.create()

        //--Build span with icon before
        switch(this.panelName){
            case "assignRole": 
                i = new element("i", "me-2 fa "+panelClasses.assignRole.i, [], p.getNode()); i.create()
                s = new element("span", panelClasses.assignRole.text, [{"key":"data-i18n", "value":""}], p.getNode())
                s.create(); s.appendContent(this.data.language == "ES" ? translate("ES", "Assign a role") : translate("EN", "Asignarle un rol"))
                paragraphBg = panelClasses.assignRole.bg
                break
            case "newExpedition": 
                i = new element("i", "me-2 fa "+panelClasses.newExpedition.i, [], p.getNode()); i.create()
                s = new element("span", panelClasses.newExpedition.text, [{"key":"data-i18n", "value":""}], p.getNode())
                s.create(); s.appendContent(this.data.language == "ES" ? translate("ES", "New expedition") : translate("EN", "Nueva expedición"))
                paragraphBg = panelClasses.newExpedition.bg
                break
        }
        //Build close icon to the right
        i = new element("i", "mt-0 text-base fa fa-times font-bold", [], p.getNode()); i.create()
        i.getNode().addEventListener("click", (e) => {
            if(this.panelName == "newExpedition"){
                //Make assigned expeditionaries or army available restoring status of all of them.
                document.querySelectorAll(".assignedWorkers h2").forEach((citizen) => {
                    let citizenIndex = citizen.id.split("-")[2]
                    document.querySelectorAll("#citizen-"+citizenIndex+"-status").forEach((status) => {
                        status.setAttribute("data-status", "idle")
                        status.innerText = translate(language, "idle")
                    })
                })
            }
            this.removePanel()
            this.showPreviousOptions()
        })

        //Build specific panel
        d1 = new element("div", "newExpedition border border-gray-900 dark:border-gray-900 dark:bg-gray-600 text-xs", [], parentDiv, this.objectName+(this.objectId ? "-"+this.objectId : "")+"-"+this.panelName); d1.create()
        p = new element("p", "flex py-1 w-100 justify-between items-center flex-wrap p-1 text-gray-500 dark:text-gray-300", [], d1.getNode()); p.create()
        let divSpecificParagraphButton = []
        if(this.panelName == "assignRole"){
            //Specific Assign Role panel
            let currentRole = document.querySelector("#"+this.objectName+"-"+this.objectId+"-role").getAttribute("data-role")
            let iElement, buttonText = "", generalRole = "", buttonColours = "", isDisabled = false
            roleIcons.forEach((value, index) => {
                divSpecificParagraphButton[index]= document.createElement("button")
                iElement = "<i class='fa fa-"+value.icon+" me-2'></i>"
                if(typeof(value[this.data.language]) != 'undefined'){
                    if(typeof(value[this.data.language][this.data.gender]) != 'undefined'){
                        buttonText = value[this.data.language][this.data.gender]
                    } else {
                        buttonText = value[this.data.language]
                    }
                    divSpecificParagraphButton[index].innerHTML = iElement + buttonText
                    divSpecificParagraphButton[index].setAttribute("data-icon", value.icon)
                    divSpecificParagraphButton[index].setAttribute("data-rolekey", value.key)
                    generalRole = typeof value["EN"][gender] != "undefined" ? value["EN"][gender].replaceAll(" ","") : value["EN"].replaceAll(" ","")
                }
                isDisabled = currentRole != null && value.key == currentRole
                buttonColours = isDisabled ? "border-gray-500 bg-gray-700 text-gray-400" : "border-green-700 bg-green-900 text-white"
                divSpecificParagraphButton[index].classList = generalRole+" assignableRole text-xs capitalize "+(index+1 < roleIcons.length ? "grow " : "")+"p-2 me-1 mb-1 button border "+buttonColours
                divSpecificParagraphButton[index].disabled = isDisabled
                p.appendContent(divSpecificParagraphButton[index])
            })
        }
        if(this.panelName == "newExpedition"){
            //Specific New Expedition panel
            s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Type")+":")
            s = new element("span", "expeditionType grow flex", [], p.getNode()); s.create()
            b = new element("button", "text-xs text-white ms-2 grow p-1 button border border-gray-400 bg-green-800", [{"key":"data-type", "value":"of resources"}], s.getNode())
            b.create(); b.appendContent(translate(language, "of resources"))
            b = new element("button", "text-xs text-white ms-2 grow p-1 button border border-gray-400 bg-blue-800", [{"key":"data-type", "value":"of ruins"}], s.getNode())
            b.create(); b.appendContent(translate(language, "of ruins"))
            b = new element("button", "text-xs text-white ms-2 grow p-1 button border border-gray-400 bg-red-800", [{"key":"data-type", "value":"of combat"}], s.getNode())
            b.create(); b.appendContent(translate(language, "of combat"))
        }
        //Button events
        if(this.panelName == "newExpedition"){
            document.querySelectorAll(".expeditionType button").forEach((value) => {
                value.addEventListener("click", (e) => {
                    //Build expedition type legend with colors.
                    let type = e.target.getAttribute("data-type")
                    let background = e.target.classList.contains("bg-blue-800") ? "blue" : (e.target.classList.contains("bg-green-800") ? "green" : "red")
                    document.querySelectorAll(".expeditionType button").forEach((button) => button.classList.add("hidden"))
                    let typeText = "Expedition to "+(e.target.getAttribute("data-type") == "of resources" ? "discover resources mounts" : (e.target.getAttribute("data-type") == "of ruins" ? "discover ruins" : "attack other colonies"))
                    s1 = new element("span", "ms-2 p-1 px-1 text-white border border-gray-400 bg-"+background+"-800", [], s.getNode())
                    s1.create(); s1.appendContent(translate(language, typeText))
                    //Build workers/army assigned title
                    let assignedType = type == "of combat" ? "army" : "workers"
                    d = new element("div", "border border-gray-300 dark:border-gray-800 dark:bg-gray-800 text-xs", [], d1.getNode(), "newExpedition-assigned-"+assignedType+"-title")
                    d.create()
                    p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200", [], d.getNode()); p.create()
                    s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Assigned "+assignedType))
                    //Build workers assigned panel
                    d = new element("div", "assigned"+(assignedType.charAt(0).toUpperCase()+assignedType.slice(1))+" p-2 ps-3 border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode(), "newExpedition-assigned-"+assignedType)
                    d.create()
                    p = new element("p", "empty text-xs flex justify-between text-gray-500 dark:text-gray-200", [], d.getNode()); p.create()
                    s = new element("span", "", [], p.getNode()); s.create()
                    i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                    s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); 
                    s1.create(); s1.appendContent(translate(language, "No "+assignedType+" assigned"))
                    //Build available workers/army title
                    d = new element("div", "border border-gray-300 dark:border-gray-800 dark:bg-gray-800 text-xs", [], d1.getNode(), "newExpedition-available-"+assignedType+"-title")
                    d.create()
                    p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200", [], d.getNode()); p.create()
                    s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Available "+assignedType))
                    //Build available workers/army panel
                    d = new element("div", "available"+(assignedType.charAt(0).toUpperCase()+assignedType.slice(1))+" p-2 ps-3 border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode(), "newExpedition-available-"+assignedType)
                    d.create()
                    if(type != "of combat"){
                        //Check if there is no available expeditionary to add here. If not, place the "No workers available" text instead.
                        if(document.querySelectorAll("[data-role=\"expeditioning\"]").length){
                            document.querySelectorAll("[data-role=\"expeditioning\"]").forEach((citizen) => {
                                let citizenIndex = citizen.id.split("-")[1]
                                addAvailableWorkerToExpedition(citizenIndex, "newExpedition")
                                document.getElementById("citizen-"+citizenIndex+"-assign").setAttribute("data-class", "newExpedition")
                                document.getElementById("citizen-"+citizenIndex+"-assign").addEventListener("click", handleToggleWorker)
                            })
                        } else {
                            //Add "No workers/army available" text.
                            p = new element("p", "empty text-xs flex justify-between text-gray-500 dark:text-gray-200", [], d.getNode()); p.create()
                            s = new element("span", "", [], p.getNode()); s.create()
                            i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                            s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); 
                            s1.create(); s1.appendContent(translate(language, "No "+assignedType+" available"))
                        }
                    } else {
                        //Add "No army available" text.
                        p = new element("p", "empty text-xs flex justify-between text-gray-500 dark:text-gray-200", [], d.getNode()); p.create()
                        s = new element("span", "", [], p.getNode()); s.create()
                        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); 
                        s1.create(); s1.appendContent(translate(language, "No "+assignedType+" available"))
                    }
                })
            })
        }
        this.isDisplayed = true
    }
}

class element{
    constructor(tagName, classes, attributes, parentElement, id = ""){
        this.id = (id ? id : "")
        this.tagName = tagName
        this.classes = classes
        this.parentElement = parentElement
        this.attributes = attributes
    }
    create(firstChild = false){
        this.elementNode = document.createElement(this.tagName)
        this.elementNode.id = this.id
        this.attributes.forEach((value, index) => {
            this.elementNode.setAttribute(value.key, value.value)
        })
        this.elementNode.classList = this.classes
        //Set div as parent last child.
        if(this.parentElement){
            if(firstChild){
                this.parentElement.insertBefore(this.elementNode, this.parentElement.firstChild)
            } else {
                this.parentElement.appendChild(this.elementNode)
            }
        }
    }
    appendText(text){
        this.elementNode.innerText = (typeof content === "string") ? content : ""
    }
    appendContent(content){
        if(typeof content === "string"){
            this.elementNode.innerText = content
        } else {
            this.elementNode.appendChild(content)
        }
    }
    appendHTML(html){
        this.elementNode.innerHTML+= html
    }
    getNode(){
        return this.elementNode
    }
}

//Build home accordions structure
let accordionNews = () => {
    //Build news accordion
    let parentElem = document.getElementById("accordion-menu")
    //Build news accordion header
    h2 = new element("h2", "mt-3", [], parentElem, "accordion-menu-news"); h2.create()
    b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-gray-400 bg-gray-900 font-medium rtl:text-right border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-news-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-news-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [], b.getNode()); s.create()
    s1 = new element("span", "bg-blue-100 text-blue-800 text-xs fa fa-beat font-medium me-3 px-2 py-1 rounded-sm dark:bg-blue-900 dark:text-blue-300", [], s.getNode(), "newsNotifications"); s1.create(); s1.appendContent("1")
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Recent news")
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build news accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-menu-news"}], parentElem, "accordion-menu-news-body"); d1.create()
    d2 = new element("div", "py-1 border border-gray-200 dark:border-gray-700 dark:bg-gray-700", [], d1.getNode(), "accordion-news-1-header"); d2.create()
    d = new element("div", "mx-1", [{"key":"data-accordion","value":"collapse"}], d2.getNode(), "accordion-news"); d.create()
    //Build notification 1 accordion header
    h2 = new element("h2", "notificationUnread", [], d.getNode(), "accordion-news-1-header"); h2.create()
    b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 font-medium rtl:text-right border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-news-1-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-news-1-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [], b.getNode()); s.create()
    s1 = new element("span", "new bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300 me-3", [{"key":"gender","value":"f"}, {"key":"data-i18n","value":""}], s.getNode())
    s1.create(); s1.appendContent("NEW")
    s1 = new element("span", "capital me-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Year")
    s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent("1")
    s.appendHTML(", ")
    s1 = new element("span", "capital me-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Week")
    s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent("1")
    s.appendHTML(", ")
    s1 = new element("span", "capital me-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Day")
    s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent("1")
    s.appendHTML(" (")
    s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent("00")
    s1 = new element("span", "ms-1", [], s.getNode()); s1.create(); s1.appendContent("hs.)")
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build notification 1 accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-news-1-header"}], d.getNode(), "accordion-news-1-body")
    d1.create()
    d2 = new element("div", "p-2 border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode()); d2.create()
    p = new element("p", "mb-2 text-gray-500 dark:text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent("Welcome to Medieval Colonies!")
    p = new element("p", "mb-2 text-gray-500 dark:text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent("Great news come from a very distant land in which your people has found a place to build up your new colony.")
    p = new element("p", "mb-2 text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("Your status is this")
    p.appendHTML(":")
    p = new element("p", "mb-2 text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("You have")
    s = new element("span", "font-bold me-1", [], p.getNode()); s.create(); s.appendContent(citizensAmount.toString())
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("citizens")
    p.appendHTML(": ")
    s = new element("span", "font-bold me-1", [], p.getNode()); s.create(); s.appendContent(citizensMaleAmount.toString())
    s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("men")
    s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("and")
    s = new element("span", "font-bold me-1", [], p.getNode()); s.create(); s.appendContent(citizensFemaleAmount.toString())
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("women")
    p.appendHTML(".")
    p = new element("p", "mb-2 text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("You have")
    s = new element("span", "font-bold me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("a "+colonyWaterReservoir.toLowerCase())
    s = new element("span", "", [{"key":"data-i18n","value":""}, {"key":"gender","value":"*"}], p.getNode()); s.create(); s.appendContent("nearby")
    p.appendHTML(".")
    p = new element("p", "mb-2 text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("You have")
    s = new element("span", "font-bold me-1", [], p.getNode()); s.create(); s.appendContent(wagonsAmount.toString())
    s = new element("span", "font-bold me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("wagons")
    s = new element("span", "", [{"key":"data-i18n","value":""}, {"key":"gender","value":"f"}], p.getNode()); s.create(); s.appendContent("full of resources and products.")
    p = new element("p", "mb-2 text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("You have")
    s = new element("span", "font-bold me-1", [], p.getNode()); s.create(); s.appendContent(horsesAmount.toString())
    s = new element("span", "font-bold", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("horses")
    p.appendHTML(", ")
    s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("two for each wagon.")
    p = new element("p", "mb-2 text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "font-bold me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("Each wagon")
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("has the following things")
    p.appendHTML(":")
    p = new element("p", "mb-2 text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagonGoods.resources["wooden trunk"]).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("wooden trunk")
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagonGoods.products.nail).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("nail")
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagonGoods.products.hammer).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("hammer")
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagonGoods.products.shovel).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("shovel")
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagonGoods.products.trowel).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("trowel")
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagonGoods.products.saw).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("saw")
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagonGoods.products.hay).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("hay")
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagonGoods.products.rope).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("rope")
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagonGoods.products.rag).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("rag")
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagonGoods.resources.water).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("water")
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagonGoods.resources.food).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("food")
    p = new element("p", "mb-0 p-1 px-2 rounded font-bold text-white border-red-600 bg-red-600", [], d2.getNode(), "searchZoneWarning"); p.create()
    s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("Warning! Time is stopped. Search the zone in the Colony panel to start your game.")
}
let accordionColony = () => {
    let d, d1, parentElem = document.getElementById("accordion-menu")
    let buildColonyAccordion = () => {
        //Build colony accordion header
        let h2 = new element("h2", "mt-3", [], parentElem, "accordion-menu-colony"); h2.create()
        let b = new element("button", "flex items-center justify-between w-full py-2 px-3 bg-gray-900 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-colony-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-colony-body"}], h2.getNode())
        b.create()
        let s = new element("span", "", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent("Colony")
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        //Build colony accordion body
        d = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-menu-colony"}], parentElem, "accordion-menu-colony-body"); d.create()
    }
    let buildColonyName = () => {
        //First panel
        //Colony name and save button
        p = new element("p", "flex pb-1 text-gray-500 dark:text-gray-400", [], d1.getNode()); p.create()
        s = new element("span", "text-xs px-2 bg-gray-500 border border-gray-500 text-white flex-none py-2", [], p.getNode()); s.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Name")
        s.appendHTML(": ")
        t = new element("input", "text-xs grow bg-gray-600 text-white", [{"key":"type","value":"text"},{"key":"placeholder","value":"Type in your colony name"},{"key":"value","value":"Colonia12540"}], p.getNode(), "colonyName"); t.create()
        b = new element("button", "text-xs flex-none px-2 button border border-gray-400 bg-gray-800", [{"key":"type","value":"button"},{"key":"data-i18n","value":""}], p.getNode(), "newColonyNameSubmit")
        b.create(); b.appendContent("Save")
    }
    let buildGeneralStatistics = () => {
        //Statistics header
        d2 = new element("div", "", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), "accordion-statistics"); d2.create()
        //Build general statistics accordion header
        h2 = new element("h2", "notificationUnread", [], d2.getNode(), "accordion-statistics-header"); h2.create()
        b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 font-medium rtl:text-right border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-statistics-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-statistics-body"}], h2.getNode())
        b.create()
        s = new element("span", "", [], b.getNode()); s.create()
        s1 = new element("span", "new bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 hidden rounded-sm dark:bg-blue-900 dark:text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
        s1.create(); s1.appendContent("NEW")
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("General statistics")
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        //Build general statistics accordion body
        d3 = new element("div", "hidden border-gray-300", [{"key":"aria-labelledby","value":"accordion-statistics-header"}], d2.getNode(), "accordion-statistics-body")
        d3.create()
        //Score
        p = new element("p", "pb-0 text-xs text-gray-500 dark:text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none pt-2 ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Score")
        s1.appendHTML(": ")
        s1 = new element("span", "pt-2 font-bold flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode(), "colonyScore"); s1.create(); s1.appendContent(colonyScore.toString())
        s1 = new element("span", "pt-2 grow text-white bg-gray-500 border border-gray-500", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("points")
        //Population
        p = new element("p", "pb-0 text-xs text-gray-500 dark:text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Population")
        s1.appendHTML(": ")
        s1 = new element("span", "font-bold flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode(), "colonyPopulation"); s1.create(); s1.appendContent(citizensAmount.toString())
        s1 = new element("span", "grow text-white bg-gray-500 border border-gray-500", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("citizens")
        //Life quality
        p = new element("p", "pb-0 text-xs text-gray-500 dark:text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Life quality")
        s1.appendHTML(": ")
        s1 = new element("span", "grow "+colonySatisfaction(colonyLifeQuality, citizensAmount).color+" bg-gray-500 font-medium px-1 py-0.5", [], s.getNode()); s1.create()
        s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colonyLifeQuality"); s2.create(); s2.appendContent(colonyLifeQuality.toString())
        s1.appendHTML("(")
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode(), "colonyLifeQualityImpression"); s2.create(); s2.appendContent(colonySatisfaction(colonyLifeQuality, citizensAmount).word)
        s1.appendHTML(")")
        i = new element("i", "ms-1 fa fa-"+colonySatisfaction(colonyLifeQuality, citizensAmount).icon, [], s1.getNode()); i.create()
        //Shelter capacity
        //Get shelter capacity from buildings array
        let shelterCapacity = buildings.shelter["campaign tent"].toString()
        let shelterCapacityOccupation = !buildings.shelter["campaign tent"] ? "" : "67%"
        let shelterCapacityIcon = !buildings.shelter["campaign tent"] ? "fa-face-pouting" : "fa-face-smile"
        let shelterCapacityColor = !buildings.shelter["campaign tent"] ? "text-red-400" : "text-green-400"
        p = new element("p", "pb-0 text-xs text-gray-500 dark:text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Shelter capacity")
        s1.appendHTML(": ")
        s1 = new element("span", "grow "+shelterCapacityColor+" bg-gray-500 font-medium px-1 py-0.5", [], s.getNode(), "colonyShelterCapacityInfo"); s1.create()
        s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colonyShelterCapacity"); s2.create(); s2.appendContent(shelterCapacity)
        if(buildings.shelter["campaign tent"]){
            s1.appendHTML("(")
            s2 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Occupation")
            s2 = new element("span", "font-bold", [], s1.getNode(), "colonyShelterOccupation"); s2.create(); s2.appendContent(shelterCapacityOccupation)
            s1.appendHTML(")")
        }
        i = new element("i", "ms-1 fa "+shelterCapacityIcon, [], s1.getNode(), "shelterCapacityIcon"); i.create()
        //Power
        p = new element("p", "pb-0 text-xs text-gray-500 dark:text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Power")
        s1.appendHTML(": ")
        s1 = new element("span", "font-bold grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode(), "colonyPower"); s1.create(); s1.appendContent("10")
        //Oppression
        p = new element("p", "pb-0 text-xs text-gray-500 dark:text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-2 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Oppression")
        s1.appendHTML(": ")
        s1 = new element("span", "grow flex-none text-green-400 bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
        s2 = new element("span", "font-bold me-1 pb-2", [], s1.getNode(), "colonyOppression"); s2.create(); s2.appendContent("0")
        s1.appendHTML("(")
        s2 = new element("span", "font-bold pb-2", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Your colony is free")
        s1.appendHTML(")")
    }
    let buildVitalResources = () => {
        d2 = new element("div", "", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), "accordion-vitalResources"); d2.create()
        //Build vital resources accordion header
        h2 = new element("h2", "notificationUnread", [], d2.getNode(), "accordion-vitalResources-header"); h2.create()
        b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 font-medium rtl:text-right border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-vitalResources-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-vitalResources-body"}], h2.getNode())
        b.create()
        s = new element("span", "", [], b.getNode()); s.create()
        s1 = new element("span", "new bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 hidden rounded-sm dark:bg-blue-900 dark:text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
        s1.create(); s1.appendContent("NEW")
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Vital resources")
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        //Build vital resources accordion body
        d3 = new element("div", "hidden border-gray-300", [{"key":"aria-labelledby","value":"accordion-vitalResources-header"}], d2.getNode(), "accordion-vitalResources-body")
        d3.create()
        //Water consumption
        p = new element("p", "pb-0 text-xs text-gray-500 dark:text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "ps-2 pb-1 pt-2 flex-none bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Water consumption")
        s1.appendHTML(": ")
        s1 = new element("span", "pt-2 grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
        s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-water-consumption"); s2.create(); s2.appendContent("20")
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("units per day")
        //Water income
        p = new element("p", "pb-0 text-xs text-gray-500 dark:text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Water income")
        s1.appendHTML(": ")
        s1 = new element("span", "grow flex-none text-green-400 bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
        s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-water-income"); s2.create(); s2.appendContent("30")
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("units per day")
        //Water stock
        p = new element("p", "pb-0 text-xs text-gray-500 dark:text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Water stock")
        s1.appendHTML(": ")
        s1 = new element("span", "grow flex-none text-green-400 bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
        s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-water-stock"); s2.create(); s2.appendContent("75")
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("units")
        i = new element("i", "ms-1 me-2 fa fa-arrow-up", [], s1.getNode()); i.create()
        s1.appendHTML("(")
        s2 = new element("span", "font-bold", [], s1.getNode(), "water-revenue"); s2.create(); s2.appendContent("+10")
        s1.appendHTML(")")
        //Food consumption
        p = new element("p", "pb-0 text-xs text-gray-500 dark:text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Food consumption")
        s1.appendHTML(": ")
        s1 = new element("span", "grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
        s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-food-consumption"); s2.create(); s2.appendContent("10")
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("units per day")
        //Food income
        p = new element("p", "pb-0 text-xs text-gray-500 dark:text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Food income")
        s1.appendHTML(": ")
        s1 = new element("span", "grow flex-none text-green-400 bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
        s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-food-income"); s2.create(); s2.appendContent("20")
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("units per day")
        //Food stock
        p = new element("p", "pb-0 text-xs text-gray-500 dark:text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "ps-2 pb-2 flex-none bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Food stock")
        s1.appendHTML(": ")
        s1 = new element("span", "pb-2 grow flex-none text-green-400 bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
        s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-food-stock"); s2.create(); s2.appendContent("75")
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("units")
        i = new element("i", "ms-1 me-2 fa fa-arrow-up", [], s1.getNode()); i.create()
        s1.appendHTML("(")
        s2 = new element("span", "font-bold", [], s1.getNode(), "food-revenue"); s2.create(); s2.appendContent("+10")
        s1.appendHTML(")")
    }
    let buildStock = () => {
        d2 = new element("div", "", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), "accordion-stock"); d2.create()
        //Build vital resources accordion header
        h2 = new element("h2", "notificationUnread", [], d2.getNode(), "accordion-stock-header"); h2.create()
        b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 font-medium rtl:text-right border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-stock-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-stock-body"}], h2.getNode())
        b.create()
        s = new element("span", "", [], b.getNode()); s.create()
        s1 = new element("span", "new bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 hidden rounded-sm dark:bg-blue-900 dark:text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
        s1.create(); s1.appendContent("NEW")
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Stock")
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        //Build vital resources accordion body
        d3 = new element("div", "hidden border-gray-300", [{"key":"aria-labelledby","value":"accordion-stock-header"}], d2.getNode(), "accordion-stock-body")
        d3.create()
        //Recursos extraídos
        d4 = new element("div", "p-0 m-0", [], d3.getNode(), "resources-stock"); d4.create()
        p = new element("p", "pb-0 text-xs text-gray-500 dark:text-gray-400", [], d4.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "ps-2 py-2 grow flex-none bg-gray-700 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Extracted resources")
        let count = 0
        Object.keys(stock.resources).forEach(resource => {
            if(resource!="food" && resource!="alimento"){
                let pt = (!count++ ? "pt-2" : "pt-0")
                p = new element("p", "resourceStock pb-0 text-xs text-gray-500 dark:text-gray-400", [], d4.getNode()); p.create()
                s = new element("span", "flex", [], p.getNode()); s.create()
                s1 = new element("span", "ps-2 "+pt+" pb-0 flex-none bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
                s2 = new element("span", "capitalize", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(resource)
                s1.appendHTML(": ")
                formatedResource = resource.replaceAll(" ", "")
                s1 = new element("span", pt+" pb-0 grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
                s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-"+formatedResource+"-stock"); s2.create(); s2.appendContent(stock.resources[resource].toString())
                s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("units")
            }
        })
        //Add last margin
        p = new element("p", "", [], d3.getNode()); p.create()
        s = new element("span", "bottomMargin flex pt-2 grow bg-gray-500 border border-gray-500", [], p.getNode()); s.create()
        //Productos manufacturados
        d4 = new element("div", "p-0 m-0", [], d3.getNode(), "products-stock"); d4.create()
        p = new element("p", "pb-0 text-xs text-gray-500 dark:text-gray-400", [], d4.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "ps-2 py-2 grow flex-none bg-gray-700 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Manufactured products")
        count = 0
        Object.keys(stock.products).forEach(product => {
            let pt = (!count++ ? "pt-2" : "pt-0")
            p = new element("p", "productStock pb-0 text-xs text-gray-500 dark:text-gray-400", [], d4.getNode()); p.create()
            s = new element("span", "flex", [], p.getNode()); s.create()
            s1 = new element("span", "ps-2 "+pt+" pb-0 flex-none bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
            s2 = new element("span", "capitalize", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(product)
            s1.appendHTML(": ")
            formatedProduct = product.replaceAll(" ", "")
            s1 = new element("span", pt+" pb-0 grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
            s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-"+formatedProduct+"-stock"); s2.create(); s2.appendContent(stock.products[product].toString())
            s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("units")
        })
        //Add last margin
        p = new element("p", "", [], d3.getNode()); p.create()
        s = new element("span", "bottomMargin flex pt-2 grow bg-gray-500 border border-gray-500", [], p.getNode()); s.create()
    }
    let buildActionsAvailable = () => {
        //Actions available
        d2 = new element("div", "mt-2 border border-gray-300 dark:border-gray-800 dark:bg-gray-500 text-xs", [], d1.getNode(), "colony-actions-title"); d2.create()
        p = new element("p", "flex justify-between p-1 ps-2 text-xs text-gray-200 bg-gray-800", [], d2.getNode()); p.create()
        s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent("Actions available")
        i = new element("i", "mt-0 text-base fa fa-times invisible font-bold", [], p.getNode()); i.create()
        //Colony's actions
        d2 = new element("div", "border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode(), "colony-actions"); d2.create()
        p = new element("p", "flex w-100 justify-between p-1 text-gray-500 dark:text-gray-300", [], d2.getNode()); p.create()
        if(!zoneSearched){
            b = new element("button", "text-xs grow p-2 button border border-gray-400 bg-gray-800", [], p.getNode(), "searchZone"); b.create()
            i = new element("i", "fa fa-search me-2", [], b.getNode()); i.create()
            s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent("Search zone")
        } else {
            s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent("No actions available")
        }
    }
    buildColonyAccordion()
    d1 = new element("div", "p-1 border border-gray-200 dark:border-gray-700 dark:bg-gray-700", [], d.getNode()); d1.create()
    buildColonyName()
    buildGeneralStatistics()
    buildVitalResources()  
    buildStock()
    buildActionsAvailable()
}
let addBuilding = (index, type, parentElement) => {
    //Build building 1 - 1 accordion header
    h2 = new element("h2", "notificationUnread", [], parentElement, "accordion-building-1-"+index+"-header"); h2.create()
    b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 font-medium rtl:text-right border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-building-1-"+index+"-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-building-1-"+index+"-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [], b.getNode()); s.create()
    s1 = new element("span", "new bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 hidden rounded-sm dark:bg-blue-900 dark:text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
    s1.create(); s1.appendContent(translate(language, "NEW", "m"))
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, type))
    s1 = new element("span", "font-bold ms-1", [], s.getNode()); s1.create(); s1.appendContent(""+index)
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build building 1 - 1 accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-building-1-"+index+"-header"}], parentElement, "accordion-building-1-"+index+"-body"); d1.create()
    d2 = new element("div", "p-2 border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode()); d2.create()
    //Campaign tent info
    //First line
    p = new element("p", "ms-1 mb-2 text-xs text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Status"))
    p.appendHTML(": ")
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""},{"key":"gender","value":"f"}], p.getNode(), "building-1-"+index+"-status"); s.create(); s.appendContent(translate(language, "Constructed", "m"))
    p.appendHTML(".")
    //Second line
    p = new element("p", "ms-1 mb-2 text-xs text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""},{"key":"gender","value":"f"}], p.getNode()); s.create(); s.appendContent(translate(language, "Constructed in", "m"))
    p.appendHTML(": ")
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Year"))
    s = new element("span", "font-bold ms-1", [], p.getNode(), "building-1-"+index+"-createdYear"); s.create(); s.appendContent("1")
    p.appendHTML(", ")
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Week"))
    s = new element("span", "font-bold ms-1", [], p.getNode(), "building-1-"+index+"-createdWeek"); s.create(); s.appendContent("1")
    p.appendHTML(", ")
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Day"))
    s = new element("span", "font-bold ms-1", [], p.getNode(), "building-1-"+index+"-createdDay"); s.create(); s.appendContent("1")
    p.appendHTML(".")
    //Third line
    p = new element("p", "ms-1 mb-2 text-xs text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Shelter capacity"))
    p.appendHTML(": ")
    s = new element("span", "font-bold", [], p.getNode(), "building-1-"+index+"-capacity"); s.create(); s.appendContent("3")
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "citizens"))
    //Forth line
    p = new element("p", "ms-1 mb-1 text-xs text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "font-bold p-0.5 px-1 rounded bg-red-500 text-white", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Fire hazard"))
}
let accordionBuildings = (update = false) => {
    //Build buildings accordion
    let parentElem = document.getElementById("accordion-menu")
    //Build buildings accordion header
    h2 = new element("h2", "mt-3", [], parentElem, "accordion-menu-buildings"); h2.create()
    b = new element("button", "flex items-center justify-between w-full py-2 px-3 bg-gray-900 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-buildings-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-buildings-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent("Buildings")
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build buildings accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-menu-buildings"}], parentElem, "accordion-menu-buildings-body"); d1.create()
    d2 = new element("div", "py-1 border border-gray-200 dark:border-gray-700 dark:bg-gray-700", [], d1.getNode()); d2.create()
    d = new element("div", "mx-1", [{"key":"data-accordion","value":"collapse"}], d2.getNode(), "accordion-buildings-groups"); d.create()
    //Check if there is no building in the colony
    let noCampaignTents = typeof buildings.shelter == "undefined" || typeof buildings.shelter["campaign tent"] == "undefined" || !buildings.shelter["campaign tent"]
    let noCottages = typeof buildings.shelter == "undefined" || typeof buildings.shelter["cottage"] == "undefined" || !buildings.shelter["cottage"]
    let noHouses = typeof buildings.shelter == "undefined" || typeof buildings.shelter["house"] == "undefined" || !buildings.shelter["house"]
    let noStoneHouses = typeof buildings.shelter == "undefined" || typeof buildings.shelter["stoneHouse"] == "undefined" || !buildings.shelter["stoneHouse"]
    let noManors = typeof buildings.shelter == "undefined" || typeof buildings.shelter["manor"] == "undefined" || !buildings.shelter["manor"]
    let noMansions = typeof buildings.shelter == "undefined" || typeof buildings.shelter["mansion"] == "undefined" || !buildings.shelter["mansion"]
    let noGraveyards = typeof buildings.shelter == "undefined" || typeof buildings.shelter["graveyard"] == "undefined" || !buildings.shelter["graveyard"]
    let noShelters = noCampaignTents && noCottages && noStoneHouses && noHouses && noManors && noMansions && noGraveyards
    let noBuildings = noShelters

    if(!noCampaignTents){
        //Build building group 1 accordion header
        h2 = new element("h2", "notificationUnread", [], d.getNode(), "accordion-building-group-1-header"); h2.create()
        b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 font-medium rtl:text-right border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-building-group-1-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-building-group-1-body"}], h2.getNode())
        b.create()
        s = new element("span", "", [], b.getNode()); s.create()
        s1 = new element("span", "new bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 hidden rounded-sm dark:bg-blue-900 dark:text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
        s1.create(); s1.appendContent("NEW")
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Campaign tents")
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        //Build building group 1 accordion body
        d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-building-group-1-header"}], d.getNode(), "accordion-building-group-1-body"); d1.create()
        d3 = new element("div", "p-1 border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [{"key":"aria-labelledby","value":"accordion-building-group-1-header"}], d1.getNode()); d3.create()
        p = new element("p", "ms-1 mb-2 text-xs text-gray-500 dark:text-gray-200", [], d3.getNode()); p.create()
        s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("Total shelter capacity")
        p.appendHTML(": ")
        s = new element("span", "font-bold", [], p.getNode(), "building-group-1-total-capacity"); s.create(); s.appendContent("15")
        s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("citizens")
        d = new element("div", "", [{"key":"data-accordion","value":"collapse"}], d3.getNode(), "accordion-building-group-1"); d.create()
        for(i=1; i<=buildings.shelter["campaign tent"]; i++) { addBuilding(i, "Campaign tent", d.getNode()) }
    }
    if(noBuildings){
        p = new element("p", "ms-1 mb-1 text-xs text-gray-500 dark:text-red-400", [], d.getNode()); p.create()
        s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("There are no buildings in your colony!")
    }
}
let accordionCitizens = (amount = 10) => {
    let citizenBuilder = (index) => {
        //Build citizen accordion header
        h2 = new element("h2", "notificationUnread", [], d.getNode(), "accordion-citizen-"+index+"-header"); h2.create()
        b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 font-medium rtl:text-right border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-citizen-"+index+"-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-citizen-"+index+"-body"}], h2.getNode())
        b.create()
        s = new element("span", "", [], b.getNode()); s.create()
        s1 = new element("span", "new bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 hidden rounded-sm dark:bg-blue-900 dark:text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
        s1.create(); s1.appendContent("NEW")
        //Add icons to name
        i = new element("i", "hidden me-1", [], s.getNode(), "citizen-"+index+"-gender-icon"); i.create()
        i = new element("i", "hidden me-1", [], s.getNode(), "citizen-"+index+"-age-icon"); i.create()
        i = new element("i", "hidden me-1", [], s.getNode(), "citizen-"+index+"-role-icon"); i.create()
        s1 = new element("span", "hidden rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 me-1", [], s.getNode(), "citizen-"+index+"-xp-icon"); s1.create(); s1.appendContent("0")
        s1 = new element("span", "ms-1", [{"key":"data-i1n","value":""}], s.getNode(), "citizen-"+index+"-name"); s1.create()
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        //Build citizen 1 accordion body
        d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-citizen-"+index+"-header"}], d.getNode(), "accordion-citizen-"+index+"-body"); d1.create()
        //Citizen's description
        d2 = new element("div", "p-1 border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode()); d2.create()
        p = new element("p", "ms-1 text-xs text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
        s = new element("span", "", [], p.getNode(), "citizen-"+index+"-description"); s.create()
        //Citizen's properties title
        d2 = new element("div", "border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode()); d2.create()
        p = new element("p", "p-1 ps-2 text-xs text-gray-200 bg-gray-700", [], d2.getNode()); p.create()
        s = new element("span", "text-xs text-gray-500 dark:text-gray-200", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent("Properties")
        //Citizen's properties
        d2 = new element("div", "citizen-properties p-1 border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [{"key":"data-index", "value":index}], d1.getNode(), "citizen-"+index+"-properties"); d2.create()
        //First line
        p = new element("p", "mx-1 flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        //Citizen's gender
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent("Gender")
        s.appendHTML(": ")
        s1 = new element("span", "font-bold", [{"key":"data-i18n", "value":""}], s.getNode(), "citizen-"+index+"-gender"); s1.create(); s1.appendContent(index<=5 ? "Femenine" : "Masculine")
        s.appendHTML(".")
        //Citizen's status
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent("Status")
        s.appendHTML(": ")
        s1 = new element("span", "font-bold", [{"key":"data-i18n", "value":""},{"key":"data-status", "value":"idle"}], s.getNode(), "citizen-"+index+"-status"); s1.create(); s1.appendContent("Idle")
        s.appendHTML(".")
        //Second line
        p = new element("p", "mx-1 flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        //Citizen's birthweek
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent("Birth week")
        s.appendHTML(": ")
        s1 = new element("span", "font-bold", [], s.getNode(), "citizen-"+index+"-birthWeek"); s1.create();
        s.appendHTML(".")
        //Citizen's age
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent("Age")
        s.appendHTML(": ")
        s1 = new element("span", "font-bold", [], s.getNode(), "citizen-"+index+"-ageYears"); s1.create()
        s1 = new element("span", "ms-1", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent("years")
        s.appendHTML(", ")
        s1 = new element("span", "font-bold", [], s.getNode(), "citizen-"+index+"-ageWeeks"); s1.create()
        s1 = new element("span", "ms-1", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent("weeks")
        //Third line
        p = new element("p", "mx-1 flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        //Citizen's role
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent("Role")
        s.appendHTML(": ")
        s1 = new element("span", "font-bold", [{"key":"data-i18n", "value":""}], s.getNode(), "citizen-"+index+"-role"); s1.create(); s1.appendContent("Unassigned")
        s.appendHTML(".")
        //Citizen's experience
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent("Experience")
        s.appendHTML(": ")
        s1 = new element("span", "font-bold", [], s.getNode(), "citizen-"+index+"-xp"); s1.create(); s1.appendContent("0")
        s.appendHTML(".")
        //Forth line
        p = new element("p", "mx-1 flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        //Citizen's left hand
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent("Left hand")
        s.appendHTML(": ")
        s1 = new element("span", "font-bold", [{"key":"data-i18n", "value":""},{"key":"gender", "value":"f"}], s.getNode(), "citizen-"+index+"-leftHand"); s1.create(); s1.appendContent("Empty")
        s.appendHTML(".")
        //Citizen's right hand
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent("Right hand")
        s.appendHTML(": ")
        s1 = new element("span", "font-bold", [{"key":"data-i18n", "value":""},{"key":"gender", "value":"f"}], s.getNode(), "citizen-"+index+"-rightHand"); s1.create(); s1.appendContent("Empty")
        s.appendHTML(".")
        //Fifth line
        p = new element("p", "mx-1 flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
         //Citizen's outfit
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent("Outfit")
        s.appendHTML(": ")
        s1 = new element("span", "font-bold", [{"key":"data-i18n", "value":""}], s.getNode(), "citizen-"+index+"-outfit"); s1.create(); s1.appendContent("No")
        s.appendHTML(".")
         //Citizen's fertility
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent("Fertility")
        s.appendHTML(": ")
        s1 = new element("span", "font-bold", [], s.getNode(), "citizen-"+index+"-fertility"); s1.create()
        s.appendHTML(".")
        //Citizen's actions title
        d2 = new element("div", "border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode(), "citizen-"+index+"-actions-title"); d2.create()
        p = new element("p", "flex justify-between p-1 ps-2 text-xs text-gray-200 bg-gray-700", [], d2.getNode()); p.create()
        s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent("Actions available")
        i = new element("i", "mt-0 text-base fa fa-times invisible font-bold", [], p.getNode()); i.create()
        //Citizen's actions
        d2 = new element("div", "border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode(), "citizen-"+index+"-actions"); d2.create()
        p = new element("p", "flex w-100 justify-between p-1 text-gray-500 dark:text-gray-400", [], d2.getNode()); p.create()
        b = new element("button", "text-xs grow p-2 me-1 button border border-gray-400 bg-gray-800", [], p.getNode(), "searchCouple-"+index); b.create()
        i = new element("i", "fa fa-venus-mars me-2", [], b.getNode()); i.create()
        s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent("Search a couple")
        b = new element("button", "assignRole text-xs grow p-2 me-1 button border border-gray-400 bg-gray-800", [], p.getNode(), "assignRole-"+index); b.create()
        i = new element("i", "fa fa-handshake-simple me-2", [], b.getNode()); i.create()
        s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent("Assign a role")
    }
    //Build citizens accordion
    let parentElem = document.getElementById("accordion-menu")
    //Build citizens accordion header
    h2 = new element("h2", "mt-3", [], parentElem, "accordion-menu-citizens"); h2.create()
    b = new element("button", "flex items-center justify-between w-full py-2 px-3 bg-gray-900 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-citizens-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-citizens-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent("Citizens")
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build citizens accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-menu-citizens"}], parentElem, "accordion-menu-citizens-body"); d1.create()
    d2 = new element("div", "py-1 border border-gray-200 dark:border-gray-700 dark:bg-gray-700", [], d1.getNode()); d2.create()
    d = new element("div", "mx-1", [{"key":"data-accordion","value":"collapse"}], d2.getNode(), "accordion-citizens"); d.create()
    for(let i = 1; i<=amount; i++){
        citizenBuilder(i)
    }
}
let accordionLandforms = () => {
    //Build landforms accordion
    let parentElem = document.getElementById("accordion-menu")
    //Build landforms accordion header
    h2 = new element("h2", "mt-3", [], parentElem, "accordion-menu-landform"); h2.create()
    b = new element("button", "flex items-center justify-between w-full py-2 px-3 bg-gray-900 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-landform-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-landform-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent("Landform")
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build landforms accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-menu-landform"}], parentElem, "accordion-menu-landform-body"); d1.create()
    d2 = new element("div", "py-1 border border-gray-200 dark:border-gray-700 dark:bg-gray-700", [], d1.getNode(), "accordion-landform-1-header"); d2.create()
    d = new element("div", "mx-1", [{"key":"data-accordion","value":"collapse"}], d2.getNode(), "accordion-landforms"); d.create()
    //Build landform 1 accordion header
    h2 = new element("h2", "notificationUnread", [], d.getNode(), "accordion-landform-1-header"); h2.create()
    b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 font-medium rtl:text-right border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-landform-1-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-landform-1-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [], b.getNode()); s.create()
    s1 = new element("span", "new bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 hidden rounded-sm dark:bg-blue-900 dark:text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
    s1.create(); s1.appendContent("NEW")
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Water reservoir")
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build landform 1 accordion body
    d1 = new element("div", "waterReservoir hidden", [{"key":"aria-labelledby","value":"accordion-landform-1-header"}], d.getNode(), "accordion-landform-1-body")
    d1.create()
    //Build water reservoir info
    //First column
    d2 = new element("div", "p-2 px-3 border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode(), "landform-1-info")
    d2.create();
    p = new element("p", "text-xs flex justify-between text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "", [], p.getNode()); s.create()
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Type")
    sp = new element("span", "", [], s.getNode()); sp.create(); sp.appendContent(": ")
    s1 = new element("span", "font-bold", [{"key":"data-i18n","value":""}], s.getNode(), "landform-1-type"); s1.create()
    s1.appendContent(colonyWaterReservoir)
    //Second column
    s = new element("span", "", [], p.getNode()); s.create();
    s1 = new element("span", "", [{"key":"data-i18n","value":""},{"key":"gender","value":"M"}], s.getNode()); s1.create(); s1.appendContent("Discovered in")
    sp = new element("span", "", [], s.getNode()); sp.create(); sp.appendContent(": ")
    s1 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Year")
    s1 = new element("span", "me-1 font-bold", [], s.getNode(), "landform-1-createdYear"); s1.create(); s1.appendContent("1")
    s1 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Week")
    s1 = new element("span", "me-1 font-bold", [], s.getNode(), "landform-1-createdWeek"); s1.create(); s1.appendContent("1")
    s1 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Day")
    s1 = new element("span", "me-1 font-bold", [], s.getNode(), "landform-1-createdDay"); s1.create(); s1.appendContent("1")

    p = new element("p", "text-xs flex justify-between text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "", [], p.getNode()); s.create()
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Daily water income")
    sp = new element("span", "", [], s.getNode()); sp.create(); sp.appendContent(": ")
    s1 = new element("span", "font-bold", [{"key":"data-i18n","value":""}], s.getNode(), "landform-1-water-income"); s1.create()
    s1.appendContent(waterReservoirs[colonyWaterReservoir]["daily-water-income"])
    s1 = new element("span", "ms-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("per water bearer")
    p = new element("p", "text-xs flex justify-between text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "", [], p.getNode()); s.create();
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Daily food income")
    sp = new element("span", "", [], s.getNode()); sp.create(); sp.appendContent(": ")
    s1 = new element("span", "font-bold", [{"key":"data-i18n","value":""}], s.getNode(), "landform-1-food-income"); s1.create()
    s1.appendContent(waterReservoirs[colonyWaterReservoir]["daily-food-income"])
    s1 = new element("span", "ms-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("per fisherman")

    //Build Assigned Workers title
    d2 = new element("div", "border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode(), "landform-1-assigned-title")
    d2.create();
    p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200 bg-gray-700", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("Assigned workers")
    //Build Assigned Workers area
    d2 = new element("div", "assignedWorkers p-2 ps-3 border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode(), "landform-1-assigned")
    d2.create();
    p = new element("p", "empty text-xs flex justify-between text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "", [], p.getNode()); s.create()
    i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("No workers assigned")

    //Build Available Workers title
    d2 = new element("div", "border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode(), "landform-1-available-title")
    d2.create();
    p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200 bg-gray-700", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("Available workers")
    //Build Available Workers area
    d2 = new element("div", "availableWorkers p-2 border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode(), "landform-1-available"); d2.create()
    p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "", [], p.getNode()); s.create()
    i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("No workers available")
}
let accordionExpeditions = () => {
    let d
    let buildActionsAvailable = () => {
        //Actions available
        d1 = new element("div", "border border-gray-300 dark:border-gray-800 dark:bg-gray-500 text-xs", [], d.getNode(), "expeditions-actions-title"); d1.create()
        p = new element("p", "flex justify-between p-1 ps-2 text-xs text-gray-200 bg-gray-800", [], d1.getNode()); p.create()
        s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent("Actions available")
        i = new element("i", "mt-0 text-base fa fa-times invisible font-bold", [], p.getNode()); i.create()
        //Expeditions actions
        d1 = new element("div", "border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d.getNode(), "expeditions-actions"); d1.create()
        p = new element("p", "flex w-100 justify-between p-1 text-gray-500 dark:text-gray-300", [], d1.getNode()); p.create()
        b = new element("button", "text-xs grow p-2 button border border-gray-400 bg-gray-800", [], p.getNode(), "newExpedition"); b.create()
        i = new element("i", "fa fa-plus me-2", [], b.getNode()); i.create()
        s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent("New expedition")
        b.getNode().addEventListener("click", function(e){
            let objectData = {"language": language, "parentId": "#expeditions"}
            //Build assign role panel
            let newExpeditionPanel = new panel("newExpedition", objectData, "expeditions", false, "actions")
            newExpeditionPanel.hidePreviousOptions()
            newExpeditionPanel.buildPanel()
        })
    }
    //Build expeditions accordion
    let parentElem = document.getElementById("accordion-menu")
    //Build expeditions accordion header
    h2 = new element("h2", "mt-3", [], parentElem, "accordion-menu-expeditions"); h2.create()
    b = new element("button", "flex items-center justify-between w-full py-2 px-3 bg-gray-900 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-expeditions-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-expeditions-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent("Expeditions")
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build expeditions accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-menu-expeditions"}], parentElem, "accordion-menu-expeditions-body"); d1.create()
    d2 = new element("div", "py-1 border border-gray-200 dark:border-gray-700 dark:bg-gray-700", [], d1.getNode()); d2.create()
    d = new element("div", "mx-1", [{"key":"data-accordion","value":"collapse"}], d2.getNode(), "expeditions"); d.create()

    //Build Active expeditions title
    d1 = new element("div", "border border-gray-300 dark:border-gray-800 dark:bg-gray-800 text-xs", [], d.getNode(), "active-expeditions-title")
    d1.create();
    p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200", [], d1.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("Active expeditions")
    //Build Active expeditions area
    d1 = new element("div", "activeExpeditions p-2 ps-3 mb-2 border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d.getNode(), "active-expeditions-area")
    d1.create();
    p = new element("p", "empty text-xs flex justify-between text-gray-500 dark:text-gray-200", [], d1.getNode()); p.create()
    s = new element("span", "", [], p.getNode()); s.create()
    i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
    s1 = new element("span", "", [{"key":"data-i18n","value":""},{"key":"gender","value":"f"}], s.getNode()); s1.create(); s1.appendContent("None")

    buildActionsAvailable()
}
//Build modal popup
let modalPopup = (modalTitle, modalType) => {
    let parent = document.getElementById("modalBody")
    parent.innerHTML = ""
    let popupCannotChangeRole = () => {
        p = new element("p", "text-base py-2 text-gray-500 dark:text-gray-400", [{"key":"data-i18n","value":""}], parent)
        p.create(); p.appendContent(translate(language, "You cannot change this citizen's role because his or her status is not \"idle\"."))
        p.create(); p.appendContent(translate(language, "Please, first deassign him or her from his or her current duty."))
        document.getElementById("modalFooterButton1").innerText = translate(language, "Ok")
    }
    let popupZoneSearched = () => {
        p = new element("p", "text-base py-2 text-gray-500 dark:text-gray-400", [{"key":"data-i18n","value":""}], parent)
        p.create(); p.appendContent(translate(language, "Your citizens have already searched all the zone and they discovered many new things."))
        p = new element("p", "text-base py-2 text-gray-500 dark:text-gray-400", [{"key":"data-i18n","value":""}], parent)
        p.create(); p.appendContent(translate(language, "Please, read the notification you received in your News panel to check the report of your citizen's research."))
        document.getElementById("modalFooterButton1").innerText = translate(language, "Ok")
    }
    //Build modal pop up structure
    document.getElementById("modalTitle").innerHTML = translate(language, modalTitle)
    //Build popup body
    if(modalType == "ZoneSearched"){ popupZoneSearched() }
    if(modalType == "RoleCitizenBusy"){ popupCannotChangeRole() }
}

//Enable accordion events
let enableAccordions = (accordionId) => {
    document.querySelectorAll(accordionId).forEach(button => {
        button.addEventListener('click', function() {
        const target = document.querySelector(this.getAttribute('data-accordion-target'));
        if (target.classList.contains('hidden')) {
            target.classList.remove('hidden');
            this.setAttribute('aria-expanded', 'true');
            this.children[1].classList.remove("rotate-180")
            this.classList.remove("text-gray-500", "dark:text-gray-400")
            this.classList.add("bg-gray-100", "dark:bg-gray-800", "text-gray-900", "dark:text-white")
        } else {
            target.classList.add('hidden');
            this.setAttribute('aria-expanded', 'false');
            this.children[1].classList.add("rotate-180")
            this.classList.remove("bg-gray-100", "dark:bg-gray-800", "text-gray-900", "dark:text-white")
            this.classList.add("text-gray-500", "dark:text-gray-400")
          }
        });
    });
}
let enableNotificationEvents = () => {
    let notificationHandler = (e) => {
        e.target.closest("h2").removeEventListener('click', notificationHandler)
        //Remove notification unread class and icon
        e.target.closest("h2").classList.remove("notificationUnread")
        if(e.target.type == "button" && e.target.querySelector(".new:first-of-type")){
            e.target.querySelector(".new:first-of-type").remove()
        } else if(e.target.parentElement.querySelector(".new:first-of-type")){
            e.target.parentElement.querySelector(".new:first-of-type").remove()
        }
        //Check if there is no notification siblings and then remove parent notification.
        document.querySelector("#newsNotifications").innerText = document.querySelectorAll("#accordion-news .notificationUnread").length
        document.querySelector("#newsNotifications").hidden = (document.querySelector("#newsNotifications").innerText == "0")
    }
    document.querySelectorAll(".notificationUnread").forEach((value, key) => {
        value.removeEventListener('click', notificationHandler)
    })
    document.querySelectorAll(".notificationUnread").forEach((value, key) => {
        value.addEventListener('click', notificationHandler)
    })
}
let addNews = () => {
    let d = document.querySelector("#accordion-news")
    let newsNbr = document.getElementById("accordion-news").children.length + 1
    //Build notification 1 accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-news-"+newsNbr+"-header"}], d, "accordion-news-"+newsNbr+"-body")
    d1.create(first = true)
    //Build notification 1 accordion header
    h2 = new element("h2", "notificationUnread", [], d, "accordion-news-"+newsNbr+"-header"); h2.create(first = true)
    b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 font-medium rtl:text-right border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-news-"+newsNbr+"-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-news-"+newsNbr+"-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [], b.getNode()); s.create()
    s1 = new element("span", "new bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300 me-3", [{"key":"gender","value":"f"}, {"key":"data-i18n","value":""}], s.getNode())
    s1.create(); s1.appendContent(translate(language, "NEW", "f"))
    s1 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Year", "", "capitalized"))
    s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(document.getElementById("currentYear").innerText)
    s.appendHTML(", ")
    s1 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Week", "", "capitalized"))
    s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(document.getElementById("currentWeek").innerText)
    s.appendHTML(", ")
    s1 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Day", "", "capitalized"))
    s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(document.getElementById("currentDay").innerText)
    s.appendHTML(" (")
    s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(document.getElementById("currentHour").innerText)
    s1 = new element("span", "ms-1", [], s.getNode()); s1.create(); s1.appendContent("hs.)")
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build notification 1 accordion body
    d2 = new element("div", "p-2 border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [], d1.getNode()); d2.create()
    p = new element("p", "mb-2 text-gray-500 dark:text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent(translate(language, "Your colony sourroundings have been fully searched!"))
    p = new element("p", "mb-2 text-gray-500 dark:text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent(translate(language, "Your citizens have succesfully discovered the following things:"))
    p = new element("p", "mb-2 text-gray-500 dark:text-gray-200", [], d2.getNode()); p.create()
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((buildings.shelter["campaign tent"]).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "campaign tents", "", "lowercase"))
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock.resources.stone).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "stone"))
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock.resources.gravel).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "gravel"))
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock.resources.clay).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "clay"))
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock.products.brick).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "brick"))
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock.products.hay - wagonGoods.products.hay * 3).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "hay"))
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock.products.rag - wagonGoods.products.rag * 3).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "rag"))
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock.products["wooden plank"]).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "wooden plank"))
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock.products["wooden plate"]).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "wooden plate"))
    li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
    s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock.products["roof tile"]).toString())
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "roof tile"))
    p = new element("p", "mb-2 text-gray-500 dark:text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent(translate(language, "Check the stock in the Colony panel to see your current goods."))
    document.querySelector("#newsNotifications").innerText++
    document.querySelector("#newsNotifications").hidden = false
    enableNotificationEvents()
}
let updateStock = () => {
    //Update resources
    let count = 0
    let parentElement = document.getElementById("resources-stock")
    Object.keys(stock.resources).forEach((resource) => {
        formatedResource = resource.replaceAll(" ", "")
        if(resource.toLowerCase() != "food"){
            //Resource already shown?
            if(document.getElementById("colony-"+formatedResource+"-stock") != null){
                document.getElementById("colony-"+formatedResource+"-stock").innerText = stock.resources[resource].toString()
            } else {
                //Add dom node as last sibling
                p = new element("p", "resourceStock pb-0 text-xs text-gray-500 dark:text-gray-400", [], parentElement); p.create()
                s = new element("span", "flex", [], p.getNode()); s.create()
                s1 = new element("span", "ps-2 flex-none bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
                s2 = new element("span", "capitalize", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(translate(language, resource))
                s1.appendHTML(": ")
                s1 = new element("span", "grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
                s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-"+formatedResource+"-stock"); s2.create(); s2.appendContent(stock.resources[resource].toString())
                s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("units")
            }
        }
    })
    parentElement = document.getElementById("products-stock")
    //Update products
    Object.keys(stock.products).forEach((product) => {
        formatedProduct = product.replaceAll(" ", "")
        //Product already shown?
        if(document.getElementById("colony-"+formatedProduct+"-stock") != null){
            document.getElementById("colony-"+formatedProduct+"-stock").innerText = stock.products[product].toString()
        } else {
            p = new element("p", "productStock pb-0 text-xs text-gray-500 dark:text-gray-400", [], d4.getNode()); p.create()
            s = new element("span", "flex", [], p.getNode()); s.create()
            s1 = new element("span", "ps-2 flex-none bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
            s2 = new element("span", "capitalize", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(translate(language, product))
            s1.appendHTML(": ")
            formatedProduct = product.replaceAll(" ", "")
            s1 = new element("span", "grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
            s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-"+formatedProduct+"-stock"); s2.create(); s2.appendContent(stock.products[product].toString())
            s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("units")
        }
    })
}
//Update accordions structure
let updateColony = (event = "zoneSearched") => {
    //Check for new buildings
    //Check if there is no building in the colony
    let noCampaignTents = typeof buildings.shelter == "undefined" || typeof buildings.shelter["campaign tent"] == "undefined" || !buildings.shelter["campaign tent"]
    let noCottages = typeof buildings.shelter == "undefined" || typeof buildings.shelter["cottage"] == "undefined" || !buildings.shelter["cottage"]
    let noHouses = typeof buildings.shelter == "undefined" || typeof buildings.shelter["house"] == "undefined" || !buildings.shelter["house"]
    let noStoneHouses = typeof buildings.shelter == "undefined" || typeof buildings.shelter["stoneHouse"] == "undefined" || !buildings.shelter["stoneHouse"]
    let noManors = typeof buildings.shelter == "undefined" || typeof buildings.shelter["manor"] == "undefined" || !buildings.shelter["manor"]
    let noMansions = typeof buildings.shelter == "undefined" || typeof buildings.shelter["mansion"] == "undefined" || !buildings.shelter["mansion"]
    let noGraveyards = typeof buildings.shelter == "undefined" || typeof buildings.shelter["graveyard"] == "undefined" || !buildings.shelter["graveyard"]
    let noShelters = noCampaignTents && noCottages && noStoneHouses && noHouses && noManors && noMansions && noGraveyards
    let noBuildings = noShelters
    if(!noBuildings){
        //Remove all buildings from panel
        document.querySelector("#accordion-buildings-groups *").remove()
        //Add existing buildings groups
        let parentElem = document.querySelector("#accordion-buildings-groups")
        if(!noCampaignTents){
            //Build building group 1 accordion header
            h2 = new element("h2", "notificationUnread", [], parentElem, "accordion-building-group-1-header"); h2.create()
            b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 font-medium rtl:text-right border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-building-group-1-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-building-group-1-body"}], h2.getNode())
            b.create()
            s = new element("span", "", [], b.getNode()); s.create()
            s1 = new element("span", "new bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 hidden rounded-sm dark:bg-blue-900 dark:text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
            s1.create(); s1.appendContent("NEW")
            s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Campaign tents"))
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            //Build building group 1 accordion body
            d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-building-group-1-header"}], parentElem, "accordion-building-group-1-body"); d1.create()
            d3 = new element("div", "p-1 border border-gray-300 dark:border-gray-800 dark:bg-gray-600 text-xs", [{"key":"aria-labelledby","value":"accordion-building-group-1-header"}], d1.getNode()); d3.create()
            p = new element("p", "ms-1 mb-2 text-xs text-gray-500 dark:text-gray-200", [], d3.getNode()); p.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Total shelter capacity"))
            p.appendHTML(": ")
            s = new element("span", "font-bold", [], p.getNode(), "building-group-1-total-capacity"); s.create(); s.appendContent("15")
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "citizens"))
            d = new element("div", "", [{"key":"data-accordion","value":"collapse"}], d3.getNode(), "accordion-building-group-1"); d.create()
            for(i=1; i<=buildings.shelter["campaign tent"]; i++) { addBuilding(i, "Campaign tent", d.getNode()) }
            enableAccordions('#accordion-buildings-groups [data-accordion-target]')
        }
    }
    if(event == "zoneSearched"){
        //Add notification about zone searched
        addNews()
        enableAccordions('#accordion-news [data-accordion-target]')
        updateStock()
    }
}
//Change all panels in which the role and citizen were involved
let postconditionsChangingRole = (previousRole, citizenIndex) => {
    document.querySelectorAll(".availableWorkers > h2").forEach((value) => {
        currentCitizenId = value.id.split("-")[2]
        //Check if citizen is available in a water reservoir.
        if(currentCitizenId == citizenIndex){
            availableWorkersDiv = value.parentElement
            //Remove citizen from available workers list
            value.remove()
            //If no more available workers, then show "no available workers" text
            if(!availableWorkersDiv.children.length){
                p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-500 dark:text-gray-200", [], availableWorkersDiv); p.create()
                s = new element("span", "", [], p.getNode()); s.create()
                i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No workers available"))
            }
        }
    })
}
//For any new expedition: Add available worker (expeditionary)
let addAvailableWorkerToExpedition = (citizenIndex, newExpeditionClass) => {
    let parentElem = document.querySelector("."+newExpeditionClass+" .availableWorkers")
    //Remove "no available workers" text, if exists
    if(document.querySelector("."+newExpeditionClass+" .availableWorkers .empty")!=null){
        document.querySelector("."+newExpeditionClass+" .availableWorkers .empty").remove()
    }
    h2 = new element("h2", "", [], parentElem, "available-citizen-"+citizenIndex); h2.create()
    d = new element("div", "flex items-center justify-between w-full py-2 px-2 text-xs text-gray-400 bg-gray-900 font-medium rtl:text-right border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 gap-3 text-gray-500 dark:text-gray-400", [], h2.getNode())
    d.create()
    s = new element("span", "", [], d.getNode()); s.create()
    //Gender citizen icon
    i = new element("i", document.getElementById("citizen-"+citizenIndex+"-gender-icon").classList.toString(), [], s.getNode(), "citizen-"+citizenIndex+"-gender-icon"); i.create()
    //Age citizen icon
    i = new element("i", document.getElementById("citizen-"+citizenIndex+"-age-icon").classList.toString(), [], s.getNode(), "citizen-"+citizenIndex+"-age-icon"); i.create()
    //Role citizen icon
    i = new element("i", document.getElementById("citizen-"+citizenIndex+"-role-icon").classList.toString(), [], s.getNode(), "citizen-"+citizenIndex+"-role-icon"); i.create()
    //XP citizen icon
    let citizenXP = document.getElementById("citizen-"+citizenIndex+"-xp-icon").innerText
    s1 = new element("span", "rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 me-1", [], s.getNode(), "citizen-"+citizenIndex+"-xp-icon"); s1.create(); s1.appendContent(citizenXP)
    //Citizen full name
    let citizenName = document.getElementById("citizen-"+citizenIndex+"-name").innerText
    s1 = new element("span", "ms-1", [], s.getNode(), "citizen-"+citizenIndex+"-name"); s1.create(); s1.appendContent(citizenName)
    s = new element("span", "", [], d.getNode()); s.create()
    //View citizen info
    i = new element("i", "fa fa-eye me-2", [], s.getNode(), "citizen-"+citizenIndex+"-view-info"); i.create()
    //Assign citizen as worker
    i = new element("i", "text-sm fa fa-plus", [], s.getNode(), "citizen-"+citizenIndex+"-assign"); i.create()
}
//For any mount discovered: Add available worker
let addAvailableWorkerToMount = (citizenIndex, mountClass) => {
    let parentElem = document.querySelector("."+mountClass+" .availableWorkers")
    //Remove "no available workers" text, if exists
    if(document.querySelector("."+mountClass+" .availableWorkers .empty")!=null){
        document.querySelector("."+mountClass+" .availableWorkers .empty").remove()
    }
    h2 = new element("h2", "", [], parentElem, "available-citizen-"+citizenIndex); h2.create()
    d = new element("div", "flex items-center justify-between w-full py-2 px-2 text-xs text-gray-400 bg-gray-900 font-medium rtl:text-right border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 gap-3 text-gray-500 dark:text-gray-400", [], h2.getNode())
    d.create()
    s = new element("span", "", [], d.getNode()); s.create()
    //Gender citizen icon
    i = new element("i", document.getElementById("citizen-"+citizenIndex+"-gender-icon").classList.toString(), [], s.getNode(), "citizen-"+citizenIndex+"-gender-icon"); i.create()
    //Age citizen icon
    i = new element("i", document.getElementById("citizen-"+citizenIndex+"-age-icon").classList.toString(), [], s.getNode(), "citizen-"+citizenIndex+"-age-icon"); i.create()
    //Role citizen icon
    i = new element("i", document.getElementById("citizen-"+citizenIndex+"-role-icon").classList.toString(), [], s.getNode(), "citizen-"+citizenIndex+"-role-icon"); i.create()
    //XP citizen icon
    let citizenXP = document.getElementById("citizen-"+citizenIndex+"-xp-icon").innerText
    s1 = new element("span", "rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 me-1", [], s.getNode(), "citizen-"+citizenIndex+"-xp-icon"); s1.create(); s1.appendContent(citizenXP)
    //Citizen full name
    let citizenName = document.getElementById("citizen-"+citizenIndex+"-name").innerText
    s1 = new element("span", "ms-1", [], s.getNode(), "citizen-"+citizenIndex+"-name"); s1.create(); s1.appendContent(citizenName)
    s = new element("span", "", [], d.getNode()); s.create()
    //View citizen info
    i = new element("i", "fa fa-eye me-2", [], s.getNode(), "citizen-"+citizenIndex+"-view-info"); i.create()
    //Assign citizen as worker
    i = new element("i", "text-sm fa fa-plus", [], s.getNode(), "citizen-"+citizenIndex+"-assign"); i.create()
}
//For certain new expedition: Add assigned worker (expeditionary)
let addAssignedWorkerToExpedition = (citizenIndex, newExpeditionClass) => {
    let parentAssigned = document.querySelector("."+newExpeditionClass+" .assignedWorkers")
    let parentAvailable = document.querySelector("."+newExpeditionClass+" .availableWorkers")
    //Remove "no assigned workers" text, if exists
    if(document.querySelector("."+newExpeditionClass+" .assignedWorkers .empty")!=null){
        document.querySelector("."+newExpeditionClass+" .assignedWorkers .empty").remove()
    }
    //Assign citizen to "Assigned workers" panel.
    parentAssigned.appendChild(document.getElementById("available-citizen-"+citizenIndex))
    document.getElementById("available-citizen-"+citizenIndex).id = "assigned-citizen-"+citizenIndex
    //Change assign icon, put instead deassign icon
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.remove("fa-plus")
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.add("fa-minus")
    //Change citizen status.
    document.querySelectorAll("#citizen-"+citizenIndex+"-status").forEach((status) => {
        status.innerText = translate(language, "Assigned")
        status.setAttribute("data-status", "assigned")
    })
    //If no more available workers, then show "no available workers" text
    if(!parentAvailable.children.length){
        p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-500 dark:text-gray-200", [], parentAvailable); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No workers available"))
    }
}
//For certain mount discovered: Add assigned worker
let addAssignedWorkerToMount = (citizenIndex, mountClass) => {
    let parentAssigned = document.querySelector("."+mountClass+" .assignedWorkers")
    let parentAvailable = document.querySelector("."+mountClass+" .availableWorkers")
    //Remove "no assigned workers" text, if exists
    if(document.querySelector("."+mountClass+" .assignedWorkers .empty")!=null){
        document.querySelector("."+mountClass+" .assignedWorkers .empty").remove()
    }
    //Assign citizen to "Assigned workers" panel.
    parentAssigned.appendChild(document.getElementById("available-citizen-"+citizenIndex))
    document.getElementById("available-citizen-"+citizenIndex).id = "assigned-citizen-"+citizenIndex
    //Change assign icon, put instead deassign icon
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.remove("fa-plus")
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.add("fa-minus")
    //Change citizen status.
    document.querySelectorAll("#citizen-"+citizenIndex+"-status").forEach((status) => {
        status.innerText = translate(language, lifeStarted ? "Working" : "Assigned")
        status.setAttribute("data-status", lifeStarted ? "working" : "assigned")
    })
    let citizenRoleKey = document.getElementById("citizen-"+citizenIndex+"-role").getAttribute("data-role")
    if(mountClass == "waterReservoir"){
        if(citizenRoleKey == "waterbearing"){
            //Add water income to Colony panel
            document.getElementById("colony-water-income").innerHTML = document.getElementById("colony-water-income").innerHTML*1 + waterReservoirs[colonyWaterReservoir]["daily-water-income"]*1
            let waterRevenue = document.getElementById("colony-water-income").innerHTML*1 - document.getElementById("colony-water-consumption").innerHTML*1
            document.getElementById("water-revenue").innerHTML = (waterRevenue ? "+" : "")+waterRevenue
        }
        if(citizenRoleKey == "fishing"){
            //Add water income to Colony panel
            document.getElementById("colony-food-income").innerHTML = document.getElementById("colony-food-income").innerHTML*1 + waterReservoirs[colonyWaterReservoir]["daily-food-income"]*1
            let waterRevenue = document.getElementById("colony-food-income").innerHTML*1 - document.getElementById("colony-food-consumption").innerHTML*1
            document.getElementById("food-revenue").innerHTML = (waterRevenue ? "+" : "")+waterRevenue
        }
    }
    //If no more available workers, then show "no available workers" text
    if(!parentAvailable.children.length){
        p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-500 dark:text-gray-200", [], parentAvailable); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No workers available"))
    }
}
//For certain new expedition: Remove (Deassign) assigned worker
let deassignWorkerToExpedition = (citizenIndex, newExpeditionClass) => {
    let parentAssigned = document.querySelector("."+newExpeditionClass+" .assignedWorkers")
    let parentAvailable = document.querySelector("."+newExpeditionClass+" .availableWorkers")
    //Remove "no available workers" text, if exists
    if(document.querySelector("."+newExpeditionClass+" .availableWorkers .empty")!=null){
        document.querySelector("."+newExpeditionClass+" .availableWorkers .empty").remove()
    }
    //Assign citizen to "Assigned workers" panel.
    parentAvailable.appendChild(document.getElementById("assigned-citizen-"+citizenIndex))
    document.getElementById("assigned-citizen-"+citizenIndex).id = "available-citizen-"+citizenIndex
    //Change assign icon, put instead deassign icon
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.remove("fa-minus")
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.add("fa-plus")
    //Change citizen status.
    document.querySelectorAll("#citizen-"+citizenIndex+"-status").forEach((status) => {
        status.innerText = translate(language, "Idle")
        status.setAttribute("data-status", "idle")
    })
    //If no available workers, then show "no available workers" text
    if(!parentAssigned.children.length){
        p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-500 dark:text-gray-200", [], parentAssigned); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No workers assigned"))
    }
}
//For certain mount discovered: Remove (Deassign) assigned worker
let deassignWorkerToMount = (citizenIndex, mountClass) => {
    let parentAssigned = document.querySelector("."+mountClass+" .assignedWorkers")
    let parentAvailable = document.querySelector("."+mountClass+" .availableWorkers")
    //Remove "no available workers" text, if exists
    if(document.querySelector("."+mountClass+" .availableWorkers .empty")!=null){
        document.querySelector("."+mountClass+" .availableWorkers .empty").remove()
    }
    //Assign citizen to "Assigned workers" panel.
    parentAvailable.appendChild(document.getElementById("assigned-citizen-"+citizenIndex))
    document.getElementById("assigned-citizen-"+citizenIndex).id = "available-citizen-"+citizenIndex
    //Change assign icon, put instead deassign icon
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.remove("fa-minus")
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.add("fa-plus")
    //Change citizen status.
    document.querySelectorAll("#citizen-"+citizenIndex+"-status").forEach((status) => {
        status.innerText = translate(language, "Idle")
        status.setAttribute("data-status", "idle")
    })
    let citizenRoleKey = document.getElementById("citizen-"+citizenIndex+"-role").getAttribute("data-role")
    if(mountClass == "waterReservoir"){
        if(citizenRoleKey == "waterbearing"){
            //Add water income to Colony panel
            document.getElementById("colony-water-income").innerHTML = document.getElementById("colony-water-income").innerHTML*1 - waterReservoirs[colonyWaterReservoir]["daily-water-income"]*1
            let waterRevenue = document.getElementById("colony-water-income").innerHTML*1 - document.getElementById("colony-water-consumption").innerHTML*1
            document.getElementById("water-revenue").innerHTML = (waterRevenue ? "+" : "")+waterRevenue
        }
        if(citizenRoleKey == "fishing"){
            //Add water income to Colony panel
            document.getElementById("colony-food-income").innerHTML = document.getElementById("colony-food-income").innerHTML*1 - waterReservoirs[colonyWaterReservoir]["daily-food-income"]*1
            let waterRevenue = document.getElementById("colony-food-income").innerHTML*1 - document.getElementById("colony-food-consumption").innerHTML*1
            document.getElementById("food-revenue").innerHTML = (waterRevenue ? "+" : "")+waterRevenue
        }
    }
    //If no available workers, then show "no available workers" text
    if(!parentAssigned.children.length){
        p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-500 dark:text-gray-200", [], parentAssigned); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No workers assigned"))
    }
}