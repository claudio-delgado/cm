class Expedition {
  //Obtain a new random mount considering certain conditions.
  //Is possible to obtain nothing.
  static get_random_mount_name = () => {
    let mounts = Landform.descriptions
    let no_active_water_reservoir = !colony.has_productive_water_reservoir()
    let active_hunting_mount = colony.has_productive_hunting_mount()
    //If water reservoir is not present in the colony or is depleted, automatically get another one.
    if(no_active_water_reservoir){
      return "waterReservoir"
    }
    //If hunting mount is present in the colony and not depleted, never get another one.
    if(active_hunting_mount){
      //Remove it from possible discovered mounts.
      delete(mounts["huntingMount"])
    }
    //Obtain mount probability (this is different from probability of finding a mount which is defined while player configures expedition)
    //Check from lower probability to higher.
    let random_value = Math.random()
    let current_probability = Number(!active_hunting_mount ? mounts["Mineral mount"]["discovery-probability-1"] : mounts["Mineral mount"]["discovery-probability-2"])
    if(random_value <= current_probability) return "mineralMount"
    current_probability += Number(!active_hunting_mount ? mounts["Clay mount"]["discovery-probability-1"] : mounts["Clay mount"]["discovery-probability-2"])
    if(random_value <= current_probability) return "clayMount"
    current_probability += Number(!active_hunting_mount ? mounts["Wood mount"]["discovery-probability-1"] : mounts["Wood mount"]["discovery-probability-2"])
    if(random_value <= current_probability) return "woodMount"
    current_probability += Number(!active_hunting_mount ? mounts["Stone mount"]["discovery-probability-1"] : mounts["Stone mount"]["discovery-probability-2"])
    if(random_value <= current_probability) return "stoneMount"
    return "huntingMount"
  }
  static get_carriage_capacity = (expeditionary_xp, mounted_expeditionaries) => {
      return Math.ceil((expeditionary_xp / 10) + 1/2) + 2 * mounted_expeditionaries
  }
  static undraw = (expedition_id) => {
    document.getElementById(`accordion-expedition-${expedition_id}`).remove()
    if(!colony.expeditions.size) colony.draw_no_active_expeditions()
  }
  static minimal_duration_in_hours = 4
  static resources_expedition_success_xp_gain = 1
  static resources_expedition_missed_xp_gain = 0.25
  static ruins_expedition_success_xp_gain = 1
  static ruins_expedition_missed_xp_gain = 0.25

  constructor(template = false) {
    this.id = (!template || !template.id) ? colony.get_next_expedition_id() : template.id
    this.departed_in = {"year": template && template.departed_in && template.departed_in.year ? template.departed_in.year : colony.time_interval.current_year, 
                        "week": template && template.departed_in && template.departed_in.week ? template.departed_in.week : colony.time_interval.current_week, 
                        "day": template && template.departed_in && template.departed_in.day ? template.departed_in.day : colony.time_interval.current_day,
                        "hour": template && template.departed_in && template.departed_in.hour ? template.departed_in.hour : colony.time_interval.current_hour}
    this.arrives_in = {"years": template && template.arrives_in && template.arrives_in.years ? template.arrives_in.years : colony.time_interval.current_year, 
                       "weeks": template && template.arrives_in && template.arrives_in.weeks ? template.arrives_in.weeks : colony.time_interval.current_week, 
                       "days": template && template.arrives_in && template.arrives_in.days ? template.arrives_in.days : colony.time_interval.current_day,
                       "hours": template && template.arrives_in && template.arrives_in.hours ? template.arrives_in.hours : colony.time_interval.current_hour}
    
    //Landform categories: mineralMount, clayMount, woodMount, stoneMount, huntingMount, waterReservoir
    this.category = template && template["category"] ? template["category"] : translate(language, "Unknown")
    this.result = {}
    if(this.category === "of resources"){
      this.result.mount = Expedition.get_random_mount_name()
    }
    if(this.category === "of ruins"){
      this.result.resources = {}
      this.result.products = {}
      this.result['building parts'] = {}
    }
    this.assigned_crew = new Map() //Can be soldiers, expeditionaires, horses, catapults and wagons.
    this.last_landform_id = 0
  }

  get_category_text = () => {
    return this.category === "of resources"
            ? translate(language, "Expedition to discover resources mounts")
            : (this.category === "of ruins"
              ? translate(language, "Expedition to discover ruins")
              : (this.category === "of combat"
                ? translate(language, "Expedition to attack other colonies")
                : translate(language, "Unknown yet", "f")))
  }
  get_category_button_text = () => {
    return this.category === "of resources"
            ? translate(language, "Start resources mounts expedition")
            : (this.category === "of ruins"
              ? translate(language, "Start ancient ruins expedition")
              : (this.category === "of combat"
                ? translate(language, "Start combat expedition")
                : translate(language, "Unknown yet", "f")))
  }
  get_assigned_crew = (filter_template) => {
    if(filter_template?.rolekey){
      return new Map([...this.assigned_crew.entries()].filter(([key, crew_member]) => crew_member?.rolekey == filter_template.rolekey))
    }
    if(filter_template?.type){
      return new Map([...this.assigned_crew.entries()].filter(([key, crew_member]) => crew_member?.type == filter_template.type))
    }
    return this.assigned_crew
  }
  get_assigned_expeditionaries = () => {
    return new Map([...this.assigned_crew.entries()].filter(([key, crew_member]) => crew_member?.rolekey == "expeditioning"))
  }
  get_assigned_horses = () => {
    return this.get_assigned_crew({"type": "horse"})
  }
  get_assigned_wagons = () => {
    return this.get_assigned_crew({"type": "wagon"})
  }
  get_assigned_catapults = () => {
    return this.get_assigned_crew({"type": "catapult"})
  }
  get_probability = () => {
    //Returns the probability of finding a new mount in an expedition.
    //It depends on current already successful expeditions done, the amount of expeditionaries assigned, and their xp.
    let successful_expeditions = (this.category === "of resources") 
                                  ? colony.statistics.expeditions.resources.successful 
                                  : colony.statistics.expeditions.ruins.successful
    let probability, last_expeditions_factor, expeditionaries_factor, xp_factor, avg_xp_factor
    let assigned_expeditionaries = this.get_assigned_crew({"rolekey": "expeditioning"})
    //Calculate xp statistics
    let average_XP = 0, max_XP = 0
    if(assigned_expeditionaries){
      assigned_expeditionaries.forEach(expeditionary => {
        average_XP = expeditionary.xp
        max_XP = expeditionary.xp > max_XP ? expeditionary.xp : max_XP
      })
    }
    if(this.category === "of resources"){
        last_expeditions_factor = (successful_expeditions + 1)
        xp_factor = (-1 / (max_XP + 1)) + 1
        avg_xp_factor = (-1 / (average_XP + 1)) + 1
        let probability_1st_term = assigned_expeditionaries.size / (assigned_expeditionaries.size + last_expeditions_factor)
        let probability_2nd_term = ((7 / 10) - (7 * assigned_expeditionaries.size / (10 * assigned_expeditionaries.size + 10))) * xp_factor
        let probability_3rd_term = ((3 / 10) - (3 * assigned_expeditionaries.size / (10 * assigned_expeditionaries.size + 10))) * avg_xp_factor
        probability = (probability_1st_term + probability_2nd_term + probability_3rd_term).toFixed(3)
    } else {
        if(this.category === "of ruins"){
            last_expeditions_factor = 1 / (successful_expeditions + 3)
            expeditionaries_factor = (2 * (assigned_expeditionaries - 1)) / (10 * assigned_expeditionaries + 20)
            xp_factor = (4 * max_XP) / (10 * max_XP + 20)
            avg_xp_factor = average_XP / (10 * average_XP + 20)
            probability = last_expeditions_factor + expeditionaries_factor + xp_factor + avg_xp_factor
        } else {
            return 0
            //Later work on this part.
        }
    }
    this.probability = Number(probability)
    return this.probability
  }
  get_required_time = () => {
    //Returns the amount of ingame hours needed for an expedition.
    //It depends on the current already successfull expeditions done, mounted expeditionaries assigned and expeditionaries xp.
    let successful_expeditions = colony.get_successful_expeditions(this.category)
    let total_expeditions_history = successful_expeditions + colony.get_missed_expeditions(this.category)
    let average_XP = 0, max_XP = 0
    let assigned_expeditionaries = this.get_assigned_crew({"rolekey": "expeditioning"})
    if(assigned_expeditionaries.size){
      //Calculate xp statistics
      assigned_expeditionaries.forEach(expeditionary => {
        average_XP = expeditionary.xp
        max_XP = expeditionary.xp > max_XP ? expeditionary.xp : max_XP
      })
      //Calculate time
      //Horses assigned are only considered if at least there is one per expeditionary.
      let horses_assigned = this.get_assigned_horses().size
      horses_assigned = horses_assigned >= assigned_expeditionaries.size ? horses_assigned : 0
      let in_game_total_hours, in_game_total_days, in_game_total_weeks, in_game_total_years
      let in_game_clock_years, in_game_clock_weeks, in_game_clock_weeksD, in_game_clock_days, in_game_clock_daysD, in_game_clock_hours
      let real_total_days, real_total_hours, real_total_minutes, real_total_seconds
      let real_clock_days, real_clock_hours, real_clock_hoursD, real_clock_minutes, real_clock_minutesD, real_clock_seconds
      let last_expeditions_factor, horses_factor, xp_factor, horses_and_xp_factor
      if(this.category === "of resources"){
          last_expeditions_factor = (Math.pow(2, successful_expeditions + 1) + 2) + total_expeditions_history
          horses_factor = (2*horses_assigned + 1)
          xp_factor = max_XP / 2 + average_XP / 5
          in_game_total_hours = Expedition.minimal_duration_in_hours + (last_expeditions_factor / (horses_factor + xp_factor))
      } else {
          if(this.category === "of ruins"){
              last_expeditions_factor = (2 * Math.pow(successful_expeditions, 3) + 2 * Math.pow(successful_expeditions, 2) + 140 * (successful_expeditions + 1))
              horses_and_xp_factor = 100 * (horses_assigned + 1 + max_XP / 5 + average_XP / 20)
              in_game_total_hours = Expedition.minimal_duration_in_hours + last_expeditions_factor / horses_and_xp_factor
          } else {
              return 0
          }
      }
      /*in_game_total_hours += 53 * 24 * 7 */ 
      in_game_total_days = in_game_total_hours / 24
      in_game_total_weeks = in_game_total_days / 7
      in_game_total_years = in_game_total_weeks / 52
      in_game_clock_years = Math.floor(in_game_total_years)
      in_game_clock_weeksD = (in_game_total_years - in_game_clock_years) * 52, in_game_clock_weeks = Math.floor(in_game_clock_weeksD)
      in_game_clock_daysD = (in_game_clock_weeksD - in_game_clock_weeks) * 7, in_game_clock_days = Math.floor(in_game_clock_daysD)
      in_game_clock_hours = Math.floor((in_game_clock_daysD - in_game_clock_days) * 24)
      real_total_days = (in_game_total_hours * 1.79) / 60 / 60 / 24
      real_total_hours = (in_game_total_hours * 1.79) / 60 / 60
      real_total_minutes = (in_game_total_hours * 1.79) / 60
      real_total_seconds = (in_game_total_hours * 1.79)
      real_clock_days = Math.floor(real_total_days)
      real_clock_hoursD = (real_total_days - real_clock_days) * 24, real_clock_hours = Math.floor(real_clock_hoursD)
      real_clock_minutesD = (real_clock_hoursD - real_clock_hours) * 60, real_clock_minutes = Math.floor(real_clock_minutesD)
      real_clock_seconds = Math.floor((real_clock_minutesD - real_clock_minutes) * 60)
      return {
          "inGame": {
              "totalYears": in_game_total_years, 
              "totalWeeks": in_game_total_weeks, 
              "totalDays": in_game_total_days, 
              "totalHours": in_game_total_hours, 
              "clock": {
                  "years": in_game_clock_years, 
                  "weeks": in_game_clock_weeks, 
                  "days": in_game_clock_days, 
                  "hours": in_game_clock_hours ? in_game_clock_hours : "1"
              }
          },
          "real": {
              "totalDays": real_total_days,
              "totalHours": real_total_hours,
              "totalMinutes": real_total_minutes,
              "totalSeconds": real_total_seconds,
              "clock": {
                  "days": real_clock_days,
                  "hours": real_clock_hours,
                  "minutes": real_clock_minutes,
                  "seconds": real_clock_seconds,
              }
          }
      }
    } else {
      return false
    }
  }

  start_expedition = () => {
    //Prepare expedition data and show it on "Active expeditions area".
    //Define departure date.
    this.departed_in.hour = colony.time_interval.current_hour
    this.departed_in.day = colony.time_interval.current_day
    this.departed_in.week = colony.time_interval.current_week
    this.departed_in.year = colony.time_interval.current_year
    //Change crew expeditionaires status from "assigned" to "travelling".
    this.get_assigned_crew({"rolekey": "expeditioning"}).forEach(citizen => citizen.set_status("travelling"))
    //This change may afect vital resources income.
    colony.update_colony_vital_resources()
    //Take assigned horses, if there are, out from stock.
    let assigned_horses_amount = this.get_assigned_horses().size
    if(assigned_horses_amount){
      let current_horses = colony.stock.products.get("horse")
      colony.stock.products.set("horse", Math.max(0, current_horses - assigned_horses_amount))
    }
    //Take assigned wagons, if there are, out from stock.
    let assigned_wagons_amount = this.get_assigned_wagons().size
    if(assigned_wagons_amount){
      let current_wagons = colony.stock.products.get("wagon")
      colony.stock.products.set("wagon", Math.max(0, current_wagons - assigned_wagons_amount))
    }
    //Take assigned catapults (for combat expeditions), if there are, out from stock.
    let assigned_catapults_amount = this.get_assigned_catapults().size
    if(assigned_catapults_amount){
      let current_catapults = colony.stock.products.get("catapult")
      colony.stock.products.set("catapult", Math.max(0, current_catapults - assigned_catapults_amount))
    }
    //Add expedition to colony list.
    colony.expeditions.set(this.id, this)
    if(colony.active_panel) colony.active_panel.close()
    this.draw_new()
  }

  end_expedition = () => {
    //Crew is back in town.
    //Restock horses if assigned.
    let assigned_horses = this.get_assigned_horses()
    if(assigned_horses.size){
      let current_horses = colony.stock.products.get("horse")
      colony.stock.products.set("horse", current_horses + assigned_horses.size)
    }
    //Restock wagons if assigned.
    let assigned_wagons = this.get_assigned_wagons()
    if(assigned_wagons.size){
      let current_wagons = colony.stock.products.get("wagon")
      colony.stock.products.set("wagon", current_wagons + assigned_wagons.size)
    }
    //Restock catapults if assigned.
    let assigned_catapults = this.get_assigned_catapults()
    if(assigned_catapults.size){
      let current_catapults = colony.stock.products.get("catapult")
      colony.stock.products.set("catapult", current_catapults + assigned_catapults.size)
    }
    if(this.category == "of resources"){
      //Evaluate if it's possible to find a mount.
      let random_value = Math.random()
      let finding_mount_possible = random_value < this.probability       
      if(finding_mount_possible && this.result.mount){
        //A new mount was found!
        this.result.success = true
        let landform_template = {"name": translate(language, Landform.fromCamelCase[this.result.mount]), "category": this.result.mount}
        let new_landform = new Landform(landform_template)
        colony.add_landform(new_landform)
        new_landform.draw()
        colony.statistics.expeditions.resources.successful++
        colony.add_score(Number(Landform.descriptions[Landform.fromCamelCase[this.result.mount]].score))
      } else {
        this.result.success = false
        colony.statistics.expeditions.resources.missed++
      }
      let assigned_expeditionaries = this.get_assigned_expeditionaries()
      //Change crew expeditionaires status from "travelling" to "idle" and increase their XP.
      assigned_expeditionaries.forEach(citizen => {
        citizen.set_status("idle")
        citizen.set_xp(citizen.xp + (this.result.success 
                                      ? Expedition.resources_expedition_success_xp_gain 
                                      : Expedition.resources_expedition_missed_xp_gain))
      })
      this.redraw_history()
    }
    //After the result of active expedition, set panel showing that expedition is finished.
    let active_expedition_div = document.querySelector(`#expedition-${this.id}`)
    active_expedition_div.querySelectorAll("p").forEach(elem => elem.remove())
    //Build "FINISHED" label on panel.
    let s = new DOMElement({
      tagName: "span",
      classes: `flex w-100 expedition-finished border border-gray-800 p-0.5 px-1 bg-${this.result.success ? "green" : "red"}-700 font-bold text-base text-white`,
      parentElement: active_expedition_div
    })
    let s1 = new DOMElement({
      tagName: "span",
      attributes: [{"key": "data-i18n", "value": ""}],
      parentElement: s.getNode(),
      text: translate(language, "ended", "f", "uppercase")
    })
    //Remove finished expedition from colony list.
    colony.expeditions.delete(this.id)
  }

  draw = (container) => {
    let p, p1, s, s1, s2, s3, i
    const draw_content = (e) => {
      const draw_no_crew = (div, label_text) => {
        p = new DOMElement({
          tagName: "p",
          classes: "empty text-xs flex justify-between text-gray-200",
          parentElement: div
        })
        s = new DOMElement({
          tagName: "span",
          parentElement: p.getNode()
        })
        i = new DOMElement({
          tagName: "i",
          classes: "fa fa-light fa-empty-set me-1",
          parentElement: s.getNode()
        })
        s1 = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n", "value":""}],
          parentElement: s.getNode(),
          text: translate(language, label_text)
        })
      }
      const change_expedition_statistics = () => {
        //Calculate required expedition time.
        let time_required = this.get_required_time()
        if(time_required){
          //Update expedition required time in memory.
          this.arrives_in.years = time_required.inGame.clock.years
          this.arrives_in.weeks = time_required.inGame.clock.weeks
          this.arrives_in.days = time_required.inGame.clock.days
          this.arrives_in.hours = time_required.inGame.clock.hours
          //Update expedition required time on screen.
          DOMElement.show(["#newExpedition-required-info"])
          DOMElement.hide([".unknownTime"])
          if(time_required.inGame.clock.years > 0){
            DOMElement.show(["#newExpedition-required-years", "#newExpedition-required-yearsText", "#newExpedition-required-yearsComma"])
          } else {
            DOMElement.hide(["#newExpedition-required-years, #newExpedition-required-yearsText, #newExpedition-required-yearsComma"])
          }
          //Update years required.
          DOMElement.set_text("#newExpedition-required-years", time_required.inGame.clock.years)
          DOMElement.set_text("#newExpedition-required-yearsText", time_required.inGame.clock.years != 1 ? translate(language, "Years", "lowercase") : translate(language, "Years", "lowercase").slice(0, -1))
          if(time_required.inGame.clock.weeks > 0){ 
            DOMElement.show(["newExpedition-required-weeks", "newExpedition-required-weeksText", "newExpedition-required-weeksComma"])  
          } else {
            DOMElement.hide(["#newExpedition-required-weeks", "#newExpedition-required-weeksText", "#newExpedition-required-weeksComma"])
          }
          //Update weeks required.
          DOMElement.set_text("#newExpedition-required-weeks", time_required.inGame.clock.weeks)
          DOMElement.set_text("#newExpedition-required-weeksText", time_required.inGame.clock.weeks != 1 ? translate(language, "Weeks", "lowercase") : translate(language, "Weeks", "lowercase").slice(0, -2)+".")
          if(time_required.inGame.clock.days > 0){ 
            DOMElement.show(["#newExpedition-required-days", "#newExpedition-required-daysText", "#newExpedition-required-daysComma"])  
          } else {
            DOMElement.hide(["#newExpedition-required-days", "#newExpedition-required-daysText", "#newExpedition-required-daysComma"])
          }
          //Update days and hours required.
          DOMElement.set_text("#newExpedition-required-days", time_required.inGame.clock.days)
          DOMElement.set_text("#newExpedition-required-daysText", time_required.inGame.clock.days != 1 ? translate(language, "Days", "lowercase") : translate(language, "Days", "lowercase").slice(0, -1))
          DOMElement.set_text("#newExpedition-required-hours", time_required.inGame.clock.hours)
        } else {
          //Hide required time info and show "(Unknown yet)"
          DOMElement.hide(["#newExpedition-required-info"])
          DOMElement.show([".unknownTime"])
        }
        
        //Change probability
        let assigned_expeditionaries = this.get_assigned_crew({"rolekey": "expeditioning"})
        let discovery_probability = assigned_expeditionaries.size ? this.get_probability() : 0
        if(colony.time_started){
          //TODO later.
          //Show "Start new expedition" button and hide "No actions available"
          DOMElement.hide(["#newExpeditionNoActions"])
          DOMElement.show(["#expeditionStart"])
          DOMElement.set_text("#expeditionStart span", translate(language, this.get_category_button_text()))
          //if(document.querySelector("#expeditionStart").classList.contains("unattached-click")){
          if(DOMElement.has_classes("#expeditionStart", ["unattached-click"])){
              //DOMElement.set_attributes("#expeditionStart", [{"data-type": this.category}])
              //Add click "Start new expedition" button event
              document.querySelector("#expeditionStart").addEventListener("click", this.start_expedition)
              DOMElement.remove_classes("#expeditionStart", ["unattached-click"])
          }
        } else {
          DOMElement.show(["#searchZoneWarning"])
        }
        DOMElement.set_text("#expeditionProbability", discovery_probability > 0
                                                      ? (discovery_probability * 100).toFixed(1) + "%"
                                                      : "(" + translate(language, "Unknown yet", "f") + ")")
      }
      const add_available_expeditionary_to_expedition = (citizen) => {
        const remove_assigned_expeditionary_event = (e) => {
          let h2 = e.target.closest("h2")
          //Adapt available expeditionary.
          let citizen_id = Number(h2.dataset.citizenId)
          h2.classList.remove("assignedExpeditionary")
          h2.classList.add("availableExpeditionary")
          let i = h2.querySelector("div i.assignable")
          i.classList.remove("fa-minus")
          i.classList.add("fa-plus")
          i.removeEventListener("click", remove_assigned_expeditionary_event)
          i.addEventListener("click", add_assigned_expeditionary_event)
          //Remove expeditionary from expedition crew.
          //Remove "no available expeditionary" message if exists.
          let available_expeditionary_panel = document.querySelector("#newExpedition-available-expeditionaries")
          let available_expeditionaries_no_expeditionaries = available_expeditionary_panel.querySelector("p")
          if(available_expeditionaries_no_expeditionaries) available_expeditionaries_no_expeditionaries.remove()
          available_expeditionary_panel.appendChild(h2)
          //Change citizen status.
          colony.citizens.get(citizen_id).set_status("idle")
          //Remove citizen from crew structure
          this.assigned_crew.delete(citizen_id)
          //Check if there is no assigned crew
          let assigned_crew_panel = document.querySelector("#newExpedition-assignedCrew")
          let assigned_crew_exists = assigned_crew_panel.querySelector("h2")
          if(!assigned_crew_exists){
            draw_no_crew(assigned_crew_panel, "No crew assigned")
          }
          //Process expedition statistics.
          change_expedition_statistics()
        }
        const add_assigned_expeditionary_event = (e) => {
          let h2 = e.target.closest("h2")
          //Adapt assigned object.
          let citizen_id = Number(h2.dataset.citizenId)
          h2.classList.remove("availableExpeditionary")
          h2.classList.add("assignedExpeditionary")
          let i = h2.querySelector("div i.assignable")
          i.classList.remove("fa-plus")
          i.classList.add("fa-minus")
          i.removeEventListener("click", add_assigned_expeditionary_event)
          i.addEventListener("click", remove_assigned_expeditionary_event)
          //Add expedtionary to expedition crew.
          //Remove "no assigned crew" message if exists.
          let assigned_crew_panel = document.querySelector("#newExpedition-assignedCrew")
          let assigned_crew_no_crew = assigned_crew_panel.querySelector("p")
          if(assigned_crew_no_crew) assigned_crew_no_crew.remove()
          assigned_crew_panel.appendChild(h2)
          //Change citizen status.
          colony.citizens.get(citizen_id).set_status("assigned")
          //Assign citizen to crew structure
          this.assigned_crew.set(citizen_id, colony.citizens.get(citizen_id))
          //Check if there is no available expeditionary
          let available_expeditionary_panel = document.querySelector("#newExpedition-available-expeditionaries")
          let available_expeditionary_exists = available_expeditionary_panel.querySelector("h2")
          if(!available_expeditionary_exists){
            draw_no_crew(available_expeditionary_panel, "No expeditionaries available")
          }
          //Process expedition statistics.
          change_expedition_statistics()
        }
        let parentElem = document.querySelector("#newExpedition-available-expeditionaries")
        //Remove "no available expeditionaries" text, if exists
        if(parentElem.querySelector(".empty")){
            parentElem.querySelector(".empty").remove()
        }
        h2 = new DOMElement({
          tagName: "h2",
          classes: "availableExpeditionary w-100",
          attributes: [{"key": "data-citizen-id", "value": citizen.id}],
          parentElement: parentElem,
          id: `available-citizen-${citizen.id}`
        })
        d = new DOMElement({
          tagName: "div",
          classes: "flex items-center justify-between w-full p-1 px-2 text-xs bg-gray-900 font-medium border border-gray-700 gap-3 text-gray-400",
          parentElement: h2.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          parentElement: d.getNode()
        })
        //Gender citizen icon
        i = new DOMElement({
          tagName: "i",
          classes: document.getElementById(`citizen-${citizen.id}-gender-icon`).classList.toString(),
          parentElement: s.getNode(),
          id: `citizen-${citizen.id}-gender-icon`
        })
        //Age citizen icon
        s1 = new DOMElement({
          tagName: "span",
          parentElement: s.getNode()
        })
        i = new DOMElement({
          tagName: "i",
          classes: `fa text-white fa-person`,
          parentElement: s1.getNode(),
          id: `citizen-${citizen.id}-age-icon`
        })
        i = new DOMElement({
          tagName: "i",
          classes: document.getElementById(`citizen-${citizen.id}-age-group-icon`).classList.toString(),
          attributes: [{"key": "style", "value": "font-size:50% !important"}],
          parentElement: s1.getNode(),
          id: `citizen-${citizen.id}-age-group-icon`
        })
        //Role citizen icon
        i = new DOMElement({
          tagName: "i",
          classes: document.getElementById(`citizen-${citizen.id}-role-icon`).classList.toString(),
          parentElement: s.getNode(),
          id: `citizen-${citizen.id}-role-icon`
        })
        //XP citizen icon
        s1 = new DOMElement({
          tagName: "span",
          classes: `${citizen.xp >= 1 ? "" : "hidden"} rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 me-1`,
          parentElement: s.getNode(),
          id: `citizen-${citizen.id}-xp-icon`,
          text: Math.floor(citizen.xp).toString()
        })
        //Citizen full name
        s1 = new DOMElement({
          tagName: "span",
          classes: "ms-1",
          parentElement: s.getNode(),
          id: `citizen-${citizen.id}-name`,
          text: citizen.name
        })
        s = new DOMElement({
          tagName: "span",
          parentElement: d.getNode()
        })
        //View citizen info
        i = new DOMElement({
          tagName: "i",
          classes: "fa fa-eye me-2",
          attributes: [{"key":"data-citizen-id", "value":citizen.id}],
          parentElement: s.getNode(),
          id: `citizen-${citizen.id}-view-info`
        })
        i.getNode().addEventListener("click", citizen.show_citizen_info_modal_event)
        //Assign expeditionary as part of the crew
        i = new DOMElement({
          tagName: "i",
          classes: "assignable text-sm fa fa-plus",
          parentElement: s.getNode(),
          id: `citizen-${citizen.id}-assign`
        })
        i.getNode().addEventListener("click", add_assigned_expeditionary_event)
      }
      const add_available_crew_object_to_expedition = () => {
        const remove_assigned_object_event = (e) => {
          let h2 = e.target.closest("h2")
          //Adapt available object.
          h2.classList.remove("assignedHorse")
          h2.classList.add("availableHorse")
          let i = h2.querySelector("div i.assignable")
          i.classList.remove("fa-minus")
          i.classList.add("fa-plus")
          i.removeEventListener("click", remove_assigned_object_event)
          i.addEventListener("click", add_assigned_object_event)
          //Remove object from expedition crew.
          //Remove "no available crew" message if exists.
          let available_objects_panel = document.querySelector("#newExpedition-available-objects")
          let available_objects_no_objects = available_objects_panel.querySelector("p")
          if(available_objects_no_objects) available_objects_no_objects.remove()
          available_objects_panel.appendChild(h2)
          //Remove first horse found from crew structure.
          this.assigned_crew.delete(this.get_assigned_horses().keys().next().value)
          //this.assigned_crew.forEach((crew_member, member_id) => { if(crew_member?.type == "horse"){ this.assigned_crew.delete(member_id) } })
          //Check if there is no assigned crew
          let assigned_crew_panel = document.querySelector("#newExpedition-assignedCrew")
          let assigned_crew_exists = assigned_crew_panel.querySelector("h2")
          if(!assigned_crew_exists){
            draw_no_crew(assigned_crew_panel, "No crew assigned")
          }
          change_expedition_statistics()
        }
        const add_assigned_object_event = (e) => {
          let h2 = e.target.closest("h2")
          //Adapt assigned object.
          h2.classList.remove("availableHorse")
          h2.classList.add("assignedHorse")
          let i = h2.querySelector("div i.assignable")
          i.classList.remove("fa-plus")
          i.classList.add("fa-minus")
          i.removeEventListener("click", add_assigned_object_event)
          i.addEventListener("click", remove_assigned_object_event)
          //Add object to crew structure.
          let crew_object = {}
          crew_object.type = "horse"
          let crew_id = "h1"
          this.assigned_crew.forEach((crew_member, member_id) => { if(member_id == crew_id){ crew_id = "h"+(Number(crew_id[1])+1) } })
          this.assigned_crew.set(crew_id, crew_object)
          //Remove "no assigned crew" message if exists.
          let assigned_crew_panel = document.querySelector("#newExpedition-assignedCrew")
          let assigned_crew_no_crew = assigned_crew_panel.querySelector("p")
          if(assigned_crew_no_crew) assigned_crew_no_crew.remove()
          assigned_crew_panel.appendChild(h2)
          //Check if there is no available object
          let available_object_panel = document.querySelector("#newExpedition-available-objects")
          let available_object_exists = available_object_panel.querySelector("h2")
          if(!available_object_exists){
            draw_no_crew(available_object_panel, "No other objects available")
          }
          change_expedition_statistics()
        }
        let parent_elem = document.querySelector("#newExpedition-available-objects")
        //Remove "no available objects" text, if exists
        if(document.querySelector(".newExpedition .availableObjects .empty")!=null){
            document.querySelector(".newExpedition .availableObjects .empty").remove()
        }
        h2 = new DOMElement({
          tagName: "h2",
          classes: "availableHorse w-100",
          parentElement: parent_elem
        })
        d = new DOMElement({
          tagName: "div",
          classes: "flex items-center justify-content w-full p-1 px-2 text-xs text-gray-400 bg-gray-900 font-medium border border-gray-700 gap-3 text-gray-400",
          parentElement: h2.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          classes: "grow",
          parentElement: d.getNode()
        })
        //Add horse
        //Horse icon
        i = new DOMElement({
          tagName: "i",
          classes: "fa fa-horse",
          parentElement: s.getNode()
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: "mx-1",
          parentElement: s.getNode(),
          text: translate(language, "Horse", "", "capitalized")
        })
        //Assign horse button
        i = new DOMElement({
          tagName: "i",
          classes: "assignable text-sm fa fa-plus",
          parentElement: d.getNode()
        })
        i.getNode().addEventListener("click", add_assigned_object_event)
        return i.getNode()
      }
      let parent_div = document.getElementById("expeditions-actions-body-panel-body")
      let clicked_button = e.target.closest("button")
      //Build expedition type legend with colors.
      this.category = clicked_button.getAttribute("data-type")
      let background = this.category === "of resources" ? "green-800" : (this.category === "of ruins" ? "sky-800" : "red-900")
      //Hide all expedition type buttons.
      document.querySelectorAll(".expeditionType button").forEach((button) => button.classList.add("hidden"))
      //let typeText = `Expedition to ${type === "of resources" ? "discover resources mounts" : (type === "of ruins" ? "discover ruins" : "attack other colonies")}`
      let typeText = this.get_category_text()
      s1 = new DOMElement({
        tagName: "span",
        classes: "grow p-1 py-0.5 text-white border border-gray-800 bg-"+background,
        attributes: [{"key":"data-i18n", "value":""},{"key":"data-type", "value":this.category}],
        parentElement: clicked_button.closest("p"),
        text: translate(language, typeText)
      })
      //Build needed time text
      p1 = new DOMElement({
        tagName: "p",
        classes: "flex w-100 gap-1 justify-between items-center flex-wrap text-gray-300",
        parentElement: parent_div
      })
      s = new DOMElement({
        tagName: "span",
        classes: "flex",
        parentElement: p1.getNode()
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white",
        parentElement: s.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n", "value":""}],
        parentElement: s2.getNode(),
        text: translate(language, "Required travel time")
      })
      s1 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n", "value":""}],
        parentElement: s2.getNode(),
        text: ":"
      })
      s = new DOMElement({
        tagName: "span",
        classes: "grow flex-none border border-gray-800 p-0.5 px-1 bg-gray-400 border border-gray-500 font-bold text-gray-800",
        parentElement: p1.getNode(),
        id: "expeditionRequiredTime",
      })
      //Initially hidden required time information
      s2 = new DOMElement({
        tagName: "span",
        classes: "hidden",
        parentElement: s.getNode(),
        id: "newExpedition-required-info"
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "hidden font-bold",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s2.getNode(),
        id: "newExpedition-required-years"
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "hidden ms-1",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s2.getNode(),
        id: "newExpedition-required-yearsText",
        text: translate(language, "Years", "", "lowercase")
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "hidden",
        parentElement: s2.getNode(),
        id: "newExpedition-required-yearsComma",
        text: ", "
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "hidden font-bold",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s2.getNode(),
        id: "newExpedition-required-weeks"
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "hidden ms-1",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s2.getNode(),
        id: "newExpedition-required-weeksText",
        text: translate(language, "Weeks", "", "lowercase")
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "hidden",
        parentElement: s2.getNode(),
        id: "newExpedition-required-weeksComma",
        text: ", "
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "hidden font-bold",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s2.getNode(),
        id: "newExpedition-required-days"
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "hidden ms-1",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s2.getNode(),
        id: "newExpedition-required-daysText",
        text: translate(language, "Days", "", "lowercase")
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "hidden",
        parentElement: s2.getNode(),
        id: "newExpedition-required-daysComma",
        text: ", "
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "font-bold",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s2.getNode(),
        id: "newExpedition-required-hours"
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "ms-1",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s2.getNode(),
        text: "hs."
      })
      //Unknown yet text
      s1 = new DOMElement({
        tagName: "span",
        classes: "unknownTime",
        parentElement: s.getNode(),
        text: "("
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "unknownTime",
        attributes: [{"key":"data-i18n", "value":""},{"key":"gender", "value":"m"}],
        parentElement: s.getNode(),
        id: "newExpeditionTime",
        text: translate(language, "Unknown yet", "m")
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "unknownTime",
        parentElement: s.getNode(),
        text: ")"
      })
      //Build mount discovery probability text
      p1 = new DOMElement({
        tagName: "p",
        classes: "flex w-100 gap-1 justify-between items-center flex-wrap text-gray-300",
        parentElement: parent_div
      })
      s = new DOMElement({
        tagName: "span",
        classes: "flex",
        parentElement: p1.getNode()
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white",
        parentElement: s.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n", "value":""}],
        parentElement: s2.getNode(),
        text: translate(language, "Mount discovery probability")
      })
      s1 = new DOMElement({
        tagName: "span",
        parentElement: s2.getNode(),
        text: ":"
      })
      s = new DOMElement({
        tagName: "span",
        classes: "grow px-1 py-0.5 bg-gray-400 border border-gray-800 font-bold text-gray-800",
        parentElement: p1.getNode(),
        id: "expeditionProbability"
      })
      s1 = new DOMElement({
        tagName: "span",
        parentElement: s.getNode(),
        text: "("
      })
      s1 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n", "value":""},{"key":"gender", "value":"f"}],
        parentElement: s.getNode(),
        id: "newExpeditionProbability",
        text: translate(language, "Unknown yet", "f")
      })
      s1 = new DOMElement({
        tagName: "span",
        parentElement: s.getNode(),
        text: ")"
      })
      //Zone search required message
      p = new DOMElement({
        tagName: "p",
        classes: "hidden w-100 p-2 px-3 rounded font-bold text-white border border-white bg-red-900",
        parentElement: parent_div,
        id: "searchZoneWarning"
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "me-1",
        attributes: [{"key":"data-i18n", "value":""}],
        parentElement: p.getNode(),
        text: translate(language, "Warning! Time is stopped. Search the zone in the Colony panel to start your game.")
      })
      //Build New expedition available actions title
      d1 = new DOMElement({
        tagName: "div",
        classes: "w-100",
        parentElement: parent_div
      })
      d2 = new DOMElement({
        tagName: "div",
        classes: "w-100 border border-gray-800 bg-gray-800 text-xs",
        parentElement: d1.getNode(),
        id: "newExpedition-actions-title"
      })
      p = new DOMElement({
        tagName: "p",
        classes: "text-xs flex justify-between p-1 ps-2 text-gray-200",
        parentElement: d2.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: p.getNode(),
        text: translate(language, "Actions available")
      })
      //Build New expedition available actions area
      d2 = new DOMElement({
        tagName: "div",
        classes: "activeExpeditions p-1 border border-gray-800 bg-gray-600 text-xs",
        parentElement: d1.getNode(),
        id: "newExpedition-actions-area"
      })
      p = new DOMElement({
        tagName: "p",
        classes: "empty w-100 text-xs flex justify-between text-gray-200",
        parentElement: d2.getNode()
      })
      b = new DOMElement({
        tagName: "button",
        classes: "hidden unattached-click text-xs grow p-2 button border border-gray-400 bg-gray-800",
        parentElement: p.getNode(),
        id: "expeditionStart"
      })
      i = new DOMElement({
        tagName: "i",
        classes: "mt-0.5 fa fa-play",
        parentElement: b.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "ms-2 grow",
        attributes: [{"key":"data-i18n", "value":""}],
        parentElement: b.getNode(),
        text: translate(language, "Start resources mounts expedition")
      })
      s1 = new DOMElement({
        tagName: "span",
        parentElement: p.getNode(),
        id: "newExpeditionNoActions"
      })
      i = new DOMElement({
        tagName: "i",
        classes: "fa fa-light fa-empty-set me-1",
        parentElement: s1.getNode()
      })
      s2 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n","value":""},{"key":"gender","value":"f"}],
        parentElement: s1.getNode(),
        text: translate(language, "None", "f")
      })
      //Build crew/army assigned title
      let assignedType = this.category === "of combat" ? "army" : "crew"
      d = new DOMElement({
        tagName: "div",
        classes: "border border-gray-800 bg-gray-800 text-xs",
        parentElement: d1.getNode(),
        id: `newExpedition-assigned-${assignedType}-title`
      })
      p = new DOMElement({
        tagName: "p",
        classes: "text-xs flex justify-between p-1 ps-2 text-gray-200",
        parentElement: d.getNode()
      })
      s = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n", "value":""}],
        parentElement: p.getNode(),
        text: translate(language, "Assigned crew")
      })
      //Build crew assigned panel
      let assignedType_camel = assignedType.charAt(0).toUpperCase()+assignedType.slice(1)
      d = new DOMElement({
        tagName: "div",
        classes: `assigned${assignedType_camel} flex flex-wrap gap-1 p-1 border border-gray-800 bg-gray-600 text-xs`,
        parentElement: d1.getNode(),
        id: `newExpedition-assigned${assignedType_camel}`
      })
      draw_no_crew(d.getNode(), `No ${assignedType} assigned`)

      //Build available expeditionaries/army title
      assignedType = this.category === "of combat" ? "army" : "expeditionaries"
      d = new DOMElement({
        tagName: "div",
        classes: "border border-gray-800 bg-gray-800 text-xs",
        parentElement: d1.getNode(),
        id: `newExpedition-available-${assignedType}-title`
      })
      p = new DOMElement({
        tagName: "p",
        classes: "text-xs flex justify-between p-1 ps-2 text-gray-200",
        parentElement: d.getNode()
      })
      s = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n", "value":""}],
        parentElement: p.getNode(),
        text: translate(language, `Available ${assignedType}`)
      })
      //Build available expeditionaries/army panel
      d = new DOMElement({
        tagName: "div",
        classes: `available${assignedType.charAt(0).toUpperCase()+assignedType.slice(1)} flex flex-wrap gap-1 p-1 border border-gray-800 bg-gray-600 text-xs`,
        parentElement: d1.getNode(),
        id: `newExpedition-available-${assignedType}`
      })
      if(this.category != "of combat"){
        //Check if there are available expeditionaries to add here. If not, place the "No workers available" text instead.
        let available_expeditionaries = colony.get_filtered_citizens({"rolekey":"expeditioning", "status":"idle"})
        if(available_expeditionaries.size){
          available_expeditionaries.forEach(citizen => {
            add_available_expeditionary_to_expedition(citizen)
          })
        }
        if(!available_expeditionaries.size){
          //Add "No workers/army available" text.
          p = new DOMElement({
            tagName: "p",
            classes: "empty text-xs flex justify-between text-gray-200",
            parentElement: d.getNode()
          })
          s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode()
          })
          i = new DOMElement({
            tagName: "i",
            classes: "fa fa-light fa-empty-set me-1",
            parentElement: s.getNode()
          })
          s1 = new DOMElement({
            tagName: "span",
            attributes: [{"key":"data-i18n", "value":""}],
            parentElement: s.getNode(),
            text: translate(language, "No "+(assignedType === "workers" ? "expeditionaries" : assignedType)+" available")
          })
        }
      } else {
        let available_soldiers_exist = false
        //Check if there are available soldiers to add here. If not, place the "No soldiers available" text instead.
        if(colony.get_filtered_citizens({"rolekey":"war", "status":"idle"}).size){
          available_soldiers_exist = true
          //add_available_soldier_to_expedition()
        } else {
          //Add "No army available" text.
          p = new DOMElement({
            tagName: "p",
            classes: "empty text-xs flex justify-between text-gray-200",
            parentElement: d.getNode()
          })
          s = new DOMElement({
            tagName: "span",
            parentElement: p.getNode()
          })
          i = new DOMElement({
            tagName: "i",
            classes: "fa fa-light fa-empty-set me-1",
            parentElement: s.getNode()
          })
          s1 = new DOMElement({
            tagName: "span",
            attributes: [{"key":"data-i18n", "value":""}],
            parentElement: s.getNode(),
            text: translate(language, "No soldiers available")
          })
        }
      }
      //Build available other objects title
      d = new DOMElement({
        tagName: "div",
        classes: "border border-gray-800 bg-gray-800 text-xs",
        parentElement: d1.getNode(),
        id: "newExpedition-available-objects-title"
      })
      p = new DOMElement({
        tagName: "p",
        classes: "text-xs flex justify-between p-1 ps-2 text-gray-200",
        parentElement: d.getNode()
      })
      s = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n", "value":""}],
        parentElement: p.getNode(),
        text: translate(language, "Other objects available")
      })
      //Build available other objects panel
      d = new DOMElement({
        tagName: "div",
        classes: "availableObjects flex flex-wrap gap-1 p-1 border border-gray-800 bg-gray-600 text-xs",
        parentElement: d1.getNode(),
        id: "newExpedition-available-objects"
      })
      //Any horses in stock?
      let horses_available = colony.get_stock({"type":"products", "good":"horse"})
      if(horses_available){
        for(let h=0; h < horses_available; h++){
          add_available_crew_object_to_expedition()//.addEventListener("click", handleToggleHorse)
        }
      } else {
        //Add "No other objects available" text.
        p = new DOMElement({
          tagName: "p",
          classes: "empty text-xs flex justify-between text-gray-200",
          parentElement: d.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          parentElement: p.getNode()
        })
        i = new DOMElement({
          tagName: "i",
          classes: "fa fa-light fa-empty-set me-1",
          parentElement: s.getNode()
        })
        s1 = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n", "value":""}],
          parentElement: s.getNode(),
          text: translate(language, "No other objects available")
        })
      }
    }
    p = new DOMElement({
      tagName: "p",
      classes: "flex w-100 gap-1 expeditionType justify-between items-center flex-wrap text-gray-300",
      parentElement: container
    })
    //Build type of expedition options
    s1 = new DOMElement({
      tagName: "span",
      classes: "flex",
      parentElement: p.getNode()
    })
    s2 = new DOMElement({
      tagName: "span",
      classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white",
      parentElement: s1.getNode()
    })
    s = new DOMElement({
      tagName: "span",
      attributes: [{"key":"data-i18n", "value":""}],
      parentElement: s2.getNode(),
      text: translate(language, "Type")
    })
    s = new DOMElement({
      tagName: "span",
      parentElement: s2.getNode(),
      text: ":"
    })
    s = new DOMElement({
      tagName: "span",
      classes: "grow flex",
      parentElement: s2.getNode()
    })
    //Resources expedition
    b = new DOMElement({
      tagName: "button",
      classes: "text-xs text-white grow p-1 py-0.5 button border border-gray-700 bg-green-800",
      attributes: [{"key":"data-type", "value":"of resources"},{"key":"data-i18n", "value":""}],
      parentElement: p.getNode()
    })
    i = new DOMElement({
      tagName: "i",
      classes: "fa fa-shovel text-xs",
      parentElement: b.getNode()
    })
    s3 = new DOMElement({
      tagName: "span",
      classes: "ms-1",
      parentElement: b.getNode(),
      text: translate(language, "of resources")
    })
    //Ruins expedition
    b = new DOMElement({
      tagName: "button",
      classes: "text-xs text-white grow p-1 py-0.5 button border border-gray-700 bg-sky-800",
      attributes: [{"key":"data-type", "value":"of ruins"},{"key":"data-i18n", "value":""}],
      parentElement: p.getNode()
    })
    i = new DOMElement({
      tagName: "i",
      classes: "fa fa-landmark text-xs",
      attributes: [{"key":"data-type", "value":"of ruins"}],
      parentElement: b.getNode()
    })
    s3 = new DOMElement({
      tagName: "span",
      classes: "ms-1",
      attributes: [{"key":"data-type", "value":"of ruins"}],
      parentElement: b.getNode(),
      text: translate(language, "of ruins")
    })
    //Combat expedition
    b = new DOMElement({
      tagName: "button",
      classes: "text-xs text-white grow p-1 py-0.5 button border border-gray-700 bg-red-900",
      attributes: [{"key":"data-type", "value":"of combat"}, {"key":"data-i18n", "value":""}],
      parentElement: p.getNode()
    })
    i = new DOMElement({
      tagName: "i",
      classes: "fa fa-sword text-xs",
      attributes: [{"key":"data-type", "value":"of ruins"}],
      parentElement: b.getNode()
    })
    s3 = new DOMElement({
      tagName: "span",
      classes: "ms-1",
      attributes: [{"key":"data-type", "value":"of combat"}],
      parentElement: b.getNode(),
      text: translate(language, "of combat")
    })
    //Button events
    document.querySelectorAll(".expeditionType button").forEach((value) => {
      value.closest("button").addEventListener("click", draw_content)
    })
  }

  draw_new = () => {
    this.active_expeditions_container = document.getElementById("active-expeditions-area")
    //Remove "No active expeditions" text if exists.
    if(document.querySelector(`#${this.active_expeditions_container.id} > p`) != null){
      colony.undraw_no_active_expeditions()
    }
    //Build new expedition accordion
    let d = new DOMElement({
      tagName: "div",
      classes: "accordion-active-expedition w-100",
      attributes: [{"key":"data-accordion", "value":"collapse"}],
      parentElement: this.active_expeditions_container,
      id: `accordion-expedition-${this.id}`
    })
    let drawing_data = {}
    drawing_data.id = `accordion-new-expedition-${this.id}`
    drawing_data.parentElement = d.getNode()
    drawing_data.attributes = [{"key": "data-expedition-id", "value": this.id}]
    drawing_data.accordion_header = (parent_div_id) => {
      let parent_div = document.getElementById(parent_div_id)
      let s = new DOMElement({
        tagName: "span",
        parentElement: parent_div
      })
      let i = new DOMElement({
        tagName: "i",
        classes: "fa fa-beat fa-location-dot mt-1 me-2",
        parentElement: s.getNode()
      })
      let s1 = new DOMElement({
        tagName: "span",
        classes: "me-1",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s.getNode(),
        text: translate(language, this.category.substring(3)+" expedition")
      })
      s1 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s.getNode(),
        text: " #"+this.id
      })
    }
    drawing_data.accordion_body = (parent_div_id) => {
      let parent_div = document.getElementById(parent_div_id), d, d1, d2, d3, p, s, s1, s2, s3
      d = new DOMElement({
        tagName: "div",
        parentElement: parent_div,
        id: `accordion-expedition-${this.id}-body`
      })
      d1 = new DOMElement({
        tagName: "div",
        classes: "border border-gray-700 bg-gray-500",
        parentElement: d.getNode()
      })
      d2 = new DOMElement({
        tagName: "div",
        classes: "p-1 flex flex-wrap gap-1",
        attributes: [{"key":"data-accordion","value":"collapse"}],
        parentElement: d1.getNode(),
        id: `expedition-${this.id}`
      })
      //Departure date...
      p = new DOMElement({
        tagName: "p",
        classes: "w-100 flex gap-1 text-xs text-gray-200",
        parentElement: d2.getNode()
      })
      s = new DOMElement({
        tagName: "span",
        classes: "flex border border-gray-800 p-0.5 px-1 bg-gray-600 text-white",
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s.getNode(),
        text: translate(language, "Departed in")
      })
      s1 = new DOMElement({
        tagName: "span",
        parentElement: s.getNode(),
        text: ":"
      })
      s = new DOMElement({
        tagName: "span",
        classes: "flex grow",
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "w-100 border border-gray-800 p-0.5 px-1 bg-gray-400 text-gray-800",
        parentElement: s.getNode()
      })
      s2 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        text: translate(language, "Year")
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: "mx-1 font-bold",
        parentElement: s1.getNode(),
        id: `expedition-${this.id}-departed-year`,
        text: this.departed_in.year.toString()
      })
      s2 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        text: translate(language, "Week")
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: "mx-1 font-bold",
        parentElement: s1.getNode(),
        id: `expedition-${this.id}-departed-week`,
        text: this.departed_in.week.toString()
      })
      s2 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        text: translate(language, "Day")
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: "mx-1 font-bold",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        id: `expedition-${this.id}-departed-day`,
        text: this.departed_in.day.toString()
      })
      s2 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        text: this.departed_in.hour.toString().padStart(2, "0")
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: "ms-1",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        text: "hs."
      })
      //Arriving date...
      s = new DOMElement({
        tagName: "span",
        classes: "flex border border-gray-800 p-0.5 px-1 bg-gray-600 text-white",
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s.getNode(),
        text: translate(language, "Will return in")
      })
      s1 = new DOMElement({
        tagName: "span",
        parentElement: s.getNode(),
        text: ":"
      })
      s = new DOMElement({
        tagName: "span",
        classes: "grow countdownTime activeExpedition p-1 py-0.5 border border-gray-800 bg-gray-400 text-gray-800",
        attributes: [{"key": "data-expedition-id", "value": this.id}],
        parentElement: p.getNode(),
        id: `expedition-${this.id}-arriving-time`
      })
      //Arriving years
      let hiddenClass = (this.arrives_in.years ? "" : "hidden ")
      s1 = new DOMElement({
        tagName: "span",
        classes: `${hiddenClass}countdown years font-bold`,
        attributes: [{"key":"data-expedition","value":this.id}],
        parentElement: s.getNode(),
        id: `expedition-${this.id}-pending-years`,
        text: this.arrives_in.years.toString()
      })
      let yearsText = this.arrives_in.years != 1 ? translate(language, "Years", "", "lowercase") : translate(language, "Years", "", "lowercase").slice(0, -1)
      s1 = new DOMElement({
        tagName: "span",
        classes: `${hiddenClass}mx-1`,
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s.getNode(),
        id: `expedition-${this.id}-pending-yearsText`,
        text: yearsText
      })
      //Arriving weeks
      hiddenClass = (this.arrives_in.weeks ? "" : "hidden ")
      s1 = new DOMElement({
        tagName: "span",
        classes: `${hiddenClass}countdown weeks font-bold`,
        attributes: [{"key":"data-expedition","value":this.id}],
        parentElement: s.getNode(),
        id: `expedition-${this.id}-pending-weeks`,
        text: this.arrives_in.years.toString()
      })
      let weeksText = this.arrives_in.weeks != 1 ? translate(language, "Weeks", "", "lowercase") : translate(language, "Weeks", "", "lowercase").slice(0, -1)
      s1 = new DOMElement({
        tagName: "span",
        classes: `${hiddenClass}mx-1`,
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s.getNode(),
        id: `expedition-${this.id}-pending-weeksText`,
        text: weeksText
      })
      //Arriving days
      hiddenClass = (this.arrives_in.days ? "" : "hidden ")
      s1 = new DOMElement({
        tagName: "span",
        classes: `${hiddenClass}countdown days font-bold`,
        attributes: [{"key":"data-expedition","value":this.id}],
        parentElement: s.getNode(),
        id: `expedition-${this.id}-pending-days`,
        text: this.arrives_in.days.toString()
      })
      let daysText = this.arrives_in.days != 1 ? translate(language, "Days", "", "lowercase") : translate(language, "Days", "", "lowercase").slice(0, -1)
      s1 = new DOMElement({
        tagName: "span",
        classes: `${hiddenClass}mx-1`,
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s.getNode(),
        id: `expedition-${this.id}-pending-daysText`,
        text: daysText
      })
      //Arriving days
      hiddenClass = (this.arrives_in.hours ? "" : "hidden ")
      s1 = new DOMElement({
        tagName: "span",
        classes: `${hiddenClass}countdown hours font-bold`,
        attributes: [{"key":"data-expedition","value":this.id}],
        parentElement: s.getNode(),
        id: `expedition-${this.id}-pending-hours`,
        text: this.arrives_in.hours.toString().padStart(2, "0")
      })
      let hoursText = this.arrives_in.hours != 1 ? "hs" : "h"
      s1 = new DOMElement({
        tagName: "span",
        classes: `${hiddenClass}mx-1`,
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s.getNode(),
        id: `expedition-${this.id}-pending-hoursText`,
        text: hoursText
      })
      //Probability
      s = new DOMElement({
        tagName: "span",
        classes: "flex border border-gray-800 p-0.5 px-1 bg-gray-600 text-white",
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s.getNode(),
        text: translate(language, "Success probability")
      })
      s1 = new DOMElement({
        tagName: "span",
        parentElement: s.getNode(),
        text: ":"
      })
      s = new DOMElement({
        tagName: "span",
        classes: "grow p-1 py-0.5 border border-gray-800 bg-gray-400 text-gray-800",
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: `font-bold`,
        parentElement: s.getNode(),
        id: `expedition-${this.id}-success-probability`,
        text: Math.floor(this.probability * 100).toString() + "%"
      })
      //Crew assigned
      p = new DOMElement({
        tagName: "p",
        classes: "w-100 flex flex-wrap text-xs text-gray-200",
        parentElement: d2.getNode()
      })
      s = new DOMElement({
        tagName: "span",
        classes: "w-100 flex border border-gray-800 p-0.5 px-1 bg-gray-600 text-white",
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s.getNode(),
        text: translate(language, "Assigned crew")
      })
      s = new DOMElement({
        tagName: "span",
        classes: "w-100 flex flex-wrap gap-1 border-s border-e border-b border-gray-800 p-1 bg-gray-400",
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "w-100 flex flex-wrap gap-1",
        parentElement: s.getNode()
      })
      this.get_assigned_crew({"rolekey": "expeditioning"}).forEach(expeditionaire => {
        s2 = new DOMElement({
          tagName: "span",
          classes: "grow border border-gray-900 px-1 bg-gray-700 text-white",
          parentElement: s1.getNode()
        })
        i = new DOMElement({
          tagName: "i",
          id: `citizen-${expeditionaire.id}-gender-icon`,
          classes: `me-1 fa ${expeditionaire.gender.charAt(0) === "F" ? "fa-venus text-red-500" : "fa-mars text-blue-500"}`,
          parentElement: s2.getNode()
        })
        s3 = new DOMElement({
          tagName: "span",
          id: `citizen-${expeditionaire.id}-name`,
          classes: `me-1 font-bold text-white`,
          parentElement: s2.getNode(),
          text: expeditionaire.name
        })
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: "border border-gray-900 px-1 bg-gray-700 text-white",
        parentElement: s1.getNode()
      })
      s3 = new DOMElement({
        tagName: "span",
        id: `expedition-${this.id}-horses`,
        classes: `me-1 font-bold text-white`,
        parentElement: s2.getNode(),
        text: this.get_assigned_horses().size.toString()
      })
      s3 = new DOMElement({
        tagName: "span",
        classes: `text-white`,
        parentElement: s2.getNode(),
        text: this.get_assigned_horses().size == 1 ? translate(language, "horse") : translate(language, "horses")
      })
      if(this.category != "of resources"){
        s2 = new DOMElement({
          tagName: "span",
          classes: "border border-gray-900 px-1 bg-gray-700 text-white",
          parentElement: s1.getNode()
        })
        s3 = new DOMElement({
          tagName: "span",
          id: `expedition-${this.id}-wagons`,
          classes: `me-1 font-bold text-white`,
          parentElement: s2.getNode(),
          text: this.get_assigned_wagons().size.toString()
        })
        s3 = new DOMElement({
          tagName: "span",
          classes: `text-white`,
          parentElement: s2.getNode(),
          text: this.get_assigned_wagons().size == 1 ? translate(language, "wagon") : translate(language, "wagons")
        })
      }
    }
    let accordion = new Accordion(drawing_data)
    accordion.expand()
    colony.active_accordion = accordion
  }

  redraw_history = () => {
    let short_category = this.category.substring(3)
    let missed = colony.statistics.expeditions[short_category].missed
    let successful = colony.statistics.expeditions[short_category].successful
    let attempts = missed + successful
    let productivity = Math.round(100 * Number(successful) / Number(attempts))
    DOMElement.set_text(`#${short_category}_expeditions_attempts`, attempts)
    DOMElement.set_text(`#${short_category}_expeditions_successful`, successful)
    DOMElement.set_text(`#${short_category}_expeditions_productivity`, productivity+"%")
  }

  undraw = () => {
    document.getElementById(`accordion-expedition-${this.id}`).remove()
    if(!colony.expeditions.size) colony.undraw_no_active_expeditions()
  }
  
  panel_close = () => {
    //Change all assigned expeditionaries back to idle status and all other objects to their stocks.
    this.get_assigned_crew({"rolekey": "expeditioning"}).forEach(crew_member => {
      if(crew_member.status == "assigned") colony.citizens.get(crew_member.id).set_status("idle")
    })
  }
}