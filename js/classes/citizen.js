class Citizen {
    static max_age_years = 85
    static max_attributes = 11
    static min_search_couple_age = 14
    static baby_age_limit = 5 //Less than
    static child_age_limit = 14 //Less than
    static teen_age_limit = 21 //Less than
    static adult_age_limit = 50 //Less than
    static grown_adult_age_limit = 65 //Less than
    static role_icons = [ 
        {"EN": "academic", "ES": {"F": "académica", "M": "académico"}, "key":"researching", "icon": "graduation-cap"}, 
        {"EN": "banker", "ES": {"F": "banquera", "M": "banquero"}, "key":"bankery", "icon": "sack-dollar"}, 
        {"EN": "blacksmith", "ES": {"F": "herrera", "M": "herrero"}, "key":"blacksmithing", "icon": "industry"}, 
        {"EN": "builder", "ES": {"F": "constructora", "M": "constructor"}, "key":"construction", "icon": "trowel"}, 
        {"EN": "carpenter", "ES": {"F":"carpintera", "M":"carpintero"}, "key":"carpentry", "icon": "hammer"}, 
        {"EN": "expeditionary", "ES": {"F": "expedicionaria", "M": "expedicionario"}, "key":"expeditioning", "icon": "map-location-dot"},
        {"EN": "farmer", "ES": {"F": "granjera", "M": "granjero"}, "key":"farming", "icon": "wheat"}, 
        {"EN": "fisher", "ES": {"F":"pescadora", "M":"pescador", "N":"pescador/a"}, "key":"fishing", "icon": "fish"},
        {"EN": "hunter", "ES": {"F": "cazadora", "M": "cazador"}, "key":"hunting", "icon": "deer"}, 
        {"EN": "merchant", "ES": "mercader", "key":"marketing", "icon": "store"}, 
        {"EN": "miner", "ES": {"F": "minera", "M": "minero"}, "key":"mining", "icon": "shovel"}, 
        {"EN": {"F":"ovenwoman", "M": "ovenman"}, "ES": {"F":"hornera", "M":"hornero"}, "key":"oven", "icon": "temperature-high"}, 
        {"EN": "soldier", "ES": "soldado", "key":"war", "icon": "shield-halved"}, 
        {"EN": "stone breaker", "ES": {"F": "picadora", "M": "picador"}, "key":"stonebreaking", "icon": "pickaxe"}, 
        {"EN": "spinner", "ES": {"F":"hilandera", "M":"hilandero"}, "key":"spinning", "icon": "socks"}, 
        {"EN": "technician", "ES": {"F": "técnica", "M": "técnico"}, "key":"technics", "icon": "gear"}, 
        {"EN": "water bearer", "ES": {"F": "aguatera", "M": "aguatero", "N":"aguatero/a"}, "key":"waterbearing", "icon": "glass-water"}, 
        {"EN": "woodcutter", "ES": {"F":"leñadora", "M":"leñador"}, "key":"woodcutting", "icon": "axe"}, 
    ]
    static texts_intros = {"ES" : {"F": "Ella es una", "M": "El es un"}, "EN" : {"F": "She is a", "M": "He is a"}}
    static texts_likings = {"ES" : {"F": "A ella le gusta un", "M": "A él le gusta una"}, "EN" : {"F": "She likes a", "M": "He likes a"}}
    static texts_disliking = {"ES" : {"F": "Ella prefiere que no sea", "M": "Él prefiere que no sea"}, "EN" : {"F": "She prefers a no", "M": "He prefers a no"}}
    static daily_water_needs = 2
    static daily_food_needs = 1
    static age_groups = ["baby", "child", "teen", "adult", "grown adult", "ancient"]
    static age_groups_translated = {
        "baby": {"EN": {"F": "baby", "M":"baby"}, "ES":{"F": "beba", "M":"bebé"}},
        "child": {"EN": {"F": "little girl", "M":"little boy"}, "ES":{"F": "nena", "M":"nene"}},
        "teen": {"EN": {"F": "girl", "M":"boy"}, "ES":{"F": "chica", "M":"chico"}},
        "adult": {"EN": {"F": "woman", "M":"man"}, "ES":{"F": "mujer", "M":"hombre"}},
        "grown adult": {"EN": {"F": "grown woman", "M":"grown man"}, "ES":{"F": "mujer madura", "M":"hombre maduro"}}, 
        "ancient": {"EN": {"F": "ancient woman", "M":"ancient man"}, "ES":{"F": "anciana", "M":"anciano"}}
    }
    //General method to obtain a random name and family name for a citizen.
    static get_random_name = (language, gender = ["Femenine", "Masculine"][Numeric.random_integer(0, 1)]) => {
        let excluded_names = Colony.citizens_assigned_names[gender]['names'] ? Colony.citizens_assigned_names[gender]['names'] : []
        let excluded_families = Colony.citizens_assigned_names[gender]['names'] ? Colony.citizens_assigned_names[gender]['families'] : []
        let all_names = naming['names'][language][gender.charAt(0)], allowed_names
        let all_families = naming['families'][language][gender.charAt(0)], allowed_families
        //Cut all excluded names.
        if(excluded_names){
            let excluded_names_set = new Set(excluded_names)
            let all_names_set = new Set(all_names)
            let allowed_names_set
            if(all_names_set.length > excluded_names_set.length){
                //Obtain available names.
                allowed_names_set = all_names_set.difference(excluded_names_set)
                allowed_names = [...allowed_names_set]
            } else {
                //All names were already taken, need to repeat names.
                allowed_names = [...all_names_set]
            }
        } else {
            allowed_names = all_names
        }
        //Cut all excluded families.
        if(excluded_families){
            let excluded_families_set = new Set(excluded_families)
            let all_families_set = new Set(all_families)
            let allowed_families_set
            if(all_families_set.length > excluded_families_set.length){
                //Obtain available families.
                allowed_families_set = all_families_set.difference(excluded_families_set)
                allowed_families = [...allowed_families_set]
            } else {
                //All families were already taken, repeat names.
                allowed_families = [...all_families_set]
            }
        } else {
            allowed_families = all_families
        }
        //Define random name
        let name = allowed_names[Numeric.random_integer(0, allowed_names.length - 1)]
        Colony.add_citizen_assigned_name(this.gender, name)
        //Define random family name
        let family = allowed_families[Numeric.random_integer(0, allowed_families.length - 1)]
        Colony.add_citizen_assigned_name(this.gender, family)
        return name + ", " + family
    }
    //General method to obtain random attributes for a citizen.
    static get_random_attributes = (language, amount = 3, excluded_attributes = []) => {
        if(excluded_attributes.length >= Citizen.max_attributes - amount){
            //Not enough attributes available to choose from.
            return null
        }
        let attribute_groups = JSON.parse(JSON.stringify(attributes[language]))
        //Exclude necessary attributes.
        attribute_groups.forEach(function(group){
            excluded_attributes.forEach(function(excluded_attribute){
                group.attributes = group.attributes.filter(item => item !== excluded_attribute)
            })
        })
        let citizen_attributes = []
        let random_group_index = 0, random_group = {}
        for(let i = 0; i < amount; i++){
            do {
                random_group_index = Numeric.random_integer(0, attribute_groups.length-1)
                random_group = attribute_groups[random_group_index]
            } while(!random_group.attributes.length)
            let random_attribute = random_group.attributes[Numeric.random_integer(0, random_group.attributes.length-1)]
            //Remove attribute from list so that it cannot be chosen later.
            attribute_groups[random_group_index].attributes = attribute_groups[random_group_index].attributes.filter(item => item !== random_attribute)
            //Add random attribute to list
            citizen_attributes.push(random_attribute)
        }
        return citizen_attributes
    }
    //Gauss based function to calculate attraction percent lost or gain due to age difference (x) between 2 citizens in a relationship
    static age_difference_attraction = (age_difference) => {
        if(!age_difference) return same_age_in_relationship_attraction_percent
        const threshold = 0.99
        const max_age_difference = 40
        let gauss_function_result = -Math.floor((threshold - Numeric.gauss_domain_c(1, 0, age_difference)) * max_age_difference)
        gauss_function_result += (age_difference >= 35 ? 1 : 0) 
        return gauss_function_result
    }
    #weekOfDeath = 0
    constructor(citizen = false) {
        this.id = (!citizen || !citizen.id) ? colony.get_next_citizen_id() : citizen.id
        let gender_calculated = ["Femenine", "Masculine"][Numeric.random_integer()]
        this.gender = (!citizen || !citizen.gender) ? gender_calculated : citizen.gender
        this.other_gender = this.gender === "Femenine" ? "Masculine" : "Femenine"
        this.name = (!citizen || !citizen.name) ? Citizen.get_random_name(language, this.gender) : citizen.name
        //Relationships
        this.father = (!citizen || !citizen.father) ? null : citizen.father
        this.mother = (!citizen || !citizen.mother) ? null : citizen.mother
        this.parents = []
        this.mother && this.parents.push(this.mother)
        this.father && this.parents.push(this.father)
        this.grandmothers = []; this.grandfathers = [], this.grandparents = this.grandparents()
        this.children = (!citizen || !citizen.children) ? [] : citizen.children
        this.couple = (!citizen || !citizen.couple) ? null : citizen.couple
        this.role = (!citizen || !citizen.role) ? "unassigned" : citizen.role
        this.rolekey = (!citizen || !citizen.rolekey) ? "unassigned" : citizen.rolekey
        let weeks_alive_calculated = (!citizen || !citizen.weeksAlive) ? (this.ageWeeks ? this.ageWeeks + (this.ageYears ? this.ageYears * 52 : 0) : 0) : 0
        this.weeksAlive = (!citizen || !citizen.weeksAlive) ? weeks_alive_calculated : citizen.weeksAlive
        this.birthWeek = (!citizen || !citizen.birthWeek) ? colony.time_interval.weeks_passed - this.weeksAlive : citizen.birthWeek
        let years_alive_calculated = (!citizen || !citizen.ageYears) ? (this.weeksAlive ? Math.floor(this.weeksAlive / 52) : 0) : 0
        this.ageYears = (!citizen || !citizen.ageYears) ? years_alive_calculated : citizen.ageYears
        let year_weeks_alive_calculated = (!citizen || !citizen.ageWeeks) ? (this.weeksAlive ? Math.floor((this.weeksAlive / 52 - this.ageYears) * 52) : 0) : 0
        this.ageWeeks = (!citizen || !citizen.ageWeeks) ? year_weeks_alive_calculated : citizen.ageWeeks
        let week_of_death_calculated = (!citizen || !citizen.weekOfDeath) ? Numeric.random_integer(3120, Citizen.max_age_years * 52) : 0 
        this.#weekOfDeath = (!citizen || !citizen.weekOfDeath) ? week_of_death_calculated : citizen.weekOfDeath
        this.status = (!citizen || !citizen.status) ? "idle" : citizen.status
        this.xp = (!citizen || !citizen.xp) ? 0 : citizen.xp
        this.body = {}
        this.body.hands = {}
        this.body.hands.left = (!citizen || !citizen.leftHand) ? "Empty" : citizen.leftHand
        this.body.hands.right = (!citizen || !citizen.rightHand) ? "Empty" : citizen.rightHand
        this.body.outfit = (!citizen || !citizen.outfit) ? "No" : citizen.outfit
        this.fertility = {}
        let fertility_week_calculated = (this.gender === "Femenine" ? Numeric.random_integer(1, 4) : null)
        this.fertility.week = (!citizen || !citizen.fertilityWeek) ? fertility_week_calculated : citizen.fertilityWeek
        let fertility_calculated = Numeric.random_integer(10, 100)
        this.fertility.value = (!citizen || !citizen.fertility) ? fertility_calculated : citizen.fertility
        this.attributes = (!citizen || !citizen.attributes) ? Citizen.get_random_attributes(language, 3, []) : citizen.attributes
        this.wishedAttributes = (!citizen || !citizen.wishedAttributes) ? Citizen.get_random_attributes(language, 3, []) : citizen.wishedAttributes
        this.hatedAttribute = (!citizen || !citizen.hatedAttribute) ? Citizen.get_random_attributes(language, 1, this.wishedAttributes)[0] : citizen.hatedAttribute
        this.can_search_couple = this.ageYears >= Citizen.min_search_couple_age
        this.can_be_exiled = this.status == "idle" && this.ageYears >= 14
        this.can_get_role_assigned = this.ageYears >= 6 && this.status != "pregnant"
        this.drawing_data = {}
    }
    is_sibling_of = (a_citizen) => {
        //Check a_citizen's father branch
        let a_citizen_father_s_children = a_citizen.father && a_citizen.father ? a_citizen.father.children : []
        let a_citizen_siblings_by_father = a_citizen_father_s_children.filter((child_id) => child_id != a_citizen.id)
        let a_citizen_and_this_are_siblings_by_father = a_citizen_siblings_by_father.includes(this.id)
        //Check a_citizen's mother branch
        let a_citizen_mother_s_children = a_citizen.mother && a_citizen.mother ? a_citizen.mother.children : []
        let a_citizen_siblings_by_mother = a_citizen_mother_s_children.filter((child_id) => child_id != a_citizen.id)
        let a_citizen_and_this_are_siblings_by_mother = a_citizen_siblings_by_mother.includes(this.id)
        return a_citizen_and_this_are_siblings_by_father || a_citizen_and_this_are_siblings_by_mother
    }
    grandparents = () => {
        (this.father && this.father.mother && this.grandmothers.push(this.father.mother)) &&
        (this.mother && this.mother.mother && this.grandmothers.push(this.mother.mother)) &&
        (this.father && this.father.father && this.grandfathers.push(this.father.father)) &&
        (this.mother && this.mother.father && this.grandfathers.push(this.mother.father))
        this.grandparents = [...this.grandmothers, ...this.grandfathers]
        return this.grandparents
    }
    uncles = () => {
        let uncles = []
        this.grandparents.forEach((grandparent) => {
            uncles = uncles.concat(grandparent.children)
        })
        uncles.filter((uncle) => this.father && this.father.id != uncle.id && this.mother && this.mother.id != uncle.id)
        return uncles
    }
    cousins = () => {
        let cousins = []
        let citizen_uncles = this.uncles()
        //Obtain all cousins of citizen.
        citizen_uncles.forEach((uncle) => { cousins = cousins.concat(uncle.children) })
        return cousins
    }
    decrease_fertility = (amount = 1) => {
        this.fertility.value = Math.max(0, this.fertility.value - amount)
        //Update all html areas in which the value is displayed.
        document.querySelectorAll(`#citizen-${this.id}-fertility`).forEach(element => element.innerHTML = this.fertility.value.toString())
    }
    age_index = () => this.ageYears < Citizen.baby_age_limit 
                        ? 0 
                        : (this.ageYears <= Citizen.child_age_limit 
                            ? 1 
                            : (this.ageYears < Citizen.teen_age_limit 
                                ? 2 
                                : (this.ageYears <= Citizen.adult_age_limit 
                                    ? 3 : (this.ageYears <= Citizen.grown_adult_age_limit ? 4 : 5))))
    //Obtain age group string (baby, child, teen, adult, grown adult, ancient)
    age_group = () => Citizen.age_groups[this.age_index(this.ageYears)]
    //Obtain descriptions related to citizen attributes, likings and disliking.
    get_text_intro = () => Citizen.texts_intros[language][this.gender.charAt(0)]
    get_text_likings = () => Citizen.texts_likings[language][this.gender.charAt(0)]
    get_text_disliking = () => Citizen.texts_disliking[language][this.gender.charAt(0)]
    get_text_description = (index, text_to_show, attributes_to_show) => {
        let textAttr = "", prefix = "", gen = index > 1 ? this.other_gender.charAt(0) : this.gender.charAt(0), adjective = "", text = ""
        let connector, noun, genderPlacement = language=="ES" ? "left" : "right"
        if(language === "ES" && (text_to_show === "Ella es una" || text_to_show === "El es un")) { connector = " y " }
        if(language === "ES" && !(text_to_show === "Ella es una" || text_to_show === "El es un")) { connector = " o "}
        if(language === "EN" && (text_to_show === "She is a" || text_to_show === "He is a")) { connector = " and " }
        if(language === "EN" && !(text_to_show === "She is a" || text_to_show === "He is a")) { connector = " or "}
        //Check citizen age
        noun = index < 3 ? Citizen.age_groups_translated[this.age_group()][language][gen] : ""
        if(language === "EN"){
            attributes_to_show.forEach(function(value, index){
                prefix = (index<2 ? (index ? ", " : " ") : connector)
                adjective = attributes_adjectives[language][value]
                textAttr+= prefix+"<strong class='"+attributes_colors[language][value].text+"'>"+adjective+"</strong>"
            })
            text+= text_to_show+(genderPlacement=="left"?" "+noun:"")+" "+textAttr+(genderPlacement=="right"?" "+noun:"")
        }
        if(language === "ES"){
            attributes_to_show.forEach(function(value, index){
                prefix = (index<2 ? (index ? ", " : " ") : (value === "Inteligencia" && connector === " y " ? " e " : connector))
                if(typeof attributes_adjectives[language][value] === "undefined") debugger
                adjective = attributes_adjectives[language][value][gen]
                textAttr+= prefix+"<strong class='"+attributes_colors[language][value].text+"'>"+adjective+"</strong>"
            })
            text+= text_to_show+(genderPlacement=="left"?" "+noun:"")+" "+textAttr+(genderPlacement=="right"?" "+noun:"")
        }
        return text
    }
    get_description_as_html = () => {
        //Build description.
        let citizenBio = this.get_text_description(1, this.get_text_intro(), this.attributes)+"."
        //Only show possible future partner features if he or she is no baby.
        if(this.weeksAlive >= 728){
            citizenBio+= "</br>"+this.get_text_description(2, this.get_text_likings(), this.wishedAttributes)+".</br>"
            citizenBio+= this.get_text_description(3, this.get_text_disliking(), [this.hatedAttribute])
        }
        return citizenBio
    }
    //"Is a" boolean getters.
    is_strong = () => this.attributes.includes(translate(language, "Strength"))
    //Setters
    set_status = (status) => {
        this.status = status
        //Update colony citizen's panel.
        document.querySelectorAll(`#citizen-${this.id}-status`).forEach(element => element.innerHTML = translate(language, this.status, "", "capitalize"))
        //Update colony vital resources.
        let wells_water_income = colony.get_stock({type: "buildingParts", good: "well"}) * Colony.well_water_income
        let idle_citizens_water_income = colony.get_population({status: "idle"}) * Colony.daily_idle_citizen_water_income
        let idle_citizens_food_income = colony.get_population({status: "idle"}) * Colony.daily_idle_citizen_food_income
        let waterbearers_water_income = colony.landforms.get(1).get_assigned("waterbearing").size * colony.landforms.get(1).income.water
        let fishermen_food_income = colony.landforms.get(1).get_assigned("fishing").size * colony.landforms.get(1).income.food
        colony.set_income(wells_water_income + idle_citizens_water_income + waterbearers_water_income, "water")
        colony.set_income(idle_citizens_food_income + fishermen_food_income, "food")
    }
    set_xp = (new_xp) => {
        this.xp = new_xp
        let int_xp = Math.floor(new_xp)
        //Update colony citizen's panel.
        document.querySelectorAll(`#citizen-${this.id}-xp`).forEach(element => {
            if(new_xp >= 1) {
                DOMElement.show([`#citizen-${this.id}-xp-icon`])
                DOMElement.set_text(`#citizen-${this.id}-xp-icon`, int_xp.toString())
            }
            element.innerHTML = int_xp.toString()
        })
    }
    //Add html with accordion for citizen details.
    draw = (placement_template) => {
        this.drawing_data.id = "citizen-"+this.id
        this.drawing_data.gender = this.gender
        this.drawing_data.parentElement = placement_template.parentElement
        this.drawing_data.attributes = [{"key": "data-citizen-id", "value": this.id}]
        this.drawing_data.accordion_header = (parent_div_id) => {
            let parent_div = document.getElementById(parent_div_id)
            //Define icons to prefix citizen's name
            let citizen_gender_icon_class = this.gender != undefined ? (this.gender === "Femenine" ? "fa-venus text-red-500" : "fa-mars text-blue-500") : "hidden"
            let citizen_age_group_icon_class = this.ageYears != undefined ?  `fa-${age_index(this.ageYears)+1}` : "hidden fa"
            let citizen_role_icon_class = "hidden"
            if(this.role != undefined){
                Citizen.role_icons.forEach((role) => {
                    if(role.key === this.rolekey){
                        citizen_role_icon_class = `text-green-500 fa-${role.icon}`
                    }
                })
            }
            let i = new DOMElement({
                tagName: "i",
                classes: `me-1 fa ${citizen_gender_icon_class}`,
                parentElement: parent_div,
                id: `${this.drawing_data.id}-gender-icon`,
            })
            let s_age = new DOMElement({
                tagName: "span",
                parentElement: parent_div,
            })
            i = new DOMElement({
                tagName: "i",
                classes: `fa text-white fa-person`,
                parentElement: s_age.getNode(),
                id: `${this.drawing_data.id}-age-icon`,
            })
            i = new DOMElement({
                tagName: "i",
                classes: `ms-0.5 me-1 fa text-white ${citizen_age_group_icon_class}`,
                parentElement: s_age.getNode(),
                id: `${this.drawing_data.id}-age-group-icon`,
                attributes: [{key: "style", value: "font-size:50% !important"}],
            })
            i = new DOMElement({
                tagName: "i",
                classes: `me-1 fa ${citizen_role_icon_class}`,
                parentElement: parent_div,
                id: `${this.drawing_data.id}-role-icon`,
            })
            let s1 = new DOMElement({
                tagName: "span",
                classes: "hidden rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 me-1",
                parentElement: parent_div,
                id: `${this.drawing_data.id}-xp-icon`,
                text: this.drawing_data.xp >= 1 ? this.drawing_data.xp.toString() : ""
            })
            s1 = new DOMElement({
                tagName: "span",
                classes: "ms-1",
                parentElement: parent_div,
                id: `${this.drawing_data.id}-name`,
                text: this.name
            })
        }
        this.drawing_data.accordion_body = (parent_div_id) => {
            let parent_div = document.getElementById(parent_div_id), d, p, s, i, b
            parent_div.classList.add("citizen") 

            this.draw_features(parent_div)
            this.draw_properties(parent_div)
            this.draw_relationships(parent_div)
            this.draw_available_actions(parent_div)

        }
        let accordion = new Accordion(this.drawing_data)
    }
    draw_features = (parent_div) => {
        //Citizen's description
        let d = new DOMElement({
            tagName: "div",
            classes: "p-1 border border-gray-800 bg-gray-700 text-xs",
            parentElement: parent_div
        })
        let p = new DOMElement({
            tagName: "p",
            classes: "ms-1 text-xs text-gray-200",
            parentElement: d.getNode()
        })
        let s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode(),
            id: `${this.drawing_data.id}-description`
        })
        //Place description in citizen's description panel, removing previous one if existed.
        document.getElementById(`${this.drawing_data.id}-description`).innerHTML = "\""+this.get_description_as_html()+"\""
    }
    draw_properties = (parent_div) => {
        const draw_first_line = () => {
            let p = new DOMElement({
                tagName: "p",
                classes: "mx-2 pb-1 flex justify-between text-xs text-gray-200",
                parentElement: document.getElementById(`${this.drawing_data.id}-properties`)
            })
            let s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode()
            })
            //Citizen's gender
            let s_gender = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, "Gender")
            })
            s.appendHTML(": ")
            s_gender = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                id: `${this.drawing_data.id}-gender`,
                classes: "font-bold",
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, this.gender)
            })
            s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode()
            })
            //Citizen's status
            let s_status = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, "Status")
            })
            s.appendHTML(": ")
            s_status = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                id: `${this.drawing_data.id}-status`,
                classes: "font-bold",
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, this.status)
            })
            //Add pregnancy remaining weeks if necessary (for women with "pregnant" status)
            if(this.gender === "Femenine"){
                let s1 = new DOMElement({
                    tagName: "span",
                    parentElement: s.getNode(),
                    classes: "pregnant hidden ms-1",
                    attributes: [{"key":"data-i18n", "value":""}],
                    text: "("
                })
                s1 = new DOMElement({
                    tagName: "span",
                    parentElement: s.getNode(),
                    id: `${this.drawing_data.id}-pregnancy-weeks`,
                    classes: "pregnant pregnancy-weeks hidden me-1 font-bold",
                    attributes: [{"key":"data-remaining-weeks", "value":""}],
                    text: "39"
                })
                s1 = new DOMElement({
                    tagName: "span",
                    parentElement: s.getNode(),
                    classes: "pregnant hidden",
                    attributes: [{"key":"data-i18n", "value":""}],
                    text: translate(language, "remaining week/s")
                })
                s1 = new DOMElement({
                    tagName: "span",
                    parentElement: s.getNode(),
                    classes: "pregnant hidden",
                    attributes: [{"key":"data-i18n", "value":""}],
                    text: ")"
                })
            }
        }
        const draw_second_line = () => {
            let p = new DOMElement({
                tagName: "p",
                classes: "mx-2 pb-1 flex justify-between text-xs text-gray-200",
                parentElement: document.getElementById(`${this.drawing_data.id}-properties`)
            })
            let s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode()
            })
            //Citizen's birthweek
            let s_birth = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, "Birth week")
            })
            s.appendHTML(": ")
            s_birth = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                id: `${this.drawing_data.id}-birthWeek`,
                classes: "font-bold",
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, this.birthWeek.toString())
            })
            s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode()
            })
            //Citizen's age
            let s_ageYears = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, "Age")
            })
            s.appendHTML(": ")
            s_ageYears = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                id: `${this.drawing_data.id}-ageYears`,
                classes: "font-bold",
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, this.ageYears.toString())
            })
            let s1 = new DOMElement({
                tagName: "span",
                classes: "ms-1",
                parentElement: s.getNode(),
                text: translate(language, "years")
            })
            s.appendHTML(",")
            let s_ageWeeks = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                id: `${this.drawing_data.id}-ageWeeks`,
                classes: "ms-1 font-bold",
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, this.ageWeeks.toString())
            })
            s1 = new DOMElement({
                tagName: "span",
                classes: "ms-1",
                parentElement: s.getNode(),
                text: translate(language, "weeks")
            })
        }
        const draw_third_line = () => {
            let p = new DOMElement({
                tagName: "p",
                classes: "mx-2 pb-1 flex justify-between text-xs text-gray-200",
                parentElement: document.getElementById(`${this.drawing_data.id}-properties`)
            })
            let s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode()
            })
            //Citizen's role
            let s_role = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, "Role")
            })
            s.appendHTML(": ")
            s_role = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                id: `${this.drawing_data.id}-role`,
                classes: "font-bold",
                attributes: [{"key":"data-i18n", "value":""}, {"key":"data-role", "value":this.rolekey}],
                text: translate(language, this.role.toString())
            })
            s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode()
            })
            //Citizen's experience
            let s_xp = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, "Experience")
            })
            s.appendHTML(": ")
            s_xp = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                id: `${this.drawing_data.id}-xp`,
                classes: "font-bold",
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, this.xp.toString())
            })
        }
        const draw_forth_line = () => {
            let p = new DOMElement({
                tagName: "p",
                classes: "mx-2 pb-1 flex justify-between text-xs text-gray-200",
                parentElement: document.getElementById(`${this.drawing_data.id}-properties`)
            })
            let s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode()
            })
            //Citizen's left hand
            let s_hand = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, "Left hand")
            })
            s.appendHTML(": ")
            s_hand = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                id: `${this.drawing_data.id}-leftHand`,
                classes: "font-bold",
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, this.body.hands.left, "f")
            })
            s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode()
            })
            //Citizen's right hand
            s_hand = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, "Right hand")
            })
            s.appendHTML(": ")
            s_hand = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                id: `${this.drawing_data.id}-rightHand`,
                classes: "font-bold",
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, this.body.hands.right, "f")
            })
        }
        const draw_fifth_line = () => {
            let p = new DOMElement({
                tagName: "p",
                classes: "mx-2 pb-1 flex justify-between mb-1 text-xs text-gray-200",
                parentElement: document.getElementById(`${this.drawing_data.id}-properties`)
            })
            let s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode()
            })
            //Citizen's outfit
            let s_outfit = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, "Outfit")
            })
            s.appendHTML(": ")
            s_outfit = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                id: `${this.drawing_data.id}-outfit`,
                classes: "font-bold",
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, this.body.outfit)
            })
            s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode()
            })
            let visible_fertility = this.ageYears >= Citizen.min_search_couple_age
            if(visible_fertility){
                //Citizen's fertility
                let s_fertility = new DOMElement({
                    tagName: "span",
                    parentElement: s.getNode(),
                    attributes: [{"key":"data-i18n", "value":""}],
                    text: translate(language, "Fertility")
                })
                s.appendHTML(": ")
                s_fertility = new DOMElement({
                    tagName: "span",
                    parentElement: s.getNode(),
                    id: `${this.drawing_data.id}-fertility`,
                    classes: "font-bold",
                    attributes: [{"key":"data-i18n", "value":""}],
                    text: this.fertility.value.toString()
                })
                this.redraw_citizen_fertility()
                if(this.gender === "Femenine"){
                    let s1 = new DOMElement({
                        tagName: "span",
                        parentElement: s.getNode(),
                        classes: "ms-1 fertility-week",
                        text: "("
                    })
                    s1 = new DOMElement({
                        tagName: "span",
                        parentElement: s.getNode(),
                        classes: "fertility-week me-1",
                        attributes: [{"key":"data-i18n", "value":""}],
                        text: translate(language, "week")
                    })
                    s1 = new DOMElement({
                        tagName: "span",
                        parentElement: s.getNode(),
                        id: `${this.drawing_data.id}-fertility-week`,
                        classes: "fertility-week",
                        text: this.fertility.week.toString()
                    })
                    s1 = new DOMElement({
                        tagName: "span",
                        parentElement: s.getNode(),
                        classes: "fertility-week",
                        text: "/4)"
                    })
                    this.redraw_citizen_fertility_week()
                }
            }
        }
        //Citizen's properties title
        let d = new DOMElement({
            tagName: "div",
            classes: "border border-gray-800 bg-gray-800 mt-1 text-xs",
            parentElement: parent_div
        })
        let p = new DOMElement({
            tagName: "p",
            classes: "p-1 ps-2 text-xs text-gray-200",
            parentElement: d.getNode()
        })
        let s = new DOMElement({
            tagName: "span",
            classes: "text-xs text-gray-200",
            attributes: [{"key":"data-i18n", "value":""}],
            parentElement: p.getNode(),
            text: translate(language, "Properties of")
        })
        s = new DOMElement({
            tagName: "span",
            classes: "ms-1 text-xs text-gray-200",
            parentElement: p.getNode(),
            text: this.name.split(",")[0]
        })
        //Citizen's properties body
        d = new DOMElement({
            tagName: "div",
            classes: "border border-gray-800 bg-gray-700 py-1 pb-0 text-xs",
            parentElement: parent_div,
            id: `${this.drawing_data.id}-properties`
        })
        draw_first_line()
        draw_second_line()
        draw_third_line()
        draw_forth_line()
        draw_fifth_line()
    }
    draw_relationships = (parent_div) => {
        const draw_parents = () => {
            let d = new DOMElement({
                tagName: "div",
                classes: "my-1",
                parentElement: document.getElementById(`${this.drawing_data.id}-relationships-body`)
            })
            //Citizen's parents title
            let d1 = new DOMElement({
                tagName: "div",
                classes: "mx-1 p-1 px-2 flex justify-between text-xs text-gray-200 bg-gray-800 border border-gray-800",
                id: `${this.drawing_data.id}-parents-title`,
                parentElement: d.getNode()
            })
            let p = new DOMElement({
                tagName: "p",
                classes: "",
                parentElement: d1.getNode()
            })
            let s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode()
            })
            let s1 = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, "Parents")
            })
            //Citizen's parents body
            d1 = new DOMElement({
                tagName: "div",
                classes: "mx-1 p-1 flex justify-between text-xs text-gray-200 bg-gray-500 border border-gray-800",
                id: `${this.drawing_data.id}-parents`,
                parentElement: d.getNode()
            })
            //If no parents detected, show "Empty" text.
            if(!this.mother && !this.father){
                p = new DOMElement({
                    tagName: "p",
                    classes: "px-1",
                    parentElement: d1.getNode()
                })
                s = new DOMElement({
                    tagName: "span",
                    parentElement: p.getNode()
                })
                i = new DOMElement({
                    tagName: "i",
                    classes: "fa fa-light fa-empty-set me-1",
                    parentElement: s.getNode(),
                }) 
                s1 = new DOMElement({
                    tagName: "span",
                    parentElement: s.getNode(),
                    attributes: [{"key":"data-i18n", "value":""}],
                    text: translate(language, "None", "m")
                })
            } else {
                let parents = []
                if(this.mother) parents.push(this.mother)
                if(this.father) parents.push(this.father)
                parents.forEach((a_parent) => {
                    let type = a_parent.gender.charAt(0) === "F" ? "mother" : "father"
                    p = new DOMElement({
                        tagName: "p",
                        classes: `${type} mt-1 mb-1 text-xs flex w-100 justify-between gap-2 px-1 text-white`,
                        parentElement: document.querySelector(`#citizen-${this.id}-parents`)
                    })
                    h2 = new DOMElement({
                        tagName: "h2",
                        classes: "grow",
                        parentElement: p.getNode()
                    })
                    d2 = new DOMElement({
                        tagName: "div",
                        classes: "flex items-center justify-between gap-1 w-full py-1 px-2 text-xs text-gray-400 bg-gray-700 border border-gray-200",
                        parentElement: h2.getNode()
                    })
                    s = new DOMElement({
                        tagName: "span",
                        parentElement: d2.getNode()
                    })
                    let gender_class = type === "mother" ? "venus" : "mars"
                    let gender_color = type === "mother" ? "red" : "blue"
                    i = new DOMElement({
                        tagName: "i",
                        classes: `fa fa-${gender_class} text-${gender_color}-500`,
                        parentElement: s.getNode()
                    })
                    s1 = new DOMElement({
                        tagName: "span",
                        classes: `font-bold bg-gray-600 border border-gray-500 text-${gender_color}-400 px-1 ms-1`,
                        attributes: [{"key":"data-i18n", "value":""}],
                        parentElement: s.getNode(),
                        text: translate(language, type, "", "capitalized")
                    })
                    s1 = new DOMElement({
                        tagName: "span",
                        classes: "ms-2 text-gray-200",
                        parentElement: s.getNode(),
                        text: a_parent.name
                    })
                    s = new DOMElement({
                        tagName: "span",
                        parentElement: d2.getNode()
                    })
                    i = new DOMElement({
                        tagName: "i",
                        classes: "fa fa-eye",
                        attributes: [{"key":"data-citizen-id", "value":a_parent.id}],
                        parentElement: s.getNode(),
                        id: `parent-${a_parent.id}-view-info`
                    })
                    i.getNode().addEventListener("click", this.show_citizen_info_modal_event)
                })
            }
        }
        const draw_couple = () => {
            let d = new DOMElement({
                tagName: "div",
                classes: "my-1",
                parentElement: document.getElementById(`${this.drawing_data.id}-relationships-body`)
            })
            //Citizen's couple title
            let d1 = new DOMElement({
                tagName: "div",
                classes: "mx-1 p-1 px-2 flex justify-between text-xs text-gray-200 bg-gray-800 border border-gray-800",
                id: `${this.drawing_data.id}-couple-title`,
                parentElement: d.getNode()
            })
            let p = new DOMElement({
                tagName: "p",
                classes: "",
                parentElement: d1.getNode()
            })
            let s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode()
            })
            let s1 = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, "Couple")
            })
            //Citizen's couple body
            d1 = new DOMElement({
                tagName: "div",
                classes: "mx-1 p-1 px-2 flex justify-between text-xs text-gray-200 bg-gray-500 border border-gray-800",
                id: `${this.drawing_data.id}-couple`,
                parentElement: d.getNode()
            })
            p = new DOMElement({
                tagName: "p",
                classes: "text-xs flex w-100 justify-between gap-2 text-white",
                parentElement: d1.getNode()
            })
            //If no couple detected, show "Empty" text.
            if(!this.couple){
                s = new DOMElement({
                    tagName: "span",
                    parentElement: p.getNode()
                })
                i = new DOMElement({
                    tagName: "i",
                    classes: "fa fa-light fa-empty-set me-1",
                    parentElement: s.getNode(),
                }) 
                s1 = new DOMElement({
                    tagName: "span",
                    parentElement: s.getNode(),
                    attributes: [{"key":"data-i18n", "value":""}],
                    text: translate(language, "None", "f")
                })
            } else {
                //Build couple's info card.
                let couple_div = d.getNode()
                d.getNode().classList.remove("px-2")
                //Add couple to citizen.
                h2 = new DOMElement({
                    tagName: "h2", 
                    classes: "grow", 
                    parentElement: p.getNode(), 
                    id: `citizen-${this.id}-couple-${this.couple.id}`
                })
                d2 = new DOMElement({
                    tagName: "div", 
                    classes: "flex items-center justify-between gap-1 w-full py-1 px-2 text-xs text-gray-400 bg-gray-700 border border-gray-200", 
                    attributes: [{"key":"data-citizen-id", "value":this.couple.id}], 
                    parentElement: h2.getNode()
                })
                s = new DOMElement({
                    tagName: "span", 
                    parentElement: d2.getNode()
                })
                let couple_gender_class = this.couple.gender.charAt(0) === "F" ? "venus" : "mars"
                let couple_gender_color = this.couple.gender.charAt(0) === "F" ? "red" : "blue"
                i = new DOMElement({
                    tagName: "i", 
                    classes: `fa fa-${couple_gender_class} text-${couple_gender_color}-500`, 
                    parentElement: s.getNode()
                })
                s1 = new DOMElement({
                    tagName: "span", 
                    classes: "ms-2 text-gray-200", 
                    parentElement: s.getNode(),
                    text: this.couple.name
                })
                s = new DOMElement({
                    tagName: "span", 
                    parentElement: d2.getNode()
                })
                i = new DOMElement({
                    tagName: "i", 
                    classes: "fa fa-eye me-2", 
                    attributes: [{"key":"data-citizen-id", "value":this.couple.id}], 
                    parentElement: s.getNode(), 
                    id: `couple-${this.couple.id}-view-info`
                })
                i.getNode().addEventListener("click", this.show_citizen_info_modal_event)
                i = new DOMElement({
                    tagName: "i", 
                    classes: "fa fa-ban", 
                    attributes: [{"key":"data-citizen-id", "value":this.couple.id}], 
                    parentElement: s.getNode(), 
                    id: `couple-${this.couple.id}-cancel-relationship`
                })
                i.getNode().addEventListener("click", this.cancel_relationship_event)
            }
        }
        const draw_children = () => {
            let d = new DOMElement({
                tagName: "div",
                classes: "my-1",
                parentElement: document.getElementById(`${this.drawing_data.id}-relationships-body`)
            })
            //Citizen's children title
            let d1 = new DOMElement({
                tagName: "div",
                classes: "mx-1 p-1 px-2 flex justify-between text-xs text-gray-200 bg-gray-800 border border-gray-800",
                id: `${this.drawing_data.id}-children-title`,
                parentElement: d.getNode()
            })
            let p = new DOMElement({
                tagName: "p",
                classes: "",
                parentElement: d1.getNode()
            })
            let s = new DOMElement({
                tagName: "span",
                parentElement: p.getNode()
            })
            let s1 = new DOMElement({
                tagName: "span",
                parentElement: s.getNode(),
                attributes: [{"key":"data-i18n", "value":""}],
                text: translate(language, "Children")
            })
            //Citizen's children body
            d1 = new DOMElement({
                tagName: "div",
                classes: "mx-1 p-1 flex flex-wrap justify-between text-xs text-gray-200 bg-gray-500 border border-gray-800",
                id: `${this.drawing_data.id}-children`,
                parentElement: d.getNode()
            })
            //If no children detected, show "Empty" text.
            if(!this.children || !this.children.length){
                p = new DOMElement({
                    tagName: "p",
                    classes: "",
                    parentElement: d1.getNode()
                })
                s = new DOMElement({
                    tagName: "span",
                    parentElement: p.getNode()
                })
                i = new DOMElement({
                    tagName: "i",
                    classes: "fa fa-light fa-empty-set me-1",
                    parentElement: s.getNode(),
                }) 
                s1 = new DOMElement({
                    tagName: "span",
                    parentElement: s.getNode(),
                    attributes: [{"key":"data-i18n", "value":""}],
                    text: translate(language, "None", "m")
                })
            } else {
                this.children.forEach((a_child) => {
                    p = new DOMElement({
                        tagName: "p",
                        classes: `mt-1 mb-1 text-xs flex w-100 justify-between gap-2 px-1 text-white`,
                        parentElement: document.querySelector(`#${this.drawing_data.id}-children`)
                    })
                    h2 = new DOMElement({
                        tagName: "h2",
                        classes: "grow",
                        parentElement: p.getNode()
                    })
                    d2 = new DOMElement({
                        tagName: "div",
                        classes: "flex items-center justify-between gap-1 w-full py-1 px-2 text-xs text-gray-400 bg-gray-700 border border-gray-200",
                        parentElement: h2.getNode()
                    })
                    s = new DOMElement({
                        tagName: "span",
                        parentElement: d2.getNode()
                    })
                    let gender_class = a_child.gender.charAt(0) === "F" ? "venus" : "mars"
                    let gender_color = a_child.gender.charAt(0) === "F" ? "red" : "blue"
                    i = new DOMElement({
                        tagName: "i",
                        classes: `fa fa-${gender_class} text-${gender_color}-500`,
                        parentElement: s.getNode()
                    })
                    let child_type = a_child.gender.charAt(0) === "F" ? "Daughter" : "Son"
                    s1 = new DOMElement({
                        tagName: "span",
                        classes: `font-bold bg-gray-600 border border-gray-500 text-${gender_color}-400 px-1 ms-1`,
                        attributes: [{"key":"data-i18n", "value":""}],
                        parentElement: s.getNode(),
                        text: translate(language, child_type, "", "capitalized")
                    })
                    s1 = new DOMElement({
                        tagName: "span",
                        classes: "ms-2 text-gray-200",
                        parentElement: s.getNode(),
                        text: a_child.name
                    })
                    s = new DOMElement({
                        tagName: "span",
                        parentElement: d2.getNode()
                    })
                    i = new DOMElement({
                        tagName: "i",
                        classes: "fa fa-eye",
                        attributes: [{"key":"data-citizen-id", "value":a_child.id}],
                        parentElement: s.getNode(),
                        id: `children-${a_child.id}-view-info`
                    })
                    i.getNode().addEventListener("click", this.show_citizen_info_modal_event)
                })
            }
        }
        //Citizen's properties title
        let d = new DOMElement({
            tagName: "div",
            classes: "border border-gray-800 bg-gray-800 mt-1 text-xs",
            attributes: [{"key":"data-body", "value":`${this.drawing_data.id}-relationships-body`}, {"key":"data-group", "value":`${this.drawing_data.id}-accordions`}],
            id: `${this.drawing_data.id}-relationships-title`,
            parentElement: parent_div
        })
        let p = new DOMElement({
            tagName: "p",
            classes: "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200",
            parentElement: d.getNode()
        })
        let s = new DOMElement({
            tagName: "span",
            classes: "text-xs text-gray-200",
            attributes: [{"key":"data-i18n", "value":""}],
            parentElement: p.getNode(),
            text: translate(language, "Relationships of")
        })
        s = new DOMElement({
            tagName: "span",
            classes: "grow ms-1 text-xs text-gray-200",
            parentElement: p.getNode(),
            text: this.name.split(",")[0]
        })
        let i = new DOMElement({
            tagName: "i",
            classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
            parentElement: p.getNode(),
        })
        //Citizen's properties body
        d = new DOMElement({
            tagName: "div",
            classes: "hidden border border-gray-800 bg-gray-700 text-xs",
            parentElement: parent_div,
            id: `${this.drawing_data.id}-relationships-body`
        })
        let ga = new GenerativeAccordion({title_id: `${this.drawing_data.id}-relationships-title`, callback: () => { draw_parents(); draw_couple(); draw_children() }})
    }
    draw_available_actions = (parent_div) => {
        let d, p, s, s1, i
        //Citizen's available actions title
        d = new DOMElement({
            tagName: "div",
            classes: "border border-gray-800 bg-gray-800 mt-1 text-xs",
            attributes: [{"key":"data-body", "value":`${this.drawing_data.id}-actions`}, {"key":"data-group", "value":`${this.drawing_data.id}-accordions`}],
            parentElement: parent_div,
            id: `${this.drawing_data.id}-actions-title`
        })
        p = new DOMElement({
            tagName: "p",
            classes: "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200",
            parentElement: d.getNode()
        })
        s = new DOMElement({
            tagName: "span",
            classes: "text-xs text-gray-200",
            attributes: [{"key":"data-i18n", "value":""}],
            parentElement: p.getNode(),
            text: translate(language, "Actions available for")
        })
        s = new DOMElement({
            tagName: "span",
            classes: "grow ms-1 text-xs text-gray-200",
            parentElement: p.getNode(),
            text: this.name.split(",")[0]
        })
        i = new DOMElement({
            tagName: "i",
            classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
            parentElement: p.getNode(),
        })

        //Citizen's available actions body
        d = new DOMElement({
            tagName: "div",
            classes: "hidden border border-gray-800 bg-gray-700 text-xs",
            parentElement: parent_div,
            id: `${this.drawing_data.id}-actions`
        })

        const build_available_actions = (d) => {
            const search_couple_action = (container) => {
                //Specific Search couple panel
                let citizen_is_old_enough = this.ageYears >= minimal_couple_age_years
                let citizen_is_single = this.couple === null
                let candidates_count = 0
                //If not so young, search couple candidates...
                if(citizen_is_old_enough && citizen_is_single){
                    colony.citizens.forEach((candidate) => {
                        let candidate_and_citizen_differents = candidate.id != this.id
                        let candidate_has_different_gender = candidate.gender != this.gender
                        let age_difference_within_limits = Math.abs(this.ageYears - candidate.ageYears) < maximal_couple_age_years_difference
                        let candidate_is_old_enough = candidate.ageYears >= minimal_couple_age_years
                        let candidate_is_single = candidate.couple === null
                        //Current citizen found is a possible candidate or simply discard him/her?
                        if(candidate_and_citizen_differents && candidate_has_different_gender && age_difference_within_limits 
                            && candidate_is_old_enough && candidate_is_single){
                            //Check consanguinity level 1 between citizen and candidate.
                            let citizen_is_parent_of_candidate = candidate.parents.includes(this.id)
                            let candidate_is_parent_of_citizen = this.parents.includes(candidate.id)
                            let have_consanguinity_1 = citizen_is_parent_of_candidate || candidate_is_parent_of_citizen
                            //Check consanguinity level 2 between citizen and candidate.
                            let citizen_and_candidate_are_siblings = this.is_sibling_of(candidate)
                            let candidate_is_citizen_s_grandchild = candidate.grandparents.includes(this.id)
                            let candidate_is_citizen_s_grandparent = this.grandparents.includes(candidate.id)
                            let have_consanguinity_2 = citizen_and_candidate_are_siblings || candidate_is_citizen_s_grandchild 
                                                    || candidate_is_citizen_s_grandparent
                            //Check consanguinity level 3 between citizen and candidate.
                            let candidate_is_uncle_of_citizen = candidate.uncles().includes(this.id)
                            let citizen_is_uncle_of_candidate = this.uncles().includes(candidate.id)
                            let candidate_and_citizen_are_cousins = this.cousins().includes(candidate.id)
                            let have_consanguinity_3 = candidate_is_uncle_of_citizen || citizen_is_uncle_of_candidate 
                                                    || candidate_and_citizen_are_cousins
                            let is_a_possible_candidate = !have_consanguinity_1 && !have_consanguinity_2 && !have_consanguinity_3
                            if(is_a_possible_candidate){
                                let h2, d, s, s1, i
                                let gender_class = candidate.gender === "Femenine" ? "fa-venus" : "fa-mars"
                                let gender_color_class = candidate.gender === "Femenine" ? "text-red-500" : "text-blue-500"
                                let age_class = `fa-${this.age_index()+1}`
                                let role_class = this.rolekey != null ? Citizen.role_icons.filter((role) => role.rolekey == this.rolekey).icon : ""
                                let xp_class = 0 <= this.xp && this.xp < 1 ? "hidden" : ""
                                h2 = new DOMElement({
                                    tagName: "h2",
                                    id: `couple-citizen-${candidate.id}`,
                                    attributes: [{"key":"data-citizen-id", "value":candidate.id}],
                                    classes: "w-100 selectable-couple",
                                    parentElement: container
                                })
                                d = new DOMElement({
                                    tagName: "div",
                                    classes: "flex items-center justify-between w-full py-1 px-2 text-xs text-gray-400 bg-gray-700 border border-gray-900 gap-3 text-gray-400",
                                    parentElement: h2.getNode()
                                })
                                s = new DOMElement({
                                    tagName: "span",
                                    parentElement: d.getNode()
                                })
                                i = new DOMElement({
                                    tagName: "i",
                                    classes: `me-1 fa ${gender_class} ${gender_color_class}`,
                                    id: `couple-citizen-${candidate.id}-gender-icon`,
                                    parentElement: s.getNode()
                                })
                                s1 = new DOMElement({
                                    tagName: "span",
                                    parentElement: s.getNode()
                                })
                                i = new DOMElement({
                                    tagName: "i",
                                    classes: `fa fa-person text-white`,
                                    id: `couple-citizen-${candidate.id}-age-icon`,
                                    parentElement: s1.getNode()
                                })
                                i = new DOMElement({
                                    tagName: "i",
                                    classes: `ms-0.5 me-1 fa ${age_class} text-white`,
                                    id: `couple-citizen-${candidate.id}-age-group-icon`,
                                    attributes: [{"key":"style", "value": "font-size:50% !important"}],
                                    parentElement: s1.getNode()
                                })
                                i = new DOMElement({
                                    tagName: "i",
                                    classes: `me-1 fa ${role_class} text-green-500`,
                                    id: `couple-citizen-${candidate.id}-role-icon`,
                                    parentElement: s1.getNode()
                                })
                                s1 = new DOMElement({
                                    tagName: "span",
                                    classes: `rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 ${xp_class} me-1`,
                                    id: `couple-citizen-${candidate.id}-xp-icon`,
                                    parentElement: s.getNode(),
                                    text: Math.floor(this.xp).toString()
                                })
                                s1 = new DOMElement({
                                    tagName: "span",
                                    classes: "ms-1",
                                    id: `couple-citizen-${candidate.id}-name`,
                                    parentElement: s.getNode(),
                                    text: candidate.name
                                })
                                s = new DOMElement({
                                    tagName: "span",
                                    parentElement: d.getNode()
                                })
                                i = new DOMElement({
                                    tagName: "i",
                                    classes: "fa fa-down me-2",
                                    id: `couple-citizen-${candidate.id}-view-attributes`,
                                    attributes: [{"key":"data-index", "value": candidate.id}],
                                    parentElement: s.getNode()
                                })
                                i.getNode().addEventListener("click", this.show_couple_attributes_event)
                                i = new DOMElement({
                                    tagName: "i",
                                    classes: "fa fa-eye me-2",
                                    id: `couple-citizen-${candidate.id}-view-info`,
                                    attributes: [{"key":"data-index", "value": candidate.id}],
                                    parentElement: s.getNode()
                                })
                                i.getNode().addEventListener("click", this.show_citizen_info_modal_event)
                                i = new DOMElement({
                                    tagName: "i",
                                    classes: "fa fa-regular fa-square",
                                    id: `couple-citizen-${candidate.id}-assign`,
                                    attributes: [{"key":"data-index", "value": candidate.id}],
                                    parentElement: s.getNode()
                                })
                                i.getNode().addEventListener("click", this.assign_couple_event)
                                candidates_count++
                            }
                        }
                    })
                }
                if(!candidates_count){
                    p = new DOMElement({
                        tagName: "p",
                        classes: "empty ms-1 text-xs flex justify-between text-gray-200",
                        parentElement: container
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
                        attributes: [{"key": "data-i18n", "value":""}],
                        parentElement: s.getNode(),
                        text: translate(language, "No candidates available")
                    })
                }
            }
            const select_role_action = (container) => {
                //Specific assign role panel
                p = new DOMElement({
                    tagName: "p", 
                    classes: "px-1 flex w-100 gap-1 justify-between items-center flex-wrap text-gray-300", 
                    parentElement: container
                })
                let current_rolekey = this.rolekey
                let button_text = "", general_role = "", button_colours = "", role_disabled = false
                Citizen.role_icons.forEach((value, index) => {
                    role_disabled = current_rolekey != null && value.key === current_rolekey
                    if(value[language][this.gender.charAt(0)]){
                        button_text = value[language][this.gender.charAt(0)]
                    } else {
                        button_text = value[language]
                    }
                    button_colours = role_disabled ? "border-gray-500 bg-gray-700 text-gray-400" : "border-green-700 bg-green-900 text-white"
                    general_role = value["EN"][this.gender.charAt(0)] ? value["EN"][this.gender.charAt(0)].replaceAll(" ","") : value["EN"].replaceAll(" ","")
                    let b = new DOMElement({
                        tagName: "button",
                        classes: `${general_role} assignableRole text-xs capitalize ${index+1 < Citizen.role_icons.length ? "grow " : ""}p-2 me-1 mb-1 button border ${button_colours}`,
                        attributes: [{"key":"data-icon", "value":value.icon}, {"key":"data-rolekey", "value":value.key}],
                        parentElement: p.getNode()
                    })
                    if(role_disabled) b.getNode().setAttribute("disabled", "disabled")
                    let i = new DOMElement({
                        tagName: "i",
                        classes: `fa fa-${value.icon} me-2`,
                        parentElement: b.getNode()
                    })
                    let s = new DOMElement({
                        tagName: "span",
                        parentElement: b.getNode(),
                        text: button_text
                    })
                })
                p.getNode().querySelectorAll("button.assignableRole").forEach(b => b.addEventListener("click", this.assign_role_event))
            }
            p = new DOMElement({
                tagName: "p",
                classes: "flex w-100 justify-between gap-2 p-1 text-gray-400",
                parentElement: d.getNode()
            })
            if(this.can_search_couple){
                //Draw "Search couple" action button.
                b = new DOMElement({
                    tagName: "button",
                    classes: "searchCouple text-xs grow p-2 button border border-gray-400 bg-gray-800",
                    id: `${this.drawing_data.id}-searchCouple-action`,
                    parentElement: p.getNode()
                })
                i = new DOMElement({
                    tagName: "i",
                    classes: "fa fa-venus-mars me-2",
                    parentElement: b.getNode()
                })
                s = new DOMElement({
                    tagName: "span",
                    attributes: [{"key":"data-i18n", "value":""}],
                    parentElement: b.getNode(),
                    text: translate(language, "Search a couple")
                })
                //Functionality for "Search couple" action
                let drawing_data_id = this.drawing_data.id
                b.getNode().addEventListener("click", function(e){
                    let objectData = {"language": language, "name": "New couple: Select a candidate", "icon": "fa fa-venus-mars", "accordionBodyId": `${drawing_data_id}-actions`, "buildContent": search_couple_action}
                    //Build select couple panel
                    colony.active_panel = new Webpanel(objectData)
                })
            }
            if(this.can_get_role_assigned){
                //Draw "Assign role" action button.
                b = new DOMElement({
                    tagName: "button",
                    classes: "assignRole text-xs grow p-2 button border border-gray-400 bg-gray-800",
                    id: `${this.drawing_data.id}-assignRole-action`,
                    parentElement: p.getNode()
                })
                let i = new DOMElement({
                    tagName: "i",
                    classes: "fa fa-handshake-simple me-2",
                    parentElement: b.getNode()
                })
                s = new DOMElement({
                    tagName: "span",
                    attributes: [{"key":"data-i18n", "value":""}],
                    parentElement: b.getNode(),
                    text: translate(language, "Assign a role")
                })
                let drawing_data_id = this.drawing_data.id
                b.getNode().addEventListener("click", function(e){
                    let objectData = {"language": language, "name": "New assignment: Select a role for the citizen", "icon": "fa fa-venus-mars", "accordionBodyId": `${drawing_data_id}-actions`, "buildContent": select_role_action}
                    //Build assign role panel
                    if(colony.active_panel) colony.active_panel.close()
                    colony.active_panel = new Webpanel(objectData)
                })
            }
            if(this.can_be_exiled){
                b = new DOMElement({
                    tagName: "button",
                    classes: "exile text-xs text-white grow p-2 button border border-gray-400 bg-red-900",
                    attributes: [{"key":"data-citizen-id", "value":this.id}],
                    id: `${this.drawing_data.id}-exile-action`,
                    parentElement: p.getNode()
                })
                i = new DOMElement({
                    tagName: "i",
                    classes: "fa fa-hand-wave me-2",
                    parentElement: b.getNode()
                })
                s = new DOMElement({
                    tagName: "span",
                    attributes: [{"key":"data-i18n", "value":""}],
                    parentElement: b.getNode(),
                    text: translate(language, "Exile citizen")
                })
                b.getNode().addEventListener("click", function(e){
                    let popup_modal = new ModalBox(e, "modalExileCitizen", b.getNode())
                    popup_modal.build("confirm_citizen_exile")
                    popup_modal.show()
                })
            }
            if(!this.can_be_exiled && !this.can_search_couple && !this.can_get_role_assigned) {
                s = new DOMElement({
                    tagName: "span",
                    classes: "text-white",
                    parentElement: p.getNode()
                })
                i = new DOMElement({
                    tagName: "i",
                    classes: "fa fa-light fa-empty-set mx-1",
                    parentElement: s.getNode()
                })
                s1 = new DOMElement({
                    tagName: "span",
                    attributes: [{"key":"data-i18n", "value":""}, {"key":"gender", "value":"f"}],
                    parentElement: s.getNode(),
                    text: translate(language, "None", "f")
                })
            }
        }
        let ga = new GenerativeAccordion({title_id: `${this.drawing_data.id}-actions-title`, callback: build_available_actions, parms: d})
    }
    undraw_relationship = (type = "couple", subtype = null) => {
        if(type === "couple"){
            document.querySelector(`#citizen-${this.id}-couple p`).innerHTML = ""
        }
    }
    //Relationships.
    //Display couple citizen attributes.
    show_couple_attributes_event = (e) => {
        let parent_h2 = e.target.closest("h2"), d, s, p, i
        if(e.target.classList.contains("fa-down")){
            let citizen_id = Number(e.target.getAttribute("data-index"))
            let citizen = colony.get_citizen_by_id(citizen_id)
            let own_attribute_1 = citizen.attributes[0]
            let own_attribute_1_class = attributes_colors["EN"][translate("EN", own_attribute_1, "", "", false)].text
            let own_attribute_2 = citizen.attributes[1]
            let own_attribute_2_class = attributes_colors["EN"][translate("EN", own_attribute_2, "", "", false)].text
            let own_attribute_3 = citizen.attributes[2]
            let own_attribute_3_class = attributes_colors["EN"][translate("EN", own_attribute_3, "", "", false)].text
            let wished_attribute_1 = citizen.wishedAttributes[0]
            let wished_attribute_1_class = attributes_colors["EN"][translate("EN", wished_attribute_1, "", "", false)].text
            let wished_attribute_2 = citizen.wishedAttributes[1]
            let wished_attribute_2_class = attributes_colors["EN"][translate("EN", wished_attribute_2, "", "", false)].text
            let wished_attribute_3 = citizen.wishedAttributes[2]
            let wished_attribute_3_class = attributes_colors["EN"][translate("EN", wished_attribute_3, "", "", false)].text
            let hated_attribute = citizen.hatedAttribute
            let hated_attribute_class = attributes_colors["EN"][translate("EN", hated_attribute, "", "", false)].text
            d = new DOMElement({
                tagName: "div",
                classes: "attributes p-1 bg-gray-600 border-s border-e border-b border-gray-800",
                parentElement: parent_h2
            })
            //Show own attributes...
            p = new DOMElement({
                tagName: "p",
                classes: "grow p-1 flex items-center gap-2",
                parentElement: d.getNode()
            })
            i = new DOMElement({
                tagName: "p",
                classes: "text-sm fa fa-circle-user",
                parentElement: p.getNode()
            })
            s = new DOMElement({
                tagName: "span",
                classes: `px-1 font-bold text-xs border border-gray-900 ${own_attribute_1_class} bg-gray-700`,
                parentElement: p.getNode(),
                text: own_attribute_1
            })
            s = new DOMElement({
                tagName: "span",
                classes: `px-1 font-bold text-xs border border-gray-900 ${own_attribute_2_class} bg-gray-700`,
                parentElement: p.getNode(),
                text: own_attribute_2
            })
            s = new DOMElement({
                tagName: "span",
                classes: `px-1 font-bold text-xs border border-gray-900 ${own_attribute_3_class} bg-gray-700`,
                parentElement: p.getNode(),
                text: own_attribute_3
            })
            //Show wished attributes...
            p = new DOMElement({
                tagName: "p",
                classes: "grow p-1 flex items-center gap-2",
                parentElement: d.getNode()
            })
            i = new DOMElement({
                tagName: "p",
                classes: "text-sm fa fa-heart",
                parentElement: p.getNode()
            })
            s = new DOMElement({
                tagName: "span",
                classes: `px-1 font-bold text-xs border border-gray-900 ${wished_attribute_1_class} bg-gray-700`,
                parentElement: p.getNode(),
                text: wished_attribute_1
            })
            s = new DOMElement({
                tagName: "span",
                classes: `px-1 font-bold text-xs border border-gray-900 ${wished_attribute_2_class} bg-gray-700`,
                parentElement: p.getNode(),
                text: wished_attribute_2
            })
            s = new DOMElement({
                tagName: "span",
                classes: `px-1 font-bold text-xs border border-gray-900 ${wished_attribute_3_class} bg-gray-700`,
                parentElement: p.getNode(),
                text: wished_attribute_3
            })
            //Show hated attribute...
            p = new DOMElement({
                tagName: "p",
                classes: "grow p-1 flex items-center gap-2",
                parentElement: d.getNode()
            })
            i = new DOMElement({
                tagName: "p",
                classes: "text-sm fa fa-ban",
                parentElement: p.getNode()
            })
            s = new DOMElement({
                tagName: "span",
                classes: `px-1 font-bold text-xs border border-gray-900 ${hated_attribute_class} bg-gray-700`,
                parentElement: p.getNode(),
                text: hated_attribute
            })
        } else {
            parent_h2.querySelector(".attributes").remove()
        }
        e.target.classList.toggle("fa-down")
        e.target.classList.toggle("fa-up")
    }
    //Display modal with couple citizen information.
    show_citizen_info_modal_event = (e) => {
        let popup_modal = new ModalBox(e, "modalCitizen")
        popup_modal.build("citizen_info")
        popup_modal.show()
    }
    //Display modal warning about inability to assign role to citizen.
    show_cannot_assign_role_modal_event = (e) => {
        let popup_modal = new ModalBox(e, "modalCannotAssignRole", e.target.closest("[data-citizen-id]"))
        popup_modal.build("cannot_assign_role")
        popup_modal.show()
    }
    //Mark chosen citizen as couple and build relationship.
    assign_couple_event = (e) => {
        var couple_id = Number(e.target.id.split("-")[2])
        //Mark assign icon.
        document.getElementById(`couple-citizen-${couple_id}-assign`).classList.remove("fa-square", "text-red-600")
        document.getElementById(`couple-citizen-${couple_id}-assign`).classList.add("text-sm", "font-bold", "text-red-600", "fa-heart")
        e.target.closest("div").classList.add("bg-blue-800", "font-bold", "text-white")
        //Selection remains on screen for half a second before disappearing.
        setTimeout(() => {
            let couple_id = Number(e.target.closest(".selectable-couple").getAttribute("data-citizen-id"))
            this.couple = colony.get_citizen_by_id(couple_id)
            this.couple.couple = this
            //Build relationship.
            let couple_relationship = colony.add_couple(this, this.couple)
            //Add couple citizens to relationships panel
            couple_relationship.draw()
            //Remove candidates panel.
            colony.active_panel.close()
        }, "500")
    }
    //Remove every couple on each member of the relationship and remove couple relationship.
    cancel_relationship_event = (e) => {
        //let couple_id = Number((e.target.closest("button") ? e.target.closest("button") : e.target).getAttribute("data-citizen-id"))
        let couple_relationship = colony.get_couple_by_members(this, this.couple)
        let couple = colony.get_citizen_by_id(this.couple.id)
        //Remove couple citizens from each other.
        this.couple = null
        couple.couple = null
        //Remove citizen couple card.
        /*
        let citizen_couple_div = e.target.closest("div:not([data-citizen-id])")
        citizen_couple_div.classList.add("px-2")
        let citizen_couple_p = e.target.closest("p")
        if(e.target.closest("h2")){ //Finish relationship from couple panel.
            e.target.closest("h2").remove()
        }
        */
        this.undraw_relationship("couple")
        //Remove couple relationship from colony relationships.
        colony.remove_couple(couple_relationship.id)
        this.draw_no_relationships()
        colony.draw_relationships()
    }
    //Assign role to citizen when clicking on assignable role button.
    assign_role_event = (e) => {
        let clicked_element = e.target.closest("button.assignableRole")
        //Check if citizen lives.
        if(this.status != "deceased"){
            //Check if citizen is idle or busy.
            if(this.status === "idle"){
                //Check previous role if exists.
                let previous_role = this.role
                //If citizen have had another role previously, change all panels in which the role is shown
                if(previous_role != "unassigned"){ 
                    //post_conditions_changing_role(previous_role, this.id) 
                }
                //Update role in Citizen's info.
                this.rolekey = clicked_element.dataset.rolekey
                this.role = Citizen.role_icons.filter(role => this.rolekey == role.key)[0]["EN"] //Always save role in english. 
                document.querySelector(`#citizen-${this.id}-role`).innerText = clicked_element.innerText //Translated role name for screen
                document.querySelector(`#citizen-${this.id}-role`).dataset.role = clicked_element.dataset.rolekey
                //Update role icon in Citizen's info.
                document.querySelector(`#citizen-${this.id}-role-icon`).classList.remove("hidden")
                document.querySelector(`#citizen-${this.id}-role-icon`).classList = "text-green-500 fa me-1 fa-" + clicked_element.dataset.icon
                colony.active_panel.close()
                //New role is "Water bearer"?
                if(["waterbearing", "fishing"].includes(this.rolekey)){
                    //Add citizen to Water Reservoir Assignable workers.
                    //add_assignable_worker_to_mount(this.id, "waterReservoir")
                    //Add behavior when clicking selecting box. Toggle color from gray to green and process efects in other panels.
                    /*
                    document.getElementById("waterReservoir-citizen-"+this.id+"-assign").addEventListener("click", 
                        //toggle_assignable_worker
                    )
                    */
                }       
                if(this.rolekey === "expeditioning"){
                    //Check if new expedition webpanel is open and close it to avoid expedition assignment inconsistencies.
                    if(colony.active_panel?.name === "New expedition") colony.activel_panel.close()
                    if(document.querySelector("#expeditions-newExpedition") != null){
                        document.getElementById(`citizen-${this.id}-assign`).dataset.class = "newExpedition"
                        //document.getElementById("citizen-"+this.id+"-assign").addEventListener("click", handleToggleWorker)
                    }
                }
            } else {
                this.show_cannot_assign_role_modal_event(e)
            }
        }
    }
    //Visually show "No relationships" paragraph on screen.
    draw_no_relationships = (type = "couple") => {
        let relationships_p = document.querySelector(`#citizen-${this.id}-${type} p`)
        relationships_p.innerHTML = ""  //Clear previous content
        //Build "None" paragraph.
        s = new DOMElement({
            tagName: "span",
            parentElement: relationships_p
        })
        i = new DOMElement({
            tagName: "i",
            classes: "fa fa-light fa-empty-set me-1",
            parentElement: s.getNode(),
        }) 
        s1 = new DOMElement({
            tagName: "span",
            parentElement: s.getNode(),
            attributes: [{"key":"data-i18n", "value":""}],
            text: translate(language, "None", "f")
        })
    }
    //Visually update particulary citizen data on screen
    redraw_citizen_xp = (new_xp) => {
        let old_xp = parseFloat(document.querySelector(`#citizen-${this.id}-xp`).innerText)
        let str_new_xp = new_xp - Math.round(new_xp) >= 0.01 ? new_xp.toFixed(2) : Math.round(new_xp).toString()
        document.querySelector(`#citizen-${this.id}-xp`).dataset.xp = str_new_xp
        //Update only if xp indicator is shown and integer part of xp has changed
        if(Math.round(new_xp) > old_xp && document.querySelector(`#citizen-${this.id}-xp`)){
            document.querySelector(`#citizen-${this.id}-xp`).innerText = new_xp.toString()
        }
    }
    //Visually update fertility on screen.
    redraw_citizen_fertility = () => {
        //Check level and add a proper colour.
        let citizen_class = this.fertility.value > 2 ? (this.fertility.value >= 10 ? (this.fertility.value >= 25 ? "text-green-500" : "text-yellow-500") : "text-orange-500") : "text-red-500"
        document.querySelectorAll(`#citizen-${this.id}-fertility`).forEach(element => {
            element.innerText = this.fertility.value
            element.classList.remove("text-green-500", "text-yellow-500", "text-orange-500", "text-red-500")
            element.classList.add(citizen_class)
        })
    }
    //Visually update a woman's fertility week on screen.
    redraw_citizen_fertility_week = () => {
        //Check level and add a proper colour.
        let month_week = colony.time_interval.get_month_week()
        let same_weeks = month_week == this.fertility.week
        //Redraw all ocurrences of month week.
        document.querySelectorAll("#month-week").forEach(element => {
            element.innerText = month_week
        })
        if(document.querySelector("#month-week:not(.relationship)")){
            if(same_weeks){
                document.querySelector("#month-week:not(.relationship)").classList.remove("text-white", "text-red-500")
                document.querySelector("#month-week:not(.relationship)").classList.add("text-green-500")
            } else {
                document.querySelector("#month-week:not(.relationship)").classList.remove("text-white", "text-green-500")
                document.querySelector("#month-week:not(.relationship)").classList.add("text-red-500")
            }
        }
        let citizen_class = same_weeks ? "text-green-500" : "text-red-500"
        document.querySelectorAll(`#citizen-${this.id}-fertility-week`).forEach(element => {
            element.innerText = this.fertility.week
            element.classList.remove("text-green-500", "text-red-500")
            element.classList.add(citizen_class)
        })
        if(document.querySelector(`#citizen-${this.id}-fertilityWeek`)){
            //Update fertility week comparison icon and color in relationship details.
            let comparison_icon = same_weeks ? "fa-equals" : "fa-not-equal"
            let fertility_class = same_weeks ? {"bg":"bg-green-600", "border": "border-gray-400", "text":"text-green-500"} : {"bg":"bg-red-800", "border": "border-gray-400", "text":"text-red-400"}
            document.querySelector(`#citizen-${this.id}-fertilityWeek`).parentElement.classList.remove("bg-green-600", "border-green-500", "text-green-500", "bg-red-800", "border-red-400", "text-red-400")
            document.querySelector(`#citizen-${this.id}-fertilityWeek`).parentElement.classList.add(fertility_class.bg, fertility_class.border)
            document.querySelector(`#citizen-${this.id}-fertilityWeek-icon`).classList.remove("fa-equals", "fa-not-equal", "text-green-500", "text-red-400")
            document.querySelector(`#citizen-${this.id}-fertilityWeek-icon`).classList.add(comparison_icon)
            document.querySelector(`#citizen-${this.id}-fertilityWeek-icon`).classList.add(fertility_class.text)
            document.querySelector(`#month-week.relationship`).parentElement.classList.remove("bg-green-600", "border-green-500", "text-green-500", "bg-red-800", "border-red-400", "text-red-400")
            document.querySelector(`#month-week.relationship`).parentElement.classList.add(fertility_class.bg, fertility_class.border)
            let fertility_situation = same_weeks ? "She's fertile this week" : "She's not fertile this week"
            document.querySelector(`#citizen-${this.id}-fertility-situation`).parentElement.classList.remove("bg-green-600", "border-green-500", "text-green-500", "bg-red-800", "border-red-400", "text-red-400")
            document.querySelector(`#citizen-${this.id}-fertility-situation`).parentElement.classList.add(fertility_class.bg, fertility_class.border)
            document.querySelector(`#citizen-${this.id}-fertility-situation`).innerText = translate(language, fertility_situation)
        }
    }
    //Visually update pregnancy remaining weeks on screen.
    redraw_citizen_pregnancy_weeks = (remaining_weeks) => {
        if(document.querySelector(`#citizen-${this.id}-pregnancy-weeks`)){
            document.querySelector(`#citizen-${this.id}-pregnancy-weeks`).innerText = remaining_weeks
        }
    }
    //Visually update citizen age year and age week on screen
    redraw_citizen_age = () => {
        document.querySelectorAll(`#citizen-${this.id}-ageYears`).forEach(element => {
            element.innerText = this.ageYears
        })
        document.querySelectorAll(`#citizen-${this.id}-ageWeeks`).forEach(element => {
            element.innerText = this.ageWeeks
        })
        //Check if age group icon needs to be updated
        let icon_current_age = this.age_index() + 1
        document.querySelectorAll(`#citizen-${this.id}-age-group-icon`).forEach(element => {
            element.classList.remove("fa-1", "fa-2", "fa-3", "fa-4", "fa-5", "fa-6")
            element.classList.add(`fa-${icon_current_age}`)
        })
    }
    //Hide pregnancy remaining weeks on screen.
    undraw_citizen_pregnancy_weeks = () => {
        document.querySelectorAll(`#citizen-${this.id}-properties .pregnant`).forEach(element => element.classList.add("hidden"))
    }
}