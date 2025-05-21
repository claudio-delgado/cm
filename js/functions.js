let expeditionRequiredTime = (succesfullExpeditions, horsesAssigned, maxXp = 0, avgXp = 0) => {
    //Returns the amount of ingame hours needed for an expedition.
    //It dependes on the current already succesfull expeditions done, mounted expeditionaries assigned and expeditionaries xp.
    let lastExpeditionsFactor = (Math.pow(2, succesfullExpeditions + 1) + 2)
    let horsesFactor = (2*horsesAssigned + 1)
    let XPFactor = maxXp / 2 + avgXp / 5
    let inGameTotalHours = 2 + (lastExpeditionsFactor / (horsesFactor + XPFactor))
    /*inGameTotalHours += 53 * 24 * 7 */ 
    let inGameTotalDays = inGameTotalHours / 24
    let inGameTotalWeeks = inGameTotalDays / 7
    let inGameTotalYears = inGameTotalWeeks / 52
    let inGameClockYears = Math.floor(inGameTotalYears)
    let inGameClockWeeksD = (inGameTotalYears - inGameClockYears) * 52, inGameClockWeeks = Math.floor(inGameClockWeeksD)
    let inGameClockDaysD = (inGameClockWeeksD - inGameClockWeeks) * 7, inGameClockDays = Math.floor(inGameClockDaysD)
    let inGameClockHours = Math.floor((inGameClockDaysD - inGameClockDays) * 24)
    let realTotalDays = (inGameTotalHours * 1.79) / 60 / 60 / 24
    let realTotalHours = (inGameTotalHours * 1.79) / 60 / 60
    let realTotalMinutes = (inGameTotalHours * 1.79) / 60
    let realTotalSeconds = (inGameTotalHours * 1.79)
    let realClockDays = Math.floor(realTotalDays)
    let realClockHoursD = (realTotalDays - realClockDays) * 24, realClockHours = Math.floor(realClockHoursD)
    let realClockMinutesD = (realClockHoursD - realClockHours) * 60, realClockMinutes = Math.floor(realClockMinutesD)
    let realClockSeconds = Math.floor((realClockMinutesD - realClockMinutes) * 60)
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

let resourcesExpeditionProbability = (succesfullExpeditions, expeditionaries, maxXp = 0, avgXp = 0) => {
    //Returns the probability of finding a new mount in an expedition.
    //It dependes on the current already succesfull expeditions done, the amount of expeditionaries assigned, and their xp.
    let lastExpeditionsFactor = (succesfullExpeditions + 1)
    let XPFactor = (-1 / (maxXp + 1)) + 1
    let avgXPFactor = (-1 / (avgXp + 1)) + 1
    let probability1stTerm = expeditionaries / (expeditionaries + lastExpeditionsFactor)
    let probability2ndTerm = ((7 / 10) - (7 * expeditionaries / (10 * expeditionaries + 10))) * XPFactor
    let probability3rdTerm = ((3 / 10) - (3 * expeditionaries / (10 * expeditionaries + 10))) * avgXPFactor
    let probability = (probability1stTerm + probability2ndTerm + probability3rdTerm).toFixed(3)
    return probability
}