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
const accordion_news = () => {
    //Build news accordion
    let parentElem = document.getElementById("accordion-menu")
    //Build news accordion header
    h2 = new element("h2", "mt-3", [], parentElem, "accordion-menu-news"); h2.create()
    b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-gray-400 bg-gray-900 font-medium border border-gray-700 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-news-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-news-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [], b.getNode()); s.create()
    s1 = new element("span", "text-xs fa fa-beat font-medium me-3 px-2 py-1 rounded-sm bg-blue-900 text-blue-300", [], s.getNode(), "newsNotifications"); s1.create(); s1.appendContent("0")
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Recent news")
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build news accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-menu-news"}], parentElem, "accordion-menu-news-body"); d1.create()
    d2 = new element("div", "py-1 border border-gray-700 bg-gray-700", [], d1.getNode()); d2.create()
    d = new element("div", "mx-1", [{"key":"data-accordion","value":"collapse"}], d2.getNode(), "accordion-news"); d.create()
}
const add_news = (notificationType = "ZoneSearched", newsData) => {
    let d = document.querySelector("#accordion-news")
    let newsIndex = document.querySelectorAll("#accordion-news h2").length + 1
    //Build notification #newsIndex accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-news-"+newsIndex+"-header"}], d, "accordion-news-"+newsIndex+"-body")
    d1.create(first = true)
    //Build notification #newsIndex accordion header
    h2 = new element("h2", "notificationUnread", [], d, "accordion-news-"+newsIndex+"-header"); h2.create(first = true)
    b = new element("button", "unattached-click flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 border border-gray-700 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-news-"+newsIndex+"-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-news-"+newsIndex+"-body"}], h2.getNode(), "accordion-news-"+newsIndex)
    b.create()
    enable_accordion_click(b.getNode())
    s = new element("span", "", [], b.getNode()); s.create()
    s1 = new element("span", "new text-xs px-1.5 py-0.5 rounded-sm bg-blue-900 text-blue-300 me-3", [{"key":"gender","value":"f"}, {"key":"data-i18n","value":""}], s.getNode())
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
    switch(notificationType){
        case "Welcome":
            d2 = new element("div", "p-2 border border-gray-800 bg-gray-600 text-xs", [], d1.getNode()); d2.create()
            p = new element("p", "mb-2 text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent("Welcome to Medieval Colonies!")
            p = new element("p", "mb-2 text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent("Great news come from a very distant land in which your people has found a place to build up your new colony.")
            p = new element("p", "mb-2 text-gray-200", [], d2.getNode()); p.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("Your status is this")
            p.appendHTML(":")
            p = new element("p", "mb-2 text-gray-200", [], d2.getNode()); p.create()
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
            p = new element("p", "mb-2 text-gray-200", [], d2.getNode()); p.create()
            s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("You have")
            s = new element("span", "font-bold me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("a "+colony_water_reservoir.toLowerCase())
            s = new element("span", "", [{"key":"data-i18n","value":""}, {"key":"gender","value":"*"}], p.getNode()); s.create(); s.appendContent("nearby")
            p.appendHTML(".")
            p = new element("p", "mb-2 text-gray-200", [], d2.getNode()); p.create()
            s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("You have")
            s = new element("span", "font-bold me-1", [], p.getNode()); s.create(); s.appendContent(wagonsAmount.toString())
            s = new element("span", "font-bold me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("wagons")
            s = new element("span", "", [{"key":"data-i18n","value":""}, {"key":"gender","value":"f"}], p.getNode()); s.create(); s.appendContent("full of resources and products.")
            p = new element("p", "mb-2 text-gray-200", [], d2.getNode()); p.create()
            s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("You have")
            s = new element("span", "font-bold me-1", [], p.getNode()); s.create(); s.appendContent(horsesAmount.toString())
            s = new element("span", "font-bold", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("horses")
            p.appendHTML(", ")
            s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("two for each wagon.")
            p = new element("p", "mb-2 text-gray-200", [], d2.getNode()); p.create()
            s = new element("span", "font-bold me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("Each wagon")
            s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("has the following things")
            p.appendHTML(":")
            p = new element("p", "mb-2 text-gray-200", [], d2.getNode()); p.create()
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagon_goods.resources["wooden trunk"]).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("wooden trunk")
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagon_goods.products.nail).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("nail")
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagon_goods.products.hammer).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("hammer")
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagon_goods.products.shovel).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("shovel")
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagon_goods.products.trowel).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("trowel")
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagon_goods.products.saw).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("saw")
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagon_goods.products.hay).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("hay")
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagon_goods.products.rope).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("rope")
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagon_goods.products.rag).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("rag")
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagon_goods.resources.water).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("water")
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((wagon_goods.resources.food).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("units of")
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent("food")
            p = new element("p", "mb-0 p-1 px-2 rounded font-bold text-white border-red-600 bg-red-600", [], d2.getNode(), "searchZoneWarning"); p.create()
            s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("Warning! Time is stopped. Search the zone in the Colony panel to start your game.")
            break
        case "ZoneSearched":
            d2 = new element("div", "p-2 border border-gray-800 bg-gray-600 text-xs", [], d1.getNode()); d2.create()
            p = new element("p", "mb-2 text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent(translate(language, "Your colony sourroundings have been fully searched!"))
            p = new element("p", "mb-2 text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent(translate(language, "Your citizens have succesfully discovered the following things:"))
            p = new element("p", "mb-2 text-gray-200", [], d2.getNode()); p.create()
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((buildings.shelter["campaign tent"]).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "campaign tents", "", "lowercase"))
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock_displayed.resources[language][translate(language, "stone")]).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "stone"))
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock_displayed.resources[language][translate(language, "gravel")]).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "gravel"))
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock_displayed.resources[language][translate(language, "clay")]).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "clay"))
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock_displayed.products[language][translate(language, "brick")]).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "brick"))
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock_displayed.products[language][translate(language, "hay")] - wagon_goods.products.hay * 3).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "hay"))
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock_displayed.products[language][translate(language, "rag")] - wagon_goods.products.rag * 3).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "rag"))
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock_displayed.products[language][translate(language, "wooden plank")]).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "wooden plank"))
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock_displayed.products[language][translate(language, "wooden plate")]).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "wooden plate"))
            li = new element("li", "ms-2 p-0", [], p.getNode()); li.create()
            s = new element("span", "font-bold ms-1", [], li.getNode()); s.create(); s.appendContent((stock_displayed.products[language][translate(language, "roof tile")]).toString())
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "units of"))
            s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""}], li.getNode()); s.create(); s.appendContent(translate(language, "roof tile"))
            p = new element("p", "mb-2 text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent(translate(language, "Check the stock in the Colony panel to see your current goods."))
            break
        case "ResourcesExpeditionFinished":
            d2 = new element("div", "p-2 border border-gray-800 bg-gray-600 text-xs", [], d1.getNode()); d2.create()
            p = new element("p", "mb-2 text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent(translate(language, "Your expeditionaries have returned from the expedition!"))
            if(data.successfullExpedition){
                p = new element("p", "mb-2 text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent(translate(language, "They have succesfully discovered:"))
                p = new element("p", "font-bold mb-2 text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent(translate(language, data.mountResourceType+" mount"))
            } else {
                p = new element("p", "mb-2 text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent(translate(language, "Unfortunetely, they were not able to find any resources mount."))
            }
            break
        case "RuinsExpeditionFinished":
            d2 = new element("div", "p-2 border border-gray-800 bg-gray-600 text-xs", [], d1.getNode()); d2.create()
            p = new element("p", "mb-2 text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent(translate(language, "Your expeditionaries have returned from the expedition!"))
            if(data.successfullExpedition){
                p = new element("p", "mb-2 text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent(translate(language, "They have succesfully obtained:"))
                Object.keys(data.loot).forEach((good) => {
                    p = new element("p", "font-bold mb-2 text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent(translate(language, good).charAt(0).toUpperCase()+translate(language, good).slice(1))
                    p.appendHTML(" x "); p.appendHTML(data.loot[good]); p.appendHTML(" "); p.appendHTML(translate(language, data.loot[good] == 1 ? "unit" : "units"))
                })
            } else {
                p = new element("p", "mb-2 text-gray-200", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent(translate(language, "Unfortunetely, they were not able to find any ruins."))
            }
            break
    }
    document.querySelector("#newsNotifications").innerText++
    document.querySelector("#newsNotifications").hidden = false
    enable_notification_events()
}
const add_colony_stock_filters = (stockType = "resources", action = "none", value = null) => {
    let parentElem = document.getElementById(stockType+"StockFilterPanel")
    //Delete previous filter contents.
    document.querySelectorAll("#"+stockType+"StockFilterPanel > *").forEach((elem) => elem.remove())
    s = new element("span", "flex grow", [], parentElem); s.create()
    //View all button
    let button_id = `showAll${stockType.charAt(0).toUpperCase()+stockType.slice(1)}Stock`
    let disabled = stockType == "buildingParts"
    b = new element("button", `p-1 mx-2 text-xs grow button border border-gray-400 ${disabled ? "text-gray-900 bg-gray-500" : "text-white bg-gray-800"}`, [{"key":"type","value":"button"}], s.getNode(), button_id); b.create()
    i = new element("i", `fa fa-${disabled ? "ban" : "database"} me-2`, [], b.getNode()); i.create()
    s1 = new element("span", "", [{"key":"data-i18n", "value":""},{"key":"gender", "value":"m"}], b.getNode()); s1.create(); s1.appendContent(translate(language, "View all", "m"))
    if(!disabled){
        b.getNode().addEventListener("click", (e) => {
            stock_displayed = []
            stock_displayed = JSON.parse(JSON.stringify(stock_values))
            //Indicate what is being displayed.
            let object_type = (stockType == "buildingParts" ? "building parts" : stockType)
            document.getElementById(stockType+"StockShowingInfo").innerText = translate(language, `All ${object_type} from stock`)
            add_colony_stock_filters(stockType)
            update_stock()
        })
    }
    //Filter button
    b = new element("button", `p-1 mx-2 text-xs grow button border border-gray-400 ${disabled ? "text-gray-900 bg-gray-500" : "text-white bg-gray-800"}`, [{"key":"type","value":"button"}], s.getNode(), "showFilterResourcesStock"); b.create()
    i = new element("i", `fa fa-${disabled ? "ban" : "filters"} me-2`, [], b.getNode()); i.create()
    s1 = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s1.create(); s1.appendContent(translate(language, "Filter"))
    if(!disabled){
        if(["filter", "filterCategory", "filterGranularity"].includes(action)){
            //Disable filter button.
            b.getNode().classList.remove("text-white", "border-gray-400", "bg-gray-800")
            b.getNode().classList.add("text-gray-400", "border-gray-500", "bg-gray-600")
        } else {
            //Enable filter button.
            b.getNode().classList.remove("text-white", "border-gray-400", "bg-gray-800")
            b.getNode().classList.remove("text-gray-400", "border-gray-500", "bg-gray-600")
            b.getNode().classList.add("text-white", "border-gray-400", "bg-gray-800")
            b.getNode().addEventListener("click", (e) => {
                add_colony_stock_filters(stockType, "filter")
            })
        }
    }
    //Sort/order button.
    b = new element("button", "p-1 mx-2 text-xs grow button border border-gray-400 bg-gray-800", [{"key":"type","value":"button"}], s.getNode(), "order"+stockType.charAt(0).toUpperCase()+stockType.slice(1)+"Stock"); b.create()
    i = new element("i", "fa fa-arrow-down-wide-short me-2", [], b.getNode()); i.create()
    s1 = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s1.create(); s1.appendContent(translate(language, "Order"))
    b.getNode().addEventListener("click", (e) => {
        toggle_sort_stock(stockType)
    })
    if(action == "filter"){
        //Build category and granularity filters.
        s = new element("span", "flex grow mt-1", [], parentElem); s.create()
        //Filter category button.
        b = new element("button", "p-1 mx-2 text-xs grow button border border-gray-400 bg-gray-800", [{"key":"type","value":"button"}], s.getNode(), "filter"+stockType.charAt(0).toUpperCase()+stockType.slice(1)+"StockCategory"); b.create()
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s1.create(); s1.appendContent(translate(language, "Filter by category"))
        b.getNode().addEventListener("click", (e) => {
            add_colony_stock_filters(stockType, "filterCategory")
        })
        //Filter granularity button.
        b = new element("button", "p-1 mx-2 text-xs grow button border border-gray-400 bg-gray-800", [{"key":"type","value":"button"}], s.getNode(), "filterResourcesStockGranularity"); b.create()
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s1.create(); s1.appendContent(translate(language, "Filter by granularity"))
        b.getNode().addEventListener("click", (e) => {
            add_colony_stock_filters(stockType, "filterGranularity")
        })
        //Cancel filter.
        b = new element("button", "p-1 mx-2 text-xs grow button border border-gray-400 bg-red-800", [{"key":"type","value":"button"}], s.getNode(), "filterResourcesStockCancel"); b.create()
        i = new element("i", "fa fa-times", [], b.getNode()); i.create()
        b.getNode().addEventListener("click", (e) => {
            add_colony_stock_filters(stockType)
        })
    }
    if(["filterCategory", "filterGranularity"].includes(action)){
        if(value == null){ 
            //Show all categories or granularities buttons.
            s = new element("span", "flex grow items-center mt-1", [], parentElem); s.create()
            let text = (action == "filterCategory" ? "Filtrar por categoría" : "Filtrar por granularidad")
            let id = (action == "filterCategory" ? "Category" : "Granularity")
            s1 = new element("span", "ms-2 me-1", [], s.getNode()); s1.create(); s1.appendContent(text); s1.appendHTML(":")
            let maxIndex = (action == "filterCategory" ? 5 : 6)
            for(index = 1; index <= maxIndex; index++){
                b = new element("button", "p-1 mx-1 text-xs grow button border border-gray-400 bg-gray-800", [{"key":"type","value":"button"},{"key":"data-index","value":index}], s.getNode(), "filterResourcesStock"+id+index); b.create()
                s1 = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s1.create(); s1.appendContent(index.toString())
                b.getNode().addEventListener("click", (e) => {
                    add_colony_stock_filters(stockType, action, e.target.closest("button").getAttribute("data-index"))
                })
            }
            //Category or granularity index button.
            b = new element("button", "p-1 ms-1 me-2 text-xs grow button border border-gray-400 bg-red-800", [{"key":"type","value":"button"}], s.getNode(), "filterResourcesStockCancel"); b.create()
            i = new element("i", "fa fa-times", [], b.getNode()); i.create()
            b.getNode().addEventListener("click", (e) => {
                add_colony_stock_filters(stockType)
            })
        } else {
            let filteredStockArray = []
            if(action == "filterCategory"){
                //Indicate what is being displayed.
                document.getElementById(stockType+"StockShowingInfo").innerText = translate(language, "All category "+value+" "+stockType+" from stock")
                let filteredStockObject = stock_classified[stockType].byCategory["category"+value]
                //Build array with all the resources of the category selected.
                filteredStockArray = (filteredStockObject.granularity1!=null ? [...filteredStockArray, ...filteredStockObject.granularity1[language]] : filteredStockArray)
                filteredStockArray = (filteredStockObject.granularity2!=null ? [...filteredStockArray, ...filteredStockObject.granularity2[language]] : filteredStockArray)
                filteredStockArray = (filteredStockObject.granularity3!=null ? [...filteredStockArray, ...filteredStockObject.granularity3[language]] : filteredStockArray)
                filteredStockArray = (filteredStockObject.granularity4!=null ? [...filteredStockArray, ...filteredStockObject.granularity4[language]] : filteredStockArray)
                filteredStockArray = (filteredStockObject.granularity5!=null ? [...filteredStockArray, ...filteredStockObject.granularity5[language]] : filteredStockArray)
                filteredStockArray = (filteredStockObject.granularity6!=null ? [...filteredStockArray, ...filteredStockObject.granularity6[language]] : filteredStockArray)
            }
            if(action == "filterGranularity"){
                //Indicate what is being displayed.
                document.getElementById(stockType+"StockShowingInfo").innerText = translate(language, "All granularity "+value+" "+stockType+" from stock")
                let filteredStockObject = stock_classified[stockType].byCategory
                //Build array with all the products of the granularity selected for every category.
                filteredStockArray = (filteredStockObject.category1["granularity"+value]!=undefined ? [...filteredStockArray, ...filteredStockObject.category1["granularity"+value][language]] : filteredStockArray)
                filteredStockArray = (filteredStockObject.category2["granularity"+value]!=undefined ? [...filteredStockArray, ...filteredStockObject.category2["granularity"+value][language]] : filteredStockArray)
                filteredStockArray = (filteredStockObject.category3["granularity"+value]!=undefined ? [...filteredStockArray, ...filteredStockObject.category3["granularity"+value][language]] : filteredStockArray)
                filteredStockArray = (filteredStockObject.category4["granularity"+value]!=undefined ? [...filteredStockArray, ...filteredStockObject.category4["granularity"+value][language]] : filteredStockArray)
                filteredStockArray = (filteredStockObject.category5["granularity"+value]!=undefined ? [...filteredStockArray, ...filteredStockObject.category5["granularity"+value][language]] : filteredStockArray)
            }
            //Remove all null resources from displayed stock.
            Object.keys(stock_displayed[stockType][language]).forEach((resourceOrProduct) => {
                //Current resource/product has a positive value in stock_displayed?
                if(stock_displayed[stockType][language][resourceOrProduct]){
                    let filteredResourceOrProductFound = false
                    //Current positive value stock resource/product is of the same category as the filter?
                    filteredStockArray.forEach((filterResourceOrProduct) => {
                        filteredResourceOrProductFound = filteredResourceOrProductFound || (resourceOrProduct == filterResourceOrProduct)
                    })
                    //If resource/product with positive value is not of the filter category/granularity, remove it from stock_displayed
                    if(!filteredResourceOrProductFound){
                        //Remove resource/product from stock_displayed
                        delete stock_displayed[stockType][language][resourceOrProduct]
                    }
                }
            })
            update_stock()
        }
    }
}
const accordion_colony = () => {
    let d, d1, parentElem = document.getElementById("accordion-menu")
    let build_colony_accordion = () => {
        //Build colony accordion header
        let h2 = new element("h2", "mt-3", [], parentElem, "accordion-menu-colony"); h2.create()
        let b = new element("button", "flex items-center justify-between w-full py-2 px-3 font-medium bg-gray-900 border border-gray-700 text-gray-400 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-colony-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-colony-body"}], h2.getNode())
        b.create()
        let s = new element("span", "", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent("Colony")
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        //Build colony accordion body
        d = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-menu-colony"}], parentElem, "accordion-menu-colony-body"); d.create()
    }
    let build_colony_name = () => {
        //First panel
        //Colony name and save button
        p = new element("p", "flex pb-1 text-gray-400", [], d1.getNode()); p.create()
        s = new element("span", "text-xs px-2 bg-gray-500 border border-gray-500 text-white flex-none py-2", [], p.getNode()); s.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Name")
        s.appendHTML(": ")
        t = new element("input", "text-xs grow bg-gray-600 text-white", [{"key":"type","value":"text"},{"key":"placeholder","value":"Type in your colony name"},{"key":"value","value":"Colonia12540"}], p.getNode(), "colonyName"); t.create()
        b = new element("button", "text-xs flex-none px-2 button border border-gray-400 bg-gray-800", [{"key":"type","value":"button"},{"key":"data-i18n","value":""}], p.getNode(), "newColonyNameSubmit")
        b.create(); b.appendContent("Save")
    }
    let build_general_statistics = () => {
        //Statistics header
        d2 = new element("div", "", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), "accordion-statistics"); d2.create()
        //Build general statistics accordion header
        h2 = new element("h2", "notificationUnread", [], d2.getNode(), "accordion-statistics-header"); h2.create()
        b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 border border-gray-700 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-statistics-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-statistics-body"}], h2.getNode())
        b.create()
        s = new element("span", "", [], b.getNode()); s.create()
        s1 = new element("span", "new text-xs px-1.5 py-0.5 hidden rounded-sm bg-blue-900 text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
        s1.create(); s1.appendContent("NEW")
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("General statistics")
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        //Build general statistics accordion body
        d3 = new element("div", "hidden border-gray-300", [{"key":"aria-labelledby","value":"accordion-statistics-header"}], d2.getNode(), "accordion-statistics-body")
        d3.create()
        //Score
        p = new element("p", "pb-0 text-xs text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none pt-2 ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Score")
        s1.appendHTML(": ")
        s1 = new element("span", "pt-2 font-bold flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode(), "colonyScore"); s1.create(); s1.appendContent(colonyScore.toString())
        s1 = new element("span", "pt-2 grow text-white bg-gray-500 border border-gray-500", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("points")
        //Population
        p = new element("p", "pb-0 text-xs text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Population")
        s1.appendHTML(": ")
        s1 = new element("span", "font-bold flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode(), "colonyPopulation"); s1.create(); s1.appendContent(citizensAmount.toString())
        s1 = new element("span", "grow text-white bg-gray-500 border border-gray-500", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("citizens")
        //Life quality
        p = new element("p", "pb-0 text-xs text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Life quality")
        s1.appendHTML(": ")
        s1 = new element("span", "grow "+colony_satisfaction(colonyLifeQuality, citizensAmount).color+" bg-gray-500 font-medium px-1 py-0.5", [], s.getNode()); s1.create()
        s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colonyLifeQuality"); s2.create(); s2.appendContent(colonyLifeQuality.toString())
        s1.appendHTML("(")
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode(), "colonyLifeQualityImpression"); s2.create(); s2.appendContent(colony_satisfaction(colonyLifeQuality, citizensAmount).word)
        s1.appendHTML(")")
        i = new element("i", "ms-1 fa fa-"+colony_satisfaction(colonyLifeQuality, citizensAmount).icon, [], s1.getNode()); i.create()
        //Shelter capacity
        //Get shelter capacity from buildings array
        let shelterCapacity = buildings.shelter["campaign tent"].toString()
        let shelterCapacityOccupation = !buildings.shelter["campaign tent"] ? "" : "67%"
        let shelterCapacityIcon = !buildings.shelter["campaign tent"] ? "fa-face-pouting" : "fa-face-smile"
        let shelterCapacityColor = !buildings.shelter["campaign tent"] ? "text-red-400" : "text-green-400"
        p = new element("p", "pb-0 text-xs text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Shelter capacity")
        s1.appendHTML(": ")
        s1 = new element("span", "grow "+shelterCapacityColor+" bg-gray-500 font-medium px-1 py-0.5", [], s.getNode(), "colonyShelterCapacityInfo"); s1.create()
        s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colonyShelterCapacity"); s2.create(); s2.appendContent(shelterCapacity)
        if(buildings.shelter["campaign tent"]){
            s1.appendHTML("(")
            s2 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(translate(language, "Occupation"))
            s2 = new element("span", "font-bold", [], s1.getNode(), "colonyShelterOccupation"); s2.create(); s2.appendContent(shelterCapacityOccupation)
            s1.appendHTML(")")
        }
        i = new element("i", "ms-1 fa "+shelterCapacityIcon, [], s1.getNode(), "shelterCapacityIcon"); i.create()
        //Power
        p = new element("p", "pb-0 text-xs text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Power")
        s1.appendHTML(": ")
        s1 = new element("span", "font-bold grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode(), "colonyPower"); s1.create(); s1.appendContent("10")
        //Oppression
        p = new element("p", "pb-0 text-xs text-gray-400", [], d3.getNode()); p.create()
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
    let build_vital_resources = () => {
        d2 = new element("div", "", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), "accordion-vitalResources"); d2.create()
        //Build vital resources accordion header
        h2 = new element("h2", "notificationUnread", [], d2.getNode(), "accordion-vitalResources-header"); h2.create()
        b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 border border-gray-700 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-vitalResources-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-vitalResources-body"}], h2.getNode())
        b.create()
        s = new element("span", "", [], b.getNode()); s.create()
        s1 = new element("span", "new text-xs px-1.5 py-0.5 hidden rounded-sm bg-blue-900 text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
        s1.create(); s1.appendContent("NEW")
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Vital resources")
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        //Build vital resources accordion body
        d3 = new element("div", "hidden border-gray-300", [{"key":"aria-labelledby","value":"accordion-vitalResources-header"}], d2.getNode(), "accordion-vitalResources-body")
        d3.create()
        //Water consumption
        p = new element("p", "pb-0 text-xs text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "ps-2 pb-1 pt-2 flex-none bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Water consumption")
        s1.appendHTML(": ")
        s1 = new element("span", "pt-2 grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
        s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-water-consumption"); s2.create(); s2.appendContent("20")
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("units per day")
        //Water income
        p = new element("p", "pb-0 text-xs text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Water income")
        s1.appendHTML(": ")
        s1 = new element("span", "grow flex-none text-green-400 bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
        s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-water-income"); s2.create(); s2.appendContent("30")
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("units per day")
        //Water stock
        p = new element("p", "pb-0 text-xs text-gray-400", [], d3.getNode()); p.create()
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
        p = new element("p", "pb-0 text-xs text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Food consumption")
        s1.appendHTML(": ")
        s1 = new element("span", "grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
        s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-food-consumption"); s2.create(); s2.appendContent("10")
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("units per day")
        //Food income
        p = new element("p", "pb-0 text-xs text-gray-400", [], d3.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "flex-none ps-2 pb-1 bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Food income")
        s1.appendHTML(": ")
        s1 = new element("span", "grow flex-none text-green-400 bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
        s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-food-income"); s2.create(); s2.appendContent("20")
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("units per day")
        //Food stock
        p = new element("p", "pb-0 text-xs text-gray-400", [], d3.getNode()); p.create()
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
    let build_stock = () => {
        d2 = new element("div", "", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), "accordion-stock"); d2.create()
        //Build vital resources accordion header
        h2 = new element("h2", "notificationUnread", [], d2.getNode(), "accordion-stock-header"); h2.create()
        b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 border border-gray-700 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-stock-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-stock-body"}], h2.getNode())
        b.create()
        s = new element("span", "", [], b.getNode()); s.create()
        s1 = new element("span", "new text-xs px-1.5 py-0.5 hidden rounded-sm bg-blue-900 text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
        s1.create(); s1.appendContent("NEW")
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Stock")
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        //Build vital resources accordion body
        d3 = new element("div", "hidden border-gray-300", [{"key":"aria-labelledby","value":"accordion-stock-header"}], d2.getNode(), "accordion-stock-body")
        d3.create()
        //Extracted resources
        d4 = new element("div", "p-0 m-0", [], d3.getNode(), "resources-stock"); d4.create()
        p = new element("p", "pb-0 text-xs text-gray-400", [], d4.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "ps-2 py-2 grow flex-none bg-gray-700 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Extracted resources")
        //Stock list filters
        p = new element("p", "border border-gray-500 py-1 text-xs text-white bg-gray-600", [], d4.getNode(), "resourcesStockFilterPanel"); p.create()
        add_colony_stock_filters("resources")
        //Show current filter / order applied.
        p = new element("p", "flex justify-between border border-gray-500 py-1 text-xs text-white bg-gray-600", [], d4.getNode(), "resourcesStockShowing"); p.create()
        s = new element("span", "flex ms-2", [], p.getNode()); s.create()
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Showing"))
        s1.appendHTML(":")
        s1 = new element("span", "ms-2 font-bold", [{"key":"data-i18n", "value":""}], s.getNode(), "resourcesStockShowingInfo"); s1.create()
        s1.appendContent(translate(language, "All resources from stock"))
        let count = 0
        ds = new element("div", "p-0 m-0", [], d4.getNode(), "resources-stock-list"); ds.create()
        Object.keys(stock_displayed.resources[language]).forEach(resource => {
            if(resource!="food" && resource!="alimento" && stock_displayed.resources[language][resource]){
                let pt = (!count++ ? "pt-2" : "pt-0")
                p = new element("p", "resourceStock pb-0 text-xs text-gray-400", [], ds.getNode()); p.create()
                s = new element("span", "flex", [], p.getNode()); s.create()
                s1 = new element("span", "ps-2 "+pt+" pb-0 flex-none bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
                s2 = new element("span", "capitalize", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(resource)
                s1.appendHTML(": ")
                formatedResource = resource.replaceAll(" ", "")
                s1 = new element("span", pt+" pb-0 grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
                let stockValue = stock_displayed.resources[language][resource].toString()
                s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-"+formatedResource+"-stock"); s2.create(); s2.appendContent(stockValue)
                s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(stockValue == 1 ? "unit" : "units")
            }
        })
        //Add next margin
        p = new element("p", "", [], d3.getNode()); p.create()
        s = new element("span", "bottomMargin flex pt-2 grow bg-gray-500 border border-gray-500", [], p.getNode()); s.create()
        //Manufactured products
        d4 = new element("div", "p-0 m-0", [], d3.getNode(), "products-stock"); d4.create()
        p = new element("p", "pb-0 text-xs text-gray-400", [], d4.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "ps-2 py-2 grow flex-none bg-gray-700 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Manufactured products")
        //Stock list filters
        p = new element("p", "border border-gray-500 py-1 text-xs text-white bg-gray-600", [], d4.getNode(), "productsStockFilterPanel"); p.create()
        add_colony_stock_filters("products")
        //Show current filter / order applied.
        p = new element("p", "flex justify-between border border-gray-500 py-1 text-xs text-white bg-gray-600", [], d4.getNode(), "productsStockShowing"); p.create()
        s = new element("span", "flex ms-2", [], p.getNode()); s.create()
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Showing"))
        s1.appendHTML(":")
        s1 = new element("span", "ms-2 font-bold", [{"key":"data-i18n", "value":""}], s.getNode(), "productsStockShowingInfo"); s1.create()
        s1.appendContent(translate(language, "All products from stock"))
        count = 0
        ds = new element("div", "p-0 m-0", [], d4.getNode(), "products-stock-list"); ds.create()
        Object.keys(stock_displayed.products[language]).forEach(product => {
            if(stock_displayed.products[language][product]){
                let pt = (!count++ ? "pt-2" : "pt-0")
                p = new element("p", "productStock pb-0 text-xs text-gray-400", [], ds.getNode()); p.create()
                s = new element("span", "flex", [], p.getNode()); s.create()
                s1 = new element("span", "ps-2 "+pt+" pb-0 flex-none bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
                s2 = new element("span", "capitalize", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(product)
                s1.appendHTML(": ")
                formatedProduct = product.replaceAll(" ", "")
                s1 = new element("span", pt+" pb-0 grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
                let stockValue = stock_displayed.products[language][product].toString()
                s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-"+formatedProduct+"-stock"); s2.create(); s2.appendContent(stockValue)
                s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(stockValue == 1 ? "unit" : "units")
            }
        })

        //Add next margin
        p = new element("p", "", [], d3.getNode()); p.create()
        s = new element("span", "bottomMargin flex pt-2 grow bg-gray-500 border border-gray-500", [], p.getNode()); s.create()
        //Manufactured building parts
        d4 = new element("div", "p-0 m-0", [], d3.getNode(), "building-parts-stock"); d4.create()
        p = new element("p", "pb-0 text-xs text-gray-400", [], d4.getNode()); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "ps-2 py-2 grow flex-none bg-gray-700 border border-gray-500 text-white", [], s.getNode()); s1.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent("Manufactured building parts")
        //Stock list filters
        p = new element("p", "border border-gray-500 py-1 text-xs text-white bg-gray-600", [], d4.getNode(), "buildingPartsStockFilterPanel"); p.create()
        add_colony_stock_filters("buildingParts")
        //Show current filter / order applied.
        p = new element("p", "flex justify-between border border-gray-500 py-1 text-xs text-white bg-gray-600", [], d4.getNode(), "buildingPartsStockShowing"); p.create()
        s = new element("span", "flex ms-2", [], p.getNode()); s.create()
        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Showing"))
        s1.appendHTML(":")
        s1 = new element("span", "ms-2 font-bold", [{"key":"data-i18n", "value":""}], s.getNode(), "buildingPartsStockShowingInfo"); s1.create()
        s1.appendContent(translate(language, "All building parts from stock"))
        count = 0
        ds = new element("div", "p-0 m-0", [], d4.getNode(), "building-parts-stock-list"); ds.create()
        Object.keys(stock_displayed["building parts"][language]).forEach(part => {
            if(stock_displayed["building parts"][language][part]){
                let pt = (!count++ ? "pt-2" : "pt-0")
                p = new element("p", "buildingPartStock pb-0 text-xs text-gray-400", [], ds.getNode()); p.create()
                s = new element("span", "flex", [], p.getNode()); s.create()
                s1 = new element("span", "ps-2 "+pt+" pb-0 flex-none bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
                s2 = new element("span", "capitalize", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(part)
                s1.appendHTML(": ")
                formatedPart = part.replaceAll(" ", "")
                s1 = new element("span", pt+" pb-0 grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
                let stockValue = stock_displayed["building parts"][language][part].toString()
                s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-"+formatedPart+"-stock"); s2.create(); s2.appendContent(stockValue)
                s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(stockValue == 1 ? "unit" : "units")
            }
        })

        //Add last margin
        p = new element("p", "", [], d3.getNode()); p.create()
        s = new element("span", "bottomMargin flex pt-2 grow bg-gray-500 border border-gray-500", [], p.getNode()); s.create()
    }
    let build_actions_available = () => {
        //Actions available
        d2 = new element("div", "mt-2 border border-gray-800 bg-gray-500 text-xs", [], d1.getNode(), "colony-actions-title"); d2.create()
        p = new element("p", "flex justify-between p-1 ps-2 text-xs text-gray-200 bg-gray-800", [], d2.getNode()); p.create()
        s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent("Actions available")
        i = new element("i", "mt-0 text-base fa fa-times invisible font-bold", [], p.getNode()); i.create()
        //Colony's actions
        d2 = new element("div", "border border-gray-800 bg-gray-600 text-xs", [], d1.getNode(), "colony-actions"); d2.create()
        p = new element("p", "flex w-100 justify-between p-1 text-gray-300", [], d2.getNode()); p.create()
        if(!zoneSearched){
            b = new element("button", "text-xs grow p-2 button border border-gray-400 bg-gray-800", [], p.getNode(), "searchZone"); b.create()
            i = new element("i", "fa fa-search me-2", [], b.getNode()); i.create()
            s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent("Search zone")
        } else {
            s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent("No actions available")
        }
    }
    build_colony_accordion()
    d1 = new element("div", "p-1 border border-gray-700 bg-gray-700", [], d.getNode()); d1.create()
    build_colony_name()
    build_general_statistics()
    build_vital_resources()  
    build_stock()
    build_actions_available()
}
const add_building = (index, type, parentElement) => {
    //Build building 1 - 1 accordion header
    h2 = new element("h2", "notificationUnread", [], parentElement, "accordion-building-1-"+index+"-header"); h2.create()
    b = new element("button", "unattached-click flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 border border-gray-700 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-building-1-"+index+"-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-building-1-"+index+"-body"}], h2.getNode(), "accordion-building-1-"+index)
    b.create()
    enable_accordion_click(b.getNode())
    s = new element("span", "", [], b.getNode()); s.create()
    s1 = new element("span", "new text-xs px-1.5 py-0.5 hidden rounded-sm bg-blue-900 text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
    s1.create(); s1.appendContent(translate(language, "NEW", "m"))
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, type))
    s1 = new element("span", "font-bold ms-1", [], s.getNode()); s1.create(); s1.appendContent(""+index)
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build building 1 - 1 accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-building-1-"+index+"-header"}], parentElement, "accordion-building-1-"+index+"-body"); d1.create()
    d2 = new element("div", "p-2 border border-gray-800 bg-gray-600 text-xs", [], d1.getNode()); d2.create()
    //Campaign tent info
    //First line
    p = new element("p", "ms-1 mb-2 text-xs text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Status"))
    p.appendHTML(": ")
    s = new element("span", "font-bold ms-1", [{"key":"data-i18n","value":""},{"key":"gender","value":"f"}], p.getNode(), "building-1-"+index+"-status"); s.create(); s.appendContent(translate(language, "Constructed", "m"))
    p.appendHTML(".")
    //Second line
    p = new element("p", "ms-1 mb-2 text-xs text-gray-200", [], d2.getNode()); p.create()
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
    p = new element("p", "ms-1 mb-2 text-xs text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Shelter capacity"))
    p.appendHTML(": ")
    s = new element("span", "font-bold", [], p.getNode(), "building-1-"+index+"-capacity"); s.create(); s.appendContent("3")
    s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "citizens"))
    //Forth line
    p = new element("p", "ms-1 mb-1 text-xs text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "font-bold p-0.5 px-1 rounded bg-red-500 text-white", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Fire hazard"))
}
const accordion_buildings = (update = false) => {
    const new_building = (e) => {

    }
    //Build buildings accordion
    let parentElem = document.getElementById("accordion-menu")
    //Build buildings accordion header
    h2 = new element("h2", "mt-3", [], parentElem, "accordion-menu-buildings"); h2.create()
    b = new element("button", "flex items-center justify-between w-full py-2 px-3 font-medium bg-gray-900 border border-gray-700 text-gray-400 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-buildings-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-buildings-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent("Buildings")
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build buildings accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-menu-buildings"}], parentElem, "accordion-menu-buildings-body"); d1.create()
    d2 = new element("div", "py-1 border border-gray-700 bg-gray-700", [], d1.getNode()); d2.create()
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
        b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 border border-gray-700 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-building-group-1-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-building-group-1-body"}], h2.getNode())
        b.create()
        s = new element("span", "", [], b.getNode()); s.create()
        s1 = new element("span", "new text-xs font-medium px-1.5 py-0.5 hidden rounded-sm bg-blue-900 text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
        s1.create(); s1.appendContent("NEW")
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Campaign tents")
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        //Build building group 1 accordion body
        d1 = new element("div", "hidden p-1 border border-gray-800 bg-gray-600 text-xs", [{"key":"aria-labelledby","value":"accordion-building-group-1-header"}], d.getNode(), "accordion-building-group-1-body"); d1.create()
        p = new element("p", "ms-1 mb-2 text-xs text-gray-200", [], d1.getNode()); p.create()
        s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("Total shelter capacity")
        p.appendHTML(": ")
        s = new element("span", "font-bold", [], p.getNode(), "building-group-1-total-capacity"); s.create(); s.appendContent("15")
        s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("citizens")
        d = new element("div", "", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), "accordion-building-group-1"); d.create()
        for(i=1; i<=buildings.shelter["campaign tent"]; i++) { add_building(i, "Campaign tent", d.getNode()) }
    }
    if(noBuildings){
        p = new element("p", "ms-1 mb-1 text-xs text-red-400", [], d.getNode()); p.create()
        i = new element("i", "fa fa-empty-set me-1", [], p.getNode()); i.create()
        s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("There are no buildings in your colony!")
    }
    //Actions available
    //Title
    let parent_div = document.getElementById("accordion-menu-buildings-body")
    d2 = new element("div", "border border-gray-800 bg-gray-500 text-xs", [], parent_div, `buildings-actions-title`); d2.create()
    p = new element("p", "flex justify-between p-1 ps-2 text-xs text-gray-200 bg-gray-800", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Actions available"))
    //Area
    d2 = new element("div", "border border-gray-800 bg-gray-600 text-xs", [], parent_div, `buildings-actions`); d2.create()
    p = new element("p", "flex w-100 justify-between p-1 gap-1 text-gray-300", [], d2.getNode()); p.create()
    b = new element("button", "text-xs grow p-2 button border border-gray-400 bg-gray-800", [], p.getNode(), `buildings-actions-new`); b.create()
    i = new element("i", "fa fa-trowel", [], b.getNode()); i.create()
    s = new element("span", "ms-2", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent(translate(language, "Build new building"))
    b.getNode().addEventListener("click", new_building)
}
const build_citizen = (needs_translation = false, id = 0, citizen = false) => {
    let new_citizen = {}
    let accordion_citizens = document.getElementById("accordion-citizens")
    let build_citizen_accordion_header = () => {
        let accordion_citizens = document.getElementById("accordion-citizens")
        h2 = new element("h2", "notificationUnread", [], accordion_citizens, `accordion-citizen-${id}-header`); h2.create()
        b = new element("button", "unattached-click font-medium flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 border border-gray-700 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-citizen-${id}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-citizen-${id}-body`}], h2.getNode())
        b.create()
        s = new element("span", "", [], b.getNode()); s.create()
        s1 = new element("span", "new text-xs px-1.5 py-0.5 hidden rounded-sm bg-blue-900 text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
        s1.create(); s1.appendContent("NEW")
        //Add icons to name
        let citizen_gender = new_citizen.gender != undefined ? new_citizen.gender : undefined
        let citizen_gender_icon_class = citizen_gender != undefined ? (citizen_gender == "Femenine" ? "fa-venus text-red-500" : "fa-mars text-blue-500") : "hidden"
        let citizen_age_icon_class = new_citizen.ageYears != undefined 
                                            ?  (new_citizen.ageYears <= 5 ? "fa-baby" 
                                                    :   (new_citizen.ageYears < 15 ? "fa-child"
                                                        :   (new_citizen.ageYears < 21 ? "fa-person-walking"
                                                            :   (new_citizen.ageYears < 50 ? "fa-person"
                                                                :   (new_citizen.ageYears < 65 ? "fa-person" : "fa-person-cane")
                                                                )
                                                            )
                                                        )
                                                )
                                            : "hidden fa"
        let citizen_role_icon_class = "hidden"
        if(citizen.role != undefined){
            role_icons.forEach((role) => {
                if(role.key == new_citizen.role){
                    citizen_role_icon_class = `fa-${role.icon}`
                }
            })
        }
        i = new element("i", `me-1 fa ${citizen_gender_icon_class}`, [], s.getNode(), `citizen-${id}-gender-icon`); i.create()
        i = new element("i", `me-1 fa text-white ${citizen_age_icon_class}`, [], s.getNode(), `citizen-${id}-age-icon`); i.create()
        i = new element("i", `me-1 fa ${citizen_role_icon_class}`, [], s.getNode(), `citizen-${id}-role-icon`); i.create()
        s1 = new element("span", "hidden rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 me-1", [], s.getNode(), `citizen-${id}-xp-icon`); s1.create(); s1.appendContent(new_citizen.xp.toString())
        s1 = new element("span", "ms-1", [{"key":"data-i18n","value":""}], s.getNode(), `citizen-${id}-name`); s1.create(); s1.appendContent(new_citizen.name)
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    }
    let build_citizen_accordion_body = () => {
        let show_first_line = (d2) => {
            p = new element("p", "mx-1 flex justify-between mb-1 text-xs text-gray-200", [], d2.getNode()); p.create()
            s = new element("span", "", [], p.getNode()); s.create()
            //Citizen's gender
            s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "Gender" : translate(language, "Gender"))
            s.appendHTML(": ")
            s1 = new element("span", "font-bold", [{"key":"data-i18n", "value":""}], s.getNode(), `citizen-${id}-gender`); s1.create(); s1.appendContent(!needs_translation ? new_citizen.gender : translate(language, new_citizen.gender))
            s.appendHTML(".")
            //Citizen's status
            s = new element("span", "", [], p.getNode()); s.create()
            s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "Status" : translate(language, "Status"))
            s.appendHTML(": ")
            s1 = new element("span", "font-bold", [{"key":"data-i18n", "value":""},{"key":"data-status", "value":new_citizen.status}], s.getNode(), `citizen-${id}-status`); s1.create(); s1.appendContent(!needs_translation ? "Idle" : translate(language, "Idle"))
            s.appendHTML(".")
            if(new_citizen.gender.charAt(0) == "F"){
                s1 = new element("span", "pregnant hidden ms-1", [], s.getNode()); s1.create(); s1.appendContent("(")
                s1 = new element("span", "pregnant hidden", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "weeks" : translate(language, "weeks"))
                s1 = new element("span", "pregnant hidden", [], s.getNode()); s1.create(); s1.appendContent(":")
                s1 = new element("span", "pregnant pregnancy-weeks hidden ms-1 font-bold", [{"key":"data-remaining-weeks", "value":""}], s.getNode(), `citizen-${id}-pregnancy-weeks`); s1.create()
                s1 = new element("span", "pregnant hidden", [], s.getNode()); s1.create(); s1.appendContent(")")
            }
        }
        let show_second_line = (d2) => {
            p = new element("p", "mx-1 flex justify-between mb-1 text-xs text-gray-200", [], d2.getNode()); p.create()
            s = new element("span", "", [], p.getNode()); s.create()
            //Citizen's birthweek
            s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "Birth week" : translate(language, "Birth week"))
            s.appendHTML(": ")
            s1 = new element("span", "font-bold", [], s.getNode(), `citizen-${id}-birthWeek`); s1.create(); s1.appendContent(new_citizen.birthWeek.toString())
            s.appendHTML(".")
            //Citizen's age
            s = new element("span", "", [], p.getNode()); s.create()
            s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "Age" : translate(language, "Age"))
            s.appendHTML(": ")
            s1 = new element("span", "font-bold", [], s.getNode(), `citizen-${id}-ageYears`); s1.create(); s1.appendContent(new_citizen.ageYears.toString())
            s1 = new element("span", "ms-1", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "years" : translate(language, "years"))
            s.appendHTML(", ")
            s1 = new element("span", "font-bold", [], s.getNode(), `citizen-${id}-ageWeeks`); s1.create(); s1.appendContent(new_citizen.ageWeeks.toString())
            s1 = new element("span", "ms-1", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "weeks" : translate(language, "weeks"))
        }
        let show_third_line = (d2) => {
            p = new element("p", "mx-1 flex justify-between mb-1 text-xs text-gray-200", [], d2.getNode()); p.create()
            s = new element("span", "", [], p.getNode()); s.create()
            //Citizen's role
            s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "Role" : translate(language, "Role"))
            s.appendHTML(": ")
            s1 = new element("span", "font-bold", [{"key":"data-i18n", "value":""}], s.getNode(), `citizen-${id}-role`); s1.create(); s1.appendContent(!needs_translation ? "Unassigned" : translate(language, "Unassigned"))
            s.appendHTML(".")
            //Citizen's experience
            s = new element("span", "", [], p.getNode()); s.create()
            s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "Experience" : translate(language, "Experience"))
            s.appendHTML(": ")
            s1 = new element("span", "font-bold", [{"key":"data-xp", "value":"0"}], s.getNode(), `citizen-${id}-xp`); s1.create(); s1.appendContent(new_citizen.xp.toString())
            s.appendHTML(".")
        }
        let show_forth_line = (d2) => {
            p = new element("p", "mx-1 flex justify-between mb-1 text-xs text-gray-200", [], d2.getNode()); p.create()
            s = new element("span", "", [], p.getNode()); s.create()
            //Citizen's left hand
            s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "Left hand" : translate(language, "Left hand"))
            s.appendHTML(": ")
            s1 = new element("span", "font-bold", [{"key":"data-i18n", "value":""},{"key":"gender", "value":"f"}], s.getNode(), `citizen-${id}-leftHand`); s1.create(); s1.appendContent(!needs_translation ? "Empty" : translate(language, "Empty", "f"))
            s.appendHTML(".")
            //Citizen's right hand
            s = new element("span", "", [], p.getNode()); s.create()
            s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "Right hand" : translate(language, "Right hand"))
            s.appendHTML(": ")
            s1 = new element("span", "font-bold", [{"key":"data-i18n", "value":""},{"key":"gender", "value":"f"}], s.getNode(), `citizen-${id}-rightHand`); s1.create(); s1.appendContent(!needs_translation ? "Empty" : translate(language, "Empty", "f"))
            s.appendHTML(".")
        }
        let show_fifth_line = (d2) => {
            p = new element("p", "mx-1 flex justify-between mb-1 text-xs text-gray-200", [], d2.getNode()); p.create()
            s = new element("span", "", [], p.getNode()); s.create()
            //Citizen's outfit
            s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "Outfit" : translate(language, "Outfit"))
            s.appendHTML(": ")
            s1 = new element("span", "font-bold", [{"key":"data-i18n", "value":""}], s.getNode(), `citizen-${id}-outfit`); s1.create(); s1.appendContent(!needs_translation ? new_citizen.outfit : translate(language, new_citizen.outfit))
            s.appendHTML(".")
            //Citizen's fertility
            s = new element("span", "", [], p.getNode()); s.create()
            s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "Fertility" : translate(language, "Fertility"))
            s.appendHTML(": ")
            s1 = new element("span", "font-bold", [], s.getNode(), `citizen-${id}-fertility`); s1.create(); s1.appendContent(new_citizen.fertility.toString())
            s.appendHTML(".")
        }
        let show_relationships = (d1) => {
            const build_relationships = (body_div) => {
                body_div.innerHTML = ""
                //Citizen's parents title
                d2 = new element("div", "border border-gray-800 bg-gray-600 text-xs", [], body_div, `citizen-${id}-parents-title`); d2.create()
                p = new element("p", "flex justify-between gap-1 items-center p-1 ps-2 text-xs text-gray-200 bg-gray-600", [], d2.getNode()); p.create()
                s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Parents"))
                //Citizen's parents area
                d2 = new element("div", "border border-gray-800 bg-gray-500 text-xs", [], body_div, `citizen-${id}-parents`); d2.create()
                p = new element("p", "empty ms-1 mt-1 mb-1 text-xs flex w-100 justify-between gap-2 px-1 text-white", [], d2.getNode()); p.create()
                s = new element("span", "", [], p.getNode()); s.create()
                i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create()
                s1.appendContent(translate(language, "None", "m"))
                if(citizens[id].father || citizens[id].mother){
                    draw_parents_of_citizen(citizens[id])
                }
                //Citizen's children title
                d2 = new element("div", `${visible_teen_class} border border-gray-800 bg-gray-600 text-xs`, [], body_div, `citizen-${id}-children-title`); d2.create()
                p = new element("p", "flex justify-between gap-1 items-center p-1 ps-2 text-xs text-gray-200 bg-gray-600", [], d2.getNode()); p.create()
                s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Children"))
                //Citizen's children area
                d2 = new element("div", `${visible_teen_class} border border-gray-800 bg-gray-500 text-xs`, [], body_div, `citizen-${id}-children`); d2.create()
                p = new element("p", "empty ms-1 mt-1 mb-1 text-xs flex w-100 justify-between gap-2 px-1 text-white", [], d2.getNode()); p.create()
                s = new element("span", "", [], p.getNode()); s.create()
                i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                s1 = new element("span", "", [{"key":"data-i18n", "value":""}, {"key":"gender", "value":"m"}], s.getNode()); s1.create()
                s1.appendContent(translate(language, "None", "m"))
                if(citizens[id].children.length){
                    draw_children_of_citizen(citizens[id])
                }
                //Citizen's couple title
                d2 = new element("div", `${visible_teen_class} border border-gray-800 bg-gray-600 text-xs`, [], body_div, `citizen-${id}-couple-title`); d2.create()
                p = new element("p", "flex justify-between gap-1 items-center p-1 ps-2 text-xs text-gray-200 bg-gray-600", [], d2.getNode()); p.create()
                s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Current couple"))
                //Citizen's couple area
                d2 = new element("div", `${visible_teen_class} border border-gray-800 bg-gray-500 text-xs`, [], body_div, `citizen-${id}-couple`); d2.create()
                p = new element("p", "empty ms-1 text-xs flex w-100 justify-between gap-2 p-1 text-white", [], d2.getNode()); p.create()
                s = new element("span", "", [], p.getNode()); s.create()
                i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                s1 = new element("span", "", [{"key":"data-i18n", "value":""}, {"key":"gender", "value":"f"}], s.getNode()); s1.create()
                s1.appendContent(translate(language, "None", "f"))
                if(citizens[id].couple != null){
                    draw_couple_of_citizen(citizens[id])
                }
            }
            let visible_teen_class = new_citizen.ageYears >= 14 ? "" : "hidden"
            d2 = new element("div", "border border-gray-800 bg-gray-800 text-xs", [], d1.getNode(), `citizen-${id}-relationships-title`); d2.create()
            //Citizen's relationships title
            p = new element("p", "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200", [], d2.getNode()); p.create()
            s = new element("span", "grow", [], p.getNode()); s.create()
            s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "Relationships of" : translate(language, "Relationships of"))
            s1 = new element("span", "ms-1 text-xs text-gray-200", [], s.getNode()); s1.create(); s1.appendContent(citizens[id].name.split(",")[0])
            i = new element("i", "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold", [], p.getNode()); i.create()
            //Citizen's relationships
            d3 = new element("div", "hidden border border-gray-800 bg-gray-500 text-xs", [], d1.getNode(), `citizen-${id}-relationships-body`); d3.create()
            custom_accordion(`citizen-${id}-relationships-title`, `citizen-${id}-relationships-body`, build_relationships)
        }
        let show_actions_available = (d1) => {
            let build_actions_available = (body_div) => {
                let citizen_id = body_div.id.split("-")[1]
                let citizen_can_search_couple = citizens[citizen_id] && citizens[citizen_id].ageYears >= 14
                let citizen_can_get_role_assigned = citizens[citizen_id] && citizens[citizen_id].ageYears >= 6 && citizens[citizen_id].status != "pregnant"
                //Remove all contents of body_div
                body_div.innerHTML = ""
                p = new element("p", "flex w-100 justify-between gap-2 p-1 text-gray-400", [], body_div); p.create()
                if(citizen_can_search_couple){
                    b = new element("button", "searchCouple text-xs grow p-2 button border border-gray-400 bg-gray-800", [], p.getNode(), `searchCouple-${citizen_id}`); b.create()
                    i = new element("i", "fa fa-venus-mars me-2", [], b.getNode()); i.create()
                    s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent(translate(language, "Search a couple"))
                    b.getNode().addEventListener("click", function(e){
                        let objectData = {"language": language, "gender": new_citizen.gender, "parentId": `#accordion-citizen-${citizen_id}-body`}
                        //Build assign role panel
                        searchCouplePanel = new panel("searchCouple", objectData, "citizen", citizen_id, "actions")
                        searchCouplePanel.hidePreviousOptions()
                        searchCouplePanel.buildPanel()
                    })
                }
                if(citizen_can_get_role_assigned){
                    b = new element("button", "assignRole text-xs grow p-2 button border border-gray-400 bg-gray-800", [], p.getNode(), `assignRole-${citizen_id}`); b.create()
                    i = new element("i", "fa fa-handshake-simple me-2", [], b.getNode()); i.create()
                    s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent(translate(language, "Assign a role"))
                    b.getNode().addEventListener("click", function(e){
                        let objectData = {"language": language, "gender": new_citizen.gender.charAt(0), "parentId": `#accordion-citizen-${citizen_id}-body`}
                        //Build assign role panel
                        assignRolePanel = new panel("assignRole", objectData, "citizen", citizen_id, "actions")
                        assignRolePanel.hidePreviousOptions()
                        assignRolePanel.buildPanel()
                        //For each button with an assignable role, add a click event
                        document.querySelectorAll(".assignableRole").forEach((valueButton) => {
                            valueButton.addEventListener("click", (e) => {
                                assign_role_to_citizen(citizen_id, e.target.getAttribute("data-rolekey"), e.target.innerText, e.target.getAttribute("data-icon"))
                            })
                        })
                    })
                }
                if(!citizen_can_search_couple && !citizen_can_get_role_assigned) {
                    s = new element("span", "text-white", [], p.getNode()); s.create()
                    i = new element("i", "fa fa-light fa-empty-set mx-1", [], s.getNode()); i.create()
                    s1 = new element("span", "", [{"key":"data-i18n", "value":""}, {"key":"gender", "value":"f"}], s.getNode()); s1.create(); 
                    s1.appendContent(translate(language, "None", "f"))
                }
            }
            //Citizen's actions title
            d2 = new element("div", "mt-1 border border-gray-800 bg-gray-800 text-xs", [], d1.getNode(), `citizen-${id}-actions-title`); d2.create()
            p = new element("p", "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200", [], d2.getNode()); p.create()
            s = new element("span", "grow", [], p.getNode()); s.create()
            s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(!needs_translation ? "Actions available for" : translate(language, "Actions available for"))
            s1 = new element("span", "ms-1 text-xs text-gray-200", [], s.getNode()); s1.create(); s1.appendContent(citizens[id].name.split(",")[0])
            i = new element("i", "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold", [], p.getNode()); i.create()
            //Citizen's actions
            d2 = new element("div", "hidden border border-gray-800 bg-gray-500 text-xs", [], d1.getNode(), `citizen-${id}-actions`); d2.create()
            custom_accordion(`citizen-${id}-actions-title`, `citizen-${id}-actions`, build_actions_available)
        }

        d1 = new element("div", "hidden citizen mb-1 bg-gray-600", [{"key":"aria-labelledby","value":`accordion-citizen-${id}-header`}], accordion_citizens, `accordion-citizen-${id}-body`); d1.create()
        //Citizen's description
        citizens[id].attributes = (new_citizen.attributes == undefined) ? getRandomAttributes(language) : new_citizen.attributes
        citizens[id].wishedAttributes = (new_citizen.wishedAttributes == undefined) ? getRandomAttributes(language) : new_citizen.wishedAttributes
        citizens[id].hatedAttribute = (new_citizen.hatedAttribute == undefined) ? getRandomAttributes(language, 1, new_citizen.wishedAttributes)[0] : new_citizen.hatedAttribute
        d2 = new element("div", "p-1 border border-gray-800 bg-gray-600 text-xs", [], d1.getNode()); d2.create()
        p = new element("p", "ms-1 text-xs text-gray-200", [], d2.getNode()); p.create()
        s = new element("span", "", [], p.getNode(), `citizen-${id}-description`); s.create()
        //Update description
        updateCitizenDescription(id, new_citizen.gender, new_citizen.birthWeeks, citizens[id].attributes, citizens[id].wishedAttributes, [citizens[id].hatedAttribute])
        //Citizen's properties title
        d2 = new element("div", "border border-gray-800 bg-gray-800 text-xs", [], d1.getNode()); d2.create()
        p = new element("p", "p-1 ps-2 text-xs text-gray-200", [], d2.getNode()); p.create()
        s = new element("span", "text-xs text-gray-200", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(!needs_translation ? "Properties of" : translate(language, "Properties of"))
        s = new element("span", "ms-1 text-xs text-gray-200", [], p.getNode()); s.create(); s.appendContent(citizens[id].name.split(",")[0])
        //Citizen's properties
        d2 = new element("div", "citizen-properties p-1 border border-gray-800 bg-gray-600 text-xs", [{"key":"data-index", "value":id}], d1.getNode(), `citizen-${id}-properties`); d2.create()
        show_first_line(d2) //First line of citizen attributes.
        show_second_line(d2) //Second line of citizen attributes.
        show_third_line(d2) //Third line of citizen attributes.
        show_forth_line(d2) //Forth line of citizen attributes.
        show_fifth_line(d2) //Fifth line of citizen attributes
        show_relationships(d1) //Show all relationships panels for citizen.
        show_actions_available(d1)
    }
    //Check if id was provided, otherwise get the first available.
    id = !id && (!citizen || citizen.id == undefined) ? citizens.length : id
    new_citizen.id = id
    new_citizen.gender = !citizen || citizen.gender == undefined || citizen.gender == null ? ["Femenine", "Masculine"][Math.floor(Math.random()*2)] : citizen.gender
    new_citizen.name = !citizen || citizen.name == undefined || citizen.name == null ? set_random_name(language, new_citizen.gender) : citizen.name
    new_citizen.father = !citizen || citizen.father == undefined || citizen.father == null ? null : citizen.father
    new_citizen.mother = !citizen || citizen.mother == undefined || citizen.mother == null ? null : citizen.mother
    new_citizen.children = !citizen || citizen.children == undefined || citizen.children == null ? [] : citizen.children
    new_citizen.couple = !citizen || citizen.couple == undefined || citizen.couple == null ? null : citizen.couple
    new_citizen.role = !citizen || citizen.role == undefined || citizen.role == null ? "unassigned" : citizen.role
    new_citizen.rolekey = !citizen || citizen.rolekey == undefined || citizen.rolekey == null ? "unassigned" : citizen.rolekey
    new_citizen.birthWeek = !citizen || citizen.birthWeek == undefined || citizen.birthWeek == null ? document.getElementById("passedWeeks").innerHTML*1 : citizen.birthWeek
    new_citizen.birthWeeks = !citizen || citizen.birthWeeks == undefined || citizen.birthWeeks == null ? 0 : citizen.birthWeeks
    new_citizen.ageYears = !citizen || citizen.ageYears == undefined || citizen.ageYears == null ? 0 : citizen.ageYears
    new_citizen.ageWeeks = !citizen || citizen.ageWeeks == undefined || citizen.ageWeeks == null ? 0 : citizen.ageWeeks
    new_citizen.status = !citizen || citizen.status == undefined || citizen.status == null ? "idle" : citizen.status
    new_citizen.xp = !citizen || citizen.xp == undefined || citizen.xp == null ? 0 : citizen.xp
    new_citizen.leftHand = !citizen || citizen.leftHand == undefined || citizen.leftHand == null ? "" : citizen.leftHand
    new_citizen.rightHand = !citizen || citizen.rightHand == undefined || citizen.rightHand == null ? "" : citizen.rightHand
    new_citizen.outfit = !citizen || citizen.outfit == undefined || citizen.outfit == null ? "No" : citizen.outfit
    new_citizen.fertilityWeek = (!citizen || citizen.fertilityWeek == undefined || citizen.fertilityWeek == null) ? (new_citizen.gender == "Femenine" ? 1 + Math.floor(Math.random() * 4) : null) : citizen.fertilityWeek
    new_citizen.fertility = !citizen || citizen.fertility == undefined || citizen.fertility == null ? 10 + Math.floor(Math.random() * 91) : citizen.fertility
    new_citizen.weekOfDeath = !citizen || citizen.weekOfDeath == undefined || citizen.weekOfDeath == null ? 3120 + Math.floor(Math.random() * (4420-3120)) : citizen.weekOfDeath
    citizens[id] = new_citizen
    //Build citizen accordion header
    build_citizen_accordion_header()
    //Build citizen accordion body
    build_citizen_accordion_body()
    if(new_citizen.father) { 
        add_parent_to_citizen(citizens[new_citizen.father], citizens[new_citizen.id], "father") 
        add_child_to_citizen(citizens[new_citizen.id], citizens[new_citizen.father])
    }
    if(new_citizen.mother) { 
        add_parent_to_citizen(citizens[new_citizen.mother], citizens[new_citizen.id], "mother") 
        add_child_to_citizen(citizens[new_citizen.id], citizens[new_citizen.mother])
    }
    enable_accordion_click(document.querySelector(`#accordion-citizen-${new_citizen.id}-header button`))
    return new_citizen
}
const accordion_citizens = (amount = 10) => {
    //Build citizens accordion
    let parentElem = document.getElementById("accordion-menu")
    //Build citizens accordion header
    h2 = new element("h2", "mt-3", [], parentElem, "accordion-menu-citizens"); h2.create()
    b = new element("button", "flex items-center font-medium justify-between w-full py-2 px-3 bg-gray-900 border border-gray-700 text-gray-400 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-citizens-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-citizens-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent("Citizens")
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build citizens accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-menu-citizens"}], parentElem, "accordion-menu-citizens-body"); d1.create()
    d2 = new element("div", "py-1 border border-gray-700 bg-gray-700", [], d1.getNode()); d2.create()
    d = new element("div", "mx-1", [{"key":"data-accordion","value":"collapse"}], d2.getNode(), "accordion-citizens"); d.create()
    for(let i = 1; i<=amount; i++){
        let new_citizen = {}
        new_citizen.id = i
        //Set relationship attributes null.
        new_citizen.father = null
        new_citizen.mother = null
        new_citizen.children = []
        new_citizen.couple = null
        //Set role as unassigned
        new_citizen.role = new_citizen.rolekey = "unassigned"
        //Set aging attributes
        //Set total weeks already lived by citizen (weeks age)
        let citizenBirthweeks = 1092+ Math.floor(Math.random() * (1820-1092)) //Random ages only adults
        //citizenBirthweeks = 0+ Math.floor(Math.random() * (3800-0)) //Random ages in all ranges
        //citizenBirthweeks = 729 + Math.floor(Math.random() * (3300-729)) //Random ages from teens on (not so ancient)
        new_citizen.birthWeeks = 780 //Weeks already lived.
        //Set current game week in which citizen was born.
        new_citizen.birthWeek = document.getElementById("passedWeeks").innerHTML*1 - citizenBirthweeks
        //Set citizen age in years.
        new_citizen.ageYears = Math.floor(citizenBirthweeks / 52)
        //Set how many weeks has passed having the same age.
        new_citizen.ageWeeks = citizenBirthweeks % 52
        //Set week of citizen's future death
        new_citizen.deathWeek = 3120 + Math.floor(Math.random() * (4420-3120))
        //Set status to idle.
        new_citizen.status = "idle"
        //Set first half citizens as female and the rest as male.
        new_citizen.gender = i <= Math.ceil(amount / 2) ? "Femenine" : "Masculine"
        new_citizen.name = set_random_name(language, new_citizen.gender)
        new_citizen.xp = 0
        //Set own attributes, wished attributes and hated attributes (this last must not be a wished attribute)
        new_citizen.attributes = getRandomAttributes(language)
        new_citizen.wishedAttributes = getRandomAttributes(language)
        new_citizen.hatedAttribute = getRandomAttributes(language, 1, new_citizen.wishedAttributes)[0]
        //Left and right hand empty, no outfit.
        new_citizen.leftHand = new_citizen.rightHand = ""
        new_citizen.outfit = "No"
        //Set fertility issues.
        new_citizen.fertility = 10 + Math.floor(Math.random() * 91)
        new_citizen.fertilityWeek = new_citizen.gender == "Femenine" ? 1 /*+ Math.floor(Math.random() * 4)*/ : null

        build_citizen(translation = false, new_citizen.id, new_citizen)
        //citizenBuilder(i)
    }
}
const accordion_relationships = () => {
    //Build relationships accordion
    let parentElem = document.getElementById("accordion-menu")
    //Build relationships accordion header
    h2 = new element("h2", "mt-3", [], parentElem, "accordion-menu-relationships"); h2.create()
    b = new element("button", "flex items-center justify-between w-full py-2 px-3 font-medium bg-gray-900 border border-gray-700 text-gray-400 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-relationships-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-relationships-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent("Relationships")
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build relationships accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-menu-relationships"}], parentElem, "accordion-menu-relationships-body"); d1.create()
    //Relationships area
    d2 = new element("div", "py-1 pb-0 border border-gray-200 border-gray-700 bg-gray-500", [], d1.getNode(), "citizen-relationships"); d2.create()
    p = new element("p", "empty ms-1 mt-1 mb-2 text-xs flex w-100 justify-between gap-2 px-1 text-white", [], d2.getNode()); p.create()
    s = new element("span", "", [], p.getNode()); s.create()
    i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
    s1 = new element("span", "", [{"key":"data-i18n", "value":""}, {"key":"gender", "value":"f"}], s.getNode()); s1.create()
    s1.appendContent("Not defined (Make couples in Citizen's panel)")
}

const get_citizen_by_index = (citizen_index) => {
    return citizens[citizen_index]
}
const modal_citizen_info = (e) => {
    let citizen_index = e.target.getAttribute("data-index")
    let citizen = get_citizen_by_index(citizen_index)
    citizen.modalStyle = "small"
    modal_popup(citizen.name, "ViewCitizenInfo", citizen)
    modal.show()
}
const show_citizen_attributes = (e) => {
    let parent_h2 = e.target.closest("h2")
    if(e.target.classList.contains("fa-down")){
        let citizen_index = e.target.getAttribute("data-index")
        let citizen = get_citizen_by_index(citizen_index)
        let own_attribute_1 = citizen.attributes[0]
        let own_attribute_1_class = attributes_colors["EN"][translate("EN", own_attribute_1, "", "", changeLanguage=false)]
        let own_attribute_2 = citizen.attributes[1]
        let own_attribute_2_class = attributes_colors["EN"][translate("EN", own_attribute_2, "", "", changeLanguage=false)]
        let own_attribute_3 = citizen.attributes[2]
        let own_attribute_3_class = attributes_colors["EN"][translate("EN", own_attribute_3, "", "", changeLanguage=false)]
        let wished_attribute_1 = citizen.wishedAttributes[0]
        let wished_attribute_1_class = attributes_colors["EN"][translate("EN", wished_attribute_1, "", "", changeLanguage=false)]
        let wished_attribute_2 = citizen.wishedAttributes[1]
        let wished_attribute_2_class = attributes_colors["EN"][translate("EN", wished_attribute_2, "", "", changeLanguage=false)]
        let wished_attribute_3 = citizen.wishedAttributes[2]
        let wished_attribute_3_class = attributes_colors["EN"][translate("EN", wished_attribute_3, "", "", changeLanguage=false)]
        let hated_attribute = citizen.hatedAttribute
        let hated_attribute_class = attributes_colors["EN"][translate("EN", hated_attribute, "", "", changeLanguage=false)]
        d = new element("div", "attributes p-1 bg-gray-500 border border-gray-700", [], parent_h2); d.create()
        p = new element("p", "grow p-1 flex items-center gap-2", [], d.getNode()); p.create()
        i = new element("i", "text-sm fa fa-circle-user", [], p.getNode()); i.create()
        s = new element("span", `px-1 font-bold text-xs border border-gray-800 ${own_attribute_1_class} bg-gray-600`, [], p.getNode()); s.create(); s.appendContent(own_attribute_1)
        s = new element("span", `px-1 font-bold text-xs border border-gray-800 ${own_attribute_2_class} bg-gray-600`, [], p.getNode()); s.create(); s.appendContent(own_attribute_2)
        s = new element("span", `px-1 font-bold text-xs border border-gray-800 ${own_attribute_3_class} bg-gray-600`, [], p.getNode()); s.create(); s.appendContent(own_attribute_3)
        p = new element("p", "grow p-1 flex items-center gap-2", [], d.getNode()); p.create()
        i = new element("i", "text-sm fa fa-heart", [], p.getNode()); i.create()
        s = new element("span", `px-1 font-bold text-xs border border-gray-800 ${wished_attribute_1_class} bg-gray-600`, [], p.getNode()); s.create(); s.appendContent(wished_attribute_1)
        s = new element("span", `px-1 font-bold text-xs border border-gray-800 ${wished_attribute_2_class} bg-gray-600`, [], p.getNode()); s.create(); s.appendContent(wished_attribute_2)
        s = new element("span", `px-1 font-bold text-xs border border-gray-800 ${wished_attribute_3_class} bg-gray-600`, [], p.getNode()); s.create(); s.appendContent(wished_attribute_3)
        p = new element("p", "grow p-1 flex items-center gap-2", [], d.getNode()); p.create()
        i = new element("i", "text-sm fa fa-ban", [], p.getNode()); i.create()
        s = new element("span", `px-1 font-bold text-xs border border-gray-800 ${hated_attribute_class} bg-gray-600`, [], p.getNode()); s.create(); s.appendContent(hated_attribute)
    } else {
        parent_h2.querySelector(".attributes").remove()
    }
    e.target.classList.toggle("fa-down")
    e.target.classList.toggle("fa-up")
}
const show_active_production_rules = () => {
    let show_workers_assigned = (parent_div, workers_label, rule_id, req_index) => {
        let remove_requirement_workers = (e) => {
            document.querySelector(`#active-rule-${rule_id}-requirement-${req_index}-assigned-title`).remove()
            document.querySelector(`#active-rule-${rule_id}-requirement-${req_index}-assigned-area`).remove()
        }
        d = new element("div", "border border-gray-800 bg-gray-600 text-xs active-rule-requirement-assigned-title", [], parent_div, `active-rule-${rule_id}-requirement-${req_index}-assigned-title`); d.create()
        p = new element("p", "items-center text-xs flex justify-between p-1 ps-3 text-gray-200 bg-gray-700", [], d.getNode()); p.create()
        s = new element("span", "grow", [], p.getNode()); s.create(); s.appendContent(workers_label)
        i = new element("span", "me-1 text-sm fa fa-times", [], p.getNode()); i.create()
        i.getNode().addEventListener("click", remove_requirement_workers)
        d1 = new element("div", "px-1 py-1 pb-0 border border-gray-800 bg-gray-400 text-xs active-rule-requirement-assigned-area", [], parent_div, `active-rule-${rule_id}-requirement-${req_index}-assigned-area`); d1.create()
        let req_found = false
        product_rules_defined.forEach((rule) => {
            if(rule.id == rule_id){
                rule.rule_definition.requirements.forEach((requirement) => {
                    if(requirement.index == req_index && requirement.type == "citizen"){
                        req_found = true
                        requirement.workers.forEach((assigned_worker_index) => {
                            //Get citizen info.
                            let current_citizen = get_citizen_by_index(assigned_worker_index)
                            let did = `active-rule-${rule_id}-requirement-${requirement.index}-worker-${assigned_worker_index}`
                            d = new element("div", "flex items-center justify-between w-full py-1 px-2 mb-1 text-xs text-white bg-gray-700 border border-gray-200 gap-3", [], d1.getNode(), did); d.create()
                            s = new element("span", "", [], d.getNode()); s.create()
                            let gender_class = current_citizen.gender == "Feminine" ? "fa-venus" : "fa-mars"
                            let gender_colour_class = current_citizen.gender == "feminine" ? "text-red-500" : "text-blue-500"
                            i = new element("i", `me-1 fa ${gender_class} ${gender_colour_class}`, [], s.getNode(), `citizen-${assigned_worker_index}-gender-icon`); i.create()
                            let age_class = (current_citizen.ageYears <= 5 ? "fa-baby" : (current_citizen.ageYears < 15 ? "fa-child" : (current_citizen.ageYears < 21 ? "fa-person-walking" : (current_citizen.ageYears < 50 ? "fa-person" : (current_citizen.ageYears < 65 ? "fa-person" : "fa-person-cane"))))); 
                            i = new element("i", `text-white me-1 fa ${age_class}`, [], s.getNode(), `citizen-${assigned_worker_index}-age-icon`); i.create()
                            let role_class = ""
                            role_icons.forEach((role) => {
                                if(role.key == current_citizen.role){
                                    role_class = `fa-${role.icon}`
                                }
                            })
                            i = new element("i", `text-green-500 me-1 fa ${role_class}`, [], s.getNode(), `citizen-${assigned_worker_index}-role-icon`); i.create()
                            s1 = new element("span", "text-yellow-500 rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 me-1", [], s.getNode(), `citizen-${assigned_worker_index}-xp-icon`); s1.create()
                            s1.appendContent(Math.floor(current_citizen.xp).toString())
                            s1 = new element("span", "ms-1", [], s.getNode(), `citizen-${assigned_worker_index}-name`); s1.create(); s1.appendContent(current_citizen.name)
                            s = new element("span", "", [], d.getNode()); s.create()
                            i = new element("i", "fa fa-eye", [{"key":"data-index", "value":assigned_worker_index}], s.getNode(), `citizen-${assigned_worker_index}-view-info`); i.create()
                            i.getNode().addEventListener("click", modal_citizen_info)
                            //i = new element("i", "text-sm fa-regular fa-times", [], s.getNode(), `citizen-${assigned_worker_index}-deassign`); i.create()
                        })
                    }
                })
            }
        })
    }
    let click_worker = (e) => {
        let rule_id = e.target.closest("span").id.split("-")[2]
        let req_index = e.target.closest("span").id.split("-")[4]
        if(document.getElementById(`active-rule-${rule_id}-requirement-${req_index}-assigned-title`) == undefined){
            document.querySelectorAll(".active-rule-requirement-assigned-title").forEach((elem) => elem.remove())
            show_workers_assigned(e.target.closest("div").querySelector(".rule-assigned-workers"), e.target.closest("span").previousSibling.innerText, rule_id, req_index)
        }
    }
    let parent_div = document.querySelector(".active-production-rules")
    if(parent_div.querySelector(".empty") != undefined){
        parent_div.querySelector(".empty").remove()
    }
    //Remove active production rules
    parent_div.querySelectorAll("div").forEach((elem) => elem.remove())
    //Add all active production rules
    product_rules_defined.forEach((rule) => {
        //Current rule accordion
        d = new element("div", "", [{"key":"data-accordion","value":"collapse"}], parent_div, `accordion-active-rule-${rule.id}`); d.create()
        //Current rule accordion header
        h2 = new element("h2", "notificationUnread", [], d.getNode(), `accordion-active-rule-${rule.id}-header`); h2.create()
        b = new element("button", "unattached-click flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 font-medium border border-gray-700 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-active-rule-${rule.id}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-active-rule-${rule.id}-body`}], h2.getNode())
        b.create()
        s = new element("span", "", [], b.getNode()); s.create()
        s1 = new element("span", "font-bold text-sm", [{"key":"data-i18n","value":""}], s.getNode()); s1.create()
        s1.appendContent(`Regla ${rule.id} -`)
        s1 = new element("span", "ms-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create()
        s1.appendContent(`${translate(language, "Product")}:`)
        s1 = new element("span", "ms-1 text-blue-400", [{"key":"data-i18n","value":""}], s.getNode()); s1.create()
        s1.appendHTML(`${translate(language, rule.object, "", "uppercase")}`)
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        //Current rule accordion body
        d1 = new element("div", "hidden p-1 border border-gray-800 bg-gray-500 text-xs", [{"key":"aria-labelledby","value":`accordion-active-rule-${rule.id}-header`}], d.getNode(), `accordion-active-rule-${rule.id}-body`); d1.create()
        p = new element("p", "ms-1 mb-1 text-xs text-white", [], d1.getNode()); p.create()
        s1 = new element("span", "", [], p.getNode()); s1.create()
        s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
        s1.appendHTML(": ")
        s = new element("span", "font-bold", [], s1.getNode(), `active-rule-${rule.id}-status`); s.create(); s.appendContent(translate(language, rule.status, "", "capitalized"))
        s2 = new element("span", "", [], p.getNode()); s2.create()
        //i = new element("i", "fa fa-times", [], s2.getNode()); i.create(); i.appendContent("Cancel")
        p = new element("p", "ms-1 mb-1 text-xs text-white", [], d1.getNode()); p.create()
        s = new element("span", "underline underline-offset-1", [], p.getNode()); s.create(); s.appendContent(translate(language, "Scheme", "", "capitalized"))
        p.appendHTML(": ")
        p = new element("p", "ms-1 mb-1 flex flex-wrap items-center text-xs text-white ", [], d1.getNode()); p.create()
        let requirements_last_index = rule.rule_definition.requirements.length - 1
        rule.rule_definition.requirements.forEach((requirement, index) => {
            if(!requirement.consumable){
                s = new element("span", "flex items-center m-0", [], p.getNode()); s.create()
                s1 = new element("span", "font-bold pb-1 text-base", [], s.getNode()); s1.create(); s1.appendContent("[")
                s1id = `active-rule-${rule.id}-requirement-${requirement.index}-object`
                if(requirement.type == "citizen"){
                    s1 = new element("span", "font-bold flex flex-nowrap border-2 border-gray-800 my-1 px-1 ms-1 py-0 bg-gray-600", [], s.getNode(), s1id); s1.create(); s1.appendContent(translate(language, requirement.object, "", "capitalized")+" x "+requirement.quantity)
                    s1 = new element("span", "font-bold flex flex-nowrap border-2 border-gray-800 border-s-0 my-1 px-1 me-1 py-0 bg-gray-600 rule-worker-unselected", [], s.getNode(), s1id+"-view"); s1.create()
                    i = new element("i", "px-1 text-base fa fa-arrow-down", [], s1.getNode()); i.create()
                    s1.getNode().addEventListener("click", click_worker)
                } else {
                    s1 = new element("span", "font-bold flex flex-nowrap border-2 border-gray-800 my-1 px-1 mx-1 py-0 bg-gray-600", [], s.getNode(), s1id); s1.create(); s1.appendContent(translate(language, requirement.object, "", "capitalized")+" x "+requirement.quantity)
                }
                s1 = new element("span", "font-bold pb-1 text-base", [], s.getNode()); s1.create(); s1.appendContent("]")
            }
            if(index < requirements_last_index){
                i = new element("i", "font-bold mx-2 my-1 fa fa-plus text-sm", [], p.getNode()); i.create()
            }
        })
        i = new element("i", "font-bold mx-2 fa fa-arrow-right my-1 text-sm", [], p.getNode()); i.create()
        s = new element("span", "font-bold flex flex-nowrap border-2 border-blue-800 my-1 px-1 mx-1 py-0 bg-blue-500", [{"key":"data-object", "value":rule.object}], p.getNode()); 
        sid = `active-rule-${rule.id}-result`
        s.create(); s.appendContent(translate(language, rule.object, "", "capitalized") + " x " + rule.rule_definition.result.quantity)
        enable_accordion_click(b.getNode())
        d = new element("div", "rule-assigned-workers", [], document.getElementById(`accordion-active-rule-${rule.id}-body`)); d.create()
        d = new element("div", "border border-gray-800 bg-gray-600 text-xs", [], document.getElementById(`accordion-active-rule-${rule.id}-body`), `active-rule-${rule.id}-actions-available-title`); d.create()
        p = new element("p", "items-center text-xs flex justify-between p-1 ps-3 text-gray-200 bg-gray-700", [], d.getNode()); p.create()
        s = new element("span", "grow", [], p.getNode()); s.create(); s.appendContent(translate(language, "Actions available"))
        
        d = new element("div", "border border-gray-800 bg-gray-400 text-xs", [], document.getElementById(`accordion-active-rule-${rule.id}-body`), `active-rule-${rule.id}-actions-available-body`); d.create()
        p = new element("p", "flex w-100 justify-between p-1 text-gray-300", [], d.getNode()); p.create()
        b = new element("button", "text-xs grow p-2 button border border-gray-400 bg-gray-800", [{"key":"data-rule-id", "value":rule.id}], p.getNode()); b.create()
        i = new element("i", "fa fa-times me-2", [], b.getNode()); i.create()
        s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent(translate(language, "Cancel production rule"))
        b.getNode().addEventListener("click", function(e){
            //Cancel rule
            let rule_id = e.target.closest("button").getAttribute("data-rule-id")
            //Search rule in structure and remove it
            product_rules_defined.forEach((rule, rule_index) => {
                if(rule.id == rule_id){
                    product_rules_defined.splice(rule_index, 1)
                }
            })
            //Remove active rule panel
            let panel_parent = document.getElementById(`accordion-active-rule-${rule_id}`).parentElement
            document.getElementById(`accordion-active-rule-${rule_id}`).remove()
            if(!panel_parent.children.length){
                p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-200", [], panel_parent); p.create()
                s = new element("span", "", [], p.getNode()); s.create()
                i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                s1 = new element("span", "", [{"key": "data-18n", "value":""}, {"key": "gender", "value":"f"}], s.getNode()); s1.create()
                s1.appendContent(translate(language, "None", "f"))
            }
        })
    })
}
const new_rule_click_requirement = (click_target, requirement, elem) => {
    let rule_index
    let toggle_save_new_rule_panel = (div, rule_index) => {
        let click_save_rule = (e) => {
            //Save rule
            let rule_created = {}
            rule_last_id++
            rule_created.id = rule_last_id
            rule_created.index = rule_index
            rule_created.object = document.querySelector(`#rule-${rule_index}-object`).getAttribute("data-object")
            let rule_definition = JSON.parse(JSON.stringify(product_rules[rule_created.object].rules[0]))
            rule_created.status = "running"
            document.querySelectorAll(".rule-requirement").forEach((elem) => {
                let requirement_index = elem.id.split("-")[3]
                rule_created.rule_definition = rule_definition
                //Iterate rule's requirements
                rule_created.rule_definition.requirements.forEach((requirement_element, requirement_array_index) => {
                    //Current requirement found?
                    if(requirement_element.index == requirement_index){
                        //Check if current requirement demands workers
                        if(requirement_element.type == "citizen"){
                            //Search workers assigned to requirement
                            let did = `#rule-${rule_index}-requirement-${requirement_index}-assignable-workers-area h2.assigned`
                            document.querySelectorAll(did).forEach((citizen_elem) => {
                                //Obtain citizen index from div panel
                                let citizen_index = citizen_elem.id.split("citizen-")[1]
                                citizens[citizen_index].status = "working"
                                document.querySelectorAll(`#citizen-${citizen_index}-status`).forEach((elem) => {
                                    elem.setAttribute("data-status", "working")
                                    elem.innerText = translate(language, "working", "", "capitalized")
                                })
                                rule_created.rule_definition.requirements[requirement_array_index].workers.push(citizen_index)
                            })
                            rule_created.rule_definition.result.quantity*= rule_created.rule_definition.requirements[requirement_array_index].workers.length
                            rule_created.rule_definition.requirements[requirement_array_index].quantity*= rule_created.rule_definition.requirements[requirement_array_index].workers.length
                        }
                    }
                })
            })
            product_rules_defined.push(rule_created)
            document.querySelector("#active-production-rules-newRule-title").remove()
            document.querySelector("#active-production-rules-newRule").remove()
            b.getNode().removeEventListener("click", click_save_rule)
            show_active_production_rules()
            //Build new production rule panel
            let object_data = {"language": language, "parentId": "#accordion-landform-1-body", "location": "waterReservoir"}
            let new_production_rule_panel = new panel("newRule", object_data, "active-production-rules", false, "actions")
            new_production_rule_panel.showPreviousOptions()
        }

        pid = `rule-${rule_index}-requirement-${requirement.index}-available-actions-title`
        if(document.getElementById(pid) == undefined || document.getElementById(pid) == null){
            //Add available actions title.
            p = new element("p", "items-center text-xs flex justify-between p-1 ps-3 text-gray-200 bg-gray-700", [], div, pid); p.create()
            s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Actions available"))
            //Add available actions area.
            did = `rule-${rule_index}-requirement-${requirement.index}-available-actions-area`
            d = new element("div", "flex bg-gray-500 text-xs p-2 pb-1", [], div, did); d.create()
            b = new element("button", "text-xs text-white grow p-2 me-2 button border border-gray-400 bg-gray-800", [{"key":"type", "value":"button"}], d.getNode(), `rule-${rule_index}-requirement-${requirement.index}-confirm`); b.create()
            i = new element("i", "fa fa-plus me-2", [], b.getNode()); i.create()
            s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent(translate(language, "Confirm rule"))
            //Add confirm rule click event
            b.getNode().addEventListener("click", click_save_rule)
            b = new element("button", "text-xs text-white grow p-2 ms-2 button border border-gray-400 bg-red-900", [{"key":"type", "value":"button"}], d.getNode(), `rule-${rule_index}-requirement-${requirement.index}-cancel`); b.create()
            i = new element("i", "fa fa-times me-2", [], b.getNode()); i.create()
            s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent(translate(language, "Cancel rule"))
            //Add cancel rule click event
            b.getNode().addEventListener("click", (e) => {
                //Restore workers to idle status.
                document.querySelectorAll(`#rule-${rule_index}-requirement-${requirement.index}-assignable-workers-area h2.assigned`).forEach((elem) => {
                    let citizen_index = elem.id.split("citizen-")[1]
                    document.querySelectorAll(`#citizen-${citizen_index}-status`).forEach((citizen_elem) => {
                        let citizen_gender = document.getElementById(`citizen-${citizen_index}-gender`).innerText.charAt(0)
                        citizen_elem.setAttribute("data-status", "idle")
                        citizen_elem.innerText = translate(language, "Idle", citizen_gender)
                        citizens[citizen_index].status = "idle"
                    })
                })
                let object_data = {"language": language, "parentId": "#accordion-landform-1-body", "location": "waterReservoir"}            
                let new_production_rule_panel = new panel("newRule", object_data, "active-production-rules", false, "actions")
                new_production_rule_panel.removePanel()
                new_production_rule_panel.showPreviousOptions()
            })
        } else {
            if(!document.querySelectorAll(`#rule-${rule_index}-requirement-${requirement.index}-assignable-workers-area h2.assigned`).length){
                document.getElementById(pid).remove()
                document.getElementById(did).remove()
            }
        
        }
    }
    let check_candidates = (requirement, rule_index, parent_elem) => {
        //Check if there exists citizens who accomplish current worker requirement.
        //Retrieve all available citizens.
        let required_worker_found = false, requirement_assigned_workers_div, requirement_assigned_workers
        let click_assigned = (e) => {
            toggle_assignable_worker(e)
            //Check if requirement is fullfilled
            let requiredWorkers = requirement.quantity
            requirement_assigned_workers = document.querySelectorAll(`#rule-${rule_index}-requirement-${requirement.index}-assignable-workers-area h2.assigned`).length
            if(requirement_assigned_workers >= requiredWorkers){
                //Mark requirement as fullfilled.
                document.querySelector(`#rule-${rule_index}-requirement-${requirement.index}-name`).classList.remove("bg-gray-700", "border-gray-500", "unaccomplished")
                document.querySelector(`#rule-${rule_index}-requirement-${requirement.index}-update`).classList.remove("bg-gray-700", "border-gray-500", "unaccomplished")
                document.querySelector(`#rule-${rule_index}-result`).classList.remove("bg-gray-700", "border-gray-500")
                document.querySelector(`#rule-${rule_index}-requirement-${requirement.index}-name`).classList.add("bg-green-700", "border-green-500")
                document.querySelector(`#rule-${rule_index}-requirement-${requirement.index}-update`).classList.add("bg-green-700", "border-green-500")
                document.querySelector(`#rule-${rule_index}-result`).classList.add("bg-green-700", "border-green-500")
                //Update result quantity
                let result_product_label = document.querySelector(`#rule-${rule_index}-result`).innerText
                let result_array = result_product_label.split(" x ")
                let result_product_object = document.querySelector(`#rule-${rule_index}-result`).getAttribute("data-object")
                let result_product_quantity = result_array[1]*1
                result_product_quantity = requirement_assigned_workers * product_rules[result_product_object].rules[rule_index-1].result.quantity
                document.querySelector(`#rule-${rule_index}-result`).innerText = translate(language, result_product_object, "", "capitalized")+" x "+result_product_quantity
            } else {
                //Unmark requirement as fullfilled.
                document.querySelector(`#rule-${rule_index}-requirement-${requirement.index}-name`).classList.remove("bg-green-700", "border-green-500")
                document.querySelector(`#rule-${rule_index}-requirement-${requirement.index}-update`).classList.remove("bg-green-700", "border-green-500")
                document.querySelector(`#rule-${rule_index}-result`).classList.remove("bg-green-700", "border-green-500")
                document.querySelector(`#rule-${rule_index}-requirement-${requirement.index}-name`).classList.add("bg-gray-700", "border-gray-500", "unaccomplished")
                document.querySelector(`#rule-${rule_index}-requirement-${requirement.index}-update`).classList.add("bg-gray-700", "border-gray-500", "unaccomplished")
                document.querySelector(`#rule-${rule_index}-result`).classList.add("bg-gray-700", "border-gray-500")
            }
            toggle_save_new_rule_panel(parent_elem, rule_index)
        }
        document.querySelectorAll(".citizen").forEach((elem) => {
            let citizen_index = elem.id.split("-")[2]
            //Get current role and status
            let loop_citizen_role = document.getElementById(`citizen-${citizen_index}-role`).getAttribute("data-role")
            let loop_citizen_status = document.getElementById(`citizen-${citizen_index}-status`).getAttribute("data-status") 
            //= citizens[citizen_index].status
            //An idle worker with required role found?
            if(loop_citizen_role == requirement.role && loop_citizen_status == "idle"){
                let loop_citizen_xp = document.getElementById(`citizen-${citizen_index}-xp`).getAttribute("data-xp")*1
                //Worker with required level of experience found?
                if(loop_citizen_xp >= requirement.xp){
                    //Check if worker has needed tools.
                    let has_tools_required = required_worker_found = true
                    requirement.tools.forEach((tool) => {
                        let left_hand_tool = document.getElementById(`citizen-${citizen_index}-leftHand`).getAttribute("data-tool")
                        let right_hand_tool = document.getElementById(`citizen-${citizen_index}-rightHand`).getAttribute("data-tool")
                        has_tools_required = (tool != left_hand_tool && tool != right_hand_tool)
                    })
                    required_worker_found &&= has_tools_required
                    let worker_already_listed = document.querySelector(`#rule-${rule_index}-requirement-${requirement.index}-assignable-workers-area h2#rule-${rule_index}-requirement-${requirement.index}-assignable-citizen-${citizen_index}`) != undefined
                    if(required_worker_found && !worker_already_listed){
                        //Add citizen as assignable worker for the rule requirement.
                        add_assignable_worker_to_rule_requirement(citizen_index, parent_elem.querySelector(".assignable-panel")/*d.getNode()*/)
                        requirement_assigned_workers = document.querySelectorAll(`#rule-${rule_index}-requirement-${requirement.index}-assignable-workers-area h2`).length
                        document.getElementById(`citizen-${citizen_index}-assign`).addEventListener("click", click_assigned)
                    }
                }
            }
        })
        requirement_assigned_workers_div = document.querySelector(`#rule-${rule_index}-requirement-${requirement.index}-assignable-workers-area`)
        requirement_assigned_workers = requirement_assigned_workers_div.querySelectorAll("h2").length
        if(!requirement_assigned_workers && requirement_assigned_workers_div.querySelector("p.empty") == undefined){
            p = new element("p", "empty ms-1 mb-1 text-xs flex justify-between text-gray-200", [], requirement_assigned_workers_div); p.create()
            s = new element("span", "", [], p.getNode()); s.create()
            i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
            s.appendHTML(translate(language, "No workers available"))
        }
    }
    let process_citizen_requirement = (rule_index, requirement, elem) => {
        let click_refresh = (e) => {
            process_citizen_requirement(rule_index, requirement, elem)
            document.getElementById(`rule-${rule_index}-refresh-assignable-workers`).removeEventListener("click", click_refresh)
        }
        let parent_elem = elem.closest("div")
        pid = `rule-${rule_index}-requirement-${requirement.index}-assignable-workers-title`
        //If assignable workers panel is not shown, display it
        if(document.getElementById(`rule-${rule_index}-refresh-assignable-workers`) == undefined){
            //Add assignable workers title.
            p = new element("p", "items-center text-xs flex justify-between p-1 ps-3 text-gray-200 bg-gray-700", [], parent_elem, pid); p.create()
            s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Assignable workers"))
            i = new element("i", "fa fa-rotate", [], p.getNode(), `rule-${rule_index}-refresh-assignable-workers`); i.create()
            //Add assignable workers area.
            did = `rule-${rule_index}-requirement-${requirement.index}-assignable-workers-area`
            d = new element("div", "assignable-panel new-rule assignable-workers bg-gray-500 text-xs p-2 pb-1", [], parent_elem, did); d.create()
        }
        //Add refresh click event
        document.getElementById(`rule-${rule_index}-refresh-assignable-workers`).removeEventListener("click", click_refresh)
        document.getElementById(`rule-${rule_index}-refresh-assignable-workers`).addEventListener("click", click_refresh)
        check_candidates(requirement, rule_index, parent_elem)
    }
    if(click_target.closest("span").classList.contains("unSelected")){
        rule_index = click_target.closest("div").getAttribute("data-rule-index")
        if(requirement.type == "citizen"){
            process_citizen_requirement(rule_index, requirement, elem)
        }
    }
}
//Display all rule requirements
//Receives: rule as object, rule_index as id, clicked_product as DOM element, current_mount
const new_rule_iterate_requirements = (rule, rule_index, clicked_product, current_mount = false) => {
    const get_product_name_parent = (requirement) => {
        if(!requirement.consumable){
            sid = `rule-${rule_index}-requirement-${requirement.index}`
            s = new element("span", "flex items-center", [], p.getNode(), sid); s.create()
            i1 = new element("i", "p-1 mb-0 text-lg fa fa-bracket-square", [], s.getNode()); i1.create()
            i2 = new element("i", "p-1 mb-0 text-lg fa fa-bracket-square-right", [], s.getNode());
            return s.getNode()
        } else return p.getNode()
    }
    //Iterate over al requirements for that rule.
    p = new element("p", "flex justify-start flex-wrap w-100 p-1 text-gray-300", [], d1.getNode()); p.create()
    let requirements_quantity = rule.requirements.length, requirement_index = 1
    let product_name_parent
    rule.requirements.forEach((requirement) => {
        requirement.index = requirement_index
        //Check if square brackes are needed (when requirement object is not something daily consumable)
        product_name_parent = get_product_name_parent(requirement)
        //Create span with product name, add square brackets in case it's not consumable
        //Check if current requirement is fullfilled.
        let location_requirement_fullfilled = (requirement.object == current_mount)
        let bg_class = location_requirement_fullfilled ? "border-green-500 bg-green-700" : "border-gray-500 bg-gray-700"
        sid = `rule-${rule_index}-requirement-${requirement_index}`+(product_name_parent == p.getNode() ? "" : "-name")
        s = new element("span", `rule-requirement px-2 py-0.5 mb-0 font-bold border ${bg_class}`, [], product_name_parent, sid); s.create()
        let requirement_object_name = translate(language, requirement.object, "", "capitalized")
        //Check if a minimal xp value is needed
        let XP_requirement = requirement.xp ? ` (${requirement.xp})` : ""
        //Check if a tool is needed (max 2 in both worker's hands)
        let tool_requirement_1 = requirement.tools != undefined && requirement.tools.length ? requirement.tools[0] : ""
        let tool_requirement_2 = tool_requirement_1 && requirement.tools.length > 1 ? requirement.tools[1] : ""
        let tool_requirement = tool_requirement_1 ? ` + ${translate(language, requirement.tools[0], "", "capitalized")}` : ""
        tool_requirement += tool_requirement_2 ? ` + ${translate(language, requirement.tools[1], "", "capitalized")}` : ""
        let requirement_name = requirement_object_name + XP_requirement + tool_requirement
        requirement_object_name = tool_requirement ? `(${requirement_name})` : requirement_name
        //Show requirement name and quantity
        s.appendContent(requirement_object_name)
        s.appendHTML(` x ${requirement.quantity}`)
        if(!location_requirement_fullfilled){
            sid = `rule-${rule_index}-requirement-${requirement_index}-update`
            s = new element("span", `px-2 py-0.5 mb-0 font-bold border unaccomplished unSelected ${bg_class}`, [], product_name_parent, sid); s.create()
            i = new element("i", "px-1 text-sm fa fa-arrow-down", [], s.getNode()); i.create()
            //Add click event to requirement arrow button.
            document.querySelectorAll(".unaccomplished").forEach((elem) => {
                elem.addEventListener("click", (e) => {
                    new_rule_click_requirement(e.target, requirement, elem)
                    //e.target.closest("span").classList.remove("unSelected")
                })
            })
        }
        if(!requirement.consumable){ i2.create()}
        if(requirement_index < requirements_quantity){
            i = new element("i", "text-lg p-1 mb-0 fa fa-plus", [], p.getNode()); i.create()
        }
        requirement_index++
    })
    //Result
    s = new element("span", "grow flex items-center", [], p.getNode()); s.create()
    i = new element("i", "text-lg p-1 px-2 mb-0 fa fa-arrow-right", [], s.getNode()); i.create()
    s1id = `rule-${rule_index}-result`
    s1 = new element("span", "rule-result p-1 px-2 py-0.5 mb-0 font-bold border border-gray-500 bg-gray-700", [{"key":"data-object", "value":clicked_product}], s.getNode(), s1id); s1.create()
    s1.appendContent(translate(language, clicked_product, "", "capitalized")); s1.appendHTML(` x ${rule.result.quantity}`)
    enable_accordion_click(b.getNode())
}
const new_rule_iterate_all_product_available_rules = (clicked_product, current_mount) => {
    let location_product_rules = product_rules[clicked_product].rules
    //Iterate over all rules for that selected product.
    //Build product rules accordions with a rule inside.
    let rule_index = 1
    let parent_div = document.querySelector("#active-production-rules-newRule")
    d = new element("div", "p-2", [{"key": "data-accordion", "value": "collapse"}], parent_div, "accordion-new-production-rules"); d.create()
    location_product_rules.forEach((rule) => {
        h2 = new element("h2", "mt-1 border border-gray-800", [], d.getNode(), `accordion-new-production-rule-${rule_index}-header`); h2.create()
        b = new element("button", "unattached-click flex items-center justify-between w-full py-1 px-3 text-xs font-medium border border-gray-800 gap-3 bg-gray-100 bg-gray-800 text-white", [{"key": "type", "value": "button"}, {"key": "aria-expanded", "value": "true"}, {"key": "data-accordion-target", "value": `#accordion-new-production-rule-${rule_index}-body`}, {"key": "aria-controls", "value": `accordion-new-production-rule-${rule_index}-body`}], h2.getNode())
        b.create();
        s = new element("span", "", [], b.getNode()); s.create()
        s1 = new element("span", "", [{"key": "data-i18n", "value": ""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Production rule for"))
        s1.appendHTML(":")
        s1 = new element("span", "ms-1 text-blue-400", [{"key":"data-object", "value":clicked_product}, {"key":"data-rule", "value":rule_index}], s.getNode(), `rule-${rule_index}-object`); s1.create(); s1.appendContent(translate(language, clicked_product, "", "uppercase"))
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        d1 = new element("div", "bg-gray-500 border border-gray-800 hidden", [{"key": "aria-labelledby", "value": `accordion-new-production-rule-${rule_index}-header`},{"key": "data-rule-index", "value": rule_index}], d.getNode(), `accordion-new-production-rule-${rule_index}-body`); d1.create()
        new_rule_iterate_requirements(rule, rule_index, clicked_product, current_mount)
        //Select rule requirement
        rule_index++
    })
}
const accordion_landforms = () => {
    let build_actions_available = () => {
        //Actions available
        d2 = new element("div", "border border-gray-800 bg-gray-500 text-xs", [], d1.getNode(), "active-production-rules-actions-title"); d2.create()
        p = new element("p", "flex justify-between p-1 ps-2 text-xs text-gray-200 bg-gray-800", [], d2.getNode()); p.create()
        s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent("Actions available")
        i = new element("i", "mt-0 text-base fa fa-times invisible font-bold", [], p.getNode()); i.create()
        //Landform's actions
        d2 = new element("div", "border border-gray-800 bg-gray-600 text-xs", [], d1.getNode(), "active-production-rules-actions"); d2.create()
        p = new element("p", "flex w-100 justify-between p-1 text-gray-500 text-gray-300", [], d2.getNode()); p.create()
        b = new element("button", "text-xs text-white grow p-2 button border border-gray-400 bg-gray-800", [], p.getNode(), "newProductionRule"); b.create()
        i = new element("i", "fa fa-search me-2", [], b.getNode()); i.create()
        s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent("New production rule")
        b.getNode().addEventListener("click", (e) => {
            let object_data = {"language": language, "parentId": "#accordion-landform-1-body", "location": "waterReservoir"}
            //Build new production rule panel
            let new_production_rule_panel = new panel("newRule", object_data, "active-production-rules", false, "actions")
            new_production_rule_panel.hidePreviousOptions()
            new_production_rule_panel.buildPanel()
            //For each button with a product rule, add a click event
            document.querySelectorAll(".rule_product").forEach((button) => {
                button.addEventListener("click", (e) => {
                    let clicked_product = e.target.closest("button").getAttribute("data-product")
                    //Remove product buttons.
                    document.querySelectorAll("#new-rule-title, #new-rule-products").forEach((elem) => elem.remove())
                    let current_mount = "Water reservoir"
                    //Iterate over all manufacturable products in a water reservoir
                    location_products["waterReservoir"]["EN"].forEach((location_product) => {
                        if(location_product == clicked_product){
                            new_rule_iterate_all_product_available_rules(clicked_product, current_mount)
                        }
                    })
                })
            })
        })
    }
    let build_landforms_accordion = () => {
        //Build landforms accordion
        let parent_elem = document.getElementById("accordion-menu")
        //Build landforms accordion header
        h2 = new element("h2", "mt-3", [], parent_elem, "accordion-menu-landform"); h2.create()
        b = new element("button", "flex items-center justify-between w-full py-2 px-3 bg-gray-900 font-medium text-gray-400 border border-gray-700 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-landform-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-landform-body"}], h2.getNode())
        b.create()
        s = new element("span", "", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent("Landform")
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        //Build landforms accordion body
        d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-menu-landform"}], parent_elem, "accordion-menu-landform-body"); d1.create()
        d2 = new element("div", "py-1 border border-gray-700 bg-gray-700", [], d1.getNode(), "accordion-landform-1-header"); d2.create()
        d = new element("div", "mx-1", [{"key":"data-accordion","value":"collapse"}], d2.getNode(), "accordion-landforms"); d.create()
        //Build landform 1 accordion header
        h2 = new element("h2", "notificationUnread", [], d.getNode(), "accordion-landform-1-header"); h2.create()
        b = new element("button", "flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 font-medium border border-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-landform-1-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-landform-1-body"}], h2.getNode())
        b.create()
        s = new element("span", "", [], b.getNode()); s.create()
        s1 = new element("span", "new text-xs font-medium px-1.5 py-0.5 hidden rounded-sm bg-blue-900 text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
        s1.create(); s1.appendContent("NEW")
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Water reservoir")
        b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
        //Build landform 1 accordion body
        d1 = new element("div", "waterReservoir border border-gray-800 hidden", [{"key":"aria-labelledby","value":"accordion-landform-1-header"}], d.getNode(), "accordion-landform-1-body")
        d1.create()
        //Build water reservoir info
        //First column
        d2 = new element("div", "p-2 px-3 bg-gray-600 text-xs", [], d1.getNode(), "landform-1-info")
        d2.create();
        p = new element("p", "text-xs flex justify-between text-gray-200", [], d2.getNode()); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Type")
        sp = new element("span", "", [], s.getNode()); sp.create(); sp.appendContent(": ")
        s1 = new element("span", "font-bold", [{"key":"data-i18n","value":""}], s.getNode(), "landform-1-type"); s1.create()
        s1.appendContent(colony_water_reservoir)
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

        p = new element("p", "text-xs flex justify-between text-gray-200", [], d2.getNode()); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Daily water income")
        sp = new element("span", "", [], s.getNode()); sp.create(); sp.appendContent(": ")
        s1 = new element("span", "font-bold", [{"key":"data-i18n","value":""}], s.getNode(), "landform-1-water-income"); s1.create()
        s1.appendContent(water_reservoirs[colony_water_reservoir]["daily-water-income"])
        s1 = new element("span", "ms-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("per water bearer")
        p = new element("p", "text-xs flex justify-between text-gray-200", [], d2.getNode()); p.create()
        s = new element("span", "", [], p.getNode()); s.create();
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Daily food income")
        sp = new element("span", "", [], s.getNode()); sp.create(); sp.appendContent(": ")
        s1 = new element("span", "font-bold", [{"key":"data-i18n","value":""}], s.getNode(), "landform-1-food-income"); s1.create()
        s1.appendContent(water_reservoirs[colony_water_reservoir]["daily-food-income"])
        s1 = new element("span", "ms-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("per fisherman")

        //Build Assignable Workers title
        d2 = new element("div", "border-t border-b border-gray-800 bg-gray-600 text-xs", [], d1.getNode(), "landform-1-assignable-workers-title")
        d2.create();
        p = new element("p", "items-center text-xs flex justify-between p-1 ps-3 text-gray-200 bg-gray-700", [], d2.getNode()); p.create()
        s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("Permanently assignable workers")
        i = new element("i", "fa fa-rotate", [], p.getNode(), `landform-1-refresh-assignable-workers`); i.create()
        i.getNode().addEventListener("click", (e) => {
            //Remove no available workers message if exist
            document.querySelectorAll(".waterReservoir .assignable-workers .empty").forEach((elem) => elem.remove())
            //Check if there are new assignable workers
            let assignable_worker_found = false
            document.querySelectorAll(".citizen").forEach((elem) => {
                let citizen_index = elem.id.split("-")[2]
                let citizen_role = document.getElementById(`citizen-${citizen_index}-role`).getAttribute("data-role")
                let citizen_status = document.getElementById(`citizen-${citizen_index}-status`).getAttribute("data-status")
                let citizen_already_listed = document.getElementById(`waterReservoir-assignable-citizen-${citizen_index}`) != undefined
                if(["waterbearing", "fishing"].includes(citizen_role) && citizen_status == "idle" && !citizen_already_listed){
                    assignable_worker_found = true
                    add_assignable_worker_to_mount(citizen_index, "waterReservoir")
                    document.getElementById(`waterReservoir-citizen-${citizen_index}-assign`).addEventListener("click", 
                        toggle_assignable_worker
                    )
                }
                assignable_worker_found ||= citizen_already_listed
            })
            if(!assignable_worker_found){
                let parent_div = document.querySelector(".waterReservoir .assignable-workers")
                p = new element("p", "empty ms-1 mb-1 text-xs flex justify-between text-gray-200", [], parent_div); p.create()
                s = new element("span", "", [], p.getNode()); s.create()
                i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No workers available"))
            }
        })
        //Build Assignable Workers area
        d2 = new element("div", "assignable-workers p-2 pb-1 ps-3 bg-gray-600 text-xs", [], d1.getNode(), "landform-1-assignable-workers")
        d2.create();
        p = new element("p", "empty text-xs flex justify-between text-gray-200", [], d2.getNode()); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}, {"key":"gender","value":"n"}], s.getNode()); s1.create(); s1.appendContent("None")
        //Build Active Production Rules title
        d2 = new element("div", "border-t border-b border-gray-800 bg-gray-600 text-xs", [], d1.getNode(), "landform-1-active-production-rules-title")
        d2.create();
        p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200 bg-gray-700", [], d2.getNode()); p.create()
        s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Active production rules"))
        //Build Active Production Rules area
        d2 = new element("div", "active-production-rules p-2 bg-gray-600 text-xs", [], d1.getNode(), "landform-1-active-production-rules"); d2.create()
        p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-200", [], d2.getNode()); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""},{"key":"gender","value":"f"}], s.getNode()); s1.create(); s1.appendContent(translate(language, "None", "f"))
    }
    build_landforms_accordion()
    build_actions_available()
}
const accordion_expeditions = () => {
    let d
    let build_actions_available = () => {
        //Actions available
        d1 = new element("div", "border border-gray-800 bg-gray-500 text-xs", [], d.getNode(), "expeditions-actions-title"); d1.create()
        p = new element("p", "flex justify-between p-1 ps-2 text-xs text-gray-200 bg-gray-800", [], d1.getNode()); p.create()
        s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent("Actions available")
        i = new element("i", "mt-0 text-base fa fa-times invisible font-bold", [], p.getNode()); i.create()
        //Expeditions actions
        d1 = new element("div", "border border-gray-800 bg-gray-600 text-xs", [], d.getNode(), "expeditions-actions"); d1.create()
        p = new element("p", "flex w-100 justify-between p-1 text-gray-300", [], d1.getNode()); p.create()
        b = new element("button", "text-xs grow p-2 button border border-gray-400 bg-gray-800", [], p.getNode(), "newExpedition"); b.create()
        i = new element("i", "fa fa-plus me-2", [], b.getNode()); i.create()
        s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent("New expedition")
        b.getNode().addEventListener("click", function(e){
            let objectData = {"language": language, "parentId": "#expeditions"}
            //Build panel
            newExpeditionPanel = new panel("newExpedition", objectData, "expeditions", false, "actions")
            newExpeditionPanel.hidePreviousOptions()
            newExpeditionPanel.buildPanel()
        })
    }
    //Build expeditions accordion
    let parentElem = document.getElementById("accordion-menu")
    //Build expeditions accordion header
    h2 = new element("h2", "mt-3", [], parentElem, "accordion-menu-expeditions"); h2.create()
    b = new element("button", "flex items-center justify-between w-full py-2 px-3 bg-gray-900 font-medium border border-gray-700 text-gray-400 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-expeditions-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-expeditions-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent("Expeditions")
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build expeditions accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-menu-expeditions"}], parentElem, "accordion-menu-expeditions-body"); d1.create()
    d2 = new element("div", "py-1 border border-gray-700 bg-gray-700", [], d1.getNode()); d2.create()
    d = new element("div", "mx-1", [{"key":"data-accordion","value":"collapse"}], d2.getNode(), "expeditions"); d.create()

    //Build Succesfully expeditions title
    d1 = new element("div", "border border-gray-800 bg-gray-800 text-xs", [], d.getNode(), "active-expeditions-title")
    d1.create();
    p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200", [], d1.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("Succesfully expeditions")
    //Build Successfully expeditions area
    d1 = new element("div", "activeExpeditions p-2 ps-2 mb-2 border border-gray-800 bg-gray-600 text-xs", [], d.getNode(), "successfully-expeditions-area")
    d1.create();
    p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-200", [], d1.getNode()); p.create()
    s = new element("span", "", [], p.getNode()); s.create()
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Resources expeditions");
    s1 = new element("span", "", [], s.getNode()); s1.create(); s1.appendContent(": ");
    s1 = new element("span", "font-bold", [], s.getNode(), "resourcesSuccessfullExpeditions"); s1.create(); s1.appendContent("0")
    s = new element("span", "", [], p.getNode()); s.create()
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent("Ruins expeditions");
    s1 = new element("span", "", [], s.getNode()); s1.create(); s1.appendContent(": ");
    s1 = new element("span", "font-bold", [], s.getNode(), "ruinsSuccessfullExpeditions"); s1.create(); s1.appendContent("0")
    //Build Active expeditions title
    d1 = new element("div", "border border-gray-800 bg-gray-800 text-xs", [], d.getNode(), "active-expeditions-title")
    d1.create();
    p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200", [], d1.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent("Active expeditions")
    //Build Active expeditions area
    d1 = new element("div", "activeExpeditions p-2 ps-2 mb-2 border border-gray-800 bg-gray-600 text-xs", [], d.getNode(), "active-expeditions-area")
    d1.create();
    p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-200", [], d1.getNode()); p.create()
    s = new element("span", "", [], p.getNode()); s.create()
    i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
    s1 = new element("span", "", [{"key":"data-i18n","value":""},{"key":"gender","value":"f"}], s.getNode()); s1.create(); s1.appendContent("None")
    
    build_actions_available()
}
const accordion_productions = () => {
    const build_product_category_accordions = () => {
        //Build products category accordions
        parentElem = d.getNode()
        Object.keys(categorized_products).forEach((category, index) => {
            let category_name = category.charAt(0).toUpperCase()+category.slice(1)
            //Build productions categories accordion header
            h2 = new element("h2", `${index ? "mt-1" : ""}`, [], parentElem, `accordion-productions-category-${index+1}`); h2.create()
            b = new element("button", "flex items-center justify-between w-full py-1 px-3 bg-gray-900 font-medium border border-gray-900 text-xs text-gray-400 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-productions-category-${index+1}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-productions-category-${index+1}-body`}], h2.getNode())
            b.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent(category_name)
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            //Build productions categories accordion body
            d1 = new element("div", "border border-gray-800 bg-gray-500 p-1 hidden gap-2", [{"key":"aria-labelledby","value":`accordion-productions-category-${index+1}`}], parentElem, `accordion-productions-category-${index+1}-body`); d1.create()
            let subcategories = categorized_products[category]["subcategories"]
            d = new element("div", "mx-1 border border-gray-700", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-productions-category-${index+1}-subcategories`); d.create()
            Object.keys(subcategories).forEach((subcategory, s_index) => {
                //Format certain subcategories.
                let translatable_subcategory = subcategory == "waterReservoir" ? "Water reservoir" : subcategory
                //Build productions subcategories accordion header
                h2 = new element("h2", "my-1", [], d.getNode(), `accordion-productions-category-${index+1}-sub-${s_index+1}`); h2.create()
                b = new element("button", "flex items-center justify-between w-full py-1 px-3 bg-gray-900 font-medium border border-gray-700 text-xs text-gray-400 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-productions-category-${index+1}-sub-${s_index+1}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-productions-category-${index+1}-sub-${s_index+1}-body`}], h2.getNode())
                b.create()
                s = new element("span", "capital", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent(translatable_subcategory)
                b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
                //Build productions subcategories accordion body
                d2 = new element("div", "hidden", [{"key":"aria-labelledby","value":`accordion-productions-category-${index+1}-sub-${s_index+1}`}], d.getNode(), `accordion-productions-category-${index+1}-sub-${s_index+1}-body`); d2.create()
                
                let products = categorized_products[category]["subcategories"][subcategory][language]
                d = new element("div", "mx-1 border border-gray-700", [{"key":"data-accordion","value":"collapse"}], d2.getNode(), `accordion-productions-category-${index+1}-subcategory-${s_index+1}-products`); d.create()
                products.forEach((product, p_index) => {
                    //Build productions products accordion header
                    h2 = new element("h2", "my-1", [], d.getNode(), `accordion-productions-category-${index+1}-sub-${s_index+1}-product-${p_index+1}`); h2.create()
                    b = new element("button", "flex items-center justify-between w-full py-1 px-3 bg-gray-900 font-medium border border-gray-700 text-xs text-gray-400 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-productions-category-${index+1}-sub-${s_index+1}-product-${p_index+1}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-productions-category-${index+1}-sub-${s_index+1}-product-${p_index+1}-body`}], h2.getNode())
                    b.create()
                    s = new element("span", "capital", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent(product)
                    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
                    //Build productions products accordion body
                    d2 = new element("div", "hidden", [{"key":"aria-labelledby","value":`accordion-productions-category-${index+1}-sub-${s_index+1}-product-${p_index+1}`}], d.getNode(), `accordion-productions-category-${index+1}-sub-${s_index+1}-product-${p_index+1}-body`); d2.create()
                    p = new element("p", "flex justify-between text-sm pt-1 text-gray-400", [{"key":"data-i18n","value":""}], d2.getNode()); p.create(); p.appendContent("blabla")
                })
            })
        })
    }
    const build_actions_available = () => {
        //Actions available
        let parent_elem = document.getElementById("accordion-menu-productions-body")
        d2 = new element("div", "border border-gray-800 bg-gray-500 text-xs", [], parent_elem, "productions-actions-title"); d2.create()
        p = new element("p", "flex justify-between p-1 ps-2 text-xs text-gray-200 bg-gray-800", [], d2.getNode()); p.create()
        s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent("Actions available")
        i = new element("i", "mt-0 text-base fa fa-times invisible font-bold", [], p.getNode()); i.create()
        //Production's actions
        d2 = new element("div", "border border-gray-800 bg-gray-600 text-xs", [], parent_elem, "productions-actions"); d2.create()
        p = new element("p", "flex w-100 justify-between p-1 text-gray-500 text-gray-300", [], d2.getNode()); p.create()
        b = new element("button", "text-xs text-white grow p-2 button border border-gray-400 bg-gray-800", [], p.getNode(), "newProductionRule"); b.create()
        i = new element("i", "fa fa-search me-2", [], b.getNode()); i.create()
        s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent("New production rule")
    }
    //Build productions accordion
    let d1
    let parentElem = document.getElementById("accordion-menu")
    //Build productions accordion header
    h2 = new element("h2", "mt-3", [], parentElem, "accordion-menu-productions"); h2.create()
    b = new element("button", "flex items-center justify-between w-full py-2 px-3 bg-gray-900 font-medium border border-gray-700 text-gray-400 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-productions-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-productions-body"}], h2.getNode())
    b.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], b.getNode()); s.create(); s.appendContent("Productions")
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build productions accordion body
    d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-menu-productions"}], parentElem, "accordion-menu-productions-body"); d1.create()
    d2 = new element("div", "py-1 border border-gray-700 bg-gray-700", [], d1.getNode()); d2.create()
    d = new element("div", "mx-1 ", [{"key":"data-accordion","value":"collapse"}], d2.getNode(), "productions"); d.create()
    
    build_product_category_accordions()  
    build_actions_available()
}
//Build modal popup
const modal_popup = (modalTitle, modalType, modalData = {}) => {
    let parent = document.getElementById("modalBody")
    const format_popup = () => {
        //Adjust style if it's a functional modal or information modal.
        if(modalData.modalStyle == "small"){
            document.querySelector("#modalTitle").classList.remove("text-xl")
            document.querySelector("#modalTitle").classList.add("text-base")
            document.querySelector("#modalTitle").parentElement.classList.remove("p-4", "py-2", "ps-4")
            document.querySelector("#modalTitle").parentElement.classList.add("py-2", "ps-4")
            document.querySelector("#modalBody").classList.remove("p-4", "py-1", "px-4")
            document.querySelector("#modalBody").classList.add("py-1", "px-4")
        } else {
            document.querySelector("#modalTitle").classList.remove("text-base")
            document.querySelector("#modalTitle").classList.add("text-xl")
            document.querySelector("#modalTitle").parentElement.classList.remove("text-base", "py-2", "ps-4", "p-4")
            document.querySelector("#modalTitle").parentElement.classList.add("text-xl", "p-4")
            document.querySelector("#modalBody").classList.remove("py-1", "px-4", "p-4")
            document.querySelector("#modalBody").classList.add("p-4")
        }
    }
    parent.innerHTML = ""
    let popupCannotChangeRole = () => {
        p = new element("p", "text-base py-2 text-gray-400", [{"key":"data-i18n","value":""}], parent)
        p.create(); p.appendContent(translate(language, "You cannot change this citizen's role because his or her status is not \"idle\"."))
        p.create(); p.appendContent(translate(language, "Please, first deassign him or her from his or her current duty."))
        document.getElementById("modalFooterButton1").innerText = translate(language, "Ok")
    }
    let popupZoneSearched = () => {
        p = new element("p", "text-base py-2 text-gray-400", [{"key":"data-i18n","value":""}], parent)
        p.create(); p.appendContent(translate(language, "Your citizens have already searched all the zone and they discovered many new things."))
        p = new element("p", "text-base py-2 text-gray-400", [{"key":"data-i18n","value":""}], parent)
        p.create(); p.appendContent(translate(language, "Please, read the notification you received in your News panel to check the report of your citizen's research."))
        document.getElementById("modalFooterButton1").innerText = translate(language, "Ok")
    }
    let popupViewCitizenInfo = () => {
        p = new element("p", "flex justify-between text-sm pt-1 text-gray-400", [{"key":"data-i18n","value":""}], parent); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "Gender", "", "capitalized"))
        s1.appendHTML(": ")
        s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(translate(language, modalData.gender, "", "capitalized"))
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "Status", "", "capitalized"))
        s1.appendHTML(": ")
        s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(translate(language, modalData.status, "", "capitalized"))
        p = new element("p", "flex justify-between text-sm pt-1 text-gray-400", [{"key":"data-i18n","value":""}], parent); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "Role", "", "capitalized"))
        s1.appendHTML(": ")
        s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(translate(language, modalData.role, "", "capitalized"))
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "Experience", "", "capitalized"))
        s1.appendHTML(": ")
        s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(Math.floor(modalData.xp).toString())
        p = new element("p", "flex justify-between text-sm pt-1 text-gray-400", [{"key":"data-i18n","value":""}], parent); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "Birth week", "", "capitalized"))
        s1.appendHTML(": ")
        s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(modalData.birthWeek.toString())
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "Age", "", "capitalized"))
        s1.appendHTML(": ")
        s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(modalData.ageYears.toString())
        s1 = new element("span", "ms-1", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "years")); s1.appendHTML(", ")
        s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(modalData.ageWeeks.toString())
        s1 = new element("span", "ms-1", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "weeks"))
        p = new element("p", "flex justify-between text-sm pt-1 text-gray-400", [{"key":"data-i18n","value":""}], parent); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "Left hand", "", "capitalized"))
        s1.appendHTML(": ")
        let left_hand_object = !modalData.leftHand.toString() ? translate(language, "empty", "f", "capitalized") : translate(language, modalData.leftHand.toString())
        s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(left_hand_object)
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "Right hand", "", "capitalized"))
        s1.appendHTML(": ")
        let right_hand_object = !modalData.leftHand.toString() ? translate(language, "empty", "f", "capitalized") : translate(language, modalData.rightHand.toString())
        s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(right_hand_object)
        p = new element("p", "flex justify-between text-sm pt-1 text-gray-400", [{"key":"data-i18n","value":""}], parent); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "Outfit", "", "capitalized"))
        s1.appendHTML(": ")
        let outfit = modalData.outfit ? translate(language, "yes", "", "capitalized") : translate(language, "no", "", "capitalized")
        s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(outfit)
        s = new element("span", "", [], p.getNode()); s.create()
        s1 = new element("span", "", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "Fertility", "", "capitalized"))
        s1.appendHTML(": ")
        s1 = new element("span", "font-bold", [], s.getNode()); s1.create(); s1.appendContent(modalData.fertility.toString())
        d = new element("div", "my-2 px-2 pb-1 border border-gray-800 rounded bg-gray-600 text-ms text-white", [], parent); d.create()
        p = new element("p", "mt-1 text-sm", [], d.getNode()); p.create(); p.appendContent(translate(language, "Atributos propios"))
        p = new element("p", "gap-3 flex justify-between", [], d.getNode()); p.create()
        modalData.attributes.forEach((attribute) => {
            let eng_attribute = translate("EN", attribute, "", formatResult = "", changeLanguage = false)
            s = new element("span", `grow mt-1 px-1 text-center border border-gray-800 rounded bg-gray-700 text-xs font-bold ${attributes_colors["EN"][eng_attribute]}`, [], p.getNode()); s.create(); s.appendContent(translate(language, attribute, "", "uppercase"))
        })
        p = new element("p", "mt-1 text-sm", [], d.getNode()); p.create(); p.appendContent("Atributos deseados")
        p = new element("p", "gap-3 flex justify-between", [], d.getNode()); p.create()
        modalData.wishedAttributes.forEach((attribute) => {
            let eng_attribute = translate("EN", attribute, "", formatResult = "", changeLanguage = false)
            s = new element("span", `grow mt-1 px-1 text-center border border-gray-800 rounded bg-gray-700 text-xs font-bold ${attributes_colors["EN"][eng_attribute]}`, [], p.getNode()); s.create(); s.appendContent(translate(language, attribute, "", "uppercase"))
        })
        p = new element("p", "mt-1 text-sm", [], d.getNode()); p.create(); p.appendContent("Atributo no deseado")
        p = new element("p", "gap-3 flex justify-between", [], d.getNode()); p.create()
        let eng_attribute = translate("EN", modalData.hatedAttribute, "", formatResult = "", changeLanguage = false)
        s = new element("span", `mt-1 px-2 text-center border border-gray-800 rounded bg-gray-700 text-xs font-bold ${attributes_colors["EN"][eng_attribute]}`, [], p.getNode()); s.create(); s.appendContent(translate(language, modalData.hatedAttribute, "", "uppercase"))
        document.getElementById("modalFooterButton1").innerText = translate(language, "Ok")
    }
    format_popup()
    //Build modal pop up structure
    document.getElementById("modalTitle").innerHTML = translate(language, modalTitle)
    //Build popup body
    if(modalType == "ZoneSearched"){ popupZoneSearched() }
    if(modalType == "RoleCitizenBusy"){ popupCannotChangeRole() }
    if(modalType == "ViewCitizenInfo"){ popupViewCitizenInfo() }
}
const build_active_expedition = (parentElem, expeditionData = {}) => {
    //Build current active expeditions
    //Remove "No active expeditions" text if exists.
    if(document.querySelector("#"+parentElem.id+" > p") != null){
        document.querySelector("#"+parentElem.id+" > p").remove()
    }
    //Expedition type text
    let expeditionType = expeditionData.type == "of resources" ? "Resources" : "Ruins"
    //Build current expedition accordion header
    d2 = new element("div", "accordion-active-expedition", [{"key":"data-accordion", "value":"collapse"}], parentElem, "accordion-expedition-"+expeditionData.id); d2.create()
    h2 = new element("h2", expeditionType.toLowerCase()+"Expedition", [], d2.getNode(), "accordion-expedition-"+expeditionData.id+"-header"); h2.create()
    b = new element("button", "unattached-click flex items-center justify-between w-full py-2 px-3 bg-gray-900 font-medium border border-gray-700 text-gray-400 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-expedition-"+expeditionData.id+"-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-expedition-"+expeditionData.id+"-body"}], h2.getNode())
    b.create()
    enable_accordion_click(b.getNode())
    s = new element("span", "", [], b.getNode()); s.create()
    i = new element("i", "fa fa-beat fa-location-dot mt-1 me-2", [], s.getNode()); i.create()
    s1 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, expeditionType+" expedition"))
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(" #"+expeditionData.id)
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build current expedition accordion body
    d3 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-expedition-"+expeditionData.id+"-header"}], d2.getNode(), "accordion-expedition-"+expeditionData.id+"-body"); d3.create()
    d4 = new element("div", "py-1 border border-gray-700 bg-gray-700", [], d3.getNode()); d4.create()
    d5 = new element("div", "", [{"key":"data-accordion","value":"collapse"}], d4.getNode(), "expedition-"+expeditionData.id); d5.create()
    //Departure date...
    p = new element("p", "mx-1 py-1 empty text-xs text-gray-200", [], d5.getNode()); p.create()
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Departed in"))
    s1 = new element("span", "", [], p.getNode()); s1.create(); s1.appendContent(": ")
    s1 = new element("span", "px-1 ms-2 rounded border border-gray-500", [], p.getNode()); s1.create()
    s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendHTML(translate(language, "Year"))
    s2 = new element("span", "mx-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), "expedition-"+expeditionData.id+"-departed-year"); s2.create(); s2.appendHTML(expeditionData.departedIn.year)
    s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendHTML(translate(language, "Week"))
    s2 = new element("span", "mx-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), "expedition-"+expeditionData.id+"-departed-week"); s2.create(); s2.appendHTML(expeditionData.departedIn.week)
    s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendHTML(translate(language, "Day"))
    s2 = new element("span", "mx-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), "expedition-"+expeditionData.id+"-departed-day"); s2.create(); s2.appendHTML(expeditionData.departedIn.day)
    s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendHTML(expeditionData.departedIn.hour.toString().padStart(2, "0"))
    s2 = new element("span", "ms-1", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendHTML("hs.") 
    //Returns in...
    p = new element("p", "mx-1 py-1 empty text-xs text-gray-200", [], d5.getNode()); p.create()
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Returns in"))
    s1 = new element("span", "", [], p.getNode()); s1.create(); s1.appendContent(": ")
    s2 = new element("span", "countdownTime activeExpedition px-1 ms-2 rounded border border-gray-500", [], p.getNode()); s2.create()
    let hiddenClass = (expeditionData.returnsIn.years ? "" : "hidden ")
    s1 = new element("span", hiddenClass+"countdown years font-bold", [{"key":"data-i18n","value":""}], s2.getNode(), "expedition-"+expeditionData.id+"-pending-years"); s1.create(); s1.appendHTML(expeditionData.returnsIn.years)
    let yearsText = expeditionData.returnsIn.years != 1 ? translate(language, "Years", "", "lowercase") : translate(language, "Years", "", "lowercase").slice(0, -1)
    s1 = new element("span", hiddenClass+"mx-1", [{"key":"data-i18n","value":""}], s2.getNode(), "expedition-"+expeditionData.id+"-pending-yearsText"); s1.create(); s1.appendHTML(yearsText)
    hiddenClass = (expeditionData.returnsIn.weeks ? "" : "hidden ")
    s1 = new element("span", hiddenClass+"countdown weeks font-bold", [{"key":"data-i18n","value":""}], s2.getNode(), "expedition-"+expeditionData.id+"-pending-weeks"); s1.create(); s1.appendHTML(expeditionData.returnsIn.weeks)
    let weeksText = expeditionData.returnsIn.weeks != 1 ? translate(language, "Weeks", "", "lowercase") : translate(language, "Weeks", "", "lowercase").slice(0, -2)+"."
    s1 = new element("span", hiddenClass+"mx-1", [{"key":"data-i18n","value":""}], s2.getNode(), "expedition-"+expeditionData.id+"-pending-weeksText"); s1.create(); s1.appendHTML(weeksText)
    hiddenClass = (expeditionData.returnsIn.days ? "" : "hidden ")
    s1 = new element("span", hiddenClass+"countdown days font-bold", [{"key":"data-i18n","value":""}], s2.getNode(), "expedition-"+expeditionData.id+"-pending-days"); s1.create(); s1.appendHTML(expeditionData.returnsIn.days)
    let daysText = expeditionData.returnsIn.days != 1 ? translate(language, "Days", "", "lowercase") : translate(language, "Days", "", "lowercase").slice(0, -1)
    s1 = new element("span", hiddenClass+"mx-1", [{"key":"data-i18n","value":""}], s2.getNode(), "expedition-"+expeditionData.id+"-pending-daysText"); s1.create(); s1.appendHTML(daysText)
    s1 = new element("span", "countdown hours font-bold", [{"key":"data-i18n","value":""}], s2.getNode(), "expedition-"+expeditionData.id+"-pending-hours"); s1.create(); s1.appendHTML(expeditionData.returnsIn.hours)
    s1 = new element("span", "ms-1", [{"key":"data-i18n","value":""}], s2.getNode(), "expedition-"+expeditionData.id+"-pending-hoursText"); s1.create(); s1.appendHTML("hs.")    
    //Expeditionaries and objects assigned...
    //Title
    d3 = new element("div", "mt-2 border border-gray-800 bg-gray-800 text-xs", [], d5.getNode(), "expedition-"+expeditionData.id+"-assigned-workers-title"); d3.create()
    p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200", [], d3.getNode()); p.create()
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent("Assigned expeditionaries")
    //Body
    d3 = new element("div", "p-1 border border-gray-800 bg-gray-600 text-xs", [], d5.getNode(), "expedition-"+expeditionData.id+"-assigned-workers"); d3.create()
    h2 = new element("h2", "", [], d3.getNode()); h2.create()
    expeditionData.crew.forEach((crewMember) => {
        d4 = new element("div", crewMember.type+" flex items-center justify-between w-full p-1 text-xs bg-gray-900 font-medium border border-gray-700 gap-3 text-gray-400", [], h2.getNode())
        d4.create()
        s = new element("span", "", [], d4.getNode()); s.create()
        //Build expeditionary or horse crew div
        if(crewMember.type == "expeditionary"){
            i = new element("i", "me-1 fa fa-"+(crewMember.gender == "F" ? "venus" : "mars")+" text-"+(crewMember.gender == "F" ? "red" : "blue")+"-500", [], s.getNode(), "expedition-"+expeditionData.id+"-citizen-"+crewMember.index+"-gender-icon"); i.create()
            i = new element("i", "me-1 fa fa-"+(crewMember.age == "adult" ? "person" : "child")+" text-white", [], s.getNode(), "expedition-"+expeditionData.id+"-citizen-"+crewMember.index+"-age-icon"); i.create()
            i = new element("i", "me-1 fa fa-map-location-dot text-green-500", [], s.getNode(), "expedition-"+expeditionData.id+"-citizen-"+crewMember.index+"-role-icon"); i.create()
            s1 = new element("span", "rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 me-1", [], s.getNode(), "expedition-"+expeditionData.id+"-citizen-"+crewMember.index+"-xp-icon"); 
            s1.create(); s1.appendContent(Math.floor(crewMember.xp).toString())
            s1 = new element("span", "ms-1", [], s.getNode(), "expedition-"+expeditionData.id+"-citizen-"+crewMember.index+"-name"); s1.create(); s1.appendContent(crewMember.name)
            s = new element("span", "", [], d4.getNode()); s.create()
            i = new element("i", "fa fa-eye me-1", [{"key":"data-index", "value":crewMember.index}], s.getNode(), "expedition-"+expeditionData.id+"-citizen-"+crewMember.index+"-view-icon"); i.create()
            i.getNode().addEventListener("click", modal_citizen_info)
            //Change citizen status.
            document.querySelectorAll("#citizen-"+crewMember.index+"-status").forEach((status) => {
                status.innerText = translate(language, "Travelling")
                status.setAttribute("data-status", "travelling")
            })
            citizens[crewMember.index].status = "travelling"
        } else {
            i = new element("i", "me-1 fa fa-horse text-white", [], s.getNode()); i.create()
            s1 = new element("span", "ms-1", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "Horse", "", "capitalized"))
            stock_displayed.products[language][translate(language, "horse")]--
            stock_values.products[language][translate(language, "horse")]--
        }
    })
}
//Enable accordion button click event
const enable_accordion_click = (accordion_item_button) => {
    let handle_accordion_click = (e) => {
        const target = e.target.closest("button")
        const accordion_item_body = document.querySelector(target.getAttribute('data-accordion-target'))
        //Trying to expand accordion item
        if (accordion_item_body.classList.contains('hidden')) {
            let parent_elem = accordion_item_body.closest("[data-accordion]")
            parent_elem.querySelectorAll("[aria-labelledby]").forEach((elem) => {
                if(elem != accordion_item_body){
                    elem.classList.add("hidden")
                }
            })
            parent_elem.querySelectorAll("svg").forEach((elem) => {
                if(elem != target.querySelector("svg") && !elem.classList.contains("rotate-180")){
                    elem.classList.add("rotate-180")
                }
            })
            accordion_item_body.classList.remove('hidden');
            target.setAttribute('aria-expanded', 'true');
            target.children[1].classList.remove("rotate-180")
            target.classList.remove("text-gray-500", "text-gray-400")
            target.classList.add("bg-gray-100", "bg-gray-800", "text-gray-900", "text-white")
        } else { //Trying to collapse accordion item
            accordion_item_body.classList.add('hidden');
            target.setAttribute('aria-expanded', 'false');
            target.children[1].classList.add("rotate-180")
            target.classList.remove("bg-gray-100", "bg-gray-800", "text-gray-900", "text-white")
            target.classList.add("text-gray-500", "text-gray-400")
        }
    }
    if(accordion_item_button.classList.contains("unattached-click")){
        accordion_item_button.addEventListener("click", handle_accordion_click)
        accordion_item_button.classList.remove("unattached-click")
    }
}
const enable_notification_events = () => {
    let notification_handler = (e) => {
        e.target.closest("h2").removeEventListener('click', notification_handler)
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
        value.removeEventListener('click', notification_handler)
    })
    document.querySelectorAll(".notificationUnread").forEach((value, key) => {
        value.addEventListener('click', notification_handler)
    })
}
const add_landform = (landformType = "hunting") => {
    let d = document.querySelector("#accordion-landforms")
    let landformIndex = document.querySelectorAll("#accordion-landforms h2").length + 1
    let landformTitle
    switch(landformType){
        case "hunting": landformTitle = "Hunting mount"; break
        case "stone": landformTitle = "Stone mount"; break
        case "clay": landformTitle = "Clay mount"; break
        case "wood": landformTitle = "Wood mount"; break
        case "mine": landformTitle = "Mine"; break
    }
    //Build landform #landformIndex accordion header
    h2 = new element("h2", "notificationUnread", [], d, "accordion-landform-"+landformIndex+"-header"); h2.create()
    b = new element("button", "unattached-click flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 font-medium border border-gray-700 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-landform-"+landformIndex+"-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-landform-"+landformIndex+"-body"}], h2.getNode(), "accordion-landform-"+landformIndex)
    b.create()
    enable_accordion_click(b.getNode())
    s = new element("span", "", [], b.getNode()); s.create()
    s1 = new element("span", "new text-xs font-medium px-1.5 py-0.5 hidden rounded-sm bg-blue-900 text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
    s1.create(); s1.appendContent("NEW")
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, landformTitle))
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build landform #landformIndex accordion body
    d1 = new element("div", "waterReservoir hidden", [{"key":"aria-labelledby","value":"accordion-landform-"+landformIndex+"-header"}], d, "accordion-landform-"+landformIndex+"-body")
    d1.create()
    //Build landform info
    //First column
    d2 = new element("div", "p-2 px-3 border border-gray-800 bg-gray-600 text-xs", [], d1.getNode(), "landform-"+landformIndex+"-info")
    d2.create();
    p = new element("p", "text-xs flex justify-between text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "", [], p.getNode()); s.create()
    s1 = new element("span", "", [{"key":"data-i18n","value":""},{"key":"gender","value":"M"}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Discovered in", "M"))
    sp = new element("span", "", [], s.getNode()); sp.create(); sp.appendContent(": ")
    s1 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Year"))
    s1 = new element("span", "me-1 font-bold", [], s.getNode(), "landform-"+landformIndex+"-createdYear"); s1.create(); s1.appendContent(document.getElementById("currentYear").innerText)
    s1 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Week"))
    s1 = new element("span", "me-1 font-bold", [], s.getNode(), "landform-"+landformIndex+"-createdWeek"); s1.create(); s1.appendContent(document.getElementById("currentWeek").innerText)
    s1 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Day"))
    s1 = new element("span", "me-1 font-bold", [], s.getNode(), "landform-"+landformIndex+"-createdDay"); s1.create(); s1.appendContent(document.getElementById("currentDay").innerText)

    //Build Assignable Workers title
    d2 = new element("div", "border border-gray-800 bg-gray-600 text-xs", [], d1.getNode(), "landform-"+landformIndex+"-assigned-title")
    d2.create();
    p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200 bg-gray-700", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Permanently assignable workers"))
    //Build Assignable Workers area
    d2 = new element("div", "assignable-workers p-2 ps-3 border border-gray-800 bg-gray-600 text-xs", [], d1.getNode(), "landform-"+landformIndex+"-assigned")
    d2.create();
    p = new element("p", "empty text-xs flex justify-between text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "", [], p.getNode()); s.create()
    i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
    s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No assignable workers"))
    //Build Active Production Rules title
    d2 = new element("div", "border border-gray-800 bg-gray-600 text-xs", [], d1.getNode(), "landform-"+landformIndex+"-active-production-rules-title")
    d2.create();
    p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200 bg-gray-700", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Active production rules"))
    //Build Active Production Rules area
    d2 = new element("div", "active-production-rules p-2 border border-gray-800 bg-gray-600 text-xs", [], d1.getNode(), "landform-"+landformIndex+"-active-production-rules"); d2.create()
    p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-200", [], d2.getNode()); p.create()
    s = new element("span", "", [], p.getNode()); s.create()
    i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
    s1 = new element("span", "a", [{"key":"data-i18n","value":""}, {"key":"gender","value":"F"}], s.getNode()); s1.create(); s1.appendContent(translate(language, "None", "F"))

}
const update_stock = () => {
    //Update resources
    let parentElement = document.getElementById("resources-stock-list")
    document.querySelectorAll("#resources-stock-list p").forEach((elem) => elem.remove())
    let count = 0
    Object.keys(stock_displayed.resources[language]).forEach((resource) => {
        formatedResource = resource.replaceAll(" ", "")
        if(resource.toLowerCase() != "food" && resource.toLowerCase() != "alimento" && stock_displayed.resources[language][resource] >= 1){
            let pt = (!count++ ? "pt-2" : "pt-0")
            //Add dom node as last sibling
            p = new element("p", "resourceStock pb-0 text-xs text-gray-400", [], parentElement); p.create()
            s = new element("span", "flex", [], p.getNode()); s.create()
            s1 = new element("span", pt+" ps-2 flex-none bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
            s2 = new element("span", "capitalize", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(translate(language, resource))
            s1.appendHTML(": ")
            s1 = new element("span", pt+" pb-0 grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
            let stockValue = stock_displayed.resources[language][resource].toString()
            s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-"+formatedResource+"-stock"); s2.create(); s2.appendContent(stockValue)
            s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(translate(language, stockValue == 1 ? "unit" : "units"))
        }
    })
    //If there was no resource to show, display empty message.
    if(!count){
        p = new element("p", "resourceStock pb-0 text-xs text-gray-400", [], parentElement); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "pt-2 ps-2 flex-none grow bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s1.getNode()); i.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""},{"key":"gender","value":"m"}], s1.getNode()); s2.create(); s2.appendContent(translate(language, "None", "m"))
    }

    parentElement = document.getElementById("products-stock-list")
    document.querySelectorAll("#products-stock-list p").forEach((elem) => elem.remove())
    //Update products
    count = 0
    Object.keys(stock_displayed.products[language]).forEach((product) => {
        formatedProduct = product.replaceAll(" ", "")
        if(product.toLowerCase() != "food" && stock_displayed.products[language][product] >= 1){
            let pt = (!count++ ? "pt-2" : "pt-0")
            p = new element("p", "productStock pb-0 text-xs text-gray-400", [], parentElement); p.create()
            s = new element("span", "flex", [], p.getNode()); s.create()
            s1 = new element("span", pt+" ps-2 flex-none bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
            s2 = new element("span", "capitalize", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(translate(language, product))
            s1.appendHTML(": ")
            formatedProduct = product.replaceAll(" ", "")
            s1 = new element("span", pt+" pb-0 grow flex-none text-white bg-gray-500 border border-gray-500 px-1", [], s.getNode()); s1.create()
            let stockValue = stock_displayed.products[language][product].toString()
            s2 = new element("span", "font-bold me-1", [], s1.getNode(), "colony-"+formatedProduct+"-stock"); s2.create(); s2.appendContent(stockValue)
            s2 = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s2.create(); s2.appendContent(translate(language, stockValue == 1 ? "unit" : "units"))
        }
    })
    //If there was no resource to show, display empty message.
    if(!count){
        p = new element("p", "resourceStock pb-0 text-xs text-gray-400", [], parentElement); p.create()
        s = new element("span", "flex", [], p.getNode()); s.create()
        s1 = new element("span", "pt-2 ps-2 flex-none grow bg-gray-500 border border-gray-500 text-white", [], s.getNode()); s1.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s1.getNode()); i.create()
        s2 = new element("span", "", [{"key":"data-i18n","value":""},{"key":"gender","value":"m"}], s1.getNode()); s2.create(); s2.appendContent(translate(language, "None", "m"))
    }
}
//Change stock resources or products order from ASC to DESC or viceversa, and display results on Colony panel.
const toggle_sort_stock = (type = "resources") => {
    let object_type = (type == "buildingParts" ? "building parts" : type)
    let reversed = {}
    Object.keys(stock_displayed[object_type][language])
        .reverse()
        .forEach((value, key) => {
            reversed[value] = stock_displayed[object_type][language][value]
        })
    stock_displayed[object_type][language] = reversed
    //Change order icon on the sorting button.
    document.querySelector(`#order${type.charAt(0).toUpperCase()+type.slice(1)}Stock i`).classList.toggle("fa-arrow-down-wide-short")
    document.querySelector(`#order${type.charAt(0).toUpperCase()+type.slice(1)}Stock i`).classList.toggle("fa-arrow-down-short-wide")
    //Update stock list in the DOM
    update_stock()
}
//Update accordions structure
const update_colony = (event = "zoneSearched") => {
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
            b = new element("button", "unattached-click flex items-center justify-between w-full py-2 px-3 text-xs text-gray-400 bg-gray-900 font-medium border border-gray-700 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-building-group-1-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-building-group-1-body"}], h2.getNode(), "accordion-building-group-1")
            b.create()
            enable_accordion_click(b.getNode())
            s = new element("span", "", [], b.getNode()); s.create()
            s1 = new element("span", "new text-xs font-medium px-1.5 py-0.5 hidden rounded-sm bg-blue-900 text-blue-300 me-3", [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}], s.getNode())
            s1.create(); s1.appendContent("NEW")
            s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Campaign tents"))
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            //Build building group 1 accordion body
            d1 = new element("div", "hidden", [{"key":"aria-labelledby","value":"accordion-building-group-1-header"}], parentElem, "accordion-building-group-1-body"); d1.create()
            d3 = new element("div", "p-1 border border-gray-800 bg-gray-600 text-xs", [], d1.getNode()); d3.create()
            p = new element("p", "ms-1 mb-2 text-xs text-gray-200", [], d3.getNode()); p.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Total shelter capacity"))
            p.appendHTML(": ")
            s = new element("span", "font-bold", [], p.getNode(), "building-group-1-total-capacity"); s.create(); s.appendContent("15")
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "citizens"))
            d = new element("div", "", [{"key":"data-accordion","value":"collapse"}], d3.getNode(), "accordion-building-group-1"); d.create()
            for(i=1; i<=buildings.shelter["campaign tent"]; i++) { add_building(i, "Campaign tent", d.getNode()) }
            //enableAccordions('#accordion-buildings-groups [data-accordion-target]')
        }
    }
    if(event == "zoneSearched"){
        //Add notification about zone searched
        update_stock()
        add_news()
    }
}
//Change all panels in which the role and citizen were involved
const post_conditions_changing_role = (previous_role, citizen_index) => {
    let loop_citizen_index
    document.querySelectorAll(".assignable-workers > h2.assignable-worker.unassigned").forEach((elem) => {
        loop_citizen_index = elem.id.split("-")[3]
        //Check if citizen is assignable in a water reservoir.
        if(["waterBearing", "fishing"].includes(previous_role) && loop_citizen_index == citizen_index){
            assignable_workers_div = elem.parentElement
            //Remove citizen from assignable workers list
            elem.remove()
            //If no more assignable workers, then show "no workers available" text
            if(!assignable_workers_div.children.length){
                p = new element("p", "empty ms-1 mb-1 text-xs flex justify-between text-gray-200", [], assignable_workers_div); p.create()
                s = new element("span", "", [], p.getNode()); s.create()
                i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No workers available"))
            }
        }
    })
}
//For any new expedition: Add available worker (expeditionary)
const add_available_worker_to_expedition = (citizenIndex, newExpeditionClass) => {
    let parentElem = document.querySelector("."+newExpeditionClass+" .availableWorkers")
    //Remove "no available workers" text, if exists
    if(document.querySelector("."+newExpeditionClass+" .availableWorkers .empty")!=null){
        document.querySelector("."+newExpeditionClass+" .availableWorkers .empty").remove()
    }
    h2 = new element("h2", "availableWorker", [], parentElem, "available-citizen-"+citizenIndex); h2.create()
    d = new element("div", "flex items-center justify-between w-full py-2 px-2 text-xs bg-gray-900 font-medium border border-gray-700 gap-3 text-gray-400", [], h2.getNode())
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
    s1 = new element("span", "rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 me-1", [], s.getNode(), "citizen-"+citizenIndex+"-xp-icon"); s1.create(); s1.appendContent(Math.floor(citizenXP).toString())
    //Citizen full name
    let citizenName = document.getElementById("citizen-"+citizenIndex+"-name").innerText
    s1 = new element("span", "ms-1", [], s.getNode(), "citizen-"+citizenIndex+"-name"); s1.create(); s1.appendContent(citizenName)
    s = new element("span", "", [], d.getNode()); s.create()
    //View citizen info
    i = new element("i", "fa fa-eye me-2", [{"key":"data-index", "value":citizenIndex}], s.getNode(), "citizen-"+citizenIndex+"-view-info"); i.create()
    i.getNode().addEventListener("click", modal_citizen_info)
    //Assign citizen as worker
    i = new element("i", "text-sm fa fa-plus", [], s.getNode(), "citizen-"+citizenIndex+"-assign"); i.create()
}
//For any mount discovered: Add available worker
const add_available_horse_to_expedition = () => {
    let parentElem = document.querySelector(".newExpedition .availableObjects")
    //Remove "no available objects" text, if exists
    if(document.querySelector(".newExpedition .availableObjects .empty")!=null){
        document.querySelector(".newExpedition .availableObjects .empty").remove()
    }
    h2 = new element("h2", "availableHorse", [], parentElem); h2.create()
    d = new element("div", "flex items-center justify-content w-full py-2 px-2 text-xs text-gray-400 bg-gray-900 font-medium border border-gray-700 gap-3 text-gray-400", [], h2.getNode())
    d.create()
    s = new element("span", "grow", [], d.getNode()); s.create()
    //Add horse
    //Horse icon
    i = new element("i", "fa fa-horse", [], s.getNode()); i.create()
    s1 = new element("span", "mx-1", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "Horse", "", "capitalized"))
    //Assign horse to expedition workers
    i = new element("i", "text-sm fa fa-plus", [], d.getNode()); i.create()
    return i.getNode()
}
//For any mount discovered: Add assignable worker as permanent
const add_assignable_worker_to_mount = (citizen_index, mount_class) => {
    //Parent div in which to hang structure.
    let parent_elem = document.querySelector(`.${mount_class} .assignable-workers`)
    //Remove "no available workers" text, if exists
    if(document.querySelector(`.${mount_class} .assignable-workers .empty`)!=null){
        document.querySelector(`.${mount_class} .assignable-workers .empty`).remove()
    }
    //Add citizen panel with role information.
    let currentCitizenRole = document.getElementById(`citizen-${citizen_index}-role`).getAttribute("data-role")
    h2id = `${mount_class}-assignable-citizen-${citizen_index}`
    h2 = new element("h2", "assignable-worker unassigned", [{"key":"data-role", "value":currentCitizenRole}], parent_elem, h2id); h2.create()
    d = new element("div", "flex items-center justify-between w-full py-1 px-2 mb-1 text-xs bg-gray-700 font-medium border border-gray-900 gap-3 text-gray-400", [], h2.getNode())
    d.create()
    s = new element("span", "", [], d.getNode()); s.create()
    //Gender citizen icon
    iid = `citizen-${citizen_index}-gender-icon`
    i = new element("i", document.getElementById(iid).classList.toString(), [], s.getNode(), iid); i.create()
    //Age citizen icon
    iid = `citizen-${citizen_index}-age-icon`
    i = new element("i", document.getElementById(iid).classList.toString(), [], s.getNode(), iid); i.create()
    //Role citizen icon
    iid = `citizen-${citizen_index}-role-icon`
    i = new element("i", document.getElementById(iid).classList.toString(), [], s.getNode(), iid); i.create()
    //XP citizen icon
    iid = `citizen-${citizen_index}-xp-icon`
    let citizenXP = document.getElementById(iid).innerText
    s1 = new element("span", "rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 me-1", [], s.getNode(), iid); s1.create()
    s1.appendContent(Math.floor(citizenXP).toString())
    //Citizen full name
    iid = `citizen-${citizen_index}-name`
    let citizenName = document.getElementById(iid).innerText
    s1 = new element("span", "ms-1", [], s.getNode(), iid); s1.create(); s1.appendContent(citizenName)
    s = new element("span", "", [], d.getNode()); s.create()
    //View citizen info
    iid = `${mount_class}-citizen-${citizen_index}-view-info`
    i = new element("i", "fa fa-eye me-2", [{"key":"data-index", "value":citizen_index}], s.getNode(), iid); i.create()
    i.getNode().addEventListener("click", modal_citizen_info)
    //Assign / deassign citizen as mount worker
    iid = `${mount_class}-citizen-${citizen_index}-assign`
    i = new element("i", "text-sm fa-regular fa-square", [{"key":"data-group", "value":mount_class}], s.getNode(), iid); i.create()
    //Check if there are open rules within the mount panel to add the worker
    /*let openedRules = parent_elem.parentElement.querySelectorAll(".assignable-panel")
    openedRules.forEach((elem) => {
        //Remove "no available workers" text, if exists
        if(elem.querySelector(".empty") != null){
            elem.querySelector(".empty").remove()
        }
        //Add worker to rule assignable panel.
        let ch2 = h2.getNode().cloneNode(true)
        elem.appendChild(ch2)
    })*/
}
//For certain mount discovered: Remove (Deassign) assigned worker
const deassign_worker_to_mount = (citizenIndex, mountClass) => {
    let parentAssigned = document.querySelector("."+mountClass+" .assignedWorkers")
    let parentAvailable = document.querySelector("."+mountClass+" .availableWorkers")
    //Remove "no available workers" text, if exists
    if(document.querySelector("."+mountClass+" .availableWorkers .empty")!=null){
        document.querySelector("."+mountClass+" .availableWorkers .empty").remove()
    }
    //Assign citizen to "Assigned workers" panel.
    parentAvailable.appendChild(document.getElementById("assigned-citizen-"+citizenIndex))
    document.getElementById("assigned-citizen-"+citizenIndex).classList.remove("assignedWorker")
    document.getElementById("assigned-citizen-"+citizenIndex).classList.add("availableWorker")   
    document.getElementById("assigned-citizen-"+citizenIndex).id = "available-citizen-"+citizenIndex
    //Change assign icon, put instead deassign icon
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.remove("fa-minus")
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.add("fa-plus")
    //Change citizen status.
    document.querySelectorAll("#citizen-"+citizenIndex+"-status").forEach((status) => {
        status.innerText = translate(language, "Idle")
        status.setAttribute("data-status", "idle")
    })
    citizens[citizenIndex].status = "idle"
    let citizenRoleKey = document.getElementById("citizen-"+citizenIndex+"-role").getAttribute("data-role")
    if(mountClass == "waterReservoir"){
        if(citizenRoleKey == "waterbearing"){
            //Add water income to Colony panel
            document.getElementById("colony-water-income").innerHTML = document.getElementById("colony-water-income").innerHTML*1 - water_reservoirs[colony_water_reservoir]["daily-water-income"]*1
            let waterRevenue = document.getElementById("colony-water-income").innerHTML*1 - document.getElementById("colony-water-consumption").innerHTML*1
            document.getElementById("water-revenue").innerHTML = (waterRevenue ? "+" : "")+waterRevenue
        }
        if(citizenRoleKey == "fishing"){
            //Add water income to Colony panel
            document.getElementById("colony-food-income").innerHTML = document.getElementById("colony-food-income").innerHTML*1 - water_reservoirs[colony_water_reservoir]["daily-food-income"]*1
            let waterRevenue = document.getElementById("colony-food-income").innerHTML*1 - document.getElementById("colony-food-consumption").innerHTML*1
            document.getElementById("food-revenue").innerHTML = (waterRevenue ? "+" : "")+waterRevenue
        }
    }
    //If no available workers, then show "no available workers" text
    if(!parentAssigned.children.length){
        p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-200", [], parentAssigned); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No workers assigned"))
    }
}
//For any new production rule: Add available worker
const add_assigned_worker_to_rule_requirement = (citizen_index, parent_elem) => {
    //Remove "no assigned workers" text, if exists
    if(parent_elem.querySelector(".empty")!=null){
        parent_elem.querySelector(".empty").remove()
    }
    //Remove previous available worker instances for current citizen.
    document.querySelectorAll("#available-citizen-"+citizen_index+".availableWorker").forEach((elem) => {
        let parentDiv = elem.parentElement
        elem.remove()
        if(!parentDiv.children.length){
            p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-200", [], parentDiv); p.create()
            s = new element("span", "", [], p.getNode()); s.create()
            i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
            s.appendHTML(translate(language, "No workers available"))
        }
    })
    h2 = new element("h2", "grow assignedWorker", [], parentElem, "assigned-citizen-"+citizen_index); h2.create()
    d = new element("div", "flex items-center justify-between w-full py-2 px-2 text-xs bg-gray-900 font-medium border border-gray-700 gap-3 text-gray-400", [], h2.getNode())
    d.create()
    s = new element("span", "", [], d.getNode()); s.create()
    //Gender citizen icon
    i = new element("i", document.getElementById("citizen-"+citizen_index+"-gender-icon").classList.toString(), [], s.getNode(), "citizen-"+citizenIndex+"-gender-icon"); i.create()
    //Age citizen icon
    i = new element("i", document.getElementById("citizen-"+citizen_index+"-age-icon").classList.toString(), [], s.getNode(), "citizen-"+citizenIndex+"-age-icon"); i.create()
    //Role citizen icon
    i = new element("i", document.getElementById("citizen-"+citizen_index+"-role-icon").classList.toString(), [], s.getNode(), "citizen-"+citizenIndex+"-role-icon"); i.create()
    //XP citizen icon
    let citizenXP = document.getElementById("citizen-"+citizen_index+"-xp-icon").innerText
    s1 = new element("span", "rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 me-1", [], s.getNode(), "citizen-"+citizenIndex+"-xp-icon"); s1.create(); s1.appendContent(Math.floor(citizenXP).toString())
    //Citizen full name
    let citizenName = document.getElementById("citizen-"+citizen_index+"-name").innerText
    s1 = new element("span", "ms-1", [], s.getNode(), "citizen-"+citizen_index+"-name"); s1.create(); s1.appendContent(citizenName)
    s = new element("span", "", [], d.getNode()); s.create()
    //View citizen info
    i = new element("i", "fa fa-eye me-2", [{"key":"data-index", "value":citizen_index}], s.getNode(), "citizen-"+citizen_index+"-view-info"); i.create()
    i.getNode().addEventListener("click", modal_citizen_info)
    //Assign citizen as worker
    i = new element("i", "text-sm fa fa-minus", [], s.getNode(), "citizen-"+citizen_index+"-deassign"); i.create()
}
//For any new production worker rule: Add assignable worker
const add_assignable_worker_to_rule_requirement = (citizen_index, parent_elem) => {
    //Remove "no available workers" text, if exists
    if(parent_elem.querySelector(".empty") != null){
        parent_elem.querySelector(".empty").remove()
    }
    let rule_index = parent_elem.id.split("-")[1], requirement_index = parent_elem.id.split("-")[3]
    h2id = `rule-${rule_index}-requirement-${requirement_index}-assignable-citizen-${citizen_index}`
    h2 = new element("h2", "assignable-worker unassigned", [], parent_elem, h2id); h2.create()
    d = new element("div", "flex items-center justify-between w-full py-1 px-2 mb-1 text-xs bg-gray-700 font-medium border border-gray-900 gap-3 text-gray-400", [], h2.getNode())
    d.create()
    s = new element("span", "", [], d.getNode()); s.create()
    //Gender citizen icon
    iid = `citizen-${citizen_index}-gender-icon`
    i = new element("i", document.getElementById(iid).classList.toString(), [], s.getNode(), iid); i.create()
    //Age citizen icon
    iid = `citizen-${citizen_index}-age-icon`
    i = new element("i", document.getElementById(iid).classList.toString(), [], s.getNode(), iid); i.create()
    //Role citizen icon
    iid = `citizen-${citizen_index}-role-icon`
    i = new element("i", document.getElementById(iid).classList.toString(), [], s.getNode(), iid); i.create()
    //XP citizen icon
    iid = `citizen-${citizen_index}-xp-icon`
    let citizenXP = document.getElementById(iid).innerText
    s1 = new element("span", "rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 me-1", [], s.getNode(), iid); s1.create(); 
    s1.appendContent(Math.floor(citizenXP).toString())
    //Citizen full name
    iid = `citizen-${citizen_index}-name`
    let citizenName = document.getElementById(iid).innerText
    s1 = new element("span", "ms-1", [], s.getNode(), iid); s1.create(); s1.appendContent(citizenName)
    s = new element("span", "", [], d.getNode()); s.create()
    //View citizen info
    iid = `citizen-${citizen_index}-view-info`
    i = new element("i", "fa fa-eye me-2", [{"key":"data-index", "value":citizen_index}], s.getNode(), iid); i.create()
    i.getNode().addEventListener("click", modal_citizen_info)
    //Assign citizen as worker
    //Assign / deassign citizen as rule requirement worker
    iid = `citizen-${citizen_index}-assign`
    i = new element("i", "text-sm fa-regular fa-square", [{"key":"data-group", "value":"production-rule"}, {"key":"data-rule", "value":rule_index}, {"key":"data-requirement", "value":requirement_index}], s.getNode(), iid); i.create()
}
//For certain new expedition: Add assigned horse
const add_assigned_horse_to_expedition = (horseElement) => {
    let parentAssigned = document.querySelector(".newExpedition .assignedWorkers")
    let parentAvailable = document.querySelector(".newExpedition .availableObjects")
    //Remove "no assigned workers" text, if exists
    if(document.querySelector(".newExpedition .assignedWorkers .empty")!=null){
        document.querySelector(".newExpedition .assignedWorkers .empty").remove()
    }
    //Assign horse to "Assigned workers" panel.
    parentAssigned.appendChild(horseElement)
    horseElement.classList.remove("availableHorse")
    horseElement.classList.add("assignedHorse")
    //Change assign icon, put instead deassign icon
    horseElement.querySelectorAll("i")[1].classList.remove("fa-plus")
    horseElement.querySelectorAll("i")[1].classList.add("fa-minus")
    //If no more available objects, then show "No other objects available" text
    if(!parentAvailable.children.length){
        p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-200", [], parentAvailable); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No other objects available"))
    }
}
//For certain new expedition: Add assigned worker (expeditionary)
const add_assigned_worker_to_expedition = (citizenIndex, newExpeditionClass) => {
    let parentAssigned = document.querySelector("."+newExpeditionClass+" .assignedWorkers")
    let parentAvailable = document.querySelector("."+newExpeditionClass+" .availableWorkers")
    //Remove "no assigned workers" text, if exists
    if(document.querySelector("."+newExpeditionClass+" .assignedWorkers .empty")!=null){
        document.querySelector("."+newExpeditionClass+" .assignedWorkers .empty").remove()
    }
    //Assign citizen to "Assigned workers" panel.
    parentAssigned.appendChild(document.getElementById("available-citizen-"+citizenIndex))
    document.getElementById("available-citizen-"+citizenIndex).classList.remove("availableWorker")
    document.getElementById("available-citizen-"+citizenIndex).classList.add("assignedWorker")
    document.getElementById("available-citizen-"+citizenIndex).id = "assigned-citizen-"+citizenIndex
    //Change assign icon, put instead deassign icon
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.remove("fa-plus")
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.add("fa-minus")
    //Add citizen's xp
    let citizenXP = document.querySelector("#citizen-"+citizenIndex+"-xp").getAttribute("data-xp")
    document.getElementById("citizen-"+citizenIndex+"-assign").setAttribute("data-xp", citizenXP)
    //Change citizen status.
    document.querySelectorAll("#citizen-"+citizenIndex+"-status").forEach((status) => {
        status.innerText = translate(language, "Assigned")
        status.setAttribute("data-status", "assigned")
    })
    citizens[citizenIndex].status = "assigned"
    //If no more available workers, then show "no available workers" text
    if(!parentAvailable.children.length){
        p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-200", [], parentAvailable); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No workers available"))
    }
}
//For certain mount discovered: Add assigned worker
const add_assigned_worker_to_mount = (citizenIndex, mountClass) => {
    let parentAssigned = document.querySelector("."+mountClass+" .assignedWorkers")
    let parentAvailable = document.querySelector("."+mountClass+" .availableWorkers")
    //Remove "no assigned workers" text, if exists
    if(document.querySelector("."+mountClass+" .assignedWorkers .empty")!=null){
        document.querySelector("."+mountClass+" .assignedWorkers .empty").remove()
    }
    //Assign citizen to "Assigned workers" panel.
    parentAssigned.appendChild(document.getElementById("available-citizen-"+citizenIndex))
    document.getElementById("available-citizen-"+citizenIndex).classList.remove("availableWorker")
    document.getElementById("available-citizen-"+citizenIndex).classList.add("assignedWorker")
    document.getElementById("available-citizen-"+citizenIndex).id = "assigned-citizen-"+citizenIndex
    //Remove all other places where the available citizen is shown.
    document.querySelectorAll("#available-citizen-"+citizenIndex+".availableWorker").forEach((elem) => {
        let parentElem = elem.closest(".availableWorkers")
        elem.remove()
        if(!parentElem.querySelectorAll("h2").length){
            //Show no workers available message.
            p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-200", [], parentElem); p.create()
            s = new element("span", "", [], p.getNode()); s.create()
            i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
            s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No workers available"))
        }
    })
    //Change assign icon, put instead deassign icon
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.remove("fa-plus")
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.add("fa-minus")
    //Change citizen status.
    document.querySelectorAll("#citizen-"+citizenIndex+"-status").forEach((status) => {
        status.innerText = translate(language, lifeStarted ? "Working" : "Assigned")
        status.setAttribute("data-status", lifeStarted ? "working" : "assigned")
    })
    citizens[citizenIndex].status = lifeStarted ? "working" : "assigned"
    let citizenRoleKey = document.getElementById("citizen-"+citizenIndex+"-role").getAttribute("data-role")
    if(mountClass == "waterReservoir"){
        if(citizenRoleKey == "waterbearing"){
            //Add water income to Colony panel
            document.getElementById("colony-water-income").innerHTML = document.getElementById("colony-water-income").innerHTML*1 + water_reservoirs[colony_water_reservoir]["daily-water-income"]*1
            let waterRevenue = document.getElementById("colony-water-income").innerHTML*1 - document.getElementById("colony-water-consumption").innerHTML*1
            document.getElementById("water-revenue").innerHTML = (waterRevenue ? "+" : "")+waterRevenue
        }
        if(citizenRoleKey == "fishing"){
            //Add water income to Colony panel
            document.getElementById("colony-food-income").innerHTML = document.getElementById("colony-food-income").innerHTML*1 + water_reservoirs[colony_water_reservoir]["daily-food-income"]*1
            let waterRevenue = document.getElementById("colony-food-income").innerHTML*1 - document.getElementById("colony-food-consumption").innerHTML*1
            document.getElementById("food-revenue").innerHTML = (waterRevenue ? "+" : "")+waterRevenue
        }
    }
    //If no more available workers, then show "no available workers" text
    if(!parentAvailable.children.length){
        p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-200", [], parentAvailable); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No workers available"))
    }
}
//For certain new expedition: Remove (Deassign) assigned horse
const deassign_horse_to_expedition = (horseElement) => {
    let parentAssigned = document.querySelector(".newExpedition .assignedWorkers")
    let parentAvailable = document.querySelector(".newExpedition .availableObjects")
    //Remove "No other objects available" text, if exists
    if(document.querySelector(".newExpedition .availableObjects .empty")!=null){
        document.querySelector(".newExpedition .availableObjects .empty").remove()
    }
    //Assign horse to "Available objects" panel.
    parentAvailable.appendChild(horseElement)
    horseElement.classList.remove("assignedHorse")
    horseElement.classList.add("availableHorse")
    //Change assign icon, put instead deassign icon
    horseElement.querySelectorAll("i")[1].classList.remove("fa-minus")
    horseElement.querySelectorAll("i")[1].classList.add("fa-plus")
    //If no assigned workers, then show "no workers assigned" text
    if(!parentAssigned.children.length){
        p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-200", [], parentAssigned); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No workers assigned"))
    }
}
//For certain new expedition: Remove (Deassign) assigned worker
const deassign_worker_to_expedition = (citizenIndex, newExpeditionClass) => {
    let parentAssigned = document.querySelector("."+newExpeditionClass+" .assignedWorkers")
    let parentAvailable = document.querySelector("."+newExpeditionClass+" .availableWorkers")
    //Remove "no available workers" text, if exists
    if(document.querySelector("."+newExpeditionClass+" .availableWorkers .empty")!=null){
        document.querySelector("."+newExpeditionClass+" .availableWorkers .empty").remove()
    }
    //Assign citizen to "Assigned workers" panel.
    parentAvailable.appendChild(document.getElementById("assigned-citizen-"+citizenIndex))
    document.getElementById("assigned-citizen-"+citizenIndex).classList.remove("assignedWorker")
    document.getElementById("assigned-citizen-"+citizenIndex).classList.add("availableWorker")
    document.getElementById("assigned-citizen-"+citizenIndex).id = "available-citizen-"+citizenIndex
    //Change assign icon, put instead deassign icon
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.remove("fa-minus")
    document.getElementById("citizen-"+citizenIndex+"-assign").classList.add("fa-plus")
    //Change citizen status.
    document.querySelectorAll("#citizen-"+citizenIndex+"-status").forEach((status) => {
        status.innerText = translate(language, "Idle")
        status.setAttribute("data-status", "idle")
    })
    citizens[citizenIndex].status = "idle"
    //If no available workers, then show "no available workers" text
    if(!parentAssigned.children.length){
        p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-200", [], parentAssigned); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No workers assigned"))
    }
}