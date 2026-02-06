class Landform {
  static waterTypes = {
    "Lake": {
        "daily-water-income":"6", 
        "daily-food-income":"4"
    }, 
    "Lagoon":{
        "daily-water-income":"5", 
        "daily-food-income":"4"
    }, 
    "River":{
        "daily-water-income":"4", 
        "daily-food-income":"3"
    }, 
    "Stream":{
        "daily-water-income":"3", 
        "daily-food-income":"2"
    }
  }
  static descriptions = { 
    //discovery-probability-1 = Mount discovery probability if no hunting mount discovered yet.
    //discovery-probability-2 = Mount discovery probability after having already discovered a hunting mount.
    "Water reservoir": {
        "score": 1,
        "camelCase":"waterReservoir",
        "discovery-probability-1":"1", 
        "role-keys-related":["waterbearing", "fishing"],
        "min-water-capacity":{"lake":15000, "lagoon":10000, "river":5000, "stream":1000}, 
        "max-water-capacity":{"lake":25000, "lagoon":15000, "river":10000, "stream":2500}, 
        "min-food-capacity":{"lake":1500, "lagoon":1000, "river":500, "stream":100}, 
        "max-food-capacity":{"lake":2500, "lagoon":1500, "river":1000, "stream":250},
    }, 
    "Hunting mount": {
        "score": 1,
        "camelCase":"huntingMount",
        "allows": "Resources/Products derived from wild animals",
        "discovery-probability-1":"0.50", "role-keys-related":["hunting"],
        "min-capacity":{"small":3000, "medium":5000, "large":10000, "huge":20000},
        "max-capacity":{"small":5000, "medium":10000, "large":20000, "huge":50000},
    },
    "Stone mount": {
        "score": 3,
        "camelCase":"stoneMount",
        "allows": "Resources/Products derived from rocks",
        "discovery-probability-1":"0.23", "discovery-probability-2":"0.45", 
        "role-keys-related":["stonebreaking"],
        "min-capacity":{"small":2000, "medium":4000, "large":8000, "huge":15000},
        "max-capacity":{"small":4000, "medium":8000, "large":15000, "huge":30000},
    }, 
    "Wood mount": {
        "score": 5,
        "camelCase":"woodMount",
        "allows": "Resources/Products derived from woods",
        "discovery-probability-1":"0.15", "discovery-probability-2":"0.3", 
        "role-keys-related":["woodcutting"],
        "min-capacity":{"small":5000, "medium":10000, "large":20000, "huge":40000},
        "max-capacity":{"small":10000, "medium":20000, "large":40000, "huge":80000}, 
    },
    "Clay mount": {
        "score": 6,
        "camelCase":"clayMount",
        "allows": "Resources/Products derived from earth",
        "discovery-probability-1":"0.07", "discovery-probability-2":"0.15", 
        "role-keys-related":["stonebreaking"],
        "min-capacity":{"small":5000, "medium":10000, "large":20000, "huge":40000},
        "max-capacity":{"small":10000, "medium":20000, "large":40000, "huge":80000}, 
    },
    "Mineral mount": {
        "score": 8,
        "camelCase":"mineralMount",
        "allows": "Resources/Products derived from iron and other minerals",
        "discovery-probability-1":"0.05", "discovery-probability-2":"0.1", 
        "role-keys-related":["mining"],
        "min-capacity":{"small":1000, "medium":2000, "large":3500, "huge":6000},
        "max-capacity":{"small":2000, "medium":3500, "large":6000, "huge":9000}, 
    }
  }
  static fromCamelCase = {
    "waterReservoir": "Water reservoir",
    "huntingMount": "Hunting mount",
    "stoneMount": "Stone mount",
    "woodMount": "Wood mount",
    "clayMount": "Clay mount",
    "mineralMount": "Mineral mount"
  }
  static get_random_water_type = () => {
    return Object.keys(Landform.waterTypes)[Numeric.random_integer(0, Object.keys(Landform.waterTypes).length-1)]
  }
  constructor(template = false) {
    this.id = (!template || !template.id) ? colony.get_next_landform_id() : template.id
    this.discovered_in = {"year": template && template.discovered_in && template.discovered_in.year ? template.discovered_in.year : colony.time_interval.current_year, 
                          "week": template && template.discovered_in && template.discovered_in.week ? template.discovered_in.week : colony.time_interval.current_week, 
                          "day": template && template.discovered_in && template.discovered_in.day ? template.discovered_in.day : colony.time_interval.current_day,
                          "hour": template && template.discovered_in && template.discovered_in.hour ? template.discovered_in.hour : colony.time_interval.current_hour}
    this.name = template && template["name"] ? template["name"] : translate(language, "Landform") + this.id
    //Landform categories: mineralMount, clayMount, woodMount, stoneMount, huntingMount, waterReservoir
    this.category = template && template["category"] ? template["category"] : translate(language, "Unknown")
    //Landform types: water reservoir: "lake", "lagoon", "river", "stream", others: "small", "medium", "large", "huge"
    this.type = template && template["type"] ? template["type"] : (this.category == 'waterReservoir' ? Landform.get_random_water_type() : translate(language, "Unknown"))
    if(this.category === "waterReservoir"){
      this.income = {
        "food": Number(Landform.waterTypes[this.type]["daily-food-income"]), 
        "water": Number(Landform.waterTypes[this.type]["daily-water-income"])
      }
      let min_food_capacity = Landform.descriptions[Landform.fromCamelCase[this.category]]["min-food-capacity"][this.type.toLowerCase()]
      let max_food_capacity = Landform.descriptions[Landform.fromCamelCase[this.category]]["max-food-capacity"][this.type.toLowerCase()]
      let min_water_capacity = Landform.descriptions[Landform.fromCamelCase[this.category]]["min-water-capacity"][this.type.toLowerCase()]
      let max_water_capacity = Landform.descriptions[Landform.fromCamelCase[this.category]]["max-water-capacity"][this.type.toLowerCase()]
      this.available = {
        "food": Numeric.random_integer(min_food_capacity, max_food_capacity),
        "water": Numeric.random_integer(min_water_capacity, max_water_capacity)
      }
      this.extracted = { "food": 0, "water": 0 }
    }
    if(this.category === "huntingMount"){
      /*
      this.income = {
        "food": Number(Landform.waterTypes[this.type]["daily-food-income"]), 
      }
      */
      let hunting_mount_size = ["small", "medium", "large", "huge"][Numeric.random_integer(0, 3)]
      let min_food_capacity = Landform.descriptions[Landform.fromCamelCase[this.category]]["min-capacity"][hunting_mount_size]
      let max_food_capacity = Landform.descriptions[Landform.fromCamelCase[this.category]]["max-capacity"][hunting_mount_size]
      this.available = {
        "food": Numeric.random_integer(min_food_capacity, max_food_capacity),
      }
      this.extracted = { "food": 0 }
    }
    this.assigned_workers = new Map()
    this.last_landform_id = 0
  }
  get_assigned = (rolekey = "all") => {
    const workers_assigned_filtered_by_role = new Map(
      [...this.assigned_workers].filter(([key, value]) => value.rolekey == rolekey)
    );
    return rolekey === "all" ? new Map() : workers_assigned_filtered_by_role
  }

  draw = () => {
    //Show all content information for current landform
    const draw_content = (d1) => {
      let d, d2, p, p1, s, s1
      const draw_discovery_date = (p) => {
        let s = new DOMElement({
          tagName: "span",
          parentElement: p.getNode()
        })
        let s1 = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n","value":""},{"key":"gender","value":"M"}], 
          parentElement: s.getNode(),
          text: translate(language, "Discovered in", "m", "")
        })
        s1 = new DOMElement({
          tagName: "span", 
          parentElement: s.getNode(),
          text: ":"
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "mx-1", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s.getNode(),
          text: translate(language, "Year")
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "me-1 font-bold", 
          parentElement: s.getNode(), 
          id: `landform-${this.id}-createdYear`,
          text: this.discovered_in.year.toString()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "me-1", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s.getNode(),
          text: translate(language, "Week")
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "me-1 font-bold", 
          parentElement: s.getNode(), 
          id: `landform-${this.id}-createdWeek`,
          text: this.discovered_in.week.toString()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "me-1", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s.getNode(),
          text: translate(language, "Day")
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "me-1 font-bold", 
          parentElement: s.getNode(), 
          id: `landform-${this.id}-createdDay`,
          text: this.discovered_in.day.toString()
        })
      }
      const draw_available = (p) => {
        let d = new DOMElement({
          tagName: "div",
          classes: "flex justify-between gap-1 w-100",
          parentElement: p.getNode().parentElement
        })
        let d1 = new DOMElement({
          tagName: "div",
          classes: "border border-gray-800 bg-gray-600 mt-1 p-1 px-2 w-100",
          parentElement: d.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n", "value":""}], 
          parentElement: d1.getNode(),
          text: translate(language, "Water available units")
        })
        s = new DOMElement({
          tagName: "span",
          parentElement: d1.getNode(),
          text: ":"
        })
        s = new DOMElement({
          tagName: "span",
          classes: "ms-1 font-bold", 
          parentElement: d1.getNode(),
          text: (this.available.water - this.extracted.water).toString()
        })
        s = new DOMElement({
          tagName: "span",
          classes: "ms-1", 
          parentElement: d1.getNode(),
          text: "("
        })
        let percent = Number(((1 - this.extracted.water / this.available.water) * 100).toFixed(2))
        s = new DOMElement({
          tagName: "span",
          classes: "font-bold" + " " + Functions.percent_text_color(percent),
          parentElement: d1.getNode(),
          text: percent.toString()
        })
        s = new DOMElement({
          tagName: "span",
          parentElement: d1.getNode(),
          text: "%)"
        })
        d1 = new DOMElement({
          tagName: "div",
          classes: "border border-gray-800 bg-gray-600 mt-1 p-1 px-2 w-100",
          parentElement: d.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n", "value":""}], 
          parentElement: d1.getNode(),
          text: translate(language, "Food available units")
        })
        s = new DOMElement({
          tagName: "span",
          parentElement: d1.getNode(),
          text: ":"
        })
        s = new DOMElement({
          tagName: "span",
          classes: "ms-1 font-bold", 
          parentElement: d1.getNode(),
          text: (this.available.food - this.extracted.food).toString()
        })
        s = new DOMElement({
          tagName: "span",
          classes: "ms-1",
          parentElement: d1.getNode(),
          text: "("
        })
        percent = Number(((1 - this.extracted.food / this.available.food) * 100).toFixed(2))
        s = new DOMElement({
          tagName: "span",
          classes: "font-bold" + " " + Functions.percent_text_color(percent),
          parentElement: d1.getNode(),
          text: percent.toString()
        })
        s = new DOMElement({
          tagName: "span",
          parentElement: d1.getNode(),
          text: "%)"
        })
      }
      const draw_no_assignable_workers = () => {
        let parent_div = document.querySelector(`#landform-${this.id}-assignable-workers-body`)
        p = new DOMElement({
          tagName: "p", 
          classes: "empty w-100 ms-1 text-xs flex justify-between text-gray-200", 
          parentElement: parent_div
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
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s.getNode(),
          text: translate(language, "No workers available") 
        })
      }
      const undraw_no_assignable_workers = () => {
        document.querySelectorAll(`#landform-${this.id}-assignable-workers-body .empty`).forEach((elem) => elem.remove())
      }
      const undraw_assignable_workers = () => {
        document.querySelectorAll(`#landform-${this.id}-assignable-workers-body h2`).forEach(elem => elem.remove())
      }
      const paint_assigned_worker = (worker_card) => {
        //Change citizen selectable card aspect.
        worker_card.classList.toggle("text-green-400")
        worker_card.classList.toggle("fa-square")
        worker_card.classList.toggle("fa-square-check")
        let h2 = worker_card.closest("h2")
        let div = worker_card.closest("div")
        h2.classList.toggle("unassigned")
        h2.classList.toggle("assigned")
        div.classList.toggle("bg-green-800")
        div.classList.toggle("border-green-600")
        div.querySelector("span > span:last-child").classList.toggle("text-white")
        worker_card.previousSibling.classList.toggle("text-green-400")
      }
      const draw_assignable_workers = () => {
        const toggle_select_worker_event = (e) => {
          paint_assigned_worker(e.target)
          let h2 = e.target.closest("h2")
          //Update landform assigned workers and colony vital resources income.
          let citizen_id = Number(h2.getAttribute("data-citizen-id"))
          let citizen = colony.citizens.get(citizen_id)
          if(h2.classList.contains("assigned")){
            this.assigned_workers.set(citizen_id, citizen)
            citizen.set_status("working")
            if(this.category == "waterReservoir"){
              if(citizen.rolekey === "waterbearing"){
                document.getElementById("current-daily-water-income").innerHTML = (this.get_assigned("waterbearing").size * this.income.water).toString()
              }
              if(citizen.rolekey === "fishing"){
                document.getElementById("current-daily-food-income").innerHTML = (this.get_assigned("fishing").size * this.income.food).toString()
              }
            }
          } else {
            if(this.assigned_workers.has(citizen_id)){
              this.assigned_workers.delete(citizen.id)
              citizen.set_status("idle")
              if(this.category == "waterReservoir"){
                if(citizen.rolekey === "waterbearing"){
                  document.getElementById("current-daily-water-income").innerHTML = (this.get_assigned("waterbearing").size * this.income.water).toString()
                }
                if(citizen.rolekey === "fishing"){
                  document.getElementById("current-daily-food-income").innerHTML = (this.get_assigned("fishing").size * this.income.food).toString()
                }
              } 
            }
          }
        }
        //Remove "no available workers" message if exist
        undraw_no_assignable_workers()
        undraw_assignable_workers()
        //Check if there are new assignable workers
        let assignable_workers_found = []
        colony.citizens.forEach((citizen, id) => {
          let current_role_is_related_to_mount = Landform.descriptions[Landform.fromCamelCase[this.category]]["role-keys-related"].includes(citizen.rolekey)
          let citizen_already_listed = assignable_workers_found.includes(citizen)
          if(current_role_is_related_to_mount && (citizen.status === "idle" || this.assigned_workers.has(citizen.id)) && !citizen_already_listed){
            assignable_workers_found.push(citizen)
            //Add citizen selectable bar with role information.
            let parent_elem = document.querySelector(`#landform-${this.id}-assignable-workers-body`)
            h2 = new DOMElement({
              tagName: "h2", 
              classes: "w-100 assignable-worker unassigned", 
              attributes: [{"key":"data-role", "value":citizen.role}, {"key":"data-citizen-id", "value":citizen.id}], 
              parentElement: parent_elem, 
              id: `${this.category}-assignable-citizen-${citizen.id}`
            })
            d = new DOMElement({
              tagName: "div",
              classes: "flex items-center justify-between w-full py-1 px-2 text-xs bg-gray-700 font-medium border border-gray-900 gap-3 text-gray-400", 
              parentElement: h2.getNode()
            })
            s = new DOMElement({
              tagName: "span",
              parentElement: d.getNode()
            })
            //Gender citizen icon
            let iid = `citizen-${citizen.id}-gender-icon`
            i = new DOMElement({
              tagName: "i", 
              classes: document.getElementById(iid).classList.toString(), 
              parentElement: s.getNode(),
              id: iid
            })
            //Age citizen icon
            iid = `citizen-${citizen.id}-age-group-icon`
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
              classes: document.getElementById(iid).classList.toString(), 
              attributes: [{"key": "style", "value": "font-size:50% !important"}], 
              parentElement: s1.getNode(), 
              id: `citizen-${citizen.id}-age-group-icon`
            })
            //Role citizen icon
            iid = `citizen-${citizen.id}-role-icon`
            i = new DOMElement({
              tagName: "i", 
              classes: document.getElementById(iid).classList.toString(), 
              parentElement: s.getNode(), 
              id: iid
            })
            //XP citizen icon
            iid = `citizen-${citizen.id}-xp-icon`
            s1 = new DOMElement({
              tagName: "span", 
              classes: `${citizen.xp >= 1 ? "" : "hidden "}rounded border border-yellow-400 px-0.5 py-0 text-yellow-400 me-1`, 
              parentElement: s.getNode(), 
              id: iid,
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
              attributes: [{"key":"data-index", "value":citizen.id}], 
              parentElement: s.getNode(), 
              id: `${this.category}-citizen-${citizen.id}-view-info`
            })
            //i.getNode().addEventListener("click", modal_citizen_info)
            //Assign / deassign citizen as mount worker 
            i = new DOMElement({
              tagName: "i",
              classes: "text-sm fa-regular fa-square",
              attributes: [{"key":"data-group", "value":this.category}], 
              parentElement: s.getNode(),
              id: `${this.category}-citizen-${citizen.id}-assign`
            })
            i.getNode().addEventListener("click", toggle_select_worker_event)
            //Check if worker was already assigned to landform.
            if(this.assigned_workers.has(citizen.id)){
              paint_assigned_worker(i.getNode())
            }
          }
        })
        if(!assignable_workers_found.length){
            draw_no_assignable_workers()
        }
      }
      const draw_assignable_workers_panel = (p) => {
        //Draw assignable workers title
        let d1 = new DOMElement({
          tagName: "div",
          id: `landform-${this.id}-assignable-workers-title`,
          classes: "mt-1 border border-gray-800 bg-gray-500 text-xs",
          parentElement: p.getNode().parentElement
        })
        let p1 = new DOMElement({
          tagName: "p",
          classes: "flex justify-between items-center p-1 ps-2 text-xs text-gray-200 bg-gray-800",
          parentElement: d1.getNode()
        })
        let s = new DOMElement({
          tagName: "span",
          attributes: [{"key": "data-i18n", "value": ""}],
          parentElement: p1.getNode(),
          text: translate(language, "Permanently assignable workers")
        })
        let i = new DOMElement({
          tagName: "i", 
          classes: "fa fa-rotate", 
          parentElement: p1.getNode(), 
          id: `landform-${this.id}-assignable-workers-refresh`
        })
        i.getNode().addEventListener("click", (e) => {
            draw_assignable_workers()
        })
        //Draw assignable workers area
        d2 = new DOMElement({
          tagName: "div", 
          classes: "assignable-workers flex flex-wrap gap-1 p-1 bg-gray-600 text-xs", 
          parentElement: d1.getNode(), 
          id: `landform-${this.id}-assignable-workers-body`
        })
        p = new DOMElement({
          tagName: "p", 
          classes: "empty text-xs flex justify-between text-gray-200", 
          parentElement: d2.getNode()
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
          attributes: [{"key":"data-i18n","value":""}, {"key":"gender","value":"n"}], 
          parentElement: s.getNode(),
          text: translate(language, "None")
        })
        draw_assignable_workers()
      }
      const draw_mount = (p) => {
        let s = new DOMElement({
          tagName: "span",
          parentElement: p.getNode()
        })
        //First row
        //First column
        s1 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s.getNode(), 
          id: `landform-${this.id}-description`,
          text: translate(language, Landform.descriptions[Landform.fromCamelCase[this.category]].allows)
        })
        //Next column
        draw_discovery_date(p)
        //TODO next content
      }
      const draw_water_reservoir = (p) => {
        const draw_income = (p) => {
          d = new DOMElement({
            tagName: "div",
            classes: "flex justify-between gap-1 mt-1 w-100",
            parentElement: p.getNode().parentElement
          })
          //Water production information
          d1 = new DOMElement({
            tagName: "div",
            classes: "border border-gray-800 bg-gray-600 w-100",
            parentElement: d.getNode()
          })
          d2 = new DOMElement({
            tagName: "div",
            classes: "bg-gray-800 p-1 px-2 w-100",
            parentElement: d1.getNode(),
            text: translate(language, "Daily water production")
          })
          d2 = new DOMElement({
            tagName: "div",
            classes: "bg-gray-600 p-1 px-2 w-100",
            parentElement: d1.getNode()
          })
          p1 = new DOMElement({
            tagName: "p",
            classes: "flex p-0 m-0",
            parentElement: d2.getNode()
          })
          s = new DOMElement({
            tagName: "span",
            attributes: [{"key":"data-i18n", "value":""}], 
            parentElement: p1.getNode(),
            text: translate(language, "General income")
          })
          s = new DOMElement({
            tagName: "span",
            classes: "",
            parentElement: p1.getNode(),
            text: ":"
          })
          s = new DOMElement({
            tagName: "span",
            classes: "ms-1 font-bold", 
            parentElement: p1.getNode(),
            text: this.income.water.toString()
          })
          s = new DOMElement({
            tagName: "span",
            classes: "ms-1 font-bold", 
            attributes: [{"key":"data-i18n", "value":""}], 
            parentElement: p1.getNode(),
            text: translate(language, "per water bearer")
          })
          p1 = new DOMElement({
            tagName: "p",
            classes: "flex p-0 m-0",
            parentElement: d2.getNode()
          })
          s = new DOMElement({
            tagName: "span",
            attributes: [{"key":"data-i18n", "value":""}], 
            parentElement: p1.getNode(),
            text: translate(language, "Current income")
          })
          s = new DOMElement({
            tagName: "span",
            classes: "",
            parentElement: p1.getNode(),
            text: ":"
          })
          s = new DOMElement({
            tagName: "span",
            classes: "ms-1 font-bold", 
            parentElement: p1.getNode(),
            id: "current-daily-water-income",
            text: (this.income.water * this.get_assigned("waterbearing").size).toString()
          })
          s = new DOMElement({
            tagName: "span",
            classes: "ms-1 font-bold", 
            attributes: [{"key":"data-i18n", "value":""}], 
            parentElement: p1.getNode(),
            text: translate(language, "units")
          })
          //Food production information
          d1 = new DOMElement({
            tagName: "div",
            classes: "border border-gray-800 bg-gray-600 w-100",
            parentElement: d.getNode()
          })
          d2 = new DOMElement({
            tagName: "div",
            classes: "bg-gray-800 p-1 px-2 w-100",
            parentElement: d1.getNode(),
            text: translate(language, "Daily food production")
          })
          d2 = new DOMElement({
            tagName: "div",
            classes: "bg-gray-600 p-1 px-2 w-100",
            parentElement: d1.getNode()
          })
          p1 = new DOMElement({
            tagName: "p",
            classes: "flex p-0 m-0",
            parentElement: d2.getNode()
          })
          s = new DOMElement({
            tagName: "span",
            attributes: [{"key":"data-i18n", "value":""}], 
            parentElement: p1.getNode(),
            text: translate(language, "General income")
          })
          s = new DOMElement({
            tagName: "span",
            classes: "",
            parentElement: p1.getNode(),
            text: ":"
          })
          s = new DOMElement({
            tagName: "span",
            classes: "ms-1 font-bold", 
            parentElement: p1.getNode(),
            text: this.income.food.toString()
          })
          s = new DOMElement({
            tagName: "span",
            classes: "ms-1 font-bold", 
            attributes: [{"key":"data-i18n", "value":""}], 
            parentElement: p1.getNode(),
            text: translate(language, "per fisherman")
          })
          p1 = new DOMElement({
            tagName: "p",
            classes: "flex p-0 m-0",
            parentElement: d2.getNode()
          })
          s = new DOMElement({
            tagName: "span",
            attributes: [{"key":"data-i18n", "value":""}], 
            parentElement: p1.getNode(),
            text: translate(language, "Current income")
          })
          s = new DOMElement({
            tagName: "span",
            classes: "",
            parentElement: p1.getNode(),
            text: ":"
          })
          s = new DOMElement({
            tagName: "span",
            classes: "ms-1 font-bold", 
            parentElement: p1.getNode(),
            id: "current-daily-food-income",
            text: (this.income.food * this.get_assigned("fishing").size).toString()
          })
          s = new DOMElement({
            tagName: "span",
            classes: "ms-1 font-bold", 
            attributes: [{"key":"data-i18n", "value":""}], 
            parentElement: p1.getNode(),
            text: translate(language, "units")
          })
        }

        let s = new DOMElement({
          tagName: "span",
          classes: "ms-2",
          parentElement: p.getNode()
        })
        //First row
        //First column
        s1 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s.getNode(),
          text: translate(language, "Type")
        })
        s1 = new DOMElement({
          tagName: "span", 
          parentElement: s.getNode(),
          text: ":"
        })
        if(this.type){
          s1 = new DOMElement({
            tagName: "span", 
            classes: "ms-1 font-bold", 
            attributes: [{"key":"data-i18n","value":""},{"key":"data-type-key", "value":this.category}], 
            parentElement: s.getNode(), 
            id: `landform-${this.id}-type`,
            text: translate(language, this.type)
          })
        }
        //Next column
        draw_discovery_date(p)
        //If colony has water income, add income increment based on reservoir type.
        //Update info in colony panel
        //colony.set_income("water", colony.income.water + this.income.water)
        //If colony has food income, add income increment based on new reservoir type.
        //colony.set_income("food", colony.income.food + this.income.food)
        //Second row: Water income & Food income
        draw_income(p)
        //Third row: Water available/extracted & Food available/extracted
        draw_available(p)
        //Assignable workers
        draw_assignable_workers_panel(p)
      }
      d2 = new DOMElement({
          tagName: "div", 
          classes: "mt-1 mb-1 mx-1 px-1 py-1 border border-gray-800 bg-gray-700", 
          parentElement: d1.getNode(),
          id: `landform-${this.id}-info`
      })
      p = new DOMElement({
        tagName: "p", 
        classes: "text-xs flex justify-between text-gray-200",
        parentElement: d2.getNode()
      })
      if(this.category === "waterReservoir"){
        draw_water_reservoir(p)
      } else {
        draw_mount(p)
      }
    }
    let d, d0, d1, p, s, s1, i, ga
    //Check if there is no landform yet in landforms panel.
    let landforms_div = document.querySelector("#accordion-landforms")
    if(![undefined, null].includes(landforms_div.querySelector("p.empty"))){
        //Remove "Empty" message.
        landforms_div.querySelector("p.empty").remove()
    }
    //Build landform accordion
    d0 = new DOMElement({
        tagName: "div",
        classes: "w-100",
        parentElement: landforms_div
    })
    //Build landform accordion header
    d = new DOMElement({
        tagName: "div",
        classes: "w-100 border border-gray-800 bg-gray-800 text-xs",
        attributes: [{"key":"data-body", "value":`accordion-landform-${this.id}-body`}, {"key":"data-group", "value":`landforms-accordions`}],
        id: `accordion-landform-${this.id}-title`,
        parentElement: d0.getNode()
    })
    p = new DOMElement({
        tagName: "p",
        classes: "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200",
        parentElement: d.getNode()
    })
    s = new DOMElement({
      tagName: "span",
      classes: "",
      parentElement: p.getNode()
    })
    s1 = new DOMElement({
      tagName: "span", 
      classes: "new text-xs font-medium px-1.5 py-0.5 rounded-sm bg-blue-900 text-blue-300 me-3",
      attributes: [{"key":"gender","value":"m"}, {"key":"data-i18n","value":""}],
      parentElement: s.getNode(),
      text: translate(language, "NEW", "m")
    })
    let landform_title = this.name ? this.name : Landform.fromCamelCase[this.category]
    s1 = new DOMElement({
      tagName: "span", 
      attributes: [{"key":"data-i18n","value":""}], 
      parentElement: s.getNode(),
      text: translate(language, landform_title)
    })
    if(!this.name){
      s1 = new DOMElement({
        tagName: "span", 
        classes: "ms-1",
        parentElement: s.getNode(),
        text: this.id.toString()
      })
    }
    i = new DOMElement({
      tagName: "i",
      classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
      parentElement: p.getNode(),
    })
    //Build landform accordion body
    d1 = new DOMElement({
        tagName: "div", 
        classes: "hidden w-100 text-xs text-gray-200 border border-gray-800 bg-gray-600", 
        attributes: [{"key":"aria-labelledby","value":`accordion-landform-${this.id}-title`}], 
        parentElement: d0.getNode(), 
        id: `accordion-landform-${this.id}-body`
    })
    ga = new GenerativeAccordion({title_id: `accordion-landform-${this.id}-title`, callback: draw_content, parms: d1 })
  }
  
}