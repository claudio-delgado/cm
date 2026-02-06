class Relationship {

    static types = ["couple", "parent", "mother", "father", "child", "son", "daughter", "sibling", "sister", "brother",
                    "grandparent", "grandmother", "grandfather", "grandchild", "grandson", "granddaughter", "aunt", "uncle",
                    "niece", "nephew", "cousin"]
    
    constructor(id, type, citizen, related_citizen) {
        this.id = id
        this.type = Relationship.types.includes(type) ? type : "unknown"
        this.citizen = citizen
        this.related_citizen = related_citizen
    }

    //Draw relationship.
    draw = () => {
        if(this.type == "couple") this.draw_couple_relationship()
    }
    //Show all content information for current relationship
    draw_couple_relationship_content = (d1) => {
        let parent_div = d1.getNode(), d2, p, s0, s1, s2
        let bg_color, text_color, border_color
        //Draw 2 different panels. One for each member of the relationship couple.
        for(let couple_panel_index = 0; couple_panel_index < 2; couple_panel_index++){
            let current_citizen = !couple_panel_index % 2 ? this.citizen : this.related_citizen
            //Citizen's information
            let citizen_is_woman = current_citizen.gender === "Femenine"
            d2 = new DOMElement({
                tagName: "div", 
                classes: "mt-1 mb-1 mx-1 px-1 py-1 border border-gray-800 bg-gray-700", 
                parentElement: parent_div
            })
            //First line: Name, age and Fertility
            p = new DOMElement({
                tagName: "p", 
                classes: "w-100 flex gap-1 p-0 mb-1 text-xs text-gray-200", 
                parentElement: d2.getNode()
            })
            s0 = new DOMElement({
                tagName: "span", 
                classes: "flex", 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: "w-100 flex-none border border-gray-500 p-0.5 px-1 bg-gray-800 text-white", 
                parentElement: s0.getNode()
            })
            s2 = new DOMElement({
                tagName: "span", 
                attributes: [{"key":"data-i18n","value":""}], 
                parentElement: s1.getNode(),
                text: translate(language, citizen_is_woman ? "she is" : "he is", "", "capitalized")
            })
            s2 = new DOMElement({
                tagName: "span", 
                parentElement: s1.getNode(),
                text: ": "
            })
            s0 = new DOMElement({
                tagName: "span", 
                classes: `grow flex gap-1 border border-gray-900 p-0.5 px-1 bg-gray-400 text-${citizen_is_woman ? "red-800" : "blue-800"}`, 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: "font-bold flex-none", 
                parentElement: s0.getNode(),
                text: current_citizen.name
            })
            //Age
            s0 = new DOMElement({
                tagName: "span", 
                classes: "flex", 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: "w-100 flex-none border border-gray-500 p-0.5 px-1 bg-gray-800 text-white", 
                parentElement: s0.getNode()
            })
            s2 = new DOMElement({
                tagName: "span", 
                attributes: [{"key":"data-i18n","value":""}], 
                parentElement: s1.getNode(),
                text: translate(language, "age", "", "capitalized")
            })
            s2 = new DOMElement({
                tagName: "span", 
                parentElement: s1.getNode(),
                text: ": "
            })
            s0 = new DOMElement({
                tagName: "span", 
                classes: `flex gap-1 border border-gray-500 p-0.5 px-1 text-white bg-gray-600`, 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: `font-bold flex-none`, 
                parentElement: s0.getNode(), 
                id: `citizen-${current_citizen.id}-age`,
                text: current_citizen.ageYears.toString()
            })
            //Fertility
            let woman_class = citizen_is_woman ? "woman" : ""
            s0 = new DOMElement({
                tagName: "span", 
                classes: `fertility ${woman_class} flex gap-1`, 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: "w-100 flex-none border border-gray-500 p-0.5 px-1 bg-gray-800 text-white", 
                parentElement: s0.getNode()
            })
            s2 = new DOMElement({
                tagName: "span", 
                attributes: [{"key":"data-i18n","value":""}], 
                parentElement: s1.getNode(),
                text: translate(language, "Fertility", "", "capitalized")
            })
            s2 = new DOMElement({
                tagName: "span", 
                parentElement: s1.getNode(),
                text: ": "
            })
            let fertility_color = current_citizen.fertility.value >= 70 ? "text-green-600" : (current_citizen.fertility.value >= 45 ? "text-yellow-600" : (current_citizen.fertility.value >= 25 ? "text-orange-600" : (current_citizen.fertility.value >= 10 ? "text-red-500" : "fa-beat text-red-700")))
            s0 = new DOMElement({
                tagName: "span", 
                classes: `flex gap-1 border border-gray-500 p-0.5 px-1 ${fertility_color} bg-gray-600`, 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: `fertility font-bold flex-none`, 
                parentElement: s0.getNode(), 
                id: `citizen-${current_citizen.id}-fertility`,
                text: current_citizen.fertility.value.toString() 
            })
            if(citizen_is_woman){
                //Second line: Fertility week and Month week.
                p = new DOMElement({
                    tagName: "p", 
                    classes: "w-100 flex items-center gap-1 p-0 mb-1 text-xs text-gray-200", 
                    parentElement: d2.getNode()
                })
                let month_week = colony.time_interval.get_month_week()
                s0 = new DOMElement({
                    tagName: "span", 
                    classes: "flex", 
                    parentElement: p.getNode()
                })
                s1 = new DOMElement({
                    tagName: "span", 
                    classes: "w-100 flex-none border border-gray-500 p-0.5 px-1 bg-gray-800 text-white", 
                    parentElement: s0.getNode()
                })
                s2 = new DOMElement({
                    tagName: "span", 
                    classes: `fertility-week`, 
                    attributes: [{"key":"data-i18n","value":""}], 
                    parentElement: s1.getNode(),
                    text: translate(language, "Fertile week", "", "capitalized")
                })
                s2 = new DOMElement({
                    tagName: "span", 
                    parentElement: s1.getNode(),
                    text: ": "
                })
                s0 = new DOMElement({
                    tagName: "span", 
                    classes: `flex gap-1 border border-gray-400 p-0.5 px-1 text-gray-200`,
                    parentElement: p.getNode()
                })
                s1 = new DOMElement({
                    tagName: "span", 
                    classes: `fertility-week value relationship font-bold flex-none`, 
                    parentElement: s0.getNode(), 
                    id: `citizen-${current_citizen.id}-fertilityWeek`,
                    text: current_citizen.fertility.week.toString()
                })
                s0 = new DOMElement({
                    tagName: "span", 
                    classes: `flex items-center gap-1 border border-gray-500 p-1 px-1 text-gray-900 bg-gray-800`, 
                    parentElement: p.getNode()
                })
                i = new DOMElement({
                    tagName: "i", 
                    classes: `fertility-week mx-1 week-comparison fa`,
                    id: `citizen-${current_citizen.id}-fertilityWeek-icon`,
                    parentElement: s0.getNode()
                })
                s0 = new DOMElement({
                    tagName: "span", 
                    classes: "flex", 
                    parentElement: p.getNode()
                })
                s1 = new DOMElement({
                    tagName: "span", 
                    classes: "w-100 flex-none border border-gray-500 p-0.5 px-1 bg-gray-800 text-white", 
                    parentElement: s0.getNode()
                })
                s2 = new DOMElement({
                    tagName: "span", 
                    classes: `fertility-week`, 
                    attributes: [{"key":"data-i18n","value":""}], 
                    parentElement: s1.getNode(),
                    text: translate(language, "Month week", "", "capitalized")
                })
                s2 = new DOMElement({
                    tagName: "span", 
                    parentElement: s1.getNode(),
                    text: ": "
                })
                s0 = new DOMElement({
                    tagName: "span", 
                    classes: `flex gap-1 border border-gray-400 p-0.5 px-1 text-gray-200`, 
                    parentElement: p.getNode()
                })
                s1 = new DOMElement({
                    tagName: "span", 
                    classes: `fertility-week month-week relationship font-bold flex-none`, 
                    parentElement: s0.getNode(), 
                    id: `month-week`,
                    text: month_week.toString()
                })
                s0 = new DOMElement({
                    tagName: "span", 
                    classes: `flex grow gap-1 border border-gray-400 p-0.5 px-1 text-gray-200`, 
                    parentElement: p.getNode()
                })
                s1 = new DOMElement({
                    tagName: "span", 
                    classes: `fertility-situation font-bold flex-none p-0 px-1`, 
                    parentElement: s0.getNode(), 
                    id: `citizen-${current_citizen.id}-fertility-situation`
                })
                current_citizen.redraw_citizen_fertility_week()
            }
            //Next line: Attributes.
            p = new DOMElement({
                tagName: "p", 
                classes: "w-100 flex items-center gap-1 p-0 mb-1 text-xs text-gray-200", 
                parentElement: d2.getNode()
            })
            s0 = new DOMElement({
                tagName: "span", 
                className: "flex", 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: "w-100 flex-none border border-gray-500 p-0.5 px-1 bg-gray-800 text-white", 
                parentElement: s0.getNode()
            })
            s2 = new DOMElement({
                tagName: "span", 
                attributes: [{"key":"data-i18n","value":""}], 
                parentElement: s1.getNode(),
                text: translate(language, current_citizen.gender === "Femenine" ? "her attributes are" : "his attributes are", current_citizen.gender.charAt(0), "capitalized")
            })
            s2 = new DOMElement({
                tagName: "span", 
                parentElement: s1.getNode(),
                text: ": "
            })
            bg_color = attributes_colors[language][current_citizen.attributes[0]].bg
            text_color = attributes_colors[language][current_citizen.attributes[0]].text
            border_color = attributes_colors[language][current_citizen.attributes[0]].border
            s0 = new DOMElement({
                tagName: "span", 
                classes: `grow flex justify-center gap-1 border ${border_color} ${text_color} p-0.5 px-1 ${bg_color}`, 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: `font-bold flex-none`, 
                parentElement: s0.getNode(),
                text: current_citizen.attributes[0]
            })
            bg_color = attributes_colors[language][current_citizen.attributes[1]].bg
            text_color = attributes_colors[language][current_citizen.attributes[1]].text
            border_color = attributes_colors[language][current_citizen.attributes[1]].border
            s0 = new DOMElement({
                tagName: "span", 
                classes: `grow flex justify-center gap-1 border ${border_color} ${text_color} p-0.5 px-1 ${bg_color}`, 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: `font-bold flex-none`, 
                parentElement: s0.getNode(),
                text: current_citizen.attributes[1]
            })
            bg_color = attributes_colors[language][current_citizen.attributes[2]].bg
            text_color = attributes_colors[language][current_citizen.attributes[2]].text
            border_color = attributes_colors[language][current_citizen.attributes[2]].border
            s0 = new DOMElement({
                tagName: "span", 
                classes: `grow flex justify-center gap-1 border ${border_color} ${text_color} p-0.5 px-1 ${bg_color}`, 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: `font-bold flex-none`, 
                parentElement: s0.getNode(),
                text: current_citizen.attributes[2]
            })
            //Next line: Wished attributes (wishes).
            p = new DOMElement({
                tagName: "p", 
                classes: "w-100 flex items-center gap-1 p-0 mb-1 text-xs text-gray-200", 
                parentElement: d2.getNode()
            })
            s0 = new DOMElement({
                tagName: "span", 
                className: "flex", 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: "w-100 flex-none border border-gray-500 p-0.5 px-1 bg-gray-800 text-white", 
                parentElement: s0.getNode()
            })
            s2 = new DOMElement({
                tagName: "span", 
                attributes: [{"key":"data-i18n","value":""}], 
                parentElement: s1.getNode(),
                text: translate(language, current_citizen.gender === "Femenine" ? "her wishes are" : "his wishes are", current_citizen.gender.charAt(0), "capitalized")
            })
            s2 = new DOMElement({
                tagName: "span", 
                parentElement: s1.getNode(),
                text: ": "
            })
            bg_color = attributes_colors[language][current_citizen.wishedAttributes[0]].bg
            text_color = attributes_colors[language][current_citizen.wishedAttributes[0]].text
            border_color = attributes_colors[language][current_citizen.wishedAttributes[0]].border
            s0 = new DOMElement({
                tagName: "span", 
                classes: `grow flex justify-center gap-1 border ${border_color} ${text_color} p-0.5 px-1 ${bg_color}`, 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: `font-bold flex-none`, 
                parentElement: s0.getNode(),
                text: current_citizen.wishedAttributes[0]
            })
            bg_color = attributes_colors[language][current_citizen.wishedAttributes[1]].bg
            text_color = attributes_colors[language][current_citizen.wishedAttributes[1]].text
            border_color = attributes_colors[language][current_citizen.wishedAttributes[1]].border
            s0 = new DOMElement({
                tagName: "span", 
                classes: `grow flex justify-center gap-1 border ${border_color} ${text_color} p-0.5 px-1 ${bg_color}`, 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: `font-bold flex-none`, 
                parentElement: s0.getNode(),
                text: current_citizen.wishedAttributes[1]
            })
            bg_color = attributes_colors[language][current_citizen.wishedAttributes[2]].bg
            text_color = attributes_colors[language][current_citizen.wishedAttributes[2]].text
            border_color = attributes_colors[language][current_citizen.wishedAttributes[2]].border
            s0 = new DOMElement({
                tagName: "span", 
                classes: `grow flex justify-center gap-1 border ${border_color} ${text_color} p-0.5 px-1 ${bg_color}`, 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: `font-bold flex-none`, 
                parentElement: s0.getNode(),
                text: current_citizen.wishedAttributes[2]
            })
            //Hated attribute
            p = new DOMElement({
                tagName: "p", 
                classes: "w-100 flex items-center gap-1 p-0 text-xs text-gray-200", 
                parentElement: d2.getNode()
            })
            s0 = new DOMElement({
                tagName: "span", 
                className: "flex", 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: "w-100 flex-none border border-gray-500 p-0.5 px-1 bg-gray-800 text-white", 
                parentElement: s0.getNode()
            })
            s2 = new DOMElement({
                tagName: "span", 
                attributes: [{"key":"data-i18n","value":""}], 
                parentElement: s1.getNode(),
                text: translate(language, "dislikes attribute", current_citizen.gender.charAt(0), "capitalized")
            })
            s2 = new DOMElement({
                tagName: "span", 
                parentElement: s1.getNode(),
                text: ": "
            })
            bg_color = attributes_colors[language][current_citizen.hatedAttribute].bg
            text_color = attributes_colors[language][current_citizen.hatedAttribute].text
            border_color = attributes_colors[language][current_citizen.hatedAttribute].border
            s0 = new DOMElement({
                tagName: "span", 
                classes: `flex justify-center gap-1 border ${border_color} ${text_color} p-0.5 px-1 ${bg_color}`, 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: `font-bold flex-none`, 
                parentElement: s0.getNode(),
                text: current_citizen.hatedAttribute
            })
        }
        //Actions available
        //Title
        d2 = new DOMElement({
            tagName: "div", 
            classes: "border border-gray-800 bg-gray-500 text-xs", 
            parentElement: parent_div, 
            id: `relationship-${this.id}-actions-title`
        })
        p = new DOMElement({
            tagName: "p", 
            classes: "flex justify-between p-1 ps-2 text-xs text-gray-200 bg-gray-800", 
            parentElement: d2.getNode()
        })
        s = new DOMElement({
            tagName: "span", 
            attributes: [{"key":"data-i18n", "value":""}], 
            parentElement: p.getNode(),
            text: translate(language, "Actions available")
        })
        //Area
        d2 = new DOMElement({
            tagName: "div", 
            classes: "bg-gray-600 text-xs", 
            parentElement: parent_div, 
            id: `relationship-${this.id}-actions`
        })
        p = new DOMElement({
            tagName: "p", 
            classes: "flex w-100 justify-between p-1 gap-1 text-gray-300", 
            parentElement: d2.getNode()
        })
        b = new DOMElement({
            tagName: "button", 
            classes: "text-xs grow p-2 button border border-gray-400 bg-gray-800", 
            parentElement: p.getNode(), 
            id: `relationship-${this.id}-reproduce`
        })
        s = new DOMElement({
            tagName: "span", 
            attributes: [{"key":"data-i18n", "value":""}], 
            parentElement: b.getNode(),
            text: translate(language, "Try breeding")
        })
        b.getNode().addEventListener("click", this.try_breeding_event)
        b = new DOMElement({
            tagName: "button", 
            classes: "text-xs grow p-2 button border border-gray-400 bg-gray-800", 
            attributes: [{"key":"data-citizen-id", "value":this.id}], 
            parentElement: p.getNode(), 
            id: `relationship-${this.id}-breakup`
        })
        s = new DOMElement({
            tagName: "span", 
            attributes: [{"key":"data-i18n", "value":""}], 
            parentElement: b.getNode(),
            text: translate(language, "Break up relationship")
        })
        b.getNode().addEventListener("click", this.cancel_relationship_event)
    }
    //Add couple card to relationships panel.
    draw_couple_relationship = () => {
        let d, d0, d1, p, s, i, ga
        //Check if there is no relationship yet in relationships panel.
        let relationships_div = document.querySelector("#couple-relationships")
        if(![undefined, null].includes(relationships_div.querySelector("p.empty"))){
            //Remove "Empty" message.
            relationships_div.querySelector("p.empty").remove()
        }
        //Build new relationship accordion.
        d0 = new DOMElement({
            tagName: "div",
            classes: "w-100",
            parentElement: relationships_div
        })
        d = new DOMElement({
            tagName: "div",
            classes: "w-100 border border-gray-800 bg-gray-800 text-xs",
            attributes: [{"key":"data-body", "value":`accordion-relationship-${this.id}-body`}, {"key":"data-group", "value":`relationships-accordions`}, {"key":"data-citizen", "value":this.citizen.id}],
            id: `accordion-relationship-${this.id}-title`,
            parentElement: d0.getNode()
        })
        p = new DOMElement({
            tagName: "p",
            classes: "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200",
            parentElement: d.getNode()
        })
        let citizen_is_woman = this.citizen.gender.charAt(0) === "F"
        let citizen_gender_class = citizen_is_woman ? "venus" : "mars"
        let citizen_gender_color = citizen_is_woman ? "red" : "blue"
        let couple_gender_class = this.related_citizen.gender.charAt(0) === "F" ? "venus" : "mars"
        let couple_gender_color = this.related_citizen.gender.charAt(0) === "F" ? "red" : "blue"
        s = new DOMElement({
            tagName: "span", 
            classes: "flex items-center", 
            parentElement: p.getNode()
        }) 
        i = new DOMElement({
            tagName: "i", 
            classes: `fa fa-${citizen_gender_class} text-${citizen_gender_color}-400`, 
            parentElement: s.getNode()
        }) 
        s = new DOMElement({
            tagName: "span",
            classes: `ms-1 font-bold text-${citizen_gender_color}-400`,
            parentElement: s.getNode(),
            text: this.citizen.name.split(",")[0]
        })
        let spanish_conjunction_mutation_needed = ["i", "í", "y"].includes(this.related_citizen.name.split(",")[0].charAt(0).toLowerCase()) ? 1 : 0
        let s1 = new DOMElement({
            tagName: "span", 
            classes: "ms-2 text-gray-300", 
            parentElement: s.getNode(),
            text: translate(language, "and", "", "", "", spanish_conjunction_mutation_needed)
        })
        i = new DOMElement({
            tagName: "i", 
            classes: `ms-2 fa fa-${couple_gender_class} text-${couple_gender_color}-400`,
            parentElement: s.getNode()
        }) 
        s1 = new DOMElement({
            tagName: "span", 
            classes: `ms-1 font-bold text-${couple_gender_color}-400`, 
            parentElement: s.getNode(),
            text: this.related_citizen.name.split(",")[0]
        })
        i = new DOMElement({
            tagName: "i",
            classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
            parentElement: p.getNode(),
        })
        //Build new relationship accordion body
        d1 = new DOMElement({
            tagName: "div", 
            classes: "hidden w-100 text-xs text-gray-200 border border-gray-800 bg-gray-600", 
            attributes: [{"key":"aria-labelledby","value":`accordion-relationship-${this.id}-title`}], 
            parentElement: d0.getNode(), 
            id: `accordion-relationship-${this.id}-body`
        })
        ga = new GenerativeAccordion({title_id: `accordion-relationship-${this.id}-title`, callback: this.draw_couple_relationship_content, parms: d1 })
    }
    undraw = () => {
        let relationship_div = document.querySelector(`#accordion-relationship-${this.id}-title`).parentElement
        relationship_div.remove()
        if(!colony.couples.size){
            //Add "empty" text.
            let parent_div = document.getElementById("couple-relationships")
            //Relationships area
            p = new DOMElement({
                tagName: "p", 
                classes: "empty ms-1 mt-1 mb-2 text-xs flex w-100 justify-between gap-2 px-1 text-white",
                parentElement: parent_div
            })
            s = new DOMElement({
                tagName: "span", 
                parentElement: p.getNode()
            })
            i = new DOMElement({
                tagName: "i", 
                classes: "fa fa-light fa-empty-set me-1",
                parentElement: s.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                attributes: [{"key":"data-i18n", "value":""}, {"key":"gender", "value":"f"}], 
                parentElement: s.getNode(),
                text: translate(language, "Not defined (Make couples in Citizen's panel)")
            })
        }
    }
    //Remove couple relationship and remove every couple on each member of the relationship.
    cancel_relationship_event = (e) => {
        //Remove relationship if it exists.
        document.getElementById("couple-relationships").querySelectorAll(`[data-citizen="${this.citizen.id}"], [data-couple="${this.citizen.id}"]`).forEach((elem) => {
            //Finish relationship from relationships panel.
            colony.remove_couple(this.id)
            //Also remove couple from citizens panel and viceversa.
            colony.get_citizen_by_id(this.citizen.id).couple = null
            colony.get_citizen_by_id(this.related_citizen.id).couple = null
        })
    }
    //Show all content information for current breeding attempt
    try_breeding_content = (container) => {
        var breeding_stages_data = []
        var breeding_status = []
        var process_errors = []
        const process_stage_data = (stage) => {
            let data = {
                attraction_percent: 0,
                accumulative_percent: {
                    citizen: stage > 1 ? breeding_stages_data[stage-2].accumulative_percent.citizen : 0,
                    related_citizen: stage > 1 ? breeding_stages_data[stage-2].accumulative_percent.related_citizen : 0
                },
                breeding_stage: attraction_stages[stage-1], 
                mutual_feeling: false
            }
            let age_group_difference, receptor, emmiter, wished_attributes, own_attributes, own_classes, wished_classes, shared_classes
            let attributes_intersection, attributes_intersection_array, attributes_intersection_array_span
            let attributes_listed, attributes_intersection_as_adjectives_array, attributes_intersection_as_adjectives_array_span
            let adjectives_listed, first_attribute_in_common, spanish_conjunction_mutation_needed
            let receptor_and_emmiter_age_group_difference, citizen_and_related_citizen_age_difference
            let protection_attribute = attributes[language][2].attributes[3] //Class Personality, attribute Protection in current language 
            let partnership_attribute = attributes[language][2].attributes[4] //Class Personality, attribute Partnership in current language 
            let charism_attribute = attributes[language][2].attributes[1] //Class Personality, attribute Charism in current language 
            let charm_attribute = attributes[language][2].attributes[2] //CLass Personality, attribute Charm in current language
            switch(stage){
                case 1:
                    //Evaluate interest of citizen.
                    wished_attributes = new Set(this.citizen.wishedAttributes)
                    own_attributes = new Set(this.related_citizen.attributes)
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this.citizen.name};is very interested in;emmiter:${this.related_citizen.name}`
                    break
                case 2:
                    //Evaluate interest of related citizen.
                    wished_attributes = new Set(this.related_citizen.wishedAttributes)
                    own_attributes = new Set(this.citizen.attributes)
                    data.receptor = "related_citizen"
                    data.emmiter = "citizen"
                    data.text = `emmiter:${this.related_citizen.name};is very interested in;receptor:${this.citizen.name}`
                    break
                case 3:
                    //Evaluate big love of citizen.
                    wished_attributes = new Set(this.citizen.wishedAttributes)
                    own_attributes = new Set(this.related_citizen.attributes)
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this.citizen.name};is in love with;emmiter:${this.related_citizen.name}`
                    break
                case 4:
                    //Evaluate big love of related citizen.
                    wished_attributes = new Set(this.related_citizen.wishedAttributes)
                    own_attributes = new Set(this.citizen.attributes)
                    data.receptor = "related_citizen"
                    data.emmiter = "citizen"
                    data.text = `emmiter:${this.related_citizen.name};is in love with;receptor:${this.citizen.name}`
                    break
                case 5:
                    //Evaluate passion of citizen.
                    wished_attributes = new Set(this.citizen.wishedAttributes)
                    own_attributes = new Set(this.related_citizen.attributes)
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this.citizen.name};is passionate about;emmiter:${this.related_citizen.name}`
                    break
                case 6:
                    //Evaluate passion of related citizen.
                    wished_attributes = new Set(this.related_citizen.wishedAttributes)
                    own_attributes = new Set(this.citizen.attributes)
                    data.receptor = "related_citizen"
                    data.emmiter = "citizen"
                    data.text = `emmiter:${this.citizen.name};is in love with;receptor:${this.related_citizen.name}`
                    break
                case 7:
                    //Evaluate compatibility of citizen
                    wished_attributes = new Set(this.citizen.wishedAttributes)
                    own_attributes = new Set(this.related_citizen.attributes)
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this.citizen.name};feels compatible with;emmiter:${this.related_citizen.name}`
                    break
                case 8:
                    //Evaluate compatibility of related citizen
                    wished_attributes = new Set(this.related_citizen.wishedAttributes)
                    own_attributes = new Set(this.citizen.attributes)
                    data.receptor = "related_citizen"
                    data.emmiter = "citizen"
                    data.text = `emmiter:${this.citizen.name};feels compatible with;receptor:${this.related_citizen.name}`
                    break
                case 9:
                    //Evaluate if citizen feels too young.
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this[data.receptor].name};feels in a generation lower than;emmiter:${this[data.emmiter].name}`
                    break
                case 10:
                    //Evaluate if related citizen feels too young.
                    data.receptor = "related_citizen"
                    data.emmiter = "citizen"
                    data.text = `receptor:${this[data.receptor].name};feels in a generation lower than;emmiter:${this[data.emmiter].name}`
                    break
                case 11:
                    //Evaluate if citizen feels too old.
                    data.citizen_age_group = this.citizen.age_index() - 1
                    data.related_citizen_age_group = this.related_citizen.age_index() - 1
                    age_group_difference = data.citizen_age_group - data.related_citizen_age_group
                    let citizen_feels_too_old_for_related_citizen = age_group_difference > 0
                    data.stage_result = citizen_feels_too_old_for_related_citizen ? 1 : 0
                    data.attraction_percent = age_group_difference >= 0 ? Number(data.breeding_stage.percent[age_group_difference]) : 0
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this[data.receptor].name};feels in a generation greater than;emmiter:${this[data.emmiter].name}`
                    break
                case 12:
                    //Evaluate if related citizen feels too old.
                    data.citizen_age_group = this.citizen.age_index() - 1
                    data.related_citizen_age_group = this.related_citizen.age_index() - 1
                    age_group_difference = data.related_citizen_age_group - data.citizen_age_group
                    let related_citizen_feels_too_old_for_citizen = age_group_difference > 0
                    data.stage_result = related_citizen_feels_too_old_for_citizen ? 1 : 0
                    data.attraction_percent = age_group_difference >= 0 ? Number(data.breeding_stage.percent[Math.max(40, age_group_difference)]) : 0
                    data.receptor = "related_citizen"
                    data.emmiter = "citizen"
                    data.text = `receptor:${this[data.receptor].name};feels in a generation greater than;emmiter:${this[data.emmiter].name}`
                    break
                case 13:
                    //Evaluate how they both feel the age difference with the other.
                    //Negative difference => citizen is younger than related citizen
                    //Positive difference => citizen is older than related citizen
                    citizen_and_related_citizen_age_difference = this.citizen.ageYears - this.related_citizen.ageYears
                    data.attraction_percent = Citizen.age_difference_attraction(Math.min(39, Math.abs(citizen_and_related_citizen_age_difference)))
                    data.attraction_percent_elder = Math.floor(data.attraction_percent * 0.5)
                    data.stage_result = data.attraction_percent < 0 ? 2 : 0
                    data.younger = (citizen_and_related_citizen_age_difference < 0 ? this.citizen.name : this.related_citizen.name)
                    //Receptor is always the eldest of both, emmiter the youngest.
                    data.receptor = citizen_and_related_citizen_age_difference < 0 ? "related_citizen" : "citizen"
                    data.emmiter = citizen_and_related_citizen_age_difference < 0 ? "citizen" : "related_citizen"
                    data.mutual_feeling = true
                    data.text = `receptor:${this[data.receptor].name};and;emmiter:${this[data.emmiter].name};feel their age difference`
                    break
                case 14:
                    //Evaluate if citizen feels admiration for related citizen.
                    let citizen_feels_admiration_for_related_citizen = true
                    data.related_citizen_own_attributes = new Set(this.related_citizen.attributes)
                    //Iterate all attribute's classes and check if related citizen has at least one attribute from each class. 
                    attributes[language].forEach((attribute_class) => {
                        let class_attributes = new Set(attribute_class.attributes)
                        citizen_feels_admiration_for_related_citizen &&= data.related_citizen_own_attributes.intersection(class_attributes).size > 0
                    })
                    data.stage_result = citizen_feels_admiration_for_related_citizen ? 1 : 0
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this[data.receptor].name};feels that;emmiter:${this[data.emmiter].name};is a complete person`
                    break
                case 15:
                    //Evaluate if citizen feels admiration for related citizen.
                    let related_citizen_feels_admiration_for_citizen = true
                    data.citizen_own_attributes = new Set(this.citizen.attributes)
                    //Iterate all attribute's classes and check if related citizen has at least one attribute from each class. 
                    attributes[language].forEach((attribute_class) => {
                        let class_attributes = new Set(attribute_class.attributes)
                        related_citizen_feels_admiration_for_citizen &&= data.citizen_own_attributes.intersection(class_attributes).size > 0
                    })
                    data.stage_result = related_citizen_feels_admiration_for_citizen ? 1 : 0
                    data.receptor = "related_citizen"
                    data.emmiter = "citizen"
                    data.text = `receptor:${this[data.receptor].name};feels that;emmiter:${this[data.emmiter].name};is a complete person`
                    break
                case 16:
                    //Evaluate if citizen feels physical attraction for related citizen.
                    let related_citizen_physical_attributes = 0
                    //Iterate all related citizen's attributes and check if they are mostly of class Physical. 
                    this.related_citizen.attributes.forEach((attribute) => {
                        related_citizen_physical_attributes += attributes[language][0].attributes.includes(attribute) ? 1 : 0
                    })
                    data.stage_physical_attributes = related_citizen_physical_attributes
                    data.stage_result = related_citizen_physical_attributes > 1 ? 1 : 0
                    data.attraction_percent = related_citizen_physical_attributes > 1 ? Number(data.breeding_stage.percent[related_citizen_physical_attributes]) : 0
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this[data.receptor].name};feels physically ${related_citizen_physical_attributes > 2 ? "very ":""}attracted to;emmiter:${this[data.emmiter].name}`
                    break
                case 17:
                    //Evaluate if related citizen feels physical attraction for citizen.
                    let citizen_physical_attributes = 0
                    //Iterate all citizen's attributes and check if they are mostly of class Physical. 
                    this.citizen.attributes.forEach((attribute) => {
                        citizen_physical_attributes += attributes[language][0].attributes.includes(attribute) ? 1 : 0
                    })
                    data.stage_physical_attributes = citizen_physical_attributes
                    data.stage_result = citizen_physical_attributes > 1 ? 1 : 0
                    data.attraction_percent = citizen_physical_attributes > 1 ? Number(data.breeding_stage.percent[citizen_physical_attributes]) : 0
                    data.receptor = "related_citizen"
                    data.emmiter = "citizen"
                    data.text = `receptor:${this[data.receptor].name};feels physically ${citizen_physical_attributes > 2 ? "very ":""}attracted to;emmiter:${this[data.emmiter].name}`
                    break
                case 18:
                    //Evaluate if citizen feels mental attraction for related citizen.
                    let related_citizen_mental_attributes = 0
                    //Iterate all related citizen's attributes and check if they are mostly of class Mental. 
                    this.related_citizen.attributes.forEach((attribute) => {
                        related_citizen_mental_attributes += attributes[language][1].attributes.includes(attribute) ? 1 : 0
                    })
                    data.stage_mental_attributes = related_citizen_mental_attributes
                    data.stage_result = related_citizen_mental_attributes > 1 ? 1 : 0
                    data.attraction_percent = related_citizen_mental_attributes > 1 ? Number(data.breeding_stage.percent[related_citizen_mental_attributes]) : 0
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this[data.receptor].name};feels intellectually ${related_citizen_mental_attributes > 2 ? "very ":""}attracted to;emmiter:${this[data.emmiter].name}`
                    break
                case 19:
                    //Evaluate if related citizen feels mental attraction for citizen.
                    let citizen_mental_attributes = 0
                    //Iterate all citizen's attributes and check if they are mostly of class Mental. 
                    this.citizen.attributes.forEach((attribute) => {
                        citizen_mental_attributes += attributes[language][1].attributes.includes(attribute) ? 1 : 0
                    })
                    data.stage_mental_attributes = citizen_mental_attributes
                    data.stage_result = citizen_mental_attributes > 1 ? 1 : 0
                    data.attraction_percent = citizen_mental_attributes > 1 ? Number(data.breeding_stage.percent[citizen_mental_attributes]) : 0
                    data.receptor = "related_citizen"
                    data.emmiter = "citizen"
                    data.text = `receptor:${this[data.receptor].name};feels intellectually ${citizen_mental_attributes > 2 ? "very ":""}attracted to;emmiter:${this[data.emmiter].name}`
                    break
                case 20:
                    //Evaluate if citizen have at least 1 own attribute in common with related citizen.
                    let own_attributes_in_common = (new Set(this.citizen.attributes)).intersection(new Set(this.related_citizen.attributes))
                    data.stage_result = own_attributes_in_common.size ? 1 : 0
                    data.attraction_percent = data.stage_result > 0 ? Number(data.breeding_stage.percent[own_attributes_in_common.size]) : 0
                    let own_attributes_in_common_array = [...own_attributes_in_common].map(element => element.toLowerCase())
                    let last_attribute_in_array = own_attributes_in_common.size ? own_attributes_in_common_array[own_attributes_in_common_array.length-1] : own_attributes_in_common_array[0]
                    spanish_conjunction_mutation_needed = language == "ES" && own_attributes_in_common.size && ["y", "i", "í"].includes(last_attribute_in_array.charAt(0).toLowerCase()) ? 1 : 0
                    if(own_attributes_in_common.size){
                        data.common_attributes = own_attributes_in_common.size > 1 ? "<span class='font-bold'>"+own_attributes_in_common_array.slice(0, -1).join("</span>,<span class='font-bold'>") + "</span> "
                                                + translate(language, "and", "", "", "", spanish_conjunction_mutation_needed) + " " 
                                                + "<span class='font-bold'>" + last_attribute_in_array + "</span>": "<span class='font-bold'>" + last_attribute_in_array.toLowerCase() + "</span>" 
                    }
                    data.mutual_feeling = true
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this[data.receptor].name};and;emmiter:${this[data.emmiter].name};feel that both have things in common`
                    break
                case 21:
                    //Evaluate if citizen feels protected by related citizen.
                    let related_citizen_protector = this.related_citizen.attributes.includes(protection_attribute)
                    data.stage_result = related_citizen_protector ? 1 : 0 //TODO: Check if Protection is a hated citizen's attribute and don't consider attraction.
                    data.attraction_percent = data.stage_result > 0 ? Number(data.breeding_stage.percent) : 0
                    data.protection_adjective = attributes_adjectives[language][protection_attribute][this.related_citizen.gender.charAt(0)]
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this[data.receptor].name};feels protected by;emmiter:${this[data.emmiter].name}`
                    break
                case 22:
                    //Evaluate if related citizen feels protected by citizen.
                    let citizen_protector = this.citizen.attributes.includes(protection_attribute)
                    data.stage_result = citizen_protector ? 1 : 0 //TODO: Check if Partnership is a hated related citizen's attribute and don't consider attraction.
                    data.attraction_percent = data.stage_result > 0 ? Number(data.breeding_stage.percent) : 0
                    data.protection_adjective = attributes_adjectives[language][protection_attribute][this.citizen.gender.charAt(0)]
                    data.receptor = "related_citizen"
                    data.emmiter = "citizen"
                    data.text = `receptor:${this[data.receptor].name};feels protected by;emmiter:${this[data.emmiter].name}`
                    break
                case 23:
                    //Evaluate if citizen feels supported by related citizen.
                    let related_citizen_partner = this.related_citizen.attributes.includes(partnership_attribute)
                    data.stage_result = related_citizen_partner ? 1 : 0 //TODO: Check if Partnership is a hated citizen's attribute and don't consider attraction.
                    data.attraction_percent = data.stage_result > 0 ? Number(data.breeding_stage.percent) : 0
                    data.partnership_adjective = attributes_adjectives[language][partnership_attribute][this.related_citizen.gender.charAt(0)]
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this[data.receptor].name};feels supported by;emmiter:${this[data.emmiter].name}`
                    break
                case 24:
                    //Evaluate if related citizen feels supported by citizen.
                    let citizen_partner = this.citizen.attributes.includes(partnership_attribute)
                    data.stage_result = citizen_partner ? 1 : 0 //TODO: Check if Partnership is a hated related citizen's attribute and don't consider attraction.
                    data.attraction_percent = data.stage_result > 0 ? Number(data.breeding_stage.percent) : 0
                    data.partnership_adjective = attributes_adjectives[language][partnership_attribute][this.citizen.gender.charAt(0)]
                    data.receptor = "related_citizen"
                    data.emmiter = "citizen"
                    data.text = `receptor:${this[data.receptor].name};feels supported by;emmiter:${this[data.emmiter].name}`
                    break
                case 25:
                    //Evaluate if citizen feels supported by related citizen.
                    let related_citizen_delighted = this.related_citizen.attributes.includes(charm_attribute)
                    data.stage_result = related_citizen_delighted ? 1 : 0 //TODO: Check if charm is a hated citizen's attribute and don't consider attraction.
                    data.attraction_percent = data.stage_result > 0 ? Number(data.breeding_stage.percent) : 0
                    data.charm_adjective = attributes_adjectives[language][charm_attribute][this.related_citizen.gender.charAt(0)]
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this[data.receptor].name};feels delighted by;emmiter:${this[data.emmiter].name}`
                    break
                case 26:
                    //Evaluate if related citizen feels supported by citizen.
                    let citizen_delighted = this.citizen.attributes.includes(charm_attribute)
                    data.stage_result = citizen_delighted ? 1 : 0 //TODO: Check if charm is a hated related citizen's attribute and don't consider attraction.
                    data.attraction_percent = data.stage_result > 0 ? Number(data.breeding_stage.percent) : 0
                    data.charm_adjective = attributes_adjectives[language][charm_attribute][this.citizen.gender.charAt(0)]
                    data.receptor = "related_citizen"
                    data.emmiter = "citizen"
                    data.text = `receptor:${this[data.receptor].name};feels delighted by;emmiter:${this[data.emmiter].name}`
                    break
                case 27:
                    //Evaluate if citizen has confidence in related citizen.
                    let related_citizen_charismatic = this.related_citizen.attributes.includes(charism_attribute)
                    data.stage_result = related_citizen_charismatic ? 1 : 0 //TODO: Check if charism is a hated citizen's attribute and don't consider attraction.
                    data.attraction_percent = data.stage_result > 0 ? Number(data.breeding_stage.percent) : 0
                    data.charism_adjective = attributes_adjectives[language][charism_attribute][this.related_citizen.gender.charAt(0)]
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this[data.receptor].name};has confidence in;emmiter:${this[data.emmiter].name}`
                    break
                case 28:
                    //Evaluate if related citizen has confidence in citizen.
                    let citizen_charismatic = this.citizen.attributes.includes(charism_attribute)
                    data.stage_result = citizen_charismatic ? 1 : 0 //TODO: Check if charism is a hated citizen's attribute and don't consider attraction.
                    data.attraction_percent = data.stage_result > 0 ? Number(data.breeding_stage.percent) : 0
                    data.charism_adjective = attributes_adjectives[language][charism_attribute][this.citizen.gender.charAt(0)]
                    data.receptor = "related_citizen"
                    data.emmiter = "citizen"
                    data.text = `receptor:${this[data.receptor].name};has confidence in;emmiter:${this[data.emmiter].name}`
                    break
                case 29:
                    //Evaluate if related citizen has an own attribute that citizen hates.
                    let citizen_hates_related_citizen_attribute = this.related_citizen.attributes.includes(this.citizen.hatedAttribute)
                    data.stage_result = citizen_hates_related_citizen_attribute ? 1 : 0
                    data.attraction_percent = data.stage_result > 0 ? Number(data.breeding_stage.percent) : 0
                    data.receptor = "citizen"
                    data.emmiter = "related_citizen"
                    data.text = `receptor:${this[data.receptor].name};dislikes something of;emmiter:${this[data.emmiter].name}`
                    break
                case 30:
                    //Evaluate if citizen has an own attribute that related citizen hates.
                    let related_citizen_hates_citizen_attribute = this.citizen.attributes.includes(this.related_citizen.hatedAttribute)
                    data.stage_result = related_citizen_hates_citizen_attribute ? 1 : 0
                    data.attraction_percent = data.stage_result > 0 ? Number(data.breeding_stage.percent) : 0
                    data.receptor = "related_citizen"
                    data.emmiter = "citizen"
                    data.text = `receptor:${this[data.receptor].name};dislikes something of;emmiter:${this[data.emmiter].name}`
                    break
            }
            receptor = this[data.receptor]
            emmiter = this[data.emmiter]
            let attraction_percent_multiplier = 1
            switch(stage){
                case 1: case 2:
                    attributes_intersection = wished_attributes.intersection(own_attributes)
                    first_attribute_in_common = [...attributes_intersection][0]
                    let much_interested = attributes_intersection.size
                    data.stage_result = much_interested ? 1 : 0 //1 = Fulfilled, 0 = Not fulfilled
                    if(data.stage_result == 1){
                        spanish_conjunction_mutation_needed = language == "ES" && ["y", "i", "í"].includes(emmiter.name.charAt(0).toLowerCase()) ? 1 : 0
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "wishes someone with") + "</span>"
                                            + " <span data-i18n class='font-bold'>" + translate(language, first_attribute_in_common, "", "lowercase") + "</span>"
                                            + ", <span data-i18n>" + translate(language, "and", "", "", "", spanish_conjunction_mutation_needed) + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>" 
                                            + " <span data-i18n>" + translate(language, "is") + "</span>"
                                            + " <span class='font-bold'>" + attributes_adjectives[language][translate(language, first_attribute_in_common)][emmiter.gender.charAt(0)] + "</span>."
                        data.attraction_percent = Number(data.breeding_stage.percent)
                        data.accumulative_percent[data.receptor] += data.attraction_percent
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "wishes attributes") + "</span>"
                                            + " <span data-i18n>" + translate(language, "that") + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "doesn't have") + "</span>."
                    }
                    break
                case 3: case 4:
                    attributes_intersection = wished_attributes.intersection(own_attributes)
                    attributes_intersection_array = [...attributes_intersection]
                    attributes_intersection_array_span = attributes_intersection_array.map(attribute => "<span class='font-bold'>"+attribute.toLowerCase()+"</span>")
                    let in_love = attributes_intersection.size > 1
                    data.stage_result = in_love ? 1 : 0 //1 = Fulfilled, 0 = Not fulfilled
                    if(data.stage_result == 1){
                        spanish_conjunction_mutation_needed = language == "ES" && ["y", "i", "í"].includes(attributes_intersection_array[attributes_intersection_array.length-1].charAt(0).toLowerCase())
                        attributes_listed = attributes_intersection_array_span.slice(0, -1).join(", ") + " " + translate(language, "and", "", "", "", spanish_conjunction_mutation_needed ? 1 : 0) + " " + attributes_intersection_array_span[attributes_intersection_array.length-1]
                        attributes_intersection_as_adjectives_array = attributes_intersection_array.map(attribute => attributes_adjectives[language][translate(language, attribute)][emmiter.gender.charAt(0)].toLowerCase())
                        attributes_intersection_as_adjectives_array_span = attributes_intersection_as_adjectives_array.map(adjective => "<strong>"+adjective+"</strong>")
                        spanish_conjunction_mutation_needed = language == "ES" && ["y", "i", "í"].includes(attributes_intersection_as_adjectives_array[attributes_intersection_as_adjectives_array.length-1].charAt(0).toLowerCase())
                        adjectives_listed = attributes_intersection_as_adjectives_array_span.slice(0, -1).join(", ") + " " + translate(language, "and", "", "", "", spanish_conjunction_mutation_needed ? 1 : 0) + " " + attributes_intersection_as_adjectives_array_span[attributes_intersection_as_adjectives_array_span.length-1]
                        spanish_conjunction_mutation_needed = language == "ES" && ["y", "i", "í"].includes(emmiter.name.charAt(0).toLowerCase()) ? 1 : 0
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "wishes attributes", "", "", true, 1) + "</span>: " + attributes_listed
                                            + ", <span data-i18n>" + translate(language, "and", "", "", "", spanish_conjunction_mutation_needed) + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>" 
                                            + " <span data-i18n>" + translate(language, "is") + "</span> " + adjectives_listed
                        data.attraction_percent = Number(data.breeding_stage.percent)
                        data.accumulative_percent[data.receptor] += data.attraction_percent
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "doesn't have") + "</span>"
                                            + " <span data-i18n>" + translate(language, "2 attributes wished by") + "</span>"
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>."
                    }
                    break
                case 5: case 6:
                    attributes_intersection = wished_attributes.intersection(own_attributes)
                    attributes_intersection_array = [...attributes_intersection]
                    attributes_intersection_array_span = attributes_intersection_array.map(attribute => "<strong>"+attribute.toLowerCase()+"</strong>")
                    let passionate_about = attributes_intersection.size > 2
                    data.stage_result = passionate_about ? 1 : 0 //1 = Fulfilled, 0 = Not fulfilled
                    if(data.stage_result == 1){
                        spanish_conjunction_mutation_needed = language == "ES" && ["y", "i", "í"].includes(attributes_intersection_array[attributes_intersection_array.length-1].charAt(0).toLowerCase())
                        attributes_listed = attributes_intersection_array_span.slice(0, -1).join(", ") + " " + translate(language, "and", "", "", "", spanish_conjunction_mutation_needed ? 1 : 0) + " " + attributes_intersection_array_span[attributes_intersection_array.length-1]
                        attributes_intersection_as_adjectives_array = attributes_intersection_array.map(attribute => attributes_adjectives[language][translate(language, attribute)][emmiter.gender.charAt(0)].toLowerCase())
                        attributes_intersection_as_adjectives_array_span = attributes_intersection_as_adjectives_array.map(adjective => "<strong>"+adjective+"</strong>")
                        spanish_conjunction_mutation_needed = language == "ES" && ["y", "i", "í"].includes(attributes_intersection_as_adjectives_array[attributes_intersection_as_adjectives_array.length-1].charAt(0).toLowerCase())
                        adjectives_listed = attributes_intersection_as_adjectives_array_span.slice(0, -1).join(", ") + " " + translate(language, "and", "", "", "", spanish_conjunction_mutation_needed ? 1 : 0) + " " + attributes_intersection_as_adjectives_array_span[attributes_intersection_as_adjectives_array_span.length-1]
                        spanish_conjunction_mutation_needed = language == "ES" && ["y", "i", "í"].includes(emmiter.name.split(",")[0].charAt(0).toLowerCase()) ? 1 : 0
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "wishes attributes", "", "", true, 1) + "</span>: " + attributes_listed
                                            + ", <span data-i18n>" + translate(language, "and", "", "", "", spanish_conjunction_mutation_needed) + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>" 
                                            + " <span data-i18n>" + translate(language, "is") + "</span> " + adjectives_listed
                        data.attraction_percent = Number(data.breeding_stage.percent)
                        data.accumulative_percent[data.receptor] += data.attraction_percent
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "doesn't have") + "</span>"
                                            + " <span data-i18n>" + translate(language, "3 attributes wished by") + "</span>"
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>."
                    }
                    break
                case 7: case 8:
                    let citizen_feels_compatible_with_related_citizen = false
                    own_classes = new Set(), wished_classes = new Set(), shared_classes = new Set()
                    //Iterate over attribute classes
                    attributes[language].forEach((attribute_class) => {
                        let class_attributes = new Set(attribute_class.attributes)
                        if(own_attributes.intersection(class_attributes).size){
                            own_classes.add(attribute_class.name)    
                        }
                        if(wished_attributes.intersection(class_attributes).size){
                            wished_classes.add(attribute_class.name)
                        }
                    })
                    //Check if all classes shared are the same as wished by citizen and owned by related citizen
                    shared_classes = own_classes.intersection(wished_classes)
                    if(own_classes.isSubsetOf(wished_classes) && wished_classes.isSubsetOf(own_classes)){
                        citizen_feels_compatible_with_related_citizen = true
                    }
                    data.stage_result = citizen_feels_compatible_with_related_citizen  ? 1 : 0 //1 = Fulfilled, 0 = Not fulfilled
                    //Build explanation text.
                    if(data.stage_result == 1){
                        let shared_classes_array = [...shared_classes]
                        let shared_classes_array_strong = shared_classes_array.map(attribute_class => "<strong>"+attribute_class+"</strong>")
                        attraction_percent_multiplier = shared_classes_array.length
                        let classes_listed = shared_classes_array.length > 1 ? shared_classes_array_strong.slice(0, -1).join(", ") + " " + translate(language, "and") + " " + shared_classes_array_strong[shared_classes_array.length-1] : shared_classes_array_strong[0]
                        spanish_conjunction_mutation_needed = language == "ES" && ["y", "i", "í"].includes(emmiter.name.charAt(0).toLowerCase()) ? 1 : 0
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "wishes attribute classes") + "</span>: " + translate(language, classes_listed, "", "lowercase")
                                            + ", <span data-i18n>" + translate(language, "and", "", "", "", spanish_conjunction_mutation_needed) + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>" 
                                            + " <span data-i18n>" + translate(language, "has them") + "</span>."
                        data.attraction_percent = Number(data.breeding_stage.percent)
                        data.accumulative_percent[data.receptor] += data.attraction_percent
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "wishes attribute classes that") + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>."
                                            + " <span data-i18n>" + translate(language, "doesn't have") + "</span>."
                    }
                break
                case 9: case 10:
                    data.receptor_age_group = receptor.age_index() - 1
                    let receptor_weeks_lived = receptor.weeksAlive
                    data.emmiter_age_group = emmiter.age_index() - 1
                    receptor_and_emmiter_age_group_difference = data.emmiter_age_group - data.receptor_age_group
                    let receptor_feels_too_young_for_emmiter = receptor_and_emmiter_age_group_difference > 0
                    data.stage_result = receptor_feels_too_young_for_emmiter ? 1 : 0
                    data.attraction_percent = receptor_and_emmiter_age_group_difference >= 0 ? 
                                                Number(data.breeding_stage.percent[receptor_and_emmiter_age_group_difference]) : 0
                    if(data.stage_result == 1){
                        attraction_percent_multiplier = receptor_weeks_lived / (40 * 52)
                        data.attraction_percent = Math.floor(data.attraction_percent * (1 + attraction_percent_multiplier))
                        spanish_conjunction_mutation_needed = language == "ES" && ["y", "i", "í"].includes(emmiter.name.charAt(0).toLowerCase()) ? 1 : 0
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "is") + "</span>"
                                            + " <span classes='font-bold'>" + age_groups_articles[age_groups[receptor.age_index()]][language][receptor.gender.charAt(0)] + "</span>"
                                            + " <span classes='font-bold'>" + age_groups_translated[age_groups[receptor.age_index()]][language][receptor.gender.charAt(0)] + "</span>"
                                            + " <span data-i18n>" + translate(language, "and", "", "", "", spanish_conjunction_mutation_needed) + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>" 
                                            + " <span data-i18n>" + translate(language, "is") + "</span>"
                                            + " <span classes='font-bold'>" + age_groups_articles[age_groups[emmiter.age_index()]][language][emmiter.gender.charAt(0)] + "</span>"
                                            + " <span classes='font-bold'>" + age_groups_translated[age_groups[emmiter.age_index()]][language][emmiter.gender.charAt(0)] + "</span>."
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "is not in a lower generation compared to") + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>."
                    }
                    data.accumulative_percent[data.receptor] += data.attraction_percent
                    break
                case 11: case 12:
                    data.emmiter_age_group = emmiter.age_index() - 1
                    let emmiter_weeks_lived = emmiter.weeksAlive
                    data.receptor_age_group = receptor.age_index() - 1
                    receptor_and_emmiter_age_group_difference = data.receptor_age_group - data.emmiter_age_group
                    let receptor_feels_too_old_for_emmiter = receptor_and_emmiter_age_group_difference > 0
                    data.stage_result = receptor_feels_too_old_for_emmiter ? 1 : 0
                    data.attraction_percent = receptor_and_emmiter_age_group_difference >= 0 ? 
                                                Number(data.breeding_stage.percent[receptor_and_emmiter_age_group_difference]) : 0
                    if(data.stage_result == 1){
                        attraction_percent_multiplier = emmiter_weeks_lived / (40 * 52)
                        data.attraction_percent = Math.floor(data.attraction_percent * (1 + attraction_percent_multiplier))
                        spanish_conjunction_mutation_needed = language == "ES" && ["y", "i", "í"].includes(emmiter.name.charAt(0).toLowerCase()) ? 1 : 0
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "is") + "</span>"
                                            + " <span classes='font-bold'>" + age_groups_articles[age_groups[receptor.age_index()]][language][receptor.gender.charAt(0)] + "</span>"
                                            + " <span classes='font-bold'>" + age_groups_translated[age_groups[receptor.age_index()]][language][receptor.gender.charAt(0)] + "</span>"
                                            + " <span data-i18n>" + translate(language, "and", "", "", "", spanish_conjunction_mutation_needed) + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>" 
                                            + " <span data-i18n>" + translate(language, "is") + "</span>"
                                            + " <span classes='font-bold'>" + age_groups_articles[age_groups[emmiter.age_index()]][language][emmiter.gender.charAt(0)] + "</span>"
                                            + " <span classes='font-bold'>" + age_groups_translated[age_groups[emmiter.age_index()]][language][emmiter.gender.charAt(0)] + "</span>."
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "is not in a greater generation compared to") + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>."
                    }
                    data.accumulative_percent[data.receptor] += data.attraction_percent
                    break
                case 13:
                    data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "is") + "</span>: " 
                                            + " <span class='font-bold'>" + Math.abs(citizen_and_related_citizen_age_difference) + "</span>"
                                            + " (<span>" + (Math.abs(citizen_and_related_citizen_age_difference) < 3 ? "< 3" : "> 2") + "</span>)"
                                            + " <span data-i18n>" + translate(language, "year/s older than") + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>." 
                    data.accumulative_percent[data.receptor] += data.attraction_percent_elder
                    data.accumulative_percent[data.emmiter] += data.attraction_percent
                    break
                case 14: case 15:
                    if(data.stage_result === 1){
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "has own attributes of all 3 classes") + "</span>." 
                        data.attraction_percent = Number(data.breeding_stage.percent)
                        data.accumulative_percent[data.receptor] += data.attraction_percent
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "doesn't have own attributes of all 3 classes") + "</span>." 
                    }
                    break
                case 16: case 17:
                    if(data.stage_result === 1){
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "has") + "</span>"
                                            + " <span class='font-bold'>" + data.stage_physical_attributes + "</span>"
                                            + " <span data-i18n>" + translate(language, "physical own attributes") + "</span>."
                        data.accumulative_percent[data.receptor] += data.attraction_percent
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "doesn't have at least 2 physical own attributes") + "</span>." 
                    }
                    
                    break
                case 18: case 19:
                    if(data.stage_result === 1){
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "has") + "</span>"
                                            + " <span class='font-bold'>" + data.stage_mental_attributes + "</span>"
                                            + " <span data-i18n>" + translate(language, "mental own attributes") + "</span>."
                        data.accumulative_percent[data.receptor] += data.attraction_percent
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "doesn't have at least 2 mental own attributes") + "</span>." 
                    }
                    break
                case 20:
                    spanish_conjunction_mutation_needed = language == "ES" && ["y", "i", "í"].includes(emmiter.name.charAt(0).toLowerCase()) ? 1 : 0
                    if(data.stage_result === 1){
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "and", "", "", "", spanish_conjunction_mutation_needed) + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span>" + translate(language, "have") + "</span>"
                                            + " <span>" + data.common_attributes + "</span>"
                                            + " <span data-i18n>" + translate(language, "as common own attributes") + "</span>."
                        data.accumulative_percent[data.receptor] += data.attraction_percent
                        data.accumulative_percent[data.emmiter] += data.attraction_percent
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "and", "", "", "", spanish_conjunction_mutation_needed) + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "don't have own attributes in common") + "</span>." 
                    }
                    break
                case 21: case 22:
                    if(data.stage_result === 1){
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "is") + "</span>"
                                            + " <span class='font-bold'>" + data.protection_adjective + "</span>."
                        data.accumulative_percent[data.receptor] += data.attraction_percent
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "isn't") + "</span>"
                                            + " <span class='font-bold'>" + data.protection_adjective + "</span>."
                    }
                    break
                case 23: case 24:
                    if(data.stage_result === 1){
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "is") + "</span>"
                                            + " <span class='font-bold'>" + data.partnership_adjective + "</span>."
                        data.accumulative_percent[data.receptor] += data.attraction_percent
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "isn't") + "</span>"
                                            + " <span class='font-bold'>" + data.partnership_adjective + "</span>."
                    }
                    break
                case 25: case 26:
                    if(data.stage_result === 1){
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "is") + "</span>"
                                            + " <span class='font-bold'>" + data.charm_adjective + "</span>."
                        data.accumulative_percent[data.receptor] += data.attraction_percent
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "isn't") + "</span>"
                                            + " <span class='font-bold'>" + data.charm_adjective + "</span>."
                    }
                    break
                case 27: case 28:
                    if(data.stage_result === 1){
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "is") + "</span>"
                                            + " <span class='font-bold'>" + data.charism_adjective + "</span>."
                        data.accumulative_percent[data.receptor] += data.attraction_percent
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "isn't") + "</span>"
                                            + " <span class='font-bold'>" + data.charism_adjective + "</span>."
                    }
                    break
                case 29: case 30:
                    spanish_conjunction_mutation_needed = language == "ES" && ["y", "i", "í"].includes(emmiter.name.charAt(0).toLowerCase()) ? 1 : 0
                    if(data.stage_result === 1){
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "dislikes attribute") + "</span>"
                                            + " <span data-i18n class='font-bold'>" + this[data.receptor].hatedAttribute.toLowerCase() + "</span>"
                                            + " <span data-i18n>" + translate(language, "and", "", "", "", spanish_conjunction_mutation_needed) + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "has it") + "</span>."
                        data.accumulative_percent[data.receptor] += data.attraction_percent
                    } else {
                        data.HTMLReason = "<span data-i18n>" + translate(language, "Because") + "</span>:" 
                                            + " <span class='font-bold'>" + receptor.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "dislikes attribute") + "</span>"
                                            + " <span data-i18n class='font-bold'>" + this[data.receptor].hatedAttribute.toLowerCase() + "</span>"
                                            + " <span data-i18n>" + translate(language, "but") + "</span>"
                                            + " <span class='font-bold'>" + emmiter.name.split(",")[0] + "</span>"
                                            + " <span data-i18n>" + translate(language, "doesn't have it") + "</span>."
                    }
                    break
            }
            return data
        }
        const process_all_stages_data = () => {
            for(i=1; i<=30; i++){
                breeding_stages_data.push(process_stage_data(i))
            }
            breeding_data = breeding_stages_data
        }
        const breeding_stages_details = (div) => {
            const build_stage = (stage) => {
                //Current stage details such as status, attraction gained, etc.
                const build_stage_content = (d2) => {
                    let stage_receptor = d2.getNode().getAttribute("data-stage-receptor")
                    let stage_emmiter = d2.getNode().getAttribute("data-stage-emmiter")
                    let stage_mutual = JSON.parse(d2.getNode().getAttribute("data-stage-mutual")) //Cast "false" or "true" string to boolean
                    let stage_HTMLReason = d2.getNode().getAttribute("data-stage-htmlreason") != undefined ? d2.getNode().getAttribute("data-stage-htmlreason") : false
                    let stage_attraction_elder = d2.getNode().getAttribute("data-stage-attraction-elder") != undefined ? d2.getNode().getAttribute("data-stage-attraction-elder") : false
                    let stage_text = d2.getNode().getAttribute("data-stage-text")
                    let stage_result = Number(d2.getNode().getAttribute("data-stage-result"))
                    let stage_attraction = Number(d2.getNode().getAttribute("data-stage-attraction"))
                    let stage_accumulative_receptor = Number(d2.getNode().getAttribute("data-stage-accumulative-receptor"))
                    let stage_accumulative_emmiter = Number(d2.getNode().getAttribute("data-stage-accumulative-emmiter"))
                    //Create stage description first line array of text chunks.
                    let stage_text_chunks = stage_text.split(";")
                    //First line of stage description.
                    p = new DOMElement({
                        tagName: "p", 
                        parentElement: d2.getNode()
                    })
                    //Iterate over all text chunks separated by ;
                    for(let j = 0; j < stage_text_chunks.length; j++){
                        let chunk_subject_token = stage_text_chunks[j].includes("receptor:") ? stage_text_chunks[j].split("receptor:")[1] : false
                        if(chunk_subject_token){
                            s = new DOMElement({
                                tagName: "span", 
                                classes: `${j>0 ? "ms-1" : ""} font-bold`, 
                                parentElement: p.getNode(),
                                text: chunk_subject_token.split(",")[0]
                            })
                        } else {
                            let chunk_emmiter_token = stage_text_chunks[j].includes("emmiter:") ? stage_text_chunks[j].split("emmiter:")[1] : false
                            if(chunk_emmiter_token){
                                s = new DOMElement({
                                    tagName: "span", 
                                    classes: `${j>0 ? "ms-1" : ""} font-bold`, 
                                    parentElement: p.getNode(),
                                    text: chunk_emmiter_token.split(",")[0]
                                })
                            } else {
                                if(stage_text_chunks[j].includes("and")){
                                    //Check next chunk to see if value starts with vowel.
                                    let next_token = stage_text_chunks[j+1]
                                    let is_receptor = next_token.includes("receptor:")
                                    let next_token_value = next_token.includes("receptor:") 
                                                            ? next_token.split("receptor:")[1]
                                                            : next_token.includes("emmiter:") 
                                                                ? next_token.split("emmiter:")[1]
                                                                : next_token
                                    let spanish_conjunction_mutation_needed = language == "ES" && ["i", "í", "y"].includes(next_token_value.charAt(0).toLowerCase())
                                    s = new DOMElement({
                                        tagName: "span", 
                                        classes: "ms-1", 
                                        parentElement: p.getNode(),
                                        text: translate(language, "and", "", "", "", spanish_conjunction_mutation_needed ? 1 : 0)
                                    })
                                } else {
                                    s = new DOMElement({
                                        tagName: "span", 
                                        classes: "ms-1",
                                        attributes: [{"key":"data-i18n", "value":""}],
                                        parentElement: p.getNode(),
                                        text: translate(language, stage_text_chunks[j])
                                    })
                                }
                            }
                        }
                    }
                    //Next line of stage description: Status
                    p = new DOMElement({
                        tagName: "p", 
                        classes: "flex justify-between", 
                        parentElement: d2.getNode()
                    })
                    s1 = new DOMElement({
                        tagName: "span", 
                        parentElement: p.getNode()
                    })
                    s = new DOMElement({
                        tagName: "span", 
                        attributes: [{"key":"data-i18n","value":""}], 
                        parentElement: s1.getNode(),
                        text: translate(language, "Status")
                    })
                    s = new DOMElement({
                        tagName: "span", 
                        parentElement: s1.getNode(),
                        text: ":"
                    })
                    let status_message = stage_result >= 1 ? translate(language, "fulfilled", "f", "capitalized") : translate(language, "not fulfilled", "f", "capitalized")
                    let text_not_fulfilled_class = stage_attraction < 0 ? "text-red-400 " : ""
                    i = new DOMElement({
                        tagName: "i",
                        classes: `fa fa-thumbs-${stage_result >= 1 ? "up" : "down"} ${text_not_fulfilled_class}ms-1`,
                        parentElement: s1.getNode()
                    })
                    s = new DOMElement({
                        tagName: "span", 
                        classes: `ms-1 ${text_not_fulfilled_class}font-bold`, 
                        attributes: [{"key":"data-i18n","value":""}], 
                        parentElement: s1.getNode(), 
                        id: `breeding-stage-${stage}-status`,
                        text: status_message
                    })
                    //Next line of stage description:
                    //Reason why the stage was fulfilled or not.
                    if(stage_HTMLReason){
                        //Reason explained.
                        p = new DOMElement({
                            tagName: "p", 
                            classes: "flex justify-between", 
                            parentElement: d2.getNode()
                        })
                        s1 = new DOMElement({
                            tagName: "span", 
                            parentElement: p.getNode()
                        })
                        s = new DOMElement({
                            tagName: "span", 
                            attributes: [{"key":"data-i18n","value":""}], 
                            parentElement: s1.getNode(),
                            html: stage_HTMLReason
                        })
                    }
                    //Next line of stage description:
                    //Attraction gained and accumulative percent.
                    p = new DOMElement({
                        tagName: "p", 
                        classes: "flex items-center", 
                        parentElement: d2.getNode()
                    })
                    if(stage_attraction){
                        //Receptor attraction percent
                        s = new DOMElement({
                            tagName: "span", 
                            parentElement: p.getNode(),
                            text: translate(language, "Attraction gained by")
                        })
                        s = new DOMElement({
                            tagName: "span", 
                            classes: "ms-1 font-bold", 
                            parentElement: p.getNode(),
                            text: stage_receptor.split(",")[0] 
                        })
                        s = new DOMElement({
                            tagName: "span", 
                            parentElement: p.getNode(),
                            text: ":"
                        })
                        let updated_stage_attraction = stage_attraction_elder ? stage_attraction_elder : stage_attraction
                        s = new DOMElement({
                            tagName: "span", 
                            classes: "ms-1 font-bold", 
                            parentElement: p.getNode(),
                            text: (updated_stage_attraction >= 0 ? "+" : "") + updated_stage_attraction.toString() + "%" 
                        })
                        //Receptor accumulative attraction
                        s = new DOMElement({
                            tagName: "span", 
                            classes: "ms-1", 
                            parentElement: p.getNode(),
                            text: "[" 
                        })
                        s = new DOMElement({
                            tagName: "span", 
                            parentElement: p.getNode(),
                            text: translate(language, "accumulates", "", "capitalized")
                        })
                        s = new DOMElement({
                            tagName: "span", 
                            classes: "ms-1 font-bold", 
                            parentElement: p.getNode(),
                            text: Math.max(0, Math.min(100, stage_accumulative_receptor)).toString() + "%" 
                        })
                        s = new DOMElement({
                            tagName: "span", 
                            parentElement: p.getNode(),
                            text: "]"
                        })
                        if(stage_mutual){
                            p = new DOMElement({
                                tagName: "p", 
                                classes: "flex items-center", 
                                parentElement: d2.getNode()
                            })
                            //Emmiter attraction percent
                            s = new DOMElement({
                                tagName: "span", 
                                parentElement: p.getNode(),
                                text: translate(language, "Attraction gained by")
                            })
                            s = new DOMElement({
                                tagName: "span", 
                                classes: "ms-1 font-bold", 
                                parentElement: p.getNode(),
                                text: stage_emmiter.split(",")[0] 
                            })
                            s = new DOMElement({
                                tagName: "span", 
                                parentElement: p.getNode(),
                                text: ":"
                            })
                            s = new DOMElement({
                                tagName: "span", 
                                classes: "ms-1 font-bold", 
                                parentElement: p.getNode(),
                                text: (stage_attraction >= 0 ? "+" : "") + stage_attraction.toString() + "%" 
                            })
                            //Emmiter accumulative attraction
                            s = new DOMElement({
                                tagName: "span", 
                                classes: "ms-1", 
                                parentElement: p.getNode(),
                                text: "[" 
                            })
                            s = new DOMElement({
                                tagName: "span", 
                                parentElement: p.getNode(),
                                text: translate(language, "accumulates", "", "capitalized")
                            })
                            s = new DOMElement({
                                tagName: "span", 
                                classes: "ms-1 font-bold", 
                                parentElement: p.getNode(),
                                text: Math.max(0, Math.min(100, stage_accumulative_emmiter)).toString() + "%" 
                            })
                            s = new DOMElement({
                                tagName: "span", 
                                parentElement: p.getNode(),
                                text: "]"
                            })
                        }
                    } else {
                        //Receptor gained no attraction
                        s = new DOMElement({
                            tagName: "span", 
                            classes: "text-red-400 font-bold", 
                            parentElement: p.getNode(),
                            text: stage_receptor.split(",")[0]
                        })
                        s = new DOMElement({
                            tagName: "span", 
                            classes: "ms-1 text-red-400", 
                            parentElement: p.getNode(),
                            text: translate(language, "gained no attraction in this stage")
                        })
                        if(stage_mutual){
                            //Emmiter gained no attraction
                            p = new DOMElement({
                                tagName: "p", 
                                classes: "flex items-center", 
                                parentElement: d2.getNode()
                            })
                            s = new DOMElement({
                                tagName: "span", 
                                classes: "text-red-400 font-bold", 
                                parentElement: p.getNode(),
                                text: stage_emmiter.split(",")[0]
                            })
                            s = new DOMElement({
                                tagName: "span", 
                                classes: "ms-1 text-red-400", 
                                parentElement: p.getNode(),
                                text: translate(language, "gained no attraction in this stage")
                            })
                        }
                    }
                }
                //Depending on the stage obtain specific data
                let stage_data = breeding_stages_data[stage-1]//process_stage_data(stage)
                let stage_accordion_bg_class, d, d1, d2, p, s, s1
                stage_accordion_bg_class = stage_data.attraction_percent > 0 ? "bg-green-900" : (stage_data.attraction_percent < 0 ? "bg-red-900" : "bg-gray-800")
                d = new DOMElement({
                    tagName: "div", 
                    classes: "m-1 grow", 
                    attributes: [{"key":"data-accordion","value":"collapse"}], 
                    parentElement: div.getNode(), 
                    id: `accordion-relationship-${this.id}-stage-${stage}`
                })
                //header
                d1 = new DOMElement({
                    tagName: "div", //bg-gray-800 
                    classes: `flex items-center justify-between w-full text-xs ${stage_accordion_bg_class} border border-gray-700 gap-3 text-gray-400`, 
                    attributes: [{"key":"data-body","value":`accordion-relationship-${this.id}-stage-${stage}-body`}],
                    parentElement: d.getNode(), 
                    id: `accordion-relationship-${this.id}-stage-${stage}-header`
                })
                p = new DOMElement({
                    tagName: "p", 
                    classes: "clickable flex items-center justify-between w-full p-1 px-2 text-xs text-gray-400 gap-3", 
                    parentElement: d1.getNode()
                })
                s = new DOMElement({
                    tagName: "span", 
                    parentElement: p.getNode()
                })
                s1 = new DOMElement({
                    tagName: "span", 
                    classes: `text-gray-300`, 
                    attributes: [{"key":"data-i18n","value":""}], 
                    parentElement: s.getNode(),
                    text: translate(language, "Stage")
                })
                s1 = new DOMElement({
                    tagName: "span", 
                    classes: `text-gray-300 ms-1`, 
                    parentElement: s.getNode(),
                    text: stage.toString()
                })
                s1 = new DOMElement({
                    tagName: "span", 
                    classes: `text-gray-300`, 
                    parentElement: s.getNode(),
                    text: ":"
                })
                s1 = new DOMElement({
                    tagName: "span", 
                    classes: `text-gray-300 ms-1 font-bold`, 
                    attributes: [{"key":"data-i18n","value":""}], 
                    parentElement: s.getNode(),
                    text: translate(language, stage_data.breeding_stage.description, "", "capitalized")
                })
                if(!stage_data.mutual_feeling){
                    s1 = new DOMElement({
                        tagName: "span", 
                        classes: `text-gray-300 ms-1 font-bold`, 
                        parentElement: s.getNode(),
                        text: this[stage_data.receptor].name.split(",")[0]
                    })
                }
                s1 = new DOMElement({
                    tagName: "span", 
                    classes: "grow flex justify-end", 
                    parentElement: p.getNode()
                })
                s2 = new DOMElement({
                    tagName: "span", 
                    classes: `text-gray-300 ms-1 font-bold`, 
                    parentElement: s1.getNode(),
                    text: (stage_data.attraction_percent >= 0 ? "+" : "") + stage_data.attraction_percent.toString() + "%"
                })
                i = new DOMElement({
                    tagName: "i",
                    classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
                    parentElement: p.getNode(),
                })
                //body
                d2 = new DOMElement({
                    tagName: "div", 
                    classes: `hidden p-1 px-2 mb-1 border border-gray-900 ${stage_accordion_bg_class}`, 
                    attributes: [{"key":"aria-labelledby","value":`accordion-relationship-${this.id}-stage-${stage}-header`}, 
                                 {"key":"data-stage-receptor", "value":this[stage_data.receptor].name}, {"key":"data-stage-emmiter", "value":this[stage_data.emmiter].name},
                                 {"key":"data-stage-mutual", "value":stage_data.mutual_feeling.toString()},
                                 {"key":"data-stage-result", "value":stage_data.stage_result.toString()},
                                 ...(stage_data.HTMLReason ? [{"key":"data-stage-HTMLReason", "value":stage_data.HTMLReason}] : []),
                                 ...(stage_data.attraction_percent_elder ? [{"key":"data-stage-attraction-elder", "value":stage_data.attraction_percent_elder}] : []),
                                 {"key":"data-stage-text", "value":stage_data.text},
                                 {"key":"data-stage-attraction", "value":stage_data.attraction_percent.toString()},
                                 {"key":"data-stage-accumulative-receptor", "value":stage_data.accumulative_percent[stage_data.receptor].toString()},
                                 {"key":"data-stage-accumulative-emmiter", "value":stage_data.accumulative_percent[stage_data.emmiter].toString()},
                                ], 
                    parentElement: d.getNode(), 
                    id: `accordion-relationship-${this.id}-stage-${stage}-body`
                })
                ga = new GenerativeAccordion({title_id: `accordion-relationship-${this.id}-stage-${stage}-header`, callback: build_stage_content, parms: d2 })
            }
            build_stage(1) //Stage 1: Strong interest of citizen
            build_stage(2) //Stage 2: Strong interest of related citizen
            build_stage(3) //Stage 3: Big love of citizen
            build_stage(4) //Stage 4: Big love of related citizen
            build_stage(5) //Stage 5: Passion of citizen
            build_stage(6) //Stage 6: Passion of related citizen
            build_stage(7) //Stage 7: Compatibility of citizen
            build_stage(8) //Stage 8: Compatibility of related citizen
            build_stage(9) //Stage 9: Citizen feels too young
            build_stage(10) //Stage 10: Related citizen feels too young
            build_stage(11) //Stage 11: Citizen feels too old
            build_stage(12) //Stage 12: Related citizen feels too old
            build_stage(13) //Stage 13: Both citizens feel age difference
            build_stage(14) //Stage 14: Citizen feels admiration for related citizen
            build_stage(15) //Stage 15: Related citizen feels admiration for citizen
            build_stage(16) //Stage 16: Citizen feels physically attracted to related citizen
            build_stage(17) //Stage 17: Related citizen feels physically attracted to citizen
            build_stage(18) //Stage 18: Citizen feels intellectually attracted to related citizen
            build_stage(19) //Stage 19: Related citizen feels intellectually attracted to citizen
            build_stage(20) //Stage 20: Both citizen and related have things in common
            build_stage(21) //Stage 21: Citizen feels protected by related citizen
            build_stage(22) //Stage 22: Related citizen feels protected by citizen
            build_stage(23) //Stage 23: Citizen feels supported by related citizen
            build_stage(24) //Stage 24: Related citizen feels supported by citizen
            build_stage(25) //Stage 25: Citizen feels delighted by related citizen
            build_stage(26) //Stage 26: Related citizen feels delighted by citizen
            build_stage(27) //Stage 27: Citizen has confidence in related citizen
            build_stage(28) //Stage 28: Related citizen has confidence in citizen
            build_stage(29) //Stage 29: Citizen dislikes something from related citizen
            build_stage(30) //Stage 30: Related citizen dislikes something from citizen
        }
        const mutual_discovery_accordion_contents = (d1) => {
            let d, p, s, i, ga
            //Relationship final results
            let final_attraction_percent = Math.min(100, Math.max(0, Math.min(breeding_stages_data[breeding_stages_data.length - 1].accumulative_percent.citizen, breeding_stages_data[breeding_stages_data.length - 1].accumulative_percent.related_citizen)))
            let relationship_grade, attraction_bg_class, attraction_text_class = ""
            //Mutual knowledge process status and result
            d = new DOMElement({
                tagName: "div", 
                classes: `m-1 ${attraction_bg_class} p-1 border border-gray-800 bg-gray-600 text-white grow`, 
                attributes: [{"key":"data-accordion","value":"collapse"}], 
                parentElement: d1.getNode(), 
                id: `accordion-relationship-${this.id}-mutual-knowledge-results`
            })
            p = new DOMElement({
                tagName: "p", 
                classes: "px-1 w-full", 
                parentElement: d.getNode()
            })
            s = new DOMElement({
                tagName: "span", 
                parentElement: p.getNode(),
                text: translate(language, "Process result")
            })
            s = new DOMElement({
                tagName: "span", 
                parentElement: p.getNode(),
                text: ": "
            })
            let mutual_knowledge_result_status = final_attraction_percent >= 70 ? "Successfully completed" : "Unsuccessful"
            let mutual_knowledge_results_failure_description = final_attraction_percent < 70 ? translate(language, "They both feel insufficient attraction") : false
            s = new DOMElement({
                tagName: "span",
                classes: "font-bold",
                parentElement: p.getNode(),
                text: translate(language, mutual_knowledge_result_status)
            })

            p = new DOMElement({
                tagName: "p", 
                classes: "px-1 w-full", 
                parentElement: d.getNode()
            })
            s = new DOMElement({
                tagName: "span", 
                classes: "font-bold", 
                parentElement: p.getNode(),
                text: this.citizen.name.split(",")[0]
            })
            let spanish_conjunction_mutation_needed = language == "ES" && ["i", "í", "y"].includes(this.related_citizen.name.split(",")[0].charAt(0).toLowerCase()) ? 1 : 0
            s = new DOMElement({
                tagName: "span", 
                classes: "ms-1", 
                parentElement: p.getNode(),
                text: translate(language, "and", "", "", "", spanish_conjunction_mutation_needed)
            })
            s = new DOMElement({
                tagName: "span", 
                classes: "ms-1 font-bold", 
                parentElement: p.getNode(), 
                text: this.related_citizen.name.split(",")[0]
            })
            s = new DOMElement({
                tagName: "span", 
                classes: "ms-1", 
                parentElement: p.getNode(), 
                id: `accordion-relationship-${this.id}-stages-result-viability`
            })
            if(final_attraction_percent >= 70){
                relationship_grade = final_attraction_percent <= 80 ? "a good" : (final_attraction_percent <= 90 ? "an excellent" : "a wonderful")
                attraction_bg_class = "bg-green-800"
                s.getNode().innerText = translate(language, "have")
            } else {
                attraction_bg_class = "bg-red-800"
                s.getNode().innerText = translate(language, "cannot have")
            }
            d.getNode().classList.add(attraction_bg_class)
            s = new DOMElement({
                tagName: "span", 
                classes: "ms-1 font-bold", 
                parentElement: p.getNode(), 
                id: `accordion-relationship-${this.id}-stages-result-grade`
            })
            if(final_attraction_percent >= 70){
                s.getNode().innerText = translate(language, relationship_grade) + " " + translate(language, "relationship")
            } else {
                s.getNode().innerText = translate(language, "a relationship, unfortunately.")
            }

            if(mutual_knowledge_results_failure_description){
                p = new DOMElement({
                    tagName: "p", 
                    classes: "px-1 w-full", 
                    parentElement: d.getNode()
                })
                s = new DOMElement({
                    tagName: "span", 
                    classes: "font-bold", 
                    parentElement: p.getNode(),
                    text: mutual_knowledge_results_failure_description
                })
            }
            p = new DOMElement({
                tagName: "p", 
                classes: "px-1 w-full", 
                parentElement: d.getNode()
            })
            s = new DOMElement({
                tagName: "span", 
                parentElement: p.getNode(),
                text: translate(language, "Attraction level obtained")
            })
            s = new DOMElement({
                tagName: "span", 
                parentElement: p.getNode(),
                text: ":"
            })
            s = new DOMElement({
                tagName: "span", 
                classes: "ms-1 font-bold", 
                parentElement: p.getNode(), 
                id: `accordion-relationship-${this.id}-stages-result-attraction`,
                text: final_attraction_percent+"%"
            })

            d = new DOMElement({
                tagName: "div", 
                classes: "m-1 grow bg-gray-800", 
                attributes: [{"key":"data-accordion","value":"collapse"}], 
                parentElement: d1.getNode(), 
                id: `accordion-relationship-${this.id}-stages`
            })
            //Stages details header
            d1 = new DOMElement({
                tagName: "div", 
                classes: "bg-gray-800",
                attributes: [{"key":"data-body","value":`accordion-relationship-${this.id}-stages-body`}],
                parentElement: d.getNode(), 
                id: `accordion-relationship-${this.id}-stages-header`
            })
            p = new DOMElement({
                tagName: "p", 
                classes: "clickable flex items-center justify-between w-full py-1 px-2 text-xs text-gray-400 gap-3", 
                parentElement: d1.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: `grow text-gray-300`, 
                attributes: [{"key":"data-i18n","value":""}], 
                parentElement: p.getNode(),
                text: translate(language, "Stages details")
            })
            i = new DOMElement({
                tagName: "i",
                classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
                parentElement: p.getNode(),
            })

            //Stages details body
            d1 = new DOMElement({
                tagName: "div", 
                classes: `hidden mb-1 border border-gray-900 bg-gray-500`, 
                attributes: [{"key":"aria-labelledby","value":`accordion-relationship-${this.id}-stages-header`}], 
                parentElement: d.getNode(), 
                id: `accordion-relationship-${this.id}-stages-body`
            })
            ga = new GenerativeAccordion({title_id: `accordion-relationship-${this.id}-stages-header`, callback: breeding_stages_details, parms: d1 })
        }
        const draw_mutual_discovery_accordion = (d) => {
            let d2 = new DOMElement({
                tagName: "div",
                classes: "border border-gray-800 bg-gray-600",
                parentElement: d.getNode(),
            })
            let d1 = new DOMElement({
                tagName: "div", 
                parentElement: d2.getNode(),
                classes: "bg-gray-800",
                attributes: [{"key":"data-body","value":`accordion-relationship-${this.id}-breeding-stages-body`}],
                id: `accordion-relationship-${this.id}-breeding-stages-header`
            })
            let p = new DOMElement({
                tagName: "p", 
                classes: "clickable flex items-center justify-between w-full py-1 px-2 text-xs text-gray-400 gap-3", 
                attributes: [], 
                parentElement: d1.getNode()
            })
            let s = new DOMElement({
                tagName: "span", 
                classes: "flex items-center w-full", 
                parentElement: p.getNode()
            })
            let s1 = new DOMElement({
                tagName: "span", 
                attributes: [{"key":"data-i18n","value":""}], 
                parentElement: s.getNode(),
                text: translate(language, "Mutual knowledge process")
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: "grow flex justify-end", 
                parentElement: s.getNode()
            })
            let accumulated_attraction = Math.min(100, Math.max(0, Math.min(breeding_stages_data[breeding_stages_data.length - 1].accumulative_percent.citizen, breeding_stages_data[breeding_stages_data.length - 1].accumulative_percent.related_citizen)))
            let bg_class = accumulated_attraction >= 70 ? "bg-green-800" : (accumulated_attraction >= 55 ? "bg-orange-800" : "bg-red-800")
            breeding_status[0] = accumulated_attraction >= 70
            if(!breeding_status[0]){
                process_errors.push(translate(language, "They both feel insufficient attraction"))
            }
            let s2 = new DOMElement({
                tagName: "span", 
                classes: `px-1 border border-gray-300 text-white ${bg_class}`, 
                parentElement: s1.getNode(), 
                id: `relationship-${this.id}-attraction-group`
            })
            let icon_class = accumulated_attraction >= 70 ? "fa-thumbs-up" : "fa-thumbs-down"
            let i = new DOMElement({
                tagName: "i", 
                classes: `fa ${icon_class} me-1 font-bold`, 
                parentElement: s2.getNode(), 
                id: `relationship-${this.id}-attraction-icon`
            })
            let s3 = new DOMElement({
                tagName: "span", 
                classes: "font-bold", 
                parentElement: s2.getNode(), 
                id: `relationship-${this.id}-attraction-value`,
                text: accumulated_attraction+"%"
            })
            i = new DOMElement({
                tagName: "i",
                classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
                parentElement: p.getNode(),
            })

            //Build mutual knowledge process body
            d1 = new DOMElement({
                tagName: "div", 
                classes: "hidden bg-gray-600",
                attributes: [{"key":"aria-labelledby","value":`accordion-relationship-${this.id}-breeding-stages-header`}], 
                parentElement: d2.getNode(), 
                id: `accordion-relationship-${this.id}-breeding-stages-body`
            })
            ga = new GenerativeAccordion({title_id: `accordion-relationship-${this.id}-breeding-stages-header`, callback: mutual_discovery_accordion_contents, parms: d1 })

        }
        const fertility_report_accordion_contents = (d1) => {
            let d, p, s, process_result, process_result_error, process_class
            let fertility_stats = get_fertility_stats()
            let woman = this.citizen.gender.charAt(0) === "F" ? this.citizen : this.related_citizen
            d = new DOMElement({
                tagName: "div", 
                classes: "p-1 border border-gray-800 bg-gray-800 text-white grow", 
                parentElement: d1.getNode(), 
                id: `accordion-relationship-${this.id}-fertility-levels-title`
            })
            p = new DOMElement({
                tagName: "p", 
                classes: "px-1 w-full", 
                parentElement: d.getNode()
            })
            s = new DOMElement({
                tagName: "span", 
                parentElement: p.getNode(),
                text: translate(language, "Citizen's fertility levels")
            })
            d = new DOMElement({
                tagName: "div", 
                classes: "p-1 border border-gray-800 bg-gray-700 text-white grow", 
                parentElement: d1.getNode(), 
                id: `accordion-relationship-${this.id}-fertility-levels`
            })
            p = new DOMElement({
                tagName: "p", 
                classes: "px-1 w-full", 
                parentElement: d.getNode()
            })
            s = new DOMElement({
                tagName: "span", 
                classes: "font-bold", 
                parentElement: p.getNode(),
                text: this.citizen.name
            })
            p = new DOMElement({
                tagName: "p", 
                classes: "px-1 mb-1 w-full",
                parentElement: d.getNode()
            })
            s = new DOMElement({
                tagName: "span", 
                parentElement: p.getNode(),
                text: translate(language, "Fertility level")
            })
            s = new DOMElement({
                tagName: "span", 
                parentElement: p.getNode(),
                text: translate(language, ":") 
            })
            s = new DOMElement({
                tagName: "span", 
                classes: `ms-1 font-bold`, 
                parentElement: p.getNode(),
                id: `citizen-${this.citizen.id}-fertility`,
                text: this.citizen.fertility.value.toString()
            })
            this.citizen.redraw_citizen_fertility()
            p = new DOMElement({
                tagName: "p", 
                classes: "px-1 w-full", 
                parentElement: d.getNode()
            })
            s = new DOMElement({
                tagName: "span", 
                classes: "font-bold", 
                parentElement: p.getNode(),
                text: this.related_citizen.name
            })
            p = new DOMElement({
                tagName: "p", 
                classes: "px-1 w-full",
                parentElement: d.getNode()
            })
            s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode(),
                text: translate(language, "Fertility level")
            })
            s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode(),
                text: translate(language, ":")
            })
            s = new DOMElement({
                tagName: "span", 
                classes: `ms-1 font-bold`,
                parentElement: p.getNode(), 
                id: `citizen-${this.related_citizen.id}-fertility`,
                text: this.related_citizen.fertility.value.toString()
            })
            this.related_citizen.redraw_citizen_fertility()
            if(fertility_stats.both_have_fertility){
                d = new DOMElement({
                    tagName: "div", 
                    classes: "p-1 border border-gray-800 bg-gray-800 text-white grow",
                    parentElement: d1.getNode(), 
                    id: `accordion-relationship-${this.id}-fertility-week-title`
                })
                p = new DOMElement({
                    tagName: "p", 
                    classes: "px-1 w-full",
                    parentElement: d.getNode()
                })
                s = new DOMElement({
                    tagName: "span", 
                    parentElement: p.getNode(),
                    text: translate(language, "Breeding viability")
                })
                d = new DOMElement({
                    tagName: "div", 
                    classes: "mb-1 p-1 border border-gray-800 bg-gray-700 text-white grow",
                    parentElement: d1.getNode(), 
                    id: `accordion-relationship-${this.id}-fertility-week`
                })
                p = new DOMElement({
                    tagName: "p", 
                    classes: "px-1 w-full",
                    parentElement: d.getNode()
                })
                let woman_class
                s = new DOMElement({
                    tagName: "span", 
                    classes: "font-bold",
                    parentElement: p.getNode(),
                    text: woman.name
                })
                p = new DOMElement({
                    tagName: "p", 
                    classes: "px-1 w-full", 
                    parentElement: d.getNode()
                })
                if(woman.status != "pregnant"){
                    woman_class = fertility_stats.woman_fertile ? "text-green-500" : "text-red-500"
                    s = new DOMElement({
                        tagName: "span", 
                        attributes: [{"key":"data-i18n", "value":""}], 
                        parentElement: p.getNode(),
                        text: translate(language, "Fertile week")
                    })
                    s = new DOMElement({
                        tagName: "span", 
                        parentElement: p.getNode(),
                        text: ":"
                    })
                    s = new DOMElement({
                        tagName: "span", 
                        classes: `ms-1 font-bold ${woman_class}`, 
                        parentElement: p.getNode(),
                        id: `citizen-${woman.id}-fertility-week`,
                        text: fertility_stats.woman_fertility_week.toString()
                    })
                } else {
                    s = new DOMElement({
                        tagName: "span", 
                        attributes: [{"key":"data-i18n", "value":""}], 
                        parentElement: p.getNode(), text: translate(language, "Current status")
                    })
                    s = new DOMElement({
                        tagName: "span", 
                        parentElement: p.getNode(),
                        text: ":"
                    })
                    s = new DOMElement({
                        tagName: "span", 
                        classes: `ms-1 font-bold text-red-500`, 
                        attributes: [{"key":"data-i18n", "value":""}], 
                        parentElement: p.getNode(),
                        text: translate(language, "Pregnant")
                    })
                }
                p = new DOMElement({
                    tagName: "p", 
                    classes: "px-1 w-full", 
                    parentElement: d.getNode()
                })
                s = new DOMElement({
                    tagName: "span", 
                    attributes: [{"key":"data-i18n", "value":""}], 
                    parentElement: p.getNode(),
                    text: translate(language, "Month week")
                })
                s = new DOMElement({
                    tagName: "span", 
                    parentElement: p.getNode(), 
                    text: ":"
                })
                s = new DOMElement({
                    tagName: "span",
                    classes: `ms-1 font-bold ${woman_class}`,
                    parentElement: p.getNode(),
                    id: "month-week",
                    text: fertility_stats.current_week.toString()
                })
                if(fertility_stats.current_week != fertility_stats.woman_fertility_week) {
                    if(woman.status != "pregnant"){
                        process_result_error = woman.name + " " + translate(language, "is not fertile this week")
                        let remaining_weeks = fertility_stats.current_week > fertility_stats.woman_fertility_week ? 4 - fertility_stats.current_week + fertility_stats.woman_fertility_week : fertility_stats.woman_fertility_week - fertility_stats.current_week
                        s = new DOMElement({
                            tagName: "span", 
                            classes: "ms-1 ", 
                            parentElement: p.getNode(),
                            text: "("
                        })
                        s = new DOMElement({
                            tagName: "span", 
                            classes: `ms-1`, 
                            attributes: [{"key":"data-i18n", "value":""}], 
                            parentElement: p.getNode(),
                            text: translate(language, "will be fertile in")
                        })
                        s = new DOMElement({
                            tagName: "span", 
                            classes: `ms-1 font-bold`,
                            parentElement: p.getNode(),
                            text: remaining_weeks.toString()
                        })
                        s = new DOMElement({
                            tagName: "span", 
                            classes: "ms-1 font-bold", 
                            attributes: [{"key":"data-i18n", "value":""}], 
                            parentElement: p.getNode(),
                            text: translate(language, "weeks")
                        })
                        s = new DOMElement({
                            tagName: "span", 
                            classes: "ms-1", 
                            parentElement: p.getNode(),
                            text: ")"
                        })
                    } else {
                        process_result_error = woman.name + " " + translate(language, "is already pregnant")
                    }
                }
            } else {
                process_result_error = translate(language, "Someone in the couple is not fertile enough")
            }
            if(woman.status != 'pregnant' && fertility_stats.woman_fertile && fertility_stats.both_have_fertility){
                document.querySelector(`#relationship-${this.id}-fertility-group`).classList.add("bg-green-900")
                document.querySelector(`#relationship-${this.id}-fertility-icon`).classList.add("fa-thumbs-up")
                process_result = "Successfully completed"
                process_class = "bg-green-800"
            } else {
                document.querySelector(`#relationship-${this.id}-fertility-group`).classList.add("bg-red-700")
                document.querySelector(`#relationship-${this.id}-fertility-icon`).classList.add("fa-thumbs-down")
                process_result = "Unsuccessful"
                process_class = "bg-red-900"
            }
            //Fertility report result
            d = new DOMElement({
                tagName: "div", 
                classes: `mt-1 ${process_class} p-1 border border-gray-800 text-white grow`,
                parentElement: d1.getNode(), 
                id: `accordion-relationship-${this.id}-fertility-results`
            })
            p = new DOMElement({
                tagName: "p", 
                classes: "px-1 w-full",
                parentElement: d.getNode()
            })
            s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode(),
                text: translate(language, "Process result")
            })
            s = new DOMElement({
                tagName: "span", 
                parentElement: p.getNode(),
                text: ":"
            })
            s = new DOMElement({
                tagName: "span",
                classes: `ms-1 font-bold`,
                parentElement: p.getNode(),
                text: translate(language, process_result)
            })
            if(process_result_error){
                p = new DOMElement({
                    tagName: "p", 
                    classes: "px-1 w-full",
                    parentElement: d.getNode()
                })
                s = new DOMElement({
                    tagName: "span",
                    classes: "font-bold",
                    parentElement: p.getNode(),
                    text: process_result_error
                })
            }
        }
        const draw_fertility_report_accordion = (d) => {
            let d2 = new DOMElement({
                tagName: "div",
                classes: "mt-1 border border-gray-800 bg-gray-600",
                parentElement: d.getNode(),
            })
            d1 = new DOMElement({
                tagName: "div", 
                parentElement: d2.getNode(),
                classes: "bg-gray-800",
                attributes: [{"key":"data-body","value":`accordion-relationship-${this.id}-fertility-body`}],
                id: `accordion-relationship-${this.id}-fertility-header`
            })
            p = new DOMElement({
                tagName: "p", 
                classes: "clickable flex items-center justify-between w-full py-1 px-2 text-xs text-gray-400 gap-3", 
                attributes: [], 
                parentElement: d1.getNode()
            })
            s = new DOMElement({
                tagName: "span", 
                classes: "flex items-center w-full", 
                parentElement: p.getNode()
            })
            s1 = new DOMElement({
                tagName: "span", 
                attributes: [{"key":"data-i18n","value":""}], 
                parentElement: s.getNode(),
                text: translate(language, "Fertility check process")
            })
            s1 = new DOMElement({
                tagName: "span", 
                classes: "grow flex justify-end", 
                parentElement: s.getNode()
            })
            let fertility_stats = get_fertility_stats()
            breeding_status[1] = fertility_stats.breeding_possible
            if(!breeding_status[1]){
                process_errors.push(fertility_stats.breeding_error)
            }
            let icon_class = fertility_stats.breeding_possible ? "bg-green-900" : "bg-red-700"
            s2 = new DOMElement({
                tagName: "span", 
                classes: `px-1 border border-gray-300 text-white ${icon_class}`, 
                parentElement: s1.getNode(), 
                id: `relationship-${this.id}-fertility-group`
            })
            i = new DOMElement({
                tagName: "i", 
                classes: `fa fa-thumbs-${fertility_stats.breeding_possible ? "up" : "down"} font-bold ${icon_class}`, 
                parentElement: s2.getNode(), 
                id: `relationship-${this.id}-fertility-icon`
            })
            i = new DOMElement({
                tagName: "i",
                classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
                parentElement: p.getNode(),
            })

            //Build fertility process body
            d1 = new DOMElement({
                tagName: "div", 
                classes: "hidden p-1 bg-gray-600",
                attributes: [{"key":"aria-labelledby","value":`accordion-relationship-${this.id}-fertility-header`}], 
                parentElement: d2.getNode(), 
                id: `accordion-relationship-${this.id}-fertility-body`
            })
            ga = new GenerativeAccordion({title_id: `accordion-relationship-${this.id}-fertility-header`, callback: fertility_report_accordion_contents, parms: d1 })
        }
        const get_fertility_stats = () => {
            let results = {}
            results.citizen_has_fertility = this.citizen.fertility.value > 0
            results.couple_has_fertility = this.related_citizen.fertility.value > 0
            results.both_have_fertility = results.citizen_has_fertility && results.couple_has_fertility
            let woman = this.citizen.gender.charAt(0) === "F" ? this.citizen : this.related_citizen
            results.woman_fertility_week = Number(woman.fertility.week)
            results.current_week = colony.time_interval.get_month_week()
            results.woman_fertile = results.woman_fertility_week === results.current_week
            results.breeding_possible = this.citizen.status != 'pregnant' && results.both_have_fertility && results.woman_fertile
            if(this.citizen.status === 'pregnant'){
                results.breeding_error = woman.name + " " + translate(language, "is already pregnant")
            }
            if(!results.both_have_fertility){
                results.breeding_error = translate(language, "Someone in the couple is not fertile enough")
            }
            if(!results.woman_fertile){
                results.breeding_error = woman.name + " " + translate(language, "is not fertile this week")
            }
            return results
        }
        const draw_final_results = (div) => {
            //Final results
            let woman = this.citizen.gender.charAt(0) === "F" ? this.citizen : this.related_citizen
            let final_results = woman.status != 'pregnant' && breeding_status[0] && breeding_status[1] ? "Breeding is possible" : "It is not possible for the couple to breed"
            let process_class = final_results != "Breeding is possible" ? "bg-red-800" : "bg-green-900"
            d = new DOMElement({
                tagName: "div", 
                classes: `mt-1 ${process_class} p-1 flex justify-between border border-gray-800 bg-gray-600 text-white grow`,
                parentElement: div.getNode(), 
                id: `accordion-relationship-${this.id}-fertility-results`
            })
            d1 = new DOMElement({
                tagName: "div", 
                classes: `grow`,
                parentElement: d.getNode()
            })
            p = new DOMElement({
                tagName: "p", 
                classes: "px-1 w-full",
                parentElement: d1.getNode()
            })
            s = new DOMElement({
                tagName: "span", 
                parentElement: p.getNode(),
                text: translate(language, "Final result")
            })
            s = new DOMElement({
                tagName: "span", 
                parentElement: p.getNode(),
                text: ":"
            })
            p = new DOMElement({
                tagName: "p", 
                classes: "px-1 w-full", 
                parentElement: d1.getNode()
            })
            s = new DOMElement({
                tagName: "span", 
                classes: `font-bold`,
                parentElement: p.getNode(),
                text: translate(language, final_results)
            })
            if(final_results != "Breeding is possible"){
                process_errors.forEach((error) => {
                    p = new DOMElement({
                        tagName: "p",
                        classes: "flex items-center px-1 mt-1 w-full",
                        parentElement: d1.getNode()
                    })
                    i = new DOMElement({
                        tagName: "i",
                        classes: "fa fa-face-confused font-bold",
                        parentElement: p.getNode()
                    })
                    s = new DOMElement({
                        tagName: "span", 
                        classes: "ps-1",
                        parentElement: p.getNode(),
                        text: error
                    })
                })
            } else {
                d1 = new DOMElement({
                    tagName: "div", 
                    classes: `grow`,
                    parentElement: d.getNode()
                })
                p = new DOMElement({
                    tagName: "p", 
                    classes: "text-end w-full",
                    parentElement: d1.getNode()
                })
                b = new DOMElement({
                    tagName: "button", 
                    parentElement: p.getNode(),
                    classes: "bg-gray-800 border border-gray-400 text-gray-200 grow p-2",
                    id: `relationship-${this.id}-start-breeding`,
                    text: translate(language, "Start breeding")
                })
                                
                b.getNode().addEventListener("click", (e) => {
                    //Check if pregnancy was successful
                    let fertility_avg = ((this.citizen.fertility.value + this.related_citizen.fertility.value) / 2).toFixed(0)
                    let successful_pregnancy = Math.random() < Pregnancy.viability(fertility_avg)
                    let woman = this.citizen.gender.charAt(0) === "F" ? this.citizen : this.related_citizen
                    let man = this.citizen.gender.charAt(0) === "M" ? this.citizen : this.related_citizen
                    if(successful_pregnancy){
                        //Create pregnancy.
                        //1) Create pregnancy object, fill it, and add it to pregnancies set.
                        let pregnancy = new Pregnancy(woman, man)
                        //2) Constructor decides if it was a single baby, twins or three kids.
                        colony.add_pregnancy(pregnancy)
                        //3) Change woman status to "pregnant".
                        woman.status = "pregnant"
                        pregnancy.draw()
                        //Show modal alert
                        let modal_data = {
                            "paragraphs":[
                                woman.name.split(", ")[0] + " "+translate(language, "and")+" " + man.name.split(", ")[0] + " "+translate(language, "will be parents soon!"),
                                translate(language, "Your population will increase in a few weeks.")
                            ]
                        }
                        let button_modal = document.querySelector(`#relationship-${this.id}-start-breeding`)
                        let alert_modal = new ModalBox(button_modal, "modalPregnancySuccessful", null, modal_data)
                        alert_modal.build("alert_pregnancy_successful").show()
                        //Remove breeding panel.
                        if(colony.active_panel) colony.active_panel.close()
                    } else {
                        //Show modal alert
                        let modal_data = {
                            "paragraphs":[
                                "There was no luck this time. No pregnancy was achieved.",
                                "They might succeed maybe next time."
                            ]
                        }
                        let button_modal = document.querySelector(`#relationship-${this.id}-start-breeding`)
                        let alert_modal = new ModalBox(button_modal, "modalNoPregnancy", null, modal_data)
                        alert_modal.build("alert_no_pregnancy").show()
                        
                        //alert("No hubo embarazo esta vez. Quizás la próxima tengan más éxitos.")
                        //Reduce each couple member's fertility.
                        woman.decrease_fertility()
                        man.decrease_fertility()
                        /*
                        woman.fertility.value = Math.max(0, woman.fertility.value - 1)
                        man.fertility.value = Math.max(0, man.fertility.value - 1)
                        */
                    }
                })
                
            }
        }
        //Get couple data.
        //Specific try breeding panel
        let p, d, s, s1, s2, i, ga
        p = new DOMElement({
            tagName: "p", 
            classes: "flex w-100 gap-1 justify-between items-center flex-wrap text-gray-300", 
            parentElement: container
        })
        d = new DOMElement({
            tagName: "div", 
            classes: "w-100 text-xs",
            attributes: [{"key":"data-accordion","value":"collapse"}], 
            parentElement: p.getNode(), 
            id: `accordion-relationship-${this.id}-breeding-processes`
        })

        //Process all stages final attraction percent.
        process_all_stages_data()
        //Build mutual discovery process header
        draw_mutual_discovery_accordion(d)

        //Build fertility report header
        draw_fertility_report_accordion(d)
        
        //Build final report
        draw_final_results(d)
    }
    //Create breeding attempt panel.
    try_breeding_event = (e) => {
        let current_relationship_id = e.target.closest("button").id.split("-")[1]
        let objectData = {"language": language, "name": "Try breeding", "icon": "fa fa-venus-mars", "accordionBodyId": `relationship-${current_relationship_id}-actions`, "buildContent": this.try_breeding_content}
        //Build select couple panel
        colony.active_panel = new Webpanel(objectData)
    }
}