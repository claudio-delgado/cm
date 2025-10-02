export class Progress {

  constructor(current_date = new Date()) {
    this.date = current_date.getFullYear().toString() + "-" + (current_date.getMonth()+1).toString().padStart(2, "0") + "-" + current_date.getDate().toString().padStart(2, "0")
    this.time = current_date.getHours().toString().padStart(2, "0") +":"+ current_date.getMinutes().toString().padStart(2, "0") +":"+ current_date.getSeconds().toString().padStart(2, "0")
  }
  save_localstorage = () => {
    const current_time = this.date
    //Build current time string
    let colony_data = {}
    colony_data["date"] = this.date
    colony_data["time"] = this.time
    colony_data["time lived"] = {}
    colony_data["time lived"]["weeks"] = document.getElementById("passedWeeks").innerHTML
    colony_data["time lived"]["current time"] = {}
    colony_data["time lived"]["current time"]["year"] = document.getElementById("currentYear").innerHTML
    colony_data["time lived"]["current time"]["week"] = document.getElementById("currentWeek").innerHTML
    colony_data["time lived"]["current time"]["day"] = document.getElementById("currentDay").innerHTML
    colony_data["time lived"]["current time"]["hour"] = document.getElementById("currentHour").innerHTML
    colony_data["colony"] = {}
    colony_data["colony"]["zone searched"] =  lifeStarted ? "yes" : (searchingZone ? "in process" : "no")
    colony_data["colony"]["name"] =  document.getElementById("colonyName").value
    colony_data["colony"]["score"] =  document.getElementById("colonyScore").innerHTML.padStart(10, "0")
    colony_data["colony"]["life quality"] =  document.getElementById("colonyLifeQuality").innerHTML.padStart(10, "0")
    colony_data["colony"]["power"] =  document.getElementById("colonyPower").innerHTML.padStart(10, "0")
    colony_data["colony"]["oppression"] =  document.getElementById("colonyOppression").innerHTML.padStart(10, "0")
    colony_data["colony"]["vital resources"] =  {}
    colony_data["colony"]["vital resources"]["food"] = {}
    colony_data["colony"]["vital resources"]["food"]["daily consumption"] = document.getElementById("colony-food-consumption").innerHTML.padStart(10, "0")
    colony_data["colony"]["vital resources"]["food"]["daily income"] = document.getElementById("colony-food-income").innerHTML.padStart(10, "0")
    colony_data["colony"]["vital resources"]["food"]["stock"] = document.getElementById("colony-food-stock").innerHTML.padStart(10, "0")
    colony_data["colony"]["vital resources"]["water"] = {}
    colony_data["colony"]["vital resources"]["water"]["daily consumption"] = document.getElementById("colony-water-consumption").innerHTML.padStart(10, "0")
    colony_data["colony"]["vital resources"]["water"]["daily income"] = document.getElementById("colony-water-income").innerHTML.padStart(10, "0")
    colony_data["colony"]["vital resources"]["water"]["stock"] = document.getElementById("colony-water-stock").innerHTML.padStart(10, "0")
    colony_data["colony"]["global stock"] = {}
    colony_data["colony"]["global stock"]["resources"] = {}
    Object.keys(stock_values.resources.EN).forEach((resource) => {
      let current_value = document.getElementById(`colony-${resource}-stock`) ? document.getElementById(`colony-${resource}-stock`).innerHTML : "0"
      colony_data["colony"]["global stock"]["resources"][resource] = current_value
    })
    colony_data["colony"]["global stock"]["products"] = {}
    Object.keys(stock_values.products.EN).forEach((product) => {
      let current_value = document.getElementById(`colony-${product}-stock`) ? document.getElementById(`colony-${product}-stock`).innerHTML : "0"
      colony_data["colony"]["global stock"]["products"][product] = current_value
    })
    colony_data["colony"]["global stock"]["building parts"] = {}
    Object.keys(stock_values["building parts"].EN).forEach((building_part) => {
      let current_value = document.getElementById(`colony-${building_part}-stock`) ? document.getElementById(`colony-${building_part}-stock`).innerHTML : "0"
      colony_data["colony"]["global stock"]["building parts"][building_part] = current_value
    })
    colony_data["latest news"] = []
    document.querySelectorAll("#accordion-news h2").forEach((elem) => {
      let id = elem.id.split("-")[2]
      let news = {}
      news["id"] = id, "id"
      news["received in"] = {}
      news["received in"]["year"] = elem.querySelector("span > .year").innerHTML
      news["received in"]["week"] = elem.querySelector("span > .week").innerHTML
      news["received in"]["day"] = elem.querySelector("span > .day").innerHTML
      news["received in"]["hour"] = elem.querySelector("span > .hour").innerHTML
      news["status"] = elem.classList.contains("notificationUnread") ? "unread" : "read"
      news["content"] = document.getElementById(`accordion-news-${id}-body`).innerHTML
      colony_data["latest news"].push(news)
    })
    colony_data["landforms"] = []
    document.querySelectorAll("#accordion-landforms > div").forEach((elem) => {
      let landform_id = elem.id.split("-")[2]
      let landform = {}
      let category = elem.classList.contains("waterReservoir") ? "water reservoir" : "" 
      category = elem.classList.contains("huntingMount") ? "hunting mount" : category
      category = elem.classList.contains("stoneMount") ? "stone mount" : category
      category = elem.classList.contains("woodMount") ? "wood mount" : category
      category = elem.classList.contains("clayMount") ? "clay mount" : category
      category = elem.classList.contains("mineralMount") ? "mineral mount" : category
      let type = document.getElementById(`landform-${landform_id}-type`) ? document.getElementById(`landform-${landform_id}-type`).getAttribute("data-mount") : false
      landform["id"] = landform_id
      landform["category"] = category
      if(type){
        landform["type"] = type
      }
      landform["discovered in"] = {}
      landform["discovered in"]["year"] = elem.querySelector(`#landform-${landform_id}-createdYear`).innerHTML
      landform["discovered in"]["week"] = elem.querySelector(`#landform-${landform_id}-createdWeek`).innerHTML
      landform["discovered in"]["day"] = elem.querySelector(`#landform-${landform_id}-createdDay`).innerHTML
      landform["workers assigned"] = []
      elem.querySelectorAll("h2.assignable-worker.assigned").forEach((worker_elem) => {
        let worker = {}
        worker["id"] = worker_elem
        landform["workers assigned"].push(worker)
      })
      colony_data["landforms"].push(landform)
    })
    colony_data["buildings"] = {}
    colony_data["buildings"]["shelter related"] = {}
    colony_data["buildings"]["shelter related"]["campaign tent"] = []
    buildings.shelter_related.campaign_tent.building_list.forEach((current_building) => {
      let building_info = {}
      building_info["id"] = current_building.id.toString()
      building_info["name"] = current_building.name
      building_info["status"] = current_building.status
      building_info["capacity"] = current_building.capacity.toString()
      building_info["created"] = {}
      building_info["created"]["year"] = current_building.created.year.toString()
      building_info["created"]["week"] = current_building.created.week.toString()
      building_info["created"]["day"] = current_building.created.day.toString()
      building_info["created"]["hour"] = current_building.created.hour.toString()
      colony_data["buildings"]["shelter related"]["campaign tent"].push(building_info)
      let is_new = document.querySelector(`#building-group-shelter_related-building-campaign_tent-${current_building.id} .new`) ? true : false
      building_info["new"] = is_new ? "1" : "0"
    })
    colony_data["buildings"]["shelter related"]["cottage"] = []
    document.querySelectorAll("#accordion-shelter_related-building-cottage-list > div").forEach((building_elem) => {
      colony_data["buildings"]["shelter related"]["cottage"].push(building_elem.id.split("-")[5])
    })
    colony_data["buildings"]["shelter related"]["stone house"] = []
    document.querySelectorAll("#accordion-shelter_related-building-stoneHouse-list > div").forEach((building_elem) => {
      colony_data["buildings"]["shelter related"]["stone house"].push(building_elem.id.split("-")[5])
    })
    colony_data["buildings"]["shelter related"]["brick house"] = []
    document.querySelectorAll("#accordion-shelter_related-building-brickHouse-list > div").forEach((building_elem) => {
      colony_data["buildings"]["shelter related"]["brick house"].push(building_elem.id.split("-")[5])
    })
    colony_data["buildings"]["shelter related"]["manor"] = []
    document.querySelectorAll("#accordion-shelter_related-building-manor-list > div").forEach((building_elem) => {
      colony_data["buildings"]["shelter related"]["manor"].push(building_elem.id.split("-")[5])
    })
    colony_data["buildings"]["shelter related"]["mansion"] = []
    document.querySelectorAll("#accordion-shelter_related-building-mansion-list > div").forEach((building_elem) => {
      colony_data["buildings"]["shelter related"]["mansion"].push(building_elem.id.split("-")[5])
    })
    colony_data["buildings"]["shelter related"]["graveyard"] = []
    document.querySelectorAll("#accordion-shelter_related-building-graveyard-list > div").forEach((building_elem) => {
      colony_data["buildings"]["shelter related"]["graveyard"].push(building_elem.id.split("-")[5])
    })
    colony_data["citizens"] = {}
    colony_data["citizens"]["list"] = []
    citizens.forEach((citizen) => {
      let encrypted_citizen = {}
      encrypted_citizen["id"] = citizen.id.toString()
      encrypted_citizen["name"] = citizen.name
      encrypted_citizen["gender"] = citizen.gender
      encrypted_citizen["status"] = citizen.status
      encrypted_citizen["ageWeeks"] = citizen.ageWeeks.toString()
      encrypted_citizen["ageYears"] = citizen.ageYears.toString()
      encrypted_citizen["birthWeek"] = citizen.birthWeek.toString()
      encrypted_citizen["birthWeeks"] = citizen.birthWeeks.toString()
      encrypted_citizen["weekOfDeath"] = citizen.weekOfDeath.toString()
      encrypted_citizen["fertility"] = citizen.fertility.toString()
      encrypted_citizen["fertilityWeek"] = citizen.fertilityWeek ? citizen.fertilityWeek.toString() : null
      encrypted_citizen["couple"] = citizen.couple ? citizen.couple.toString() : null
      encrypted_citizen["father"] = citizen.father ? citizen.father.toString() : null
      encrypted_citizen["mother"] = citizen.mother ? citizen.mother.toString() : null
      encrypted_citizen["children"] = []
      citizen.children.forEach((child) => { encrypted_citizen["children"].push(child.toString()) })
      encrypted_citizen["leftHand"] = citizen.leftHand != "" ? citizen.leftHand.toString() : null
      encrypted_citizen["rightHand"] = citizen.rightHand != "" ? citizen.rightHand.toString() : null
      encrypted_citizen["outfit"] = citizen.outfit
      encrypted_citizen["role"] = citizen.role
      encrypted_citizen["rolekey"] = citizen.rolekey
      encrypted_citizen["xp"] = citizen.xp.toString()
      encrypted_citizen["hatedAttribute"] = citizen.hatedAttribute.toString()
      encrypted_citizen["attributes"] = []
      encrypted_citizen["attributes"].push(citizen.attributes[0])
      encrypted_citizen["attributes"].push(citizen.attributes[1])
      encrypted_citizen["attributes"].push(citizen.attributes[2])
      encrypted_citizen["wishedAttributes"] = []
      encrypted_citizen["wishedAttributes"].push(citizen.wishedAttributes[0])
      encrypted_citizen["wishedAttributes"].push(citizen.wishedAttributes[1])
      encrypted_citizen["wishedAttributes"].push(citizen.wishedAttributes[2])
      colony_data["citizens"]["list"].push(citizen)
    })
    localStorage.setItem("colony", JSON.stringify(colony_data))
  }
}