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