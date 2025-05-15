let expeditionRequiredTime = (succesfullExpeditions, horsesAssigned) => {
    //Returns the amount of ingame hours needed for an expedition.
    //It dependes on the current already succesfull expeditions done and mounted expeditionaries assigned.
    let inGameTotalHours = 2 + Math.pow(2, succesfullExpeditions + 1) / (horsesAssigned + 1)

    let inGameTotalDays = inGameTotalHours / 24
    let inGameTotalWeeks = inGameTotalDays / 7
    let inGameTotalYears = inGameTotalWeeks / 52
    let inGameClockYears = Math.floor(inGameTotalYears)
    let inGameClockWeeksD = (inGameTotalYears - inGameClockYears) * 52, inGameClockWeeks = Math.floor(inGameClockWeeksD)
    let inGameClockDaysD = (inGameClockWeeksD - inGameClockWeeks) * 7, inGameClockDays = Math.floor(inGameClockDaysD)
    let inGameClockHours = Math.floor((inGameClockDaysD - inGameClockDays) * 24)
    //let inGameClockHoursD = (inGameClockDaysD - inGameClockDays) * 24, inGameClockHours = Math.floor(inGameClockHoursD)
    //let inGameClockMinutes = Math.floor((inGameClockHoursD - inGameClockHours) * 60)
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

let resourcesExpeditionProbability = (succesfullExpeditions, expeditionaries) => {
    let probability = (expeditionaries / (expeditionaries + succesfullExpeditions + 1)).toFixed(3)
    return probability
}