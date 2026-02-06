class GameTime {
    static started = false
    static game_hour_real_duration = 1790 //real seconds
    constructor(template = false) {
        this.year_passed = false
        this.weeks_passed = template && template["weeks passed"] ? template["weeks passed"] : 0
        this.current_year = Math.floor(this.weeks_passed / 52) + 1
        this.current_week = (this.weeks_passed % 52) + 1
        this.current_day = template && template["current day"] ? template["current day"] : 1
        this.day_passed = false
        this.days_passed = this.weeks_passed * 7 + this.current_day - 1
        this.current_hour = template && template["current hour"] ? template["current hour"] : 0
    }
    move = (hours = 1) => {
        //Update hours. (turns 0 next time hour 23 is passed)
        this.current_hour += this.current_hour < 23 ? 1 : -this.current_hour
        colony.redraw_colony_hour(this.current_hour)
        //Daily flag
        this.day_passed = this.current_hour == 0
        //Update days.
        this.days_passed += (this.day_passed ? 1 : 0)
        this.current_day = 1 + (this.days_passed % 7)
        colony.redraw_colony_day(this.current_day)
        //Weekly flag
        this.week_passed = this.day_passed && this.days_passed % 7 == 0//Math.floor(this.days_passed / 7) === this.days_passed / 7
        //Update weeks.
        this.current_week = 1 + (Math.floor(this.days_passed / 7) % 52)
        colony.redraw_colony_week(this.current_week)
        this.weeks_passed += (this.week_passed ? 1 : 0)
        colony.redraw_colony_passed_weeks(this.weeks_passed)
        //Update years.
        this.year_passed = this.day_passed && !(this.days_passed % 364)
        this.current_year += (this.year_passed ? 1 : 0)
        //Yearly flag
        colony.redraw_colony_year(this.current_year)
    }
    //Getters
    get_month_week = () => {
        //Returns the current week in the month (1-4)
        return Math.floor((this.current_week - 1) % 4) + 1
    }
    increase_weeks_passed = (weeks_increment) => {
        this.weeks_passed += weeks_increment
        //Colaterally affect current week and current year if necessary.
        this.current_week = ((this.current_week-1 + weeks_increment) % 52) + 1
        this.current_year += Math.floor((this.current_week + weeks_increment) / 52)
    }
    //Given a frecuency and a time lapse (in hours, days or weeks), check if any critical event must be triggered.
    check_critical_events = (frequency = "daily", time_lapse = 0) => {
        Object.keys(Colony.population_loss_events[frequency]).forEach((critical_event_name) => {
            let critical_event = Colony.population_loss_events[frequency][critical_event_name]
            if(critical_event.status === "active"){
                let result_quantity = critical_event.result.quantity
                let living_citizens_map = new Map([...colony.citizens.entries()].filter(([id, citizen]) => citizen.status != "deceased"))
                for(time_count = 0; time_count < time_lapse && living_citizens_map.size && critical_event.status === "active"; time_count++){
                    critical_event.ellapsed_time++
                    let threshold_reached = critical_event.threshold && critical_event.ellapsed_time >= critical_event.threshold
                    if(threshold_reached){
                        //Trigger critical event
                        //Critical event has reached needed time, so take actions required...
                        for(i=0; i<result_quantity && living_citizens_map.size && critical_event.status === "active"; i++){
                            //Pick a candidate to be exiled from colony or die in colony.
                            let random_citizen = colony.get_random_citizen_to_remove()
                            if(critical_event.result.type === "exiled_citizens"){
                                //Exclude random citizen from living citizens map and colony citizens.
                                living_citizens_map.delete(random_citizen.id)
                                colony.citizens.delete(random_citizen.id)
                            } else {
                                if(critical_event.result.type === "dead_citizens"){
                                    colony.citizens.get(random_citizen.id).status = "deceased"
                                    //TODO: If graveyards are built and there is enough room in any of them, add the deceased citizen to any of them.
                                }
                            }
                            //After losing the citizen, check if by reducing colony population any critical event changes.
                            //Check water shortage event
                            colony.update_colony_water_income()
                            let daily_water_revenue = colony.income.water - colony.consumption.water
                            if(!(colony.stock.resources.get("water") === 0 && daily_water_revenue < 0)){
                                //Remove critical event if water shortage is over.
                                Colony.population_loss_events["daily"]["water_shortage"].status = "inactive"
                                Colony.population_loss_events["daily"]["water_shortage"].ellapsed_days = 0
                            }
                            //Check low water income event
                            if(!(daily_water_revenue < 0)){
                                //Remove critical event if water low income is over.
                                Colony.population_loss_events["weekly"]["low_water_income"].status = "inactive"
                                Colony.population_loss_events["weekly"]["low_water_income"].ellapsed_days = 0
                            }
                            //Check food shortage event
                            colony.update_colony_food_income()
                            let daily_food_revenue = colony.income.food - colony.consumption.food
                            if(!(colony.stock.resources.get("food") === 0 && daily_food_revenue < 0)){
                                //Remove critical event if food shortage is over.
                                Colony.population_loss_events["weekly"]["food_shortage"].status = "inactive"
                                Colony.population_loss_events["weekly"]["food_shortage"].ellapsed_days = 0
                            }
                            //Check low food income event
                            if(!(daily_food_revenue < 0)){
                                //Remove critical event if food low income is over.
                                Colony.population_loss_events["weekly"]["low_food_income"].status = "inactive"
                                Colony.population_loss_events["weekly"]["low_food_income"].ellapsed_days = 0
                            }
                            //Check life quality event
                            if(colony.life_quality > 0.5 * colony.get_population()){
                                //Remove critical event if life quality is back to normal.
                                Colony.population_loss_events["weekly"]["low_life_quality"].status = "inactive"
                                Colony.population_loss_events["weekly"]["low_life_quality"].ellapsed_days = 0
                                if(!(colony.stock.resources.get("water") === 0 && daily_water_revenue < 0)){
                                    //Remove critical event if water shortage is over.
                                    Colony.population_loss_events["daily"]["low_life_quality_and_water_shortage"].status = "inactive"
                                    Colony.population_loss_events["daily"]["low_life_quality_and_water_shortage"].ellapsed_days = 0
                                }
                                if(!(colony.stock.resources.get("food") === 0 && daily_food_revenue < 0)){
                                    //Remove critical event if food shortage is over.
                                    Colony.population_loss_events["weekly"]["low_life_quality_and_food_shortage"].status = "inactive"
                                    Colony.population_loss_events["weekly"]["low_life_quality_and_food_shortage"].ellapsed_days = 0
                                }
                            }
                        }
                        critical_event.ellapsed_time = 0
                    }
                }
                //Update citizens panel on screen after possible deaths or exiles.
                document.getElementById("accordion-citizens").innerHTML = ""
                colony.citizens.forEach((citizen) => {
                    colony.draw_citizens()
                })
            }
        })
    }
    //Hourly updates
    remove_finished_expeditions = () => {
        //if(DOMElement.exists(".expedition-finished")){
        if(document.querySelector(".expedition-finished")){
            let parent_id = document.querySelector(".expedition-finished").parentElement.id
            let expedition_id = parent_id.split("-")[1]
            Expedition.undraw(expedition_id)
        }
    }
    run_countdowns = () => {
        const decrement_hours = (elem, hours) => {
            //Decrement pending hours
            hours--
            let countdown_hours = elem.querySelector(".countdown.hours")
            countdown_hours.innerText = hours.toString().padStart(2, "0")
            //Check if it's an expedition countdown to also update memory structure array.
            let expedition_id = countdown_hours.getAttribute("data-expedition")
            if(expedition_id){
                colony.expeditions.forEach((expedition) => {
                    if(expedition.id == expedition_id) {
                        expedition.arrives_in.hours = Number(countdown_hours.innerText)
                    }
                })
            }
            //Arrange unit number: singular or plural
            let idArray = elem.querySelector("span:first-child").id.split("-")
            let prefix = idArray[0]+"-"+idArray[1]+"-"+idArray[2]
            DOMElement.set_text(`#${prefix}-hoursText`, hours === 1 ? "h" : "hs")
        }
        const decrement_days = (elem, days) => {
            //If days > 0 => decrement them
            if(days){
                //Decrement pending days
                days--
                let countdown_days = elem.querySelector(".countdown.days")
                countdown_days.innerText = days.toString().padStart(2, "0")
                //Check if it's an expedition countdown to also update memory structure array.
                let expedition_id = countdown_days.getAttribute("data-expedition")
                if(expedition_id){
                    colony.expeditions.forEach((expedition) => {
                        if(expedition.id == expedition_id) {
                            expedition.arrives_in.days = Number(countdown_days.innerText)
                        }
                    })
                }
                let idArray = elem.querySelector("span:first-child").id.split("-")
                let prefix = idArray[0]+"-"+idArray[1]+"-"+idArray[2]
                //Hide days if they are 0 and both weeks and years are hidden
                if(!days && DOMElement.has_classes(".countdown.weeks, .countdown.years", ["hidden"])){
                    DOMElement.hide([`#${prefix}-days`, `#${prefix}-daysText`])
                }
                //Set hours to max value - 1 => hours = 23
                let hours = "23"
                DOMElement.set_text(".countdown.hours", hours)
                //Arrange unit number: singular or plural
                DOMElement.set_text(`#${prefix}-daysText`, days === 1 ? translate(language, "day").slice(0, -1) : translate(language, "days"))
            } else {
                //decrement_weeks()
            }
        }
        const remove_countdown = (elem) => {
            if(DOMElement.has_classes(elem.id, ["activeExpedition"])){
                let expedition_id = Number(elem.dataset["expeditionId"])
                colony.expeditions.get(expedition_id).end_expedition()
            }
        }
        const check_countdown_end = (elem, loop = false) => {
            let hours = Number(elem.querySelector(".countdown.hours").innerText)
            let idArray = elem.querySelector("span:first-child").id.split("-")
            let prefix = idArray[0]+"-"+idArray[1]+"-"+idArray[2]
            if( hours <= 0 && DOMElement.are_hidden([`#${prefix}-days`, `#${prefix}-weeks`, `#${prefix}-years`])){
                if(loop) {
                    reset_countdown(elem)
                } else {
                    remove_countdown(elem)
                }
            }
        }
        //Iterate over all .countdownTime elements decreasing their time.
        document.querySelectorAll(".countdownTime").forEach((elem) => {
            //Check if element is a loop. Then if it finishes, it has to start again.
            let loop = elem.classList.contains("loop")
            let idArray = elem.querySelector("span:first-child").id.split("-")
            let prefix = idArray[0]+"-"+idArray[1]+"-"+idArray[2]
            //Correct unit numbers (singulars and plurals) before processing values
            let hours = Number(elem.querySelector(".countdown.hours").innerText)
            //elem.querySelector(`#${prefix}-hoursText`).innerText = hours === 1 ? "h" : "hs"
            let days = Number(elem.querySelector(".countdown.days").innerText)
            if(hours > 0){
                decrement_hours(elem, hours)
            } else {
                decrement_days(elem, days)
            }
            //Check if countdown has to be finished or reset.
            check_countdown_end(elem, loop)
        })
    }
    //Daily updates
    update_all_citizens_xp = () => {
        //Update permanently assigned water bearers or fishermen xp
        let water_bearers_working = colony.get_filtered_citizens({"rolekey": "waterbearing", "status": "working"})
        water_bearers_working.forEach((citizen) => {
            citizen.xp += 1/30
            colony.citizens.set(citizen.id, citizen)
            citizen.redraw_citizen_xp(citizen.xp)
        })
        let fishermen_working = colony.get_filtered_citizens({"rolekey": "fishing", "status": "working"})
        fishermen_working.forEach((citizen) => {
            citizen.xp += 1/30
            colony.citizens.set(citizen.id, citizen)
            citizen.redraw_citizen_xp(citizen.xp)
        })
    }
    update_resource_extractions = () => {
        //If there's enough stock capacity, add the net income of water to the stock.
        if(colony.get_stock_limit("water") > colony.stock.resources.get("water")){
            colony.stock.resources.set("water", Math.min(colony.get_stock_limit("water"), colony.stock.resources.get("water") + (colony.income.water - colony.consumption.water)))
            colony.redraw_colony_stock("water", colony.stock.resources.get("water"))
        }
        let water_storage_full = colony.get_stock_limit("water") === colony.stock.resources.get("water")
        if(water_storage_full && document.getElementById("colony-water-stock-details") && !document.getElementById("colony-water-stock-warning")){
            //Add water storage full warning aside.
            let d = document.getElementById("colony-water-stock-details").children
            let parent_span = d[0].children[1]
            let s = new DOMElement({
                tagName: "span",
                classes: `font-bold ms-1 px-1 bg-red-900 text-white border border-gray-400`,
                parentElement: parent_span,
                id: "colony-water-stock-warning",
                text: translate(language, "Storage full. You cannot obtain this resource for now.")
            })
        }
        //If there's enough stock capacity, add the net income of food to the stock.
        if(colony.get_stock_limit("food") > colony.stock.resources.get("food")){
            colony.stock.resources.set("food", Math.min(colony.get_stock_limit("food"), colony.stock.resources.get("food") + (colony.income.food - colony.consumption.food)))
            colony.redraw_colony_stock("food", colony.stock.resources.get("food"))
        }
        let food_storage_full = colony.get_stock_limit("food") === colony.stock.resources.get("food")
        if(food_storage_full && document.getElementById("colony-food-stock-details") && !document.getElementById("colony-food-stock-warning")){
            //Add food storage full warning aside.
            let d = document.getElementById("colony-food-stock-details").children
            let parent_span = d[0].children[1]
            s2 = new DOMElement({
                tagName: "span",
                classes: `font-bold ms-1 px-1 bg-red-900 text-white border border-gray-400`,
                parentElement: parent_span,
                id: "colony-food-stock-warning",
                text: translate(language, "Storage full. You cannot obtain this resource for now.")
            })
        }
        //If any stock capacity is full, show storage full warning if needed.
        if(!document.getElementById("resources-stock-storage-warning") && (water_storage_full || food_storage_full)){
            colony.draw_warning_message("resources-stock-storage-warning", document.getElementById("resources-stock-list"), translate(language, "To expand your storage capacity, build more barns or sheds."))
        }
    }
    //Weekly updates
    update_pregnancies = () => {
        colony.pregnancies.forEach(pregnancy => {
            pregnancy.remaining_weeks = Math.max(0, pregnancy.remaining_weeks - 1)
            pregnancy.mother.redraw_citizen_pregnancy_weeks(pregnancy.remaining_weeks)
            if(!pregnancy.remaining_weeks){
                //Pregnancy is over. Child or children are to be born.
                //1) Change mother status from "pregnant" to "idle".
                colony.citizens.get(pregnancy.mother.id).status = "idle"
                pregnancy.mother.set_status("idle")
                //2) Hide pregnancy remaining weeks for the current mother.
                pregnancy.mother.undraw_citizen_pregnancy_weeks()
                //3) Reduce father and mother's fertility, based on his and her current children.
                let father_children = colony.citizens.get(pregnancy.father.id).children.length
                let mother_children = colony.citizens.get(pregnancy.mother.id).children.length
                //Decrement father's fertility (set 0 if negative)
                pregnancy.father.fertility.value = Math.max(pregnancy.father.fertility.value - (father_children + pregnancy.children_amount), 0)
                pregnancy.father.redraw_citizen_fertility()
                //Decrement mother's fertility (set 0 if negative)
                pregnancy.mother.fertility.value = Math.max(pregnancy.mother.fertility.value - (mother_children + pregnancy.children_amount), 0)
                pregnancy.mother.redraw_citizen_fertility()
                //Loop all born babies
                for(let citizen_index = 1; citizen_index <= pregnancy.children_amount; citizen_index++){
                    //4) Create a new baby citizen and fill his or her info.
                    let born_baby = new Citizen({"father": pregnancy.father, "mother": pregnancy.mother})
                    colony.citizens.set(born_baby.id, born_baby)
                    born_baby.draw({"parentElement": document.getElementById("accordion-citizens")})
                    //5) Add baby to father and mother's children array.
                    colony.citizens.get(pregnancy.father.id).children.push(born_baby)
                    colony.citizens.get(pregnancy.mother.id).children.push(born_baby)
                    //6) Update colony life quality and check critical events.
                    let enough_shelters = colony.get_population() <= colony.get_shelter_capacity()
                    if(enough_shelters){
                        colony.set_life_quality(colony.life_quality + Colony.life_quality_bonus["new baby with enough shelters"].value)
                    } else {
                        colony.set_life_quality(colony.life_quality + Colony.life_quality_bonus["new baby without enough shelters"].value)
                    }
                    this.check_critical_events("daily", 1)
                    this.check_critical_events("weekly", 1)
                    //7) Update player score.
                    colony.set_score(colony.score + Colony.score_bonus["new baby"].value)
                }
                //6) Remove pregnancy.
                colony.pregnancies.delete(pregnancy.id)
            }
        })
    }
    update_fertility_weeks = () => {
        colony.citizens.forEach(citizen => {
            if(citizen.gender == "Femenine" && citizen.ageYears >= Citizen.min_search_couple_age){
                if(colony.active_panel) colony.active_panel.close()
                citizen.redraw_citizen_fertility_week()
            }
        })
    }
    update_all_citizens_age = () => {
        //Update citizens age
        colony.citizens.forEach((citizen, citizenIndex) => {
            citizen.ageWeeks++
            if(citizen.ageWeeks % 52 === 0){
                citizen.ageYears++
                citizen.ageWeeks = 0
            }
            citizen.redraw_citizen_age()
        })
    }
    //Annual updates
    decrease_all_citizens_fertility = () => {
        //Decrease all citizen's fertility if aged >= 21
        colony.citizens.forEach((citizen) => {
            let citizen_alive = citizen.status != "deceased"
            if(citizen_alive){
                citizen.fertility = citizen.ageYears >= 21 ? Math.max(citizen.fertility.value - 1, 0) : citizen.fertility.value
                citizen.redraw_citizen_fertility()
            }
        })
    }
    //Main time interval loop.
    start = () => {
        this.time = setInterval(() => {
            this.move()
            //Zone searching time is always less than 23 hours of the first day of the colony.
            colony.zone_searched = this.current_year === 1 && this.current_week === 1 && this.current_day === 1 && this.current_hour === Colony.zone_search_hours_needed
            if(colony.zone_searched){
                colony.zone_searched_actions()
            }
            //An hour passed, update what's necessary
            //Remove expeditions already finished from screen.
            this.remove_finished_expeditions()
            this.run_countdowns()
            //If a day has passed, update what's necessary
            if(this.day_passed){
                this.update_all_citizens_xp()
                this.update_resource_extractions()
                this.check_critical_events("daily", 1)
                this.check_critical_events("weekly", 1)
            }
            //If a week has passed, update what's necessary
            if(this.week_passed){
                this.update_pregnancies()
                this.update_fertility_weeks()
                this.update_all_citizens_age()
            }
            //If a year has passed, update what's necessary
            if(this.year_passed){
                this.decrease_all_citizens_fertility()
            }
        }, GameTime.game_hour_real_duration)
    }
    stop = () => {
        clearInterval(this.time)
    }
}