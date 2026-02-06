import { encrypt, calculate_CRC } from './crypt.js'
export const build_exported_json = (current_date, full_date) => {
    let json = {}
    json[encrypt("checksum", current_date)] = ""
    json[encrypt("date", current_date)] = current_date
    const current_time= new Date()
    let time_string = current_time.getHours().toString().padStart(2, "0") +":"+ current_time.getMinutes().toString().padStart(2, "0") +":"+ current_time.getSeconds().toString().padStart(2, "0")
    json[encrypt("time", current_date)] = encrypt(time_string, encrypt("time", current_date))
    json[encrypt("time lived", current_date)] = {}
    json[encrypt("time lived", current_date)][encrypt("weeks lived", current_date)] = encrypt(document.getElementById("passedWeeks").innerHTML, encrypt("weeks lived", current_date))
    json[encrypt("time lived", current_date)][encrypt("current time", current_date)] = {}
    json[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("year", current_date)] = encrypt(document.getElementById("currentYear").innerHTML, encrypt("year", current_date))
    json[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("week", current_date)] = encrypt(document.getElementById("currentWeek").innerHTML, encrypt("week", current_date))
    json[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("day", current_date)] = encrypt(document.getElementById("currentDay").innerHTML, encrypt("day", current_date))
    json[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("hour", current_date)] = encrypt(document.getElementById("currentHour").innerHTML, encrypt("hour", current_date))
    json[encrypt("colony", current_date)] = {}
    json[encrypt("colony", current_date)][encrypt("name", current_date)] =  encrypt(document.getElementById("colonyName").value, encrypt("name", current_date))
    json[encrypt("colony", current_date)][encrypt("weeks lived", current_date)] = encrypt(document.getElementById("passedWeeks").innerHTML.padStart(10, "0"), encrypt("weeks lived", current_date))
    json[encrypt("colony", current_date)][encrypt("score", current_date)] =  encrypt(document.getElementById("colonyScore").innerHTML.padStart(10, "0"), encrypt("score", current_date))
    json[encrypt("colony", current_date)][encrypt("life quality", current_date)] =  encrypt(document.getElementById("colonyLifeQuality").innerHTML.padStart(10, "0"), encrypt("life quality", current_date))
    json[encrypt("colony", current_date)][encrypt("power", current_date)] =  encrypt(document.getElementById("colonyPower").innerHTML.padStart(10, "0"), encrypt("power", current_date))
    json[encrypt("colony", current_date)][encrypt("oppression", current_date)] =  encrypt(document.getElementById("colonyOppression").innerHTML.padStart(10, "0"), encrypt("oppression", current_date))
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)] =  {}
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("food", current_date)] = {}
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("food", current_date)][encrypt("daily consumption", current_date)] = encrypt(document.getElementById("colony-food-consumption").innerHTML.padStart(10, "0"), encrypt("daily consumption", current_date))
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("food", current_date)][encrypt("daily income", current_date)] = encrypt(document.getElementById("colony-food-income").innerHTML.padStart(10, "0"), encrypt("daily income", current_date))
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("food", current_date)][encrypt("stock", current_date)] = encrypt(document.getElementById("colony-food-stock").innerHTML.padStart(10, "0"), encrypt("stock", current_date))
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("water", current_date)] = {}
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("water", current_date)][encrypt("daily consumption", current_date)] = encrypt(document.getElementById("colony-water-consumption").innerHTML.padStart(10, "0"), encrypt("daily consumption", current_date))
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("water", current_date)][encrypt("daily income", current_date)] = encrypt(document.getElementById("colony-water-income").innerHTML.padStart(10, "0"), encrypt("daily income", current_date))
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("water", current_date)][encrypt("stock", current_date)] = encrypt(document.getElementById("colony-water-stock").innerHTML.padStart(10, "0"), encrypt("stock", current_date))
    json[encrypt("colony", current_date)][encrypt("global stock", current_date)] = {}
    json[encrypt("colony", current_date)][encrypt("global stock", current_date)][encrypt("resources", current_date)] = {}
    Object.keys(stock_values.resources.EN).forEach((resource) => {
      let current_value = document.getElementById(`colony-${resource}-stock`) ? document.getElementById(`colony-${resource}-stock`).innerHTML : "0"
      json[encrypt("colony", current_date)][encrypt("global stock", current_date)][encrypt("resources", current_date)][encrypt(resource, current_date)] = encrypt(current_value, encrypt(resource, current_date))
    })
    json[encrypt("colony", current_date)][encrypt("global stock", current_date)][encrypt("products", current_date)] = {}
    Object.keys(stock_values.products.EN).forEach((product) => {
      let current_value = document.getElementById(`colony-${product}-stock`) ? document.getElementById(`colony-${product}-stock`).innerHTML : "0"
      json[encrypt("colony", current_date)][encrypt("global stock", current_date)][encrypt("products", current_date)][encrypt(product, current_date)] = encrypt(current_value, encrypt(product, current_date))
    })
    json[encrypt("colony", current_date)][encrypt("global stock", current_date)][encrypt("building parts", current_date)] = {}
    Object.keys(stock_values["building parts"].EN).forEach((building_part) => {
      let current_value = document.getElementById(`colony-${building_part}-stock`) ? document.getElementById(`colony-${building_part}-stock`).innerHTML : "0"
      json[encrypt("colony", current_date)][encrypt("global stock", current_date)][encrypt("building parts", current_date)][encrypt(building_part, current_date)] = encrypt(current_value, encrypt(building_part, current_date))
    })
    json[encrypt("latest news", current_date)] = []
    document.querySelectorAll("#accordion-news h2").forEach((elem) => {
      let id = elem.id.split("-")[2]
      let news = {}
      news[encrypt("id", current_date)] = encrypt(id, encrypt("id", current_date))
      news[encrypt("received in", current_date)] = {}
      news[encrypt("received in", current_date)][encrypt("year", current_date)] = encrypt(elem.querySelector("span > .year").innerHTML, encrypt("year", current_date))
      news[encrypt("received in", current_date)][encrypt("week", current_date)] = encrypt(elem.querySelector("span > .week").innerHTML, encrypt("week", current_date))
      news[encrypt("received in", current_date)][encrypt("day", current_date)] = encrypt(elem.querySelector("span > .day").innerHTML, encrypt("day", current_date))
      news[encrypt("received in", current_date)][encrypt("hour", current_date)] = encrypt(elem.querySelector("span > .hour").innerHTML, encrypt("hour", current_date))
      news[encrypt("status", current_date)] = encrypt(elem.classList.contains("notificationUnread") ? "unread" : "read", encrypt("status", current_date))
      json[encrypt("latest news", current_date)].push(news)
    })
    json[encrypt("landforms", current_date)] = []
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
      landform[encrypt("id", current_date)] = encrypt(landform_id, encrypt("id", current_date))
      landform[encrypt("category", current_date)] = encrypt(category, encrypt("category", current_date))
      if(type){
        landform[encrypt("type", current_date)] = encrypt(type, encrypt("type", current_date))
      }
      landform[encrypt("discovered in", current_date)] = {}
      landform[encrypt("discovered in", current_date)][encrypt("year", current_date)] = encrypt(elem.querySelector(`#landform-${landform_id}-createdYear`).innerHTML, encrypt("year", current_date))
      landform[encrypt("discovered in", current_date)][encrypt("week", current_date)] = encrypt(elem.querySelector(`#landform-${landform_id}-createdWeek`).innerHTML, encrypt("week", current_date))
      landform[encrypt("discovered in", current_date)][encrypt("day", current_date)] = encrypt(elem.querySelector(`#landform-${landform_id}-createdDay`).innerHTML, encrypt("day", current_date))
      landform[encrypt("workers assigned", current_date)] = []
      elem.querySelectorAll("h2.assignable-worker.assigned").forEach((worker_elem) => {
        let worker = {}
        worker[encrypt("id", current_date)] = encrypt(worker_elem, encrypt("id", current_date))
        landform[encrypt("workers assigned", current_date)].push(worker)
      })
      json[encrypt("landforms", current_date)].push(landform)
    })
    json[encrypt("buildings", current_date)] = {}
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)] = {}
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("campaign tent", current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-campaign_tent-list > div").forEach((building_elem) => {
      json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("campaign tent", current_date)].push(encrypt(building_elem.id.split("-")[5], current_date))
    })
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("cottage", current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-cottage-list > div").forEach((building_elem) => {
      json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("cottage", current_date)].push(encrypt(building_elem.id.split("-")[5], current_date))
    })
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("stone house", current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-stoneHouse-list > div").forEach((building_elem) => {
      json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("stone house", current_date)].push(encrypt(building_elem.id.split("-")[5], current_date))
    })
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("brick house", current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-brickHouse-list > div").forEach((building_elem) => {
      json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("brick house", current_date)].push(encrypt(building_elem.id.split("-")[5], current_date))
    })
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("manor", current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-manor-list > div").forEach((building_elem) => {
      json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("manor", current_date)].push(encrypt(building_elem.id.split("-")[5], current_date))
    })
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("mansion", current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-mansion-list > div").forEach((building_elem) => {
      json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("mansion", current_date)].push(encrypt(building_elem.id.split("-")[5], current_date))
    })
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("graveyard", current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-graveyard-list > div").forEach((building_elem) => {
      json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("graveyard", current_date)].push(encrypt(building_elem.id.split("-")[5], current_date))
    })
    json[encrypt("citizens", current_date)] = {}
    json[encrypt("citizens", current_date)][encrypt("list", current_date)] = []
    citizens.forEach((citizen) => {
      let encrypted_citizen = {}
      encrypted_citizen[encrypt("id", current_date)] = encrypt(citizen.id.toString(), encrypt("id", current_date))
      encrypted_citizen[encrypt("fullname", current_date)] = encrypt(citizen.name, encrypt("fullname", current_date))
      encrypted_citizen[encrypt("gender", current_date)] = encrypt(citizen.gender, encrypt("gender", current_date))
      encrypted_citizen[encrypt("status", current_date)] = encrypt(citizen.status, encrypt("status", current_date))
      encrypted_citizen[encrypt("ageWeeks", current_date)] = encrypt(citizen.ageWeeks.toString(), encrypt("ageWeeks", current_date))
      encrypted_citizen[encrypt("ageYears", current_date)] = encrypt(citizen.ageYears.toString(), encrypt("ageYears", current_date))
      encrypted_citizen[encrypt("birthWeek", current_date)] = encrypt(citizen.birthWeek.toString(), encrypt("birthWeek", current_date))
      encrypted_citizen[encrypt("birthWeeks", current_date)] = encrypt(citizen.birthWeeks.toString(), encrypt("birthWeeks", current_date))
      encrypted_citizen[encrypt("weekOfDeath", current_date)] = encrypt(citizen.weekOfDeath.toString(), encrypt("weekOfDeath", current_date))
      encrypted_citizen[encrypt("fertility", current_date)] = encrypt(citizen.fertility.toString(), encrypt("fertility", current_date))
      encrypted_citizen[encrypt("fertilityWeek", current_date)] = encrypt(citizen.fertilityWeek ? citizen.fertilityWeek.toString() : "-", encrypt("fertilityWeek", current_date))
      encrypted_citizen[encrypt("couple", current_date)] = encrypt(citizen.couple ? citizen.couple.toString() : "-", encrypt("couple", current_date))
      encrypted_citizen[encrypt("father", current_date)] = encrypt(citizen.father ? citizen.father.toString() : "-", encrypt("father", current_date))
      encrypted_citizen[encrypt("mother", current_date)] = encrypt(citizen.mother ? citizen.mother.toString() : "-", encrypt("mother", current_date))
      encrypted_citizen[encrypt("children", current_date)] = []
      citizen.children.forEach((child) => { encrypted_citizen[encrypt("children", current_date)].push(encrypt(child.toString(), current_date)) })
      encrypted_citizen[encrypt("leftHand", current_date)] = encrypt(citizen.leftHand != "" ? citizen.leftHand.toString() : "-", encrypt("leftHand", current_date))
      encrypted_citizen[encrypt("rightHand", current_date)] = encrypt(citizen.rightHand != "" ? citizen.rightHand.toString() : "-", encrypt("rightHand", current_date))
      encrypted_citizen[encrypt("outfit", current_date)] = encrypt(citizen.outfit, encrypt("outfit", current_date))
      encrypted_citizen[encrypt("role", current_date)] = encrypt(citizen.role, encrypt("role", current_date))
      encrypted_citizen[encrypt("rolekey", current_date)] = encrypt(citizen.rolekey, encrypt("rolekey", current_date))
      encrypted_citizen[encrypt("xp", current_date)] = encrypt(citizen.xp.toString(), encrypt("xp", current_date))
      encrypted_citizen[encrypt("hatedAttribute", current_date)] = encrypt(citizen.hatedAttribute.toString(), encrypt("hatedAttribute", current_date))
      encrypted_citizen[encrypt("attributes", current_date)] = []
      encrypted_citizen[encrypt("attributes", current_date)].push(encrypt(citizen.attributes[0], current_date))
      encrypted_citizen[encrypt("attributes", current_date)].push(encrypt(citizen.attributes[1], current_date))
      encrypted_citizen[encrypt("attributes", current_date)].push(encrypt(citizen.attributes[2], current_date))
      encrypted_citizen[encrypt("wishedAttributes", current_date)] = []
      encrypted_citizen[encrypt("wishedAttributes", current_date)].push(encrypt(citizen.wishedAttributes[0], current_date))
      encrypted_citizen[encrypt("wishedAttributes", current_date)].push(encrypt(citizen.wishedAttributes[1], current_date))
      encrypted_citizen[encrypt("wishedAttributes", current_date)].push(encrypt(citizen.wishedAttributes[2], current_date))
      json[encrypt("citizens", current_date)][encrypt("list", current_date)].push(encrypted_citizen)
    })
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
    json[encrypt("checksum", current_date)] = encrypt(calculate_CRC(json).toString(), encrypt("checksum", current_date)).toString()
    return json
}
export const build_exported_json_file = (current_date) => {
    let json_result = {}, json, checksum
    json = {}
    checksum = {}
    json[encrypt("date", current_date)] = current_date
    checksum[encrypt("date", current_date)] = calculate_CRC(encrypt("date", current_date)) + calculate_CRC(json[encrypt("date", current_date)])
    const current_time= new Date()
    let time_string = current_time.getHours().toString().padStart(2, "0") +":"+ current_time.getMinutes().toString().padStart(2, "0") +":"+ current_time.getSeconds().toString().padStart(2, "0")
    json[encrypt("time", current_date)] = encrypt(time_string, encrypt("time", current_date))
    checksum[encrypt("time", current_date)] = calculate_CRC(encrypt("time", current_date)) + calculate_CRC(json[encrypt("time", current_date)])
    json[encrypt("time lived", current_date)] = {}
    checksum[encrypt("time lived", current_date)] = {}
    json[encrypt("time lived", current_date)][encrypt("weeks lived", current_date)] = encrypt(document.getElementById("passedWeeks").innerHTML, encrypt("weeks lived", current_date))
    checksum[encrypt("time lived", current_date)][encrypt("weeks lived", current_date)] = calculate_CRC(encrypt("weeks lived", current_date)) + calculate_CRC(json[encrypt("time lived", current_date)][encrypt("weeks lived", current_date)])
    json[encrypt("time lived", current_date)][encrypt("current time", current_date)] = {}
    checksum[encrypt("time lived", current_date)][encrypt("current time", current_date)] = {}
    json[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("year", current_date)] = encrypt(document.getElementById("currentYear").innerHTML, encrypt("year", current_date))
    checksum[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("year", current_date)] = calculate_CRC(encrypt("year", current_date)) + calculate_CRC(json[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("year", current_date)])
    json[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("week", current_date)] = encrypt(document.getElementById("currentWeek").innerHTML, encrypt("week", current_date))
    checksum[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("week", current_date)] = calculate_CRC(encrypt("week", current_date)) + calculate_CRC(json[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("week", current_date)])
    json[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("day", current_date)] = encrypt(document.getElementById("currentDay").innerHTML, encrypt("day", current_date))
    checksum[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("day", current_date)] = calculate_CRC(encrypt("day", current_date)) + calculate_CRC(json[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("day", current_date)])
    json[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("hour", current_date)] = encrypt(document.getElementById("currentHour").innerHTML, encrypt("hour", current_date))
    checksum[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("hour", current_date)] = calculate_CRC(encrypt("hour", current_date)) + calculate_CRC(json[encrypt("time lived", current_date)][encrypt("current time", current_date)][encrypt("hour", current_date)])
    json[encrypt("colony", current_date)] = {}
    checksum[encrypt("colony", current_date)] = {}
    json[encrypt("colony", current_date)][encrypt("name", current_date)] =  encrypt(document.getElementById("colonyName").value, encrypt("name", current_date))
    checksum[encrypt("colony", current_date)][encrypt("name", current_date)] =  calculate_CRC(encrypt("name", current_date)) + calculate_CRC(json[encrypt("colony", current_date)][encrypt("name", current_date)])
    json[encrypt("colony", current_date)][encrypt("weeks lived", current_date)] = encrypt(document.getElementById("passedWeeks").innerHTML.padStart(10, "0"), encrypt("weeks lived", current_date))
    checksum[encrypt("colony", current_date)][encrypt("weeks lived", current_date)] = calculate_CRC(encrypt("weeks lived", current_date)) + calculate_CRC(json[encrypt("colony", current_date)][encrypt("weeks lived", current_date)])
    json[encrypt("colony", current_date)][encrypt("score", current_date)] =  encrypt(document.getElementById("colonyScore").innerHTML.padStart(10, "0"), encrypt("score", current_date))
    checksum[encrypt("colony", current_date)][encrypt("score", current_date)] =  calculate_CRC(encrypt("score", current_date)) + calculate_CRC(json[encrypt("colony", current_date)][encrypt("score", current_date)])
    json[encrypt("colony", current_date)][encrypt("life quality", current_date)] =  encrypt(document.getElementById("colonyLifeQuality").innerHTML.padStart(10, "0"), encrypt("life quality", current_date))
    checksum[encrypt("colony", current_date)][encrypt("life quality", current_date)] =  calculate_CRC(encrypt("life quality", current_date)) + calculate_CRC(json[encrypt("colony", current_date)][encrypt("life quality", current_date)])
    json[encrypt("colony", current_date)][encrypt("power", current_date)] =  encrypt(document.getElementById("colonyPower").innerHTML.padStart(10, "0"), encrypt("power", current_date))
    checksum[encrypt("colony", current_date)][encrypt("power", current_date)] =  calculate_CRC(encrypt("power", current_date)) + calculate_CRC(json[encrypt("colony", current_date)][encrypt("power", current_date)])
    json[encrypt("colony", current_date)][encrypt("oppression", current_date)] =  encrypt(document.getElementById("colonyOppression").innerHTML.padStart(10, "0"), encrypt("oppression", current_date))
    checksum[encrypt("colony", current_date)][encrypt("oppression", current_date)] =  calculate_CRC(encrypt("oppression", current_date)) + calculate_CRC(json[encrypt("colony", current_date)][encrypt("oppression", current_date)])
    /*json[encrypt("colony", current_date)][encrypt("vital resources", current_date)] =  {}
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("food", current_date)] = {}
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("food", current_date)][encrypt("daily consumption", current_date)] = encrypt(document.getElementById("colony-food-consumption").innerHTML.padStart(10, "0"), encrypt("daily consumption", current_date))
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("food", current_date)][encrypt("daily income", current_date)] = encrypt(document.getElementById("colony-food-income").innerHTML.padStart(10, "0"), encrypt("daily income", current_date))
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("food", current_date)][encrypt("stock", current_date)] = encrypt(document.getElementById("colony-food-stock").innerHTML.padStart(10, "0"), encrypt("stock", current_date))
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("water", current_date)] = {}
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("water", current_date)][encrypt("daily consumption", current_date)] = encrypt(document.getElementById("colony-water-consumption").innerHTML.padStart(10, "0"), encrypt("daily consumption", current_date))
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("water", current_date)][encrypt("daily income", current_date)] = encrypt(document.getElementById("colony-water-income").innerHTML.padStart(10, "0"), encrypt("daily income", current_date))
    json[encrypt("colony", current_date)][encrypt("vital resources", current_date)][encrypt("water", current_date)][encrypt("stock", current_date)] = encrypt(document.getElementById("colony-water-stock").innerHTML.padStart(10, "0"), encrypt("stock", current_date))
    json[encrypt("colony", current_date)][encrypt("global stock", current_date)] = {}
    json[encrypt("colony", current_date)][encrypt("global stock", current_date)][encrypt("resources", current_date)] = {}
    Object.keys(stock_values.resources.EN).forEach((resource) => {
      let current_value = document.getElementById(`colony-${resource}-stock`) ? document.getElementById(`colony-${resource}-stock`).innerHTML : "0"
      json[encrypt("colony", current_date)][encrypt("global stock", current_date)][encrypt("resources", current_date)][encrypt(resource, current_date)] = encrypt(current_value, encrypt(resource, current_date))
    })
    json[encrypt("colony", current_date)][encrypt("global stock", current_date)][encrypt("products", current_date)] = {}
    Object.keys(stock_values.products.EN).forEach((product) => {
      let current_value = document.getElementById(`colony-${product}-stock`) ? document.getElementById(`colony-${product}-stock`).innerHTML : "0"
      json[encrypt("colony", current_date)][encrypt("global stock", current_date)][encrypt("products", current_date)][encrypt(product, current_date)] = encrypt(current_value, encrypt(product, current_date))
    })
    json[encrypt("colony", current_date)][encrypt("global stock", current_date)][encrypt("building parts", current_date)] = {}
    Object.keys(stock_values["building parts"].EN).forEach((building_part) => {
      let current_value = document.getElementById(`colony-${building_part}-stock`) ? document.getElementById(`colony-${building_part}-stock`).innerHTML : "0"
      json[encrypt("colony", current_date)][encrypt("global stock", current_date)][encrypt("building parts", current_date)][encrypt(building_part, current_date)] = encrypt(current_value, encrypt(building_part, current_date))
    })
    json[encrypt("latest news", current_date)] = []
    document.querySelectorAll("#accordion-news h2").forEach((elem) => {
      let id = elem.id.split("-")[2]
      let news = {}
      news[encrypt("id", current_date)] = encrypt(id, encrypt("id", current_date))
      news[encrypt("received in", current_date)] = {}
      news[encrypt("received in", current_date)][encrypt("year", current_date)] = encrypt(elem.querySelector("span > .year").innerHTML, encrypt("year", current_date))
      news[encrypt("received in", current_date)][encrypt("week", current_date)] = encrypt(elem.querySelector("span > .week").innerHTML, encrypt("week", current_date))
      news[encrypt("received in", current_date)][encrypt("day", current_date)] = encrypt(elem.querySelector("span > .day").innerHTML, encrypt("day", current_date))
      news[encrypt("received in", current_date)][encrypt("hour", current_date)] = encrypt(elem.querySelector("span > .hour").innerHTML, encrypt("hour", current_date))
      news[encrypt("status", current_date)] = encrypt(elem.classList.contains("notificationUnread") ? "unread" : "read", encrypt("status", current_date))
      json[encrypt("latest news", current_date)].push(news)
    })
    json[encrypt("landforms", current_date)] = []
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
      landform[encrypt("id", current_date)] = encrypt(landform_id, encrypt("id", current_date))
      landform[encrypt("category", current_date)] = encrypt(category, encrypt("category", current_date))
      if(type){
        landform[encrypt("type", current_date)] = encrypt(type, encrypt("type", current_date))
      }
      landform[encrypt("discovered in", current_date)] = {}
      landform[encrypt("discovered in", current_date)][encrypt("year", current_date)] = encrypt(elem.querySelector(`#landform-${landform_id}-createdYear`).innerHTML, encrypt("year", current_date))
      landform[encrypt("discovered in", current_date)][encrypt("week", current_date)] = encrypt(elem.querySelector(`#landform-${landform_id}-createdWeek`).innerHTML, encrypt("week", current_date))
      landform[encrypt("discovered in", current_date)][encrypt("day", current_date)] = encrypt(elem.querySelector(`#landform-${landform_id}-createdDay`).innerHTML, encrypt("day", current_date))
      landform[encrypt("workers assigned", current_date)] = []
      elem.querySelectorAll("h2.assignable-worker.assigned").forEach((worker_elem) => {
        let worker = {}
        worker[encrypt("id", current_date)] = encrypt(worker_elem, encrypt("id", current_date))
        landform[encrypt("workers assigned", current_date)].push(worker)
      })
      json[encrypt("landforms", current_date)].push(landform)
    })
    json[encrypt("buildings", current_date)] = {}
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)] = {}
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("campaign tent", current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-campaign_tent-list > div").forEach((building_elem) => {
      json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("campaign tent", current_date)].push(encrypt(building_elem.id.split("-")[5], current_date))
    })
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("cottage", current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-cottage-list > div").forEach((building_elem) => {
      json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("cottage", current_date)].push(encrypt(building_elem.id.split("-")[5], current_date))
    })
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("stone house", current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-stoneHouse-list > div").forEach((building_elem) => {
      json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("stone house", current_date)].push(encrypt(building_elem.id.split("-")[5], current_date))
    })
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("brick house", current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-brickHouse-list > div").forEach((building_elem) => {
      json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("brick house", current_date)].push(encrypt(building_elem.id.split("-")[5], current_date))
    })
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("manor", current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-manor-list > div").forEach((building_elem) => {
      json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("manor", current_date)].push(encrypt(building_elem.id.split("-")[5], current_date))
    })
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("mansion", current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-mansion-list > div").forEach((building_elem) => {
      json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("mansion", current_date)].push(encrypt(building_elem.id.split("-")[5], current_date))
    })
    json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("graveyard", current_date)] = []
    document.querySelectorAll("#accordion-shelter_related-building-graveyard-list > div").forEach((building_elem) => {
      json[encrypt("buildings", current_date)][encrypt("shelter related", current_date)][encrypt("graveyard", current_date)].push(encrypt(building_elem.id.split("-")[5], current_date))
    })
    json[encrypt("citizens", current_date)] = {}
    json[encrypt("citizens", current_date)][encrypt("list", current_date)] = []
    citizens.forEach((citizen) => {
      let encrypted_citizen = {}
      encrypted_citizen[encrypt("id", current_date)] = encrypt(citizen.id.toString(), encrypt("id", current_date))
      encrypted_citizen[encrypt("fullname", current_date)] = encrypt(citizen.name, encrypt("fullname", current_date))
      encrypted_citizen[encrypt("gender", current_date)] = encrypt(citizen.gender, encrypt("gender", current_date))
      encrypted_citizen[encrypt("status", current_date)] = encrypt(citizen.status, encrypt("status", current_date))
      encrypted_citizen[encrypt("ageWeeks", current_date)] = encrypt(citizen.ageWeeks.toString(), encrypt("ageWeeks", current_date))
      encrypted_citizen[encrypt("ageYears", current_date)] = encrypt(citizen.ageYears.toString(), encrypt("ageYears", current_date))
      encrypted_citizen[encrypt("birthWeek", current_date)] = encrypt(citizen.birthWeek.toString(), encrypt("birthWeek", current_date))
      encrypted_citizen[encrypt("birthWeeks", current_date)] = encrypt(citizen.birthWeeks.toString(), encrypt("birthWeeks", current_date))
      encrypted_citizen[encrypt("weekOfDeath", current_date)] = encrypt(citizen.weekOfDeath.toString(), encrypt("weekOfDeath", current_date))
      encrypted_citizen[encrypt("fertility", current_date)] = encrypt(citizen.fertility.toString(), encrypt("fertility", current_date))
      encrypted_citizen[encrypt("fertilityWeek", current_date)] = encrypt(citizen.fertilityWeek ? citizen.fertilityWeek.toString() : "-", encrypt("fertilityWeek", current_date))
      encrypted_citizen[encrypt("couple", current_date)] = encrypt(citizen.couple ? citizen.couple.toString() : "-", encrypt("couple", current_date))
      encrypted_citizen[encrypt("father", current_date)] = encrypt(citizen.father ? citizen.father.toString() : "-", encrypt("father", current_date))
      encrypted_citizen[encrypt("mother", current_date)] = encrypt(citizen.mother ? citizen.mother.toString() : "-", encrypt("mother", current_date))
      encrypted_citizen[encrypt("children", current_date)] = []
      citizen.children.forEach((child) => { encrypted_citizen[encrypt("children", current_date)].push(encrypt(child.toString(), current_date)) })
      encrypted_citizen[encrypt("leftHand", current_date)] = encrypt(citizen.leftHand != "" ? citizen.leftHand.toString() : "-", encrypt("leftHand", current_date))
      encrypted_citizen[encrypt("rightHand", current_date)] = encrypt(citizen.rightHand != "" ? citizen.rightHand.toString() : "-", encrypt("rightHand", current_date))
      encrypted_citizen[encrypt("outfit", current_date)] = encrypt(citizen.outfit, encrypt("outfit", current_date))
      encrypted_citizen[encrypt("role", current_date)] = encrypt(citizen.role, encrypt("role", current_date))
      encrypted_citizen[encrypt("rolekey", current_date)] = encrypt(citizen.rolekey, encrypt("rolekey", current_date))
      encrypted_citizen[encrypt("xp", current_date)] = encrypt(citizen.xp.toString(), encrypt("xp", current_date))
      encrypted_citizen[encrypt("hatedAttribute", current_date)] = encrypt(citizen.hatedAttribute.toString(), encrypt("hatedAttribute", current_date))
      encrypted_citizen[encrypt("attributes", current_date)] = []
      encrypted_citizen[encrypt("attributes", current_date)].push(encrypt(citizen.attributes[0], current_date))
      encrypted_citizen[encrypt("attributes", current_date)].push(encrypt(citizen.attributes[1], current_date))
      encrypted_citizen[encrypt("attributes", current_date)].push(encrypt(citizen.attributes[2], current_date))
      encrypted_citizen[encrypt("wishedAttributes", current_date)] = []
      encrypted_citizen[encrypt("wishedAttributes", current_date)].push(encrypt(citizen.wishedAttributes[0], current_date))
      encrypted_citizen[encrypt("wishedAttributes", current_date)].push(encrypt(citizen.wishedAttributes[1], current_date))
      encrypted_citizen[encrypt("wishedAttributes", current_date)].push(encrypt(citizen.wishedAttributes[2], current_date))
      json[encrypt("citizens", current_date)][encrypt("list", current_date)].push(encrypted_citizen)
    })
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
    json[encrypt("checksum", current_date)] = encrypt(calculate_CRC(json).toString(), encrypt("checksum", current_date)).toString()
    */
    json_result.json = json
    json_result.checksum = checksum
    return json_result
}

/*
const decrypt_json = (json) => {
  var json_date = json[Object.keys(json)[0]]
  delete json[Object.keys(json)[0]]
  const decrypt_node = (key, json) => {
    if(typeof json === "string"){
      var decrypted_string = decrypt(json, key)
      var decrypted_result = isNaN(1*(decrypted_string)) ? decrypted_string : 1*(decrypted_string) 
      return decrypted_result
    } else {
      var is_array = Array.isArray(json)
      var decrypted_node
      if(is_array){
        decrypted_node = []
        json.forEach((node) => {
          let decrypted_object
          if(typeof node === "object"){
            decrypted_object = {}
            Object.keys(node).forEach((subnode) => {
              let key = decrypt(subnode, json_date)
              decrypted_object[key] = decrypt_node(subnode, node[subnode])
            })
          } else {
            if(typeof node == "string"){
              decrypted_object = decrypt_node(json_date, node)
            }
          }
          decrypted_node.push(decrypted_object)
        })
      } else {
        decrypted_node = {}
        Object.keys(json).forEach((node) => {
          let key = decrypt(node, json_date)
          decrypted_node[key] = decrypt_node(node, json[node])
        })
      }
      return decrypted_node
    }
  }
  let result = {}
  result = decrypt_node("", json)
  result.date = json_date
  return result
}
*/
export const export_progress = () => {
    const current_date = new Date()
    const today = current_date.getFullYear().toString() + "-" + (current_date.getMonth()+1).toString().padStart(2, "0") + "-" + current_date.getDate().toString().padStart(2, "0")
    const full_date = current_date.getFullYear().toString() + (current_date.getMonth()+1).toString().padStart(2, "0") + current_date.getDate().toString().padStart(2, "0") + current_date.getHours().toString().padStart(2, "0") + current_date.getMinutes().toString().padStart(2, "0") + current_date.getSeconds().toString().padStart(2, "0")
    const link = document.createElement("a");
    //const content = JSON.stringify(decrypt_json(build_exported_json(today, full_date)), null, 4)
    const content = JSON.stringify((build_exported_json_file(today, full_date)), null, 4)
    const file = new Blob([content], { type: 'text/plain' })
    link.href = URL.createObjectURL(file)
    link.download = full_date + ".medieval.colonies.json"
    link.click()
    URL.revokeObjectURL(link.href)
}

const import_progress = () => {
    
}