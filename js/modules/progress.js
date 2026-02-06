export class Progress {
  
  constructor(current_date = new Date()) {
    this.date = current_date.getFullYear().toString() + "-" + (current_date.getMonth()+1).toString().padStart(2, "0") + "-" + current_date.getDate().toString().padStart(2, "0")
    this.time = current_date.getHours().toString().padStart(2, "0") +":"+ current_date.getMinutes().toString().padStart(2, "0") +":"+ current_date.getSeconds().toString().padStart(2, "0")
  }
  
  build_data = () => {
    const current_time = this.date
    const build_time_lived = () => {
      let data = {}
      data["weeks"] = document.getElementById("passedWeeks").innerHTML
      data["current time"] = {}
      data["current time"]["year"] = document.getElementById("currentYear").innerHTML
      data["current time"]["week"] = document.getElementById("currentWeek").innerHTML
      data["current time"]["day"] = document.getElementById("currentDay").innerHTML
      data["current time"]["hour"] = document.getElementById("currentHour").innerHTML
      return data
    }
    const build_colony_data = () => {
      const build_main_info = () => {
        let data = {}
        data["zone searched"] =  lifeStarted ? "yes" : (searchingZone ? "in process" : "no")
        data["name"] =  document.getElementById("colonyName").value
        data["score"] =  document.getElementById("colonyScore").innerHTML.padStart(10, "0")
        data["life quality"] =  document.getElementById("colonyLifeQuality").innerHTML.padStart(10, "0")
        data["power"] =  document.getElementById("colonyPower").innerHTML.padStart(10, "0")
        data["oppression"] =  document.getElementById("colonyOppression").innerHTML.padStart(10, "0")
        return data
      }
      const build_vital_resources = () => {
        let data = {}
        data["food"] = {}
        data["food"]["daily consumption"] = document.getElementById("colony-food-consumption").innerHTML.padStart(10, "0")
        data["food"]["daily income"] = document.getElementById("colony-food-income").innerHTML.padStart(10, "0")
        data["food"]["stock"] = document.getElementById("colony-food-stock").innerHTML.padStart(10, "0")
        data["water"] = {}
        data["water"]["daily consumption"] = document.getElementById("colony-water-consumption").innerHTML.padStart(10, "0")
        data["water"]["daily income"] = document.getElementById("colony-water-income").innerHTML.padStart(10, "0")
        data["water"]["stock"] = document.getElementById("colony-water-stock").innerHTML.padStart(10, "0")
        return data
      }
      const build_global_stock = () => {
        let data = {}
        data["resources"] = {}
        Object.keys(stock_values.resources.EN).forEach((resource) => {
          let current_value = document.getElementById(`colony-${resource}-stock`) ? document.getElementById(`colony-${resource}-stock`).innerHTML : "0"
          data["resources"][resource] = current_value
        })
        data["products"] = {}
        Object.keys(stock_values.products.EN).forEach((product) => {
          let current_value = document.getElementById(`colony-${product}-stock`) ? document.getElementById(`colony-${product}-stock`).innerHTML : "0"
          data["products"][product] = current_value
        })
        data["building parts"] = {}
        Object.keys(stock_values["building parts"].EN).forEach((building_part) => {
          let current_value = document.getElementById(`colony-${building_part}-stock`) ? document.getElementById(`colony-${building_part}-stock`).innerHTML : "0"
          data["building parts"][building_part] = current_value
        })
        return data
      }
      let data = {}
      data = build_main_info()
      data["vital resources"] = build_vital_resources()
      data["global stock"] = build_global_stock()
      return data
    }
    const build_latest_news = () => {
      let data = []
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
        data.push(news)
      })
      return data
    }
    const build_landforms = () => {
      let data = []
      document.querySelectorAll("#accordion-landforms > div").forEach((elem) => {
        let landform_id = elem.id.split("-")[2]
        let landform = {}
        let category = elem.classList.contains("waterReservoir") ? "water reservoir" : "" 
        category = elem.classList.contains("huntingMount") ? "hunting mount" : category
        category = elem.classList.contains("stoneMount") ? "stone mount" : category
        category = elem.classList.contains("woodMount") ? "wood mount" : category
        category = elem.classList.contains("clayMount") ? "clay mount" : category
        category = elem.classList.contains("mineralMount") ? "mineral mount" : category
        let type = document.getElementById(`landform-${landform_id}-type`) ? document.getElementById(`landform-${landform_id}-type`).getAttribute("data-type-key") : false
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
        data.push(landform)
      })
      return data
    }
    const build_buildings = () => {
      let data = {}
      data["shelter related"] = {}
      data["shelter related"]["campaign tent"] = []
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
        data["shelter related"]["campaign tent"].push(building_info)
        let is_new = document.querySelector(`#building-group-shelter_related-building-campaign_tent-${current_building.id} .new`) ? true : false
        building_info["new"] = is_new ? "1" : "0"
      })
      data["shelter related"]["cottage"] = []
      document.querySelectorAll("#accordion-shelter_related-building-cottage-list > div").forEach((building_elem) => {
        data["shelter related"]["cottage"].push(building_elem.id.split("-")[5])
      })
      data["shelter related"]["stone house"] = []
      document.querySelectorAll("#accordion-shelter_related-building-stoneHouse-list > div").forEach((building_elem) => {
        data["shelter related"]["stone house"].push(building_elem.id.split("-")[5])
      })
      data["shelter related"]["brick house"] = []
      document.querySelectorAll("#accordion-shelter_related-building-brickHouse-list > div").forEach((building_elem) => {
        data["shelter related"]["brick house"].push(building_elem.id.split("-")[5])
      })
      data["shelter related"]["manor"] = []
      document.querySelectorAll("#accordion-shelter_related-building-manor-list > div").forEach((building_elem) => {
        data["shelter related"]["manor"].push(building_elem.id.split("-")[5])
      })
      data["shelter related"]["mansion"] = []
      document.querySelectorAll("#accordion-shelter_related-building-mansion-list > div").forEach((building_elem) => {
        data["shelter related"]["mansion"].push(building_elem.id.split("-")[5])
      })
      data["shelter related"]["graveyard"] = []
      document.querySelectorAll("#accordion-shelter_related-building-graveyard-list > div").forEach((building_elem) => {
        data["shelter related"]["graveyard"].push(building_elem.id.split("-")[5])
      })
      return data
    }
    const build_citizens = () => {
      let data = {}
      data["list"] = []
      let citizen_collection = colony.citizens.size ? colony.citizens : citizens
      citizen_collection.forEach((citizen) => {
        /*let current_citizen = {}
        current_citizen["id"] = citizen.id.toString()
        current_citizen["name"] = citizen.name
        current_citizen["gender"] = citizen.gender
        current_citizen["status"] = citizen.status
        current_citizen["ageWeeks"] = citizen.ageWeeks.toString()
        current_citizen["ageYears"] = citizen.ageYears.toString()
        current_citizen["birthWeek"] = citizen.birthWeek.toString()
        current_citizen["weeksAlive"] = citizen.weeksAlive.toString()
        current_citizen["weekOfDeath"] = citizen.weekOfDeath.toString()
        current_citizen["fertility"] = citizen.fertility.toString()
        current_citizen["fertilityWeek"] = citizen.fertilityWeek ? citizen.fertilityWeek.toString() : null
        current_citizen["couple"] = citizen.couple ? citizen.couple.toString() : null
        current_citizen["father"] = citizen.father ? citizen.father.toString() : null
        current_citizen["mother"] = citizen.mother ? citizen.mother.toString() : null
        current_citizen["children"] = []
        citizen.children.forEach((child) => { current_citizen["children"].push(child.toString()) })
        current_citizen["leftHand"] = citizen.leftHand != "" ? citizen.leftHand.toString() : null
        current_citizen["rightHand"] = citizen.rightHand != "" ? citizen.rightHand.toString() : null
        current_citizen["outfit"] = citizen.outfit
        current_citizen["role"] = citizen.role
        current_citizen["rolekey"] = citizen.rolekey
        current_citizen["xp"] = citizen.xp.toString()
        current_citizen["hatedAttribute"] = citizen.hatedAttribute.toString()
        current_citizen["attributes"] = []
        current_citizen["attributes"].push(citizen.attributes[0])
        current_citizen["attributes"].push(citizen.attributes[1])
        current_citizen["attributes"].push(citizen.attributes[2])
        current_citizen["wishedAttributes"] = []
        current_citizen["wishedAttributes"].push(citizen.wishedAttributes[0])
        current_citizen["wishedAttributes"].push(citizen.wishedAttributes[1])
        current_citizen["wishedAttributes"].push(citizen.wishedAttributes[2])
        data["list"].push(current_citizen)*/
        data["list"].push(citizen)
      })
      return data
    }
    const build_pregnancies = () => {
      return pregnancies
    }
    //Build current time string
    let colony_data = {}
    colony_data["date"] = this.date
    colony_data["time"] = this.time
    colony_data["time lived"] = build_time_lived()
    colony_data["colony"] = build_colony_data()
    colony_data["latest news"] = build_latest_news()
    colony_data["landforms"] = build_landforms()
    colony_data["buildings"] = build_buildings()
    colony_data["citizens"] = build_citizens()
    colony_data["pregnancies"] = build_pregnancies()
    
    this.colony_data = colony_data
  }
  get_data = () => {
    return this.colony_data
  }
  save_localstorage = () => {
    localStorage.setItem("colony", JSON.stringify(this.colony_data))
  }
}