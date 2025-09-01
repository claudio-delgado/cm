//Main time loop.
var currentYear = currentWeek = currentDay = currentHour = 0
const life_interval = setInterval(() => {
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
        //Create 5 campaign tents discovered.
        buildings.shelter_related["campaign_tent"]["building_list"] = []
        for(i=0; i<5; i++){
            let building = {}
            building.id = i+1
            building_last_id = building.id
            building.name = translate(language, "Campaign tent") + " " + (i+1)
            building.capacity = shelter_capacities["campaign tent"]
            building.status = "Ended"
            building.created = {}
            building.created.year = document.getElementById("currentYear").innerHTML*1
            building.created.week = document.getElementById("currentWeek").innerHTML*1
            building.created.day = document.getElementById("currentDay").innerHTML*1
            building.created.hour = document.getElementById("currentHour").innerHTML*1
            building.new = true
            buildings.shelter_related["campaign_tent"]["building_list"].push(building)
        }
        /*
        //Update initial shelter capacity
        s1 = document.querySelector("#colonyShelterCapacityInfo")
        s1.classList.remove("text-red-400")
        s1.classList.add("text-green-400")
        document.querySelector("#shelterCapacityIcon").remove()
        document.querySelector("#colonyShelterCapacity").innerHTML = shelter_capacities["campaign tent"] * buildings.shelter_related["campaign tent"]
        s1.innerHTML+= " ("
        s2 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s1); s2.create(); s2.appendContent(translate(language, "Occupation"))
        s2 = new element("span", "font-bold", [], s1, "colonyShelterOccupation"); s2.create(); s2.appendContent("67%")
        s1.innerHTML+= ")"
        i = new element("i", "ms-1 fa fa-face-smile", [], s1, "shelterCapacityIcon"); i.create()
        update_colony()
        */
        //Update initial buildings
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
        update_colony("zoneSearched")
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
    const check_critical_events = (frequency = "daily") => {
        const random_citizen = () => {
            let idle_citizens = citizens.filter(citizen => citizen.status === "idle")
            if(idle_citizens.length){
                random_citizen = Math.floor(Math.random() * idle_citizens.length)
            } else {
                let non_soldier_citizens = citizens.filter(citizen => citizen.rolekey !== "war")
                if(non_soldier_citizens.length){
                    random_citizen = Math.floor(Math.random() * non_soldier_citizens.length)
                } else {
                    random_citizen = Math.floor(Math.random() * citizens.length)
                }
            }
            return random_citizen
        }
        Object.keys(population_loss_events[frequency]).forEach((critical_event_name) => {
            let critical_event = population_loss_events[frequency][critical_event_name]
            if(critical_event.status === "active"){
                critical_event.ellapsed_hours++
                let ellapsed_time = critical_event.ellapsed_time
                let result_type = critical_event.result.type
                let result_quantity = critical_event.result.quantity
                let threshold = critical_event.threshold
                let threshold_reached = threshold && ellapsed_time >= threshold
                if(threshold_reached){
                    //Critical event has reached needed time, so take actions required...
                    for(i=0; i<result_quantity; i++){
                        //Pick a candidate to be exiled from colony or die in colony.
                        let random_citizen = random_citizen()
                        if(result_type === "exiled_citizens"){
                            citizens.splice(random_citizen.id, 1)
                        } else {
                            if(result_type === "dead_citizens"){
                                citizens[random_citizen.id].status = "deceased"
                                //TODO: If graveyards are built and there is enough room in any of them, add the deceased citizen to any of them.
                            }
                        }
                    }
                    //Update citizens panel
                    document.getElementById("accordion-citizens").innerHTML = ""
                    citizens.forEach((citizen) => {
                        build_citizen(false, citizen.id, citizen)
                    })
                }
            }
        })
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
    const update_daily_resource_extractions = () => {
        //Update resource extractions
        let dailyWaterGained = document.querySelector("#colony-water-income").innerText * 1 - document.querySelector("#colony-water-consumption").innerText * 1
        document.querySelectorAll("#colony-water-stock").forEach((value) => {
            value.innerText = Math.max(0, value.innerText * 1 + (dailyWaterGained))
        })
        let dailyFoodGained = document.querySelector("#colony-food-income").innerText * 1 - document.querySelector("#colony-food-consumption").innerText * 1
        document.querySelectorAll("#colony-food-stock").forEach((value) => {
            value.innerText = Math.max(0, value.innerText * 1 + (dailyFoodGained))
        })
    }
    const update_running_productions = () => {
        const turn_workers_idle = (rule) => {
            //Turn all rule workers to idle status...
            rule.rule_definition.requirements.forEach((requirement) => {
                if(requirement.type === "citizen"){
                    requirement.workers.forEach((citizen_index) => {
                        document.querySelector(`#citizen-${citizen_index}-status`).setAttribute("data-status", "idle")
                        document.querySelector(`#citizen-${citizen_index}-status`).innerHTML = translate(language, "idle")
                        citizens[citizen_index].status = "idle"
                    })    
                }
            })
        }
        const end_rule = (rule, rule_index) => {
            rule.status = "ended"
            let span_status = document.getElementById(`active-rule-${rule.id}-status`)
            if(span_status != undefined){
                span_status.innerHTML = translate(language, rule.status, "f", "capitalized")
                span_status.closest("p").classList.remove("bg-gray-700")
                span_status.closest("p").classList.add("bg-red-900")
            }
            good_rules_defined[rule_index].status = rule.status
            return rule
        }
        //Check production rules progress
        let stock_can_be_processed = false
        good_rules_defined.forEach((rule, rule_index) => {
            //Is the production rule running?
            if(rule.status == "running"){
                //Decrement remaining hours.
                rule.duration_remaining--
                //Check if there are no more remaining hours and the result has to be obtained.
                if(!rule.duration_remaining){
                    //Reset remaining hours with default rule's value.
                    rule.duration_remaining = rule.duration
                    //Iterate over all rule requirements and execute them.
                    //This may involve checking those requirement goods which must decrease stock values, or check workers life.
                    rule.rule_definition.requirements.forEach((requirement) => {
                        //If requirement is rule workers assigned...
                        if(requirement.type === "citizen" && requirement.workers && requirement.workers.length){
                            //Check workers life...
                            //Increase their XP if possible.
                            let xp_increase = rule.rule_definition.result.xp ? rule.rule_definition.result.xp * rule.rule_definition.result.quantity : 0
                            requirement.workers.forEach((citizen_id) => {
                                //Update worker xp.
                                citizens[citizen_id].xp += xp_increase
                            })
                        }
                        //If rule is still running (it may have stopped in previous cycle) and the requirement object is a product, resource or part, try to decrease the stock.
                        if(rule.status === "running" && requirement.consumable && ["product", "resource", "building part"].includes(requirement.type)){
                            //Enough goods in stock to afford the requirement needs?
                            stock_can_be_processed = stock_values[requirement.type + "s"][language][translate(language, requirement.object)] >= requirement.quantity
                            if(stock_can_be_processed){
                                //Decrement stock goods.
                                stock_values[requirement.type + "s"][language][translate(language, requirement.object)] -= requirement.quantity
                            } else { //Insufficient stock for the object => end rule.
                                rule = end_rule(rule, rule_index)
                                //Turn all rule workers to idle status...
                                turn_workers_idle(rule)
                            }
                        }
                    })
                    //Obtain result...
                    if(rule.status === "running"){
                        //All rule required goods consumed and workers processed => result must be obtained.
                        //Generate product, resource or building part.
                        stock_values[rule.category][language][translate(language, rule.object)] += rule.rule_definition.result.quantity * 1
                        stock_can_be_processed = true
                        //Check rule mode and if not cyclic, verify if there is any cycle left to iterate.
                        if(rule.production_limit != Infinity){
                            if(rule.production_limit*1 == 1){ //No more cycles => end rule.
                                rule = end_rule(rule, rule_index)
                                //Turn all rule workers to idle status...
                                turn_workers_idle(rule)
                            } else {
                                rule.production_limit-- //There are still cycles left to iterate.
                            }
                        }
                    }
                }
            }
        })
        if(stock_can_be_processed){
            stock_displayed = JSON.parse(JSON.stringify(stock_values))
            update_stock()
        }
    }
    const update_running_constructions = () => {
        const turn_workers_idle = (rule) => {
            //Turn all rule workers to idle status...
            rule.rule_definition.requirements.forEach((requirement) => {
                if(requirement.type === "citizen"){
                    requirement.workers.forEach((citizen_index) => {
                        document.querySelector(`#citizen-${citizen_index}-status`).setAttribute("data-status", "idle")
                        document.querySelector(`#citizen-${citizen_index}-status`).innerHTML = translate(language, "idle")
                        citizens[citizen_index].status = "idle"
                    })    
                }
            })
        }
        building_rules_defined.forEach((building_rule, rule_index) => {
            if(building_rule.status == translate(language, "Under construction", "", "", false)){
                let building_group = building_rule.group.replace(" ", "_")
                let building_type = building_rule.type
                building_rule.duration_remaining--
                let progress = Math.round((1 - (building_rule.duration_remaining / building_rule.duration)) * 10000) / 100
                let progress_span = document.getElementById(`building-group-${building_group}-building-${building_type}-${building_rule.id}-progress`)
                let status_span = document.getElementById(`building-group-${building_group}-building-${building_type}-${building_rule.id}-status`)
                let parent_paragraph = status_span.closest("p")
                if(progress_span){
                    progress_span.innerHTML = progress
                }
                //Building is finished.
                if(!building_rule.duration_remaining){
                    //Mark building as constructed.
                    building_rules_defined[rule_index].status = "Ended"
                    let constructed_in_span = document.getElementById(`building-group-${building_group}-building-${building_type}-${building_rule.id}-constructed-in`)
                    let constructed_in = constructed_in_span.parentElement
                    constructed_in_span.remove()
                    //Set new status
                    let status_span = document.getElementById(`building-group-${building_group}-building-${building_type}-${building_rule.id}-status`)
                    status_span.innerHTML = translate(language, "Ended")
                    //Show constructed in date.
                    s1 = new element("span", "flex-none", [{"key":"data-i18n","value":""}], constructed_in); s1.create(); s1.appendContent(translate(language, "Year"))
                    s1 = new element("span", "font-bold flex-none ms-1", [], constructed_in, `building-group-${building_group}-building-${building_type}-${building_rule.id}-createdYear`); s1.create(); s1.appendContent(document.getElementById("currentYear").innerHTML)
                    s1 = new element("span", "flex-none ms-1", [{"key":"data-i18n","value":""}], constructed_in); s1.create(); s1.appendContent(translate(language, "Week"))
                    s1 = new element("span", "font-bold flex-none ms-1", [], constructed_in, `building-group-${building_group}-building-${building_type}-${building_rule.id}-createdWeek`); s1.create(); s1.appendContent(document.getElementById("currentWeek").innerHTML)
                    s1 = new element("span", "flex-none ms-1", [{"key":"data-i18n","value":""}], constructed_in); s1.create(); s1.appendContent(translate(language, "Day"))
                    s1 = new element("span", "font-bold flex-none ms-1", [], constructed_in, `building-group-${building_group}-building-${building_type}-${building_rule.id}-createdDay`); s1.create(); s1.appendContent(document.getElementById("currentDay").innerHTML)
                    s1 = new element("span", "flex-none ms-1", [], constructed_in, `building-group-${building_group}-building-${building_type}-${building_rule.id}-createdHour`); s1.create(); s1.appendContent(document.getElementById("currentHour").innerHTML)
                    s1 = new element("span", "flex-none ms-1", [], constructed_in); s1.create(); s1.appendContent("hs.")
                    let progress_title_div = document.getElementById(`building-group-${building_group}-building-${building_type}-${building_rule.id}-progress-title`)
                    let progress_div = document.getElementById(`building-group-${building_group}-building-${building_type}-${building_rule.id}-progress`)
                    //Turn all workers involved to idle status.
                    turn_workers_idle(building_rule)
                    //Remove progress divs and spans.
                    progress_title_div.remove()
                    progress_div.parentElement.remove()
                    //Remove initiated in paragraph.
                    document.getElementById(`building-group-${building_group}-building-${building_type}-${building_rule.id}-initiatedYear`).closest("p").remove()
                    let risks_span = document.getElementById(`building-group-${building_group}-building-${building_type}-${building_rule.id}-risks`)
                    if(risks_span != undefined){
                        //Move risks div next to "Constructed in"
                        let risks_span_parent = risks_span.parentElement
                        parent_paragraph.appendChild(risks_span)
                        risks_span_parent.remove()
                    } else {
                        //Enlarge status div.
                        status_span.parentElement.classList.add("grow")
                    }
                    //If building is a shelter, update parcial and total capacity.
                    if(building_group == "shelter_related"){
                        let total_capacity_span = document.getElementById(`building-group-${building_group}-building-${building_type}-total-capacity`)
                        let new_capacity_span = document.getElementById(`building-group-${building_group}-building-${building_type}-${building_rule.id}-capacity`)
                        if(total_capacity_span != undefined && new_capacity_span != undefined){
                            //Current building type parcial capacity.
                            let partial_capacity = total_capacity_span.innerHTML*1
                            let new_capacity = new_capacity_span.innerHTML*1
                            partial_capacity+= new_capacity
                            total_capacity_span.innerHTML = partial_capacity
                            //Total shelters capacity
                            let total_capacity = total_capacity_span.innerHTML*1
                            total_capacity+= new_capacity
                            total_capacity_span.innerHTML = total_capacity
                        }
                        update_colony("populationUpdate")
                    }
                    //Update player's score.
                    let colony_score = document.getElementById("colonyScore").innerHTML*1 + get_score_bonus(building_type+"_built")
                    document.getElementById("colonyScore").innerHTML = colony_score
                    document.getElementById("colonyScoreUnit").innerHTML = translate(language, colony_score == 1 ? "point": "points")
                    //Remove building rule.
                    building_rules_defined.forEach((building, b_index) => {
                        if(building.id == building_rule.id){
                            building_rules_defined.splice(b_index, 1)
                        }
                    })
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
                    let born_citizen = {}, to_be_born_citizen = {}
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
            //Perform updating tasks inside game panels that involve hourly changes
            update_running_productions()
            update_running_constructions()
            //Process countdowns
            processCountdowns()
        //End hourly events
        
        //Zone searched flag
        zoneSearched = currentYear === 1 && currentWeek === 1 && currentDay === 1 && currentHour*1 === zoneSearchHoursNeeded

        
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
            update_daily_resource_extractions()

            //Check daily critical events like vital resources lack of income, shortage, or life quality low. 
            check_critical_events("daily")
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

            //Check daily critical events like vital resources lack of income, shortage, or life quality low. 
            check_critical_events("weekly")

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
            decrement_weeks(elem)
        }
    }
    const decrement_hours = (elem) => {
        //Decrement pending hours
        hours = 1*elem.querySelector(".countdown.hours").innerText - 1
        elem.querySelector(".countdown.hours").innerText = hours.toString().padStart(2, "0")
        //Arrange unit number: singular or plural
        elem.querySelector("#"+prefix+"-hoursText").innerText = hours === 1 ? "h" : "hs"
    }
    const check_countdown_end = (elem, loop = false) => {
        if( !hours &&
            elem.querySelector("#"+prefix+"-days").classList.contains("hidden") &&
            elem.querySelector("#"+prefix+"-weeks").classList.contains("hidden") &&
            elem.querySelector("#"+prefix+"-years").classList.contains("hidden")){
            if(!loop) {
                remove_countdown(elem)
            } else {
                reset_countdown(elem)
            }
        }
    }
    let hours, days, weeks, years, prefix
    document.querySelectorAll(".countdownTime").forEach((elem) => {
        let loop = elem.classList.contains("loop")
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
        check_countdown_end(elem, loop)
    })
}