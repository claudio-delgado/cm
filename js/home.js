//See init.js to check global variables and constants.

let initColonyInfo = () => {
    language = "ES", colonyScore = 0, colonyLifeQuality = 10
    citizensAmount = 10, citizensFemaleAmount = 5, citizensMaleAmount = 5
    daysPassed = 0, dayPassed = false, weekPassed = false
    wagonsAmount = 3, horsesAmount = 6
    //colony_water_reservoir = water_reservoirs[Math.floor(Math.random() * water_reservoirs.length)].name
    colony_water_reservoir = Object.keys(water_reservoirs)[Math.floor(Math.random() * Object.keys(water_reservoirs).length)]
}
let loadInitialRandomGoods = () => {
    stockValues.resources["EN"]["stone"]+= 800 + Math.floor(Math.random() * (1000 - 800))
    stockValues.resources["ES"][translate(language, "stone")] = stockValues.resources["EN"]["stone"]
    stockValues.resources["EN"]["gravel"]+= 800 + Math.floor(Math.random() * (1000 - 800))
    stockValues.resources["ES"][translate(language, "gravel")] = stockValues.resources["EN"]["gravel"]
    stockValues.resources["EN"]["clay"]+= 800 + Math.floor(Math.random() * (1000 - 800))
    stockValues.resources["ES"][translate(language, "clay")] = stockValues.resources["EN"]["clay"]
    stockValues.products["EN"]["wooden plank"]+= 1000 + Math.floor(Math.random() * (1200 - 1000))
    stockValues.products["ES"][translate(language, "wooden plank")] = stockValues.products["EN"]["wooden plank"]
    stockValues.products["EN"]["wooden plate"]+= 20 + Math.floor(Math.random() * (50 - 20))
    stockValues.products["ES"][translate(language, "wooden plate")] = stockValues.products["EN"]["wooden plate"]
    stockValues.products["EN"]["roof tile"]+= 400 + Math.floor(Math.random() * (800 - 400))
    stockValues.products["ES"][translate(language, "roof tile")] = stockValues.products["EN"]["roof tile"]
    stockValues.products["EN"]["brick"]+= 500 + Math.floor(Math.random() * (900 - 500))
    stockValues.products["ES"][translate(language, "brick")] = stockValues.products["EN"]["brick"]
    stockValues.products["EN"]["rag"]+= 600 + Math.floor(Math.random() * (800 - 600))
    stockValues.products["ES"][translate(language, "rag")] = stockValues.products["EN"]["rag"]
    stockValues.products["EN"]["hay"]+= 400 + Math.floor(Math.random() * (600 - 400))
    stockValues.products["ES"][translate(language, "hay")] = stockValues.products["EN"]["hay"]
    stockDisplayed = JSON.parse(JSON.stringify(stockValues))
}
let colonySatisfaction = (lifeQuality, population) => {
    let satisfaction = {}
    if(lifeQuality >= population){
        if(lifeQuality >= 1.5 * population){
            if(lifeQuality >= 2 * population){
                satisfaction.word = "Extreme happiness"
                satisfaction.icon = "face-laugh-squint" 
                satisfaction.color = "text-green-400"
            } else { 
                satisfaction.word = "Happiness" 
                satisfaction.icon = "face-laugh" 
                satisfaction.color = "text-green-400"
            }
        } else {
            satisfaction.word = "Satisfaction"
            satisfaction.icon = "face-smile"
            satisfaction.color = "text-green-400"
        }
    } else {
        if(lifeQuality <= 0.5 * population){ 
            satisfaction.word = "Dissapointment"
            satisfaction.icon = "face-weary"
            satisfaction.color = "text-red-400"
        } else { 
            satisfaction.word = "Dissatisfaction"
            satisfaction.icon = "face-meh"
            satisfaction.color = "text-yellow-400"
        }
    }
    return satisfaction
}
let searchZone = (e) => {
    document.querySelector("#searchZone > span").innerText = translate(language, "Your citizens are searching the zone...")
    document.querySelector("#searchZone > i").classList.add("fa-beat")
    searchingZone = true
    e.target.removeEventListener("click", searchZone)
}

let lifeInterval = setInterval(() => {
    if(lifeStarted || searchingZone){
        //Update hours.
        let currentHour = Number(document.querySelector("#currentHour").innerText)
        currentHour = ((currentHour < 23 ? currentHour+1 : 0)+"").padStart(2, "0")
        document.querySelector("#currentHour").innerText = currentHour
        //Daily flag
        dayPassed = (currentHour == "00")
        //Update days.
        daysPassed+= (dayPassed ? 1 : 0)
        let currentDay = Number(document.querySelector("#currentDay").innerText)
        currentDay = 1 + (daysPassed % 7)
        document.querySelector("#currentDay").innerText = currentDay
        //Update weeks.
        let currentWeek = Number(document.querySelector("#currentWeek").innerText)
        currentWeek = 1 + (Math.floor(daysPassed / 7) % 52)
        //Weekly flag
        weekPassed = dayPassed && Math.floor(daysPassed / 7) == daysPassed / 7
        document.querySelector("#currentWeek").innerText = currentWeek
        document.querySelector("#passedWeeks").innerText = Math.floor(daysPassed / 7)
        //Update years.
        let currentYear = Number(document.querySelector("#currentYear").innerText)
        currentYear = 1 + Math.floor(daysPassed / 364)
        document.querySelector("#currentYear").innerText = currentYear
        //Zone searched flag
        zoneSearched = currentYear == 1 && currentWeek == 1 && currentDay == 1 && currentHour == zoneSearchHoursNeeded
        //Perform updating tasks inside game panels that involve hourly changes
        //Process countdowns
        processCountdowns()
        //Perform updating tasks inside game panels that involve daily changes
        //Efectuar tareas de actualización de partes del juego que involucren avances diarios.
        //console.log("y"+currentYear+"w"+currentWeek+"d"+currentDay+"h"+currentHour+", daysPassed: "+daysPassed+" dayPassed: "+dayPassed+", weekPassed: "+weekPassed)
        if(zoneSearched){
            searchingZone = false
            lifeStarted = true
            //Remove search zone button from Colony's available actions
            document.querySelector("#colony-actions > p > button").remove()
            s = new element("span", "", [{"key":"data-i18n", "value":""}], document.querySelector("#colony-actions > p")); s.create(); s.appendContent(translate(language, "No actions available"))
            //Remove warnings
            document.querySelectorAll("#searchZoneWarning").forEach((element) => { element.remove() })
            //Update initial stock
            loadInitialRandomGoods()
            //Update initial shelter capacity
            buildings.shelter["campaign tent"] = 5
            s1 = document.querySelector("#colonyShelterCapacityInfo")
            s1.classList.remove("text-red-400")
            s1.classList.add("text-green-400")
            document.querySelector("#shelterCapacityIcon").remove()
            document.querySelector("#colonyShelterCapacity").innerHTML = shelterCapacities["campaign tent"] * buildings.shelter["campaign tent"]
            s1.innerHTML+= " ("
            s2 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s1); s2.create(); s2.appendContent("Occupation")
            s2 = new element("span", "font-bold", [], s1, "colonyShelterOccupation"); s2.create(); s2.appendContent("67%")
            s1.innerHTML+= ")"
            i = new element("i", "ms-1 fa fa-face-smile", [], s1, "shelterCapacityIcon"); i.create()
            //Update initial buildings
            updateColony()
            if(showModalZoneSearched) { 
                modalPopup("Zone researched!", "ZoneSearched") 
                modal.show()
            }
            //Update all water bearers and fishermen status (from "assigned" to "working")
            document.querySelectorAll('[data-status="assigned"]').forEach((citizenStatus) => {
                let citizenIndex = citizenStatus.id.split("-")[1]
                if(["waterbearing", "fishing"].includes(document.getElementById("citizen-"+citizenIndex+"-role").getAttribute("data-role"))){
                    citizenStatus.innerHTML = translate(language, "Working")
                }
            })
            //Update possible actions blocked by not having searched the zone previously.
            if(document.querySelectorAll(".newExpedition .assignedWorkers .assignedWorker").length){
                //If there were expeditionaries assigned to an expedition, add button to start it.
                document.getElementById("newExpeditionNoActions").classList.add("hidden")
                document.querySelector("#expeditionStart").classList.remove("hidden")
            }
        }
        if(dayPassed){
            //Update citizens xp
            //Update permanently assigned water bearers or fishermen
            document.querySelectorAll('.citizen-properties [data-role="waterbearing"], .citizen-properties [data-role="fishing"]').forEach((citizen) => {
                let citizenIndex = citizen.id.split("-")[1]
                //Only update xp when waterbearer/fishermen is currently working (at the water reservoir)
                if(document.querySelector("#citizen-"+citizenIndex+"-status").getAttribute("data-status") == "working"){
                    let newXP = 1*document.querySelector("#citizen-"+citizenIndex+"-xp").getAttribute("data-xp") + (1/30)
                    document.querySelectorAll("#citizen-"+citizenIndex+"-xp, #citizen-"+citizenIndex+"-xp-icon").forEach((elem) => {
                        elem.setAttribute("data-xp", newXP.toFixed(5))
                        elem.innerText = Math.floor(newXP)
                        if(elem.innerText > 0 && elem.classList.contains("hidden")){
                            elem.classList.remove("hidden")
                        }
                    })
                }
            })
            //Update resource extractions
            let dailyWaterGained = document.querySelector("#colony-water-income").innerText * 1 - document.querySelector("#colony-water-consumption").innerText * 1
            document.querySelectorAll("#colony-water-stock").forEach((value) => {
                value.innerText = value.innerText * 1 + (dailyWaterGained)
            })
            let dailyFoodGained = document.querySelector("#colony-food-income").innerText * 1 - document.querySelector("#colony-food-consumption").innerText * 1
            document.querySelectorAll("#colony-food-stock").forEach((value) => {
                value.innerText = value.innerText * 1 + (dailyFoodGained)
            })
            //Update productions
        }
        if(weekPassed){
            //Update citizens age
            document.querySelectorAll("#accordion-citizens .citizen-properties").forEach((value) => {
                let citizenYearsAge = document.querySelector("#citizen-"+value.dataset.index+"-ageYears")
                let citizenWeeksAge = document.querySelector("#citizen-"+value.dataset.index+"-ageWeeks")
                let previousAge = citizenYearsAge.innerText*1
                let iconPreviousAge = ageIcons(previousAge)
                citizenWeeksAge.innerText = (citizenWeeksAge.innerText*1 + 1) % 52
                citizenYearsAge.innerText = citizenYearsAge.innerText*1 + (citizenWeeksAge.innerText*1 == 0 ? 1 : 0)
                let iconCurrentAge = ageIcons(citizenYearsAge.innerText)
                //Check if age icons must change...
                if(iconPreviousAge != iconCurrentAge){
                    document.querySelectorAll("#citizen-"+citizenIndex+"-age-icon").forEach((elem) => {
                        elem.classList.remove(iconPreviousAge)
                        elem.classList.add(iconCurrentAge)
                    })
                }
            })
        }
        //clearInterval(lifeInterval)
    }
}, 1790);

let processCountdowns = () => {
    let hours, days, weeks, years
    document.querySelectorAll(".countdownTime").forEach((elem) => {
        let idArray = elem.querySelector("span:first-child").id.split("-")
        let prefix = idArray[0]+"-"+idArray[1]+"-"+idArray[2]
        //Correct unit numbers (singulars and plurals) before processing values
        hours = 1*elem.querySelector(".countdown.hours").innerText
        elem.querySelector("#"+prefix+"-hoursText").innerText = hours == 1 ? "h" : "hs"
        days = 1*elem.querySelector(".countdown.days").innerText
        elem.querySelector("#"+prefix+"-daysText").innerText = days == 1 ? translate(language, "days").slice(0, -1) : translate(language, "days")
        if(days){
            elem.querySelector("#"+prefix+"-days").classList.remove("hidden")
            elem.querySelector("#"+prefix+"-daysText").classList.remove("hidden")
        } else {
            elem.querySelector("#"+prefix+"-days").classList.add("hidden")
            elem.querySelector("#"+prefix+"-daysText").classList.add("hidden")
        }
        weeks = 1*elem.querySelector(".countdown.weeks").innerText
        elem.querySelector("#"+prefix+"-weeksText").innerText = weeks == 1 ? translate(language, "weeks").slice(0, -2)+"." : translate(language, "weeks")
        if(weeks){
            elem.querySelector("#"+prefix+"-weeks").classList.remove("hidden")
            elem.querySelector("#"+prefix+"-weeksText").classList.remove("hidden")
        } else {
            elem.querySelector("#"+prefix+"-weeks").classList.add("hidden")
            elem.querySelector("#"+prefix+"-weeksText").classList.add("hidden")
        }
        years = 1*elem.querySelector(".countdown.years").innerText
        elem.querySelector("#"+prefix+"-yearsText").innerText = years == 1 ? translate(language, "years").slice(0, -1) : translate(language, "years")
        if(years){
            elem.querySelector("#"+prefix+"-years").classList.remove("hidden")
            elem.querySelector("#"+prefix+"-yearsText").classList.remove("hidden")
        } else {
            elem.querySelector("#"+prefix+"-years").classList.add("hidden")
            elem.querySelector("#"+prefix+"-yearsText").classList.add("hidden")
        }
        //If hours > 0 => decrement them
        if(1*elem.querySelector(".countdown.hours").innerText){
            //Decrement pending hours
            hours = 1*elem.querySelector(".countdown.hours").innerText - 1
            elem.querySelector(".countdown.hours").innerText = hours.toString().padStart(2, "0")
            //Arrange unit number: singular or plural
            elem.querySelector("#"+prefix+"-hoursText").innerText = hours == 1 ? "h" : "hs"
        } else {
            //hours == 00
            //If days > 0 => decrement them
            if(1*elem.querySelector(".countdown.days").innerText){
                //Decrement pending days
                days = 1*elem.querySelector(".countdown.days").innerText - 1
                elem.querySelector(".countdown.days").innerText = days.toString()
                //Hide days if they are 0 and both weeks and years are hidden
                if(!days && elem.querySelector(".countdown.weeks").classList.contains("hidden")
                        && elem.querySelector(".countdown.years").classList.contains("hidden")){
                    elem.querySelector("#"+prefix+"-days").classList.add("hidden")
                    elem.querySelector("#"+prefix+"-daysText").classList.add("hidden")
                }
                //Set hours to max value - 1 => hours = 23
                hours = "23"
                elem.querySelector(".countdown.hours").innerText = hours
                //Arrange unit number: singular or plural
                elem.querySelector("#"+prefix+"-daysText").innerText = days == 1 ? translate(language, "days").slice(0, -1) : translate(language, "days")
            } else {
                //days == 0 & hours == 00
                //If weeks > 0 => decrement them
                if(1*elem.querySelector(".countdown.weeks").innerText){
                    //Decrement pending weeks
                    weeks = 1*elem.querySelector(".countdown.weeks").innerText - 1
                    elem.querySelector(".countdown.weeks").innerText = weeks.toString()
                    //Hide weeks if they are 0 and years is hidden
                    if(!weeks && elem.querySelector(".countdown.years").classList.contains("hidden")){
                        elem.querySelector("#"+prefix+"-weeks").classList.add("hidden")
                        elem.querySelector("#"+prefix+"-weeksText").classList.add("hidden")
                    }
                    //Set days to max value - 1 => days = 6
                    elem.querySelector(".countdown.days").innerText = "6"
                    //Set hours to max value - 1 => hours = 23
                    elem.querySelector(".countdown.hours").innerText = "23"
                    //Arrange unit number: singular or plural
                    elem.querySelector("#"+prefix+"-weeksText").innerText = weeks == 1 ? translate(language, "weeks").slice(0, -2)+"." : translate(language, "weeks")
                } else {
                    //weeks = 0 & days == 0 & hours == 00
                    //If years > 0 => decrement them
                    if(1*elem.querySelector(".countdown.years").innerText){
                        //Decrement pending years
                        years = 1*elem.querySelector(".countdown.years").innerText - 1
                        elem.querySelector(".countdown.years").innerText = years.toString()
                        //Hide years if they are 0
                        if(!years){
                            elem.querySelector("#"+prefix+"-years").classList.add("hidden")
                            elem.querySelector("#"+prefix+"-yearsText").classList.add("hidden")
                        }
                        //Set weeks to max value - 1 => weeks = 51
                        elem.querySelector(".countdown.weeks").innerText = "51"
                        //Set days to max value - 1 => days = 6
                        elem.querySelector(".countdown.days").innerText = "6"
                        //Set hours to max value - 1 => hours = 23
                        elem.querySelector(".countdown.hours").innerText = "23"
                        //Arrange unit number: singular or plural
                        elem.querySelector("#"+prefix+"-yearsText").innerText = weeks == 1 ? translate(language, "years").slice(0, -1) : translate(language, "years")
                    } else {
                        //Remove countdown
                        if(elem.classList.contains("activeExpedition")){
                            let expeditionType = elem.closest(".accordion-active-expedition").querySelector("h2").classList.contains("resourcesExpedition") 
                                                ? "resources"
                                                : elem.closest(".accordion-active-expedition").querySelector("h2").classList.contains("ruinsExpedition") 
                                                    ? "ruins"
                                                    : "combat"
                            endActiveExpedition(expeditionType)
                        }
                    }
                }
            }
        }
        if( !hours &&
            elem.querySelector("#"+prefix+"-days").classList.contains("hidden") &&
            elem.querySelector("#"+prefix+"-weeks").classList.contains("hidden") &&
            elem.querySelector("#"+prefix+"-years").classList.contains("hidden")){
            //Remove countdown
            if(elem.classList.contains("activeExpedition")){
                let expeditionType = elem.closest(".accordion-active-expedition").querySelector("h2").classList.contains("resourcesExpedition") 
                                                ? "resources"
                                                : elem.closest(".accordion-active-expedition").querySelector("h2").classList.contains("ruinsExpedition") 
                                                    ? "ruins"
                                                    : "combat"
                endActiveExpedition(expeditionType)
            }
        }
    })
}

let endActiveExpedition = (expeditionType) => {
    let mountResourceFound, ruinsFound = true
    let loot //For ruins expedition.
    let expeditionariesAssigned = 0
    let maxXP = avgXP = 0
    let expeditionaries, mountedExpeditionaries
    //Expeditionaries are back in town, so restore their status to idle.
    //Also calculate max and avg XP to later obtain probability of expedition success.
    document.querySelectorAll(".accordion-active-expedition").forEach((elem) => {
        let expeditionIndex = elem.id.split("-")[2]
        expeditionaries = [], mountedExpeditionaries = false
        mountedExpeditionaries = elem.querySelector("#expedition-"+expeditionIndex+"-assigned-horses h2:first-child") != null &&
                                 elem.querySelector("#expedition-"+expeditionIndex+"-assigned-horses h2:first-child") != undefined
        elem.querySelectorAll("#expedition-"+expeditionIndex+"-assigned-workers h2 div.expeditionary").forEach((citizen) => {
            let expeditionary = {}
            let citizenIndex = citizen.querySelector("i").id.split("-")[3]
            expeditionary.xp = document.querySelector("#citizen-"+citizenIndex+"-xp").getAttribute("data-xp")
            expeditionary.mounted = mountedExpeditionaries
            let realCitizenXP = 1*document.querySelector("#citizen-"+citizenIndex+"-xp").getAttribute("data-xp")
            maxXP = maxXP < realCitizenXP ? realCitizenXP : maxXP
            avgXP+= realCitizenXP
            document.querySelectorAll("#citizen-"+citizenIndex+"-status").forEach((status) => {
                status.setAttribute("data-status", "idle")
                status.innerText = translate(language, "Idle")
            })
            expeditionariesAssigned++
            expeditionaries.push(expeditionary)
        })
    })
    avgXP = (avgXP / expeditionariesAssigned)
    data = {}
    //If resources expedition
    if(expeditionType == "resources"){
        //Calculate result of the expedition (mount discovered?)
        //Calculate probability of finding a new resources mount.
        let mountDiscoveryProbability = expeditionProbability("of "+expeditionType, resourcesExpeditionsDone, expeditionariesAssigned, maxXP, avgXP)*1
        mountResourceFound = Math.random() < mountDiscoveryProbability       
        if(mountResourceFound){
            //Calculate type of mount discovered
            let mountResourceType = Math.random()
            if(!huntingMountDiscovered){
                data.mountResourceType = mountResourceType < mounts["Mine"]["discovery-probability-1"] ? "Mine" :
                                        mountResourceType < mounts["Clay mount"]["discovery-probability-1"] ? "Clay" :
                                        mountResourceType < mounts["Wood mount"]["discovery-probability-1"] ? "Wood" :
                                        mountResourceType < mounts["Stone mount"]["discovery-probability-1"] ? "Stone" : "Hunting"
                huntingMountDiscovered = data.mountResourceType == "Hunting"
            } else {
                data.mountResourceType = mountResourceType < mounts["Mine"]["discovery-probability-2"] ? "Mine" :
                                        mountResourceType < mounts["Clay mount"]["discovery-probability-2"] ? "Clay" :
                                        mountResourceType < mounts["Wood mount"]["discovery-probability-2"] ? "Wood" : "Stone"
            }
        }
    }
    //If ruins expedition
    if(expeditionType == "ruins"){
        //Calculate result of the expedition (ancient ruin discovered?)
        //Calculate probability of finding a new ruin.
        let ruinDiscoveryProbability = expeditionProbability("of "+expeditionType, ruinsExpeditionsDone, expeditionariesAssigned, maxXP, avgXP)*1
        //ruinsFound = Math.random() < ruinDiscoveryProbability
        if(ruinsFound){
            loot = {}
            expeditionaries.forEach((expeditionary) => {
                //Calculate type of goods found by current expeditionary.
                let goodsType = Math.random() < ruinsExpeditionProductsFoundProbability ? "products" : "resources"
                //Calculate amount of loot for current expeditionary
                let goodsLootAmount = expeditionCarriageCapacity(expeditionary.xp, expeditionary.mounted)
                //Calculate category and granularity probability of goods found by current expeditionary.
                let categoryProbability = Math.random()
                let granularityProbability = Math.random()
                let goodsProbability = Math.random()
                let granularityRandomMultiplication
                let lootGood = ""
                //Current expeditionary looted resources?
                if(goodsType == "resources"){
                    //Calculate type of mount resources found by current expeditionary.
                    let resourceMount = Math.random()
                    let currentProbability = ruinsExpeditionIronMountResourcesProbability
                    if(resourceMount <= currentProbability) { resourceMount = "iron" }
                    else{
                        currentProbability+= ruinsExpeditionWoodMountResourcesProbability
                        if(resourceMount <= currentProbability) { resourceMount = "wood" }
                        else{
                            currentProbability+= ruinsExpeditionClayMountResourcesProbability
                            if(resourceMount <= currentProbability) { resourceMount = "clay" }
                            else{ resourceMount = "stone" }
                        }
                    }
                    let categoryFound = false
                    currentProbability = 0
                    ruinsExpeditionResourceCategoriesProbability.forEach((probability, category) => {
                        currentProbability+= probability
                        categoryFound = !categoryFound && categoryProbability < currentProbability ? category + 1 : categoryFound
                    })
                    //Check if category found is available with resources for current mount. If not, get the closest lower one.
                    while(stockClassified.resources.byMount[resourceMount]["category"+categoryFound] == undefined){
                        if(categoryFound == 1){
                            categoryFound = Object.keys(stockClassified.resources.byMount[resourceMount])[0].toString().replace("category", "")*1
                        } else {
                            categoryFound--
                        }
                    }
                    //Obtain a random granularity for current mount and category resource.
                    let resourceGranularityArray = Object.keys(stockClassified.resources.byMount[resourceMount]["category"+categoryFound])
                    let resourceGranularityIndex = Math.floor(granularityProbability * resourceGranularityArray.length)
                    let resourceGranularity = resourceGranularityArray[resourceGranularityIndex]
                    let resourcesArray = stockClassified.resources.byMount[resourceMount]["category"+categoryFound][resourceGranularity]["EN"]
                    lootGood = resourcesArray[Math.floor(goodsProbability * resourcesArray.length)]
                    //Multiply loot according to granularity.
                    let minValue = Math.ceil(granularityLootMultipliers[resourceGranularity].minMultiplier * granularityLootMultipliers["category"+categoryFound].reductionCoeficient)
                    let maxValue = Math.ceil(granularityLootMultipliers[resourceGranularity].maxMultiplier * granularityLootMultipliers["category"+categoryFound].reductionCoeficient)
                    let randomGranularityMultiplicator = Math.random() / categoryFound
                    granularityRandomMultiplication = minValue + Math.floor(randomGranularityMultiplicator * (maxValue - minValue))
                } else { //Current expeditionary looted products
                    //Calculate type of product resources found by current expeditionary.
                    let building = Math.random()
                    let currentProbability = ruinsExpeditionTextileProductsProbability
                    if(building <= currentProbability) { building = "textile" }
                    else{ 
                        currentProbability+= ruinsExpeditionWorkshopProductsProbability
                        if(building <= currentProbability) { building = "workshop" }
                        else{ 
                            currentProbability+= ruinsExpeditionBlacksmithProductsProbability
                            if(building <= currentProbability) { building = "blacksmith" }
                            else{
                                currentProbability+= ruinsExpeditionSawmillProductsProbability
                                if(building <= currentProbability) { building = "sawmill" }
                                else{
                                    currentProbability+= ruinsExpeditionFurnacesProductsProbability
                                    if(building <= currentProbability) { building = "furnaces" }
                                    else{
                                        currentProbability+= ruinsExpeditionMillProductsProbability
                                        if(building <= currentProbability) { building = "mill" }
                                        else{
                                            currentProbability+= ruinsExpeditionSlaughterhouseProductsProbability
                                            if(building <= currentProbability) { building = "slaughterhouse" }
                                            else{
                                                currentProbability+= ruinsExpeditionBarnyardProductsProbability
                                                if(building <= currentProbability) { building = "barnyard" }
                                                else{
                                                    currentProbability+= ruinsExpeditionFarmProductsProbability
                                                    if(building <= currentProbability) { building = "farm" }
                                                    else{
                                                        currentProbability+= ruinsExpeditionWoodsmithProductsProbability
                                                        if(building <= currentProbability) { building = "woodsmith" }
                                                        else{ building = "stonesmith"}
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    let categoryFound = false
                    currentProbability = 0
                    ruinsExpeditionProductCategoriesProbability.forEach((probability, category) => {
                        currentProbability+= probability
                        categoryFound = !categoryFound && categoryProbability < currentProbability ? category + 1 : categoryFound
                    })
                    //Check if category found is available with products for current building. If not, get the closest lower one.
                    if(stockClassified.products.byBuilding[building] == undefined) debugger
                    while(stockClassified.products.byBuilding[building]["category"+categoryFound] == undefined){
                        if(categoryFound == 1){
                            categoryFound = Object.keys(stockClassified.products.byBuilding[building])[0].toString().replace("category", "")*1
                        } else {
                            categoryFound--
                        }
                    }
                    //Obtain a random granularity for current building and category product.
                    let productGranularityArray = Object.keys(stockClassified.products.byBuilding[building]["category"+categoryFound])
                    let productGranularityIndex = Math.floor(granularityProbability * productGranularityArray.length)
                    let productGranularity = productGranularityArray[productGranularityIndex]
                    let productsArray = stockClassified.products.byBuilding[building]["category"+categoryFound][productGranularity]["EN"]
                    lootGood = productsArray[Math.floor(goodsProbability * productsArray.length)]
                    //Multiply loot according to granularity.
                    let minValue = Math.ceil(granularityLootMultipliers[productGranularity].minMultiplier * granularityLootMultipliers["category"+categoryFound].reductionCoeficient)
                    let maxValue = Math.ceil(granularityLootMultipliers[productGranularity].maxMultiplier * granularityLootMultipliers["category"+categoryFound].reductionCoeficient)
                    let randomGranularityMultiplicator = Math.random() / categoryFound
                    granularityRandomMultiplication = minValue + Math.floor(randomGranularityMultiplicator * (maxValue - minValue))
                }
                //loot["loots"] = (loot["loots"] == undefined || loot["loots"] == null) ? [] : loot["loots"]
                loot[lootGood] = (loot[lootGood] == undefined || loot[lootGood] == null) ? 0 : loot[lootGood]
                loot[lootGood]+= goodsLootAmount * granularityRandomMultiplication
                //loot["loots"].push({"good": lootGood, "loot": loot[lootGood]})
            })
        }
    }
    //Update xp to all expeditionaries according to expedition results.
    document.querySelectorAll(".accordion-active-expedition").forEach((elem) => {
        let expeditionIndex = elem.id.split("-")[2]
        elem.querySelectorAll("#expedition-"+expeditionIndex+"-assigned-workers h2 div.expeditionary").forEach((citizen) => {
            let citizenIndex = citizen.querySelector("i").id.split("-")[3]
            let realCitizenXP = 1*document.querySelector("#citizen-"+citizenIndex+"-xp").getAttribute("data-xp")
            //Calculate new experience according to expedition time.
            let newXP = realCitizenXP + 
                        (expeditionType == "resources" ? (mountResourceFound ? resourcesExpeditionSuccessXPGain : resourcesExpeditionFailXPGain) : 
                            expeditionType == "ruins" ? (ruinsFound ? ruinsExpeditionSuccessXPGain : ruinsExpeditionFailXPGain) :
                                0)
            document.querySelector("#citizen-"+citizenIndex+"-xp").setAttribute("data-xp", newXP.toFixed(4))
            document.querySelector("#citizen-"+citizenIndex+"-xp").innerText = Math.floor(newXP)
            //Update icon
            if(newXP > 0){
                document.querySelectorAll("#citizen-"+citizenIndex+"-xp-icon").forEach((elem) => {
                    elem.innerText = Math.floor(newXP)
                    if(elem.classList.contains("hidden")){ elem.classList.remove("hidden")}
                })
            }
        })
    })
    //Add notification with the results of the expedition.
    data.expeditionType = expeditionType
    if(expeditionType == "resources"){
        data.successfullExpedition = mountResourceFound
        addNews("ResourcesExpeditionFinished", data)
        if(mountResourceFound){
            addLandform(data.mountResourceType.charAt(0).toLowerCase()+data.mountResourceType.slice(1))
            resourcesExpeditionsDone++
            document.querySelector("#resourcesSuccessfullExpeditions").innerText = resourcesExpeditionsDone
        }
    }
    if(expeditionType == "ruins"){
        data.successfullExpedition = ruinsFound
        data.loot = loot
        addNews("RuinsExpeditionFinished", data)
        if(data.successfullExpedition){
            //Update stock with loot.
            Object.keys(loot).forEach((good) => {
                if(stockValues.resources["EN"][good]!=undefined && stockValues.resources["EN"][good]!=null){
                    stockValues.resources["EN"][good]+= loot[good]
                    stockValues.resources["ES"][translate(language, good)] = stockValues.resources["EN"][good]
                }
                if(stockValues.products["EN"][good]!=undefined && stockValues.products["EN"][good]!=null){
                    stockValues.products["EN"][good]+= loot[good]
                    stockValues.products["ES"][translate(language, good)] = stockValues.products["EN"][good]
                }
            })
            stockDisplayed = JSON.parse(JSON.stringify(stockValues))
            updateStock()
            ruinsExpeditionsDone++
            document.querySelector("#ruinsSuccessfullExpeditions").innerText = ruinsExpeditionsDone
        }
    }
    //Remove active expedition
    document.querySelector(".accordion-active-expedition").remove()
    let d = document.getElementById("active-expeditions-area")
    //If no other active expedition, show empty text.
    if(!d.children.length){
        p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-500 dark:text-gray-200", [], d); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""},{"key":"gender","value":"f"}], s.getNode()); s1.create(); s1.appendContent(translate(language, "None", "f"))
    }
}

let citizenDescription = (gender, birthWeeks, language, texts, attributes, genderPlacement) => {
    let textAttr = "", prefix = "", gen = (gender == "Femenine" || gender == "Femenino" ? "F" : "M"), adjective = "", text = ""
    let connector, noun
    if(language == "ES" && (texts == "Ella es una" || texts == "El es un")) { connector = " y " }
    if(language == "ES" && !(texts == "Ella es una" || texts == "El es un")) { connector = " o " }
    if(language == "EN" && (texts == "She is a" || texts == "He is a")) { connector = " and " }
    if(language == "EN" && !(texts == "She is a" || texts == "He is a")) { connector = " or " }
    //Check citizen age
    switch(true){
        case birthWeeks <= 260: noun = (gen == "F" ? "beba" : "bebé"); break
        case birthWeeks > 260 && birthWeeks <= 728: noun = (gen == "F" ? "nena" : "nene"); break
        case birthWeeks > 728 && birthWeeks <= 1092: noun = (gen == "F" ? "chica" : "chico"); break
        case birthWeeks > 1092 && birthWeeks <= 3380: noun = (gen == "F" ? "mujer" : "hombre"); break
        case birthWeeks > 3380: noun = (gen == "F" ? "anciana" : "anciano"); break
    }
    noun = translate(language, noun)
    if(language == "EN"){
        attributes.forEach(function(value, index){
            prefix = (index<2 ? (index ? ", " : " ") : connector)
            adjective = attributesAdjectives[language][value]
            textAttr+= prefix+"<strong class='"+attributesColors[language][value]+"'>"+adjective+"</strong>"
        })
        text+= texts+(genderPlacement=="left"?" "+noun:"")+" "+textAttr+(genderPlacement=="right"?" "+noun:"")
    }
    if(language == "ES"){
        attributes.forEach(function(value, index){
            prefix = (index<2 ? (index ? ", " : " ") : (value == "Inteligencia" && connector == " y " ? " e " : connector))
            if(typeof attributesAdjectives[language][value] == "undefined") debugger
            adjective = attributesAdjectives[language][value][gen]
            textAttr+= prefix+"<strong class='"+attributesColors[language][value]+"'>"+adjective+"</strong>"
        })
        text+= texts+(genderPlacement=="left"?" "+noun:"")+" "+textAttr+(genderPlacement=="right"?" "+noun:"")
    }
    return text
}
let updateCitizenDescription = (citizenIndex, birthWeeks, citizenOwnAttributes, citizenWishedAttributes, citizenMustAttribute) => {
    let descriptionText1 = {"ES" : {"F": "Ella es una", "M": "El es un"}, "EN" : {"F": "She is a", "M": "He is a"}}
    let descriptionText2 = {"ES" : {"F": "A ella le gusta un", "M": "A él le gusta una"}, "EN" : {"F": "She likes a", "M": "He likes a"}}
    let descriptionText3 = {"ES" : {"F": "Ella prefiere que no sea", "M": "Él prefiere que no sea"}, "EN" : {"F": "She prefers a no", "M": "He prefers a no"}}
    citizenBio = citizenDescription(h<=5 ? "Femenine" : "Masculine", birthWeeks, language, (h<=5 ? descriptionText1[language]["F"] : descriptionText1[language]["M"]), citizenOwnAttributes, language=="ES" ? "left" : "right")+"."
    //Only show possible future partner features if he or she is no baby.
    if(birthWeeks > 260){
        citizenBio+= "</br>"+citizenDescription(h<=5 ? "Masculine" : "Femenine", birthWeeks, language, (h<=5 ? descriptionText2[language]["F"] : descriptionText2[language]["M"]), citizenWishedAttributes, language=="ES" ? "left" : "right")+".</br>"
        citizenBio+= citizenDescription(h<=5 ? "Masculine" : "Femenine", birthWeeks, language, (h<=5 ? descriptionText3[language]["F"] : descriptionText3[language]["M"]), citizenMustAttribute, language=="ES" ? "none" : "right")
    }
    //Place description in citizen's description panel, removing previous one if existed.
    document.querySelector("#citizen-"+citizenIndex+"-description").innerHTML = "\""+citizenBio+"\""
}
let setRandomNames = (language) => {
    //Assign random names for all citizens
    var femaleNames = naming['names'][language]['F']
    var maleNames = naming['names'][language]['M']
    //Assign random families for all citizens
    var femaleFamilies = naming['families'][language]['F']
    var maleFamilies = naming['families'][language]['M']
    //Iterate over each citizen and assign names and families
    for(let i = 1; i<=citizensAmount; i++){
        let randomCitizenName = "", randomCitizenFamily = "", iconGroup = "", genderClass = "", genderColour = ""
        if(i<=citizensAmount/2){
            iconGroup = "fa"; genderClass = "fa-venus"; genderColour = "text-red-500"
            randomCitizenName = femaleNames[Math.floor(Math.random() * femaleNames.length)]
            femaleNames = femaleNames.filter(item => item !== randomCitizenName)
            randomCitizenFamily = femaleFamilies[Math.floor(Math.random() * femaleFamilies.length)]
            femaleFamilies = femaleFamilies.filter(item => item !== randomCitizenFamily)
        } else {
            iconGroup = "fa"; genderClass = "fa-mars"; genderColour = "text-blue-500"
            randomCitizenName = maleNames[Math.floor(Math.random() * maleNames.length)]
            maleNames = maleNames.filter(item => item !== randomCitizenName)
            randomCitizenFamily = maleFamilies[Math.floor(Math.random() * maleFamilies.length)]
            maleFamilies = maleFamilies.filter(item => item !== randomCitizenFamily)
        
        }
        document.querySelector("#citizen-"+i+"-gender-icon").classList.remove("hidden")
        document.querySelector("#citizen-"+i+"-gender-icon").classList.add(iconGroup, genderClass, genderColour)
        document.querySelector("#citizen-"+i+"-name").innerHTML = randomCitizenName+", "+randomCitizenFamily
        //"<i id='citizen-"+i+"-gender-icon' class='text-red-500 fa fa-venus me-1'></i><i id='citizen-"+i+"-role-icon' class='text-green-500 hidden fa me-1'></i></i><span class='text-yellow-500 border border-yellow-500 rounded px-1 me-1'>2</span>"+
    }
}
let getRandomAttributes = (language, amount = 3, excludeThis = []) => {
    let attributeGroups = JSON.parse(JSON.stringify(attributes[language]))
    //Excluir los atributos necesarios.
    attributeGroups.forEach(function(valueA, indexA){
        excludeThis.forEach(function(valueE, indexE){
            valueA.attributes = valueA.attributes.filter(item => item !== valueE)
        })
    })
    let citizenAttributes = []
    for(i=0; i<amount; i++){
        let randomIndexGroup = Math.floor(Math.random() * attributeGroups.length)
        let randomGroup = attributeGroups[randomIndexGroup]
        while(!randomGroup.attributes.length){
            randomIndexGroup = Math.floor(Math.random() * attributeGroups.length)
            randomGroup = attributeGroups[randomIndexGroup]
        }
        let randomAttribute = randomGroup.attributes[Math.floor(Math.random() * randomGroup.attributes.length)]
        //Quitar atributo de la lista para que no vuelva a ser elegido.
        attributeGroups[randomIndexGroup].attributes = attributeGroups[randomIndexGroup].attributes.filter(item => item !== randomAttribute)
        //Agregar atributo propio
        citizenAttributes.push(randomAttribute)
    }
    return citizenAttributes
}
let fillCitizenInfo = () => {
    //Cargar atributos propios aleatorios para los 10 habitantes.
    //Generar también edades aletatorias.
    let attributeGroups = JSON.parse(JSON.stringify(attributes[language]))
    let citizenOwnAttributes = [], citizenWishedAttributes = [], citizenMustAttribute
    let citizenBirthweeks, citizenFertility, citizenWeekOfDeath
    //Iterate over each citizen
    for(h=1; h<=citizensAmount; h++){
        citizenBirthweeks = /*1092*/0+ Math.floor(Math.random() * (3800-0)/*(1820-1092)*/)        
        citizenWeekOfDeath = 3120 + Math.floor(Math.random() * (4420-3120))
        citizenFertility = 10 + Math.floor(Math.random() * 90)
        citizenOwnAttributes = getRandomAttributes(language)
        citizenWishedAttributes = getRandomAttributes(language)
        citizenMustAttribute = getRandomAttributes(language, 1, citizenWishedAttributes)
        //Update description
        updateCitizenDescription(h, citizenBirthweeks, citizenOwnAttributes, citizenWishedAttributes, citizenMustAttribute)
        //Ubicar edad en panel de habitante actual
        let birthweek = Math.floor(-citizenBirthweeks), ageYears = Math.floor(citizenBirthweeks/52), ageWeeks = citizenBirthweeks % 52
        document.querySelector("#citizen-"+h+"-birthWeek").innerText = birthweek
        document.querySelector("#citizen-"+h+"-ageYears").innerText = ageYears
        document.querySelector("#citizen-"+h+"-ageWeeks").innerText = ageWeeks
        //Define age icon according to citizen's weekage
        iconGroup = "fa"; ageColour = "text-white"
        ageClass = (ageYears <= 5 ? "fa-baby" : (ageYears < 15 ? "fa-child" : (ageYears < 21 ? "fa-person-walking" : (ageYears < 50 ? "fa-person" : (ageYears < 65 ? "fa-person" : "fa-person-cane"))))); 
        document.querySelector("#citizen-"+h+"-age-icon").classList.remove("hidden")
        document.querySelector("#citizen-"+h+"-age-icon").classList.add(iconGroup, ageClass, ageColour)
        //Ubicar fertilidad en panel de habitante actual
        document.querySelector("#citizen-"+h+"-fertility").innerHTML = citizenFertility
        attributeGroups = JSON.parse(JSON.stringify(attributes[language]))
        //Add week of death as attribute.
        document.querySelector("#citizen-"+h+"-properties").setAttribute("data-deathweek", citizenWeekOfDeath) 
    }
}

initColonyInfo()

accordionNews()
addNews("Welcome")
accordionColony()
accordionBuildings()
accordionCitizens(citizensAmount)
accordion_landforms()
accordionExpeditions()

fillCitizenInfo()
translateAll(language)
setRandomNames(language)

enableNotificationEvents()

let process_worker_assignation = (citizen_index, assigned_where) => {
    //Perform particular tasks according to the nature of new citizen's assignation.
    let citizen_role = document.querySelector("#citizen-"+citizen_index+"-role").getAttribute("data-role")
    if(assigned_where == "waterReservoir"){
        //Process changes in vital resources daily incomes.
        if(citizen_role == "waterbearing"){
            //Update daily water income in Colony panel
            document.getElementById("colony-water-income").innerHTML = document.getElementById("colony-water-income").innerHTML*1 + water_reservoirs[colony_water_reservoir]["daily-water-income"]*1
            let waterRevenue = document.getElementById("colony-water-income").innerHTML*1 - document.getElementById("colony-water-consumption").innerHTML*1
            document.getElementById("water-revenue").innerHTML = (waterRevenue ? "+" : "")+waterRevenue
        }
        if(citizen_role == "fishing"){
            //Update daily fishing income in Colony panel
            document.getElementById("colony-food-income").innerHTML = document.getElementById("colony-food-income").innerHTML*1 + water_reservoirs[colony_water_reservoir]["daily-food-income"]*1
            let revenue = document.getElementById("colony-food-income").innerHTML*1 - document.getElementById("colony-food-consumption").innerHTML*1
            document.getElementById("food-revenue").innerHTML = (revenue ? "+" : "") + revenue
        }
    } else {
        //Production rule assignment
        
    }
}
let process_worker_deassignation = (citizen_index, deassigned_from_where) => {
    //Perform particular tasks according to the nature of new citizen's deassignation.
    let citizen_role = document.querySelector("#citizen-"+citizen_index+"-role").getAttribute("data-role")
    if(deassigned_from_where == "waterReservoir"){
        //Process changes in vital resources daily incomes.
        if(citizen_role == "waterbearing"){
            //Update daily water income in Colony panel
            document.getElementById("colony-water-income").innerHTML = document.getElementById("colony-water-income").innerHTML*1 - water_reservoirs[colony_water_reservoir]["daily-water-income"]*1
            let waterRevenue = document.getElementById("colony-water-income").innerHTML*1 - document.getElementById("colony-water-consumption").innerHTML*1
            document.getElementById("water-revenue").innerHTML = (waterRevenue ? "+" : "")+waterRevenue
        }
        if(citizen_role == "fishing"){
            //Update daily fishing income in Colony panel
            document.getElementById("colony-food-income").innerHTML = document.getElementById("colony-food-income").innerHTML*1 - water_reservoirs[colony_water_reservoir]["daily-food-income"]*1
            let revenue = document.getElementById("colony-food-income").innerHTML*1 - document.getElementById("colony-food-consumption").innerHTML*1
            document.getElementById("food-revenue").innerHTML = (revenue ? "+" : "") + revenue
        }
    }
}
let toggle_assignable_worker = (e) => {
    let toggle_panel_aspect = () => {
        //Change citizen panel aspect.
        e.target.classList.toggle("text-green-400")
        e.target.classList.toggle("fa-square")
        e.target.classList.toggle("fa-square-check")
        e.target.closest("h2").classList.toggle("unassigned")
        e.target.closest("h2").classList.toggle("assigned")
        e.target.closest("div").classList.toggle("bg-green-800")
        e.target.closest("div").classList.toggle("dark:border-green-600")
        e.target.closest("div").querySelector("span > span:last-child").classList.toggle("text-white")
        e.target.previousSibling.classList.toggle("text-green-400")
    }
    toggle_panel_aspect()
    let id_as_array = e.target.closest("h2").id.split("citizen-")
    let assigned_where = e.target.getAttribute("data-group")
    let citizen_index = id_as_array[1], citizenNewStatus = ""
    //If worker is now assigned, toggle his or her status from "idle" to "working" and viceversa.
    if(e.target.closest("h2").classList.contains("assigned")){
        document.querySelectorAll("#citizen-"+citizen_index+"-status").forEach((elem) => {
            //If permanent assignment => new status working
            if(["stoneMount", "clayMount", "woodMount", "huntingMount", "waterReservoir", "ironMount"].includes(assigned_where)){
                citizenNewStatus = "working"
            } else { //If temporary assignment to production rule => new status assigned
                if(assigned_where == "production-rule"){
                    assigned_where = `rule-${e.target.getAttribute("data-rule")}-requirement-${e.target.getAttribute("data-requirement")}`
                }
                citizenNewStatus = "assigned"
            }
            elem.innerText = translate(language, citizenNewStatus)
            elem.setAttribute("data-status", citizenNewStatus)
            process_worker_assignation(citizen_index, assigned_where)
            //Check other citizen appearances as available worker and remove it from there
            document.querySelectorAll("h2.assignable-worker.unassigned").forEach((elem) => {
                //Check if current loop worker is the same as the one recently assigned
                let loop_citizen_index = elem.id.split("citizen-")[1]
                if(loop_citizen_index == citizen_index){
                    let assignable_workers_div = elem.parentElement
                    elem.remove()
                    //Check if there is no more assignable worker in the panel
                    if(!assignable_workers_div.children.length){
                        p = new element("p", "empty ms-1 mb-1 text-xs flex justify-between text-gray-500 dark:text-gray-200", [], assignable_workers_div); p.create()
                        s = new element("span", "", [], p.getNode()); s.create()
                        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
                        s1 = new element("span", "", [{"key":"data-i18n","value":""}], s.getNode()); s1.create(); s1.appendContent(translate(language, "No workers available"))
                    }
                }
            })
        })
    } else { //If worker is now deassigned, set his or her status to "idle".
        document.querySelectorAll("#citizen-"+citizen_index+"-status").forEach((elem) => {
            elem.innerText = translate(language, "idle")
            elem.setAttribute("data-status", "idle")
            process_worker_deassignation(citizen_index, assigned_where)
        })
    }
    
}
let assign_role_to_citizen = (rolekey, roleText, roleIcon, assignRolePanelExists = true) => {
    //Check if citizen is idle or busy.
    if(document.querySelector("#citizen-"+citizenIndex+"-status").getAttribute("data-status") == "idle"){
        //Check previous role if exists.
        previousRole = document.querySelector("#citizen-"+citizenIndex+"-role").getAttribute("data-role")
        //If citizen have had another role previously, change all panels in which the role was involved
        if(previousRole != translate(language, "Unassigned")){ 
            post_conditions_changing_role(previousRole, citizenIndex) 
        }
        //Update role in Citizen's info.
        document.querySelector("#citizen-"+citizenIndex+"-role").innerText = roleText
        document.querySelector("#citizen-"+citizenIndex+"-role").setAttribute("data-role", rolekey)
        //Update role icon in Citizen's info.
        document.querySelector("#citizen-"+citizenIndex+"-role-icon").classList.remove("hidden")
        document.querySelector("#citizen-"+citizenIndex+"-role-icon").classList = "text-green-500 fa me-1 fa-"+roleIcon
        if(assignRolePanelExists){
            assignRolePanel.removePanel()
            assignRolePanel.showPreviousOptions()
        }
        //New role is "Water bearer"?
        if(["waterbearing", "fishing"].includes(rolekey)){
            //Add citizen to Water Reservoir Assignable workers.
            add_assignable_worker_to_mount(citizenIndex, "waterReservoir")
            //Add behavior when clicking selecting box. Toggle color from gray to green and process efects in other panels.
            document.getElementById("waterReservoir-citizen-"+citizenIndex+"-assign").addEventListener("click", 
                toggle_assignable_worker
            )
            /*
            document.getElementById("citizen-"+citizenIndex+"-assign").setAttribute("data-class", "waterReservoir")
            document.getElementById("citizen-"+citizenIndex+"-assign").addEventListener("click", handleToggleWorker)
            */
        }       
        if(rolekey == "expeditioning"){
            if(document.querySelector("#expeditions-newExpedition") != null){
                addAvailableWorkerToExpedition(citizenIndex, "newExpedition")
                document.getElementById("citizen-"+citizenIndex+"-assign").setAttribute("data-class", "newExpedition")
                document.getElementById("citizen-"+citizenIndex+"-assign").addEventListener("click", handleToggleWorker)
            }
        }
        /*
        //Check if there is a new expedition panel opened to add expeditionary as available there.
        let availableWorkersPanel = document.querySelector("#newExpedition-available-workers .availableWorkers")
        if(availableWorkersPanel!=null){
            addAvailableWorkerToExpedition(citizenIndex, "newExpedition")
            document.getElementById("citizen-"+citizenIndex+"-assign").setAttribute("data-class", "newExpedition")
            document.getElementById("citizen-"+citizenIndex+"-assign").addEventListener("click", handleToggleWorker)
        }
        */
    } else {
        modalPopup("Can't change role", "RoleCitizenBusy")
        modal.show()
    }
}


let handleToggleHorse = (e) => {
    e.target.removeEventListener("click", handleToggleHorse)
    if(e.target.classList.contains("fa-plus")){
        addAssignedHorseToExpedition(e.target.closest("h2"))
    } else {
        deassignHorseToExpedition(e.target.closest("h2"))
    }
    //Check amount of citizens and horses already assigned.
    let expeditionariesAlreadyAssigned = document.querySelectorAll(".assignedWorkers .assignedWorker").length
    let horsesAlreadyAssigned = document.querySelectorAll(".assignedWorkers .assignedHorse").length
    let expeditionType = document.querySelector("#expeditions-newExpedition .expeditionType span:last-child").getAttribute("data-type")
    if(expeditionariesAlreadyAssigned){
        //Calculate required expedition time.
        let timeRequired = expeditionRequiredTime(expeditionType, expeditionType == "of resources" ? resourcesExpeditionsDone : ruinsExpeditionsDone, (expeditionariesAlreadyAssigned <= horsesAlreadyAssigned) ? expeditionariesAlreadyAssigned : 0)
        //Update expedition required time.
        document.getElementById("newExpedition-required-info").classList.remove("hidden")
        document.querySelectorAll(".unknownTime").forEach((elem) => elem.classList.add("hidden"))
        if(timeRequired.inGame.clock.years > 0){ 
            document.getElementById("newExpedition-required-years").classList.remove("hidden")
            document.getElementById("newExpedition-required-yearsText").classList.remove("hidden")
            document.getElementById("newExpedition-required-yearsComma").classList.remove("hidden")
        } else {document.querySelectorAll("#newExpedition-required-years, #newExpedition-required-yearsText, #newExpedition-required-yearsComma").forEach((elem) => elem.classList.add("hidden"))}
        document.getElementById("newExpedition-required-years").innerText = timeRequired.inGame.clock.years
        document.getElementById("newExpedition-required-yearsText").innerText = timeRequired.inGame.clock.years != 1 ? translate(language, "Years", "lowercase") : translate(language, "Years", "lowercase").slice(0, -1)
        if(timeRequired.inGame.clock.weeks > 0){ 
            document.getElementById("newExpedition-required-weeks").classList.remove("hidden")
            document.getElementById("newExpedition-required-weeksText").classList.remove("hidden")
            document.getElementById("newExpedition-required-weeksComma").classList.remove("hidden")
        } else {document.querySelectorAll("#newExpedition-required-weeks, #newExpedition-required-weeksText, #newExpedition-required-weeksComma").forEach((elem) => elem.classList.add("hidden"))}
        document.getElementById("newExpedition-required-weeks").innerText = timeRequired.inGame.clock.weeks
        document.getElementById("newExpedition-required-weeksText").innerText = timeRequired.inGame.clock.weeks != 1 ? translate(language, "Weeks", "lowercase") : translate(language, "Weeks", "lowercase").slice(0, -2)+"."
        if(timeRequired.inGame.clock.days > 0){ 
            document.getElementById("newExpedition-required-days").classList.remove("hidden")
            document.getElementById("newExpedition-required-daysText").classList.remove("hidden")
            document.getElementById("newExpedition-required-daysComma").classList.remove("hidden")
        } else {document.querySelectorAll("#newExpedition-required-days, #newExpedition-required-daysText, #newExpedition-required-daysComma").forEach((elem) => elem.classList.add("hidden"))}
        document.getElementById("newExpedition-required-days").innerText = timeRequired.inGame.clock.days
        document.getElementById("newExpedition-required-daysText").innerText = timeRequired.inGame.clock.days != 1 ? translate(language, "Days", "lowercase") : translate(language, "Days", "lowercase").slice(0, -1)
        document.getElementById("newExpedition-required-hours").innerText = timeRequired.inGame.clock.hours
    } else {
        if(lifeStarted){
            document.getElementById("expeditionStart").classList.add("hidden")
            document.getElementById("newExpeditionNoActions").classList.remove("hidden")
        } else {
            document.querySelectorAll("#searchZoneWarning").forEach((element) => { element.classList.add("hidden") })
        }
        //Hide required time info and show "(Unknown yet)"
        document.getElementById("newExpedition-required-info").classList.add("hidden")
        document.querySelectorAll(".unknownTime").forEach((elem) => elem.classList.remove("hidden"))
    }
    e.target.addEventListener("click", handleToggleHorse)
}
//Assignment and deassignment of workers in differnte panels (landforms and new expedition)
let handleToggleWorker = (e) => {
    let handleStartExpedition = (event) => {
        event.target.removeEventListener("click", handleStartExpedition)
        let expeditionType = event.target.closest("button#expeditionStart").getAttribute("data-type")
        //Prepare expedition data to add in new Active Expedition panel.
        let departedInHours = document.getElementById("currentHour").innerText
        let departedInDays = document.getElementById("currentDay").innerText
        let departedInWeeks = document.getElementById("currentWeek").innerText
        let departedInYears = document.getElementById("currentYear").innerText
        let returnsInHours = document.getElementById("newExpedition-required-hours").innerText
        let returnsInDays = document.getElementById("newExpedition-required-days").innerText
        let returnsInWeeks = document.getElementById("newExpedition-required-weeks").innerText
        let returnsInYears = document.getElementById("newExpedition-required-years").innerText
        //Define data to be parsed while building active expedition panel.
        let expeditionData = {
            "id": expeditionIndex,
            "type": expeditionType,
            "departedIn":{"year":departedInYears, "week":departedInWeeks, "day":departedInDays, "hour":departedInHours},
            "returnsIn":{"years":returnsInYears, "weeks":returnsInWeeks, "days":returnsInDays, "hours":returnsInHours},
            "crew":[]
        }
        let expeditionMember
        document.querySelectorAll("#newExpedition-assigned-workers h2").forEach((elem) => {
            expeditionMember = {}
            expeditionMember.index = elem.id.split("-")[2]
            expeditionMember.type = elem.classList.contains("assignedWorker") ? "expeditionary" : "horse"
            if(expeditionMember.type == "expeditionary"){
                expeditionMember.name = elem.querySelector("div span span:last-child").innerText
                expeditionMember.gender = elem.querySelector("div span i:first-child").classList.contains("fa-venus") ? "F" : "M"
                expeditionMember.age = elem.querySelector("div span i:nth-child(2)").classList.contains("fa-person") 
                                        ? "adult" 
                                        : elem.querySelector("div span i:nth-child(2)").classList.contains("fa-person")
                                            ? "ancient"
                                            : elem.querySelector("div span i:nth-child(2)").classList.contains("fa-person")
                                                ? "grown adult"
                                                : elem.querySelector("div span i:nth-child(2)").classList.contains("fa-person")
                                                    ? "teen"
                                                    : elem.querySelector("div span i:nth-child(2)").classList.contains("fa-person")
                                                        ? "child"
                                                        : "baby"
                expeditionMember.xp = elem.querySelector("div span:first-child span").innerText
            }
            expeditionData.crew.push(expeditionMember)
        })
        //Display active expedition with all its data
        buildActiveExpedition(document.getElementById("active-expeditions-area"), expeditionData)
        //enableAccordions("#accordion-expedition-"+expeditionIndex+" [data-accordion-target]")
        //Remove new expedition panel.
        newExpeditionPanel.removePanel()
        newExpeditionPanel.showPreviousOptions()
        expeditionIndex++
    }
    let getExpeditionType = () => {
        //Get expedition type
        let expeditionTypeText
        let expeditionType = document.querySelector("#expeditions-newExpedition .expeditionType span:last-child").getAttribute("data-type")
        //Define type description to be included in "Start expedition" button
        switch (expeditionType){
            case "of resources": expeditionTypeText = "Start resources mounts expedition"; break
            case "of ruins": expeditionTypeText = "Start ancient ruins expedition"; break
            case "of combat": expeditionTypeText = "Start attack expedition"; break
        }
        return {"type": expeditionType, "text": expeditionTypeText}
    }
    let toggleAssignDeassign = () => {
        if(e.target.classList.contains("fa-plus")){
            if(mountPanel){
                addAssignedWorkerToMount(citizenIndex, e.target.getAttribute("data-class"))
            } else {
                if(expeditionPanel) {
                    addAssignedWorkerToExpedition(citizenIndex, e.target.getAttribute("data-class"))
                }
            }
        } else { //If worker is about to be dismissed, check if it has to be dismissed from a mount or a new expedition
            if(mountPanel){
                deassignWorkerToMount(citizenIndex, e.target.getAttribute("data-class"))
            } else {
                if(expeditionPanel) {
                    deassignWorkerToExpedition(citizenIndex, e.target.getAttribute("data-class"))
                }
            }
        }
    }
    e.target.removeEventListener("click", handleToggleWorker)
    //Check in which panel the worker is being assigned.
    let mountPanel = ["waterReservoir", "stoneMount", "clayMount", "woodMount", "mine"].includes(e.target.getAttribute("data-class"))
    let expeditionPanel = e.target.getAttribute("data-class") == "newExpedition"
    //Get citizen index
    let citizenIndex = e.target.id.split("-")[1]
    //If worker is about to be added up, check if it has to be added to a mount or a new expedition
    toggleAssignDeassign(citizenIndex)

    if(expeditionPanel){
        let expeditionTypeInfo = getExpeditionType()
        //Calculate for all expeditionaries sent, maximum XP and XP average.
        let assignedExpeditionaries = maxXP = avgXP = 0
        document.querySelectorAll(".newExpedition .assignedWorkers .assignedWorker").forEach((expeditionary) => {
            let citizenIndex = expeditionary.id.split("-")[2]
            let citizenXP = 1*document.querySelector("#citizen-"+citizenIndex+"-xp").getAttribute("data-xp")
            avgXP+= citizenXP
            maxXP = citizenXP > maxXP ? citizenXP : maxXP
            assignedExpeditionaries++
        })
        //Check amount of citizens and horses already assigned.
        let expeditionariesAlreadyAssigned = assignedExpeditionaries //document.querySelectorAll(".assignedWorkers .assignedWorker").length
        let horsesAlreadyAssigned = document.querySelectorAll(".assignedWorkers .assignedHorse").length
        
        //Calculate probability of finding a new resources mount or ancient ruin.
        let discoveryProbability
        if(assignedExpeditionaries){
            discoveryProbability = expeditionProbability(expeditionTypeInfo.type, (expeditionTypeInfo.type == "of resources") ? resourcesExpeditionsDone : ruinsExpeditionsDone, assignedExpeditionaries, maxXP, avgXP)*1
        } else {
            discoveryProbability = 0
        }
        if(lifeStarted){
            //Show "Start new expedition" button and hide "No actions available"
            document.querySelector("#expeditionStart span").innerText = translate(language, expeditionTypeInfo.text)
            document.getElementById("newExpeditionNoActions").classList.add("hidden")
            document.getElementById("expeditionStart").classList.remove("hidden")
            if(document.querySelector("#expeditionStart").classList.contains("unattached-click")){
                document.querySelector("#expeditionStart").setAttribute("data-type", expeditionTypeInfo.type)
                //Add click "Start new expedition" button event
                document.querySelector("#expeditionStart").addEventListener("click", handleStartExpedition)
                document.querySelector("#expeditionStart").classList.remove("unattached-click")
            }
        } else {
            //Can't start new expedition if life hasn't started. Search zone needed.
            document.querySelectorAll("#searchZoneWarning").forEach((element) => { element.classList.remove("hidden") })
        }
        if(discoveryProbability > 0){
            document.getElementById("expeditionProbability").innerText = (discoveryProbability * 100).toFixed(1)+"%"
        } else {
            document.getElementById("expeditionProbability").innerText = "("+translate(language, "Unknown yet", "f")+")"
            if(lifeStarted){
                document.getElementById("expeditionStart").classList.add("hidden")
                document.getElementById("newExpeditionNoActions").classList.remove("hidden")
            } else {
                document.querySelectorAll("#searchZoneWarning").forEach((element) => { element.classList.add("hidden") })
            }
        }

        //Expedition crew well formed? It has at least one expeditionary or horse?
        if(expeditionariesAlreadyAssigned /*&& expeditionariesAlreadyAssigned + horsesAlreadyAssigned*/){
            if(e.target.getAttribute("data-class") == "newExpedition"){
                //Calculate required expedition time.
                let timeRequired = expeditionRequiredTime(expeditionTypeInfo.type, expeditionTypeInfo.type == "of resources" ? resourcesExpeditionsDone : ruinsExpeditionsDone, (assignedExpeditionaries <= horsesAlreadyAssigned) ? assignedExpeditionaries : 0)
                //Update expedition required time.
                document.getElementById("newExpedition-required-info").classList.remove("hidden")
                document.querySelectorAll(".unknownTime").forEach((elem) => elem.classList.add("hidden"))
                if(timeRequired.inGame.clock.years > 0){ 
                    document.getElementById("newExpedition-required-years").classList.remove("hidden")
                    document.getElementById("newExpedition-required-yearsText").classList.remove("hidden")
                    document.getElementById("newExpedition-required-yearsComma").classList.remove("hidden")
                } else {document.querySelectorAll("#newExpedition-required-years, #newExpedition-required-yearsText, #newExpedition-required-yearsComma").forEach((elem) => elem.classList.add("hidden"))}
                document.getElementById("newExpedition-required-years").innerText = timeRequired.inGame.clock.years
                document.getElementById("newExpedition-required-yearsText").innerText = timeRequired.inGame.clock.years != 1 ? translate(language, "Years", "lowercase") : translate(language, "Years", "lowercase").slice(0, -1)
                if(timeRequired.inGame.clock.weeks > 0){ 
                    document.getElementById("newExpedition-required-weeks").classList.remove("hidden")
                    document.getElementById("newExpedition-required-weeksText").classList.remove("hidden")
                    document.getElementById("newExpedition-required-weeksComma").classList.remove("hidden")
                } else {document.querySelectorAll("#newExpedition-required-weeks, #newExpedition-required-weeksText, #newExpedition-required-weeksComma").forEach((elem) => elem.classList.add("hidden"))}
                document.getElementById("newExpedition-required-weeks").innerText = timeRequired.inGame.clock.weeks
                document.getElementById("newExpedition-required-weeksText").innerText = timeRequired.inGame.clock.weeks != 1 ? translate(language, "Weeks", "lowercase") : translate(language, "Weeks", "lowercase").slice(0, -2)+"."
                if(timeRequired.inGame.clock.days > 0){ 
                    document.getElementById("newExpedition-required-days").classList.remove("hidden")
                    document.getElementById("newExpedition-required-daysText").classList.remove("hidden")
                    document.getElementById("newExpedition-required-daysComma").classList.remove("hidden")
                } else {document.querySelectorAll("#newExpedition-required-days, #newExpedition-required-daysText, #newExpedition-required-daysComma").forEach((elem) => elem.classList.add("hidden"))}
                document.getElementById("newExpedition-required-days").innerText = timeRequired.inGame.clock.days
                document.getElementById("newExpedition-required-daysText").innerText = timeRequired.inGame.clock.days != 1 ? translate(language, "Days", "lowercase") : translate(language, "Days", "lowercase").slice(0, -1)
                document.getElementById("newExpedition-required-hours").innerText = timeRequired.inGame.clock.hours
            }
        } else {
            if(lifeStarted){
                document.getElementById("expeditionStart").classList.add("hidden")
                document.getElementById("newExpeditionNoActions").classList.remove("hidden")
            } else {
                document.querySelectorAll("#searchZoneWarning").forEach((element) => { element.classList.add("hidden") })
            }
            //Hide required time info and show "(Unknown yet)"
            document.getElementById("newExpedition-required-info").classList.add("hidden")
            document.querySelectorAll(".unknownTime").forEach((elem) => elem.classList.remove("hidden"))
        }
    }
    e.target.addEventListener("click", handleToggleWorker)
}

//Testing functionality
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
    searchingZone = true
    //Avoid modal pop up when zone searched
    showModalZoneSearched = false
    //Assign role to citizen 1 & 6 manually
    citizenIndex = 1;
    assign_role_to_citizen("expeditioning", translate(language, "Expeditionary", "f"), "map-location-dot", false)
    citizenIndex = 2;
    assign_role_to_citizen("expeditioning", translate(language, "Expeditionary", "f"), "map-location-dot", false)
    citizenIndex = 3;
    assign_role_to_citizen("expeditioning", translate(language, "Expeditionary", "f"), "map-location-dot", false)
    citizenIndex = 4;
    assign_role_to_citizen("fishing", translate(language, "fisher", "f", "capitalized"), "fish", false)
    citizenIndex = 6;
    assign_role_to_citizen("expeditioning", translate(language, "Expeditionary", "m"), "map-location-dot", false)
    citizenIndex = 7;
    assign_role_to_citizen("expeditioning", translate(language, "Expeditionary", "m"), "map-location-dot", false)
    citizenIndex = 8;
    assign_role_to_citizen("expeditioning", translate(language, "Expeditionary", "m"), "map-location-dot", false)
    /**/
    //daysPassed = 6

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Panel Citizens - Action: Assign Role
document.querySelectorAll(".assignRole").forEach((value, index) => {
    value.addEventListener("click", function(e){
        //Get citizen & gender
        citizenIndex = e.target.id ? e.target.id.match(/\d+/g)[0] : e.target.parentElement.id.match(/\d+/g)[0]
        gender = document.querySelector("#citizen-"+citizenIndex+"-gender-icon").classList.contains("fa-venus") ? "F" : "M"
        let objectData = {"language": language, "gender": gender, "parentId": "#accordion-citizen-"+citizenIndex+"-body"}
        //Build assign role panel
        assignRolePanel = new panel("assignRole", objectData, "citizen", citizenIndex, "actions")
        assignRolePanel.hidePreviousOptions()
        assignRolePanel.buildPanel()
        //For each button with an assignable role, add a click event
        document.querySelectorAll(".assignableRole").forEach((valueButton) => {
            valueButton.addEventListener("click", (e) => {
                assign_role_to_citizen(e.target.getAttribute("data-rolekey"), e.target.innerText, e.target.getAttribute("data-icon"))
            })
        })
    })
})

document.querySelector("#searchZone").addEventListener("click", searchZone)