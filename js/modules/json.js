// JSON module: functions to process imported/exported JSON files

import { decrypt_json, encrypt, decrypt, calculate_CRC } from './crypt.js';
import { Modal } from './modal.js';

export class JSONFile {

  constructor(current_date = new Date()) {
    const today_year = current_date.getFullYear().toString()
    const today_month = (current_date.getMonth()+1).toString().padStart(2, "0")
    const today_day = current_date.getDate().toString().padStart(2, "0")
    const today = today_year + "-" + today_month + "-" + today_day
    const now_hour = current_date.getHours().toString().padStart(2, "0")
    const now_mins = current_date.getMinutes().toString().padStart(2, "0")
    const now_secs = current_date.getSeconds().toString().padStart(2, "0")
    const now = now_hour + "." + now_mins + "." + now_secs
    this.current_date = today
    this.current_time = now
    this.json = {}
    this.checksums = {}
    this.checksum = 0
  }
  
  e = (string, key) => {
    return encrypt(string, key)
  }
  build_checksums = () => {
    const checksums_structure = (json_object_or_array) => {
        let checksum_elem = JSON.parse(JSON.stringify(json_object_or_array))
        if(typeof json_object_or_array === "object"){
            Object.keys(json_object_or_array).forEach(key => {
                if(typeof json_object_or_array[key] === "string"){
                    checksum_elem[key] = calculate_CRC(key) + calculate_CRC(json_object_or_array[key])
                } else {
                    checksum_elem[key] = checksums_structure(json_object_or_array[key])
                }
            })
        }
        return checksum_elem
    }
    this.checksums = {}
    this.checksums = checksums_structure(this.json)
  }

  calculate_checksum = (json) => {
    let checksum
    if(typeof json === "number"){
        checksum = json
    } else {
      checksum = 0
      if(typeof json === "object"){
        Object.keys(json).forEach(key => {
            checksum += this.calculate_checksum(json[key])
        })
      } else {
        if(typeof json === "array"){
            json.forEach((item) => {
                checksum += this.calculate_checksum(item)
            })
        }
      }
    }
    return checksum
  }

  build_file = () => {
    let json_result = {}
    this.json = {}
    //For testing porposes, set current date 7 days in the past
    const current_time = new Date()
    current_time.setDate(current_time.getDate() - 7)
    //Build current time string
    let time_string = current_time.getHours().toString().padStart(2, "0") +":"+ current_time.getMinutes().toString().padStart(2, "0") +":"+ current_time.getSeconds().toString().padStart(2, "0")
    this.json[this.e("date", this.current_date)] = this.current_date
    this.json[this.e("time", this.current_date)] = this.e(time_string, this.e("time", this.current_date))
    this.json[this.e("time lived", this.current_date)] = {}
    this.json[this.e("time lived", this.current_date)][this.e("weeks", this.current_date)] = this.e(document.getElementById("passedWeeks").innerHTML, this.e("weeks", this.current_date))
    this.json[this.e("time lived", this.current_date)][this.e("current time", this.current_date)] = {}
    this.json[this.e("time lived", this.current_date)][this.e("current time", this.current_date)][this.e("year", this.current_date)] = this.e(document.getElementById("currentYear").innerHTML, this.e("year", this.current_date))
    this.json[this.e("time lived", this.current_date)][this.e("current time", this.current_date)][this.e("week", this.current_date)] = this.e(document.getElementById("currentWeek").innerHTML, this.e("week", this.current_date))
    this.json[this.e("time lived", this.current_date)][this.e("current time", this.current_date)][this.e("day", this.current_date)] = this.e(document.getElementById("currentDay").innerHTML, this.e("day", this.current_date))
    this.json[this.e("time lived", this.current_date)][this.e("current time", this.current_date)][this.e("hour", this.current_date)] = this.e(document.getElementById("currentHour").innerHTML, this.e("hour", this.current_date))
    this.json[this.e("colony", this.current_date)] = {}
    this.json[this.e("colony", this.current_date)][this.e("zone searched", this.current_date)] =  this.e(lifeStarted ? "yes" : (searchingZone ? "in process" : "no"), this.e("zone searched", this.current_date))
    this.json[this.e("colony", this.current_date)][this.e("name", this.current_date)] =  this.e(document.getElementById("colonyName").value, this.e("name", this.current_date))
    this.json[this.e("colony", this.current_date)][this.e("score", this.current_date)] =  this.e(document.getElementById("colonyScore").innerHTML.padStart(10, "0"), this.e("score", this.current_date))
    this.json[this.e("colony", this.current_date)][this.e("life quality", this.current_date)] =  this.e(document.getElementById("colonyLifeQuality").innerHTML.padStart(10, "0"), this.e("life quality", this.current_date))
    this.json[this.e("colony", this.current_date)][this.e("power", this.current_date)] =  this.e(document.getElementById("colonyPower").innerHTML.padStart(10, "0"), this.e("power", this.current_date))
    this.json[this.e("colony", this.current_date)][this.e("oppression", this.current_date)] =  this.e(document.getElementById("colonyOppression").innerHTML.padStart(10, "0"), this.e("oppression", this.current_date))
    this.json[this.e("colony", this.current_date)][this.e("vital resources", this.current_date)] =  {}
    this.json[this.e("colony", this.current_date)][this.e("vital resources", this.current_date)][this.e("food", this.current_date)] = {}
    this.json[this.e("colony", this.current_date)][this.e("vital resources", this.current_date)][this.e("food", this.current_date)][this.e("daily consumption", this.current_date)] = this.e(document.getElementById("colony-food-consumption").innerHTML.padStart(10, "0"), this.e("daily consumption", this.current_date))
    this.json[this.e("colony", this.current_date)][this.e("vital resources", this.current_date)][this.e("food", this.current_date)][this.e("daily income", this.current_date)] = this.e(document.getElementById("colony-food-income").innerHTML.padStart(10, "0"), this.e("daily income", this.current_date))
    this.json[this.e("colony", this.current_date)][this.e("vital resources", this.current_date)][this.e("food", this.current_date)][this.e("stock", this.current_date)] = this.e(document.getElementById("colony-food-stock").innerHTML.padStart(10, "0"), this.e("stock", this.current_date))
    this.json[this.e("colony", this.current_date)][this.e("vital resources", this.current_date)][this.e("water", this.current_date)] = {}
    this.json[this.e("colony", this.current_date)][this.e("vital resources", this.current_date)][this.e("water", this.current_date)][this.e("daily consumption", this.current_date)] = this.e(document.getElementById("colony-water-consumption").innerHTML.padStart(10, "0"), this.e("daily consumption", this.current_date))
    this.json[this.e("colony", this.current_date)][this.e("vital resources", this.current_date)][this.e("water", this.current_date)][this.e("daily income", this.current_date)] = this.e(document.getElementById("colony-water-income").innerHTML.padStart(10, "0"), this.e("daily income", this.current_date))
    this.json[this.e("colony", this.current_date)][this.e("vital resources", this.current_date)][this.e("water", this.current_date)][this.e("stock", this.current_date)] = this.e(document.getElementById("colony-water-stock").innerHTML.padStart(10, "0"), this.e("stock", this.current_date))
    this.json[this.e("colony", this.current_date)][this.e("global stock", this.current_date)] = {}
    this.json[this.e("colony", this.current_date)][this.e("global stock", this.current_date)][this.e("resources", this.current_date)] = {}
    Object.keys(stock_values.resources.EN).forEach((resource) => {
      let current_value = document.getElementById(`colony-${resource}-stock`) ? document.getElementById(`colony-${resource}-stock`).innerHTML : "0"
      this.json[this.e("colony", this.current_date)][this.e("global stock", this.current_date)][this.e("resources", this.current_date)][this.e(resource, this.current_date)] = this.e(current_value, this.e(resource, this.current_date))
    })
    this.json[this.e("colony", this.current_date)][this.e("global stock", this.current_date)][this.e("products", this.current_date)] = {}
    Object.keys(stock_values.products.EN).forEach((product) => {
      let current_value = document.getElementById(`colony-${product}-stock`) ? document.getElementById(`colony-${product}-stock`).innerHTML : "0"
      this.json[this.e("colony", this.current_date)][this.e("global stock", this.current_date)][this.e("products", this.current_date)][this.e(product, this.current_date)] = this.e(current_value, this.e(product, this.current_date))
    })
    this.json[this.e("colony", this.current_date)][this.e("global stock", this.current_date)][this.e("building parts", this.current_date)] = {}
    Object.keys(stock_values["building parts"].EN).forEach((building_part) => {
      let current_value = document.getElementById(`colony-${building_part}-stock`) ? document.getElementById(`colony-${building_part}-stock`).innerHTML : "0"
      this.json[this.e("colony", this.current_date)][this.e("global stock", this.current_date)][this.e("building parts", this.current_date)][this.e(building_part, this.current_date)] = this.e(current_value, this.e(building_part, this.current_date))
    })
    this.json[this.e("latest news", this.current_date)] = []
    document.querySelectorAll("#accordion-news h2").forEach((elem) => {
      let id = elem.id.split("-")[2]
      let news = {}
      news[this.e("id", this.current_date)] = this.e(id, this.e("id", this.current_date))
      news[this.e("received in", this.current_date)] = {}
      news[this.e("received in", this.current_date)][this.e("year", this.current_date)] = this.e(elem.querySelector("span > .year").innerHTML, this.e("year", this.current_date))
      news[this.e("received in", this.current_date)][this.e("week", this.current_date)] = this.e(elem.querySelector("span > .week").innerHTML, this.e("week", this.current_date))
      news[this.e("received in", this.current_date)][this.e("day", this.current_date)] = this.e(elem.querySelector("span > .day").innerHTML, this.e("day", this.current_date))
      news[this.e("received in", this.current_date)][this.e("hour", this.current_date)] = this.e(elem.querySelector("span > .hour").innerHTML, this.e("hour", this.current_date))
      news[this.e("status", this.current_date)] = this.e(elem.classList.contains("notificationUnread") ? "unread" : "read", this.e("status", this.current_date))
      news[this.e("content", this.current_date)] = this.e(document.getElementById(`accordion-news-${id}-body`).innerHTML, this.e("content", this.current_date))
      this.json[this.e("latest news", this.current_date)].push(news)
    })
    this.json[this.e("landforms", this.current_date)] = []
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
      landform[this.e("id", this.current_date)] = this.e(landform_id, this.e("id", this.current_date))
      landform[this.e("category", this.current_date)] = this.e(category, this.e("category", this.current_date))
      if(type){
        landform[this.e("type", this.current_date)] = this.e(type, this.e("type", this.current_date))
      }
      landform[this.e("discovered in", this.current_date)] = {}
      landform[this.e("discovered in", this.current_date)][this.e("year", this.current_date)] = this.e(elem.querySelector(`#landform-${landform_id}-createdYear`).innerHTML, this.e("year", this.current_date))
      landform[this.e("discovered in", this.current_date)][this.e("week", this.current_date)] = this.e(elem.querySelector(`#landform-${landform_id}-createdWeek`).innerHTML, this.e("week", this.current_date))
      landform[this.e("discovered in", this.current_date)][this.e("day", this.current_date)] = this.e(elem.querySelector(`#landform-${landform_id}-createdDay`).innerHTML, this.e("day", this.current_date))
      landform[this.e("workers assigned", this.current_date)] = []
      elem.querySelectorAll("h2.assignable-worker.assigned").forEach((worker_elem) => {
        let worker = {}
        worker[this.e("id", this.current_date)] = this.e(worker_elem, this.e("id", this.current_date))
        landform[this.e("workers assigned", this.current_date)].push(worker)
      })
      this.json[this.e("landforms", this.current_date)].push(landform)
    })
    this.json[this.e("buildings", this.current_date)] = {}
    this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)] = {}
    this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)][this.e("campaign tent", this.current_date)] = []
    buildings.shelter_related.campaign_tent.building_list.forEach((current_building) => {
      let building_info = {}
      building_info[this.e("id", this.current_date)] = this.e(current_building.id.toString(), this.e("id", this.current_date))
      building_info[this.e("name", this.current_date)] = this.e(current_building.name, this.e("name", this.current_date))
      building_info[this.e("status", this.current_date)] = this.e(current_building.status, this.e("status", this.current_date))
      building_info[this.e("capacity", this.current_date)] = this.e(current_building.capacity.toString(), this.e("capacity", this.current_date))
      building_info[this.e("created", this.current_date)] = {}
      building_info[this.e("created", this.current_date)][this.e("year", this.current_date)] = this.e(current_building.created.year.toString(), this.e("year", this.current_date))
      building_info[this.e("created", this.current_date)][this.e("week", this.current_date)] = this.e(current_building.created.week.toString(), this.e("week", this.current_date))
      building_info[this.e("created", this.current_date)][this.e("day", this.current_date)] = this.e(current_building.created.day.toString(), this.e("day", this.current_date))
      building_info[this.e("created", this.current_date)][this.e("hour", this.current_date)] = this.e(current_building.created.hour.toString(), this.e("hour", this.current_date))
      this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)][this.e("campaign tent", this.current_date)].push(building_info)
      let is_new = document.querySelector(`#building-group-shelter_related-building-campaign_tent-${current_building.id} .new`) ? true : false
      building_info[this.e("new", this.current_date)] = this.e(is_new ? "1" : "0", this.e("new", this.current_date))
    })
    this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)][this.e("cottage", this.current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-cottage-list > div").forEach((building_elem) => {
      this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)][this.e("cottage", this.current_date)].push(this.e(building_elem.id.split("-")[5], this.current_date))
    })
    this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)][this.e("stone house", this.current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-stoneHouse-list > div").forEach((building_elem) => {
      this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)][this.e("stone house", this.current_date)].push(this.e(building_elem.id.split("-")[5], this.current_date))
    })
    this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)][this.e("brick house", this.current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-brickHouse-list > div").forEach((building_elem) => {
      this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)][this.e("brick house", this.current_date)].push(this.e(building_elem.id.split("-")[5], this.current_date))
    })
    this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)][this.e("manor", this.current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-manor-list > div").forEach((building_elem) => {
      this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)][this.e("manor", this.current_date)].push(this.e(building_elem.id.split("-")[5], this.current_date))
    })
    this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)][this.e("mansion", this.current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-mansion-list > div").forEach((building_elem) => {
      this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)][this.e("mansion", this.current_date)].push(this.e(building_elem.id.split("-")[5], this.current_date))
    })
    this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)][this.e("graveyard", this.current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-graveyard-list > div").forEach((building_elem) => {
      this.json[this.e("buildings", this.current_date)][this.e("shelter related", this.current_date)][this.e("graveyard", this.current_date)].push(this.e(building_elem.id.split("-")[5], this.current_date))
    })
    this.json[this.e("citizens", this.current_date)] = {}
    this.json[this.e("citizens", this.current_date)][this.e("list", this.current_date)] = []
    citizens.forEach((citizen) => {
      let encrypted_citizen = {}
      encrypted_citizen[this.e("id", this.current_date)] = this.e(citizen.id.toString(), this.e("id", this.current_date))
      encrypted_citizen[this.e("name", this.current_date)] = this.e(citizen.name, this.e("name", this.current_date))
      encrypted_citizen[this.e("gender", this.current_date)] = this.e(citizen.gender, this.e("gender", this.current_date))
      encrypted_citizen[this.e("status", this.current_date)] = this.e(citizen.status, this.e("status", this.current_date))
      encrypted_citizen[this.e("ageWeeks", this.current_date)] = this.e(citizen.ageWeeks.toString(), this.e("ageWeeks", this.current_date))
      encrypted_citizen[this.e("ageYears", this.current_date)] = this.e(citizen.ageYears.toString(), this.e("ageYears", this.current_date))
      encrypted_citizen[this.e("birthWeek", this.current_date)] = this.e(citizen.birthWeek.toString(), this.e("birthWeek", this.current_date))
      encrypted_citizen[this.e("birthWeeks", this.current_date)] = this.e(citizen.birthWeeks.toString(), this.e("birthWeeks", this.current_date))
      encrypted_citizen[this.e("weekOfDeath", this.current_date)] = this.e(citizen.weekOfDeath.toString(), this.e("weekOfDeath", this.current_date))
      encrypted_citizen[this.e("fertility", this.current_date)] = this.e(citizen.fertility.toString(), this.e("fertility", this.current_date))
      encrypted_citizen[this.e("fertilityWeek", this.current_date)] = this.e(citizen.fertilityWeek ? citizen.fertilityWeek.toString() : "-", this.e("fertilityWeek", this.current_date))
      encrypted_citizen[this.e("couple", this.current_date)] = this.e(citizen.couple ? citizen.couple.toString() : "-", this.e("couple", this.current_date))
      encrypted_citizen[this.e("father", this.current_date)] = this.e(citizen.father ? citizen.father.toString() : "-", this.e("father", this.current_date))
      encrypted_citizen[this.e("mother", this.current_date)] = this.e(citizen.mother ? citizen.mother.toString() : "-", this.e("mother", this.current_date))
      encrypted_citizen[this.e("children", this.current_date)] = []
      citizen.children.forEach((child) => { encrypted_citizen[this.e("children", this.current_date)].push(this.e(child.toString(), this.current_date)) })
      encrypted_citizen[this.e("leftHand", this.current_date)] = this.e(citizen.leftHand != "" ? citizen.leftHand.toString() : "-", this.e("leftHand", this.current_date))
      encrypted_citizen[this.e("rightHand", this.current_date)] = this.e(citizen.rightHand != "" ? citizen.rightHand.toString() : "-", this.e("rightHand", this.current_date))
      encrypted_citizen[this.e("outfit", this.current_date)] = this.e(citizen.outfit, this.e("outfit", this.current_date))
      encrypted_citizen[this.e("role", this.current_date)] = this.e(citizen.role, this.e("role", this.current_date))
      encrypted_citizen[this.e("rolekey", this.current_date)] = this.e(citizen.rolekey, this.e("rolekey", this.current_date))
      encrypted_citizen[this.e("xp", this.current_date)] = this.e(citizen.xp.toString(), this.e("xp", this.current_date))
      encrypted_citizen[this.e("hatedAttribute", this.current_date)] = this.e(citizen.hatedAttribute.toString(), this.e("hatedAttribute", this.current_date))
      encrypted_citizen[this.e("attributes", this.current_date)] = []
      encrypted_citizen[this.e("attributes", this.current_date)].push(this.e(citizen.attributes[0], this.current_date))
      encrypted_citizen[this.e("attributes", this.current_date)].push(this.e(citizen.attributes[1], this.current_date))
      encrypted_citizen[this.e("attributes", this.current_date)].push(this.e(citizen.attributes[2], this.current_date))
      encrypted_citizen[this.e("wishedAttributes", this.current_date)] = []
      encrypted_citizen[this.e("wishedAttributes", this.current_date)].push(this.e(citizen.wishedAttributes[0], this.current_date))
      encrypted_citizen[this.e("wishedAttributes", this.current_date)].push(this.e(citizen.wishedAttributes[1], this.current_date))
      encrypted_citizen[this.e("wishedAttributes", this.current_date)].push(this.e(citizen.wishedAttributes[2], this.current_date))
      this.json[this.e("citizens", this.current_date)][this.e("list", this.current_date)].push(encrypted_citizen)
    })
if(false){
    json[encrypt("expeditions", current_date)] = []
    expeditions.forEach((expedition) => {
      let expedition_object = {}
      expedition_object[encrypt("id", current_date)] = encrypt(expedition.id.toString(), encrypt("id", current_date))
      expedition_object[encrypt("type", current_date)] = encrypt(expedition.type, encrypt("type", current_date))
      expedition_object[encrypt("departed in", current_date)] = {}
      expedition_object[encrypt("departed in", current_date)][encrypt("year", current_date)] = encrypt(expedition.departedIn.year.toString(), encrypt("year", current_date))
      expedition_object[encrypt("departed in", current_date)][encrypt("week", current_date)] = encrypt(expedition.departedIn.week.toString(), encrypt("week", current_date))
      expedition_object[encrypt("departed in", current_date)][encrypt("day", current_date)] = encrypt(expedition.departedIn.day.toString(), encrypt("day", current_date))
      expedition_object[encrypt("departed in", current_date)][encrypt("hour", current_date)] = encrypt(expedition.departedIn.hour.toString(), encrypt("hour", current_date))
      expedition_object[encrypt("returns in", current_date)] = {}
      expedition_object[encrypt("returns in", current_date)][encrypt("year", current_date)] = encrypt(expedition.returnsIn.years.toString(), encrypt("year", current_date))
      expedition_object[encrypt("returns in", current_date)][encrypt("week", current_date)] = encrypt(expedition.returnsIn.weeks.toString(), encrypt("week", current_date))
      expedition_object[encrypt("returns in", current_date)][encrypt("day", current_date)] = encrypt(expedition.returnsIn.days.toString(), encrypt("day", current_date))
      expedition_object[encrypt("returns in", current_date)][encrypt("hour", current_date)] = encrypt(expedition.returnsIn.hours.toString(), encrypt("hour", current_date))
      expedition_object[encrypt("crew", current_date)] = []
      expedition.crew.forEach((member) => {
        let crew_member = {}
        if(member.type !== "horse"){
          crew_member[encrypt("id", current_date)] = encrypt(member.id.toString(), encrypt("id", current_date))
          crew_member[encrypt("name", current_date)] = encrypt(member.name, encrypt("name", current_date))
          crew_member[encrypt("gender", current_date)] = encrypt(member.gender, encrypt("gender", current_date))
          crew_member[encrypt("age", current_date)] = encrypt(member.age, encrypt("age", current_date))
          crew_member[encrypt("xp", current_date)] = encrypt(member.xp, encrypt("xp", current_date))
        }
        crew_member[encrypt("type", current_date)] = encrypt(member.type, encrypt("type", current_date))
        expedition_object[encrypt("crew", current_date)].push(crew_member)
      })
      json[encrypt("expeditions", current_date)].push(expedition_object)
    })
    json[encrypt("production rules", current_date)] = []
    good_rules_defined.forEach((rule) => {
      let encrypted_rule = {}
      encrypted_rule[encrypt("id", current_date)] = encrypt(rule.id, encrypt("id", current_date))
      encrypted_rule[encrypt("index", current_date)] = encrypt(rule.index, encrypt("index", current_date))
      encrypted_rule[encrypt("date_created", current_date)] = {}
      encrypted_rule[encrypt("date_created", current_date)][encrypt("year", current_date)] = encrypt(rule.date_created.year, encrypt("year", current_date))
      encrypted_rule[encrypt("date_created", current_date)][encrypt("week", current_date)] = encrypt(rule.date_created.week, encrypt("week", current_date))
      encrypted_rule[encrypt("date_created", current_date)][encrypt("day", current_date)] = encrypt(rule.date_created.day, encrypt("day", current_date))
      encrypted_rule[encrypt("date_created", current_date)][encrypt("hour", current_date)] = encrypt(rule.date_created.hour, encrypt("hour", current_date))
      encrypted_rule[encrypt("object", current_date)] = encrypt(rule.object, encrypt("object", current_date))
      encrypted_rule[encrypt("category", current_date)] = encrypt(rule.category, encrypt("category", current_date))
      encrypted_rule[encrypt("status", current_date)] = encrypt(rule.status, encrypt("status", current_date))
      encrypted_rule[encrypt("duration", current_date)] = encrypt(rule.duration, encrypt("duration", current_date))
      encrypted_rule[encrypt("duration_remaining", current_date)] = encrypt(rule.duration_remaining, encrypt("duration_remaining", current_date))
      encrypted_rule[encrypt("rule_definition", current_date)] = {}
      encrypted_rule[encrypt("rule_definition", current_date)][encrypt("requirements", current_date)] = []
      rule.requirements.forEach((requirement) => {
        let encrypted_requirement = {}
        encrypted_requirement[encrypt("index", current_date)] = encrypt(requirement.index, encrypt("index", current_date))
        encrypted_requirement[encrypt("object", current_date)] = encrypt(requirement.object, encrypt("object", current_date))
        encrypted_requirement[encrypt("type", current_date)] = encrypt(requirement.type, encrypt("type", current_date))
        encrypted_requirement[encrypt("quantity", current_date)] = encrypt(requirement.quantity, encrypt("quantity", current_date))
        encrypted_requirement[encrypt("consumable", current_date)] = encrypt(requirement.consumable ? "1" : "0", encrypt("consumable", current_date))
        encrypted_requirement[encrypt("tools", current_date)] = {}
        encrypted_requirement[encrypt("workers", current_date)] = {}
      })
      encrypted_rule[encrypt("rule_definition", current_date)][encrypt("result", current_date)] = {}
      encrypted_rule[encrypt("rule_definition", current_date)][encrypt("result", current_date)][encrypt("quantity", current_date)] = encrypt(rule.result.quantity, encrypt("quantity", current_date))
      encrypted_rule[encrypt("rule_definition", current_date)][encrypt("result", current_date)][encrypt("score", current_date)] = encrypt(rule.result.score, encrypt("score", current_date))
      json[encrypt("production rules", current_date)].push(encrypted_rule)
    })
}
    json_result.json = this.json
    this.build_checksums()
    this.checksum = this.calculate_checksum(this.checksums)
    json_result.checksums = this.checksums
    json_result.checksum = this.checksum
    return json_result
  }

  export = () => {
    const link = document.createElement("a");
    //const content = JSON.stringify(decrypt_json(this.build_file(today)), null, 4)
    const content = JSON.stringify((this.build_file(this.current_date)), null, 4)
    const file = new Blob([content], { type: 'text/plain' })
    link.href = URL.createObjectURL(file)
    link.download = this.current_date + "-" + this.current_time + ".medieval.colonies.json"
    link.click()
    URL.revokeObjectURL(link.href)
  }

  import = () => {
    document.querySelector("#processFile i").classList.add("fa-spin")
    const fileInput = document.getElementById('file_input')
    const file = fileInput.files[0]
    const file_reader = new FileReader()
    let self = this 
    file_reader.onload = function(event) {
      try {
        const fileContent = event.target.result
        let jsonData = JSON.parse(fileContent)
        //Get checksum from the file
        let file_checksum = jsonData.checksum
        //Load new json data
        self.json = jsonData.json
        self.build_checksums()
        let calculated_checksum = self.calculate_checksum(self.checksums)
        if(file_checksum !== calculated_checksum){ throw new Error(translate(language, "The file is corrupted")) }
        const decryptedData = decrypt_json(self.json)
        if(decryptedData && decryptedData.date){
            //Save decrypted data to localStorage
            let colony_data = decryptedData
            localStorage.setItem("colony", JSON.stringify(colony_data))
            document.getElementById("processFile").classList.add("hidden")
            let p_modal = new Modal()
            p_modal.progress_modal("Hooray!")
            let body = document.getElementById("modalBody")
            body.innerHTML = ""
            let p = new element("p", "text-base py-2 text-gray-400", [{"key":"data-i18n","value":""}], body)
            p.create(); p.appendContent(translate(language, "Progress updated successfully. Let's go to home page and check the changes."))
            document.getElementById("modalFooterButton1").classList.add("hidden")
            document.getElementById("modalFooterButton2").innerHTML = translate(language, "Ok")
            document.getElementById("modalFooterButton2").onclick = () => { window.location.href = "home.html" }
            modal.show()
        } else {
            throw new Error(translate(language, "The file content is not valid"))
        }
      } catch (error) {
          let p_modal = new Modal()
          p_modal.progress_modal("Oh no!")
          let body = document.getElementById("modalBody")
          body.innerHTML = ""
          let p = new element("p", "text-base py-2 text-gray-400", [{"key":"data-i18n","value":""}], body)
          p.create(); p.appendContent(translate(language, "There was an error processing the file:"))
          p.create(); p.appendContent(error.message)
          document.getElementById("modalFooterButton1").classList.add("hidden")
          document.getElementById("modalFooterButton2").innerHTML = translate(language, "Ok")
          modal.show()
      }
      document.querySelector("#processFile i").classList.remove("fa-spin")
    }
    file_reader.onerror = () => {
        alert("Error reading the file. Please try again.");
    }
    file_reader.readAsText(file);
  }

}