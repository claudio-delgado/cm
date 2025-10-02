
const expedition_required_time = (expeditionType, succesfullExpeditions, horsesAssigned, maxXp = 0, avgXp = 0) => {
    //Returns the amount of ingame hours needed for an expedition.
    //It dependes on the current already succesfull expeditions done, mounted expeditionaries assigned and expeditionaries xp.
    let inGameTotalHours, inGameTotalDays, inGameTotalWeeks, inGameTotalYears
    let inGameClockYears, inGameClockWeeksD, inGameClockDaysD, inGameClockHours
    let realTotalDays, realTotalHours, realTotalMinutes, realTotalSeconds
    let realClockDays, realClockHoursD, realClockMinutesD, realClockSeconds
    if(expeditionType === "of resources"){
        let lastExpeditionsFactor = (Math.pow(2, succesfullExpeditions + 1) + 2)
        let horsesFactor = (2*horsesAssigned + 1)
        let XPFactor = maxXp / 2 + avgXp / 5
        inGameTotalHours = minimalExpeditionDuration + (lastExpeditionsFactor / (horsesFactor + XPFactor))
    } else {
        if(expeditionType === "of ruins"){
            let lastExpeditionsFactor = (2 * Math.pow(succesfullExpeditions, 3) + 2 * Math.pow(succesfullExpeditions, 2) + 140 * (succesfullExpeditions + 1))
            let horsesAndXPFactor = 100 * (horsesAssigned + 1 + maxXp / 5 + avgXp / 20)
            inGameTotalHours = minimalExpeditionDuration + lastExpeditionsFactor / horsesAndXPFactor
        } else {
            return 0
        }
    }
    /*inGameTotalHours += 53 * 24 * 7 */ 
    inGameTotalDays = inGameTotalHours / 24
    inGameTotalWeeks = inGameTotalDays / 7
    inGameTotalYears = inGameTotalWeeks / 52
    inGameClockYears = Math.floor(inGameTotalYears)
    inGameClockWeeksD = (inGameTotalYears - inGameClockYears) * 52, inGameClockWeeks = Math.floor(inGameClockWeeksD)
    inGameClockDaysD = (inGameClockWeeksD - inGameClockWeeks) * 7, inGameClockDays = Math.floor(inGameClockDaysD)
    inGameClockHours = Math.floor((inGameClockDaysD - inGameClockDays) * 24)
    realTotalDays = (inGameTotalHours * 1.79) / 60 / 60 / 24
    realTotalHours = (inGameTotalHours * 1.79) / 60 / 60
    realTotalMinutes = (inGameTotalHours * 1.79) / 60
    realTotalSeconds = (inGameTotalHours * 1.79)
    realClockDays = Math.floor(realTotalDays)
    realClockHoursD = (realTotalDays - realClockDays) * 24, realClockHours = Math.floor(realClockHoursD)
    realClockMinutesD = (realClockHoursD - realClockHours) * 60, realClockMinutes = Math.floor(realClockMinutesD)
    realClockSeconds = Math.floor((realClockMinutesD - realClockMinutes) * 60)
    return {
        "inGame": {
            "totalYears": inGameTotalYears, 
            "totalWeeks": inGameTotalWeeks, 
            "totalDays": inGameTotalDays, 
            "totalHours": inGameTotalHours, 
            "clock": {
                "years": inGameClockYears, 
                "weeks": inGameClockWeeks, 
                "days": inGameClockDays, 
                "hours": inGameClockHours ? inGameClockHours : "1"/*, 
                "minutes": inGameClockMinutes*/
            }
        },
        "real": {
            "totalDays": realTotalDays,
            "totalHours": realTotalHours,
            "totalMinutes": realTotalMinutes,
            "totalSeconds": realTotalSeconds,
            "clock": {
                "days": realClockDays,
                "hours": realClockHours,
                "minutes": realClockMinutes,
                "seconds": realClockSeconds,
            }
        }
    }
}

const expedition_probability = (expeditionType, succesfullExpeditions, expeditionaries, maxXp = 0, avgXp = 0) => {
    //Returns the probability of finding a new mount in an expedition.
    //It dependes on the current already succesfull expeditions done, the amount of expeditionaries assigned, and their xp.
    let probability, lastExpeditionsFactor, expeditionariesFactor, XPFactor, avgXPFactor
    if(expeditionType === "of resources"){
        lastExpeditionsFactor = (succesfullExpeditions + 1)
        XPFactor = (-1 / (maxXp + 1)) + 1
        avgXPFactor = (-1 / (avgXp + 1)) + 1
        let probability1stTerm = expeditionaries / (expeditionaries + lastExpeditionsFactor)
        let probability2ndTerm = ((7 / 10) - (7 * expeditionaries / (10 * expeditionaries + 10))) * XPFactor
        let probability3rdTerm = ((3 / 10) - (3 * expeditionaries / (10 * expeditionaries + 10))) * avgXPFactor
        probability = (probability1stTerm + probability2ndTerm + probability3rdTerm).toFixed(3)
    } else {
        if(expeditionType === "of ruins"){
            lastExpeditionsFactor = 1 / (succesfullExpeditions + 3)
            expeditionariesFactor = (2 * (expeditionaries - 1)) / (10 * expeditionaries + 20)
            XPFactor = (4 * maxXp) / (10 * maxXp + 20)
            avgXPFactor = avgXp / (10 * avgXp + 20)
            probability = lastExpeditionsFactor + expeditionariesFactor + XPFactor + avgXPFactor
        } else {
            return 0
        }
    }
    return probability
}

const expedition_carriage_capacity = (expeditionaryXP, mountedExpeditionary) => {
    return Math.ceil((expeditionaryXP / 10) + 1/2) + 2 * mountedExpeditionary
}
const age_index = (age) => age <= 5 ? 0 : (age <= 14 ? 1 : (age <= 21 ? 2 : (age <= 50 ? 3 : (age <= 65 ? 4 : 5))))
const age_icons = (age) => person_icons[age_index(age)].icon
const age_group = (age) => age_groups[age_index(age)]["EN"].icon

//Colony information functions
const colony_satisfaction = (lifeQuality, population) => {
    let satisfaction = {}
    if(lifeQuality >= population){
        if(lifeQuality >= 1.5 * population){
            if(lifeQuality >= 2 * population){
                satisfaction.word = "Extreme happiness"
                satisfaction.icon = "fa-face-laugh-squint" 
                satisfaction.color = "bg-green-500"
            } else { 
                satisfaction.word = "Happiness" 
                satisfaction.icon = "fa-face-laugh" 
                satisfaction.color = "bg-green-600"
            }
        } else {
            satisfaction.word = "Satisfaction"
            satisfaction.icon = "fa-face-smile"
            satisfaction.color = "bg-green-700"
        }
    } else {
        if(lifeQuality <= 0.5 * population){ 
            satisfaction.word = "Dissapointment"
            satisfaction.icon = "fa-face-weary"
            satisfaction.color = "bg-red-800"
        } else { 
            satisfaction.word = "Dissatisfaction"
            satisfaction.icon = "fa-face-meh"
            satisfaction.color = "bg-yellow-600"
        }
    }
    return satisfaction
}
const shelter_capacity_mood = (shelter_capacity, population) => {
    let satisfaction = {}
    let occupation = Math.round((population / shelter_capacity) * 100)
    satisfaction.occupation = occupation
    if(occupation < 95){
        if(occupation <= 75){
            if(occupation <= 50){
                satisfaction.word = "Extreme happiness"
                satisfaction.icon = "fa-face-laugh-squint" 
                satisfaction.color = "bg-green-500"
            } else { 
                satisfaction.word = "Happiness" 
                satisfaction.icon = "fa-face-laugh" 
                satisfaction.color = "bg-green-600"
            }
        } else {
            satisfaction.word = "Satisfaction"
            satisfaction.icon = "fa-face-smile"
            satisfaction.color = "bg-green-700"
        }
    } else {
        if(occupation <= 100){
            satisfaction.word = "Worry"
            satisfaction.icon = "fa-face-meh"
            satisfaction.color = "bg-yellow-600"
        } else {
            if(occupation < 120){ 
                satisfaction.word = "Dissatisfaction"
                satisfaction.icon = "fa-face-frown"
                satisfaction.color = "bg-yellow-700"
            } else {
                satisfaction.word = "Dissapointment"
                satisfaction.icon = "fa-face-weary"
                satisfaction.color = "bg-red-800"
            }
        }
    }
    return satisfaction
}
const oppression_mood = (oppresion) => {
    let satisfaction = {}
    if(oppresion > 0){
        satisfaction.word = "Dissatisfaction"
        satisfaction.icon = "fa-face-meh"
        satisfaction.color = "bg-red-800"
    } else {
        satisfaction.word = "Satisfaction"
        satisfaction.icon = "fa-face-smile"
        satisfaction.color = "bg-green-700"
    }
    return satisfaction
}
const get_shelter_capacity = () => {
    let shelter_capacity = 0
    Object.keys(buildings.shelter_related).forEach(shelter => {
        buildings.shelter_related[shelter].building_list.forEach(building => {
           shelter_capacity += building.capacity*1
        })
    })
    return shelter_capacity
}
//Resources and products functions
const get_good_category = (good) => {
    let category = false
    try{
        Object.keys(categorized_goods.resources.subcategories).forEach((subcategory) => {
            if(categorized_goods.resources.subcategories[subcategory].EN.includes(good) || categorized_goods.resources.subcategories[subcategory].ES.includes(good)){
                category = "resources"
                throw new Error("Category found")
            }
        })
        if(!category){
            Object.keys(categorized_goods.products.subcategories).forEach((subcategory) => {
                if(categorized_goods.products.subcategories[subcategory].EN.includes(good) || categorized_goods.products.subcategories[subcategory].ES.includes(good)){
                    category = "products"
                    throw new Error("Category found")
                }
            })
        }
    } catch(error){
        if(error.message === "Category found") return category
    }
}

//Gauss normal distribution function
const gauss = (a, b, c, x) => {
    let x_minus_b_quadratic = Math.pow(x - b, 2)
    let two_times_quadratic_c = 2 * Math.pow(c, 2)
    return a * Math.pow(Math.E, -x_minus_b_quadratic / two_times_quadratic_c)
}
//Gauss for a custom domain of values for variable c (c as a function of x)
const gauss_domain_c = (a, b, x, domain = false) => {
    if(!domain) domain = [1, 4, 8, 11, 12, 14, 15, 16, 16, 18, 18, 18, 18, 18, 19, 19, 18, 18, 18, 18, 17, 16, 16, 15, 14, 13, 12, 10, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
    return gauss(a, b, domain[x], x)
}
//Gauss based function to calculate attraction percent lost or gain due to age difference (x) between 2 citizens in a relationship
const age_difference_attraction = (age_difference) => {
    if(!age_difference) return same_age_in_relationship_attraction_percent
    const threshold = 0.99
    const max_age_difference = 40
    let gauss_function_result = -Math.floor((threshold - gauss_domain_c(1, 0, age_difference)) * max_age_difference)
    gauss_function_result += (age_difference >= 35 ? 1 : 0) 
    return gauss_function_result
}
//Citizen family relationship functions
const get_citizen_parents = (a_citizen) => {
    let response = []
    if(a_citizen.father) response.push(a_citizen.father)
    if(a_citizen.mother) response.push(a_citizen.mother)
    return response
}
const get_citizen_grandparents = (a_citizen) => {
    let response = []
    if(a_citizen.father && citizens[a_citizen.father]){
        if(citizens[a_citizen.father].father) response.push(citizens[a_citizen.father].father)
        if(citizens[a_citizen.father].mother) response.push(citizens[a_citizen.father].mother)
    } 
    if(a_citizen.mother && citizens[a_citizen.mother]){
        if(citizens[a_citizen.mother].father) response.push(citizens[a_citizen.mother].father)
        if(citizens[a_citizen.mother].mother) response.push(citizens[a_citizen.mother].mother)
    } 
    return response
}
const get_citizen_uncles = (a_citizen) => {
    let response = []
    //Check uncles by father
    if(a_citizen.father && citizens[a_citizen.father]){
        //Uncles by father's father
        let citizen_father = citizens[a_citizen.father]
        if(citizen_father.father){
            response = response.concat(citizens[citizen_father.father].children.filter((citizen_id) => citizen_id != a_citizen.father))
        }
        //Uncles by father's mother
        if(citizens[a_citizen.father].mother){
            response = response.concat(citizens[citizen_father.mother].children.filter((citizen_id) => citizen_id != a_citizen.father))
        }
    }
    //Check uncles by mother
    if(a_citizen.mother && citizens[a_citizen.mother]){
        //Uncles by mother's father
        let citizen_mother = citizens[a_citizen.mother]
        if(citizen_mother.father){
            response = response.concat(citizens[citizen_mother.father].children.filter((citizen_id) => citizen_id != a_citizen.mother))
        }
        //Uncles by mother's mother
        if(citizen_mother.mother){
            response = response.concat(citizens[citizen_mother.mother].children.filter((citizen_id) => citizen_id != a_citizen.mother))
        }
    }
    return response
}
const get_citizen_cousins = (a_citizen) => {
    let response = []
    let citizen_uncles = get_citizen_uncles(a_citizen)
    //Obtain all cousins of citizen.
    citizen_uncles.forEach((uncle_id) => { response = response.concat(citizens[uncle_id].children) })
    return response
}
const citizens_are_siblings = (a_citizen, another_citizen) => {
    //Check citizen's father branch
    let a_citizen_father_s_children = a_citizen.father && citizens[a_citizen.father] ? citizens[a_citizen.father].children : []
    let a_citizen_siblings_by_father = a_citizen_father_s_children.filter((citizen_id) => citizen_id != a_citizen.id)
    let a_citizen_and_another_are_siblings_by_father = a_citizen_siblings_by_father.includes(another_citizen.id)
    //Check citizen's mother branch
    let a_citizen_mother_s_children = a_citizen.mother && citizens[a_citizen.mother] ? citizens[a_citizen.mother].children : []
    let a_citizen_siblings_by_mother = a_citizen_mother_s_children.filter((citizen_id) => citizen_id != a_citizen.id)
    let a_citizen_and_another_are_siblings_by_mother = a_citizen_siblings_by_mother.includes(another_citizen.id)
    return a_citizen_and_another_are_siblings_by_father || a_citizen_and_another_are_siblings_by_mother
}
//Citizen pregnancy
//Calculate randomly how many babies will be born after a pregnancy, based on the sum of fertility levels of the parents.
const pregnancy_amount_of_babies = (fertility_sum) => {
    let random_value = Math.random()
    if(fertility_sum >= 150){
        return random_value <= 0.45 ? 1 : (random_value <= 0.45 + 0.33 ? 2 : 3)
    }
    if(120 <= fertility_sum && fertility_sum < 150){
        return random_value <= 0.52 ? 1 : (random_value <= 0.52 + 0.3 ? 2 : 3)
    }
    if(90 <= fertility_sum && fertility_sum < 120){
        return random_value <= 0.6 ? 1 : (random_value <= 0.6 + 0.25 ? 2 : 3)
    }
    if(50 <= fertility_sum && fertility_sum < 90){
        return random_value <= 0.7 ? 1 : (random_value <= 0.7 + 0.2 ? 2 : 3)
    }
    if(25 <= fertility_sum && fertility_sum < 50){
        return random_value <= 0.8 ? 1 : (random_value <= 0.8 + 0.13 ? 2 : 3)
    }
    if(fertility_sum < 25){
        return random_value <= 0.9 ? 1 : (random_value <= 0.9 + 0.07 ? 2 : 3)
    }
}

//Building parts or products coeficients.
const age_group_by_birthweeks = (birthWeeks) => {
    let result = ""
    Object.keys(age_week_limits).forEach((group) => {
        result = age_week_limits[group].min <= birthWeeks && birthWeeks <= age_week_limits[group].max ? group : result
    })
    return result
}
const age_coeficient = (a_citizen) => {
    let age_group = age_group_by_birthweeks(a_citizen.birthWeeks)
    return ["adult"].includes(age_group) ? 1 :(["teen", "grown adult"].includes(age_group) ? 0.5 :((["child", "ancient"].includes(age_group) ? 0.2 : 0)))
}
const log_base = (base, x) => {
    return Math.log(x) / Math.log(base)
}
const xp_coeficient = (a_citizen) => {
    return 1 + ((3/2) * log_base(3/2, a_citizen.xp + 1)) / 10
}
const attributes_coeficient = (a_citizen) => {
    let strong_citizen = a_citizen.attributes.includes(translate(language, "strength"))
    let dexterous_citizen = a_citizen.attributes.includes(translate(language, "dexterity"))
    let agile_citizen = a_citizen.attributes.includes(translate(language, "agility"))
    let smart_citizen = a_citizen.attributes.includes(translate(language, "intelligence"))
    let cunning_citizen = a_citizen.attributes.includes(translate(language, "cunning"))
    return strong_citizen ? 1.5 : (dexterous_citizen ? 1.4 : (agile_citizen ? 1.2 : (smart_citizen || cunning_citizen ? 1.1 : 1)))
}
//Coeficient that measures the quantity of building parts produced
const construction_coeficient = (citizens_array) => {
    let result = 0
    citizens_array.forEach((loop_citizen) => {
        result += age_coeficient(loop_citizen) * xp_coeficient(loop_citizen) * attributes_coeficient(loop_citizen)
    })
    return result
}
//Coeficient that measures the duration of a production rule in order to produce the result
const construction_duration = (citizens_array, base_duration_in_hours) => {
    let denominator = 0
    citizens_array.forEach((loop_citizen) => {
        denominator += age_coeficient(loop_citizen)
    })
    return base_duration_in_hours / (denominator ? denominator : 1)
}
//Displayed time/date functions
//Minimal date expression based on hours
const minimal_date_expression = (hours) => {
    let expression = ""
    hours = Math.floor(hours)
    if(hours >= 24 * 7 * 52){ //hours expression is more than a year.
        let years_dec = hours / (24 * 7 * 52)
        let years = Math.floor(years_dec) 
        expression = `${years} ${translate(language, (years == 1 ? "year" : "years"), "", "lowercase")}`
        //Remaining hours
        hours -= years * (24 * 7 * 52)
    }
    if(hours >= 24 * 7){ //hours expression is more than a week.
        let weeks_dec = hours / (24 * 7)
        let weeks = Math.floor(weeks_dec)
        expression += `${expression ? ", " : ""}${weeks} ${translate(language, (weeks == 1 ? "week" : "weeks"), "", "lowercase")}`
        //Remaining hours
        hours -= weeks * (24 * 7)
    }
    if(hours >= 24){ //hours expression is more than a day.
        let days_dec = hours / 24
        let days = Math.floor(days_dec)
        expression += `${expression ? ", " : ""}${days} ${translate(language, (days == 1 ? "day" : "days"), "", "lowercase")}`
        //Remaining hours
        hours -= days * 24
    }
    if(hours){ //hours expression is less than a day.
        expression += `${expression ? ", " : ""}${hours} ${translate(language, (hours == 1 ? "hour" : "hours"), "", "lowercase")}`
    }
    return expression
}
const format_countdown_date_expression = (date_expression, object = false, index = false) => {
    let main_span = document.createElement("span")
    main_span.classList.add("countdownTime")
    //Decompose date_expression
    let date_expression_array = date_expression.split(", ")
    date_expression_array.forEach((date_token, token_index) => {
        main_span.innerHTML += (token_index ? ", " : "")
        let date_token_array = date_token.split(" ")
        let token_unit = date_token_array[1].slice(-1) != "s" ? date_token_array[1]+"s" : date_token_array[1]
        //Date token value
        let token_value_span = document.createElement("span")
        token_value_span.classList.add("countdown")
        token_value_span.classList.add(translate("EN", token_unit, "", "lowercase", false))
        token_value_span.innerHTML = date_token_array[0]
        //Date token unit
        let token_unit_span = document.createElement("span")
        token_unit_span.classList.add("ms-1")
        token_unit_span.setAttribute("data-i18n", "")
        token_unit_span.id = (object && index) ? object + "-" + index + "-pending-" + token_unit+"Text" : ""
        token_unit_span.innerHTML = date_token_array[1]
        main_span.appendChild(token_value_span)
        main_span.appendChild(token_unit_span)
    })
    return main_span
}
const get_score_bonus = (game_event) => {
    return score_bonus[game_event]
}
//Order object keys.
const order_keys = (unordered, order = "ASC") => {
    // Sorting the object by keys
    //In ascending way
    if(order === "ASC"){
        const ordered = Object.keys(unordered)
            .sort() // Sort the keys alphabetically
            .reduce((obj, key) => {
                obj[key] = unordered[key]; // Rebuild the object with sorted keys
                return obj;
            }, {});
        return (ordered)
    } else { //In desscending way
        const ordered = Object.keys(unordered)
            .sort((a, b) => unordered[b] - unordered[a]).map(function(key) { 
                return [key, unordered[key]]; 
            });
        return (ordered)
    }
}

function getLocalStorageUsedSpaceKB() {
  let totalBytes = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      // Keys and values both contribute to storage space
      totalBytes += (key.length + localStorage[key].length) * 2; 
    }
  }
  return (totalBytes / 1024).toFixed(2); // Convert to KB and format
}