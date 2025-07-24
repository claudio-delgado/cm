const panelClasses = {
    "assignRole": {"i":"fa-handshake-simple", "text":"font-bold grow", "bg":"bg-gray-900"},
    "searchCouple": {"i":"fa-venus-mars", "text":"font-bold grow", "bg":"bg-gray-900"},
    "tryBreeding": {"i":"fa-venus-mars", "text":"font-bold grow", "bg":"bg-gray-900"},
    "newExpedition": {"i":"fa-location-dot", "text":"font-bold grow", "bg":"bg-gray-900"},
    "newProductionRule": {"i":"fa-subscript", "text":"font-bold grow", "bg":"bg-gray-900"}
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
        currently_used_panel = this
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
        const build_title_div = () => {
            //--Build div, add paragraph
            d1 = new element("div", `${this.panelName}-title mt-1 border border-gray-300 border-gray-800 bg-gray-900 text-gray-200 text-xs`, [], parentDiv, this.objectName+(this.objectId ? "-"+this.objectId : "")+"-"+this.panelName+"-title")
            d1.create()
            p = new element("p", "flex justify-between items-center p-1 ps-2 text-xs", [], d1.getNode())
            p.create()
        }
        const set_general_features = () => {
            switch(this.panelName){
                case "assignRole": 
                    i = new element("i", "me-2 fa "+panelClasses.assignRole.i, [], paragraph); i.create()
                    s = new element("span", panelClasses.assignRole.text, [{"key":"data-i18n", "value":""}], paragraph)
                    s.create(); s.appendContent(this.data.language == "ES" ? translate("ES", "Assign a role") : translate("EN", "Asignarle un rol", "", "", changeLanguage=false))
                    paragraphBg = panelClasses.assignRole.bg
                    break
                case "searchCouple": 
                    i = new element("i", "me-2 fa "+panelClasses.searchCouple.i, [], paragraph); i.create()
                    s = new element("span", panelClasses.searchCouple.text, [{"key":"data-i18n", "value":""}], paragraph)
                    s.create(); s.appendContent(this.data.language == "ES" ? translate("ES", "New couple: Select a candidate") : translate("EN", "Nueva pareja: Seleccionar un/a candidato/a", "", "", changeLanguage=false))
                    paragraphBg = panelClasses.searchCouple.bg
                    break
                case "tryBreeding": 
                    i = new element("i", "me-2 fa "+panelClasses.tryBreeding.i, [], paragraph); i.create()
                    s = new element("span", panelClasses.tryBreeding.text, [{"key":"data-i18n", "value":""}], paragraph)
                    s.create(); s.appendContent(this.data.language == "ES" ? translate("ES", "Try breeding", "", "", false) : translate("EN", "Intentar reproducción", "", "", changeLanguage=false))
                    paragraphBg = panelClasses.tryBreeding.bg
                    break
                case "newExpedition": 
                    i = new element("i", "me-2 fa "+panelClasses.newExpedition.i, [], paragraph); i.create()
                    s = new element("span", panelClasses.newExpedition.text, [{"key":"data-i18n", "value":""}], paragraph)
                    s.create(); s.appendContent(this.data.language == "ES" ? translate("ES", "New expedition") : translate("EN", "Nueva expedición", "", "", changeLanguage=false))
                    paragraphBg = panelClasses.newExpedition.bg
                    break
                case "newRule": 
                    i = new element("i", "me-2 fa "+panelClasses.newProductionRule.i, [], paragraph); i.create()
                    s = new element("span", panelClasses.newExpedition.text, [{"key":"data-i18n", "value":""}], paragraph)
                    s.create(); s.appendContent(this.data.language == "ES" ? translate("ES", "New production rule", "", "", changeLanguage=false) : translate("EN", "Nueva regla de producción", "", "", changeLanguage=false))
                    paragraphBg = panelClasses.newExpedition.bg
                    break
            }
        }
        let changeLanguage, paragraph, paragraphBg
        let parentDiv = document.querySelector(this.data.parentId) 
        
        //Build title div.
        build_title_div()
        paragraph = document.querySelector(`#${this.objectName+(this.objectId ? "-"+this.objectId : "")}-${this.panelName}-title p`)
        
        //--Build span with icon before. Set general panel features.
        set_general_features()
        
        //Build close icon to the right
        i = new element("i", "mt-0 me-2 text-base fa fa-times font-bold", [], paragraph); i.create()
        i.getNode().addEventListener("click", (e) => {
            if(this.panelName == "newExpedition"){
                //Make assigned expeditionaries or army available restoring status of all of them.
                document.querySelectorAll(".assignedWorkers h2").forEach((citizen) => {
                    //Check if assigned object is a worker or a horse...
                    if(citizen.id){
                        let citizen_index = citizen.id.split("-")[2]
                        document.querySelectorAll("#citizen-"+citizen_index+"-status").forEach((status) => {
                            status.setAttribute("data-status", "idle")
                            status.innerText = translate(language, "idle")
                        })
                        //Change global citizens array
                        citizens[citizen_index].status = "idle"
                    }
                })
            }
            this.removePanel()
            this.showPreviousOptions()
        })

        //Build specific panel
        d1 = new element("div", this.panelName+" border border-gray-900 bg-gray-600 text-xs", [], parentDiv, this.objectName+(this.objectId ? "-"+this.objectId : "")+"-"+this.panelName); d1.create()
        p = new element("p", "flex py-1 w-100 gap-1 justify-between items-center flex-wrap p-1 text-gray-300", [], d1.getNode());
        let divSpecificParagraphButton = []
        if(this.panelName == "assignRole"){
            //Specific Assign Role panel
            p.create()
            let currentRole = document.querySelector("#"+this.objectName+"-"+this.objectId+"-role").getAttribute("data-role")
            let iElement, buttonText = "", generalRole = "", buttonColours = "", isDisabled = false
            role_icons.forEach((value, index) => {
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
                    generalRole = typeof value["EN"][this.data.gender] != "undefined" ? value["EN"][this.data.gender].replaceAll(" ","") : value["EN"].replaceAll(" ","")
                }
                isDisabled = currentRole != null && value.key == currentRole
                buttonColours = isDisabled ? "border-gray-500 bg-gray-700 text-gray-400" : "border-green-700 bg-green-900 text-white"
                divSpecificParagraphButton[index].classList = generalRole+" assignableRole text-xs capitalize "+(index+1 < role_icons.length ? "grow " : "")+"p-2 me-1 mb-1 button border "+buttonColours
                divSpecificParagraphButton[index].disabled = isDisabled
                p.appendContent(divSpecificParagraphButton[index])
            })
        }
        if(this.panelName == "searchCouple"){
            //Specific Search couple panel
            p.create()
            let citizen_id = this.objectId*1
            let citizen = get_citizen_by_index(citizen_id)
            citizen.id = citizen_id
            let citizen_parents = get_citizen_parents(citizen)
            let citizen_is_old_enough = citizen.ageYears >= 15
            let citizen_is_single = citizen.couple == null
            let candidates_count = 0
            if(citizen_is_old_enough && citizen_is_single){
                citizens.forEach((candidate, candidate_id) => {
                    candidate.id = candidate_id*1
                    let candidate_and_citizen_differents = candidate_id != citizen_id
                    let candidate_has_different_gender = candidate.gender != citizen.gender
                    let age_difference_within_limits = Math.abs(citizen.ageYears - candidate.ageYears) < 40
                    let candidate_is_old_enough = candidate.ageYears >= 15
                    let candidate_is_single = candidate.couple == null
                    //Current citizen found is a possible candidate or simply discard him/her?
                    if(candidate_and_citizen_differents && candidate_has_different_gender && age_difference_within_limits 
                        && candidate_is_old_enough && candidate_is_single){
                        //Check consanguinity level 1 between citizen and candidate.
                        let candidate_parents = get_citizen_parents(candidate)
                        let citizen_is_parent_of_candidate = candidate_parents.includes(citizen_id)
                        let candidate_is_parent_of_citizen = citizen_parents.includes(candidate_id)
                        let have_consanguinity_1 = citizen_is_parent_of_candidate || candidate_is_parent_of_citizen
                        //Check consanguinity level 2 between citizen and candidate.
                        let citizen_and_candidate_are_siblings = citizens_are_siblings(citizen, candidate)
                        /*(candidate.father && citizens[candidate.father].children.filter((id) => id != candidate_id).includes(citizen_id)) ||
                                           (candidate.mother && citizens[candidate.mother].children.filter((id) => id != candidate_id).includes(citizen_id)) ||
                                           (candidate.father && citizens[citizen.father].children.filter((id) => id != citizen_id).includes(candidate_id)) ||
                                           (candidate.mother && citizens[citizen.mother].children.filter((id) => id != citizen_id).includes(candidate_id))*/
                        let candidate_grandparents = get_citizen_grandparents(candidate)
                        let citizen_grandparents = get_citizen_grandparents(citizen)
                        let candidate_is_citizen_s_grandchild = candidate_grandparents.includes(citizen_id)
                        let candidate_is_citizen_s_grandparent = citizen_grandparents.includes(candidate_id)
                        let have_consanguinity_2 = citizen_and_candidate_are_siblings || candidate_is_citizen_s_grandchild 
                                                   || candidate_is_citizen_s_grandparent
                        //Check consanguinity level 3 between citizen and candidate.
                        let citizen_uncles = get_citizen_uncles(citizen)
                        let candidate_uncles = get_citizen_uncles(candidate)
                        let candidate_is_uncle_of_citizen = candidate_uncles.includes(citizen_id)
                        let citizen_is_uncle_of_candidate = citizen_uncles.includes(candidate_id)
                        let citizen_cousins = get_citizen_cousins(citizen)
                        let candidate_and_citizen_are_cousins = citizen_cousins.includes(candidate_id)
                        let have_consanguinity_3 = candidate_is_uncle_of_citizen || citizen_is_uncle_of_candidate 
                                                   || candidate_and_citizen_are_cousins
                        let is_a_possible_candidate = !have_consanguinity_1 && !have_consanguinity_2 && !have_consanguinity_3
                        if(is_a_possible_candidate){
                            h2 = new element("h2", "grow selectable-couple", [], p.getNode(), `couple-citizen-${candidate_id}`); h2.create()
                            d = new element("div", "flex items-center justify-between w-full py-1 px-2 text-xs text-gray-400 bg-gray-700 border border-gray-900 gap-3 text-gray-400", [], h2.getNode()); d.create()
                            s = new element("span", "", [], d.getNode()); s.create()
                            let gender_class = candidate.gender == "Femenine" ? "fa-venus" : "fa-mars"
                            let gender_color_class = candidate.gender == "Femenine" ? "text-red-500" : "text-blue-500"
                            i = new element("i", `me-1 fa ${gender_class} ${gender_color_class}`, [], s.getNode(), `couple-citizen-${candidate_id}-gender-icon`); i.create()
                            let age_class = (candidate.ageYears <= 5 ? "fa-baby" : (candidate.ageYears < 15 ? "fa-child" : (candidate.ageYears < 21 ? "fa-person-walking" : (candidate.ageYears < 50 ? "fa-person" : (candidate.ageYears < 65 ? "fa-person" : "fa-person-cane"))))); 
                            i = new element("i", `me-1 fa ${age_class} text-white`, [], s.getNode(), `couple-citizen-${candidate_id}-age-icon`); i.create()
                            i = new element("i", "text-green-500 fa me-1 fa-fish", [], s.getNode(), `couple-citizen-${candidate_id}-role-icon`); i.create()
                            s1 = new element("span", "rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 me-1", [], s.getNode(), `couple-citizen-${candidate_id}-xp-icon`)
                            s1 = new element("span", "ms-1", [], s.getNode(), `couple-citizen-${candidate_id}-name`); s1.create(); s1.appendContent(candidate.name)
                            s = new element("span", "", [], d.getNode()); s.create()
                            i = new element("i", "fa fa-down me-2", [{"key":"data-index", "value":candidate_id}], s.getNode(), `couple-citizen-${candidate_id}-view-attributes`); i.create()
                            i.getNode().addEventListener("click", show_citizen_attributes)
                            i = new element("i", "fa fa-eye me-2", [{"key":"data-index", "value":candidate_id}], s.getNode(), `couple-citizen-${candidate_id}-view-info`); i.create()
                            i.getNode().addEventListener("click", modal_citizen_info)
                            i = new element("i", "fa fa-regular fa-square", [], s.getNode(), `couple-citizen-${candidate_id}-assign`); i.create()
                            i.getNode().addEventListener("click", assign_couple_to_citizen)
                            candidates_count++
                        }
                    }
                })
            }
            if(!candidates_count){
                let p1 = new element("p", "empty ms-1 text-xs flex justify-between text-gray-200", [], p.getNode()); p1.create()
                s = new element("span", "", [], p1.getNode()); s.create()
                i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                s1 = new element("span", "", [{"key": "data-i18n", "value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No candidates available"))
            }
        }
        if(this.panelName == "tryBreeding"){
            //Specific Try breeding panel.
            p.create()
            let stage = 0, attraction_percent_citizen = 0, attraction_percent_couple = 0, accumulative_percent = 0
            let accumulative_percent_citizen = 0, accumulative_percent_couple = 0
            let breeding_stage
            let citizen_id = document.getElementById(`accordion-relationship-${this.objectId}`).getAttribute("data-citizen-1")
            let couple_id = document.getElementById(`accordion-relationship-${this.objectId}`).getAttribute("data-citizen-2")
            let citizen = citizens[citizen_id]
            let couple = citizens[couple_id]
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], p.getNode(), `accordion-relationship-${this.objectId}-breeding-processes`); d.create()
            //Build mutual knowledge process header
            h2 = new element("h2", "", [], d.getNode(), `accordion-relationship-${this.objectId}-breeding-stages-header`); h2.create()
            b = new element("button", "unattached-click flex items-center justify-between w-full py-1 px-2 text-xs text-gray-400 bg-gray-900 border border-gray-700 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-breeding-stages-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-breeding-stages-body`}], h2.getNode())
            b.create()
            s = new element("span", "flex items-center w-full", [], b.getNode()); s.create()
            s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Mutual knowledge process"))
            s1 = new element("span", "grow flex justify-end", [], s.getNode()); s1.create()
            s2 = new element("span", "px-1 border border-gray-300 text-white", [], s1.getNode(), `relationship-${this.objectId}-attraction-group`); s2.create()
            i = new element("i", "fa me-1 font-bold", [], s2.getNode(), `relationship-${this.objectId}-attraction-icon`); i.create();
            let s3 = new element("span", "font-bold", [], s2.getNode(), `relationship-${this.objectId}-attraction-value`); s3.create(); s3.appendContent("100%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //Build mutual knowledge process body
            d1 = new element("div", "hidden p-1 border border-gray-900 bg-gray-500", [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-breeding-stages-header`}], d.getNode(), `accordion-relationship-${this.objectId}-breeding-stages-body`)
            d1.create()
            //Obtain couple's information
            let citizen_own_attributes = new Set(citizen.attributes)
            let citizen_wished_attributes = new Set(citizen.wishedAttributes)
            let citizen_hated_attribute = citizen.hatedAttribute
            let citizen_age_group = citizen.ageYears < 21 ? 1 : (citizen.ageYears < 50 ? 2 : (citizen.ageYears < 65 ? 3 : 4))
            let couple_age_group = couple.ageYears < 21 ? 1 : (couple.ageYears < 50 ? 2 : (couple.ageYears < 65 ? 3 : 4))
            let citizen_couple_age_group_difference = Math.abs(citizen_age_group - couple_age_group)
            let citizen_couple_age_difference = Math.abs(citizen.ageYears - couple.ageYears)
            let couple_own_attributes = new Set(couple.attributes)
            let couple_wished_attributes = new Set(couple.wishedAttributes)
            let couple_hated_attribute = couple.hatedAttribute
            let stage_accordion_bg_class, status_message, stage_class
            
            //Relationship final results
            d = new element("div", "hidden m-1 mb-1 border border-gray-800 text-white grow", [], d1.getNode(), `accordion-relationship-${this.objectId}-stages-result`); d.create()
            p = new element("p", "p-1 px-2 w-full", [], d.getNode()); p.create()
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(translate(language, "and"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [], p.getNode(), `accordion-relationship-${this.objectId}-stages-result-viability`); s.create()
            s = new element("span", "ms-1 font-bold", [], p.getNode(), `accordion-relationship-${this.objectId}-stages-result-grade`); s.create()
            s = new element("span", "hidden ms-1", [], p.getNode()); s.create(); s.appendContent(translate(language, "relationship"))
            p = new element("p", "p-1 px-2 flex w-full", [], d.getNode()); p.create()
            s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction level obtained"))
            s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [], p.getNode(), `accordion-relationship-${this.objectId}-stages-result-attraction`); s.create()

            d = new element("div", "m-1 mb-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stages`); d.create()
            //Stages details header
            h2 = new element("h2", "", [], d.getNode(), `accordion-relationship-${this.objectId}-stages-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs bg-gray-700 border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stages-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stages-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stages details"))
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //Stages details body
            d1 = new element("div", `hidden p-1 px-1 mb-1 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stages-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stages-body`)
            d1.create()
            
            //Stage 1: Strong interest of citizen
            stage = 1
            breeding_stage = breeding_stages[stage-1]
            //Evaluate interest of citizen.
            let citizen_much_interested_in_couple = citizen_wished_attributes.intersection(couple_own_attributes).size
            attraction_percent_citizen = citizen_much_interested_in_couple ? breeding_stage.percent*1 : 0
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent += Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = citizen_much_interested_in_couple ? "bg-green-900" : "bg-gray-700"
            status_message = citizen_much_interested_in_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(citizen.name.split(",")[0])
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            /*
            s2 = new element("span", `${stage_color} ms-1` , [], s1.getNode()); s2.create(); s2.appendContent("[")
            s2 = new element("span", `${stage_color} ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent(accumulative_percent.toString() + "%")
            s2 = new element("span", `${stage_color} ms-1`, [], s1.getNode()); s2.create(); s2.appendContent("]")
            */
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 mb-1 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "is very interested in"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "flex items-center", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${citizen.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 2: Strong interest of couple
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate interest of couple.
            let couple_much_interested_in_citizen = couple_wished_attributes.intersection(citizen_own_attributes).size
            attraction_percent_couple = couple_much_interested_in_citizen ? breeding_stage.percent*1 : 0
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = couple_much_interested_in_citizen ? "bg-green-900" : "bg-gray-700"
            status_message = couple_much_interested_in_citizen ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(couple.name.split(",")[0])
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "is very interested in"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "flex items-center", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${couple.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }

            //Stage 3: Big love of citizen
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate big love of citizen.
            let citizen_in_love_with_couple = citizen_wished_attributes.intersection(couple_own_attributes).size > 1
            attraction_percent_citizen = citizen_in_love_with_couple ? breeding_stage.percent*1 : 0
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = citizen_in_love_with_couple ? "bg-green-900" : "bg-gray-700"
            status_message = citizen_in_love_with_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(citizen.name.split(",")[0])
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "is in love with"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "font-bold", [],p.getNode()); s.create(); s.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${citizen.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }           
            
            //Stage 4: Big love of couple
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate big love of couple.
            let couple_in_love_with_citizen = couple_wished_attributes.intersection(citizen_own_attributes).size > 1
            attraction_percent_couple = couple_in_love_with_citizen ? breeding_stage.percent*1 : 0
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = couple_in_love_with_citizen ? "bg-green-900" : "bg-gray-700"
            status_message = couple_in_love_with_citizen ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(couple.name.split(",")[0])
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "is in love with"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${couple.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }

            //Stage 5: Passion of citizen
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate passion of citizen.
            let citizen_passionate_with_couple = citizen_wished_attributes.intersection(couple_own_attributes).size == 3
            attraction_percent_citizen = citizen_passionate_with_couple ? breeding_stage.percent*1 : 0
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = citizen_passionate_with_couple ? "bg-green-900" : "bg-gray-700"
            status_message = citizen_passionate_with_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(citizen.name.split(",")[0])
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "is passionate for"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${citizen.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 6: Passion of couple
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate passion of couple.
            let couple_passionate_with_citizen = couple_wished_attributes.intersection(citizen_own_attributes).size == 3
            attraction_percent_couple = couple_passionate_with_citizen ? breeding_stage.percent*1 : 0
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = couple_passionate_with_citizen ? "bg-green-900" : "bg-gray-700"
            status_message = couple_passionate_with_citizen ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(couple.name.split(",")[0])
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "is passionate for"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${couple.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 7: Compatibility of citizen
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate compatibility of citizen.
            let citizen_feels_compatible_with_couple
            attributes[language].forEach((attribute_class) => {
                let class_attributes = new Set(attribute_class.attributes)
                if(couple_own_attributes.intersection(class_attributes).size && citizen_wished_attributes.intersection(class_attributes).size){
                    citizen_feels_compatible_with_couple = true
                }
            })
            attraction_percent_citizen = citizen_feels_compatible_with_couple ? breeding_stage.percent*1 : 0
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = citizen_feels_compatible_with_couple ? "bg-green-900" : "bg-gray-700"
            status_message = citizen_feels_compatible_with_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(citizen.name.split(",")[0])
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels compatible with"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${citizen.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }

            //Stage 8: Compatibility of couple
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate compatibility of citizen.
            let couple_feels_compatible_with_citizen
            attributes[language].forEach((attribute_class) => {
                let class_attributes = new Set(attribute_class.attributes)
                if(citizen_own_attributes.intersection(class_attributes).size && couple_wished_attributes.intersection(class_attributes).size){
                    couple_feels_compatible_with_citizen = true
                }
            })
            attraction_percent_couple = couple_feels_compatible_with_citizen ? breeding_stage.percent*1 : 0
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = couple_feels_compatible_with_citizen ? "bg-green-900" : "bg-gray-700"
            status_message = couple_feels_compatible_with_citizen ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(couple.name.split(",")[0])
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels compatible with"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${couple.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }

            //Stage 9: Citizen feels too young
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if citizen feels too young.
            let citizen_feels_too_young_for_couple = citizen_age_group < couple_age_group
            attraction_percent_citizen = breeding_stage.percent[citizen_couple_age_group_difference]*1
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = citizen_feels_too_young_for_couple ? "bg-red-900" : "bg-green-900"
            status_message = citizen_feels_too_young_for_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(citizen.name.split(",")[0])
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels too young for"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "'s age:"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.ageYears.toString())
            s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(translate(language, "and"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "'s age:"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.ageYears.toString())
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${citizen.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }

            //Stage 10: Couple feels too young
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if couple feels too young.
            let couple_feels_too_young_for_citizen = couple_age_group < citizen_age_group
            attraction_percent_couple = breeding_stage.percent[citizen_couple_age_group_difference]*1
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = couple_feels_too_young_for_citizen ? "bg-red-900" : "bg-green-900"
            status_message = couple_feels_too_young_for_citizen ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(couple.name.split(",")[0])
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels too young for"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "'s age:"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.ageYears.toString())
            s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(translate(language, "and"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "'s age:"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.ageYears.toString())
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${couple.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 11: Citizen feels too old
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if couple feels too young.
            let citizen_feels_too_old_for_couple = couple_age_group < citizen_age_group
            attraction_percent_citizen = breeding_stage.percent[citizen_couple_age_group_difference]*1
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = citizen_feels_too_old_for_couple ? "bg-red-900" : "bg-green-900"
            status_message = citizen_feels_too_old_for_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(citizen.name.split(",")[0])
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels too old for"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "'s age:"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.ageYears.toString())
            s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(translate(language, "and"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "'s age:"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.ageYears.toString())
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${citizen.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }

            //Stage 12: Couple feels too old
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if citizen feels too young.
            let couple_feels_too_old_for_citizen = citizen_age_group < couple_age_group
            attraction_percent_couple = breeding_stage.percent[citizen_couple_age_group_difference]*1
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = couple_feels_too_old_for_citizen ? "bg-red-900" : "bg-green-900"
            status_message = couple_feels_too_old_for_citizen ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(couple.name.split(",")[0])
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels too old for"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "'s age:"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.ageYears.toString())
            s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(translate(language, "and"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "'s age:"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.ageYears.toString())
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${couple.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 13: Both citizens feel age difference
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate how they both feel the age difference with the other.
            attraction_percent_citizen = attraction_percent_couple = age_difference_attraction(citizen_couple_age_difference)
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = attraction_percent_citizen > 0 ? "bg-green-900" : (attraction_percent_citizen < 0 ? "bg-red-900" : "bg-gray-700")
            status_message = attraction_percent_citizen >= 0 ? translate(language, "not fulfilled", "f", "capitalized") : translate(language, "fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "and"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feel their age difference"))
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "'s age:"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.ageYears.toString())
            s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(translate(language, "and"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "'s age:"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.ageYears.toString())
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent("=>")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent("=>")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 14: Citizen feels admiration
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if citizen feels admiration.
            let citizen_feels_admiration_for_couple = true
            attributes[language].forEach((attribute_class) => {
                let class_attributes = new Set(attribute_class.attributes)
                citizen_feels_admiration_for_couple &&= couple_own_attributes.intersection(class_attributes).size
            })
            attraction_percent_citizen = citizen_feels_admiration_for_couple ? breeding_stage.percent*1 : 0
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = citizen_feels_admiration_for_couple ? "bg-green-900" : "bg-gray-700"
            status_message = citizen_feels_admiration_for_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(citizen.name.split(",")[0])
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels that"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "is a complete person"))
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${citizen.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 15: Couple feels admiration
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if couple feels admiration.
            let couple_feels_admiration_for_citizen = true
            attributes[language].forEach((attribute_class) => {
                let class_attributes = new Set(attribute_class.attributes)
                couple_feels_admiration_for_citizen &&= citizen_own_attributes.intersection(class_attributes).size
            })
            attraction_percent_couple = couple_feels_admiration_for_citizen ? breeding_stage.percent*1 : 0
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = couple_feels_admiration_for_citizen ? "bg-green-900" : "bg-gray-700"
            status_message = couple_feels_admiration_for_citizen ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(couple.name.split(",")[0])
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels that"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "is a complete person"))
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${couple.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 16: Citizen feels physical attraction
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if citizen feels physically attracted to couple.
            let couple_physical_attributes = 0
            attributes["EN"].forEach((attribute_class) => {
                if(attribute_class.name == "Physical"){
                    couple.attributes.forEach((attribute) => {
                        couple_physical_attributes+= attribute_class.attributes.includes(translate("EN", attribute, "", "", false)) ? 1 : 0
                    })
                }
            })
            let citizen_feels_physically_attracted_to_couple = couple_physical_attributes > 1
            attraction_percent_citizen = citizen_feels_physically_attracted_to_couple ? breeding_stage.percent[couple_physical_attributes]*1 : 0
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = citizen_feels_physically_attracted_to_couple ? "bg-green-900" : "bg-gray-700"
            status_message = citizen_feels_physically_attracted_to_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(citizen.name.split(",")[0])
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels physically attracted to"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${citizen.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 17: Couple feels physical attraction
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if couple feels physically attracted to citizen.
            let citizen_physical_attributes = 0
            attributes["EN"].forEach((attribute_class) => {
                if(attribute_class.name == "Physical"){
                    citizen.attributes.forEach((attribute) => {
                        citizen_physical_attributes+= attribute_class.attributes.includes(translate("EN", attribute, "", "", false)) ? 1 : 0
                    })
                }
            })
            let couple_feels_physically_attracted_to_citizen = citizen_physical_attributes > 1
            attraction_percent_couple = couple_feels_physically_attracted_to_citizen ? breeding_stage.percent[citizen_physical_attributes]*1 : 0
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = couple_feels_physically_attracted_to_citizen ? "bg-green-900" : "bg-gray-700"
            status_message = couple_feels_physically_attracted_to_citizen ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(couple.name.split(",")[0])
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels physically attracted to"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${couple.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }

            //Stage 18: Citizen feels mental attraction
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if citizen feels mentally attracted to couple.
            let couple_mental_attributes = 0
            attributes["EN"].forEach((attribute_class) => {
                if(attribute_class.name == "Mentals"){
                    couple.attributes.forEach((attribute) => {
                        couple_mental_attributes+= attribute_class.attributes.includes(translate("EN", attribute, "", "", false)) ? 1 : 0
                    })
                }
            })
            let citizen_feels_mentally_attracted_to_couple = couple_mental_attributes > 1
            attraction_percent_citizen = citizen_feels_mentally_attracted_to_couple ? breeding_stage.percent[couple_mental_attributes]*1 : 0
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = citizen_feels_mentally_attracted_to_couple ? "bg-green-900" : "bg-gray-700"
            status_message = citizen_feels_mentally_attracted_to_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(citizen.name.split(",")[0])
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels mentally attracted to"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${citizen.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }

            //Stage 19: Couple feels mental attraction
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if couple feels mentally attracted to citizen.
            let citizen_mental_attributes = 0
            attributes["EN"].forEach((attribute_class) => {
                if(attribute_class.name == "Mentals"){
                    citizen.attributes.forEach((attribute) => {
                        citizen_mental_attributes+= attribute_class.attributes.includes(translate("EN", attribute, "", "", false)) ? 1 : 0
                    })
                }
            })
            let couple_feels_mentally_attracted_to_citizen = citizen_mental_attributes > 1
            attraction_percent_couple = couple_feels_mentally_attracted_to_citizen ? breeding_stage.percent[citizen_mental_attributes]*1 : 0
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = couple_feels_mentally_attracted_to_citizen ? "bg-green-900" : "bg-gray-700"
            status_message = couple_feels_mentally_attracted_to_citizen ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(couple.name.split(",")[0])
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels mentally attracted to"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${couple.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }

            //Stage 20: Both citizens feel things in common
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate how they both feel having things in common with the other.
            let common_attributes = citizen_own_attributes.intersection(couple_own_attributes)
            let both_have_something_in_common = common_attributes.size > 0
            attraction_percent_citizen = attraction_percent_couple = both_have_something_in_common ? breeding_stage.percent[common_attributes.size]*1 : 0
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = attraction_percent_citizen > 0 ? "bg-green-900" : "bg-gray-700"
            status_message = attraction_percent_citizen >= 0 ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels things in common with"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent("=>")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent("=>")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }

            //Stage 21: Citizen feels protected
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if citizen feels protected.
            let citizen_feels_protected_by_couple = couple_own_attributes.has(translate(language, "Protection"))
            attraction_percent_citizen = citizen_feels_protected_by_couple ? breeding_stage.percent*1 : 0
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = citizen_feels_protected_by_couple ? "bg-green-900" : "bg-gray-700"
            status_message = citizen_feels_protected_by_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(citizen.name.split(",")[0])
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels protected by"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${citizen.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 22: Couple feels protected
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if couple feels protected.
            let couple_feels_protected_by_couple = citizen_own_attributes.has(translate(language, "Protection"))
            attraction_percent_couple = couple_feels_protected_by_couple ? breeding_stage.percent*1 : 0
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = couple_feels_protected_by_couple ? "bg-green-900" : "bg-gray-700"
            status_message = couple_feels_protected_by_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(couple.name.split(",")[0])
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels protected by"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${couple.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 23: Citizen feels supported
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if citizen feels supported.
            let citizen_feels_supported_by_couple = couple_own_attributes.has(translate(language, "Partnership"))
            attraction_percent_citizen = citizen_feels_supported_by_couple ? breeding_stage.percent*1 : 0
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = citizen_feels_supported_by_couple ? "bg-green-900" : "bg-gray-700"
            status_message = citizen_feels_supported_by_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(citizen.name.split(",")[0])
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels supported by"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${citizen.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 24: Couple feels supported
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if couple feels supported.
            let couple_feels_supported_by_citizen = citizen_own_attributes.has(translate(language, "Partnership"))
            attraction_percent_couple = couple_feels_supported_by_citizen ? breeding_stage.percent*1 : 0
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = couple_feels_supported_by_citizen ? "bg-green-900" : "bg-gray-700"
            status_message = couple_feels_supported_by_citizen ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(couple.name.split(",")[0])
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels supported by"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${couple.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 25: Citizen feels delighted
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if citizen feels supported.
            let citizen_feels_delighted_by_couple = couple_own_attributes.has(translate(language, "Sympathy"))
            attraction_percent_citizen = citizen_feels_delighted_by_couple ? breeding_stage.percent*1 : 0
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = citizen_feels_delighted_by_couple ? "bg-green-900" : "bg-gray-700"
            status_message = citizen_feels_delighted_by_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(citizen.name.split(",")[0])
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels delighted by"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${citizen.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 26: Couple feels delighted
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if couple feels delighted.
            let couple_feels_delighted_by_citizen = citizen_own_attributes.has(translate(language, "Sympathy"))
            attraction_percent_couple = couple_feels_delighted_by_citizen ? breeding_stage.percent*1 : 0
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = couple_feels_delighted_by_citizen ? "bg-green-900" : "bg-gray-700"
            status_message = couple_feels_delighted_by_citizen ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(couple.name.split(",")[0])
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels delighted by"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${couple.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 27: Citizen feels convinced
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if citizen feels supported.
            let citizen_feels_convinced_by_couple = couple_own_attributes.has(translate(language, "Charisma"))
            attraction_percent_citizen = citizen_feels_convinced_by_couple ? breeding_stage.percent*1 : 0
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = citizen_feels_convinced_by_couple ? "bg-green-900" : "bg-gray-700"
            status_message = citizen_feels_convinced_by_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(citizen.name.split(",")[0])
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels convinced by"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${citizen.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 28: Couple feels convinced
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if couple feels delighted.
            let couple_feels_convinced_by_citizen = citizen_own_attributes.has(translate(language, "Charisma"))
            attraction_percent_couple = couple_feels_convinced_by_citizen ? breeding_stage.percent*1 : 0
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = couple_feels_convinced_by_citizen ? "bg-green-900" : "bg-gray-700"
            status_message = couple_feels_convinced_by_citizen ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(couple.name.split(",")[0])
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "feels convinced by"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${couple.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 29: Citizen dislikes something
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if citizen feels supported.
            let citizen_dislikes_something_of_couple = couple_own_attributes.has(citizen_hated_attribute)
            attraction_percent_citizen = citizen_dislikes_something_of_couple ? breeding_stage.percent*1 : 0
            accumulative_percent_citizen += attraction_percent_citizen; accumulative_percent_citizen = Math.max(accumulative_percent_citizen, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = citizen_dislikes_something_of_couple ? "bg-red-900" : "bg-gray-700"
            status_message = citizen_dislikes_something_of_couple ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(citizen.name.split(",")[0])
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_citizen >= 0 ? "+" : "") + attraction_percent_citizen.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "dislikes something of"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_citizen){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_citizen.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${citizen.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_citizen.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            
            //Stage 30: Couple feels convinced
            stage++
            breeding_stage = breeding_stages[stage-1]
            //Evaluate if couple feels delighted.
            let couple_dislikes_something_of_citizen = citizen_own_attributes.has(couple_hated_attribute)
            attraction_percent_couple = couple_dislikes_something_of_citizen ? breeding_stage.percent*1 : 0
            accumulative_percent_couple += attraction_percent_couple; accumulative_percent_couple = Math.max(accumulative_percent_couple, 0)
            accumulative_percent = Math.min(accumulative_percent_citizen, accumulative_percent_couple, 100)
            stage_accordion_bg_class = couple_dislikes_something_of_citizen ? "bg-red-900" : "bg-gray-700"
            status_message = couple_dislikes_something_of_citizen ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
            d = new element("div", "m-1 grow", [{"key":"data-accordion","value":"collapse"}], d1.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}`); d.create()
            //header
            h2 = new element("h2", "mt-1", [], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-header`); h2.create()
            b = new element("button", `unattached-click flex items-center justify-between w-full py-1 px-2 text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-stage-${stage}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-stage-${stage}-body`}], h2.getNode())
            b.create()
            p = new element("p", "flex justify-between w-full", [], b.getNode()); p.create()
            s1 = new element("span", `text-gray-300`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Stage"))
            s1 = new element("span", `text-gray-300 ms-1` , [], p.getNode()); s1.create(); s1.appendContent(stage.toString())
            s1 = new element("span", `text-gray-300`, [], p.getNode()); s1.create(); s1.appendContent(":")
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [], p.getNode()); s1.create(); s1.appendContent(couple.name.split(",")[0])
            s1 = new element("span", `text-gray-300 ms-1 font-bold`, [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, breeding_stage.description))
            s1 = new element("span", "grow flex justify-end", [], p.getNode()); s1.create()
            s2 = new element("span", `text-gray-300 ms-1 font-bold`, [], s1.getNode()); s2.create(); s2.appendContent((attraction_percent_couple >= 0 ? "+" : "") + attraction_percent_couple.toString() + "%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //body
            d2 = new element("div", `hidden p-1 px-2 border border-gray-900 ${stage_accordion_bg_class}`, [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-stage-${stage}-header`}], d.getNode(), `accordion-relationship-${this.objectId}-stage-${stage}-body`)
            d2.create()
            p = new element("p", "", [], d2.getNode()); p.create();
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
            s = new element("span", "ms-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "dislikes something of"))
            s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name.split(",")[0])
            p = new element("p", "flex justify-between", [], d2.getNode()); p.create();
            s1 = new element("span", "", [], p.getNode()); s1.create()
            s = new element("span", "", [{"key":"data-i18n","value":""}], s1.getNode()); s.create(); s.appendContent(translate(language, "Status"))
            s = new element("span", "", [], s1.getNode()); s.create(); s.appendContent(":")
            s = new element("span", "ms-1 font-bold", [{"key":"data-i18n","value":""}], s1.getNode(), `breeding-stage-${stage}-status`); s.create(); s.appendContent(status_message)
            p = new element("p", "", [], d2.getNode()); p.create();
            if(attraction_percent_couple){
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Attraction gained"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(attraction_percent_couple.toString() + "%")
                s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(`[${couple.name.split(",")[0]} ${translate(language, "accumulates")}`)
                s = new element("span", "ms-1 font-bold", [], p.getNode()); s.create(); s.appendContent(accumulative_percent_couple.toString() + "%")
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent("]")
            } else {
                s = new element("span", "text-red-400 font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name.split(",")[0])
                s = new element("span", "ms-1 text-red-400", [], p.getNode()); s.create(); s.appendContent(translate(language, "gained no attraction in this stage"))
            }
            //Compute header results
            document.getElementById(`accordion-relationship-${this.objectId}-stages-result`).classList.remove("hidden")
            if(accumulative_percent >= 70){
                document.getElementById(`accordion-relationship-${this.objectId}-stages-result-viability`).innerHTML = translate(language, "have")
                let relationship_grade = accumulative_percent <= 80 ? "a good" : (accumulative_percent <= 90 ? "an excellent" : "a wonderful")
                document.getElementById(`accordion-relationship-${this.objectId}-stages-result`).querySelector(".hidden").classList.remove("hidden")
                document.getElementById(`accordion-relationship-${this.objectId}-stages-result-grade`).innerHTML = translate(language, relationship_grade)
            } else {
                document.getElementById(`accordion-relationship-${this.objectId}-stages-result-viability`).innerHTML = translate(language, "cannot have")
                document.getElementById(`accordion-relationship-${this.objectId}-stages-result-grade`).innerHTML = translate(language, "a relationship, unfortunately.")
            }
            document.getElementById(`accordion-relationship-${this.objectId}-stages-result-attraction`).innerHTML = accumulative_percent + "%"
            document.getElementById(`accordion-relationship-${this.objectId}-stages-result`).classList.add(accumulative_percent >= 70 ? "bg-green-900" : "bg-gray-800")
            if(accumulative_percent < 70){
                document.getElementById(`accordion-relationship-${this.objectId}-stages-result-attraction`).classList.add("text-red-500")
                document.querySelector(`#accordion-relationship-${this.objectId}-stages-result p:first-child`).classList.add("text-red-500")
            }
            document.getElementById(`relationship-${this.objectId}-attraction-group`).classList.add(accumulative_percent >= 70 ? "bg-green-700" : "bg-red-700")
            document.getElementById(`relationship-${this.objectId}-attraction-icon`).classList.add(accumulative_percent >= 70 ? "fa-thumbs-up" : "fa-thumbs-down")
            document.getElementById(`relationship-${this.objectId}-attraction-value`).innerHTML = accumulative_percent.toString()+"%"
            
            //Mutual knowledge process result
            let parent_elem = document.querySelector(`#accordion-relationship-${this.objectId}-breeding-stages-body`)
            let process_results = [], process_result_errors = []
            let process_class = accumulative_percent >= 70 ? "bg-green-900" : "bg-red-800"
            process_results[0] = accumulative_percent >= 70 ? "Successfully completed" : "Not completed"
            process_result_errors[0] = accumulative_percent < 70 ? translate(language, "They both feel insufficient attraction") : false
            d = new element("div", `m-1 ${process_class} p-1 border border-gray-800 bg-gray-600 text-white grow`, [], parent_elem, `accordion-relationship-${this.objectId}-attraction-results`); d.create()
            p = new element("p", "px-1 w-full", [], d.getNode()); p.create()
            s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Process result"))
            s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
            s = new element("span", `ms-1 font-bold`, [], p.getNode()); s.create(); s.appendContent(translate(language, process_results[0]))
            if(process_result_errors[0]){
                p = new element("p", "px-1 w-full", [], d.getNode()); p.create()
                s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(process_result_errors[0])
            }

            //Build fertility process header
            let parent_div = document.querySelector(`#accordion-relationship-${this.objectId}-breeding-processes`)
            h2 = new element("h2", "mt-1", [], parent_div, `accordion-relationship-${this.objectId}-breeding-fertility-header`); h2.create()
            b = new element("button", "unattached-click flex items-center justify-between w-full py-1 px-2 text-xs text-gray-400 bg-gray-900 border border-gray-700 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${this.objectId}-breeding-fertility-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${this.objectId}-breeding-fertility-body`}], h2.getNode())
            b.create()
            s = new element("span", "flex items-center w-full", [], b.getNode()); s.create()
            s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "Fertility check process"))
            s1 = new element("span", "grow flex justify-end", [], s.getNode()); s1.create()
            s2 = new element("span", "px-1 border border-gray-300 text-white", [], s1.getNode(), `relationship-${this.objectId}-fertility-group`); s2.create()
            i = new element("i", "fa font-bold", [], s2.getNode(), `relationship-${this.objectId}-fertility-icon`); i.create();
            //s3 = new element("span", "font-bold", [], s2.getNode(), `relationship-${this.objectId}-fertility-value`); s3.create(); s3.appendContent("100%")
            b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
            enable_accordion_click(b.getNode())
            //Build fertility process body
            d1 = new element("div", "hidden p-1 border border-gray-900 bg-gray-500", [{"key":"aria-labelledby","value":`accordion-relationship-${this.objectId}-breeding-fertility-header`}], parent_div, `accordion-relationship-${this.objectId}-breeding-fertility-body`)
            d1.create()
            let citizen_has_fertility = citizen.fertility > 0
            let citizen_class = citizen_has_fertility ? "text-green-500" : "text-red-500"
            let couple_has_fertility = couple.fertility > 0
            let couple_class = couple_has_fertility ? "text-green-500" : "text-red-500"
            let both_have_fertility = citizen_has_fertility && couple_has_fertility
            let woman_fertile
            d = new element("div", "p-1 border border-gray-800 bg-gray-800 text-white grow", [], d1.getNode(), `accordion-relationship-${this.objectId}-fertility-levels-title`); d.create()
            p = new element("p", "px-1 w-full", [], d.getNode()); p.create()
            s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Citizen's fertility levels"))
            d = new element("div", "m-1 mb-1 p-1 border border-gray-800 bg-gray-600 text-white grow", [], d1.getNode(), `accordion-relationship-${this.objectId}-fertility-levels`); d.create()
            p = new element("p", "px-1 w-full", [], d.getNode()); p.create()
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(citizen.name)
            p = new element("p", "px-1 mb-1 w-full", [], d.getNode()); p.create()
            s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Fertility level"))
            s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, ":"))
            s = new element("span", `ms-1 font-bold ${citizen_class}`, [], p.getNode()); s.create(); s.appendContent(citizen.fertility.toString())
            p = new element("p", "px-1 w-full", [], d.getNode()); p.create()
            s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(couple.name)
            p = new element("p", "px-1 w-full", [], d.getNode()); p.create()
            s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Fertility level"))
            s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, ":"))
            s = new element("span", `ms-1 font-bold ${couple_class}`, [], p.getNode()); s.create(); s.appendContent(couple.fertility.toString())
            if(both_have_fertility){
                d = new element("div", "p-1 border border-gray-800 bg-gray-800 text-white grow", [], d1.getNode(), `accordion-relationship-${this.objectId}-fertility-week-title`); d.create()
                p = new element("p", "px-1 w-full", [], d.getNode()); p.create()
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Breeding viability"))
                d = new element("div", "m-1 mb-1 p-1 border border-gray-800 bg-gray-600 text-white grow", [], d1.getNode(), `accordion-relationship-${this.objectId}-fertility-week`); d.create()
                p = new element("p", "px-1 w-full", [], d.getNode()); p.create()
                let woman = citizen.gender.charAt(0) == "F" ? citizen : couple
                let woman_fertility_week
                let current_week = (document.querySelector("#currentWeek").innerHTML*1) % 4
                current_week = !current_week ? 4 : current_week
                let woman_class
                s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(woman.name)
                p = new element("p", "px-1 w-full", [], d.getNode()); p.create()
                if(woman.status != "pregnant"){
                    woman_fertility_week = woman.fertilityWeek
                    woman_fertile = woman_fertility_week == current_week
                    woman_class = woman_fertile ? "text-green-500" : "text-red-500"
                    s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Fertile week"))
                    s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                    s = new element("span", `ms-1 font-bold ${woman_class}`, [], p.getNode()); s.create(); s.appendContent(woman_fertility_week.toString())
                } else {
                    s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Current status"))
                    s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                    s = new element("span", `ms-1 font-bold text-red-500`, [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Pregnant"))
                }
                p = new element("p", "px-1 w-full", [], d.getNode()); p.create()
                s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Month week"))
                s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
                s = new element("span", `ms-1 font-bold ${woman_class}`, [], p.getNode()); s.create(); s.appendContent(current_week.toString())
                if(current_week != woman_fertility_week) {
                    if(woman.status != "pregnant"){
                        process_result_errors[1] = woman.name + " " + translate(language, "is not fertile this week")
                        let remaining_weeks = current_week > woman_fertility_week ? 4 - current_week + woman_fertility_week : woman_fertility_week - current_week
                        s = new element("span", "ms-1 ", [], p.getNode()); s.create(); s.appendContent("(")
                        s = new element("span", `ms-1`, [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "will be fertile in"))
                        s = new element("span", `ms-1 font-bold`, [], p.getNode()); s.create(); s.appendContent(remaining_weeks.toString())
                        s = new element("span", "ms-1 font-bold", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "weeks"))
                        s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent(")")
                    } else {
                        process_result_errors[1] = woman.name + " " + translate(language, "is already pregnant")
                    }
                }
            } else {
                process_result_errors[1] = translate(language, "Someone in the couple is not fertile enough")
            }
            if(woman_fertile && both_have_fertility){
                document.querySelector(`#relationship-${this.objectId}-fertility-group`).classList.add("bg-green-900")
                document.querySelector(`#relationship-${this.objectId}-fertility-icon`).classList.add("fa-thumbs-up")
                process_results[1] = "Successfully completed"
                process_class = "bg-green-800"
            } else {
                document.querySelector(`#relationship-${this.objectId}-fertility-group`).classList.add("bg-red-700")
                document.querySelector(`#relationship-${this.objectId}-fertility-icon`).classList.add("fa-thumbs-down")
                process_results[1] = "Not completed"
                process_class = "bg-red-800"
            }

            //Fertility process result
            d = new element("div", `m-1 ${process_class} p-1 border border-gray-800 bg-gray-600 text-white grow`, [], d1.getNode(), `accordion-relationship-${this.objectId}-fertility-results`); d.create()
            p = new element("p", "px-1 w-full", [], d.getNode()); p.create()
            s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Process result"))
            s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
            s = new element("span", `ms-1 font-bold`, [], p.getNode()); s.create(); s.appendContent(translate(language, process_results[1]))
            if(process_result_errors[1]){
                p = new element("p", "px-1 w-full", [], d.getNode()); p.create()
                s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(process_result_errors[1])
            }

            //Final results
            parent_div = document.getElementById(`relationship-${this.objectId}-tryBreeding`)
            let final_results = process_results[0] == "Successfully completed" && process_results[1] == "Successfully completed" ? "Breeding is possible" : "It is not possible for the couple to breed"
            process_class = final_results != "Breeding is possible" ? "bg-red-800" : "bg-green-900"
            d = new element("div", `ms-1 me-1 mb-1 ${process_class} p-1 flex justify-between border border-gray-800 bg-gray-600 text-white grow`, [], parent_div, `accordion-relationship-${this.objectId}-fertility-results`); d.create()
            d1 = new element("div", `grow`, [], d.getNode()); d1.create()
            p = new element("p", "px-1 w-full", [], d1.getNode()); p.create()
            s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Final result"))
            p = new element("p", "px-1 w-full", [], d1.getNode()); p.create()
            s = new element("span", `font-bold`, [], p.getNode()); s.create(); s.appendContent(translate(language, final_results))
            if(final_results != "Breeding is possible"){
                process_result_errors.forEach((error) => {
                    if(error){
                        p = new element("p", "px-1 mt-1 w-full", [], d1.getNode()); p.create()
                        s = new element("li", "px-2", [], p.getNode()); s.create(); s.appendContent(error)
                    }
                })
            } else {
                d1 = new element("div", `grow flex items-center`, [], d.getNode()); d1.create()
                p = new element("p", "px-1 text-center w-full", [], d1.getNode()); p.create()
                b = new element("button", "bg-gray-800 border border-gray-400 text-gray-200 grow m-2 p-2", [{"key":"type", "value":"button"}], p.getNode()); b.create(); b.appendContent(translate(language, "Start breeding"))
                b.getNode().addEventListener("click", (e) => {
                    //Create pregnancy.
                    let woman = citizen.gender.charAt(0) == "F" ? citizen : couple
                    let man = citizen.gender.charAt(0) == "M" ? citizen : couple
                    //1) Decide if it was a single baby, twins or three kids.
                    let fertility_sum = citizens[man.id].fertility + citizens[woman.id].fertility
                    let children_to_be_born = pregnancy_amount_of_babies(fertility_sum)
                    //2) Create pregnancy object (from template), fill it, and add it to pregnancies set.
                    let a_pregnancy = JSON.parse(JSON.stringify(pregnancy))
                    a_pregnancy.father = man.id
                    a_pregnancy.mother = woman.id
                    a_pregnancy.remaining_weeks = 1//39
                    a_pregnancy.children = children_to_be_born
                    pregnancies.push(a_pregnancy)
                    //3) Change woman status to "pregnant".
                    citizens[woman.id].status = "pregnant"
                    document.getElementById(`citizen-${woman.id}-status`).setAttribute("data-status", "pregnant")
                    document.getElementById(`citizen-${woman.id}-status`).innerHTML = translate(language, "pregnant")
                    //Show remaining weeks next to status.
                    document.getElementById(`citizen-${woman.id}-pregnancy-weeks`).innerHTML = a_pregnancy.remaining_weeks
                    document.getElementById(`citizen-${woman.id}-status`).closest("div").querySelectorAll(".pregnant.hidden").forEach((elem) => {
                        elem.classList.remove("hidden")
                    })
                    //Remove breeding panel.
                    //Get relationship index from panel div id.
                    let relationship_id = e.target.closest(".tryBreeding").id.split("-")[1]
                    //Remove panel divs.
                    document.querySelector(`#relationship-${relationship_id}-tryBreeding-title`).remove()
                    document.querySelector(`#relationship-${relationship_id}-tryBreeding`).remove()
                    //Show previous hidden actions.
                    document.querySelector(`#relationship-${relationship_id}-actions`).classList.remove("hidden")
                    document.querySelector(`#relationship-${relationship_id}-actions-title`).classList.remove("hidden")
                })
            }
        }
        if(this.panelName == "newRule"){
            //Specific New Production Rule panel
            p.create(); p.getNode().id = "new-rule-title"
            s = new element("span", "ms-1", [], p.getNode()); s.create(); s.appendContent("Selecciona un producto")
            p = new element("p", "flex py-1 w-100 justify-between items-center flex-wrap p-1 text-gray-300", [], d1.getNode(), "new-rule-products"); p.create()
            let iElement, buttonText = "", buttonColours = ""
            let products = location_products[this.data.location]["EN"]
            products.forEach((product, index) => {
                divSpecificParagraphButton[index] = document.createElement("button")
                iElement = "<i class='fa fa-plus me-2'></i>"
                buttonText = translate(language, product.charAt(0).toUpperCase()+product.slice(1))
                divSpecificParagraphButton[index].innerHTML = iElement + buttonText
                buttonColours = "border-blue-600 bg-blue-900 text-white"
                divSpecificParagraphButton[index].classList = "rule_product text-xs capitalize "+(index+1 < products.length ? "grow " : "")+"p-2 py-1 me-1 mb-1 button border "+buttonColours
                divSpecificParagraphButton[index].setAttribute("data-product", product)
                p.appendContent(divSpecificParagraphButton[index])
            })
        }
        if(this.panelName == "newExpedition"){
            //Specific New Expedition panel
            p.create()
            //Build type of expedition options
            s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Type"))
            s = new element("span", "", [], p.getNode()); s.create(); s.appendHTML(": ")
            s = new element("span", "expeditionType grow flex", [], p.getNode()); s.create()
            b = new element("button", "text-xs text-white ms-2 grow p-1 button border border-gray-400 bg-green-800", [{"key":"data-type", "value":"of resources"},{"key":"data-i18n", "value":""}], s.getNode())
            b.create(); b.appendContent(translate(language, "of resources"))
            b = new element("button", "text-xs text-white ms-2 grow p-1 button border border-gray-400 bg-blue-800", [{"key":"data-type", "value":"of ruins"},{"key":"data-i18n", "value":""}], s.getNode())
            b.create(); b.appendContent(translate(language, "of ruins"))
            b = new element("button", "text-xs text-white ms-2 grow p-1 button border border-gray-400 bg-red-800", [{"key":"data-type", "value":"of combat"},{"key":"data-i18n", "value":""}], s.getNode())
            b.create(); b.appendContent(translate(language, "of combat"))
            //Button events
            document.querySelectorAll(".expeditionType button").forEach((value) => {
                value.addEventListener("click", (e) => {
                    //Build expedition type legend with colors.
                    let type = e.target.getAttribute("data-type")
                    let background = e.target.classList.contains("bg-blue-800") ? "blue" : (e.target.classList.contains("bg-green-800") ? "green" : "red")
                    document.querySelectorAll(".expeditionType button").forEach((button) => button.classList.add("hidden"))
                    let typeText = "Expedition to "+(e.target.getAttribute("data-type") == "of resources" ? "discover resources mounts" : (e.target.getAttribute("data-type") == "of ruins" ? "discover ruins" : "attack other colonies"))
                    s1 = new element("span", "ms-2 p-1 px-1 text-white border border-gray-400 bg-"+background+"-800", [{"key":"data-i18n", "value":""},{"key":"data-type", "value":e.target.getAttribute("data-type")}], s.getNode())
                    s1.create(); s1.appendContent(translate(language, typeText))
                    //Build needed time text
                    let p1 = new element("p", "w-100 items-center flex-wrap px-1 text-gray-300", [], d1.getNode()); p1.create()
                    s1 = new element("span", "", [{"key":"data-i18n", "value":""}], p1.getNode()); s1.create(); s1.appendContent(translate(language, "Required travel time"))
                    s1 = new element("span", "", [], p1.getNode()); s1.create(); s1.appendHTML(": ")
                    s = new element("span", "ms-1 px-1 rounded bg-gray-700 border border-gray-500", [], p1.getNode(), "expeditionRequiredTime"); s.create()
                    //Initially hidden required time information
                    s2 = new element("span", "hidden", [], s.getNode(), "newExpedition-required-info"); s2.create()
                    s1 = new element("span", "hidden font-bold", [{"key":"data-i18n","value":""}], s2.getNode(), "newExpedition-required-years"); s1.create()
                    s1 = new element("span", "hidden ms-1", [{"key":"data-i18n","value":""}], s2.getNode(), "newExpedition-required-yearsText"); s1.create(); s1.appendHTML(translate(language, "Years", "", "lowercase"))
                    s1 = new element("span", "hidden", [], s2.getNode(), "newExpedition-required-yearsComma"); s1.create(); s1.appendContent(", ")
                    s1 = new element("span", "hidden font-bold", [{"key":"data-i18n","value":""}], s2.getNode(), "newExpedition-required-weeks"); s1.create()
                    s1 = new element("span", "hidden ms-1", [{"key":"data-i18n","value":""}], s2.getNode(), "newExpedition-required-weeksText"); s1.create(); s1.appendHTML(translate(language, "Weeks", "", "lowercase"))
                    s1 = new element("span", "hidden", [], s2.getNode(), "newExpedition-required-weeksComma"); s1.create(); s1.appendContent(", ")
                    s1 = new element("span", "hidden font-bold", [{"key":"data-i18n","value":""}], s2.getNode(), "newExpedition-required-days"); s1.create()
                    s1 = new element("span", "hidden ms-1", [{"key":"data-i18n","value":""}], s2.getNode(), "newExpedition-required-daysText"); s1.create(); s1.appendHTML(translate(language, "Days", "", "lowercase"))
                    s1 = new element("span", "hidden", [], s2.getNode(), "newExpedition-required-daysComma"); s1.create(); s1.appendContent(", ")
                    s1 = new element("span", "font-bold", [{"key":"data-i18n","value":""}], s2.getNode(), "newExpedition-required-hours"); s1.create()
                    s1 = new element("span", "ms-1", [{"key":"data-i18n","value":""}], s2.getNode()); s1.create(); s1.appendHTML("hs.")
                    //Unknown yet text
                    s1 = new element("span", "unknownTime", [], s.getNode()); s1.create(); s1.appendHTML("(")
                    s1 = new element("span", "unknownTime", [{"key":"data-i18n", "value":""},{"key":"gender", "value":"m"}], s.getNode(), "newExpeditionTime"); s1.create(); s1.appendContent(translate(language, "Unknown yet", "m"))
                    s1 = new element("span", "unknownTime", [], s.getNode()); s1.create(); s1.appendHTML(")")
                    //Build mount discovery probability text
                    p1 = new element("p", "w-100 items-center flex-wrap pb-2 px-1 text-gray-300", [], d1.getNode()); p1.create()
                    s1 = new element("span", "", [{"key":"data-i18n", "value":""}], p1.getNode()); s1.create(); s1.appendContent(translate(language, "Mount discovery probability"))
                    s1 = new element("span", "", [], p1.getNode()); s1.create(); s1.appendHTML(": ")
                    s = new element("span", "ms-1 font-bold", [], p1.getNode(), "expeditionProbability"); s.create()
                    s1 = new element("span", "", [], s.getNode()); s1.create(); s1.appendHTML("(")
                    s1 = new element("span", "", [{"key":"data-i18n", "value":""},{"key":"gender", "value":"f"}], s.getNode(), "newExpeditionProbability"); s1.create(); s1.appendContent(translate(language, "Unknown yet", "f"))
                    s1 = new element("span", "", [], s.getNode()); s1.create(); s1.appendHTML(")")
                    /**/
                    p = new element("p", "hidden mb-3 p-1 px-2 rounded font-bold text-white border-red-600 bg-red-600", [], d1.getNode(), "searchZoneWarning"); p.create()
                    s1 = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s1.create()
                    s1.appendContent(translate(language, "Warning! Time is stopped. Search the zone in the Colony panel to start your game."))
                    //Build New expedition available actions title
                    d3 = document.getElementById("expeditions-newExpedition")
                    d2 = new element("div", "border border-gray-800 bg-gray-800 text-xs", [], d1.getNode(), "newExpedition-actions-title")
                    d2.create();
                    p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200", [], d2.getNode()); p.create()
                    s1 = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s1.create(); s1.appendContent(translate(language, "Actions available"))
                    //Build New expedition available actions area
                    d2 = new element("div", "activeExpeditions p-2 ps-3 border border-gray-800 bg-gray-600 text-xs", [], d1.getNode(), "newExpedition-actions-area")
                    d2.create()
                    p = new element("p", "empty w-100 text-xs flex justify-between text-gray-200", [], d2.getNode()); p.create()
                    b = new element("button", "hidden unattached-click text-xs grow p-2 me-1 button border border-gray-400 bg-gray-800", [], p.getNode(), "expeditionStart"); b.create()
                    i = new element("i", "mt-0.5 fa fa-play", [], b.getNode()); i.create()
                    s1 = new element("span", "ms-2 grow", [{"key":"data-i18n", "value":""}], b.getNode()); s1.create()
                    s1.appendContent(translate(language, "Start resources mounts expedition"))
                    s1 = new element("span", "", [], p.getNode(), "newExpeditionNoActions"); s1.create()
                    i = new element("i", "fa fa-light fa-empty-set me-1", [], s1.getNode()); i.create()
                    s2 = new element("span", "", [{"key":"data-i18n","value":""},{"key":"gender","value":"f"}], s1.getNode()); s2.create(); s2.appendContent(translate(language, "None", "f"))

                    //Build workers/army assigned title
                    let assignedType = type == "of combat" ? "army" : "workers"
                    d = new element("div", "border border-gray-800 bg-gray-800 text-xs", [], d1.getNode(), "newExpedition-assigned-"+assignedType+"-title")
                    d.create()
                    p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200", [], d.getNode()); p.create()
                    s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Assigned "+(assignedType == "workers" ? "expeditionaries" : assignedType)))
                    //Build workers assigned panel
                    d = new element("div", "assigned"+(assignedType.charAt(0).toUpperCase()+assignedType.slice(1))+" p-2 ps-3 border border-gray-800 bg-gray-600 text-xs", [], d1.getNode(), "newExpedition-assigned-"+assignedType)
                    d.create()
                    p = new element("p", "empty text-xs flex justify-between text-gray-200", [], d.getNode()); p.create()
                    s = new element("span", "", [], p.getNode()); s.create()
                    i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                    s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); 
                    s1.create(); s1.appendContent(translate(language, "No "+(assignedType == "workers" ? "expeditionaries" : assignedType)+" assigned"))
                    //Build available workers/army title
                    d = new element("div", "border border-gray-800 bg-gray-800 text-xs", [], d1.getNode(), "newExpedition-available-"+assignedType+"-title")
                    d.create()
                    p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200", [], d.getNode()); p.create()
                    s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Available "+(assignedType == "workers" ? "expeditionaries" : assignedType)))
                    //Build available workers/army panel
                    d = new element("div", "available"+(assignedType.charAt(0).toUpperCase()+assignedType.slice(1))+" p-2 ps-3 border border-gray-800 bg-gray-600 text-xs", [], d1.getNode(), "newExpedition-available-"+assignedType)
                    d.create()
                    if(type != "of combat"){
                        //Check if there are available expeditionaries to add here. If not, place the "No workers available" text instead.
                        if(document.querySelectorAll("[data-role=\"expeditioning\"]").length){
                            let availableExpeditionariesExist = false
                            document.querySelectorAll("[data-role=\"expeditioning\"]").forEach((citizen) => {
                                let citizen_index = citizen.id.split("-")[1]
                                document.querySelectorAll("#citizen-"+citizen_index+"-status").forEach((elem) => {
                                    if(elem.getAttribute("data-status") == "idle"){
                                        add_available_worker_to_expedition(citizen_index, "newExpedition")
                                        document.getElementById("citizen-"+citizen_index+"-assign").setAttribute("data-class", "newExpedition")
                                        document.getElementById("citizen-"+citizen_index+"-assign").addEventListener("click", handleToggleWorker)
                                        availableExpeditionariesExist = true
                                    }
                                })
                            })
                            if(!availableExpeditionariesExist){
                                //Add "No workers/army available" text.
                                p = new element("p", "empty text-xs flex justify-between text-gray-200", [], d.getNode()); p.create()
                                s = new element("span", "", [], p.getNode()); s.create()
                                i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                                s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); 
                                s1.create(); s1.appendContent(translate(language, "No "+(assignedType == "workers" ? "expeditionaries" : assignedType)+" available"))
                            }
                        } else {
                            //Add "No workers/army available" text.
                            p = new element("p", "empty text-xs flex justify-between text-gray-200", [], d.getNode()); p.create()
                            s = new element("span", "", [], p.getNode()); s.create()
                            i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                            s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); 
                            s1.create(); s1.appendContent(translate(language, "No "+(assignedType == "workers" ? "expeditionaries" : assignedType)+" available"))
                        }
                    } else {
                        //Add "No army available" text.
                        p = new element("p", "empty text-xs flex justify-between text-gray-200", [], d.getNode()); p.create()
                        s = new element("span", "", [], p.getNode()); s.create()
                        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); 
                        s1.create(); s1.appendContent(translate(language, "No "+(assignedType == "workers" ? "expeditionaries" : assignedType)+" available"))
                    }
                    //Build available other objects title
                    d = new element("div", "border border-gray-800 bg-gray-800 text-xs", [], d1.getNode(), "newExpedition-available-objects-title")
                    d.create()
                    p = new element("p", "text-xs flex justify-between p-1 ps-3 text-gray-200", [], d.getNode()); p.create()
                    s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Other objects available"))
                    //Build available other objects panel
                    d = new element("div", "availableObjects p-2 ps-3 border border-gray-800 bg-gray-600 text-xs", [], d1.getNode(), "newExpedition-available-objects")
                    d.create()
                    //Any horses in stock?
                    if(stock_displayed.products.EN.horse*1){
                        for(let h=0; h<stock_displayed.products.EN.horse*1; h++){
                            add_available_horse_to_expedition().addEventListener("click", handleToggleHorse)
                        }
                    } else {
                        //Add "No other objects available" text.
                        p = new element("p", "empty text-xs flex justify-between text-gray-200", [], d.getNode()); p.create()
                        s = new element("span", "", [], p.getNode()); s.create()
                        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                        s1 = new element("span", "", [{"key":"data-i18n", "value":""}], s.getNode()); 
                        s1.create(); s1.appendContent(translate(language, "No other objects available"))
                    }
                })
            })
        }
        this.isDisplayed = true
    }
}
