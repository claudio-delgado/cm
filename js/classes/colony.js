class Colony {

  static initial_wagons_amount = 3
  static initial_life_quality = 10
  static goods_info = {
    "basalt": {"granularity": 2, "category": 3},
    "boulder": {"granularity": 1, "category": 1}, 
    "branch": {"granularity": 4, "category": 1},
    "charcoal": {"granularity": 4, "category": 1},
    "cheese": {"granularity": 3, "category": 2},
    "clay": {"granularity": 6, "category": 1},
    "coffee grain": {"granularity": 6, "category": 2},
    "copper": {"granularity": 6, "category": 2},
    "diamond": {"granularity": 4, "category": 5},
    "food": {"granularity": 2, "category": 1},
    "gold": {"granularity": 4, "category": 4},
    "granite": {"granularity": 2, "category": 3},
    "gravel": {"granularity": 6, "category": 2},
    "iron": {"granularity": 3, "category": 1},
    "limestone": {"granularity": 3, "category": 2},
    "marble": {"granularity": 2, "category": 4},
    "mushroom": {"granularity": 4, "category": 2},
    "platinum": {"granularity": 4, "category": 3},
    "plaster": {"granularity": 5, "category": 2},
    "quartz": {"granularity": 2, "category": 4},
    "resin": {"granularity": 4, "category": 2},
    "salt": {"granularity": 6, "category": 3},
    "sand": {"granularity": 6, "category": 1},
    "silver": {"granularity": 4, "category": 3},
    "soil": {"granularity": 6, "category": 2},
    "stone": {"granularity": 2, "category": 1},
    "tea leaf": {"granularity": 6, "category": 2},
    "tin": {"granularity": 5, "category": 2},
    "water": {"granularity": 2, "category": 1},
    "wood": {"granularity": 3, "category": 1},
    "wooden trunk": {"granularity": 1, "category": 1},
  }
  static life_quality_bonus = {
    "new baby with enough shelters": {"value": 1, "frecuency": "each"},
    "new baby without enough shelters": {"value": -1, "frecuency": "each"},
    "new foraigner without enough shelters": {"value": -1, "frecuency": "each"},
    "deceased citizen with no room in graveyard": {"value": -1, "frecuency": "every 2"},
    "new landform discovered": {"value": 2, "frecuency": "each"},
    "new ruin discovered": {"value": 3, "frecuency": "each"},
    "battle won": {"value": 4, "frecuency": "each"},
    "defensive battle lost": {"value": -1, "frecuency": "each"},
    "offensive battle lost": {"value": -2, "frecuency": "each"},
    "colony dominated": {"value": -3, "frecuency": "each"},
    "building constructed": {/*depends on each concrete building*/},
    "water crisis": {"value": -1, "frecuency": "weekly"},
    "food crisis": {"value": -2, "frecuency": "weekly"},
  }
  static score_bonus = {
    "resources extraction": {/*depends on each concrete resource type*/},
    "products manufacture": {/*depends on each concrete product type*/},
    "building part manufacture": {/*depends on each concrete product part type*/},
    "building construction": {/*depends on each concrete building type*/},
    "new baby": {"value": 2, "frecuency": "each"},
    "new foraigner": {"value": 1, "frecuency": "each"},
    "new landform discovered": {"value": 5, "frecuency": "each"},
    "new ruin discovered": {"value": 7, "frecuency": "each"},
    "defensive battle won": {"value": 5, "frecuency": "each"},
    "offensive battle won": {"value": 7, "frecuency": "each"},
    "colony dominated": {"value": -10, "frecuency": "each"},
    "dominate colony": {"value": 100, "frecuency": "each"},
    "independence": {"value": 200, "frecuency": "each"},
    "new academic knowledge": {/*depends on each concrete knowledge acquired*/},
    "market transaction": {"value": 1, "frecuency": "each"},
    "graveyard deceased hosting": {/*depends on each individual deceased*/},
  }
  static population_loss_events = {
    /*
        ellapsed_time and threshold are always expressed in days.
        water_shortage: When water stock is 0.
        food_shortage: When food stock is 0.
        low_life_quality: When life quality is lower than 50% of population.
    */
    "daily": {
      "low_life_quality_and_water_shortage": {"status": "inactive", "ellapsed_days": 0, "threshold_days": 1, "result":{"type": "dead_citizens", "quantity": 1}},
      "low_life_quality_and_food_shortage": {"status": "inactive", "ellapsed_days": 0, "threshold_days": 1, "result":{"type": "dead_citizens", "quantity": 1}},
      "water_shortage": {"status": "inactive", "ellapsed_days": 0, "threshold_days": 3, "result":{"type": "dead_citizens", "quantity": 1}, "event_text":"Danger! Your colony is suffering from a masive thurst!", "event_info":"Citizens will start to abandon the colony every day!", "event_tips":["Try to add water bearers to your water reservoir.","If water reservoir is full, try to add water bearers to other mounts.","Try to reduce your population by exiling some citizens."]},
    },
    "weekly":{
      "food_shortage": {"status": "inactive", "ellapsed_days": 0, "threshold_days": 7, "result":{"type": "dead_citizens", "quantity": 1}, "warning_text":"Danger! Your colony is suffering from a masive starvation!", "warning_info":"Citizens will start to abandon the colony every week!", "warning_tips":["Try to add fishers to your water reservoir.","Try to add hunters to a hunting mount.","Try to reduce your population by exiling some citizens."]},
      "low_water_income": {"status": "inactive", "ellapsed_days": 0, "threshold_days": 14, "result":{"type": "exiled_citizens", "quantity": 1}},
      "low_food_income": {"status": "inactive", "ellapsed_days": 0, "threshold_days": 21, "result":{"type": "exiled_citizens", "quantity": 1}},
      "low_life_quality": {
          "status": "inactive",  
          "ellapsed_days": 0, 
          "threshold_days": 28, 
          "result": {
              "type": "exiled_citizens", 
              "quantity": 1
          }
      },
    }
  }
  static initial_resources_storage_capacity = {"granularity1": 60, "granularity2": 150, "granularity3": 300, "granularity4": 600, "granularity5": 1500, "granularity6": 3000}
  static shed_resources_storage_capacity = {"granularity1": 20, "granularity2": 50, "granularity3": 100, "granularity4": 200, "granularity5": 500, "granularity6": 1000}
  static barn_resources_storage_capacity = {"granularity1": 180, "granularity2": 450, "granularity3": 900, "granularity4": 1800, "granularity5": 4500, "granularity6": 9000}
  static warehouse_resources_storage_capacity = {"granularity1": 360, "granularity2": 900, "granularity3": 1800, "granularity4": 3600, "granularity5": 9000, "granularity6": 18000}
  static daily_idle_citizen_water_income = 1
  static daily_idle_citizen_food_income = 1
  static well_water_income = 20
  static citizens_assigned_names = {"Femenine": [], "Masculine": []}
  static zone_search_hours_needed = 1
  
  static add_citizen_assigned_name = (gender, name) => {
    if(gender && name){
      if(gender === "Femenine" || gender === "Masculine"){
        this.citizens_assigned_names[gender].push(name)
      }
    }
  }
  static remove_citizen_assigned_name = (gender, name) => {
    if(gender && name){
      if(gender === "Femenine" || gender === "Masculine"){
        this.citizens_assigned_names[gender] = this.citizens_assigned_names[gender].filter(n => n !== name) 
      }
    }
  }
  
  constructor(template = false) {
    //Player properties.
    this.score = 0
    //Basic properties.
    this.name = template && template["colony name"] ? template["colony name"] : "Colony" + Numeric.random_integer(1, 99999).toString().padStart(5, '0')
    this.type = template && template["type"] ? template["type"] : "Main"
    this.life_quality = Colony.initial_life_quality
    //Time related properties.
    this.time_interval = new GameTime()
    this.time_started = false //True when zone and surroundings were already searched and time has started.
    //Vital resources properties.
    this.income = {
      "water": template && template["vital resources"] && template["vital resources"]["water"] ? template["vital resources"]["water"] : 0,
      "food": template && template["vital resources"] && template["vital resources"]["food"] ? template["vital resources"]["food"] : 0
    }
    this.consumption = {
      "water": 0,
      "food": 0
    }
    //Collection properties.
    this.citizens = new Map()
    this.population = this.citizens.size
    this.couples = [] //{"id":1, "type":"couple", "citizen":<object citizen>, "related":<object citizen>}
    this.pregnancies = new Map()
    this.news = new Map()
    this.landforms = new Map()
    this.buildings = new Map()
    this.buildings.set("shelters", new Map()) //Special map to store shelters alltogether
    this.buildings.set("productive", new Map()) //Special map to store production buildings alltogether
    this.buildings.set("storage", new Map()) //Special map to store storage buildings alltogether
    this.buildings.set("training", new Map()) //Special map to store training buildings alltogether
    this.stock = {"resources": new Map(), "products": new Map(), "buildingParts": new Map()}
    this.stock_arranged //Used when this.stock must be ordered or filtered and be displayed
    this.stock_classified = {
      "resources":{
        "byCategory":{
          "category1":{
            "granularity1": ["boulder", "wooden trunk"],
            "granularity2": ["stone", "water"],
            "granularity3": ["wood", "iron"],
            "granularity4": ["branch", "charcoal"],
            "granularity6": ["clay", "sand"],
          },
          "category2":{
            "granularity3": ["limestone", "cheese"],
            "granularity4": ["resin", "mushroom"],
            "granularity5": ["plaster", "tin"],
            "granularity6": ["gravel", "sand", "coffee grain", "tea leaf", "soil", "copper"],
          },
          "category3":{
            "granularity2": ["granite", "basalt"],
            "granularity4": ["silver", "platinum"],
            "granularity6": ["salt", "sand"],
          },
          "category4":{
            "granularity2": ["quartz", "marble"],
            "granularity4": ["gold"],
          },
          "category5":{
            "granularity4": ["diamond"]
          }
        },
        "byMount":{
          "stone":{
            "category1":{
              "granularity1": ["boulder"],
              "granularity2": ["stone", "water"],
            },
            "category2":{
              "granularity3": ["limestone"],
              "granularity5": ["plaster"],
              "granularity6": ["gravel", "sand"],
            },
            "category3":{
              "granularity2": ["granite", "basalt"],
              "granularity6": ["salt"],
            },
            "category4":{
              "granularity2": ["quartz", "marble"],
            },
          },
          "clay":{
            "category1":{
              "granularity4": ["clay"],
              "granularity6": ["sand"],
            },
            "category2":{
              "granularity6": ["soil"],
            }
          },
          "wood":{
            "category1":{
              "granularity1": ["wooden trunk"],
              "granularity3": ["wood"],
              "granularity4": ["branch"],
            },
            "category2":{
              "granularity4": ["resin", "mushroom", "tea leaf"],
              "granularity6": ["coffee grain"],
            }
          },
          "iron":{
            "category1":{
              "granularity3": ["iron"],
              "granularity4": ["charcoal"],
            },
            "category2":{
              "granularity5": ["tin"],
              "granularity6": ["copper"],
            },
            "category3":{
              "granularity4": ["silver", "platinum"],
            },
            "category4":{
              "granularity4": ["gold"],
            },
            "category5":{
              "granularity4": ["diamond"],
            },
          }
        },
      },
      "products": {
        "byCategory":{
          "category1":{
            "granularity1":  ["wooden plank"],
            "granularity2":  ["fishing net", "fishing rod", "wheat flour", "crops flour", "crops oil", "sugar", "brick", "iron foundry", "iron ingot", "iron rod", "iron plate", "carp", "perch"],
            "granularity3":  ["potatoe", "carrot", "apple", "pear", "chicken", "chicken meat", "hammer", "war knife"],
            "granularity4":  ["crops", "charcoal", "nail", "wooden stick"],
            "granularity5":  ["wheat"],
            "granularity6":  ["feather", "strand"],
          },
          "category2":{
            "granularity1": ["concrete", "cow", "wooden piece", "wagon"],
            "granularity2": ["cement", "milk", "chickpea flour", "grits", "fat", "rawhide", "bread", "steel foundry", "steel plate", "saw", "pickaxe", "shovel", "sword", "trout"],
            "granularity3": ["basic knife", "pumpkin", "orange", "peach", "egg", "olive oil", "ground coffee", "cow meat", "dough", "roof tile", "steel ingot", "rope"],
            "granularity4": ["tomatoe", "wedge"],
            "granularity5": ["hay", "bran", "wool"],
            "granularity6": ["gravel", "sand", "wooden chip"],
          },
          "category3":{
            "granularity1": ["horse", "cutting press", "wooden plate", "shield"],
            "granularity2": ["rice flour", "groats flour", "raw ham", "leather", "tin foundry", "copper foundry", "bronze plate", "cog", "salmon"],
            "granularity3": ["pig meat", "bronze ingot", "bronze doubloon", "small knife", "axe", "trowel"],
            "granularity4": ["handcraft", "groats", "rice", "beet", "cabbage", "strap", "rag"],
            "granularity5": ["strawberry", "grape", "bronze coin"],
            "granularity6": ["sawdust", "thread"],
          },
          "category4":{
            "granularity1": ["pig", "vase", "lance", "carpet"],
            "granularity2": ["rye flour", "bran flour", "ham", "bronze foundry", "silver foundry"],
            "granularity3": ["yeast", "goat meat", "silver ingot", "silver doubloon"],
            "granularity4": ["barley", "rye", "onion"],
            "granularity5": ["green bean", "nut", "almond", "silver coin", "needle"],
          },
          "category5":{
            "granularity2": ["goat", "sheep", "tile", "bow and arrows"],
            "granularity3": ["sheep meat", "gold foundry", "outfit"],
            "granularity4": ["lettuce"],
            "granularity5": ["spinach", "gold coin"],
          },
          "category6":{
            "granularity1": ["catapult"],
            "granularity3": ["rabbit", "rabbit meat", "gold ingot", "gold doubloon"],
            "granularity5": ["chickpea", "olive"],
          }
        },
        "byBuilding":{
          "stonesmith": {         
            "category2":{
              "granularity1": ["concrete"],
              "granularity2": ["cement"],
              "granularity3": ["basic knife"],
              "granularity4": ["handcraft"],
            },
          },
          "woodsmith":{
            "category1":{
              "granularity2": ["fishing net"],
              "granularity3": ["fishing rod"],
            }
          },
          "farm":{
            "category1":{
              "granularity3": ["potatoe", "carrot"],
              "granularity4": ["crops", "apple", "pear"],
              "granularity5": ["wheat"],
            },
            "category2":{
              "granularity3": ["pumpkin"],
              "granularity4": ["tomatoe", "naranja", "durazno"],
              "granularity5": ["hay", "bran"],
            },
            "category3":{
              "granularity4": ["groats", "rice", "beet", "cabbage"],
              "granularity5": ["strawberry", "grape"],
            },
            "category4":{
              "granularity3": ["yeast"],
              "granularity4": ["barley", "rye", "onion"],
              "granularity5": ["green bean", "nut", "almond"],
            },
            "category5":{
              "granularity4": ["lettuce"],
              "granularity5": ["spinach"],
            },
            "category6":{
              "granularity5": ["chickpea", "olive"],
            }
          },
          "barnyard":{
            "category1":{
              "granularity3": ["chicken", "egg"],
            },
            "category2":{
              "granularity1":  ["cow"],
              "granularity2":  ["milk"],
              "granularity3":  ["cheese"],
              "granularity5":  ["wool"],
            },
            "category3":{
              "granularity1":  ["horse"],
            },
            "category4":{
              "granularity1": ["pig"],
            },
            "category5":{
              "granularity2": ["goat", "sheep"],
            },
            "category6":{
              "granularity3":  ["rabbit"],
            },
          },
          "mill":{
            "category1":{
              "granularity2": ["wheat flour", "crops flour", "crops oil", "sugar"],
            },
            "category2":{
              "granularity2": ["chickpea flour", "grits"],
              "granularity3": ["olive oil", "ground coffee"],
            },
            "category3":{
              "granularity2": ["rice flour", "groats flour"],
            },
            "category4":{
              "granularity2": ["rye flour", "bran flour"],
            },
          },
          "slaughterhouse":{
              "category1":{
                "granularity3" :["chicken meat"],
                "granularity6": ["feather"],
              },
              "category2":{
                "granularity2": ["fat", "rawhide"],
                "granularity3": ["cow meat"],
              },
              "category3":{
                "granularity2": ["raw ham", "leather"],
                "granularity3": ["pig meat"],
              },
              "category4":{
                "granularity3": ["ham"],
                "granularity3": ["goat meat"],
              },
              "category5":{
                "granularity3": ["sheep meat"],
              },
              "category6":{
                "granularity3": ["rabbit meat"],
              },
          },
          "furnaces":{
              "category1":{
                  "granularity2": ["brick", "iron foundry"],
                  "granularity3": ["chicken meat"],
                  "granularity4": ["charcoal"],
              },
              "category2":{
                "granularity2": ["bread", "steel foundry"],
                "granularity3": ["dough", "roof tile"],
              },
              "category3":{
                "granularity2": ["tin foundry", "copper foundry"],
                "granularity4": ["strap"],
              },
              "category4":{
                "granularity1": ["vase"],
                "granularity2": ["bronze foundry", "silver foundry"],
              },
              "category5":{
                "granularity2": ["tile"],
                "granularity3": ["gold foundry"],
              },
          },
          "blacksmith":{
            "category1":{
              "granularity2": ["iron ingot", "iron rod", "iron plate"],
              "granularity4": ["nail"],
            },
            "category2":{
              "granularity2": ["steel plate", "saw"],
              "granularity3": ["steel ingot"],
              "granularity4": ["wedge"],
            },
            "category3":{
              "granularity1": ["cutting press"],
              "granularity2": ["bronze plate", "cog"],
              "granularity3": ["bronze ingot", "bronze doubloon"],
              "granularity5": ["bronze coin"],
            },
            "category4":{
              "granularity3": ["silver ingot", "silver doubloon"],
              "granularity5": ["silver coin", "needle"],
            },
            "category5":{
              "granularity5": ["gold coin"],
            },
            "category6":{
              "granularity3": ["gold ingot", "gold doubloon"],
            }
          },
          "sawmill":{
              "category1":{
                  "granularity1": ["wooden plank"],
                  "granularity4": ["wooden stick"],
              },
              "category2":{
                  "granularity1": ["wooden piece"],
                  "granularity6": ["wooden chip"],
              },
              "category3":{
                  "granularity1": ["wooden plate"],
                  "granularity6": ["sawdust"],
              },
          },
          "workshop":{
            "category1":{
              "granularity3": ["hammer", "war knife"],
            },
            "category2":{
              "granularity1": ["wagon"],
              "granularity2": ["pickaxe", "shovel", "sword"],
            },
            "category3":{
              "granularity1": ["shield"],
              "granularity3": ["knife", "axe", "trowel"],
            },
            "category4":{
              "granularity1": ["lance"],
            },
            "category5":{
              "granularity2": ["bow and arrows"],
            },
            "category6":{
              "granularity1": ["catapult"],
            }
          },
          "textile":{
            "category1":{
              "granularity6": ["strand"],
            },
            "category2":{
              "granularity3": ["rope"],
            },
            "category3":{
              "granularity4": ["rag"],
              "granularity6": ["thread"],
            },
            "category4":{
              "granularity1": ["carpet"],
            },
            "category5":{
              "granularity3": ["outfit"],
            },
          },
        }
      }
    }
    this.expeditions = new Map()
    //Autonumber ids.
    this.last_citizen_id = 0
    this.last_pregnancy_id = 0
    this.last_landform_id = 0
    this.last_building_id = 0
    this.last_news_id = 0
    this.last_expedition_id = 0
    //Other properties.
    this.searching_zone = false //True when colony zone and surroundings is currently being searched
    this.zone_searched = false //True when colony zone and surroundings were already searched
    this.zone_loot = {"stone":0, "gravel":0, "clay":0, "wooden plank":0, "wooden plate":0, "roof tile":0, "brick":0, "rag":0, "hay":0}
    this.active_panel = null
    this.active_accordion = null
    this.last_progress_saved = template && template["last progress saved"] ? template["last progress saved"] : null
    this.statistics = {
      "expeditions": {"resources": {"successful":0, "missed":0}, "ruins": {"successful":0, "missed":0}, "combat": {"won":0, "lost":0}}
    }
  }

  search_zone = () => {
    this.searching_zone = true
    document.querySelector("#search_zone i").classList.add("fa-beat")
    document.querySelector("#search_zone span").innerText = translate(language, "Searching the zone...")
    this.time_interval.start()
  }
  zone_searched_actions = () => {
    this.searching_zone = false
    this.time_started = true
    //Show modal alert
    let modal_data = {
      "paragraphs":[
        "Your citizens have already searched all the zone and they discovered many new things.",
        "Please, read the notification you received in your News panel to check the report of your citizen's research."
      ]
    }
    let button_modal = document.querySelector("#search_zone")
    let alert_modal = new ModalBox(button_modal, "modalZoneSearched", null, modal_data)
    alert_modal.build("alert_zone_searched").show()
    //Remove search zone button from Colony's available actions
    button_modal.remove()
    //Remove warnings 
    document.querySelectorAll("#searchZoneWarning").forEach((element) => { element.remove() })
    //Collapse colony available actions generative accordion if exists.
    if(this.active_accordion) this.active_accordion.collapse()
    //Calculate goods and resources found in the zone and surroundings.
    let strong_citizens = this.get_population({"attributes":[translate(language, "Strength")]})
    //Goods found depends on strong citizens plus a random factor.
    this.zone_loot["stone"] = Numeric.random_integer(400 + 20 * strong_citizens, 600 )
    this.add_resource_stock({good: "stone", stock: this.zone_loot["stone"]})
    this.zone_loot["gravel"] = Numeric.random_integer(800 + 40 * strong_citizens, 1200 )
    this.add_resource_stock({good: "gravel", stock: this.zone_loot["gravel"]})
    this.zone_loot["clay"] = Numeric.random_integer(800 + 40 * strong_citizens, 1200)
    this.add_resource_stock({good: "clay", stock: this.zone_loot["clay"]})
    this.zone_loot["wooden plank"] = Numeric.random_integer(100 + 5 * strong_citizens, 150)
    this.add_product_stock({good: "wooden plank", stock: this.zone_loot["wooden plank"]})
    this.zone_loot["wooden plate"] = Numeric.random_integer(20 + 3 * strong_citizens, 50)
    this.add_product_stock({good: "wooden plate", stock: this.zone_loot["wooden plate"]})
    this.zone_loot["roof tile"] = Numeric.random_integer(200 + 10 * strong_citizens, 30)
    this.add_product_stock({good: "roof tile", stock: this.zone_loot["roof tile"]})
    this.zone_loot["brick"] = Numeric.random_integer(300 + 15 * strong_citizens, 450)
    this.add_product_stock({good: "brick", stock: this.zone_loot["brick"]})
    this.zone_loot["rag"] = Numeric.random_integer(300 + 15 * strong_citizens, 450)
    this.add_product_stock({good: "rag", stock: this.zone_loot["rag"]})
    this.zone_loot["hay"] = Numeric.random_integer(500 + 20 * strong_citizens, 700)
    this.add_product_stock({good: "hay", stock: this.zone_loot["hay"]})
    this.zone_loot["well"] = 1
    this.add_building_part_stock({good: "well", stock: this.zone_loot["well"]})
    this.add_building_part_stock({good: "shed", stock: 5})
    //Update vital resources.
    this.income.water+= this.get_stock({type: "buildingParts", good: "well"}) * Colony.well_water_income
    //Obtain abandoned campaign tents.
    for(i = 0; i < 5; i++){
      let building = new Building("shelter", "campaign tent")
      this.buildings.set(building.id, building)
      this.buildings.get("shelters").set(building.id, building)
    }
    //Redraw buildings list.
    this.draw_buildings_list(document.getElementById("accordion-building-groups"))
    //Add news message about zone searched.
    News.load_message("zone_searched")
    //Hide "pending zone search" warning inside "welcome" news message.
    let welcome_news_message = this.news.get(1)
    //Change visibility value in welcome_news_message.data
    //welcome_news_message.data.values.filter(item => item.var == "visibility")[0].val = "hidden"
    welcome_news_message.data.values.forEach((item) => {
      if(item.var == "visibility"){
        item.val = "hidden "
      }
    })
    welcome_news_message.news_content = welcome_news_message.parse(welcome_news_message.template_string, welcome_news_message.data)
    this.news.set(1, welcome_news_message)
    //document.querySelectorAll("#zoneSearchWarning").forEach((element) => { element.remove() })
  }
  //Setters (Set private values and draw them in the HTML)
  set_income = (resource_value, resource_type = "water") => {
    this.income[resource_type] = resource_value
    //Update info in colony panel
    let current_daily_revenue
    if(resource_type == "water"){
      current_daily_revenue = this.income.water - this.population * Citizen.daily_water_needs
    } else {
      current_daily_revenue = this.income.food - this.population * Citizen.daily_food_needs
    }
    let str_current_daily_revenue = (current_daily_revenue >= 0 ? "+" : "") + current_daily_revenue
    document.querySelectorAll(`#colony-${resource_type}-income`).forEach(element => element.innerHTML = this.income[resource_type].toString())
    document.querySelectorAll(`#${resource_type}-revenue`).forEach(element => element.innerHTML = str_current_daily_revenue)
    //Check stock growth arrow
    if(current_daily_revenue > 0 && DOMElement.has_classes(`#colony-${resource_type}-stock-icon`, ["fa-arrow-down"])){
      DOMElement.remove_classes(`#colony-${resource_type}-stock-icon`, ["fa-arrow-down"])
      DOMElement.add_classes(`#colony-${resource_type}-stock-icon`, ["fa-arrow-up"])
    }
    if(current_daily_revenue < 0 && DOMElement.has_classes(`#colony-${resource_type}-stock-icon`, ["fa-arrow-up"])){
      DOMElement.remove_classes(`#colony-${resource_type}-stock-icon`, ["fa-arrow-up"])
      DOMElement.add_classes(`#colony-${resource_type}-stock-icon`, ["fa-arrow-down"])
    }
    if(current_daily_revenue === 0) DOMElement.hide([`#colony-${resource_type}-stock-icon`])
    this.check_colony_critical_levels("vital resources")
  }
  set_score = (score) => {
    this.score = score
    //Update info in colony statistics panel
    if(document.querySelector("#colony-score")){
      document.querySelector("#colony-score").innerText = this.score.toString()
      document.querySelector("#colony-score-unit").innerText = translate(language, (this.score === 1 ? "punto" : "puntos"))
    }
  }
  set_population = (population) => {
    this.population = population
    //Update info in colony statistics panel
    this.draw_colony_population()
    this.set_life_quality(this.life_quality)
  }
  set_life_quality = (life_quality) => {
    this.life_quality = life_quality
    let mood = this.get_colony_satisfaction()
    //Update info in colony statistics panel
    if(document.querySelector("#colony-life-quality-situation")){
      document.querySelector("#colony-life-quality-situation").classList = `${mood.color} flex items-center grow gap-1 border border-gray-800 p-0.5 px-1 text-white`
    }
    if(document.querySelector("#colony-life-quality")){
      document.querySelector("#colony-life-quality").innerText = this.life_quality.toString()
    }
    if(document.querySelector("#colony-life-quality-impression")){
      document.querySelector("#colony-life-quality-impression").innerText = translate(language, mood.word)
    }
    if(document.querySelector("#colony-life-quality-icon")){
      document.querySelector("#colony-life-quality-icon").classList = "ms-1 fa "+mood.icon
    }
    //Check criticity
    this.check_colony_critical_levels("life quality")
  }
  //Updaters (Update private properties)
  update_colony_water_income = () => {
    //Obtain water income based on water reservoir type, water bearers assigned, wells built, and general population.
    let wells_daily_income = this.get_stock({type: "buildingParts", good: "well"}) * Colony.well_water_income
    let idle_citizens_daily_income = this.get_population({"status": "idle"}) * Colony.daily_idle_citizen_water_income
    let water_bearers_daily_income = Landform.waterTypes[this.landforms.get(1).type]["daily-water-income"] * this.landforms.get(1).get_assigned("waterbearing").size
    this.set_income(wells_daily_income + idle_citizens_daily_income + water_bearers_daily_income, "water")
  }
  update_colony_food_income = () => {
    //Obtain food income based on food reservoir type, farmers assigned, farms built, and general population.
    let idle_citizens_daily_income = this.get_population({"status": "idle"}) * Colony.daily_idle_citizen_food_income
    let fishermen_daily_income = Landform.waterTypes[this.landforms.get(1).type]["daily-food-income"] * this.landforms.get(1).get_assigned("fishing").size
    let hunters_daily_income = 0
    this.set_income(idle_citizens_daily_income + fishermen_daily_income + hunters_daily_income, "food")
  }
  update_colony_vital_resources = () => {
    this.update_colony_water_income()
    this.update_colony_food_income()
  }

  //Adders (Increase private numeric properties values or collections/maps)
  increase_life_quality = (life_quality_increment) => {
    this.set_life_quality(this.life_quality + life_quality_increment)
  }
  increase_population = (population_increment) => {
    this.set_population(this.population + population_increment)
  }
  add_resource_stock = (resource_object) => {
    let resource_exists = this.stock.resources.get(resource_object.good) != undefined
    let last_stock_value = resource_exists ? this.stock.resources.get(resource_object.good) : 0
    let new_stock_value = last_stock_value + resource_object.stock
    this.stock.resources.set(resource_object.good, new_stock_value)
    //If current resource is being displayed, update it on screen.
    if(document.getElementById(`colony-${resource_object.good}-stock`)){
      document.getElementById(`colony-${resource_object.good}-stock`).innerHTML = new_stock_value.toString()
    }
  }
  add_product_stock = (product_object) => {
    let product_exists = this.stock.products.get(product_object.good) != undefined
    let last_stock_value = product_exists ? this.stock.products.get(product_object.good) : 0
    let new_stock_value = last_stock_value + product_object.stock
    this.stock.products.set(product_object.good, new_stock_value)
    //If current product is being displayed, update it on screen.
    if(document.getElementById(`colony-${product_object.good}-stock`)){
      document.getElementById(`colony-${product_object.good}-stock`).innerHTML = new_stock_value.toString()
    }
  }
  add_building_part_stock = (building_part_object) => {
    let building_part_exists = this.stock.buildingParts.get(building_part_object.good) != undefined
    let last_stock_value = building_part_exists ? this.stock.buildingParts.get(building_part_object.good) : 0
    let new_stock_value = last_stock_value + building_part_object.stock
    this.stock.buildingParts.set(building_part_object.good, new_stock_value)
    //If current building part is being displayed, update it on screen.
    if(document.getElementById(`colony-${building_part_object.good}-stock`)){
      document.getElementById(`colony-${building_part_object.good}-stock`).innerHTML = new_stock_value.toString()
    }
  }
  add_news_message = (news_message) => {
    this.news.set(news_message.id, news_message)
    this.draw_news_message(news_message)
  }
  add_score = (score_increment) => {
    this.score += score_increment
    this.set_score(this.score)
  }
  add_citizen = (citizen) => {
    this.citizens.set(citizen.id, citizen);
    this.population = this.citizens.size
  }
  add_pregnancy = (pregnancy) => {
    this.pregnancies.set(pregnancy.id, pregnancy);
  }
  add_couple = (a_citizen, a_couple) => {
    let couple_relationship_id = this.get_new_couple_relationship_id()
    let couple_relationship = new Relationship(couple_relationship_id, "couple", a_citizen, a_couple)
    this.couples.push(couple_relationship)
    return couple_relationship
  }
  add_landform = (a_landform) => {
    this.landforms.set(a_landform.id, a_landform);
  }

  //Getters (Get private or calculated values)
  get_filtered_citizens = (citizen_template = null) => {
    //By default, if no citizen_template is provided, return total living citizens (excludes deceased ones)
    let filtered_citizens_map = new Map([...this.citizens.entries()].filter(([id, citizen]) => citizen.status != "deceased"))
    if(citizen_template != null){
      //Check first if status is required and specifically if deceased citizens are required.
      if(citizen_template.status){
        if(citizen_template.status == "deceased") filtered_citizens_map = this.citizens
        filtered_citizens_map = new Map([...filtered_citizens_map.entries()].filter(([id, citizen]) => citizen.status == citizen_template.status))
        /*let status_citizens_array = Array.from(filtered_citizens_map.values()).filter(citizen => citizen.status == citizen_template.status)
        let status_citizens_map = new Map()
        status_citizens_array.forEach((citizen) => { status_citizens_map.set(citizen.id, citizen) })
        filtered_citizens_map = status_citizens_map*/
      }
      //Check if gender is required for filtering.
      if(filtered_citizens_map.size && citizen_template.gender){
        if(["Femenine", "Masculine"].includes(citizen_template.gender)){
          filtered_citizens_map = new Map([...filtered_citizens_map.entries()].filter(([id, citizen]) => citizen.gender == citizen_template.gender))
          /*let gender_citizens_array = Array.from(filtered_citizens_map.values()).filter(citizen => citizen.gender == citizen_template.gender)
          let gender_citizens_map = new Map()
          gender_citizens_array.forEach((citizen) => { gender_citizens_map.set(citizen.id, citizen) })
          filtered_citizens_map = gender_citizens_map*/
        } else filtered_citizens_map = new Map()
      }
      //Check if age group is required for filtering.
      if(filtered_citizens_map.size && citizen_template.ageGroup){
        if(["baby", "child", "teen", "adult", "grown adult", "ancient"].includes(citizen_template.ageGroup)){
          let ageGroup_min_weeks = age_week_limits[citizen_template.ageGroup].min, ageGroup_max_weeks = age_week_limits[citizen_template.ageGroup].max
          filtered_citizens_map = new Map([...filtered_citizens_map.entries()].filter(([id, citizen]) => citizen.weeksAlive >= ageGroup_min_weeks && citizen.weeksAlive <= ageGroup_max_weeks))
          /*let ageGroup_citizens_array = Array.from(filtered_citizens_map.values()).filter(citizen => citizen.weeksAlive >= ageGroup_min_weeks && citizen.weeksAlive <= ageGroup_max_weeks)
          let ageGroup_citizens_map = new Map()
          ageGroup_citizens_array.forEach((citizen) => { ageGroup_citizens_map.set(citizen.id, citizen) })
          filtered_citizens_map = ageGroup_citizens_map*/
        } else filtered_citizens_map = new Map()
      }
      //Check if role is required for filtering.
      if(citizen_template.rolekey){
        filtered_citizens_map = new Map([...filtered_citizens_map.entries()].filter(([id, citizen]) => citizen.rolekey == citizen_template.rolekey))
        /*let role_citizens_array = Array.from(filtered_citizens_map.values()).filter(citizen => citizen.rolekey == citizen_template.rolekey)
        let role_citizens_map = new Map()
        role_citizens_array.forEach((citizen) => { role_citizens_map.set(citizen.id, citizen) })
        filtered_citizens_map = role_citizens_map*/
      }
      //Check if attributes are required for filtering.
      if(citizen_template.attributes){
        const template_attributes_set = new Set(citizen_template.attributes.values())
        let attributes_citizens_map = new Map()
        filtered_citizens_map.forEach(citizen => {
          const citizen_attributes_set = new Set(citizen.attributes.values())
          let is_subset = [...template_attributes_set].every(attr => citizen_attributes_set.has(attr))
          if(is_subset) attributes_citizens_map.set(citizen.id, citizen)
        })
        filtered_citizens_map = attributes_citizens_map
      }
    }// else return this.citizens (alive)
    return filtered_citizens_map
    //return null //Error. Citizen template not well formed
  }
  get_population = (citizen_template = null) => {
    //By default, if no citizen_template is provided, return total population alive (excludes deceased ones)
    let citizens = this.get_filtered_citizens(citizen_template) ?? false
    return citizens ? citizens.size : -1
  }
  get_buildings = (building_template = null) => {
    let result_buildings_array = [], result_buildings_map = new Map()
    if(building_template != null){
      //Check if type is required for filtering.
      if(building_template.type){
        result_buildings_array = Array.from(this.buildings.values()).filter(building => building.type == building_template.type)
        if(building_template.subtype){
          result_buildings_array = result_buildings_array.filter(building => building.subtype == building_template.subtype)
        }
        result_buildings_array.forEach((building) => { result_buildings_map.set(building.id, building) })
        return result_buildings_map
      }
    } else return this.buildings
    return [] //Error. Building template not well formed
  }
  get_stock = (stock_template = null) => {
    let result_stock_array = [], result_stock_map = new Map()
    if(stock_template != null){
      //Check if type is required for filtering.
      if(stock_template.type === "resources" || stock_template.type === "products" || stock_template.type === "buildingParts"){
        return this.stock[stock_template.type].get(stock_template.good) > 0 ? this.stock[stock_template.type].get(stock_template.good) : 0
      }
    } else return this.stock.resources.size + this.stock.products.size + this.stock.buildingParts.size
    return 0 //Error. Stock template not well formed
  }
  get_shelter_capacity = (subtype = null) => { //Subtype == null means all shelters
    let shelters_map = this.get_buildings({"type":"shelter"})
    let total_shelter_capacity = 0
    shelters_map.forEach((value, key) => {
      if(subtype){
        if(value.subtype === subtype){
          total_shelter_capacity += Building.capacity[value.subtype] ?? 0
        }
      } else {
        total_shelter_capacity += Building.capacity[value.subtype] ?? 0
      }
    })
    return total_shelter_capacity
  }
  get_stock_limit = (good) => {
    let stock_granularity = Colony.goods_info[good].granularity
    let sheds_amount = this.get_stock({type: "buildingParts", good: "shed"})
    let sheds_capacity = sheds_amount * Colony.shed_resources_storage_capacity["granularity"+stock_granularity]
    let barns_amount = this.get_buildings({"type":"storage", "subtype":"barn"}).size
    let barns_capacity = barns_amount * Colony.barn_resources_storage_capacity["granularity"+stock_granularity]
    let warehouses_amount = this.get_buildings({"type":"storage", "subtype":"warehouse"}).size
    let warehouses_capacity = warehouses_amount * Colony.warehouse_resources_storage_capacity["granularity"+stock_granularity]
    let stock_limit = Colony.initial_resources_storage_capacity["granularity"+stock_granularity] + sheds_capacity + barns_capacity + warehouses_capacity
    return stock_limit
  }
  get_expeditions = (expedition_template) => {
    if(expedition_template){
      if(expedition_template.category){
        return new Map([...this.expeditions].filter(expedition => expedition.category === expedition_template.category))
      }
    }
    return this.expeditions
  }
  get_successful_expeditions = (category) => {
    return this.statistics.expeditions[category.substring(3)].successful
  }
  get_missed_expeditions = (category) => {
    return this.statistics.expeditions[category.substring(3)].missed
  }
  //General getters (Obtain derived values from private properties)
  get_colony_satisfaction = () => {
    let satisfaction = {}
    //Life quality related...
    if(this.life_quality >= this.get_population()){
        if(this.life_quality >= 1.5 * this.get_population()){
            if(this.life_quality >= 2 * this.get_population()){
                satisfaction.level = 5
                satisfaction.word = "Extreme happiness"
                satisfaction.icon = "fa-face-laugh-squint" 
                satisfaction.color = "bg-blue-700"
            } else {
                satisfaction.level = 4
                satisfaction.word = "Happiness" 
                satisfaction.icon = "fa-face-laugh" 
                satisfaction.color = "bg-green-700" //"bg-green-600"
            }
        } else {
            satisfaction.level = 3
            satisfaction.word = "Satisfaction"
            satisfaction.icon = "fa-face-smile"
            satisfaction.color = "bg-lime-600" //"bg-green-700"bg-yellow-700
        }
    } else {
        if(this.life_quality > 0.5 * this.get_population()){ 
            satisfaction.word = "Dissatisfaction"
            satisfaction.level = 2
            satisfaction.icon = "fa-face-meh"
            satisfaction.color = "bg-yellow-600"
        } else {
            if(this.life_quality > 0.3 * this.get_population()){
                satisfaction.level = 1
                satisfaction.word = "Disapproval"
                satisfaction.icon = "fa-face-frown-slight"
                satisfaction.color = "bg-orange-700"
            } else {
                satisfaction.level = 0
                satisfaction.word = "Dissapointment"
                satisfaction.icon = "fa-face-weary"
                satisfaction.color = "bg-red-800"
            }
        }
    }
    //Shelter capacity related...
    let shelter_capacity = this.get_shelter_capacity()
    if(shelter_capacity >= this.get_population()){
      if(shelter_capacity >= 1.5 * this.get_population()){
        if(shelter_capacity >= 2 * this.get_population()){
          satisfaction.shelter_level = 5
          satisfaction.shelter_icon = "fa-face-laugh-squint"
          satisfaction.shelter_color = "bg-blue-700"
        } else {
          satisfaction.shelter_level = 4
          satisfaction.shelter_icon = "fa-face-laugh"
          satisfaction.shelter_color = "bg-green-700"
        }
      } else {
        satisfaction.shelter_level = 3
        satisfaction.shelter_icon = "fa-face-smile"
        satisfaction.shelter_color = "bg-lime-600"
      }
    } else {
      if(shelter_capacity > 0.5 * this.get_population()){
        satisfaction.shelter_level = 2
        satisfaction.shelter_icon = "fa-face-meh"
        satisfaction.shelter_color = "bg-yellow-600"
      } else {
        if(shelter_capacity > 0.3 * this.get_population()){
          satisfaction.shelter_level = 1
          satisfaction.shelter_icon = "fa-face-frown-slight"
          satisfaction.shelter_color = "bg-orange-700"
        } else {
          satisfaction.shelter_level = 0
          satisfaction.shelter_icon = "fa-face-weary"
          satisfaction.shelter_color = "bg-red-800"
        }
      }
    }
    return satisfaction
  }
  get_random_citizen_to_remove = () => {
    //Try to find first any random idle citizen if possible.
    //Exclude non idle citizens from the selection.
    let idle_citizens_map = new Map([...this.citizens].filter(citizen => citizen.status !== "idle"))
    let candidate_citizen
    if(idle_citizens_map.size){
      candidate_citizen = [...idle_citizens_map.values()][Numeric.random_integer(0, idle_citizens_map.size - 1)]
    } else {
        //If no idle citizens, try to find non soldiers secondly.
        //Exclude soldier citizens from the selection.
        let non_soldier_citizens_map = new Map([...this.citizens].filter(citizen => citizen.rolekey === "war"))
        if(non_soldier_citizens_map.size){
            candidate_citizen = [...non_soldier_citizens_map.values()][Numeric.random_integer(0, non_soldier_citizens_map.size - 1)]
        } else {
            //If no non soldier citizens, nor idle citizens, select any random citizen.
            candidate_citizen = [...this.citizens.values()][Numeric.random_integer(0, this.citizens.size - 1)]
        }
    }
    return candidate_citizen
  }
  
  //Autonumbering ids
  get_next_citizen_id = () => {
    this.last_citizen_id = 0
    do this.last_citizen_id++; while(this.citizens.has(this.last_citizen_id))
    return this.last_citizen_id;
  }
  get_next_pregnancy_id = () => {
    this.last_pregnancy_id = 0
    do this.last_pregnancy_id++; while(this.pregnancies.has(this.last_pregnancy_id))
    return this.last_pregnancy_id;
  }
  get_next_landform_id = () => {
    this.last_landform_id = 0
    do this.last_landform_id++; while(this.landforms.has(this.last_landform_id))
    return this.last_landform_id;
  }
  get_next_building_id = () => {
    this.last_building_id = 0
    do this.last_building_id++; while(this.buildings.has(this.last_building_id))
    return this.last_building_id;
  }
  get_next_news_id = () => {
    this.last_news_id = 0
    do this.last_news_id++; while(this.news.has(this.last_news_id))
    return this.last_news_id;
  }
  get_next_expedition_id = () => {
    this.last_expedition_id = 0
    do this.last_expedition_id++; while(this.expeditions.has(this.last_expedition_id))
    return this.last_expedition_id;
  }
    
  get_new_couple_relationship_id = () => {
    return (this.couples.length ? Math.max(...this.couples.map(couple => couple.id)) : 0) + 1
  }
  get_couple_by_members = (a_citizen, a_related) => {
    return this.couples.find(couple => (couple.citizen.id === a_citizen.id && couple.related_citizen.id === a_related.id) || 
          (couple.citizen.id === a_related.id && couple.related_citizen.id === a_citizen.id))
  }
  remove_couple = (relationship_id) => {
    let couple_relationship = this.couples.filter((couple) => couple.id == relationship_id)[0]
    couple_relationship.undraw()
    this.couples = this.couples.filter(couple => couple.id !== relationship_id)
    if(this.couples.length == 0){
      //Build "None" paragraph.
      this.draw_no_relationships()
    }
  }

  //"Have" methods
  has_productive_water_reservoir = () => {
    return [...this.landforms].filter(landform => landform[1].category === "waterReservoir" && landform[1].available.water > 0).length > 0
  }
  has_productive_hunting_mount = () => {
    return [...this.landforms].filter(landform => landform[1].category === "huntingMount" && landform[1].available.food > 0).length > 0
  }

  //Drawing methods.
  //Draw a paragraph warning inside a panel.
  draw_warning_message = (paragraph_id, parent_div, text_message, margin_top = true) => {
    p = new DOMElement({
      tagName: "p",
      classes: `w-100 p-1 px-2 ${margin_top ? "mt-1 " : ""}text-xs text-white bg-yellow-500 border border-gray-800`,
      parentElement: parent_div,
      id: paragraph_id
    })
    i = new DOMElement({
      tagName: "i",
      classes: "fa fa-exclamation-triangle text-gray-700 me-2",
      parentElement: p.getNode(),
    })
    s = new DOMElement({
      tagName: "span",
      classes: "text-gray-700 font-bold",
      parentElement: p.getNode(),
      text: translate(language, text_message)
    })
  }
  draw_colony_name = (parent_div) => {
    //Colony name and save button
    let p = new DOMElement({
      tagName: "p", 
      classes: "flex w-100 gap-1 text-gray-400", 
      parentElement: parent_div
    })
    let s = new DOMElement({
      tagName: "span", 
      classes: "text-xs px-2 bg-gray-500 border border-gray-900 text-white flex items-center", 
      parentElement: p.getNode()
    })
    let s1 = new DOMElement({
      tagName: "span", 
      attributes: [{"key":"data-i18n","value":""}], 
      parentElement: s.getNode(),
      text: translate(language, "Name")
    })
    s1 = new DOMElement({
      tagName: "span",
      parentElement: s.getNode(),
      text: ":"
    })
    let d = new DOMElement({
      tagName: "div", 
      classes: "flex grow relative bg-gray-700 text-gray-300 border border-zinc-800", 
      parentElement: p.getNode()
    })
    let t = new DOMElement({
      tagName: "input",
      classes: "px-2 ps-6 text-xs uppercase placeholder:normal-case placeholder:text-gray-300 w-100 bg-gray-600 border border-gray-400 focus:text-white focus:bg-zinc-500 h-6", 
      attributes: [{"key":"type","value":"text"},{"key":"placeholder","value":"Type in your colony name"},
                    {"key":"value","value":"Colonia12540"}],
      parentElement: d.getNode(), 
      id: "colonyName"
    })
    let i = new DOMElement({
      tagName: "i", 
      classes: "ps-2 text-xs fa fa-pen absolute left-0 top-1/2 transform -translate-y-1/2", //left-2
      parentElement: d.getNode()
    })
    let b = new DOMElement({
      tagName: "button", 
      classes: "text-xs flex-none px-2 button border border-gray-400 bg-gray-800", 
      attributes: [{"key":"type","value":"button"},{"key":"data-i18n","value":""}], 
      parentElement: p.getNode(), 
      id: "newColonyNameSubmit",
      text: translate(language, "Save")
    })
  }
  draw_colony_stats = (colony_div) => {
    const draw_content = (d1) => {
      let p, s, s1, s2
      //Score
      p = new DOMElement({
        tagName: "p", 
        classes: "w-100 flex gap-1 text-xs text-gray-400", 
        parentElement: d1.getNode()
      })
      s = new DOMElement({
        tagName: "span", 
        classes: "flex", 
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span", 
        classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-600 border border-gray-500 text-white", 
        parentElement: s.getNode()
      })
      s2 = new DOMElement({
        tagName: "span", 
        attributes: [{"key":"data-i18n","value":""}], 
        parentElement: s1.getNode(),
        text: translate(language, "Score")
      })
      s2 = new DOMElement({
        tagName: "span",
        parentElement: s1.getNode(), 
        text: ":"
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "w-100 flex gap-1 border border-gray-800 p-0.5 px-1 bg-gray-400",
        parentElement: p.getNode()
      })
      s2 = new DOMElement({
        tagName: "span", 
        classes: "font-bold flex-none text-gray-900", 
        parentElement: s1.getNode(), 
        id: "colony-score",
        text: this.score.toString()
      })
      s2 = new DOMElement({
        tagName: "span", 
        classes: "text-gray-900",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        id: "colony-score-unit",
        text: translate(language, "points")
      })
      //Population
      s = new DOMElement({
        tagName: "span", 
        classes: "flex", 
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span", 
        classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-600 border border-gray-500 text-white", 
        parentElement: s.getNode()
      })
      s2 = new DOMElement({
        tagName: "span", 
        attributes: [{"key":"data-i18n","value":""}], 
        parentElement: s1.getNode(),
        text: translate(language, "Population")
      })
      s2 = new DOMElement({
        tagName: "span",
        parentElement: s1.getNode(), 
        text: ":"
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "w-100 flex gap-1 border border-gray-800 p-0.5 px-1 bg-gray-400",
        parentElement: p.getNode()
      })
      s2 = new DOMElement({
        tagName: "span", 
        classes: "font-bold flex-none text-gray-900", 
        parentElement: s1.getNode(), 
        id: "colony-population",
        text: this.citizens.size.toString()
      })
      s2 = new DOMElement({
        tagName: "span", 
        classes: "text-gray-900",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        id: "colony-population-unit",
        text: translate(language, "citizens")
      })
      //Life quality
      let mood = this.get_colony_satisfaction()
      p = new DOMElement({
        tagName: "p", 
        classes: "w-100 flex gap-1 text-xs text-gray-400", 
        parentElement: d1.getNode()
      })
      s = new DOMElement({
        tagName: "span", 
        classes: "flex", 
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span", 
        classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-600 border border-gray-500 text-white", 
        parentElement: s.getNode()
      })
      let i = new DOMElement({
        tagName: "i", 
        classes: "hidden me-1 text-xs fa fa-beat fa-exclamation p-0 px-2 bg-red-900 text-white border border-white rounded", 
        parentElement: s1.getNode(), 
        id: "colony-life-quality-critical-icon"
      })
      s2 = new DOMElement({
        tagName: "span", 
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        text: translate(language, "Life quality")
      })
      s2 = new DOMElement({
        tagName: "span", 
        parentElement: s1.getNode(),
        text: ":"
      })
      s1 = new DOMElement({
        tagName: "span", 
        classes: `${mood.color} flex items-center grow gap-1 border border-gray-800 p-0.5 px-1 text-white`,
        parentElement: p.getNode(), 
        id: "colony-life-quality-situation"
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: `font-bold flex-none`,
        parentElement: s1.getNode(), 
        id: "colony-life-quality", 
        text: this.life_quality.toString()
      })
      s2 = new DOMElement({
        tagName: "span", 
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        text: translate(language, "points")
      })
      s2 = new DOMElement({
        tagName: "span", 
        parentElement: s1.getNode(),
        text: "("
      })
      s2 = new DOMElement({
        tagName: "span", 
        classes: "font-bold", 
        attributes: [{"key":"data-i18n","value":""}], 
        parentElement: s1.getNode(), 
        id: "colony-life-quality-impression",
        text: translate(language, mood.word)
      })
      s2 = new DOMElement({
        tagName: "span", 
        parentElement: s1.getNode(),
        text: ")"
      })
      i = new DOMElement({
        tagName: "i", 
        classes: "ms-1 fa "+mood.icon,
        parentElement: s1.getNode(),
        id: "colony-life-quality-icon"
      })
      //Shelter capacity
      let shelter_capacity = this.get_shelter_capacity()
      let shelter_capacity_occupation = shelter_capacity ? Math.round(100 * this.population / shelter_capacity) : 0
      let shelter_capacity_color = mood.shelter_color
      p = new DOMElement({
        tagName: "p", 
        classes: "w-100 flex gap-1 text-xs text-gray-400", 
        parentElement: d1.getNode()
      })
      s = new DOMElement({
        tagName: "span", 
        classes: "flex", 
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span", 
        classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-600 border border-gray-500 text-white", 
        parentElement: s.getNode()
      })
      i = new DOMElement({
        tagName: "i", 
        classes: "hidden me-1 text-xs fa fa-beat fa-exclamation p-0 px-2 bg-red-900 text-white border border-white rounded", 
        parentElement: s1.getNode(), 
        id: "colony-shelter-capacity-critical-icon"
      })
      s2 = new DOMElement({
        tagName: "span", 
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        text: translate(language, "Shelter capacity")
      })
      s2 = new DOMElement({
        tagName: "span", 
        parentElement: s1.getNode(),
        text: ":"
      })
      s1 = new DOMElement({
        tagName: "span", 
        classes: `${shelter_capacity_color} flex items-center grow border border-gray-800 p-0.5 px-1 text-white`,
        parentElement: p.getNode(),
        id: "colony-shelter-capacity-info"
      })
      s2 = new DOMElement({
        tagName: "span", 
        classes:`font-bold flex-none`, 
        parentElement: s1.getNode(), 
        id: "colony-shelter-capacity",
        text: shelter_capacity.toString()
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: "mx-1",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        text: translate(language, "citizens", "", "lowercase")
      })
      s2 = new DOMElement({
        tagName: "span", 
        parentElement: s1.getNode(),
        text: "("
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: "me-1",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        text: translate(language, "Occupation")
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: "font-bold",
        parentElement: s1.getNode(),
        id: "colony_shelter_occupation",
        text: shelter_capacity_occupation.toString() + "%"
      })
      s2 = new DOMElement({
        tagName: "span", 
        parentElement: s1.getNode(),
        text: ")"
      })
      i = new DOMElement({
        tagName: "i", 
        classes: `ms-1 fa ${mood.shelter_icon}`,
        parentElement: s1.getNode(),
        id: "shelter_capacity_icon"
      })
      //Power
      p = new DOMElement({
        tagName: "p", 
        classes: "w-100 flex gap-1 p-0 text-xs text-gray-400",
        parentElement: d1.getNode()
      })
      s = new DOMElement({
        tagName: "span", 
        classes: "flex",
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "w-100 flex border border-gray-800 p-0.5 px-1 bg-gray-600 border border-gray-500 text-white",
        parentElement: s.getNode()
      })
      s2 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        text: translate(language, "Power")
      })
      s2 = new DOMElement({
        tagName: "span", 
        classes: "flex",
        parentElement: s1.getNode(),
        text: ":"
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "flex text-gray-900 border border-gray-800 p-0.5 px-1 bg-gray-400",
        parentElement: p.getNode()
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: "font-bold flex-none",
        parentElement: s1.getNode(),
        id: "colony-power",
        text: "10"
      })
      //Oppression
      let oppression_satisfaction = oppression_mood(0)
      s = new DOMElement({
        tagName: "span", 
        classes: "flex",
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span", 
        classes: "flex-none border border-gray-800 p-0.5 px-1 bg-gray-600 border border-gray-500 text-white",
        parentElement: s.getNode()
      })
      s2 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        text: translate(language, "Oppression")
      })
      s2 = new DOMElement({
        tagName: "span", 
        parentElement: s1.getNode(),
        text: ":"
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: `flex ${oppression_satisfaction.color} gap-1 text-white grow border border-gray-800 p-0.5 px-1`,
        parentElement: p.getNode(),
        id: "colony-oppression-situation"
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: "font-bold flex-none",
        parentElement: s1.getNode(),
        id: "colony_oppression",
        text: "0"
      })
      s2 = new DOMElement({
        tagName: "span", 
        parentElement: s1.getNode(),
        text: "("
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: "font-bold",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        id: "colony-situation",
        text: translate(language, "Your colony is free")
      })
      s2 = new DOMElement({
        tagName: "span", 
        parentElement: s1.getNode(),
        text: ")"
      })
      if(shelter_capacity < this.population){
        //Shelter needed warning message
        this.draw_warning_message(`colony-shelter-capacity-warning`, document.getElementById(`accordion-statistics-body`), "To increase your shelter capacity, build more shelters (tents, houses, etc.)", false)
      }
    }
    //Build colony stats accordion
    let d0 = new DOMElement({
      tagName: "div",
      classes: "w-100 mt-1",
      parentElement: colony_div, 
      id: "accordion-statistics"
    })
    //Build colony stats accordion header
    let d = new DOMElement({
        tagName: "div",
        classes: "w-100 border border-gray-800 bg-gray-800 text-xs",
        attributes: [{"key":"data-body", "value":"accordion-statistics-body"}, {"key":"data-group", "value":"colony-accordions"}],
        id: "accordion-statistics-title",
        parentElement: d0.getNode()
    })
    let p = new DOMElement({
      tagName: "p",
      classes: "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200",
      parentElement: d.getNode()
    })
    let s = new DOMElement({
      tagName: "span",
      classes: "",
      parentElement: p.getNode()
    })
    let s1 = new DOMElement({
      tagName: "span", 
      attributes: [{"key":"data-i18n","value":""}], 
      parentElement: s.getNode(),
      text: translate(language, translate(language, "General statistics"))
    })
    let i = new DOMElement({
      tagName: "i",
      classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
      parentElement: p.getNode(),
    })
    //Build colony stats accordion body
    let d1 = new DOMElement({
        tagName: "div", 
        classes: "hidden w-100 flex flex-wrap gap-1 p-1 text-xs text-gray-200 border border-gray-800 bg-gray-500", 
        attributes: [{"key":"aria-labelledby","value":`accordion-statistics-title`}], 
        parentElement: d0.getNode(), 
        id: `accordion-statistics-body`
    })
    let ga = new GenerativeAccordion({title_id: `accordion-statistics-title`, callback: draw_content, parms: d1 })
  }
  draw_colony_vital_resources = (colony_div) => {
    const draw_content = (d1) => {
      let current_water_daily_consumption = this.population * Citizen.daily_water_needs
      this.consumption.water = current_water_daily_consumption
      let current_food_daily_consumption = this.population * Citizen.daily_food_needs
      this.consumption.food = current_food_daily_consumption
      let current_water_daily_income = this.income.water//this.get_stock({type: "buildingParts", good: "well"}) * Colony.well_water_income + this.get_population({status: "idle"}) * Colony.daily_idle_citizen_water_income
      let current_food_daily_income = this.income.food//this.get_population({status: "idle"}) * Colony.daily_idle_citizen_food_income
      let current_water_stock = this.stock.resources.has("water") ? this.stock.resources.get("water") : 0
      let current_food_stock = this.stock.resources.has("food") ? this.stock.resources.get("food") : 0
      let current_water_daily_revenue = current_water_daily_income - current_water_daily_consumption
      let str_current_water_daily_revenue = (current_water_daily_revenue >= 0 ? "+" : "") + current_water_daily_revenue
      let current_food_daily_revenue = current_food_daily_income - current_food_daily_consumption
      let str_current_food_daily_revenue = (current_food_daily_revenue >= 0 ? "+" : "") + current_food_daily_revenue
      let water_crisis = current_water_daily_revenue < 0 && this.time_started
      let water_dangerous_crisis = water_crisis && current_water_stock <= this.population
      let water_stock_icon_class = water_dangerous_crisis ? "" : "hidden"
      let water_icon_class = water_crisis ? "" : "hidden"
      let water_class = current_water_daily_revenue > 0 ? "bg-green-700" : (water_crisis ? "bg-red-800" : "bg-yellow-600")
      let water_stock_class = current_water_daily_revenue > 0 ? "bg-green-700" : (water_dangerous_crisis ? "bg-red-800" : "bg-yellow-600")
      let food_crisis = current_food_daily_revenue < 0 && this.time_started
      let food_dangerous_crisis = food_crisis && current_food_stock <= this.population
      let food_stock_icon_class = food_dangerous_crisis ? "" : "hidden"
      let food_icon_class = food_crisis ? "" : "hidden"
      let food_class = current_food_daily_revenue > 0 ? "bg-green-700" : (food_crisis ? "bg-red-800" : "bg-yellow-600")
      let food_stock_class = current_food_daily_revenue > 0 ? "bg-green-700" : (food_crisis && current_food_stock <= this.population ? "bg-red-800" : "bg-yellow-600")
      const draw_resources_daily_consumption = (d1) => {
        let d, p, s, s1, s2, i
        d = new DOMElement({
          tagName: "div",
          classes: "p-0 w-100 border border-gray-800 bg-gray-400",
          parentElement: d1.getNode()
        })
        p = new DOMElement({
          tagName: "p",
          classes: "w-100 flex gap-1 text-xs",
          parentElement: d.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          classes: "flex gap-1 w-100",
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: "w-100 flex items-center p-0.5 px-1 bg-gray-600 border-b border-gray-800 text-white",
          parentElement: s.getNode(),
          text: translate(language, "Daily consumptions")
        })
        //Water consumption
        p = new DOMElement({
          tagName: "p",
          classes: "grow m-1 flex gap-1 text-xs",
          parentElement: d.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          classes: "flex gap-1 w-100",
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: "flex items-center border border-gray-800 p-0.5 px-1 bg-gray-600 border border-gray-500 text-white",
          parentElement: s.getNode()
        })
        i = new DOMElement({
          tagName: "i",
          classes: `${water_icon_class} me-1 text-xs fa  fa-exclamation p-0.5 px-1 bg-red-900 text-white border border-white rounded`,
          parentElement: s1.getNode(),
          id: "accordion-water-consumption-icon"
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: s1.getNode(),
          text: translate(language, "Water", "", "capitalized")
        })
        s2 = new DOMElement({
          tagName: "span", 
          parentElement: s1.getNode(),
          text: ":"
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: `${water_class} flex gap-1 grow items-center border border-gray-800 p-0.5 px-1 text-white`,
          parentElement: s.getNode()
        })
        //Current daily water consumption
        s2 = new DOMElement({
          tagName: "span",
          classes: "font-bold flex-none",
          parentElement: s1.getNode(),
          id: "colony-water-consumption",
          text: current_water_daily_consumption.toString()
        })
        s2 = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: s1.getNode(),
          text: translate(language, "units")
        })
        //Food consumption
        s = new DOMElement({
          tagName: "span",
          classes: "flex gap-1 w-100",
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: "flex items-center border border-gray-800 p-0.5 px-1 bg-gray-600 border border-gray-500 text-white",
          parentElement: s.getNode()
        })
        i = new DOMElement({
          tagName: "i",
          classes: `${food_icon_class} me-1 text-xs fa fa-exclamation p-0.5 px-1 bg-red-900 text-white border border-white rounded`,
          parentElement: s1.getNode(),
          id: "accordion-food-consumption-icon"
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: s1.getNode(),
          text: translate(language, "Food", "", "capitalized")
        })
        s2 = new DOMElement({
          tagName: "span", 
          parentElement: s1.getNode(),
          text: ":"
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: `${food_class} flex gap-1 grow items-center border border-gray-800 p-0.5 px-1 text-white`,
          parentElement: s.getNode()
        })
        //current_food_daily_consumption
        s2 = new DOMElement({
          tagName: "span",
          classes: "font-bold flex-none",
          parentElement: s1.getNode(),
          id: "colony-food-consumption",
          text: current_food_daily_consumption.toString()
        })
        s2 = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: s1.getNode(),
          text: translate(language, "units")
        })
      }
      const draw_resources_daily_income = (d1) => {
        let d, p, s, s1, s2, i
        d = new DOMElement({
          tagName: "div",
          classes: "p-0 w-100 border border-gray-800 bg-gray-400",
          parentElement: d1.getNode()
        })
        p = new DOMElement({
          tagName: "p",
          classes: "w-100 flex gap-1 text-xs",
          parentElement: d.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          classes: "flex gap-1 w-100",
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: "w-100 flex items-center p-0.5 px-1 bg-gray-600 border-b border-gray-800 text-white",
          parentElement: s.getNode(),
          text: translate(language, "Daily income")
        })
        //Water income
        p = new DOMElement({
          tagName: "p",
          classes: "grow m-1 flex gap-1 text-xs",
          parentElement: d.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          classes: "flex gap-1 w-100",
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: "flex items-center border border-gray-800 p-0.5 px-1 bg-gray-600 border border-gray-500 text-white",
          parentElement: s.getNode()
        })
        i = new DOMElement({
          tagName: "i",
          classes: `${water_icon_class} me-1 text-xs fa  fa-exclamation p-0.5 px-1 bg-red-900 text-white border border-white rounded`,
          parentElement: s1.getNode(),
          id: "accordion-water-income-icon"
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: s1.getNode(),
          text: translate(language, "Water", "", "capitalized")
        })
        s2 = new DOMElement({
          tagName: "span", 
          parentElement: s1.getNode(),
          text: ":"
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: `${water_class} flex gap-1 grow items-center border border-gray-800 p-0.5 px-1 text-white`,
          parentElement: s.getNode()
        })
        //Current water daily income
        s2 = new DOMElement({
          tagName: "span",
          classes: "font-bold flex-none",
          parentElement: s1.getNode(),
          id: "colony-water-income",
          text: current_water_daily_income.toString()
        })
        s2 = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: s1.getNode(),
          text: translate(language, "units")
        })
        //Food income
        s = new DOMElement({
          tagName: "span",
          classes: "flex gap-1 w-100",
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: "flex items-center border border-gray-800 p-0.5 px-1 bg-gray-600 border border-gray-500 text-white",
          parentElement: s.getNode()
        })
        i = new DOMElement({
          tagName: "i",
          classes: `${food_icon_class} me-1 text-xs fa fa-exclamation p-0.5 px-1 bg-red-900 text-white border border-white rounded`,
          parentElement: s1.getNode(),
          id: "accordion-food-income-icon"
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: s1.getNode(),
          text: translate(language, "Food", "", "capitalized")
        })
        s2 = new DOMElement({
          tagName: "span", 
          parentElement: s1.getNode(),
          text: ":"
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: `${food_class} flex gap-1 grow items-center border border-gray-800 p-0.5 px-1 text-white`,
          parentElement: s.getNode()
        })
        //Current daily food income
        s2 = new DOMElement({
          tagName: "span",
          classes: "font-bold flex-none",
          parentElement: s1.getNode(),
          id: "colony-food-income",
          text: current_food_daily_income.toString()
        })
        s2 = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: s1.getNode(),
          text: translate(language, "units")
        })
      }
      const draw_resources_stock = (d1) => {
        let d, p, s, s1, s2, i
        d = new DOMElement({
          tagName: "div",
          classes: "p-0 w-100 border border-gray-800 bg-gray-400",
          parentElement: d1.getNode()
        })
        p = new DOMElement({
          tagName: "p",
          classes: "w-100 flex gap-1 text-xs",
          parentElement: d.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          classes: "flex gap-1 w-100",
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: "w-100 flex items-center p-0.5 px-1 bg-gray-600 border-b border-gray-800 text-white",
          parentElement: s.getNode(),
          text: translate(language, "Stock")
        })
        //Water stock
        p = new DOMElement({
          tagName: "p",
          classes: "grow m-1 flex gap-1 text-xs",
          parentElement: d.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          classes: "flex gap-1 w-100",
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: "flex items-center border border-gray-800 p-0.5 px-1 bg-gray-600 border border-gray-500 text-white",
          parentElement: s.getNode()
        })
        i = new DOMElement({
          tagName: "i",
          classes: `${water_stock_icon_class} me-1 text-xs fa  fa-exclamation px-1 bg-red-900 text-white border border-white rounded`,
          parentElement: s1.getNode(),
          id: "accordion-water-stock-icon"
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: s1.getNode(),
          text: translate(language, "Water", "", "capitalized")
        })
        s2 = new DOMElement({
          tagName: "span", 
          parentElement: s1.getNode(),
          text: ":"
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: `${water_stock_class} flex gap-1 grow items-center bg-gray-600 border border-gray-800 p-0.5 px-1 text-white`,
          parentElement: s.getNode()
        })
        //current_water_stock
        s2 = new DOMElement({
          tagName: "span",
          classes: `font-bold flex-none`,
          parentElement: s1.getNode(),
          id: "colony-water-stock",
          text: current_water_stock.toString()
        })
        s2 = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: s1.getNode(),
          text: translate(language, "units")
        })
        //Water revenue
        s = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(),
          text: "("
        })
        s2 = new DOMElement({
          tagName: "span",
          classes: "font-bold",
          parentElement: s1.getNode(),
          id: "water-revenue",
          text: str_current_water_daily_revenue
        })
        s = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(),
          text: ")"
        })
        //Food stock
        s = new DOMElement({
          tagName: "span",
          classes: "flex gap-1 w-100",
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: "flex items-center border border-gray-800 p-0.5 px-1 bg-gray-600 border border-gray-500 text-white",
          parentElement: s.getNode()
        })
        i = new DOMElement({
          tagName: "i",
          classes: `${food_stock_icon_class} me-1 text-xs fa fa-exclamation px-1 bg-red-900 text-white border border-white rounded`,
          parentElement: s1.getNode(),
          id: "accordion-food-stock-icon"
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: s1.getNode(),
          text: translate(language, "Food", "", "capitalized")
        })
        s2 = new DOMElement({
          tagName: "span", 
          parentElement: s1.getNode(),
          text: ":"
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: `${food_stock_class} flex gap-1 grow items-center border border-gray-800 p-0.5 px-1 text-white`,
          parentElement: s.getNode()
        })
        //current_food_stock
        s2 = new DOMElement({
          tagName: "span",
          classes: "font-bold flex-none",
          parentElement: s1.getNode(),
          id: "colony-food-stock",
          text: current_food_stock.toString()
        })
        s2 = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: s1.getNode(),
          text: translate(language, "units")
        })
        //Food revenue
        s = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(),
          text: "("
        })
        s2 = new DOMElement({
          tagName: "span",
          classes: "font-bold",
          parentElement: s1.getNode(),
          id: "food-revenue",
          text: str_current_food_daily_revenue
        })
        s = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(),
          text: ")"
        })
      }
      draw_resources_daily_consumption(d1)
      draw_resources_daily_income(d1)
      this.check_colony_critical_levels("vital resources")
      draw_resources_stock(d1)
      if(current_food_daily_revenue <= 0){
        this.draw_warning_message("vital-resources-warning", d1.getNode(), "To improve your food income, add fishermen to your water reservoir.", false)
      }
      if(current_water_daily_revenue <= 0){
        this.draw_warning_message("vital-resources-warning", d1.getNode(), "To improve your water income, add water bearers to your water reservoir.", false)
      }
    }
    //Build colony vital resources accordion
    let d = new DOMElement({
      tagName: "div",
      classes: "w-100",
      parentElement: colony_div, 
      id: "accordion-colony-vital-resources"
    })
    //Build colony vital resources accordion header
    let d1 = new DOMElement({
        tagName: "div",
        classes: "w-100 border border-gray-800 bg-gray-800 text-xs",
        attributes: [{"key":"data-body", "value":"accordion-colony-vital-resources-body"}, {"key":"data-group", "value":"colony-accordions"}],
        id: "accordion-colony-vital-resources-title",
        parentElement: d.getNode()
    })
    let p = new DOMElement({
        tagName: "p",
        classes: "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200",
        parentElement: d1.getNode()
    })
    let s = new DOMElement({
      tagName: "span",
      classes: "",
      parentElement: p.getNode()
    })
    let s1 = new DOMElement({
      tagName: "span", 
      attributes: [{"key":"data-i18n","value":""}], 
      parentElement: s.getNode(),
      text: translate(language, translate(language, "Vital resources"))
    })
    let i = new DOMElement({
      tagName: "i",
      classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
      parentElement: p.getNode(),
    })
    //Build colony stats accordion body
    d1 = new DOMElement({
        tagName: "div", 
        classes: "hidden w-100 flex flex-wrap gap-1 p-1 text-xs text-gray-200 border border-gray-800 bg-gray-500", 
        attributes: [{"key":"aria-labelledby","value":`accordion-vital-resources-title`}], 
        parentElement: d.getNode(), 
        id: `accordion-colony-vital-resources-body`
    })
    let ga = new GenerativeAccordion({title_id: `accordion-colony-vital-resources-title`, callback: draw_content, parms: d1 })
  }
  draw_colony_stock = (colony_div) => {
    const draw_content = (div) => {
      let d, d1, d2, p, s, s1, s2
      const stock_goods_panel = (parent_div, stock_type = "resources") => {
        const draw_stock_type_content = (d1) => {
          let more_storage_needed = false
          const stock_filters = (stock_type = "resources", action = "none", value = null) => {
            let parentElem = document.getElementById(stock_type+"-stock-filter-panel")
            let button_id, button_disabled = stock_type === "buildingParts"
            const view_all_action = () => {
              //View all button
              button_id = `show_all_${stock_type}-stock` 
              b = new DOMElement({
                tagName: "button",
                classes: `p-1 text-xs grow button border border-gray-400 ${button_disabled ? "text-gray-200 bg-gray-600" : "text-white bg-gray-800"}`,
                attributes: [{"key":"type","value":"button"}],
                parentElement: s.getNode(),
                id: button_id
              })
              i = new DOMElement({
                tagName: "i",
                classes: `fa fa-${button_disabled ? "ban" : "database"} me-2`,
                parentElement: b.getNode()
              })
              s1 = new DOMElement({
                tagName: "span",
                attributes: [{"key":"data-i18n", "value":""},{"key":"gender", "value":"m"}],
                parentElement: b.getNode(),
                text: translate(language, "View all", "m")
              })
              if(!button_disabled){
                  b.getNode().addEventListener("click", (e) => {
                      //Indicate what is being displayed.
                      let object_type = (stock_type === "buildingParts" ? "building parts" : stock_type)
                      document.getElementById(stock_type+"-stock-showing-info").innerText = translate(language, `All ${object_type} from stock`)
                      stock_filters(stock_type)
                      stock_display(stock_type, this.stock[stock_type])
                  })
              }
            }
            const filter_action = () => {
              //Filter button
              button_id = `show_filter_${stock_type}-stock`
              b = new DOMElement({
                tagName: "button",
                classes: `p-1 text-xs grow button border border-gray-400 ${button_disabled ? "text-gray-200 bg-gray-600" : "text-white bg-gray-800"}`,
                attributes: [{"key":"type","value":"button"}],
                parentElement: s.getNode(),
                id: button_id
              })
              i = new DOMElement({
                tagName: "i",
                classes: `fa fa-${button_disabled ? "ban" : "filters"} me-2`,
                parentElement: b.getNode()
              })
              s1 = new DOMElement({
                tagName: "span",
                attributes: [{"key":"data-i18n", "value":""},{"key":"gender", "value":"m"}],
                parentElement: b.getNode(),
                text: translate(language, "Filter", "m")
              })
              if(!button_disabled){
                if(["filter", "filterCategory", "filterGranularity"].includes(action)){
                  //Disable filter button.
                  b.getNode().classList.remove("text-white", "border-gray-400", "bg-gray-800")
                  b.getNode().classList.add("text-gray-200", "border-gray-400", "bg-gray-600")
                } else {
                  //Enable filter button.
                  b.getNode().classList.remove("text-white", "border-gray-400", "bg-gray-800")
                  b.getNode().classList.remove("text-gray-200", "border-gray-400", "bg-gray-600")
                  b.getNode().classList.add("text-white", "border-gray-400", "bg-gray-800")
                  b.getNode().addEventListener("click", (e) => {
                      stock_filters(stock_type, "filter")
                  })
                }
              }
            }
            const order_action = () => {
              //Sort/order button
              button_id = `order_${stock_type}-stock`
              b = new DOMElement({
                tagName: "button",
                classes: "p-1 text-xs grow button border border-gray-400 bg-gray-800",
                attributes: [{"key":"type","value":"button"}],
                parentElement: s.getNode(),
                id: button_id
              })
              i = new DOMElement({
                tagName: "i",
                classes: `fa fa-arrow-down-wide-short me-2`,
                parentElement: b.getNode()
              })
              s1 = new DOMElement({
                tagName: "span",
                attributes: [{"key":"data-i18n", "value":""},{"key":"gender", "value":"m"}],
                parentElement: b.getNode(),
                text: translate(language, "Order")
              })
              b.getNode().addEventListener("click", (e) => {
                //Sort stock goods
                let stock_translated = new Map(
                  [...this.stock_arranged[stock_type]].map(([key, value]) => [translate(language, key), value])
                )
                let stock_entries = [...stock_translated.entries()]
                let i = e.target.closest("button").querySelector("i")
                //Check if order ASC or DESC
                if(i.classList.contains("fa-arrow-down-wide-short")){
                  //Sort the array by key in ascending order
                  stock_entries.sort((a, b) => a[0].localeCompare(b[0]))
                } else {
                  //Sort the array by key in descending order
                  stock_entries.sort((a, b) => b[0].localeCompare(a[0]))
                }
                //Create a new Map from the sorted array
                this.stock_arranged = new Map()
                this.stock_arranged[stock_type] = new Map(stock_entries)
                //Display ordered stock.
                stock_display(stock_type, this.stock_arranged[stock_type])
                //Change order icon on the sorting button.
                i.classList.toggle("fa-arrow-down-wide-short")
                i.classList.toggle("fa-arrow-down-short-wide")
              })
            }
            //Delete previous filter contents.
            document.querySelectorAll("#"+stock_type+"-stock-filter-panel > *").forEach((elem) => elem.remove())
            s = new DOMElement({
              tagName: "span",
              classes: "flex w-100 gap-1 px-1",
              parentElement: parentElem
            })
            view_all_action()
            filter_action()
            order_action()
            
            //By default, filtered or ordered stock is set equal to this.stock
            this.stock_arranged = new Map()
            this.stock_arranged[stock_type] = this.stock[stock_type]
            
            //If filter was selected...
            if(action === "filter"){
              //Build category and granularity filters.
              s = new DOMElement({
                tagName: "span",
                classes: "flex w-100 gap-1 px-1",
                parentElement: parentElem
              })
              //Filter category button.
              b = new DOMElement({
                tagName: "button",
                classes: "p-1 text-xs grow button border border-gray-400 bg-gray-800",
                attributes: [{"key":"type","value":"button"}],
                parentElement: s.getNode(),
                id: `filter-${stock_type}-stock-category`
              })
              s1 = new DOMElement({
                tagName: "span", 
                attributes: [{"key":"data-i18n", "value":""}],
                parentElement: b.getNode(),
                text: translate(language, "Filter by category")
              })
              b.getNode().addEventListener("click", (e) => {
                stock_filters(stock_type, "filterCategory")
              })
              //Filter granularity button.
              b = new DOMElement({
                tagName: "button",
                classes: "p-1 text-xs grow button border border-gray-400 bg-gray-800",
                attributes: [{"key":"type","value":"button"}],
                parentElement: s.getNode(),
                id: `filter-${stock_type}-stock-granularity`
              })
              s1 = new DOMElement({
                tagName: "span",
                attributes: [{"key":"data-i18n", "value":""}],
                parentElement: b.getNode(),
                text: translate(language, "Filter by granularity")
              })
              b.getNode().addEventListener("click", (e) => {
                stock_filters(stock_type, "filterGranularity")
              })
              //Cancel filter.
              b = new DOMElement({
                tagName: "button",
                classes: "p-1 px-2 text-xs button border border-gray-400 bg-red-800",
                attributes: [{"key":"type","value":"button"}],
                parentElement: s.getNode(),
                id: `filter-${stock_type}-stock-cancel`
              })
              i = new DOMElement({
                tagName: "i",
                classes: "fa fa-times",
                parentElement: b.getNode()
              })
              b.getNode().addEventListener("click", (e) => {
                stock_filters(stock_type)
              })
            }
            //If subfilter was selected... 
            if(["filterCategory", "filterGranularity"].includes(action)){
              if(value === null){ 
                let filter_type = (action === "filterCategory" ? "Category" : "Granularity")
                let text = (action === "filterCategory" ? "Filtrar por categoría" : "Filtrar por granularidad")
                let maxCategoryIndex = (action === "filterCategory" ? 5 : 6)
                //Show all categories or granularities buttons.
                s = new DOMElement({
                  tagName: "span",
                  classes: "flex grow items-center p-1 mx-1.5 border border-gray-800 bg-gray-600",
                  parentElement: parentElem
                })
                s1 = new DOMElement({
                  tagName: "span",
                  classes: "ms-2",
                  parentElement: s.getNode(),
                  text: text
                })
                s1 = new DOMElement({
                  tagName: "span",
                  classes: "me-1",
                  parentElement: s.getNode(),
                  text: ":"
                })
                for(let index = 1; index <= maxCategoryIndex; index++){
                    b = new DOMElement({
                      tagName: "button",
                      classes: "p-1 mx-1 text-xs grow button border border-gray-400 bg-gray-800",
                      attributes: [{"key":"type","value":"button"}, {"key":"data-index","value":index}],
                      parentElement: s.getNode(),
                      id: `filter_${stock_type}_stock-${filter_type}-${index}`
                    })
                    s1 = new DOMElement({
                      tagName: "span",
                      attributes: [{"key":"data-i18n", "value":""}],
                      parentElement: b.getNode(),
                      text: index.toString()
                    })
                    b.getNode().addEventListener("click", (e) => {
                        stock_filters(stock_type, action, e.target.closest("button").getAttribute("data-index"))
                    })
                }
                //Category or granularity index button.
                b = new DOMElement({
                  tagName: "button",
                  classes: "p-1 ms-1 text-xs grow button border border-gray-400 bg-red-800",
                  attributes: [{"key":"type","value":"button"}],
                  parentElement: s.getNode(),
                  id: `filter-${stock_type}-stock-cancel`
                })
                i = new DOMElement({
                  tagName: "i",
                  classes: "fa fa-times",
                  parentElement: b.getNode()
                })
                b.getNode().addEventListener("click", (e) => {
                  stock_filters(stock_type)
                })
              } else {
                let filtered_stock_array = []
                if(action === "filterCategory"){
                  //Indicate what category is being displayed.
                  document.getElementById(stock_type+"-stock-showing-info").innerText = translate(language, "All category "+value+" "+stock_type+" from stock")
                  let filtered_stock_object = this.stock_classified[stock_type].byCategory["category"+value]
                  //Build array with all the resources of the category selected.
                  for(let i = 1; i<=6; i++){
                    if(filtered_stock_object["granularity"+i] != null){
                      filtered_stock_array = [...filtered_stock_array, ...filtered_stock_object["granularity"+i]]
                    }
                  }
                }
                if(action === "filterGranularity"){
                  //Indicate what granularity is being displayed.
                  document.getElementById(stock_type+"-stock-showing-info").innerText = translate(language, "All granularity "+value+" "+stock_type+" from stock")
                  let filtered_stock_object = this.stock_classified[stock_type].byCategory
                  //Build array with all the products of the granularity selected for every category.
                  for(let i = 1; i<=5; i++){
                    if(filtered_stock_object["category"+i]["granularity"+value] != undefined){
                      filtered_stock_array = [...filtered_stock_array, ...filtered_stock_object["category"+i]["granularity"+value]]
                    }
                  }
                }
                
                this.stock_arranged[stock_type] = new Map()
                //Convert filtered array to map
                let filtered_stock = new Map(filtered_stock_array.map((value, index) => [value, index]))
                //Intersect this.stock with filtered
                for (const [key, value] of this.stock[stock_type].entries()) {
                  // Check if the key exists in filtered_stock and if the value associated with that key is the same
                  if (filtered_stock.has(key) && this.stock[stock_type].get(key) > 0) {
                    this.stock_arranged[stock_type].set(key, value);
                  }
                }
                stock_display(stock_type, this.stock_arranged[stock_type])
              }
            }
          }
          const stock_display = (stock_type = "resources", stock_list) => {
            //Delete previous stock goods displayed (if they exist)
            let previous_content_text = document.getElementById(`${stock_type}-stock-showing`)
            let previous_content_list = document.getElementById(`${stock_type}-stock-list`)
            if(previous_content_text){
              previous_content_text.remove()
              previous_content_list.remove()
            }
            p = new DOMElement({
              tagName: "p",
              classes: "flex justify-between py-1 text-xs text-white bg-gray-700",
              parentElement: d1.getNode(),
              id: `${stock_type}-stock-showing`
            })
            s = new DOMElement({
              tagName: "span",
              classes: "flex ms-2",
              parentElement: p.getNode()
            })
            s1 = new DOMElement({
              tagName: "span",
              attributes: [{"key":"data-i18n", "value":""}],
              parentElement: s.getNode(),
              text: translate(language, "Showing")
            })
            s1 = new DOMElement({
              tagName: "span",
              parentElement: s.getNode(),
              text: ":"
            })
            let stock_type_text = (stock_type == "buildingParts" ? "building parts" : stock_type)
            s1 = new DOMElement({
              tagName: "span",
              classes: "ms-2 font-bold",
              attributes: [{"key":"data-i18n", "value":""}],
              parentElement: s.getNode(),
              id: `${stock_type}-stock-showing-info`,
              text: translate(language, `All ${stock_type_text} from stock`)
            })
            let stock_count = 0
            let ds = new DOMElement({
              tagName: "div",
              classes: "flex flex-wrap gap-1 p-1 m-0 bg-gray-600",
              parentElement: d1.getNode(),
              id: `${stock_type}-stock-list`
            })
            stock_list.forEach((stock, good) => {
              stock_count++
              let goods_class = (stock_type == "resources" ? "resourceStock" : (stock_type == "products" ? "productStock" : "buildingPartStock"))
              p = new DOMElement({
                tagName: "p",
                classes: `w-100 ${goods_class} text-xs text-gray-400`,
                parentElement: ds.getNode(),
                id: `colony-${good.replaceAll(" ", "")}-stock-details`
              })
              s = new DOMElement({
                tagName: "span",
                classes: "flex",
                parentElement: p.getNode()
              })
              s1 = new DOMElement({
                tagName: "span",
                classes: "ps-1 text-white",
                parentElement: s.getNode()
              })
              s2 = new DOMElement({
                tagName: "span",
                classes: "font-bold underline",
                attributes: [{"key":"data-i18n","value":""}],
                parentElement: s1.getNode(),
                text: translate(language, good, "", "capitalized")
              })
              s2 = new DOMElement({
                tagName: "span",
                parentElement: s1.getNode(),
                text: ":"
              })
              let formated_good = good.replaceAll(" ", "")
              s1 = new DOMElement({
                tagName: "span",
                classes: "pb-0 grow flex text-white ps-1",
                parentElement: s.getNode()
              })
              s2 = new DOMElement({
                tagName: "span",
                classes: "font-bold me-1",
                parentElement: s1.getNode(),
                id: "colony-"+formated_good+"-stock",
                text: stock.toString()
              })
              if(stock_type == "resources"){
                s2 = new DOMElement({
                  tagName: "span",
                  classes: "me-1",
                  parentElement: s1.getNode(),
                  text: "/"
                })
                let stock_limit = this.get_stock_limit(good)
                s2 = new DOMElement({
                  tagName: "span",
                  classes: "font-bold me-1",
                  parentElement: s1.getNode(),
                  id: "colony-"+formated_good+"-stock-limit",
                  text: stock_limit.toString()
                })
                s2 = new DOMElement({
                  tagName: "span",
                  attributes: [{"key":"data-i18n","value":""}],
                  parentElement: s1.getNode(),
                  text: translate(language, stock == 1 ? "unit" : "units")
                })
                s2 = new DOMElement({
                  tagName: "span",
                  classes: "ms-1",
                  parentElement: s1.getNode(),
                  text: "("
                })
                let stock_limit_used = Math.round((stock / stock_limit) * 100)
                let limit_class = stock_limit_used >= 100 ? "text-red-500" : ""
                s2 = new DOMElement({
                  tagName: "span",
                  classes: `font-bold ${limit_class}`,
                  parentElement: s1.getNode(),
                  id: "colony-"+formated_good+"-stock-limit-used",
                  text: stock_limit_used.toString()
                })
                s2 = new DOMElement({
                  tagName: "span",
                  parentElement: s1.getNode(),
                  text: "%)"
                })
                if(stock_limit_used >= 100){
                  more_storage_needed = true
                  s2 = new DOMElement({
                    tagName: "span",
                    classes: `font-bold ms-1 px-1 bg-red-900 text-white border border-gray-400`,
                    parentElement: s1.getNode(),
                    id: "colony-"+formated_good+"-stock-warning",
                    text: translate(language, "Storage full")
                  })
                }
              }
            })
            if(!stock_count){
              //Display "no results" message.
              p = new DOMElement({
                tagName: "p",
                classes: "empty p-1 text-xs text-white",
                parentElement: ds.getNode()
              })
              s1 = new DOMElement({
                tagName: "span",
                parentElement: p.getNode()
              })
              i = new DOMElement({
                tagName: "i",
                classes: "fa fa-light fa-empty-set me-1",
                parentElement: s1.getNode()
              })
              s1 = new DOMElement({
                tagName: "span",
                parentElement: s1.getNode(),
                text: translate(language, "None")
              })
            }

          }
          //Stock list filters
          p = new DOMElement({
            tagName: "p",
            classes: "flex flex-wrap gap-1 w-100 py-1 text-xs text-white",
            parentElement: d1.getNode(),
            id: `${stock_type}-stock-filter-panel`
          })
          //Show current filter panel.
          stock_filters(stock_type)
          //Show current filter / order applied.
          stock_display(stock_type, this.stock[stock_type])
          if(more_storage_needed){
            //Storage warning message
            this.draw_warning_message(`${stock_type}-stock-storage-warning`, document.getElementById(`${stock_type}-stock-list`), "To expand your storage capacity, build more barns or sheds.")
          }
        }
        //Extracted goods
        d1 = new DOMElement({
          tagName: "div",
          classes: "flex flex-wrap w-100",
          parentElement: parent_div
        })
        d = new DOMElement({
          tagName: "div",
          classes: "w-100 border border-gray-800 bg-gray-800 text-xs",
          attributes: [{"key":"data-body","value":`${stock_type}-stock-body`}, {"key":"data-group","value":"colony-stock-accordions"}], 
          parentElement: d1.getNode(),
          id: `${stock_type}-stock-title`
        })
        p = new DOMElement({
          tagName: "p",
          classes: "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200 bg-gray-900",
          parentElement: d.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          classes: "",
          parentElement: p.getNode()
        })
        let stock_title = stock_type == "resources" ? "Extracted resources" : (stock_type == "products" ? "Manufactured products" : "Manufactured building parts")
        s1 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s.getNode(),
          text: translate(language, translate(language, stock_title))
        })
        let i = new DOMElement({
          tagName: "i",
          classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
          parentElement: p.getNode(),
        })
        d2 = new DOMElement({
          tagName: "div",
          classes: "hidden w-100 p-0 m-0 border border-gray-800 bg-gray-400",
          attributes: [{"key":"aria-labelledby","value":`${stock_type}-stock-title`}], 
          parentElement: d1.getNode(),
          id: `${stock_type}-stock-body`
        })
        let ga = new GenerativeAccordion({ title_id: `${stock_type}-stock-title`, callback: draw_stock_type_content, parms: d2 })
      }
      ["resources", "products", "buildingParts"].forEach(stock_type => {
        //Show current good container
        stock_goods_panel(div.getNode(), stock_type)
      })
    }
    //Build colony stock accordion
    let d = new DOMElement({
      tagName: "div",
      classes: "w-100",
      parentElement: colony_div, 
      id: "accordion-colony-stock"
    })
    //Build colony stock accordion header
    let d1 = new DOMElement({
        tagName: "div",
        classes: "w-100 border border-gray-800 bg-gray-800 text-xs",
        attributes: [{"key":"data-body", "value":"accordion-colony-stock-body"}, {"key":"data-group", "value":"colony-accordions"}],
        id: "accordion-colony-stock-title",
        parentElement: d.getNode()
    })
    let p = new DOMElement({
        tagName: "p",
        classes: "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200",
        parentElement: d1.getNode()
    })
    let s = new DOMElement({
      tagName: "span",
      classes: "",
      parentElement: p.getNode()
    })
    let s1 = new DOMElement({
      tagName: "span", 
      attributes: [{"key":"data-i18n","value":""}], 
      parentElement: s.getNode(),
      text: translate(language, translate(language, "Stock"))
    })
    let i = new DOMElement({
      tagName: "i",
      classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
      parentElement: p.getNode(),
    })
    //Build colony stats accordion body
    d1 = new DOMElement({
        tagName: "div", 
        classes: "hidden w-100 flex flex-wrap gap-1 p-1 text-xs text-gray-200 border border-gray-800 bg-gray-500", 
        attributes: [{"key":"aria-labelledby","value":`accordion-stock-title`}], 
        parentElement: d.getNode(), 
        id: `accordion-colony-stock-body`
    })
    let ga = new GenerativeAccordion({ title_id: `accordion-colony-stock-title`, callback: draw_content, parms: d1 })
  }
  draw_colony_available_actions = (colony_div) => {
    const draw_content = (d1) => {
      let p, b, i, s
      p = new DOMElement({
        tagName: "p",
        classes: "flex gap-1 w-100 justify-between text-gray-300",
        parentElement: d1.getNode()
      })
      if(!this.time_started){
        //Display "Search zone" button
        b = new DOMElement({
          tagName: "button",
          classes: "text-xs grow p-2 button border border-gray-400 bg-gray-800",
          parentElement: p.getNode(),
          id: "search_zone"
        })
        //Remove if exists and add new click event
        b.getNode().removeEventListener("click", this.search_zone)
        b.getNode().addEventListener("click", this.search_zone)
        i = new DOMElement({
          tagName: "i",
          classes: `fa ${this.searching_zone ? "fa-beat " : ""}fa-search me-2`,
          parentElement: b.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n", "value":""}],
          parentElement: b.getNode(),
          text: translate(language, this.searching_zone ? "Your citizens are searching the zone..." : "Search zone")
        })
      } else {
        //Display "Construct building" button
        b = new DOMElement({
          tagName: "button",
          classes: "text-xs grow p-2 button border border-gray-400 bg-gray-800",
          parentElement: p.getNode(),
          id: "construct_building"
        })
        i = new DOMElement({
          tagName: "i",
          classes: "fa fa-hammer me-2",
          parentElement: b.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n", "value":""}],
          parentElement: b.getNode(),
          text: translate(language, "Construct new building")
        })
        b.getNode().addEventListener("click", (e) => {
          //Expand buildings accordion and automatically close colony accordion
          document.querySelector("#accordion-menu-buildings button").click()
        })
        /*
        //Display "Visit surroundings" button
        b = new DOMElement({
          tagName: "button",
          classes: "text-xs grow p-2 button border border-gray-400 bg-gray-800",
          parentElement: p.getNode(),
          id: "visit_surroundings"
        })
        i = new DOMElement({
          tagName: "i",
          classes: "fa fa-location-arrow me-2",
          parentElement: b.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n", "value":""}],
          parentElement: b.getNode(),
          text: translate(language, "Visit surroundings")
        })
        b.getNode().addEventListener("click", (e) => {
          //Expand expeditions accordion and automatically close colony accordion
          document.querySelector("#accordion-menu-expeditions button").click()
        })
        */
      }
      //Display "Abandon colony" button
      b = new DOMElement({
        tagName: "button",
        classes: "text-xs grow p-2 button border border-gray-400 bg-red-800",
        parentElement: p.getNode(),
        id: "abandon_colony"
      })
      i = new DOMElement({
        tagName: "i",
        classes: "fa fa-door-closed me-2",
        parentElement: b.getNode()
      })
      s = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n", "value":""}],
        parentElement: b.getNode(),
        text: translate(language, "Abandon colony")
      })
      b.getNode().addEventListener("click", (e) => {
        let data = {
          "paragraphs":[
            "You are about to reset all life progress in your colony!", 
            "This means that after resetting current progress, all previous progress will be deleted.", 
            "If you are decided to restart your game choose 'Ok', otherwise choose 'Cancel'."
          ],
          "buttons":[
            {"text": "Ok"}, {"text": "Cancel", "handler": (e) => {p_modal.close()}}
          ]
        }
        data.buttons[0].handler = (e) => {
          p_modal.close()
        }
        let p_modal = new ModalBox(e.target, "modalProgress", null, data)
        p_modal.build("progress")
        p_modal.show()
      })
    }
    //Build colony stats accordion
    let d = new DOMElement({
      tagName: "div",
      classes: "w-100",
      parentElement: colony_div, 
      id: "accordion-colony-available-actions"
    })
    //Build colony available actions accordion header
    let d1 = new DOMElement({
        tagName: "div",
        classes: "w-100 border border-gray-800 bg-gray-800 text-xs",
        attributes: [{"key":"data-body", "value":"accordion-colony-available-actions-body"}, {"key":"data-group", "value":"colony-accordions"}],
        id: "accordion-colony-available-actions-title",
        parentElement: d.getNode()
    })
    let p = new DOMElement({
        tagName: "p",
        classes: "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200",
        parentElement: d1.getNode()
    })
    let s = new DOMElement({
      tagName: "span",
      classes: "",
      parentElement: p.getNode()
    })
    let s1 = new DOMElement({
      tagName: "span", 
      attributes: [{"key":"data-i18n","value":""}], 
      parentElement: s.getNode(),
      text: translate(language, translate(language, "Actions available"))
    })
    let i = new DOMElement({
      tagName: "i",
      classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
      parentElement: p.getNode(),
    })
    //Build colony available actions accordion body
    let d2 = new DOMElement({
        tagName: "div", 
        classes: "hidden w-100 flex flex-wrap gap-1 p-1 text-xs text-gray-200 border border-gray-800 bg-gray-500", 
        attributes: [{"key":"aria-labelledby","value":`accordion-colony-available-actions-title`}], 
        parentElement: d.getNode(), 
        id: `accordion-colony-available-actions-body`
    })
    let ga = new GenerativeAccordion({title_id: `accordion-colony-available-actions-title`, callback: draw_content, parms: d2 })
    colony.active_accordion = ga
  }
  draw_colony_population = () => {
    if(document.querySelector("#colony-population")){
      document.querySelector("#colony-population").innerText = this.population.toString()
    }
  }
  draw_colony = () => {
    let parent_div = document.getElementById("accordion-menu")
    //Build colony accordion header
    let h2 = new DOMElement({
      tagName: "h2", 
      classes: "mt-3", 
      parentElement: parent_div, 
      id: "accordion-menu-colony"
    })
    let b = new DOMElement({
      tagName: "button", 
      classes: "flex items-center justify-between w-full py-2 px-3 font-medium bg-gray-900 border border-gray-700 text-gray-400 gap-3", 
      attributes: [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-colony-body"},
                  {"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-colony-body"}], 
      parentElement: h2.getNode()
    })
    let s = new DOMElement({
      tagName: "span", 
      classes: "flex items-center gap-2", 
      parentElement: b.getNode()
    })
    let i = new DOMElement({
      tagName: "i", 
      classes: "hidden text-xs fa fa-beat fa-exclamation p-1 px-2 bg-red-900 text-white border border-white rounded", 
      parentElement: s.getNode(), 
      id: "accordion-menu-colony-icon"
    })
    let s1 = new DOMElement({
      tagName: "span", 
      attributes: [{"key":"data-i18n","value":""}], 
      parentElement: s.getNode(),
      text: translate(language, "Colony")
    })
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build colony accordion body
    let d = new DOMElement({
      tagName: "div", 
      classes: "hidden", 
      attributes: [{"key":"aria-labelledby","value":"accordion-menu-colony"}], 
      parentElement: parent_div, 
      id: "accordion-menu-colony-body"
    })
    let div1 = new DOMElement({
      tagName: "div", 
      classes: "flex flex-wrap gap-1 p-1 border border-gray-700 bg-gray-700", 
      parentElement: d.getNode()
    })
    //First panel
    this.draw_colony_name(div1.getNode())
    //Second panel
    this.draw_colony_stats(div1.getNode())
    //Third panel
    this.draw_colony_vital_resources(div1.getNode())
    //Forth panel
    this.draw_colony_stock(div1.getNode())
    //Fifth panel
    this.draw_colony_available_actions(div1.getNode())
    //Check critical levels once colony is drawn (only makes sense if progress has already been saved)
    this.check_colony_critical_levels()
  }
  check_colony_critical_levels = (indicator = "all") => {
    if(indicator == "all" || indicator == "life quality"){
      //Check if life quality is below critical level.
      let mood = this.get_colony_satisfaction()
      //Check colony criticity due to life quality and shelter capacity.
      if(mood.level < 2 || (mood.shelter_level < 2 && this.time_started)){
        document.getElementById("accordion-menu-colony-icon").classList.remove("hidden")
        if(document.getElementById("colony-life-quality-critical-icon")){
          if(mood.level < 2){
            document.getElementById("colony-life-quality-critical-icon").classList.remove("hidden")
          } else {
            document.getElementById("colony-life-quality-critical-icon").classList.add("hidden")
          }
        }
        //Check colony criticity due to shelter capacity.
        if(document.getElementById("colony-shelter-capacity-critical-icon")){
          if(mood.shelter_level < 2 && this.time_started){
            document.getElementById("colony-shelter-capacity-critical-icon").classList.remove("hidden")
          } else {
            document.getElementById("colony-shelter-capacity-critical-icon").classList.add("hidden")
          }
        }
      } else {
        document.getElementById("accordion-menu-colony-icon").classList.add("hidden")
        if(document.getElementById("colony-life-quality-critical-icon")){
          document.getElementById("colony-life-quality-critical-icon").classList.add("hidden")
        }
        if(document.getElementById("colony-shelter-capacity-critical-icon")){
          document.getElementById("colony-shelter-capacity-critical-icon").classList.add("hidden")
        }
      }
    }
    if(indicator == "all" || indicator == "vital resources"){
      let current_water_daily_consumption = this.population * Citizen.daily_water_needs
      let current_food_daily_consumption = this.population * Citizen.daily_food_needs
      let current_water_daily_income = this.income.water//this.get_stock({type: "buildingParts", good: "well"}) * Colony.well_water_income + this.get_population({status: "idle"}) * Colony.daily_idle_citizen_water_income
      let current_food_daily_income = this.income.food//this.get_population({status: "idle"}) * Colony.daily_idle_citizen_food_income
      let current_water_daily_revenue = current_water_daily_income - current_water_daily_consumption
      let current_food_daily_revenue = current_food_daily_income - current_food_daily_consumption
      //Check colony criticity due to vital resources.
      //Water criticity
      let water_crisis = current_water_daily_revenue < 0 && this.time_started
      let water_crisis_icon_class = water_crisis ? "" : "hidden"
      let water_crisis_class = current_water_daily_revenue > 0 ? "bg-green-700" : (water_crisis ? "bg-red-800" : "bg-yellow-600")
      if(document.querySelector("#accordion-water-consumption-icon") && water_crisis_icon_class){
        document.querySelector("#accordion-water-consumption-icon").classList.add(water_crisis_icon_class)
      }
      if(document.querySelector("#colony-water-consumption") && water_crisis_class){
        document.querySelector("#colony-water-consumption").parentElement.classList.remove("bg-green-700", "bg-yellow-600", "bg-red-800")
        document.querySelector("#colony-water-consumption").parentElement.classList.add(water_crisis_class)
      }
      if(document.querySelector("#accordion-water-income-icon") && water_crisis_icon_class){
        document.querySelector("#accordion-water-income-icon").classList.add(water_crisis_icon_class)
      }
      if(document.querySelector("#colony-water-income") && water_crisis_class){
        document.querySelector("#colony-water-income").parentElement.classList.remove("bg-green-700", "bg-yellow-600", "bg-red-800")
        document.querySelector("#colony-water-income").parentElement.classList.add(water_crisis_class)
      }
      if(document.querySelector("#accordion-water-stock-icon") && water_crisis_icon_class){
        document.querySelector("#accordion-water-stock-icon").classList.add(water_crisis_icon_class)
      }
      if(document.querySelector("#colony-water-stock") && water_crisis_class){
        document.querySelector("#colony-water-stock").parentElement.classList.remove("bg-green-700", "bg-yellow-600", "bg-red-800")
        document.querySelector("#colony-water-stock").parentElement.classList.add(water_crisis_class)
      }
      //Food criticity
      let food_crisis = current_food_daily_revenue < 0 && this.time_started
      let food_crisis_icon_class = food_crisis ? "" : "hidden"
      let food_crisis_class = current_food_daily_revenue > 0 ? "bg-green-700" : (food_crisis ? "bg-red-800" : "bg-yellow-600")
      if(document.querySelector("#accordion-food-consumption-icon") && food_crisis_icon_class){
        document.querySelector("#accordion-food-consumption-icon").classList.add(food_crisis_icon_class)
      }
      if(document.querySelector("#colony-food-consumption") && food_crisis_class){
        document.querySelector("#colony-food-consumption").parentElement.classList.remove("bg-green-700", "bg-yellow-600", "bg-red-800")
        document.querySelector("#colony-food-consumption").parentElement.classList.add(food_crisis_class)
      }
      if(document.querySelector("#accordion-food-income-icon") && food_crisis_icon_class){
        document.querySelector("#colony-food-income").parentElement.classList.remove("bg-green-700", "bg-yellow-600", "bg-red-800")
        document.querySelector("#accordion-food-income-icon").classList.add(food_crisis_icon_class)
      }
      if(document.querySelector("#colony-food-income") && food_crisis_class){
        document.querySelector("#colony-food-income").parentElement.classList.add(food_crisis_class)
      }
      if(document.querySelector("#accordion-food-stock-icon") && food_crisis_icon_class){
        document.querySelector("#accordion-food-stock-icon").classList.add(food_crisis_icon_class)
      }
      if(document.querySelector("#colony-food-stock") && food_crisis_class){
        document.querySelector("#colony-food-stock").parentElement.classList.remove("bg-green-700", "bg-yellow-600", "bg-red-800")
        document.querySelector("#colony-food-stock").parentElement.classList.add(food_crisis_class)
      }
      //If critical icon was displayed, do the same with Colony accordion critical icon.
      if(water_crisis || food_crisis){
        document.getElementById("accordion-menu-colony-icon").classList.remove("hidden")
      } else {
        document.getElementById("accordion-menu-colony-icon").classList.add("hidden")
      }
    }
  }
  //News.
  draw_news = () => {
    let parent_div = document.getElementById("accordion-menu")
    let h2 = new DOMElement({
      tagName: "h2", 
      classes: "mt-3", 
      parentElement: parent_div, 
      id: "accordion-menu-recent-news-title"
    })
    let b = new DOMElement({
      tagName: "button", 
      classes: "flex items-center justify-between w-full py-2 px-3 text-gray-400 bg-gray-900 font-medium border border-gray-700 gap-3", 
      attributes: [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-recent-news-body"},
                  {"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-recent-news-body"}], 
      parentElement: h2.getNode()
    })
    let s = new DOMElement({
      tagName: "span", 
      classes: "flex items-center gap-2", 
      parentElement: b.getNode()
    })
    let s1 = new DOMElement({
      tagName: "span", 
      classes: "text-xs hidden unread-notification fa fa-beat font-medium me-1 px-2 py-1 rounded-sm bg-blue-900 text-blue-300", 
      parentElement: s.getNode(),
      id: "news_notifications"
    })
    s1 = new DOMElement({
      tagName: "span", 
      attributes: [{"key":"data-i18n","value":""}], 
      parentElement: s.getNode(),
      text: translate(language, "Recent news")
    })
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build colony accordion body
    let d = new DOMElement({
      tagName: "div", 
      classes: "p-1 flex flex-wrap gap-1 bg-gray-500 border border-gray-900 hidden", 
      attributes: [{"key":"aria-labelledby","value":"accordion-menu-recent-news-title"}], 
      parentElement: parent_div, 
      id: "accordion-menu-recent-news-body"
    })
  }
  draw_news_message = (news_message) => {
    let parent_elem = document.getElementById("accordion-menu-recent-news-body")
    let news_message_index = document.querySelectorAll("#accordion-menu-recent-news-body div").length + 1
    let news_notifications_icon = document.getElementById("news_notifications")
    let notifications_unread = Number(news_notifications_icon.innerText) || 0
    let title_color = news_message.category == "danger" ? "text-red-600" : (news_message.category == "enhancement" ? "text-green-600" : "text-white")
    let d0, d1, p, s, s1, i
    const draw_content = (d1) => {
      d = new DOMElement({
        tagName: "div",
        classes: "w-100 p-2 border border-gray-800 bg-gray-600 text-xs",
        parentElement: d1.getNode(),
        html: news_message.news_content
      })
      translate_from_node(language, d.getNode())
      //After clicking the news message accordion (and having allowed player to see message details), it is not a new message anymore.
      this.news.get(news_message.id).new = false
    }
    //Update visibility and text of news notifications icon
    news_notifications_icon.innerText = (notifications_unread + 1).toString()
    news_notifications_icon.classList.remove("hidden")
    
    //Build message #news_message_index accordion div
    d0 = new DOMElement({
      tagName: "div",
      classes: "w-100",
      parentElement: parent_elem,
      id: `accordion-recent-news-${news_message_index}`,
      first_child: true
    })
    //Build message #news_message_index accordion header
    d1 = new DOMElement({
      tagName: "div",
      classes: "w-100 border border-gray-800 bg-gray-800 text-xs",
      attributes: [{"key":"data-body", "value":`accordion-recent-news-${news_message_index}-body`}, {"key":"data-group", "value":"news-accordions"}],
      id: `accordion-recent-news-${news_message_index}-title`,
      parentElement: d0.getNode()
    })
    p = new DOMElement({
      tagName: "p",
      classes: "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200",
      parentElement: d1.getNode()
    })
    s = new DOMElement({
      tagName: "span",
      classes: "",
      parentElement: p.getNode()
    })
    s1 = new DOMElement({
      tagName: "span",
      classes: "new text-xs px-1 py-0 font-bold rounded-sm bg-blue-900 text-blue-300 me-3",
      attributes: [{"key":"gender","value":"f"}, {"key":"data-i18n","value":""}],
      parentElement: s.getNode(),
      text: translate(language, "NEW", "f")
    })
    //Message date year
    s1 = new DOMElement({
      tagName: "span",
      classes: "me-1",
      attributes: [{"key":"data-i18n","value":""}],
      parentElement: s.getNode(),
      text: translate(language, "Year", "", "capitalized")
    })
    s1 = new DOMElement({
      tagName: "span",
      classes: "font-bold year",
      parentElement: s.getNode(),
      text: news_message.date.year.toString()
    })
    s1 = new DOMElement({
      tagName: "span",
      parentElement: s.getNode(),
      text: ", "
    })
    //Message date week
    s1 = new DOMElement({
      tagName: "span",
      classes: "me-1",
      attributes: [{"key":"data-i18n","value":""}],
      parentElement: s.getNode(),
      text: translate(language, "Week", "", "capitalized")
    })
    s1 = new DOMElement({
      tagName: "span",
      classes: "font-bold week",
      parentElement: s.getNode(),
      text: news_message.date.week.toString()
    })
    s1 = new DOMElement({
      tagName: "span",
      parentElement: s.getNode(),
      text: ", "
    })
    //Message date day
    s1 = new DOMElement({
      tagName: "span",
      classes: "me-1",
      attributes: [{"key":"data-i18n","value":""}],
      parentElement: s.getNode(),
      text: translate(language, "Day", "", "capitalized")
    })
    s1 = new DOMElement({
      tagName: "span",
      classes: "font-bold day me-1",
      parentElement: s.getNode(),
      text: news_message.date.day.toString()
    })
    //Message date hour
    s1 = new DOMElement({
      tagName: "span",
      parentElement: s.getNode(),
      text: "("
    })
    s1 = new DOMElement({
      tagName: "span",
      classes: "font-bold hour",
      parentElement: s.getNode(),
      text: news_message.date.hour.toString().padStart(2, "0")
    })
    s1 = new DOMElement({
      tagName: "span",
      parentElement: s.getNode(),
      text: "hs.)"
    })
    i = new DOMElement({
      tagName: "i",
      classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
      parentElement: p.getNode(),
    })
    //Notification title
    s1 = new DOMElement({
      tagName: "span",
      classes: "font-bold mx-1",
      parentElement: s.getNode(),
      text: " - "
    })
    s1 = new DOMElement({
      tagName: "span",
      classes: `font-bold uppercase ${title_color}`,
      attributes: [{"key":"data-i18n","value":""}],
      parentElement: s.getNode(),
      text: translate(language, news_message.title)
    })
    //Build notification #newsIndex accordion body
    d1 = new DOMElement({
        tagName: "div", 
        classes: "hidden w-100 flex flex-wrap gap-1 p-1 text-xs text-gray-200 border border-gray-800 bg-gray-500", 
        attributes: [{"key":"aria-labelledby","value":`accordion-recent-news-${news_message_index}-title`}], 
        parentElement: d0.getNode(), 
        id: `accordion-recent-news-${news_message_index}-body`
    })

    let ga = new GenerativeAccordion({title_id: `accordion-recent-news-${news_message_index}-title`, callback: draw_content, parms: d1 })

  }
  draw_citizens = () => {
    //Build citizens accordion
    let parentElem = document.getElementById("accordion-menu")
    //Build citizens accordion header
    let h2 = new DOMElement({
      tagName: "h2", 
      classes: "mt-3", 
      parentElement: parentElem, 
      id: "accordion-menu-citizens"
    })
    let b = new DOMElement({
      tagName: "button", 
      classes: "flex items-center font-medium justify-between w-full py-2 px-3 bg-gray-900 border border-gray-700 text-gray-400 gap-3", 
      attributes: [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-citizens-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-citizens-body"}], 
      parentElement: h2.getNode()
    })
    let s = new DOMElement({
      tagName: "span", 
      attributes: [{"key":"data-i18n","value":""}], 
      parentElement: b.getNode(),
      text: "Citizens"
    })
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build citizens accordion body
    let d1 = new DOMElement({
      tagName: "div", 
      classes: "hidden", 
      attributes: [{"key":"aria-labelledby","value":"accordion-menu-citizens"}], 
      parentElement: parentElem, 
      id: "accordion-menu-citizens-body"
    })
    let d2 = new DOMElement({
      tagName: "div", 
      classes: "py-1 border border-gray-700 bg-gray-700", 
      parentElement: d1.getNode()
    })
    let d = new DOMElement({
      tagName: "div", 
      classes: "flex flex-wrap gap-1 mx-1", 
      attributes: [{"key":"data-accordion","value":"collapse"}], 
      parentElement: d2.getNode(), 
      id: "accordion-citizens"
    })
    //Game has just began? => create initial citizens.
    if(!this.last_progress_saved){
      //First login, create initial citizens.
      this.citizens.forEach(citizen => {
        citizen.draw({"parentElement":document.getElementById("accordion-citizens")})
      })
    } else {
      //TODO: Load citizens from saved progress.
    }
    //Update colony vital resources
    this.income.water = this.get_population({status: "idle"}) * Colony.daily_idle_citizen_water_income
    this.income.food = this.get_population({status: "idle"}) * Colony.daily_idle_citizen_food_income
  }
  draw_relationships = () => {
    //Build relationships accordion
    let h2, b, s, d1, d2
    let parent_elem = document.getElementById("accordion-menu")
    //Build relationships accordion header
    h2 = new DOMElement({
      tagName: "h2", 
      classes: "mt-3", 
      parentElement: parent_elem, 
      id: "accordion-menu-relationships"
    })
    b = new DOMElement({
      tagName: "button", 
      classes: "flex items-center justify-between w-full py-2 px-3 font-medium bg-gray-900 border border-gray-700 text-gray-400 gap-3", 
      attributes: [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-relationships-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-relationships-body"}], 
      parentElement: h2.getNode()
    })
    s = new DOMElement({
      tagName: "span", 
      attributes: [{"key":"data-i18n","value":""}], 
      parentElement: b.getNode(),
      text: "Relationships"
    })
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build relationships accordion body
    d1 = new DOMElement({
      tagName: "div", 
      classes: "hidden", 
      attributes: [{"key":"aria-labelledby","value":"accordion-menu-relationships"}], 
      parentElement: parent_elem, 
      id: "accordion-menu-relationships-body"
    })
    //Relationships area
    d2 = new DOMElement({
      tagName: "div", 
      classes: "flex flex-wrap gap-1 p-1 border border-gray-200 border-gray-700 bg-gray-500", 
      parentElement: d1.getNode(), 
      id: "couple-relationships"
    })
    if(this.couples.length > 0){
      this.couples.forEach((couple_relationship) => {
        couple_relationship.draw()
      })
    } else {
      this.draw_no_relationships()
    }
  }
  //Show "No relationships" paragraph.
  draw_no_relationships = () => {
    let p, s, i, s1
    let relationships_div = document.querySelector("#couple-relationships")
    relationships_div.innerHTML = ""  //Clear previous content
    p = new DOMElement({
      tagName: "p", 
      classes: "empty m-1 text-xs flex w-100 justify-between gap-2 px-1 text-white", 
      parentElement: relationships_div
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
      attributes: [{"key":"data-i18n", "value":""}, {"key":"gender", "value":"f"}], 
      parentElement: s.getNode(),
      text: translate(language, "Not defined (Make couples in Citizen's panel)")
    })
  }
  draw_landforms = () => {
    let h2, b, s, d1, d2, d
    let parent_elem = document.getElementById("accordion-menu")
    //Build landforms accordion header
    h2 = new DOMElement({
      tagName: "h2", 
      classes: "mt-3", 
      parentElement: parent_elem, 
      id: "accordion-menu-landforms-title"
    })
    b = new DOMElement({
      tagName: "button", 
      classes: "flex items-center justify-between w-full py-2 px-3 font-medium bg-gray-900 border border-gray-700 text-gray-400 gap-3", 
      attributes: [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-landforms-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-landforms-body"}], 
      parentElement: h2.getNode()
    })
    s = new DOMElement({
      tagName: "span", 
      attributes: [{"key":"data-i18n","value":""}], 
      parentElement: b.getNode(),
      text: "Landforms"
    })
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build landforms accordion body
    d1 = new DOMElement({
      tagName: "div", 
      classes: "hidden", 
      attributes: [{"key":"aria-labelledby","value":"accordion-menu-landforms-title"}], 
      parentElement: parent_elem, 
      id: "accordion-menu-landforms-body"
    })
    //Landforms area
    d2 = new DOMElement({
      tagName: "div", 
      classes: "flex flex-wrap gap-1 p-1 border border-gray-200 border-gray-700 bg-gray-500", 
      parentElement: d1.getNode()
    })
    d = new DOMElement({
      tagName: "div", 
      classes: "w-100 flex flex-wrap gap-1", 
      attributes: [{"key":"data-accordion","value":"collapse"}], 
      parentElement: d2.getNode(),
      id: "accordion-landforms"
    })
    //Game has just began? => create initial landform.
    if(!this.last_progress_saved){
      //First login, default landform is the only water reservoir provided to the colony.
      let landform_template = {"name": translate(language, "Initial water reservoir"), "category": "waterReservoir"}
      let new_landform = new Landform(landform_template)
      this.add_landform(new_landform)
      new_landform.draw()
    } else {
      //TODO: Load citizens from saved progress.
      this.colony.landforms.forEach(landform => {})
    }
    //this.draw_no_landforms()
  }
  draw_no_landforms = () => {
    let landforms_div = document.querySelector("#accordion-landforms")
    landforms_div.innerHTML = ""  //Clear previous content
    p = new DOMElement({
      tagName: "p", 
      classes: "empty m-1 text-xs flex w-100 justify-between gap-2 px-1 text-white", 
      parentElement: landforms_div
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
      attributes: [{"key":"data-i18n", "value":""}, {"key":"gender", "value":"m"}], 
      parentElement: s.getNode(),
      text: translate(language, "None")
    })
  }
  draw_buildings_list = (parent_elem) => {
    let d0, d1, p, s, s1, i, ga
    const draw_building_subtype = (type, subtype) => {
      let formated_type = type.replaceAll(' ', '-')
      let formated_subtype = subtype.replaceAll(' ', '-')
      const draw_content_subtype = (d1) => {
        let p, s, s1, s2
        let type = d1.getNode().dataset.type
        let formated_type = type.replaceAll(' ', '-')
        let subtype = d1.getNode().dataset.subtype
        let formated_subtype = subtype.replaceAll(' ', '-')
        const draw_building = (building) => {
          const draw_content_building = (d1) => {
            let d, p, s, s1, s2
            let building_id = Number(d1.getNode().dataset.buildingId)
            let a_building = this.buildings.get(building_id)
            //After clicking the building accordion (and having allowed player to see building details), it is not a new building anymore.
            a_building.new = false
            p = new DOMElement({
              tagName: "p",
              classes: "w-100 flex gap-1 p-0 text-xs text-gray-200",
              parentElement: d1.getNode(),
            })
            s = new DOMElement({
              tagName: "span",
              classes: "flex",
              parentElement: p.getNode(),
            })
            s1 = new DOMElement({
              tagName: "span",
              classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white",
              parentElement: s.getNode(),
            })
            s2 = new DOMElement({
              tagName: "span",
              attributes: [{"key":"data-i18n","value":""}, {"key":"gender","value":"f"}],
              parentElement: s1.getNode(),
              text: translate(language, "Constructed in", "f")
            })
            s2 = new DOMElement({
              tagName: "span",
              parentElement: s1.getNode(),
              text: ":"
            })
            s = new DOMElement({
              tagName: "span",
              classes: "flex border border-gray-900 p-0.5 px-1 bg-gray-400 text-gray-900",
              parentElement: p.getNode(),
            })
            //Year
            s1 = new DOMElement({
              tagName: "span",
              classes: "flex-none",
              attributes: [{"key":"data-i18n","value":""}],
              parentElement: s.getNode(),
              text: translate(language, "Year")
            })
            s1 = new DOMElement({
              tagName: "span",
              classes: "font-bold flex-none ms-1",
              parentElement: s.getNode(),
              id: `accordion-buildings-list-${d1.getNode().dataset.type}-${d1.getNode().dataset.subtype}-${building_id}-built-year`,
              text: a_building.date_built.year.toString()
            })
            //Week
            s1 = new DOMElement({
              tagName: "span",
              classes: "flex-none ms-1",
              attributes: [{"key":"data-i18n","value":""}],
              parentElement: s.getNode(),
              text: translate(language, "Week")
            })
            s1 = new DOMElement({
              tagName: "span",
              classes: "font-bold flex-none ms-1",
              parentElement: s.getNode(),
              id: `accordion-buildings-list-${d1.getNode().dataset.type}-${d1.getNode().dataset.subtype}-${building_id}-built-week`,
              text: a_building.date_built.week.toString()
            })
            //Day
            s1 = new DOMElement({
              tagName: "span",
              classes: "flex-none ms-1",
              attributes: [{"key":"data-i18n","value":""}],
              parentElement: s.getNode(),
              text: translate(language, "Day")
            })
            s1 = new DOMElement({
              tagName: "span",
              classes: "font-bold flex-none ms-1",
              parentElement: s.getNode(),
              id: `accordion-buildings-list-${d1.getNode().dataset.type}-${d1.getNode().dataset.subtype}-${building_id}-built-day`,
              text: a_building.date_built.day.toString()
            })
            //Hour
            s1 = new DOMElement({
              tagName: "span",
              classes: "font-bold flex-none ms-1",
              parentElement: s.getNode(),
              id: `accordion-buildings-list-${d1.getNode().dataset.type}-${d1.getNode().dataset.subtype}-${building_id}-built-hour`,
              text: a_building.date_built.hour.toString().padStart(2, "0")
            })
            s1 = new DOMElement({
              tagName: "span",
              classes: "flex-none ms-1",
              parentElement: s.getNode(),
              text: "hs."
            })
            //Fire hazard
            p = new DOMElement({
              tagName: "p",
              classes: "w-100 flex gap-1 p-0 text-xs text-gray-200",
              parentElement: d1.getNode(),
            })
            s = new DOMElement({
              tagName: "span",
              classes: "font-bold p-0.5 px-1 grow bg-red-700 border border-gray-700 text-white",
              id: `accordion-buildings-list-${d1.getNode().dataset.type}-${d1.getNode().dataset.subtype}-${building_id}-risks`,
              parentElement: p.getNode(),
            })
            s1 = new DOMElement({
              tagName: "span",
              classes: "flex-none",
              attributes: [{"key":"data-i18n","value":""}],
              parentElement: s.getNode(),
              text: translate(language, "Fire hazard")
            })
            s1 = new DOMElement({
              tagName: "span",
              classes: "flex-none",
              parentElement: s.getNode(),
              text: ":"
            })
            let building_category_type = ["shelter", "mount", "production", "training", "exchange"].includes(a_building.type) ? `${a_building.type}_related` : ""
            let building_subtype = a_building.subtype.replaceAll(" ", "_")
            let building_fire_hazard = Building.category[building_category_type][building_subtype].risk["fire hazard"] * 100
            building_fire_hazard = building_fire_hazard ? building_fire_hazard+"%" : translate(language, "Unknown")
            s1 = new DOMElement({
              tagName: "span",
              classes: "flex-none ms-1",
              parentElement: s.getNode(),
              text: building_fire_hazard
            })
            //Status & integrity
            p = new DOMElement({
              tagName: "p",
              classes: "w-100 flex gap-1 p-0 text-xs text-gray-200",
              parentElement: d1.getNode(),
            })
            s = new DOMElement({
              tagName: "span",
              classes: "flex",
              parentElement: p.getNode(),
            })
            s1 = new DOMElement({
              tagName: "span",
              classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white",
              parentElement: s.getNode(),
            })
            s2 = new DOMElement({
              tagName: "span",
              attributes: [{"key":"data-i18n","value":""}],
              parentElement: s1.getNode(),
              text: translate(language, "Status")
            })
            s2 = new DOMElement({
              tagName: "span",
              parentElement: s1.getNode(),
              text: ":"
            })
            s = new DOMElement({
              tagName: "span",
              classes: "flex border border-gray-900 p-0.5 px-1 bg-gray-400 text-gray-900",
              parentElement: p.getNode(),
            })
            s1 = new DOMElement({
              tagName: "span",
              classes: "font-bold",
              attributes: [{"key":"data-i18n","value":""}],
              parentElement: s.getNode(),
              text: translate(language, a_building.state, "f", "capitalized")
            })
            s = new DOMElement({
              tagName: "span",
              classes: "grow flex border border-gray-900 p-0.5 px-1 bg-gray-700 text-white",
              parentElement: p.getNode(),
            })
            s1 = new DOMElement({
              tagName: "span",
              attributes: [{"key":"data-i18n","value":""}],
              parentElement: s.getNode(),
              text: translate(language, "Integrity")
            })
            s1 = new DOMElement({
              tagName: "span",
              classes: "flex-none",
              parentElement: s.getNode(),
              text: ":"
            })
            s = new DOMElement({
              tagName: "span",
              classes: "grow flex border border-gray-900 p-0.5 px-1 bg-gray-400 text-gray-900",
              parentElement: p.getNode(),
            })
            s1 = new DOMElement({
              tagName: "span",
              classes: "flex-none font-bold",
              parentElement: s.getNode(),
              text: a_building.integrity.toString()+"%"
            })
            //Capacity
            p = new DOMElement({
              tagName: "p",
              classes: "w-100 flex gap-1 p-0 text-xs text-gray-200",
              parentElement: d1.getNode(),
            })
            s = new DOMElement({
              tagName: "span",
              classes: "flex border border-gray-900 p-0.5 px-1 bg-gray-700 text-white",
              parentElement: p.getNode(),
            })
            let building_capacity_text = ["shelter", "mount"].includes(a_building.type) 
                                                              ? a_building.type + " capacity"
                                                              : ["production", "training", "exchange"].includes(a_building.type) ? `${a_building.type} building capacity` : "unknown"
            s1 = new DOMElement({
              tagName: "span",
              attributes: [{"key":"data-i18n","value":""}],
              parentElement: s.getNode(),
              text: translate(language, building_capacity_text)
            })
            s1 = new DOMElement({
              tagName: "span",
              classes: "flex-none",
              parentElement: s.getNode(),
              text: ":"
            })
            s = new DOMElement({
              tagName: "span",
              classes: "grow flex border border-gray-900 p-0.5 px-1 bg-gray-400 text-gray-900",
              parentElement: p.getNode(),
            })
            s1 = new DOMElement({
              tagName: "span",
              classes: "flex-none font-bold ms-1",
              parentElement: s.getNode(),
              text: building.capacity.toString()
            })
            s1 = new DOMElement({
              tagName: "span",
              classes: "ms-1",
              attributes: [{"key":"data-i18n","value":""}],
              parentElement: s.getNode(),
              text: translate(language, "citizens")
            })
            /*
              <div id="" class="flex flex-wrap gap-1 p-1 border border-gray-800 bg-gray-600 text-xs">
                <p id="" class="w-100 flex gap-1 p-0 text-xs text-gray-200">
                  <span id="" class="flex">
                    <span id="" class="w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white">
                      <span id="" data-i18n="" class="">Capacidad de albergue</span>: 
                    </span>
                  </span>
                  <span id="" class="grow flex border border-gray-900 p-0.5 px-1 bg-gray-400 text-gray-900">
                    <span id="building-group-shelter_related-building-campaign_tent-1-capacity" class="font-bold flex-none">3</span>
                    <span id="" data-i18n="" class="ms-1">Habitantes</span>
                  </span>
                </p>
              </div>
            */
          }
          //Draw building accordion container
          let d0, d1, p, s, s1, i, ga
          let parent_elem = document.getElementById(`accordion-buildings-list-${formated_type}-${formated_subtype}-body`)
          d0 = new DOMElement({
            tagName: "div",
            classes: "w-100",
            parentElement: parent_elem,
            id: `accordion-buildings-list-${formated_type}-${formated_subtype}-${building.id}`
          })
          //Draw building accordion header
          d1 = new DOMElement({
            tagName: "div",
            classes: "w-100 border border-gray-800 bg-gray-800 text-xs",
            attributes: [{"key":"data-body", "value":`accordion-buildings-list-${formated_type}-${formated_subtype}-${building.id}-body`}, {"key":"data-group", "value":"news-accordions-subtype-buildings"}],
            id: `accordion-buildings-list-${formated_type}-${formated_subtype}-${building.id}-title`,
            parentElement: d0.getNode()
          })
          p = new DOMElement({
            tagName: "p",
            classes: "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200",
            parentElement: d1.getNode()
          })
          s = new DOMElement({
            tagName: "span",
            classes: "",
            parentElement: p.getNode()
          })
          s1 = new DOMElement({
            tagName: "span",
            classes: `new ${building.new ? "" : "hidden"} text-xs px-1 py-0 font-bold rounded-sm bg-blue-900 text-blue-300 me-1`,
            parentElement: s.getNode(),
            text: translate(language, "new", "f")
          })
          //Update notifications unread in tree ancestors.
          let new_notification_span = s1.getNode()
          i = new DOMElement({
            tagName: "i",
            classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
            parentElement: p.getNode(),
          })
          s1 = new DOMElement({
            tagName: "span",
            classes: "text-xs px-1 py-0 font-bold rounded-sm",
            attributes: [{"key":"data-i18n","value":""}],
            parentElement: s.getNode(),
            text: translate(language, building.subtype, "", "capitalized")
          })
          s1 = new DOMElement({
            tagName: "span",
            classes: "text-xs px-1 py-0 font-bold rounded-sm",
            parentElement: s.getNode(),
            text: `${building.id}`
          })

          //Draw building accordion body
          d1 = new DOMElement({
              tagName: "div", 
              classes: "hidden w-100 flex flex-wrap gap-1 p-1 text-xs text-gray-200 border border-gray-800 bg-gray-500", 
              attributes: [{"key":"data-building-id", "value":building.id},
                           {"key":"data-type", "value":formated_type}, {"key":"data-subtype", "value":formated_subtype},
                           {"key":"aria-labelledby","value":`accordion-buildings-list-${formated_type}-${formated_subtype}-${building.id}-title`}], 
              parentElement: d0.getNode(), 
              id: `accordion-buildings-list-${formated_type}-${formated_subtype}-${building.id}-body`
          })
          ga = new GenerativeAccordion({title_id: `accordion-buildings-list-${formated_type}-${formated_subtype}-${building.id}-title`, callback: draw_content_building, parms: d1 })
        }
        p = new DOMElement({
          tagName: "p",
          classes: "w-100 flex gap-1 p-0 text-xs text-gray-200",
          parentElement: d1.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          classes: "flex",
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white",
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: s1.getNode(),
          text: translate(language, "Total shelter capacity")
        })
        s2 = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(),
          text: ":"
        })
        s1 = new DOMElement({
          tagName: "span",
          classes: "grow flex gap-1 border border-gray-800 p-0.5 px-1 bg-gray-300 text-gray-800",
          parentElement: p.getNode()
        })
        s2 = new DOMElement({
          tagName: "span",
          classes: "font-bold",
          id: `accordion-buildings-list-${formated_type}-${formated_subtype}-capacity`,
          parentElement: s1.getNode(),
          text: this.get_shelter_capacity(subtype).toString()
        })
        s2 = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(),
          id: `accordion-buildings-list-${type}-${subtype}-capacity-unit`,
          text: translate(language, "citizens")
        })
        //List buildings of this subtype if any
        this.get_buildings({type: type, subtype: subtype}).forEach((building) => {
          draw_building(building)
        })
      }
      //Draw building subtype accordion container
      let parent_elem = document.getElementById(`accordion-buildings-list-${formated_type}-body`)
      d0 = new DOMElement({
        tagName: "div",
        classes: "w-100",
        parentElement: parent_elem,
        id: `accordion-buildings-list-${formated_type}-${formated_subtype}`
      })
      //Draw building subtype accordion header
      d1 = new DOMElement({
        tagName: "div",
        classes: "w-100 border border-gray-800 bg-gray-800 text-xs",
        attributes: [{"key":"data-body", "value":`accordion-buildings-list-${formated_type}-${formated_subtype}-body`}, {"key":"data-group", "value":"news-accordions-buildings-subtypes"}],
        id: `accordion-buildings-list-${formated_type}-${formated_subtype}-title`,
        parentElement: d0.getNode()
      })
      p = new DOMElement({
        tagName: "p",
        classes: "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200",
        parentElement: d1.getNode()
      })
      s = new DOMElement({
        tagName: "span",
        classes: "",
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "unread-notification hidden fa fa-beat text-xs px-1 py-0 font-bold rounded-sm bg-blue-900 text-blue-300 me-1",
        parentElement: s.getNode(),
        text: "0"
      })
      if(type === "shelter" && subtype === "campaign tent"){
        //Check if there are new campaign buildings
        let new_campaign_tents = 0
        this.buildings.forEach((building) => {
          if(building.type === "shelter" && building.subtype === "campaign tent" && building.new) new_campaign_tents++
        })
        if(new_campaign_tents > 0){
          let notification_span = s1.getNode()
          notification_span.classList.remove("hidden")
          notification_span.textContent = new_campaign_tents.toString()
        }
      }
      i = new DOMElement({
        tagName: "i",
        classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
        parentElement: p.getNode(),
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "text-xs px-1 py-0 font-bold rounded-sm",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s.getNode(),
        text: translate(language, subtype+"s", "", "capitalized")
      })

      //Draw shelter related buildings list accordion body
      d1 = new DOMElement({
          tagName: "div", 
          classes: "hidden w-100 flex flex-wrap gap-1 p-1 text-xs text-gray-200 border border-gray-800 bg-gray-400", 
          attributes: [{"key":"data-type", "value":type}, {"key":"data-subtype", "value":subtype},
                       {"key":"aria-labelledby","value":`accordion-buildings-list-${formated_type}-${formated_subtype}-title`}], 
          parentElement: d0.getNode(), 
          id: `accordion-buildings-list-${formated_type}-${formated_subtype}-body`
      })
      ga = new GenerativeAccordion({title_id: `accordion-buildings-list-${formated_type}-${formated_subtype}-title`, callback: draw_content_subtype, parms: d1 })
    }
    const draw_content_shelter_related = (d1) => {
      let p, s, s1, s2
      p = new DOMElement({
        tagName: "p",
        classes: "w-100 flex gap-1 p-0 text-xs text-gray-200",
        parentElement: d1.getNode()
      })
      s = new DOMElement({
        tagName: "span",
        classes: "flex",
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white",
        parentElement: s.getNode()
      })
      s2 = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n","value":""}],
        parentElement: s1.getNode(),
        text: translate(language, "Total shelter capacity")
      })
      s2 = new DOMElement({
        tagName: "span",
        parentElement: s1.getNode(),
        text: ":"
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "grow flex gap-1 border border-gray-800 p-0.5 px-1 bg-gray-400 text-gray-800",
        parentElement: p.getNode()
      })
      s2 = new DOMElement({
        tagName: "span",
        classes: "font-bold",
        id: "building-group-shelter-total-capacity",
        parentElement: s1.getNode(),
        text: this.get_shelter_capacity().toString()
      })
      s2 = new DOMElement({
        tagName: "span",
        parentElement: s1.getNode(),
        id: "building-group-shelter-total-capacity-unit",
        text: translate(language, "citizens")
      })
      //List shelter related buildings if any
      if(this.get_buildings({type: "shelter"}).size > 0){
        if(this.get_buildings({type: "shelter", subtype: "campaign tent"}).size > 0){
          draw_building_subtype("shelter", "campaign tent")
        }
        /*draw_building_subtype("shelter", "stone house")
        draw_building_subtype("shelter", "cottage")
        draw_building_subtype("shelter", "brick house")
        draw_building_subtype("shelter", "graveyard")*/
      }
    }
    const draw_shelter_related_accordion = () => {
      //Draw shelter related buildings list accordion div
      d0 = new DOMElement({
        tagName: "div",
        classes: "w-100",
        parentElement: parent_elem,
        id: `accordion-buildings-list-shelter`
      })
      //Draw shelter related buildings list accordion header
      d1 = new DOMElement({
        tagName: "div",
        classes: "w-100 border border-gray-800 bg-gray-800 text-xs",
        attributes: [{"key":"data-body", "value":`accordion-buildings-list-shelter-body`}, {"key":"data-group", "value":"news-accordions-buildings"}],
        id: `accordion-buildings-list-shelter-title`,
        parentElement: d0.getNode()
      })
      p = new DOMElement({
        tagName: "p",
        classes: "clickable flex justify-between items-center p-1 ps-2 text-xs text-gray-200",
        parentElement: d1.getNode()
      })
      s = new DOMElement({
        tagName: "span",
        classes: "",
        parentElement: p.getNode()
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "unread-notification hidden fa fa-beat text-xs px-1 py-0 font-bold rounded-sm bg-blue-900 text-blue-300 me-1",
        parentElement: s.getNode(),
        text: "0"
      })
      //Check if there are new shelter buildings
      let new_shelters = 0
      this.buildings.forEach((building) => {
        if(building.type === "shelter" && building.new) new_shelters++
      })
      if(new_shelters > 0){
        let notification_span = s1.getNode()
        notification_span.classList.remove("hidden")
        notification_span.textContent = new_shelters.toString()
      }
      i = new DOMElement({
        tagName: "i",
        classes: "collapsable mt-0 me-2 text-sm fa fa-chevron-down font-bold",
        parentElement: p.getNode(),
      })
      s1 = new DOMElement({
        tagName: "span",
        classes: "text-xs px-1 py-0 font-bold rounded-sm",
        attributes: [{"key":"gender","value":"f"}, {"key":"data-i18n","value":""}],
        parentElement: s.getNode(),
        text: translate(language, "Shelter related", "", "capitalized")
      })

      //Draw shelter related buildings list accordion body
      d1 = new DOMElement({
          tagName: "div", 
          classes: "hidden w-100 flex flex-wrap gap-1 p-1 text-xs text-gray-200 border border-gray-800 bg-gray-500", 
          attributes: [{"key":"aria-labelledby","value":`accordion-buildings-list-shelter-title`}], 
          parentElement: d0.getNode(), 
          id: `accordion-buildings-list-shelter-body`
      })
      ga = new GenerativeAccordion({title_id: `accordion-buildings-list-shelter-title`, callback: draw_content_shelter_related, parms: d1 })
    }
    document.querySelector("#accordion-building-groups").innerHTML = ""  //Clear previous content
    //Check if there are new buildings
    let new_buildings = 0
    this.buildings.forEach((building) => {
      if(building.new) new_buildings++
    })
    if(new_buildings > 0){
      let notification_span = document.querySelector("#accordion-menu-buildings button span span.unread-notification")
      notification_span.classList.remove("hidden")
      notification_span.textContent = new_buildings.toString()
    }
    draw_shelter_related_accordion()
  }
  draw_no_buildings = () => {
    let p, s, i, s1
    let buildings_div = document.querySelector("#accordion-building-groups")
    buildings_div.innerHTML = ""  //Clear previous content
    p = new DOMElement({
      tagName: "p", 
      classes: "empty m-1 text-xs flex w-100 justify-between gap-2 px-1 text-red-400", 
      parentElement: buildings_div
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
      attributes: [{"key":"data-i18n", "value":""}, {"key":"gender", "value":"m"}], 
      parentElement: s.getNode(),
      text: translate(language, "There are no buildings in your colony!")
    })
  }
  draw_buildings = (empty = true) => {
    let h2, b, s, s1, d1, d2, d, p, i
    let parent_elem = document.getElementById("accordion-menu")
    //Draw buildings accordion header
    h2 = new DOMElement({
      tagName: "h2", 
      classes: "mt-3", 
      parentElement: parent_elem, 
      id: "accordion-menu-buildings"
    })
    b = new DOMElement({
      tagName: "button", 
      classes: "flex items-center justify-between w-full py-2 px-3 font-medium bg-gray-900 border border-gray-700 text-gray-400 gap-3", 
      attributes: [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-buildings-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-buildings-body"}], 
      id: "accordion-menu-buildings-title",
      parentElement: h2.getNode()
    })
    s = new DOMElement({
      tagName: "span", 
      classes: "flex items-center gap-2", 
      parentElement: b.getNode()
    })
    s1 = new DOMElement({
      tagName: "span", 
      classes: "text-xs hidden unread-notification fa fa-beat font-medium me-1 px-2 py-1 rounded-sm bg-blue-900 text-blue-300",
      parentElement: s.getNode(),
      text: "0"
    })
    s1 = new DOMElement({
      tagName: "span", 
      attributes: [{"key":"data-i18n","value":""}], 
      parentElement: s.getNode(),
      text: "Buildings"
    })
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Draw buildings accordion body
    d1 = new DOMElement({
      tagName: "div", 
      classes: "hidden", 
      attributes: [{"key":"aria-labelledby","value":"accordion-menu-buildings"}], 
      parentElement: parent_elem, 
      id: "accordion-menu-buildings-body"
    })
    //Buildings area
    d2 = new DOMElement({
      tagName: "div", 
      classes: "flex flex-wrap gap-1 p-1 border border-gray-200 border-gray-700 bg-gray-700", 
      parentElement: d1.getNode()
    })
    d = new DOMElement({
      tagName: "div", 
      classes: "w-100", 
      attributes: [{"key":"data-accordion","value":"collapse"}], 
      parentElement: d2.getNode(),
      id: "accordion-building-groups"
    })
    empty = true
    if(empty){
      this.draw_no_buildings()
    } else {
      this.draw_buildings_list(d.getNode())
    }
    //Actions available
    //Title
    let parent_div = document.getElementById("accordion-menu-buildings-body")
    d2 = new DOMElement({
      tagName: "div",
      classes: "border border-gray-800 bg-gray-500 text-xs", 
      parentElement: parent_div,
      id: `buildings-actions-title`
    })
    p = new DOMElement({
      tagName: "p",
      classes: "flex justify-between p-1 ps-2 text-xs text-gray-200 bg-gray-800",
      parentElement: d2.getNode()
    })
    s = new DOMElement({
      tagName: "span",
      attributes: [{"key":"data-i18n", "value":""}],
      parentElement: p.getNode(),
      text: translate(language, "Actions available")
    })
    //Area
    d2 = new DOMElement({
      tagName: "div",
      classes: "border border-gray-800 bg-gray-600 text-xs",
      parentElement: parent_div,
      id: `buildings-actions`
    })
    p = new DOMElement({
      tagName: "p",
      classes: "flex w-100 justify-between p-1 gap-1 text-gray-300",
      parentElement: d2.getNode()
    })
    b = new DOMElement({
      tagName: "button",
      classes: "text-xs grow p-2 button border border-gray-400 bg-gray-800",
      parentElement: p.getNode(),
      id: `buildings-actions-new`
    })
    i = new DOMElement({
      tagName: "i",
      classes: "fa fa-trowel",
      parentElement: b.getNode()
    })
    s = new DOMElement({
      tagName: "span",
      classes: "ms-2",
      attributes: [{"key":"data-i18n", "value":""}],
      parentElement: b.getNode(),
      text: translate(language, "Construct new building")
    })
    //b.getNode().addEventListener("click", new_building)
  }
  draw_expeditions = (e) => {
    let h2, b, s, s1, s2, s3, d1, d2, d, p, p1, i
    const draw_finished_expeditions = (parent_div) => {
        //Draw finished expeditions title
        d = new DOMElement({
          tagName: "div",
          classes: "w-100",
          parentElement: parent_div
        })
        d1 = new DOMElement({
          tagName: "div",
          classes: "border border-gray-800 bg-gray-800 text-xs",
          parentElement: d.getNode(),
          id: "expeditions-history-title"
        })
        p = new DOMElement({
          tagName: "p",
          classes: "text-xs flex justify-between p-1 px-2 text-gray-200",
          parentElement: d1.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: p.getNode(),
          text: "History"
        })
        //Draw finished expeditions area
        d1 = new DOMElement({
          tagName: "div",
          classes: "activeExpeditions p-1 flex flex-wrap gap-1 border border-gray-800 bg-gray-600 text-xs",
          parentElement: d.getNode(),
          id: "expeditions-history-area"
        })
        //Resources expeditions
        p = new DOMElement({
          tagName: "p", 
          classes: "w-100 flex gap-1 text-xs text-gray-400", 
          parentElement: d1.getNode()
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex grow", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-green-800 border border-gray-500 text-white", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          text: translate(language, "Resources expeditions")
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          text: translate(language, "Attempts")
        })
        s2 = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(), 
          text: ":"
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-500 border border-gray-500 text-black font-bold", 
          parentElement: s.getNode()
        })
        let total_finished_resource_expeditions = this.statistics.expeditions.resources.successful + this.statistics.expeditions.resources.missed
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          id: "resources_expeditions_attempts",
          text: total_finished_resource_expeditions.toString()
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          text: translate(language, "Successful")
        })
        s2 = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(), 
          text: ":"
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-500 border border-gray-500 text-black font-bold", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          id: "resources_expeditions_successful",
          text: this.statistics.expeditions.resources.successful.toString()
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          text: translate(language, "Productivity")
        })
        s2 = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(), 
          text: ":"
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-500 border border-gray-500 text-black font-bold", 
          parentElement: s.getNode()
        })
        let percent_resource_expeditions = total_finished_resource_expeditions ? Math.round(100 * this.statistics.expeditions.resources.successful / total_finished_resource_expeditions) : 0
        s2 = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          id: "resources_expeditions_productivity",
          text: percent_resource_expeditions.toString()+"%"
        })
        //Ruins expeditions
        p = new DOMElement({
          tagName: "p", 
          classes: "w-100 flex gap-1 text-xs text-gray-400", 
          parentElement: d1.getNode()
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex grow", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-sky-800 border border-gray-500 text-white", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          text: translate(language, "Ruins expeditions")
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          text: translate(language, "Attempts")
        })
        s2 = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(), 
          text: ":"
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-500 border border-gray-500 text-black font-bold", 
          parentElement: s.getNode()
        })
        let total_finished_ruins_expeditions = this.statistics.expeditions.ruins.successful + this.statistics.expeditions.ruins.missed
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          id: "ruins_expeditions_attempts",
          text: total_finished_ruins_expeditions.toString()
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          text: translate(language, "Successful")
        })
        s2 = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(), 
          text: ":"
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-500 border border-gray-500 text-black font-bold", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          id: "ruins_expeditions_successful",
          text: this.statistics.expeditions.ruins.successful.toString()
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          text: translate(language, "Productivity")
        })
        s2 = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(), 
          text: ":"
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-500 border border-gray-500 text-black font-bold", 
          parentElement: s.getNode()
        })
        let percent_ruins_expeditions = total_finished_ruins_expeditions ? Math.round(100 * this.statistics.expeditions.ruins.successful / total_finished_ruins_expeditions) : 0
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          id: "ruins_expeditions_productivity",
          text: percent_ruins_expeditions.toString()+"%"
        })
        //Combat expeditions
        p = new DOMElement({
          tagName: "p", 
          classes: "w-100 flex gap-1 text-xs text-gray-400", 
          parentElement: d1.getNode()
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex grow", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-red-800 border border-gray-500 text-white", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          text: translate(language, "Combat expeditions")
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          text: translate(language, "Attempts")
        })
        s2 = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(), 
          text: ":"
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-500 border border-gray-500 text-black font-bold", 
          parentElement: s.getNode()
        })
        let total_finished_combat_expeditions = this.statistics.expeditions.combat.won + this.statistics.expeditions.combat.lost
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          id: "combat_expeditions_attempts",
          text: total_finished_combat_expeditions.toString()
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          text: translate(language, "Successful")
        })
        s2 = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(), 
          text: ":"
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-500 border border-gray-500 text-black font-bold", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          id: "combat_expeditions_successful",
          text: this.statistics.expeditions.combat.won.toString()
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-700 border border-gray-500 text-white", 
          parentElement: s.getNode()
        })
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          text: translate(language, "Productivity")
        })
        s2 = new DOMElement({
          tagName: "span",
          parentElement: s1.getNode(), 
          text: ":"
        })
        s = new DOMElement({
          tagName: "span", 
          classes: "flex", 
          parentElement: p.getNode()
        })
        s1 = new DOMElement({
          tagName: "span", 
          classes: "w-100 flex-none border border-gray-800 p-0.5 px-1 bg-gray-500 border border-gray-500 text-black font-bold", 
          parentElement: s.getNode()
        })
        let percent_combat_expeditions = total_finished_combat_expeditions ? Math.round(100 * this.statistics.expeditions.combat.successful / total_finished_combat_expeditions) : 0
        s2 = new DOMElement({
          tagName: "span", 
          attributes: [{"key":"data-i18n","value":""}], 
          parentElement: s1.getNode(),
          id: "combat_expeditions_productivity",
          text: percent_combat_expeditions.toString()+"%"
        })
    }
    const draw_active_expeditions = (parent_div) => {
        //Draw active expeditions title
        d = new DOMElement({
          tagName: "div",
          classes: "w-100",
          parentElement: parent_div
        })
        d1 = new DOMElement({
          tagName: "div",
          classes: "border border-gray-800 bg-gray-800 text-xs",
          parentElement: d.getNode(),
          id: "active-expeditions-title"
        })
        p = new DOMElement({
          tagName: "p",
          classes: "text-xs flex justify-between p-1 ps-2 text-gray-200",
          parentElement: d1.getNode()
        })
        s = new DOMElement({
          tagName: "span",
          attributes: [{"key":"data-i18n","value":""}],
          parentElement: p.getNode(),
          text: "Active expeditions"
        })
        //Draw active expeditions area
        d1 = new DOMElement({
          tagName: "div",
          classes: "activeExpeditions flex flex-wrap gap-1 p-1 border border-gray-800 bg-gray-600 text-xs",
          parentElement: d.getNode(),
          id: "active-expeditions-area"
        })
        this.draw_no_active_expeditions()
    }
    const draw_available_actions = (parent_div) => {
      //Actions available
      d = new DOMElement({
        tagName: "div",
        classes: "w-100",
        parentElement: d2.getNode(),
        id: "expeditions-actions"
      })
      d1 = new DOMElement({
        tagName: "div",
        classes: "border border-gray-800 bg-gray-500 text-xs",
        parentElement: d.getNode(),
        id: "expeditions-actions-title"
      })
      p = new DOMElement({
        tagName: "p",
        classes: "flex justify-between p-1 ps-2 text-xs text-gray-200 bg-gray-800",
        parentElement: d1.getNode()
      })
      s = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n", "value":""}],
        parentElement: p.getNode(),
        text: "Actions available"
      })
      //Expeditions actions
      d1 = new DOMElement({
        tagName: "div",
        classes: "border border-gray-800 bg-gray-600 text-xs",
        parentElement: d.getNode(),
        id: "expeditions-actions-body"
      })
      p = new DOMElement({
        tagName: "p",
        classes: "flex w-100 justify-between p-1 text-gray-300",
        parentElement: d1.getNode()
      })
      b = new DOMElement({
        tagName: "button",
        classes: "text-xs grow p-2 button border border-gray-400 bg-gray-800",
        parentElement: p.getNode(),
        id: "newExpedition"
      })
      i = new DOMElement({
        tagName: "i",
        classes: "fa fa-plus me-2",
        parentElement: b.getNode()
      })
      s = new DOMElement({
        tagName: "span",
        attributes: [{"key":"data-i18n", "value":""}],
        parentElement: b.getNode(),
        text: "New expedition"
      })
      b.getNode().addEventListener("click", function(e){
        let expedition = new Expedition({"category": "of resources"})
        let objectData = {"language": language, "name": "New expedition", "icon": "fa fa-location-dot", "accordionBodyId": `expeditions-actions-body`, "buildContent": expedition.draw, "callback": expedition.panel_close}
        //Build new expedition panel
        if(colony.active_panel) colony.active_panel.close()
        colony.active_panel = new Webpanel(objectData)
      })
    }
    let parent_elem = document.getElementById("accordion-menu")
    //Draw expeditions accordion header
    h2 = new DOMElement({
      tagName: "h2",
      classes: "mt-3",
      parentElement: parent_elem,
      id: "accordion-menu-expeditions"
    })
    b = new DOMElement({
      tagName: "button",
      classes: "flex items-center justify-between w-full py-2 px-3 bg-gray-900 font-medium border border-gray-700 text-gray-400 gap-3",
      attributes: [{"key":"type","value":"button"}, {"key":"data-accordion-target","value":"#accordion-menu-expeditions-body"},{"key":"aria-expanded","value":"false"},{"key":"aria-controls","value":"accordion-menu-expeditions-body"}],
      parentElement: h2.getNode()
    })
    s = new DOMElement({
      tagName: "span",
      attributes: [{"key":"data-i18n","value":""}],
      parentElement: b.getNode(),
      text: "Expeditions"
    })
    b.appendHTML("<svg data-accordion-icon class=\"w-3 h-3 rotate-180 shrink-0\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 10 6\"><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5 5 1 1 5\"/></svg>")
    //Build expeditions accordion body
    d1 = new DOMElement({
      tagName: "div",
      classes: "hidden",
      attributes: [{"key":"aria-labelledby","value":"accordion-menu-expeditions"}],
      parentElement: parent_elem,
      id: "accordion-menu-expeditions-body"
    })
    d2 = new DOMElement({
      tagName: "div",
      classes: "w-100 p-1 flex flex-wrap gap-1 border border-gray-700 bg-gray-700",
      parentElement: d1.getNode()
    })
    draw_finished_expeditions(d2.getNode())
    draw_active_expeditions(d2.getNode())
    draw_available_actions(d2.getNode())
  }
  draw_no_active_expeditions = () => {
    let p = new DOMElement({
      tagName: "p",
      classes: "empty text-xs flex justify-between text-gray-200",
      parentElement: document.getElementById("active-expeditions-area")
    })
    let s = new DOMElement({
      tagName: "span",
      parentElement: p.getNode()
    })
    let i = new DOMElement({
      tagName: "i",
      classes: "fa fa-light fa-empty-set me-1",
      parentElement: s.getNode()
    })
    let s1 = new DOMElement({
      tagName: "span",
      attributes: [{"key":"data-i18n","value":""},{"key":"gender","value":"f"}],
      parentElement: s.getNode(),
      text: translate(language, "None", "f")
    })
  }
  undraw_no_active_expeditions = () => {
    if(document.querySelector("#active-expeditions-area p.empty")) {
      document.querySelector("#active-expeditions-area p.empty").remove()
    }
  }
  //Visually update particulary colony data on screen (for no auto generative panels)
  redraw_colony_hour = (hour) => {
    if(document.querySelector("#currentHour")) {
      document.querySelector("#currentHour").innerText = (hour.toString()).padStart(2, "0")
    }
  }
  redraw_colony_day = (day) => {
    if(document.querySelector("#currentDay")) {
      document.querySelector("#currentDay").innerText = day.toString()
    }
  }
  redraw_colony_week = (week) => {
    if(document.querySelector("#currentWeek")) {
      document.querySelector("#currentWeek").innerText = week.toString()
    }
  }
  redraw_colony_year = (year) => {
    if(document.querySelector("#currentYear")) {
      document.querySelector("#currentYear").innerText = year.toString()
    }
  }
  redraw_colony_passed_weeks = (weeks) => {
    if(document.querySelector("#passedWeeks")) {
      document.querySelector("#passedWeeks").innerText = weeks.toString()
    }
  }
  redraw_colony_stock = (good, stock) => {
    document.querySelectorAll(`#colony-${good}-stock`).forEach((element) => {
      element.innerText = stock.toString()
    })
    //let current_water_daily_revenue = this.income.water - this.population * Citizen.daily_water_needs
    let stock_limit = this.get_stock_limit(good)
    let stock_limit_used = Math.round(stock / stock_limit * 100)
    document.querySelectorAll(`#colony-${good}-stock-limit-used`).forEach((element) => {
      element.innerText = stock_limit_used.toString()
    })
  }
}