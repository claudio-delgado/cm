//Main time loop.
const life_interval = setInterval(() => {
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
        document.querySelector("#colonyShelterCapacity").innerHTML = shelter_capacities["campaign tent"] * buildings.shelter["campaign tent"]
        s1.innerHTML+= " ("
        s2 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s1); s2.create(); s2.appendContent(translate(language, "Occupation"))
        s2 = new element("span", "font-bold", [], s1, "colonyShelterOccupation"); s2.create(); s2.appendContent("67%")
        s1.innerHTML+= ")"
        i = new element("i", "ms-1 fa fa-face-smile", [], s1, "shelterCapacityIcon"); i.create()
        //Update initial buildings
        update_colony()
        if(showModalZoneSearched) { 
            modal_popup("Zone researched!", "ZoneSearched") 
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
        dayPassed = (currentHour === "00")
        //Update days.
        daysPassed+= (dayPassed ? 1 : 0)
        currentDay = Number(document.querySelector("#currentDay").innerText)
        currentDay = 1 + (daysPassed % 7)
        document.querySelector("#currentDay").innerText = currentDay
        //Update weeks.
        currentWeek = Number(document.querySelector("#currentWeek").innerText)
        currentWeek = 1 + (Math.floor(daysPassed / 7) % 52)
        //Weekly flag
        weekPassed = dayPassed && Math.floor(daysPassed / 7) === daysPassed / 7
        document.querySelector("#currentWeek").innerText = currentWeek
        document.querySelector("#passedWeeks").innerText = Math.floor(daysPassed / 7)
        //Update years.
        currentYear = Number(document.querySelector("#currentYear").innerText)
        currentYear = 1 + Math.floor(daysPassed / 364)
        //Yearly flag
        yearPassed = dayPassed && Math.floor(daysPassed / 364) === daysPassed / 364
        document.querySelector("#currentYear").innerText = currentYear
    }
    //Day passed
    const update_all_citizens_xp = () => {
        //Update citizens xp
        //Update permanently assigned water bearers or fishermen
        document.querySelectorAll('.citizen-properties [data-role="waterbearing"], .citizen-properties [data-role="fishing"]').forEach((citizen) => {
            let citizenIndex = citizen.id.split("-")[1]
            //Only update xp when waterbearer/fishermen is currently working (at the water reservoir)
            if(document.querySelector("#citizen-"+citizenIndex+"-status").getAttribute("data-status") === "working"){
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
            if(document.querySelector("#citizen-"+citizenIndex+"-status").getAttribute("data-status") === "working"){
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
            if(product_rule.status === "running"){
                let rule_object = product_rule.object
                //Check if requirements are currently fulfilled.
                let requirement_fulfilled = true
                product_rule.rule_definition.requirements.forEach((req) => {
                    if(!req.consumable){
                        if(req.type === "citizen"){
                            req.workers.forEach((citizen_index) => {
                                requirement_fulfilled &&= (citizens[citizen_index].status === "working" && citizens[citizen_index].rolekey === req.role)
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
                    stock_values.products["EN"][rule_object]+= product_rule.rule_definition.result.quantity
                    stock_values.products["ES"][translate("ES", rule_object)]+= product_rule.rule_definition.result.quantity
                    stock_displayed.products["EN"][rule_object]+= product_rule.rule_definition.result.quantity
                    stock_displayed.products["ES"][translate("ES", rule_object)]+= product_rule.rule_definition.result.quantity
                    update_stock()
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
                pregnancies = pregnancies.filter(a_pregnancy => !(a_pregnancy.father === pregnancy.father && a_pregnancy.mother === pregnancy.mother))
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
            if(fertility_week === month_week){
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
            let iconPreviousAge = age_icons(previousAge)
            citizenWeeksAge.innerText = (citizenWeeksAge.innerText*1 + 1) % 52
            citizenYearsAge.innerText = citizenYearsAge.innerText*1 + (citizenWeeksAge.innerText*1 === 0 ? 1 : 0)
            let iconCurrentAge = age_icons(citizenYearsAge.innerText)
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
        zoneSearched = currentYear === 1 && currentWeek === 1 && currentDay === 1 && currentHour*1 === zoneSearchHoursNeeded
        
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
    const remove_countdown = (elem) => {
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
    const days_toggle_visibility = (elem) => {
        days = 1*elem.querySelector(".countdown.days").innerText
        elem.querySelector("#"+prefix+"-daysText").innerText = days === 1 ? translate(language, "days").slice(0, -1) : translate(language, "days")
        if(days){
            elem.querySelector("#"+prefix+"-days").classList.remove("hidden")
            elem.querySelector("#"+prefix+"-daysText").classList.remove("hidden")
        } else {
            elem.querySelector("#"+prefix+"-days").classList.add("hidden")
            elem.querySelector("#"+prefix+"-daysText").classList.add("hidden")
        }
    }
    const weeks_toggle_visibility = (elem) => {
        weeks = 1*elem.querySelector(".countdown.weeks").innerText
        elem.querySelector("#"+prefix+"-weeksText").innerText = weeks === 1 ? translate(language, "weeks").slice(0, -2)+"." : translate(language, "weeks")
        if(weeks){
            elem.querySelector("#"+prefix+"-weeks").classList.remove("hidden")
            elem.querySelector("#"+prefix+"-weeksText").classList.remove("hidden")
        } else {
            elem.querySelector("#"+prefix+"-weeks").classList.add("hidden")
            elem.querySelector("#"+prefix+"-weeksText").classList.add("hidden")
        }
    }
    const years_toggle_visibility = (elem) => {
        years = 1*elem.querySelector(".countdown.years").innerText
        elem.querySelector("#"+prefix+"-yearsText").innerText = years === 1 ? translate(language, "years").slice(0, -1) : translate(language, "years")
        if(years){
            elem.querySelector("#"+prefix+"-years").classList.remove("hidden")
            elem.querySelector("#"+prefix+"-yearsText").classList.remove("hidden")
        } else {
            elem.querySelector("#"+prefix+"-years").classList.add("hidden")
            elem.querySelector("#"+prefix+"-yearsText").classList.add("hidden")
        }
    }
    const decrement_years = (elem) => {
        //weeks = 0 & days === 0 & hours === 00
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
            elem.querySelector("#"+prefix+"-yearsText").innerText = weeks === 1 ? translate(language, "years").slice(0, -1) : translate(language, "years")
        } else {
            remove_countdown(elem)
        }
    }
    const decrement_weeks = (elem) => {
        //days === 0 & hours === 00
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
            elem.querySelector("#"+prefix+"-weeksText").innerText = weeks === 1 ? translate(language, "weeks").slice(0, -2)+"." : translate(language, "weeks")
        } else {
            decrement_years(elem)
        }
    }
    const decrement_days = (elem) => {
        //hours === 00
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
            elem.querySelector("#"+prefix+"-daysText").innerText = days === 1 ? translate(language, "days").slice(0, -1) : translate(language, "days")
        } else {
            decrement_weeks(elems)
        }
    }
    const decrement_hours = (elem) => {
        //Decrement pending hours
        hours = 1*elem.querySelector(".countdown.hours").innerText - 1
        elem.querySelector(".countdown.hours").innerText = hours.toString().padStart(2, "0")
        //Arrange unit number: singular or plural
        elem.querySelector("#"+prefix+"-hoursText").innerText = hours === 1 ? "h" : "hs"
    }
    const check_countdown_end = (elem) => {
        if( !hours &&
            elem.querySelector("#"+prefix+"-days").classList.contains("hidden") &&
            elem.querySelector("#"+prefix+"-weeks").classList.contains("hidden") &&
            elem.querySelector("#"+prefix+"-years").classList.contains("hidden")){
            remove_countdown(elem)
        }
    }
    let hours, days, weeks, years, prefix
    document.querySelectorAll(".countdownTime").forEach((elem) => {
        let idArray = elem.querySelector("span:first-child").id.split("-")
        prefix = idArray[0]+"-"+idArray[1]+"-"+idArray[2]
        //Correct unit numbers (singulars and plurals) before processing values
        hours = 1*elem.querySelector(".countdown.hours").innerText
        elem.querySelector("#"+prefix+"-hoursText").innerText = hours === 1 ? "h" : "hs"
        days_toggle_visibility(elem)
        weeks_toggle_visibility(elem)
        years_toggle_visibility(elem)
        
        //If hours > 0 => decrement them
        if(1*elem.querySelector(".countdown.hours").innerText){
            decrement_hours(elem)
        } else {
            decrement_days(elem)
        }
        check_countdown_end(elem)
    })
}