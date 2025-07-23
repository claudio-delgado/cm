//See init.js to check global variables and constants.

const initColonyInfo = () => {
    language = "ES", colonyScore = 0, colonyLifeQuality = 10
    citizensAmount = 10, citizensFemaleAmount = 5, citizensMaleAmount = 5
    daysPassed = 0, dayPassed = false, weekPassed = false
    wagonsAmount = 3, horsesAmount = 6
    //colony_water_reservoir = water_reservoirs[Math.floor(Math.random() * water_reservoirs.length)].name
    colony_water_reservoir = Object.keys(water_reservoirs)[Math.floor(Math.random() * Object.keys(water_reservoirs).length)]
}
const loadInitialRandomGoods = () => {
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
const colonySatisfaction = (lifeQuality, population) => {
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
const searchZone = (e) => {
    document.querySelector("#searchZone > span").innerText = translate(language, "Your citizens are searching the zone...")
    document.querySelector("#searchZone > i").classList.add("fa-beat")
    searchingZone = true
    e.target.removeEventListener("click", searchZone)
}

const lifeInterval = setInterval(() => {
    let currentYear = currentWeek = currentDay = currentHour = 0
    //Zone searched
    const zone_searched_actions = () => {
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
        s2 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s1); s2.create(); s2.appendContent(translate(language, "Occupation"))
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
                citizens[citizenIndex].status = "working"
            }
        })
        //Update possible actions blocked by not having searched the zone previously.
        if(document.querySelectorAll(".newExpedition .assignedWorkers .assignedWorker").length){
            //If there were expeditionaries assigned to an expedition, add button to start it.
            document.getElementById("newExpeditionNoActions").classList.add("hidden")
            document.querySelector("#expeditionStart").classList.remove("hidden")
        }
    }
    //Hour passed
    const move_time = () => {
        //Update hours.
        currentHour = Number(document.querySelector("#currentHour").innerText)
        currentHour = ((currentHour < 23 ? currentHour+1 : 0)+"").padStart(2, "0")
        document.querySelector("#currentHour").innerText = currentHour
        //Daily flag
        dayPassed = (currentHour == "00")
        //Update days.
        daysPassed+= (dayPassed ? 1 : 0)
        currentDay = Number(document.querySelector("#currentDay").innerText)
        currentDay = 1 + (daysPassed % 7)
        document.querySelector("#currentDay").innerText = currentDay
        //Update weeks.
        currentWeek = Number(document.querySelector("#currentWeek").innerText)
        currentWeek = 1 + (Math.floor(daysPassed / 7) % 52)
        //Weekly flag
        weekPassed = dayPassed && Math.floor(daysPassed / 7) == daysPassed / 7
        document.querySelector("#currentWeek").innerText = currentWeek
        document.querySelector("#passedWeeks").innerText = Math.floor(daysPassed / 7)
        //Update years.
        currentYear = Number(document.querySelector("#currentYear").innerText)
        currentYear = 1 + Math.floor(daysPassed / 364)
        //Yearly flag
        yearPassed = dayPassed && Math.floor(daysPassed / 364) == daysPassed / 364
        document.querySelector("#currentYear").innerText = currentYear
    }
    //Day passed
    const update_all_citizens_xp = () => {
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
                citizens[citizenIndex].xp = newXP
            }
        })
    }
    const update_fish_and_water_assigned_workers = () => {
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
                citizens[citizenIndex].xp = newXP
            }
        })
    }
    const update_resource_extractions = () => {
        //Update resource extractions
        let dailyWaterGained = document.querySelector("#colony-water-income").innerText * 1 - document.querySelector("#colony-water-consumption").innerText * 1
        document.querySelectorAll("#colony-water-stock").forEach((value) => {
            value.innerText = value.innerText * 1 + (dailyWaterGained)
        })
        let dailyFoodGained = document.querySelector("#colony-food-income").innerText * 1 - document.querySelector("#colony-food-consumption").innerText * 1
        document.querySelectorAll("#colony-food-stock").forEach((value) => {
            value.innerText = value.innerText * 1 + (dailyFoodGained)
        })
    }
    const update_running_productions = () => {
        //Update running productions
        product_rules_defined.forEach((product_rule, product_index) => {
            if(product_rule.status == "running"){
                let rule_object = product_rule.object
                //Check if requirements are currently fulfilled.
                let requirement_fulfilled = true
                product_rule.rule_definition.requirements.forEach((req) => {
                    if(!req.consumable){
                        if(req.type == "citizen"){
                            req.workers.forEach((citizen_index) => {
                                requirement_fulfilled &&= (citizens[citizen_index].status == "working" && citizens[citizen_index].rolekey == req.role)
                            })
                        }
                    } else {
                        //Check if product or resource quantity needed is available.
                    }
                })
                if(!requirement_fulfilled){
                    product_rules[product_index].status = "suspended"
                } else {
                    //Update product stock with new value.
                    stockValues.products["EN"][rule_object]+= product_rule.rule_definition.result.quantity
                    stockValues.products["ES"][translate("ES", rule_object)]+= product_rule.rule_definition.result.quantity
                    stockDisplayed.products["EN"][rule_object]+= product_rule.rule_definition.result.quantity
                    stockDisplayed.products["ES"][translate("ES", rule_object)]+= product_rule.rule_definition.result.quantity
                    updateStock()
                }
            }
        })
    }
    //Week passed
    const update_pregnacies_remaining_weeks = () => {
        //Update pregnancy remaining weeks for all pregnancies.
        pregnancies.forEach((pregnancy) => {
            pregnancy.remaining_weeks = Math.max(0, pregnancy.remaining_weeks - 1)
            document.querySelector(`#citizen-${pregnancy.mother}-pregnancy-weeks`).innerHTML = pregnancy.remaining_weeks                
            if(!pregnancy.remaining_weeks){
                //Pregnancy is over. Child or children are to be born.
                //1) Change mother status from "pregnant" to "idle".
                document.getElementById(`citizen-${pregnancy.mother}-status`).setAttribute("data-status", "idle")
                document.getElementById(`citizen-${pregnancy.mother}-status`).innerHTML = translate(language, "idle")
                citizens[pregnancy.mother].status = "idle"
                //Hide pregnancy remaining weeks for the current mother.
                document.getElementById(`citizen-${pregnancy.mother}-status`).parentElement.querySelectorAll(".pregnant").forEach((element) => element.classList.add("hidden"))
                //2) Reduce father and mother's fertility, based on his and her current children.
                let father_children = citizens[pregnancy.father].children.length
                let mother_children = citizens[pregnancy.mother].children.length
                //Decrement father's fertility in memory and screen (set 0 if negative)
                citizens[pregnancy.father].fertility = Math.max(citizens[pregnancy.father].fertility - (father_children + pregnancy.children), 0)
                document.getElementById(`citizen-${pregnancy.father}-fertility`).innerHTML = citizens[pregnancy.father].fertility
                //Decrement mother's fertility in memory and screen (set 0 if negative)
                citizens[pregnancy.mother].fertility = Math.max(citizens[pregnancy.mother].fertility - (mother_children + pregnancy.children), 0)
                document.getElementById(`citizen-${pregnancy.mother}-fertility`).innerHTML = citizens[pregnancy.mother].fertility
                //Loop all born babies
                for(let citizen_index = 1; citizen_index <= pregnancy.children; citizen_index++){
                    //3) Create a new baby citizen and fill his or her info.
                    let born_citizen = to_be_born_citizen = {}
                    //4) Assign mother and father to new baby citizen.
                    to_be_born_citizen.father = pregnancy.father
                    to_be_born_citizen.mother = pregnancy.mother
                    born_citizen = build_citizen(true, undefined, to_be_born_citizen)
                }
                //5) Remove pregnancy from memory.
                pregnancies = pregnancies.filter(a_pregnancy => !(a_pregnancy.father == pregnancy.father && a_pregnancy.mother == pregnancy.mother))
            }
        })
    }
    const update_month_week = () => {
        //Update month week in every breeding attempt panel (also fertility week color)
        document.querySelectorAll("p.fertility.woman").forEach((elem) => {
            let fertility_week = elem.querySelector(".fertility-week.value").innerHTML
            let month_week = (document.querySelector("#currentWeek").innerHTML*1) % 4
            month_week = !month_week ? 4 : month_week
            elem.querySelector(".fertility-week.month-week").innerHTML = month_week
            if(fertility_week == month_week){
                elem.querySelectorAll(".fertility-week").forEach((elem) => elem.classList.remove("text-gray-300"))
                elem.querySelectorAll(".fertility-week").forEach((elem) => elem.classList.add("text-green-500"))
                elem.querySelector(".fertility-week.week-comparison").classList.add("fa-equals")
                elem.querySelector(".fertility-week.week-comparison").classList.remove("fa-not-equal")
            } else {
                elem.querySelectorAll(".fertility-week").forEach((elem) => elem.classList.remove("text-green-500"))
                elem.querySelectorAll(".fertility-week").forEach((elem) => elem.classList.add("text-gray-300"))
                elem.querySelector(".fertility-week.week-comparison").classList.add("fa-not-equal")
                elem.querySelector(".fertility-week.week-comparison").classList.remove("fa-equals")
            }
        })
    }
    const close_breeding_panels = () => {
        document.querySelectorAll(".tryBreeding").forEach((elem) => {
            //Get relationship index from id.
            let relationship_id = elem.id.split("-")[1]
            //Remove panel divs.
            document.querySelector(`#relationship-${relationship_id}-tryBreeding-title`).remove()
            document.querySelector(`#relationship-${relationship_id}-tryBreeding`).remove()
            //Show previous hidden actions.
            document.querySelector(`#relationship-${relationship_id}-actions`).classList.remove("hidden")
            document.querySelector(`#relationship-${relationship_id}-actions-title`).classList.remove("hidden")
        })
    }
    const update_all_citizens_age = () => {
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
    //Year passed
    const decrease_all_citizens_fertility = () => {
        //Decrease all citizen's fertility if aged >= 21
        citizens.forEach((citizen) => {
            citizen.fertility = citizen.ageYears >= 21 ? Math.max(citizen.fertility - 1, 0) : citizen.fertility
            document.getElementById(`citizen-${citizen.id}-fertility`).innerHTML = citizen.fertility
            if(!citizen.fertility) document.getElementById(`citizen-${citizen.id}-fertility`).classList.add("text-red-500")
        })
    }

    if(lifeStarted || searchingZone){
        
        //Hour passed
        move_time()
        
        //Zone searched flag
        zoneSearched = currentYear == 1 && currentWeek == 1 && currentDay == 1 && currentHour == zoneSearchHoursNeeded
        
        //Perform updating tasks inside game panels that involve hourly changes
        //Process countdowns
        processCountdowns()
        
        //Perform updating tasks inside game panels that involve daily, weekly or yearly changes
        //Efectuar tareas de actualización de partes del juego que involucren avances diarios, semanales o anuales.
        //console.log("y"+currentYear+"w"+currentWeek+"d"+currentDay+"h"+currentHour+", daysPassed: "+daysPassed+" dayPassed: "+dayPassed+", weekPassed: "+weekPassed)
        
        if(zoneSearched){
            zone_searched_actions()
        }

        if(dayPassed){
            
            //Update citizens xp
            update_all_citizens_xp()
            
            //Update permanently assigned water bearers or fishermen
            update_fish_and_water_assigned_workers()
            
            //Update resource extractions
            update_resource_extractions()

            //Update running productions
            update_running_productions()

        }

        if(weekPassed){
            
            //Update citizens age
            update_all_citizens_age()

            //If Try breeding panels are open, close them.
            //This is because if the week changed, those panels must be reloaded to reflect changes of current month week.
            //Find all "Try breeding" open panels.
            close_breeding_panels()
            
            //Update month week in every breeding attempt panel (also fertility week color)
            update_month_week()
            
            //Update pregnancy remaining weeks for all pregnancies.
            update_pregnacies_remaining_weeks()

        }

        if(yearPassed){

            //Decrease all citizen's fertility if aged >= 21
            decrease_all_citizens_fertility()

        }
    }
}, 1790);

const processCountdowns = () => {
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

const endActiveExpedition = (expeditionType) => {
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
            citizens[citizenIndex].status = "idle"
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

const citizenDescription = (gender, birthWeeks, language, texts, attributes, genderPlacement) => {
    let textAttr = "", prefix = "", gen = (gender == "Femenine" || gender == "Femenino" ? "F" : "M"), adjective = "", text = ""
    let connector, noun
    if(language == "ES" && (texts == "Ella es una" || texts == "El es un")) { connector = " y " }
    if(language == "ES" && !(texts == "Ella es una" || texts == "El es un")) { connector = " o " }
    if(language == "EN" && (texts == "She is a" || texts == "He is a")) { connector = " and " }
    if(language == "EN" && !(texts == "She is a" || texts == "He is a")) { connector = " or " }
    //Check citizen age
    switch(true){
        case birthWeeks <= 311: noun = (gen == "F" ? "beba" : "bebé"); break
        case birthWeeks > 311 && birthWeeks <= 727: noun = (gen == "F" ? "nena" : "nene"); break
        case birthWeeks > 727 && birthWeeks <= 1091: noun = (gen == "F" ? "chica" : "chico"); break
        case birthWeeks > 1091 && birthWeeks <= 3379: noun = (gen == "F" ? "mujer" : "hombre"); break
        case birthWeeks > 3379: noun = (gen == "F" ? "anciana" : "anciano"); break
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
const updateCitizenDescription = (citizenIndex, gender, birthWeeks, citizenOwnAttributes, citizenWishedAttributes, citizenHatedAttribute) => {
    let descriptionText1 = {"ES" : {"F": "Ella es una", "M": "El es un"}, "EN" : {"F": "She is a", "M": "He is a"}}
    let descriptionText2 = {"ES" : {"F": "A ella le gusta un", "M": "A él le gusta una"}, "EN" : {"F": "She likes a", "M": "He likes a"}}
    let descriptionText3 = {"ES" : {"F": "Ella prefiere que no sea", "M": "Él prefiere que no sea"}, "EN" : {"F": "She prefers a no", "M": "He prefers a no"}}
    let other_gender = gender == "Femenine" ? "Masculine" : "Femenine"
    citizenBio = citizenDescription(gender, birthWeeks, language, descriptionText1[language][gender.charAt(0)], citizenOwnAttributes, language=="ES" ? "left" : "right")+"."
    //Only show possible future partner features if he or she is no baby.
    if(birthWeeks >= 728){
        citizenBio+= "</br>"+citizenDescription(other_gender, birthWeeks, language, descriptionText2[language][gender.charAt(0)], citizenWishedAttributes, language=="ES" ? "left" : "right")+".</br>"
        citizenBio+= citizenDescription(other_gender, birthWeeks, language, descriptionText3[language][gender.charAt(0)], citizenHatedAttribute, language=="ES" ? "none" : "right")
    }
    //Place description in citizen's description panel, removing previous one if existed.
    document.querySelector("#citizen-"+citizenIndex+"-description").innerHTML = "\""+citizenBio+"\""
}
const set_random_name = (language, gender = ["Femenine", "Masculine"][Math.floor(Math.random()*2)], exclusion_set = false) => {
    let female_names, male_names, female_families, male_families
    //Cut all excluded names and families.
    if(exclusion_set){
        let set_exclusion_names_female = new Set(exclusion_set.names.female)
        if(female_names.length > set_exclusion_names_female.length){
            let set_female_names = new Set(naming['names'][language]['F'])
            let set_allowed_female_names = set_female_names.difference(set_exclusion_names_female)
            female_names = [...set_allowed_female_names]
        }
        let set_exclusion_names_male = new Set(exclusion_set.names.male)
        if(male_names.length > set_exclusion_names_male.length){
            let set_male_names = new Set(naming['names'][language]['M'])
            let set_allowed_male_names = set_male_names.difference(set_exclusion_names_male)
            male_names = [...set_allowed_male_names]
        }
        let set_exclusion_families_female = new Set(exclusion_set.families.female)
        if(female_families.length > set_exclusion_families_female.length){
            let set_female_families = new Set(naming['families'][language]['F'])
            let set_allowed_female_families = set_female_families.difference(set_exclusion_families_female)
            female_families = [...set_allowed_female_families]
        }
        let set_exclusion_families_male = new Set(exclusion_set.families.male)
        if(male_families.length > set_exclusion_families_male.length){
            let set_male_families = new Set(naming['families'][language]['M'])
            let set_allowed_male_families = set_male_families.difference(set_exclusion_families_male)
            male_families = [...set_allowed_male_families]
        }
    } else {
        female_names = naming['names'][language]['F']
        male_names = naming['names'][language]['M']
        female_families = naming['families'][language]['F']
        male_families = naming['families'][language]['M']
    }
    let name = family = "", random_value, random_index
    //Define random name
    if(gender == "Femenine" || gender.charAt(0) == "F"){
        random_value = Math.random(), random_index = Math.floor(random_value * female_names.length)
        name = female_names[random_index]
    } else {
        let random_value = Math.random(), random_index = Math.floor(random_value * male_names.length)
        name = male_names[random_index]
    }
    if(name == undefined) debugger
    //Define random family name
    if(gender == "Femenine" || gender.charAt(0) == "F"){
        random_value = Math.random(), random_index = Math.floor(random_value * female_families.length)
        family = female_families[random_index]
    } else {
        random_value = Math.random(), random_index = Math.floor(random_value * male_families.length)
        family = male_families[random_index]
    }
    if(family == undefined) debugger
    return name + ", " + family
}
const setRandomNames = (language) => {
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
        citizens[i].name = randomCitizenName+", "+randomCitizenFamily
        document.querySelector("#citizen-"+i+"-name").innerHTML = citizens[i].name
        //"<i id='citizen-"+i+"-gender-icon' class='text-red-500 fa fa-venus me-1'></i><i id='citizen-"+i+"-role-icon' class='text-green-500 hidden fa me-1'></i></i><span class='text-yellow-500 border border-yellow-500 rounded px-1 me-1'>2</span>"+
    }
}
const getRandomAttributes = (language, amount = 3, excludeThis = []) => {
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
const custom_accordion = (header_element_id = null, body_element_id = null, callback = () => {}) => {
    let header_element = document.getElementById(header_element_id) != undefined ? document.getElementById(header_element_id) : null
    let body_element = document.getElementById(body_element_id) != undefined ? document.getElementById(body_element_id) : null
    if(header_element != null && body_element != null){
        header_element.querySelectorAll(".clickable").forEach((elem) => {
            elem.addEventListener("click", (e) => {
                let collapsable = e.target.closest(".clickable").querySelector("i.collapsable")
                e.target.closest(".clickable").classList.toggle("bg-gray-900")
                e.target.closest(".clickable").classList.toggle("bg-gray-800")
                collapsable.classList.toggle("fa-chevron-down")
                collapsable.classList.toggle("fa-chevron-up")
                body_element.classList.toggle("hidden")
                if(collapsable.classList.contains("fa-chevron-up")){
                    callback(body_element)
                }
            })
        })
    } else {
        console.log("Error while trying to attach custom accordion events")
    }
}

initColonyInfo()

accordionNews()
addNews("Welcome")
accordionColony()
accordionBuildings()
accordionCitizens(citizensAmount)
accordionRelationships()
accordion_landforms()
accordionExpeditions()
translateAll(language)

enableNotificationEvents()

const process_worker_assignation = (citizen_index, assigned_where) => {
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
const process_worker_deassignation = (citizen_index, deassigned_from_where) => {
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
const toggle_assignable_worker = (e) => {
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
            //Change status in global citizens array
            citizens[citizen_index].status = citizenNewStatus
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
            //Change status in global citizens array
            citizens[citizen_index].status = "idle"
            process_worker_deassignation(citizen_index, assigned_where)
        })
    }
    
}
const assign_role_to_citizen = (citizen_id, rolekey, roleText, roleIcon, assignRolePanelExists = true) => {
    //Check if citizen is idle or busy.
    if(document.querySelector("#citizen-"+citizen_id+"-status").getAttribute("data-status") == "idle"){
        //Check previous role if exists.
        previousRole = document.querySelector("#citizen-"+citizen_id+"-role").getAttribute("data-role")
        //If citizen have had another role previously, change all panels in which the role was involved
        if(previousRole != translate(language, "Unassigned")){ 
            post_conditions_changing_role(previousRole, citizen_id) 
        }
        //Update role in Citizen's info.
        document.querySelector("#citizen-"+citizen_id+"-role").innerText = roleText
        document.querySelector("#citizen-"+citizen_id+"-role").setAttribute("data-role", rolekey)
        citizens[citizen_id].role = roleText
        citizens[citizen_id].rolekey = rolekey
        //Update role icon in Citizen's info.
        document.querySelector("#citizen-"+citizen_id+"-role-icon").classList.remove("hidden")
        document.querySelector("#citizen-"+citizen_id+"-role-icon").classList = "text-green-500 fa me-1 fa-"+roleIcon
        if(assignRolePanelExists){
            assignRolePanel.removePanel()
            assignRolePanel.showPreviousOptions()
        }
        //New role is "Water bearer"?
        if(["waterbearing", "fishing"].includes(rolekey)){
            //Add citizen to Water Reservoir Assignable workers.
            add_assignable_worker_to_mount(citizen_id, "waterReservoir")
            //Add behavior when clicking selecting box. Toggle color from gray to green and process efects in other panels.
            document.getElementById("waterReservoir-citizen-"+citizen_id+"-assign").addEventListener("click", 
                toggle_assignable_worker
            )
            /*
            document.getElementById("citizen-"+citizen_id+"-assign").setAttribute("data-class", "waterReservoir")
            document.getElementById("citizen-"+citizen_id+"-assign").addEventListener("click", handleToggleWorker)
            */
        }       
        if(rolekey == "expeditioning"){
            if(document.querySelector("#expeditions-newExpedition") != null){
                addAvailableWorkerToExpedition(citizen_id, "newExpedition")
                document.getElementById("citizen-"+citizen_id+"-assign").setAttribute("data-class", "newExpedition")
                document.getElementById("citizen-"+citizen_id+"-assign").addEventListener("click", handleToggleWorker)
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
//Relationship citizen manipulation
const draw_parents_of_citizen = (a_citizen) => {
    let parents_div = document.querySelector(`#citizen-${a_citizen.id}-parents`)
    parents_div.querySelectorAll("p").forEach((elem) => elem.remove())
    //Add parent.
    let parents = [], type
    if(a_citizen.father != null){ parents.push(citizens[a_citizen.father])} 
    if(a_citizen.mother != null){ parents.push(citizens[a_citizen.mother])} 
    parents.forEach((a_parent) => {
        type = a_parent.gender.charAt(0) == "F" ? "mother" : "father"
        p = new element("p", `${type} ms-1 mt-1 mb-1 text-xs flex w-100 justify-between gap-2 px-1 text-white`, [], parents_div); p.create()
        h2 = new element("h2", "grow", [], p.getNode()); h2.create()
        d2 = new element("div", "flex items-center justify-between gap-1 w-full py-1 px-2 text-xs text-gray-400 bg-gray-700 border border-gray-200", [], h2.getNode()); d2.create()
        s = new element("span", "", [], d2.getNode()); s.create()
        let gender_class = a_parent.gender.charAt(0) == "F" ? "venus" : "mars"
        let gender_color = a_parent.gender.charAt(0) == "F" ? "red" : "blue"
        i = new element("i", `fa fa-${gender_class} text-${gender_color}-500`, [], s.getNode()); i.create()
        s1 = new element("span", `font-bold bg-gray-600 border border-gray-500 text-${gender_color}-400 px-1 ms-1`, [{"key":"data-i18n", "value":""}], s.getNode()); s1.create()
        s1.appendContent(translate(language, type, "", "capitalized"))
        s1 = new element("span", "ms-2 text-gray-200", [], s.getNode()); s1.create(); s1.appendContent(a_parent.name)
        s = new element("span", "", [], d2.getNode()); s.create()
        i = new element("i", "fa fa-eye", [{"key":"data-index", "value":a_parent.id}], s.getNode(), `parent-${a_parent.id}-view-info`); i.create()
        i.getNode().addEventListener("click", modal_citizen_info)
    })
}
const add_parent_to_citizen = (a_parent, a_citizen, type = "mother") => {
    if(type == "father") citizens[a_citizen.id].father = a_parent.id
    if(type == "mother") citizens[a_citizen.id].mother = a_parent.id
    //Add parents to specific panel.
    if(document.querySelector(`#citizen-${a_citizen.id}-parents p.empty`) != undefined){
        //Remove "None" message.
        document.querySelector(`#citizen-${a_citizen.id}-parents p.empty`).remove()
    }
    if(document.querySelector(`#citizen-${a_citizen.id}-parents p.${type}`) != undefined){
        //Remove previous parent. (It will be replaced by new one)
        document.querySelector(`#citizen-${a_citizen.id}-parents p.${type}`).remove()
    }
    let parents_div = document.querySelector(`#citizen-${a_citizen.id}-parents`)
    //Add parent.
    p = new element("p", `${type} ms-1 mt-1 mb-1 text-xs flex w-100 justify-between gap-2 px-1 text-white`, [], parents_div); p.create()
    h2 = new element("h2", "grow", [], p.getNode()); h2.create()
    d2 = new element("div", "flex items-center justify-between gap-1 w-full py-1 px-2 text-xs text-gray-400 bg-gray-700 border border-gray-200", [], h2.getNode()); d2.create()
    s = new element("span", "", [], d2.getNode()); s.create()
    let gender_class = a_parent.gender.charAt(0) == "F" ? "venus" : "mars"
    let gender_color = a_parent.gender.charAt(0) == "F" ? "red" : "blue"
    i = new element("i", `fa fa-${gender_class} text-${gender_color}-500`, [], s.getNode()); i.create()
    s1 = new element("span", `font-bold bg-gray-600 border border-gray-500 text-${gender_color}-400 px-1 ms-1`, [{"key":"data-i18n", "value":""}], s.getNode()); s1.create()
    s1.appendContent(translate(language, type, "", "capitalized"))
    s1 = new element("span", "ms-2 text-gray-200", [], s.getNode()); s1.create(); s1.appendContent(a_parent.name)
    s = new element("span", "", [], d2.getNode()); s.create()
    i = new element("i", "fa fa-eye", [{"key":"data-index", "value":a_parent.id}], s.getNode(), `parent-${a_parent.id}-view-info`); i.create()
    i.getNode().addEventListener("click", modal_citizen_info)
}
const draw_children_of_citizen = (a_citizen) => {
    let children_div = document.querySelector(`#citizen-${a_citizen.id}-children`)
    children_div.querySelectorAll("p").forEach((elem) => elem.remove())
    for(let index = 0; index < a_citizen.children.length; index++){
        let a_child = citizens[a_citizen.children[index]]
        //Add child.
        p = new element("p", "ms-1 mt-1 mb-1 text-xs flex w-100 justify-between gap-2 px-1 text-white", [], children_div); p.create()
        h2 = new element("h2", "grow", [], p.getNode()); h2.create()
        d2 = new element("div", "flex items-center justify-between gap-1 w-full py-1 px-2 text-xs text-gray-400 bg-gray-700 border border-gray-200", [], h2.getNode()); d2.create()
        s = new element("span", "", [], d2.getNode()); s.create()
        let gender_class = a_child.gender.charAt(0) == "F" ? "venus" : "mars"
        let gender_color = a_child.gender.charAt(0) == "F" ? "red" : "blue"
        i = new element("i", `fa fa-${gender_class} text-${gender_color}-500`, [], s.getNode()); i.create()
        let child_type = a_child.gender.charAt(0) == "F" ? "Daughter" : "Son"
        s1 = new element("span", `font-bold bg-gray-600 border border-gray-500 text-${gender_color}-400 px-1 ms-1`, [{"key":"data-i18n", "value":""}], s.getNode()); s1.create()
        s1.appendContent(translate(language, child_type, "", "capitalized"))
        s1 = new element("span", "ms-2 text-gray-200", [], s.getNode()); s1.create(); s1.appendContent(a_child.name)
        s = new element("span", "", [], d2.getNode()); s.create()
        i = new element("i", "fa fa-eye", [{"key":"data-index", "value":a_child.id}], s.getNode(), `child-${a_child.id}-view-info`); i.create()
        i.getNode().addEventListener("click", modal_citizen_info)
    }
}
const add_child_to_citizen = (a_child, a_citizen) => {
    citizens[a_citizen.id].children.push(a_child.id)
    //Add child to specific panel.
    if(document.querySelector(`#citizen-${a_citizen.id}-children p.empty`) != undefined){
        //Remove "None" message.
        document.querySelector(`#citizen-${a_citizen.id}-children p.empty`).remove()
    }
    let children_div = document.querySelector(`#citizen-${a_citizen.id}-children`)
    //Add child.
    p = new element("p", "ms-1 mt-1 mb-1 text-xs flex w-100 justify-between gap-2 px-1 text-white", [], children_div); p.create()
    h2 = new element("h2", "grow", [], p.getNode()); h2.create()
    d2 = new element("div", "flex items-center justify-between gap-1 w-full py-1 px-2 text-xs text-gray-400 bg-gray-700 border border-gray-200", [], h2.getNode()); d2.create()
    s = new element("span", "", [], d2.getNode()); s.create()
    let gender_class = a_child.gender.charAt(0) == "F" ? "venus" : "mars"
    let gender_color = a_child.gender.charAt(0) == "F" ? "red" : "blue"
    i = new element("i", `fa fa-${gender_class} text-${gender_color}-500`, [], s.getNode()); i.create()
    let child_type = a_child.gender.charAt(0) == "F" ? "Daughter" : "Son"
    s1 = new element("span", `font-bold bg-gray-600 border border-gray-500 text-${gender_color}-400 px-1 ms-1`, [{"key":"data-i18n", "value":""}], s.getNode()); s1.create()
    s1.appendContent(translate(language, child_type, "", "capitalized"))
    s1 = new element("span", "ms-2 text-gray-200", [], s.getNode()); s1.create(); s1.appendContent(a_child.name)
    s = new element("span", "", [], d2.getNode()); s.create()
    i = new element("i", "fa fa-eye", [{"key":"data-index", "value":a_child.id}], s.getNode(), `child-${a_child.id}-view-info`); i.create()
    i.getNode().addEventListener("click", modal_citizen_info)
}
const cancel_relationship = (e) => {
    let citizen_id = e.target.closest("button").getAttribute("data-citizen-id")
    let couple_id = citizens[citizen_id].couple
    //Remove couple citizens from memory array.
    citizens[citizen_id].couple = null
    citizens[couple_id].couple = null
    //Remove relationship if it exists.
    document.querySelectorAll(`[data-citizen-1="${citizen_id}"], [data-citizen-2="${citizen_id}"]`).forEach((elem) => {
        elem.remove()
        let relationships_div = document.getElementById("citizen-relationships")
        //If no relationships left, show "Not defined" message.
        if(!relationships_div.children.length){
            p = new element("p", "empty ms-1 mt-1 mb-2 text-xs flex w-100 justify-between gap-2 px-1 text-white", [], relationships_div); p.create()
            s = new element("span", "", [], p.getNode()); s.create()
            i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
            s1 = new element("span", "", [{"key":"data-i18n", "value":""}, {"key":"gender", "value":"f"}], s.getNode()); s1.create()
            s1.appendContent(translate(language, "Not defined (Make couples in Citizen's panel)"))
        }
    })
}
const try_breeding = (e) => {
    let current_relationship_id = e.target.closest("button").id.split("-")[1]
    let objectData = {"language": language, "parentId": `#accordion-relationship-${current_relationship_id}-body`}
    //Build panel
    let tryBreedingPanel = new panel("tryBreeding", objectData, "relationship", current_relationship_id, "actions")
    tryBreedingPanel.hidePreviousOptions()
    tryBreedingPanel.buildPanel()
    currently_used_panel = tryBreedingPanel
}
const assign_couple_to_citizen = (e) => {
    let couple_id = e.target.id.split("-")[2]
    //Mark assign icon.
    document.getElementById(`couple-citizen-${couple_id}-assign`).classList.remove("fa-square")
    document.getElementById(`couple-citizen-${couple_id}-assign`).classList.add("text-base", "text-green-400", "fa-square-check")
    setTimeout(() => {
        let citizen_id = e.target.closest(".searchCouple").id.split("-")[1]
        add_couple_to_citizen(citizens[couple_id], citizens[citizen_id])
        //Remove all candidates from panel.
        currently_used_panel.removePanel()
        currently_used_panel.showPreviousOptions()
    }, "500")
}
const draw_couple_of_citizen = (a_citizen) => {
    let couple_div = document.querySelector(`#citizen-${a_citizen.id}-couple`)
    couple_div.querySelectorAll("p").forEach((elem) => elem.remove())
    let a_couple = citizens[a_citizen.couple]
    //Add couple to citizen.
    p = new element("p", `ms-1 mt-1 mb-1 text-xs flex w-100 justify-between gap-2 px-1 text-white`, [], couple_div); p.create()
    h2 = new element("h2", "grow", [], p.getNode(), `#citizen-${a_citizen.id}-couple-${a_couple.id}`); h2.create()
    d2 = new element("div", "flex items-center justify-between gap-1 w-full py-1 px-2 text-xs text-gray-400 bg-gray-700 border border-gray-200", [], h2.getNode()); d2.create()
    s = new element("span", "", [], d2.getNode()); s.create()
    let couple_gender_class = a_couple.gender.charAt(0) == "F" ? "venus" : "mars"
    let couple_gender_color = a_couple.gender.charAt(0) == "F" ? "red" : "blue"
    i = new element("i", `fa fa-${couple_gender_class} text-${couple_gender_color}-500`, [], s.getNode()); i.create()
    s1 = new element("span", "ms-2 text-gray-200", [], s.getNode()); s1.create(); s1.appendContent(a_couple.name)
    s = new element("span", "", [], d2.getNode()); s.create()
    i = new element("i", "fa fa-eye me-2", [{"key":"data-index", "value":a_couple.id}], s.getNode(), `couple-${a_couple.id}-view-info`); i.create()
    i.getNode().addEventListener("click", modal_citizen_info)
    i = new element("i", "fa fa-ban", [{"key":"data-citizen-id", "value":a_couple.id}], s.getNode(), `couple-${a_couple.id}-cancel-relationship`); i.create()
    i.getNode().addEventListener("click", cancel_relationship)
    //Add citizen as couple to specific couple panel.
    if(document.querySelector(`#citizen-${a_couple.id}-couple p.empty`) != undefined){
        //Remove "None" message.
        document.querySelector(`#citizen-${a_couple.id}-couple p.empty`).remove()
    }
}
const add_couple_to_citizen = (a_couple, a_citizen) => {
    citizens[a_citizen.id].couple = a_couple.id
    citizens[a_couple.id].couple = a_citizen.id
    //Add couple to specific citizen panel.
    if(document.querySelector(`#citizen-${a_citizen.id}-couple p.empty`) != undefined){
        //Remove "None" message.
        document.querySelector(`#citizen-${a_citizen.id}-couple p.empty`).remove()
    }
    let couple_div = document.querySelector(`#citizen-${a_citizen.id}-couple`)
    //Add couple to citizen.
    p = new element("p", `ms-1 mt-1 mb-1 text-xs flex w-100 justify-between gap-2 px-1 text-white`, [], couple_div); p.create()
    h2 = new element("h2", "grow", [], p.getNode(), `#citizen-${a_citizen.id}-couple-${a_couple.id}`); h2.create()
    d2 = new element("div", "flex items-center justify-between gap-1 w-full py-1 px-2 text-xs text-gray-400 bg-gray-700 border border-gray-200", [], h2.getNode()); d2.create()
    s = new element("span", "", [], d2.getNode()); s.create()
    let couple_gender_class = a_couple.gender.charAt(0) == "F" ? "venus" : "mars"
    let couple_gender_color = a_couple.gender.charAt(0) == "F" ? "red" : "blue"
    i = new element("i", `fa fa-${couple_gender_class} text-${couple_gender_color}-500`, [], s.getNode()); i.create()
    s1 = new element("span", "ms-2 text-gray-200", [], s.getNode()); s1.create(); s1.appendContent(a_couple.name)
    s = new element("span", "", [], d2.getNode()); s.create()
    i = new element("i", "fa fa-eye me-2", [{"key":"data-index", "value":a_couple.id}], s.getNode(), `couple-${a_couple.id}-view-info`); i.create()
    i.getNode().addEventListener("click", modal_citizen_info)
    i = new element("i", "fa fa-ban", [{"key":"data-citizen-id", "value":a_couple.id}], s.getNode(), `couple-${a_couple.id}-cancel-relationship`); i.create()
    i.getNode().addEventListener("click", cancel_relationship)
    //Add citizen as couple to specific couple panel.
    if(document.querySelector(`#citizen-${a_couple.id}-couple p.empty`) != undefined){
        //Remove "None" message.
        document.querySelector(`#citizen-${a_couple.id}-couple p.empty`).remove()
    }
    couple_div = document.querySelector(`#citizen-${a_couple.id}-couple`)
    //Add citizen to couple.
    p = new element("p", `ms-1 mt-1 mb-1 text-xs flex w-100 justify-between gap-2 px-1 text-white`, [], couple_div); p.create()
    h2 = new element("h2", "grow", [], p.getNode()); h2.create()
    d2 = new element("div", "flex items-center justify-between gap-1 w-full py-1 px-2 text-xs text-gray-400 bg-gray-700 border border-gray-200", [], h2.getNode()); d2.create()
    s = new element("span", "", [], d2.getNode()); s.create()
    let citizen_is_woman = a_citizen.gender.charAt(0) == "F"
    let couple_is_woman = !citizen_is_woman
    let citizen_gender_class = citizen_is_woman ? "venus" : "mars"
    let citizen_gender_color = citizen_is_woman ? "red" : "blue"
    i = new element("i", `fa fa-${citizen_gender_class} text-${citizen_gender_color}-500`, [], s.getNode()); i.create()
    s1 = new element("span", "ms-2 text-gray-200", [], s.getNode()); s1.create(); s1.appendContent(a_citizen.name)
    s = new element("span", "", [], d2.getNode()); s.create()
    i = new element("i", "fa fa-eye me-2", [{"key":"data-index", "value":a_citizen.id}], s.getNode(), `couple-${a_citizen.id}-view-info`); i.create()
    i.getNode().addEventListener("click", modal_citizen_info)
    i = new element("i", "fa fa-ban", [{"key":"data-citizen-id", "value":a_citizen.id}], s.getNode(), `couple-${a_citizen.id}-cancel-relationship`); i.create()
    i.getNode().addEventListener("click", cancel_relationship)
    
    //Build relationship.
    //Check if there is no relationship yet.
    let relationships_div = document.querySelector("#citizen-relationships")
    if(![undefined, null].includes(relationships_div.querySelector("p.empty"))){
        //Remove "None" message.
        relationships_div.querySelector("p.empty").remove()
    }
    //Build new relationship accordion.
    d = new element("div", "mx-1 mb-1", [{"key":"data-accordion","value":"collapse"}, {"key":"data-citizen-1","value":a_citizen.id}, {"key":"data-citizen-2","value":a_couple.id}], relationships_div, `accordion-relationship-${relationship_id}`); d.create()
    h2 = new element("h2", "", [], d.getNode(), `accordion-relationship-${relationship_id}-title`); h2.create()
    b = new element("button", "text-xs unattached-click flex items-center justify-between w-full py-1 px-3 bg-gray-900 border border-gray-700 text-gray-400 hover:bg-gray-100 hover:bg-gray-800 gap-3", [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":`#accordion-relationship-${relationship_id}-body`},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":`accordion-relationship-${relationship_id}-body`}], h2.getNode())
    b.create()
    s = new element("span", "flex items-center", [], b.getNode()); s.create(); 
    i = new element("i", `fa fa-${citizen_gender_class} text-${citizen_gender_color}-400`, [], s.getNode()); i.create(); 
    s1 = new element("span", `ms-1 font-bold text-${citizen_gender_color}-400`, [], s.getNode()); s1.create(); s1.appendContent(a_citizen.name.split(",")[0])
    s1 = new element("span", "ms-2 text-gray-300", [], s.getNode()); s1.create(); s1.appendContent(translate(language, "y"))
    i = new element("i", `ms-2 fa fa-${couple_gender_class} text-${couple_gender_color}-400`, [], s.getNode()); i.create(); 
    s1 = new element("span", `ms-1 font-bold text-${couple_gender_color}-400`, [], s.getNode()); s1.create(); s1.appendContent(a_couple.name.split(",")[0])
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build new relationship accordion body
    d1 = new element("div", "hidden text-xs text-gray-200 border border-gray-800 bg-gray-600", [{"key":"aria-labelledby","value":`accordion-relationship-${relationship_id}-title`}], d.getNode(), `accordion-relationship-${relationship_id}-body`); d1.create()
    //Citizen's information
    d2 = new element("div", "mt-1 mb-1 mx-1 px-2 py-1 border border-gray-800 bg-gray-700", [], d1.getNode()); d2.create()
    p = new element("p", "flex", [], d2.getNode()); p.create()
    s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, a_citizen.gender.charAt(0) == "F" ? "she is" : "he is", "", "capitalized"))
    s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(a_citizen.name)
    let woman_class = citizen_is_woman ? "woman" : ""
    p = new element("p", `fertility ${woman_class} flex items-center text-gray-400`, [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Fertility", "", "capitalized"))
    s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
    let fertility_color = a_citizen.fertility >= 70 ? "text-green-500" : (a_citizen.fertility >= 45 ? "text-yellow-500" : (a_citizen.fertility >= 25 ? "text-orange-500" : (a_citizen.fertility >= 10 ? "text-red-400" : ("text-red-500"))))
    s = new element("span", `fertility ms-1 font-bold ${fertility_color}`, [], p.getNode()); s.create(); s.appendContent(a_citizen.fertility.toString())
    if(citizen_is_woman){
        let month_week = (document.getElementById("currentWeek").innerHTML*1 % 4) ? document.getElementById("currentWeek").innerHTML*1 % 4 : 4
        let comparison_icon = month_week == a_citizen.fertilityWeek ? "fa-equals" : "fa-not-equal"
        let fertility_class = month_week == a_citizen.fertilityWeek ? "text-green-500" : ""
        s = new element("span", "me-1", [], p.getNode()); s.create(); s.appendContent(",")
        s = new element("span", `fertility-week ${fertility_class}`, [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Fertile week", "", "capitalized"))
        s = new element("span", `fertility-week ${fertility_class}`, [], p.getNode()); s.create(); s.appendContent(":")
        s = new element("span", `fertility-week ${fertility_class} value ms-1 font-bold`, [], p.getNode()); s.create(); s.appendContent(a_citizen.fertilityWeek.toString())
        i = new element("i", `fertility-week mx-1 ${fertility_class} week-comparison fa ${comparison_icon}`, [], p.getNode()); i.create()
        s = new element("span", `fertility-week ${fertility_class}`, [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Month week", "", "capitalized"))
        s = new element("span", `fertility-week ${fertility_class}`, [], p.getNode()); s.create(); s.appendContent(":")
        s = new element("span", `fertility-week ${fertility_class} month-week ms-1 font-bold`, [], p.getNode()); s.create(); s.appendContent(month_week.toString())
    }
    p = new element("p", "py-1 my-1", [], d2.getNode()); p.create()
    p = new element("p", "flex text-gray-400", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, a_citizen.gender.charAt(0) == "F" ? "her attributes are" : "his attributes are", a_citizen.gender.charAt(0), "capitalized"))
    s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
    p = new element("p", "py-1 my-1", [], d2.getNode()); p.create()
    text_color = attributesColors[language][a_citizen.attributes[0]]
    s = new element("span", `px-2 py-0.5 me-1 text-center border border-gray-500 rounded bg-gray-800 text-xs font-bold ${text_color}`, [], p.getNode()); s.create(); s.appendContent(a_citizen.attributes[0])
    text_color = attributesColors[language][a_citizen.attributes[1]]
    s = new element("span", `px-2 py-0.5 me-1 text-center border border-gray-500 rounded bg-gray-800 text-xs font-bold ${text_color}`, [], p.getNode()); s.create(); s.appendContent(a_citizen.attributes[1])
    text_color = attributesColors[language][a_citizen.attributes[2]]
    s = new element("span", `px-2 py-0.5 me-1 text-center border border-gray-500 rounded bg-gray-800 text-xs font-bold ${text_color}`, [], p.getNode()); s.create(); s.appendContent(a_citizen.attributes[2])
    p = new element("p", "flex text-gray-400", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, a_citizen.gender.charAt(0) == "F" ? "her wished attributes are" : "his wished attributes are", a_citizen.gender.charAt(0), "capitalized"))
    s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
    p = new element("p", "py-1 my-1", [], d2.getNode()); p.create()
    text_color = attributesColors[language][a_citizen.wishedAttributes[0]]
    s = new element("span", `px-2 py-0.5 me-1 text-center border border-gray-500 rounded bg-gray-800 text-xs font-bold ${text_color}`, [], p.getNode()); s.create(); s.appendContent(a_citizen.wishedAttributes[0])
    text_color = attributesColors[language][a_citizen.wishedAttributes[1]]
    s = new element("span", `px-2 py-0.5 me-1 text-center border border-gray-500 rounded bg-gray-800 text-xs font-bold ${text_color}`, [], p.getNode()); s.create(); s.appendContent(a_citizen.wishedAttributes[1])
    text_color = attributesColors[language][a_citizen.wishedAttributes[2]]
    s = new element("span", `px-2 py-0.5 me-1 text-center border border-gray-500 rounded bg-gray-800 text-xs font-bold ${text_color}`, [], p.getNode()); s.create(); s.appendContent(a_citizen.wishedAttributes[2])
    p = new element("p", "flex items-center text-gray-400", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "dislikes attribute", "", "capitalized"))
    s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
    text_color = attributesColors[language][a_citizen.hatedAttribute]
    s = new element("span", `ms-1 px-2 py-0.5 me-1 text-center border border-gray-500 rounded bg-gray-800 text-xs font-bold ${text_color}`, [], p.getNode()); s.create(); s.appendContent(a_citizen.hatedAttribute)
    //Couple's information
    d2 = new element("div", "mt-1 mb-1 mx-1 px-2 py-1 border border-gray-800 bg-gray-700", [], d1.getNode()); d2.create()
    p = new element("p", "flex", [], d2.getNode()); p.create()
    s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "and", "", "capitalized"))
    s = new element("span", "me-1", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, !couple_is_woman ? "he is" : "she is"))
    s = new element("span", "font-bold", [], p.getNode()); s.create(); s.appendContent(a_couple.name)   
    woman_class = couple_is_woman ? "woman" : ""
    p = new element("p", "fertility flex items-center text-gray-400", [], d2.getNode()); p.create()
    s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(translate(language, "Fertility", "", "capitalized"))
    s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
    fertility_color = a_couple.fertility >= 70 ? "text-green-500" : (a_couple.fertility >= 45 ? "text-yellow-500" : (a_couple.fertility >= 25 ? "text-orange-500" : (a_couple.fertility >= 10 ? "text-red-400" : ("text-red-500"))))
    s = new element("span", `fertility ${woman_class} ms-1 font-bold ${fertility_color}`, [], p.getNode()); s.create(); s.appendContent(a_couple.fertility.toString())
    if(couple_is_woman){
        let month_week = (document.getElementById("currentWeek").innerHTML*1 % 4) ? document.getElementById("currentWeek").innerHTML*1 % 4 : 4
        let comparison_icon = month_week == a_couple.fertilityWeek ? "fa-equals" : "fa-not-equal"
        let fertility_class = month_week == a_couple.fertilityWeek ? "text-green-500" : ""
        s = new element("span", "me-1", [], p.getNode()); s.create(); s.appendContent(",")
        s = new element("span", `fertility-week ${fertility_class}`, [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Fertile week", "", "capitalized"))
        s = new element("span", `fertility-week ${fertility_class}`, [], p.getNode()); s.create(); s.appendContent(":")
        s = new element("span", `fertility-week ${fertility_class} value ms-1 font-bold`, [], p.getNode()); s.create(); s.appendContent(a_couple.fertilityWeek.toString())
        i = new element("i", `fertility-week mx-1 ${fertility_class} week-comparison fa ${comparison_icon}`, [], p.getNode()); i.create()
        s = new element("span", `fertility-week ${fertility_class}`, [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Month week", "", "capitalized"))
        s = new element("span", `fertility-week ${fertility_class}`, [], p.getNode()); s.create(); s.appendContent(":")
        s = new element("span", `fertility-week ${fertility_class} month-week ms-1 font-bold`, [], p.getNode()); s.create(); s.appendContent(month_week.toString())
    }
    p = new element("p", "py-1 my-1", [], d2.getNode()); p.create()
    p = new element("p", "flex text-gray-400", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, couple_is_woman ? "her attributes are" : "his attributes are", a_couple.gender.charAt(0), "capitalized"))
    s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
    p = new element("p", "py-1 my-1", [], d2.getNode()); p.create()
    text_color = attributesColors[language][a_couple.attributes[0]]
    s = new element("span", `px-2 py-0.5 me-1 text-center border border-gray-500 rounded bg-gray-800 text-xs font-bold ${text_color}`, [], p.getNode()); s.create(); s.appendContent(a_couple.attributes[0])
    text_color = attributesColors[language][a_couple.attributes[1]]
    s = new element("span", `px-2 py-0.5 me-1 text-center border border-gray-500 rounded bg-gray-800 text-xs font-bold ${text_color}`, [], p.getNode()); s.create(); s.appendContent(a_couple.attributes[1])
    text_color = attributesColors[language][a_couple.attributes[2]]
    s = new element("span", `px-2 py-0.5 me-1 text-center border border-gray-500 rounded bg-gray-800 text-xs font-bold ${text_color}`, [], p.getNode()); s.create(); s.appendContent(a_couple.attributes[2])
    p = new element("p", "flex text-gray-400", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, couple_is_woman ? "her wished attributes are" : "his wished attributes are", a_couple.gender.charAt(0), "capitalized"))
    s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
    p = new element("p", "py-1 my-1", [], d2.getNode()); p.create()
    text_color = attributesColors[language][a_couple.wishedAttributes[0]]
    s = new element("span", `px-2 py-0.5 me-1 text-center border border-gray-500 rounded bg-gray-800 text-xs font-bold ${text_color}`, [], p.getNode()); s.create(); s.appendContent(a_couple.wishedAttributes[0])
    text_color = attributesColors[language][a_couple.wishedAttributes[1]]
    s = new element("span", `px-2 py-0.5 me-1 text-center border border-gray-500 rounded bg-gray-800 text-xs font-bold ${text_color}`, [], p.getNode()); s.create(); s.appendContent(a_couple.wishedAttributes[1])
    text_color = attributesColors[language][a_couple.wishedAttributes[2]]
    s = new element("span", `px-2 py-0.5 me-1 text-center border border-gray-500 rounded bg-gray-800 text-xs font-bold ${text_color}`, [], p.getNode()); s.create(); s.appendContent(a_couple.wishedAttributes[2])
    p = new element("p", "flex items-center text-gray-400", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n","value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "dislikes attribute", "", "capitalized"))
    s = new element("span", "", [], p.getNode()); s.create(); s.appendContent(":")
    text_color = attributesColors[language][a_couple.hatedAttribute]
    s = new element("span", `ms-1 px-2 py-0.5 me-1 text-center border border-gray-500 rounded bg-gray-800 text-xs font-bold ${text_color}`, [], p.getNode()); s.create(); s.appendContent(a_couple.hatedAttribute)
    enable_accordion_click(b.getNode())
    //Actions available
    //Title
    d2 = new element("div", "border border-gray-300 dark:border-gray-800 dark:bg-gray-500 text-xs", [], d1.getNode(), `relationship-${relationship_id}-actions-title`); d2.create()
    p = new element("p", "flex justify-between p-1 ps-2 text-xs text-gray-200 bg-gray-800", [], d2.getNode()); p.create()
    s = new element("span", "", [{"key":"data-i18n", "value":""}], p.getNode()); s.create(); s.appendContent(translate(language, "Actions available"))
    //Area
    d2 = new element("div", "border border-gray-800 bg-gray-600 text-xs", [], d1.getNode(), `relationship-${relationship_id}-actions`); d2.create()
    p = new element("p", "flex w-100 justify-between p-1 gap-1 text-gray-300", [], d2.getNode()); p.create()
    b = new element("button", "text-xs grow p-2 button border border-gray-400 bg-gray-800", [], p.getNode(), `relationship-${relationship_id}-reproduce`); b.create()
    s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent(translate(language, "Try breeding"))
    b.getNode().addEventListener("click", try_breeding)
    b = new element("button", "text-xs grow p-2 button border border-gray-400 bg-gray-800", [{"key":"data-citizen-id", "value":a_citizen.id}], p.getNode(), `relationship-${relationship_id}-breakup`); b.create()
    s = new element("span", "", [{"key":"data-i18n", "value":""}], b.getNode()); s.create(); s.appendContent(translate(language, "Break up relationship"))
    b.getNode().addEventListener("click", cancel_relationship)
    //Increase relationship_id for next relationship.
    relationship_id++
}

const handleToggleHorse = (e) => {
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
const handleToggleWorker = (e) => {
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

const test_pregnancy_status = () => {
    //Testing pregnancy status
    citizens[1].status = "pregnant"
    document.querySelector("#citizen-1-status").setAttribute("data-status", "pregnant")
    document.querySelector("#citizen-1-status").innerHTML = translate(language, "Pregnant")
    document.querySelectorAll("#citizen-1-properties .pregnant").forEach((elem) => elem.classList.remove("hidden"))
}
const test_citizen_fishing_roles = () => {
    //Assign role to citizen 1 & 6 manually
    citizenIndex = 1;
    assign_role_to_citizen(citizenIndex, "fishing", translate(language, "Fisher", "f", "capitalized"), "fish", false)
    citizenIndex = 2;
    assign_role_to_citizen(citizenIndex, "fishing", translate(language, "Fisher", "f", "capitalized"), "fish", false)
    citizenIndex = 3;
    assign_role_to_citizen(citizenIndex, "fishing", translate(language, "Fisher", "f"), "fish", false)
    citizenIndex = 4;
    assign_role_to_citizen(citizenIndex, "fishing", translate(language, "Fisher", "f", "capitalized"), "fish", false)
    citizenIndex = 6;
    assign_role_to_citizen(citizenIndex, "fishing", translate(language, "Fisher", "m"), "fish", false)
    citizenIndex = 7;
    assign_role_to_citizen(citizenIndex, "fishing", translate(language, "Fisher", "m"), "fish", false)
    citizenIndex = 8;
    assign_role_to_citizen(citizenIndex, "fishing", translate(language, "Fisher", "m"), "fish", false)
}
const test_familiar_relationships = () => {
    //Test familiar relationship between citizens
    add_parent_to_citizen(citizens[6], citizens[1], "father")   //6 padre de 1
    add_child_to_citizen(citizens[1], citizens[6])              //1 hija de 6
    add_parent_to_citizen(citizens[6], citizens[7], "father")   //6 padre de 7
    add_child_to_citizen(citizens[7], citizens[6])              //7 hijo de 6
    add_parent_to_citizen(citizens[3], citizens[1], "mother")   //3 madre de 1
    add_child_to_citizen(citizens[1], citizens[3])              //1 hija de 3
    add_parent_to_citizen(citizens[3], citizens[7], "mother")   //3 madre de 7
    add_child_to_citizen(citizens[7], citizens[3])              //7 hijo de 3
    add_parent_to_citizen(citizens[2], citizens[6])             //2 madre de 6
    add_child_to_citizen(citizens[6], citizens[2])              //6 hijo de 2
    add_parent_to_citizen(citizens[2], citizens[4])             //2 madre de 4
    add_child_to_citizen(citizens[4], citizens[2])              //4 hija de 2
    add_parent_to_citizen(citizens[2], citizens[9])             //2 madre de 9
    add_child_to_citizen(citizens[9], citizens[2])              //9 hijo de 2
    add_parent_to_citizen(citizens[4], citizens[5])             //4 madre de 5
    add_child_to_citizen(citizens[5], citizens[4])              //5 hija de 4
    add_parent_to_citizen(citizens[8], citizens[5], "father")   //8 padre de 5
    add_child_to_citizen(citizens[5], citizens[8])              //5 hija de 8
    add_couple_to_citizen(citizens[3], citizens[6])             //3 pareja de 6
    /*
             --- 9h
             |
             --- 4m
        2m --|   |------> 5m
             |   8h
             --- 6h   --- 1m
                 |--->|    
                 3m   --- 7h
    */
}
const test_build_new_citizen = () => {
    let new_citizen = {}
    new_citizen.id = citizens.length
    new_citizen.father = 6
    new_citizen.mother = 1
    new_citizen.children = []
    new_citizen.couple = null
    new_citizen.role = new_citizen.rolekey = "unassigned"
    new_citizen.birthWeek = document.getElementById("passedWeeks").innerHTML*1 - 780 //Just born assumed
    new_citizen.birthWeeks = 780 //Weeks already lived.
    new_citizen.ageYears = 15 //Just born assumed
    new_citizen.ageWeeks = 0 //Just born assumed
    new_citizen.status = "idle"
    new_citizen.gender = ["Femenine", "Masculine"][Math.floor(Math.random()*2)]
    new_citizen.name = set_random_name(language, new_citizen.gender)
    new_citizen.xp = 0
    new_citizen.leftHand = new_citizen.rightHand = ""
    new_citizen.outfit = "No"
    new_citizen.fertility = 10 + Math.floor(Math.random() * 91)
    build_citizen(translation = true, new_citizen.id, new_citizen)
    //build_citizen(translation = true, undefined, undefined)
}

searchingZone = true
//Avoid modal pop up when zone searched
showModalZoneSearched = false

//test_citizen_fishing_roles()
//test_pregnancy_status()
//text_familiary_relationships()
test_build_new_citizen()
add_couple_to_citizen(citizens[1], citizens[6])             //1 pareja de 6
//daysPassed = 5

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.querySelector("#searchZone").addEventListener("click", searchZone)