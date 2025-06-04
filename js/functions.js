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