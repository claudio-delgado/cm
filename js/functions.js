let expeditionRequiredTime = (expeditionType, succesfullExpeditions, horsesAssigned, maxXp = 0, avgXp = 0) => {
    //Returns the amount of ingame hours needed for an expedition.
    //It dependes on the current already succesfull expeditions done, mounted expeditionaries assigned and expeditionaries xp.
    let inGameTotalHours, inGameTotalDays, inGameTotalWeeks, inGameTotalYears
    let inGameClockYears, inGameClockWeeksD, inGameClockDaysD, inGameClockHours
    let realTotalDays, realTotalHours, realTotalMinutes, realTotalSeconds
    let realClockDays, realClockHoursD, realClockMinutesD, realClockSeconds
    if(expeditionType == "of resources"){
        let lastExpeditionsFactor = (Math.pow(2, succesfullExpeditions + 1) + 2)
        let horsesFactor = (2*horsesAssigned + 1)
        let XPFactor = maxXp / 2 + avgXp / 5
        inGameTotalHours = minimalExpeditionDuration + (lastExpeditionsFactor / (horsesFactor + XPFactor))
    } else {
        if(expeditionType == "of ruins"){
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
                "hours": inGameClockHours/*, 
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

let expeditionProbability = (expeditionType, succesfullExpeditions, expeditionaries, maxXp = 0, avgXp = 0) => {
    //Returns the probability of finding a new mount in an expedition.
    //It dependes on the current already succesfull expeditions done, the amount of expeditionaries assigned, and their xp.
    let probability, lastExpeditionsFactor, expeditionariesFactor, XPFactor, avgXPFactor
    if(expeditionType == "of resources"){
        lastExpeditionsFactor = (succesfullExpeditions + 1)
        XPFactor = (-1 / (maxXp + 1)) + 1
        avgXPFactor = (-1 / (avgXp + 1)) + 1
        let probability1stTerm = expeditionaries / (expeditionaries + lastExpeditionsFactor)
        let probability2ndTerm = ((7 / 10) - (7 * expeditionaries / (10 * expeditionaries + 10))) * XPFactor
        let probability3rdTerm = ((3 / 10) - (3 * expeditionaries / (10 * expeditionaries + 10))) * avgXPFactor
        probability = (probability1stTerm + probability2ndTerm + probability3rdTerm).toFixed(3)
    } else {
        if(expeditionType == "of ruins"){
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

let expeditionCarriageCapacity = (expeditionaryXP, mountedExpeditionary) => {
    return Math.ceil((expeditionaryXP / 10) + 1/2) + 2 * mountedExpeditionary
}

let ageIcons = (age) => {
    let ageIndex = age <= 5 ? 0 : (age <= 14 ? 1 : (age <= 21 ? 2 : (age <= 50 ? 3 : (age <= 65 ? 4 : 5))))
    return personIcons[ageIndex][language].icon
}

//Gauss normal distribution function
let gauss = (a, b, c, x) => {
    let x_minus_b_quadratic = Math.pow(x - b, 2)
    let two_times_quadratic_c = 2 * Math.pow(c, 2)
    return a * Math.pow(Math.E, -x_minus_b_quadratic / two_times_quadratic_c)
}
//Gauss for a custom domain of values for variable c (c as a function of x)
let gauss_domain_c = (a, b, x, domain = false) => {
    if(!domain) domain = [1, 4, 8, 11, 12, 14, 15, 16, 16, 18, 18, 18, 18, 18, 19, 19, 18, 18, 18, 18, 17, 16, 16, 15, 14, 13, 12, 10, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
    return gauss(a, b, domain[x], x)
}
//Gauss based function to calculate attraction percent lost or gain due to age difference (x) between 2 citizens in a relationship
let age_difference_attraction = (age_difference) => {
    if(!age_difference) return same_age_in_relationship_attraction_percent
    const threshold = 0.99
    const max_age_difference = 40
    let gauss_function_result = -Math.floor((threshold - gauss_domain_c(1, 0, age_difference)) * max_age_difference)
    gauss_function_result += (age_difference >= 35 ? 1 : 0) 
    return gauss_function_result
}
//Citizen family relationship functions
let get_citizen_parents = (a_citizen) => {
    let response = []
    if(a_citizen.father) response.push(a_citizen.father)
    if(a_citizen.mother) response.push(a_citizen.mother)
    return response
}
let get_citizen_grandparents = (a_citizen) => {
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
let get_citizen_uncles = (a_citizen) => {
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
let get_citizen_cousins = (a_citizen) => {
    let response = []
    let citizen_uncles = get_citizen_uncles(a_citizen)
    //Obtain all cousins of citizen.
    citizen_uncles.forEach((uncle_id) => { response = response.concat(citizens[uncle_id].children) })
    return response
}
let citizens_are_siblings = (a_citizen, another_citizen) => {
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