class Building{
    static capacity = {
        "campaign tent": 3,
        "cottage": 9,
        "stone house": 16,
        "brick house": 24,
        "manor": 42,
        "mansion": 80,
        "graveyard": 15
    }
    static category = {
        "shelter_related": {
            "campaign_tent": { "name": "campaign tent", "plural": "campaign tents", "risk": {"fire hazard": 0.5}, "last_id": 0, "building_list":[] }, //tienda de campaña
            "cottage": { "name": "cottage", "plural": "cottages", "risk": {"fire hazard": 0.2}, "last_id": 0, "building_list":[]}, //cabaña de madera
            "stone_house": { "name": "stone house", "plural": "stone houses", "last_id": 0, "building_list":[]}, //casa de piedra
            "brick_house": { "name": "brick house", "plural": "brick houses", "last_id": 0, "building_list":[]}, //casa de ladrillos
            "manor": { "name": "manor", "plural": "manors", "last_id": 0, "building_list":[]}, //casona
            "mansion": { "name": "mansion", "plural": "mansions", "last_id": 0, "building_list":[]}, //mansión
            "graveyard": { "name": "graveyard", "plural": "graveyards", "last_id": 0, "building_list":[]}, //cementerio*/
        },
        "mounts_related":{
            "quarry" : { "name": "quarry", "plural": "quarries", "last_id": 0, "building_list":[]}, //pedregal (stonesmith)
            "clay_quarry" : { "name": "clay quarry", "plural": "clay quarries", "last_id": 0, "building_list":[]}, //terrario
            "lumberjack's_hut" : { "name": "lumberjack's hut", "plural": "lumberjack's huts", "last_id": 0, "building_list":[]}, //puesto de leñador
            "mine" : { "name": "mine", "plural": "mines", "last_id": 0, "building_list":[]}, //mina
            /* For future versions...
            "hunting post" : 0, //puesto de cazador
            */
        },
        "production_related": {
            /* For future versions...
            "water well" : 0, //pozo de agua
            */
            "farm": { "name": "farm", "plural": "farms", "last_id": 0, "building_list":[]}, //granja
            "barnyard": { "name": "barnyard", "plural": "barn yards", "last_id": 0, "building_list":[]}, //corral
            "mill": { "name": "mill", "plural": "mills", "last_id": 0, "building_list":[]}, //molino
            "slaughterhouse": { "name": "slaughterhouse", "plural": "slaughterhouses", "last_id": 0, "building_list":[]}, //matadero
            "furnaces": { "name": "furnaces", "plural": "furnaces", "last_id": 0, "building_list":[]}, //hornos
            "textile": { "name": "textile", "plural": "textiles", "last_id": 0, "building_list":[]}, //textil
            "blacksmith": { "name": "blacksmith", "plural": "blacksmiths", "last_id": 0, "building_list":[]}, //herrería
            "sawmill": { "name": "sawmill", "plural": "sawmills", "last_id": 0, "building_list":[]}, //aserradero
            "workshop": { "name": "workshop", "plural": "workshops", "last_id": 0, "building_list":[]}, //talle
            "woodsmith": { "name": "woodsmith", "plural": "woodsmiths", "last_id": 0, "building_list":[]}, //carpintería (carpentry)
        },
        "training_related": {
            "academy": { "name": "academy", "plural": "academies", "last_id": 0, "building_list":[]}, //academia
            "barracks": { "name": "barracks", "plural": "barracks", "last_id": 0, "building_list":[]}, //cuartel
            /* For future versions...
            "archery range": 0, //campo de arquería
            */
        },
        "exchange_related": {
            "market": { "name": "market", "plural": "markets", "last_id": 0, "building_list":[]}, //mercado
            "fair": { "name": "fair", "plural": "fairs", "last_id": 0, "building_list":[]}, //feria
            "bank": { "name": "bank", "plural": "banks", "last_id": 0, "building_list":[]}, //banco
            "tavern": { "name": "tavern", "plural": "taverns", "last_id": 0, "building_list":[]}, //taberna
        }
    }
    constructor(type, subtype, template = null){
        this.id = colony.get_next_building_id()
        this.new = true //Turns false after first building accordion click. Used to show or hide "new unread building" badge.
        this.type = type //Shelter, production building, training building, etc.
        this.subtype = subtype //Specific type of building
        let built_hour = colony.time_interval.current_hour
        let built_day = colony.time_interval.current_day
        let built_week = colony.time_interval.current_week
        let built_year = colony.time_interval.current_year
        let initiated_hour = colony.time_interval.current_hour
        let initiated_day = colony.time_interval.current_day
        let initiated_week = colony.time_interval.current_week
        let initiated_year = colony.time_interval.current_year
        this.state = "built" //built, under construction, ruined
        this.integrity = 100 //0% to 100%
        let built = {}
        if(template){
            if(template["date built"]){ //If building was already built
                built.hour = template["date built"]["hour"] ?? colony.time_interval.current_hour
                built.day = template["date built"]["day"] ?? colony.time_interval.current_day
                built.week = template["date built"]["week"] ?? colony.time_interval.current_week
                built.year = template["date built"]["year"] ?? colony.time_interval.current_year
            }
            if(template["date initiated"]){ //If building is under construction
                initiated.hour = template["date initiated"]["hour"] ?? null
                initiated.day = template["date initiated"]["day"] ?? null
                initiated.week = template["date initiated"]["week"] ?? null
                initiated.year = template["date initiated"]["year"] ?? null
            }
            this.state = template["state"] ?? "built"
            this.integrity = template["integrity"] ?? 100
        }
        this.date_built = {}
        this.date_built.hour = built_hour
        this.date_built.day = built_day
        this.date_built.week = built_week
        this.date_built.year = built_year
        this.date_initiated = {}
        this.date_initiated.hour = initiated_hour
        this.date_initiated.day = initiated_day
        this.date_initiated.week = initiated_week
        this.date_initiated.year = initiated_year
        this.capacity = Math.floor(Building.capacity[subtype] * (this.integrity/100)) ?? 0
    }
}