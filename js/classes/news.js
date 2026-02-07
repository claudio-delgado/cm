class News {
    constructor(type, content) {
        this.id = colony.get_next_news_id()
        this.type = type
        this.new = true //Turns false after first news accordion click. Used to show or hide "new unread news" badge.
        this.parsed_template = ""
        this.template_string = content
        this.date = {"hour": colony.time_interval.current_hour, "day": colony.time_interval.current_day, "week": colony.time_interval.current_week, "year": colony.time_interval.current_year}
        this.category = "" //info, warning, enhancement, danger
        switch(type){
            case "welcome":
                this.title = "Welcome!"
                this.category = "enhancement"
                this.data = {
                    "values": [{"var":"citizens", "val":"10"}, {"var":"men_quantity", "val":"5"}, {"var":"women_quantity", "val":"5"}, 
                                {"var":"water_reservoir_type", "val":"a "+colony.landforms.get(1).type.toLowerCase()}, {"var":"wagons_quantity", "val":"3"}, 
                                {"var":"horses_quantity", "val":"6"}, {"var":"visibility", "val": colony.time_started ? "hidden " : ""}
                    ], 
                    "collections": [{"var":"goods", 
                                     "val":[{"name":"Wood", "quantity":colony.stock.resources.get("wood")}, {"name":"Wooden trunk", "quantity":colony.stock.resources.get("wooden trunk")}, 
                                        {"name":"Nail", "quantity":colony.stock.products.get("nail")}, {"name":"Hammer", "quantity":colony.stock.products.get("hammer")},
                                        {"name":"Shovel", "quantity":colony.stock.products.get("shovel")}, {"name":"Trowel", "quantity":colony.stock.products.get("trowel")}, {"name":"Saw", "quantity":colony.stock.products.get("saw")},
                                        {"name":"Hay", "quantity":colony.stock.products.get("hay")}, {"name":"Rope", "quantity":colony.stock.products.get("rope")}, {"name":"Rag", "quantity":colony.stock.products.get("rag")},
                                        {"name":"Water", "quantity":colony.stock.resources.get("water")}, {"name":"Food", "quantity":colony.stock.resources.get("food")}
                                    ]}
                    ]
                }
                break;
            case "zone_searched":
                this.title = "Recognition"
                this.category = "enhancement"
                this.data = {
                    "values": [{"var":"campaign_tents", "val":colony.buildings.get("shelters").size}, {"var":"stone", "val":colony.zone_loot["stone"]}, {"var":"gravel", "val":colony.zone_loot["gravel"]}, 
                                {"var":"clay", "val":colony.zone_loot["clay"]}, {"var":"brick", "val":colony.zone_loot["brick"]}, {"var":"hay", "val":colony.zone_loot["hay"]},
                                {"var":"rag", "val":colony.zone_loot["rag"]}, {"var":"wooden plank", "val":colony.zone_loot["wooden plank"]}, {"var":"wooden plate", "val":colony.zone_loot["wooden plate"]},
                                {"var":"roof tile", "val":colony.zone_loot["roof tile"]}
                    ], 
                    "collections": [{"var":"goods", "val":[{"name":"Wood", "quantity":"100"}, {"name":"Nail", "quantity":"2500"}, {"name":"Hammer", "quantity":"50"},
                                                            {"name":"Shovel", "quantity":"80"}, {"name":"Trowel", "quantity":"100"}, {"name":"Saw", "quantity":"80"},
                                                            {"name":"Hay", "quantity":"100"}, {"name":"Rope", "quantity":"300"}, {"name":"Rag", "quantity":"250"},
                                                            {"name":"Water", "quantity":"25"}, {"name":"Food", "quantity":"25"}
                                                        ]}
                    ]
                }
                break;
        }
        this.news_content = this.parse(this.template_string, this.data)
    }

    static async create(type, url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo: ${response.status}`);
        }

        const text = await response.text();
        return new News(type, text);
    }

    static async load_message(type = "welcome") {
        let url = `js/templates/news_${type}.html`
        try {
            const loaded_news_message = await News.create(type, url);
            //Before adding current news to colony, clear unnessesary internal data.
            if(type !== "welcome"){ 
                delete(loaded_news_message.template_string)
                delete(loaded_news_message.data)
            }
            delete(loaded_news_message.parsed_template)
            colony.add_news_message(loaded_news_message)
            //return loader;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //Parse an html template replacing every {{_key}} with data.values[key] and processing every {{#collection}} {{/collection}} 
    //with a snippet inside and also replace there every {{key}} with data.values[key] for arrays
    parse = (template_string, data) => {
        this.parsed_template = template_string
        let dom_template
        const parse_value = (variable, value) => {
            const regex = new RegExp(`{{${variable}}}`, 'g')
            this.parsed_template = this.parsed_template.replace(regex, value)
        }
        const parser = new DOMParser()
        //Replace values
        data.values.forEach( object => {
            parse_value(object.var, object.val)
        })
        //Replace collections
        data.collections.forEach( collection_object => {
            let variable = collection_object.var
            let collection = collection_object.val
            //Check if data collection is present in template HTML as a data-collection attribute
            const collectionRegex = new RegExp(`<([a-zA-Z0-9]+)[^>]*data-collection="${variable}"[^>]*>([\\s\\S]*?)<\\/\\1>`, 'g')
            const collectionMatch = collectionRegex.exec(this.parsed_template)
            if(collectionMatch){
                //Parse and transform template string to DOM structure.
                dom_template = parser.parseFromString(this.parsed_template, 'text/html')
                //Parse each HTML block with collection name
                dom_template.querySelectorAll(`[data-collection="${variable}"]`).forEach( (element) => {
                    let collection_content = element.innerHTML
                    //Remove iterative content and build it again in the following collection foreach
                    element.innerHTML = ""
                    //[{"name":"Wood", "quantity":"100"}, {"name":"Stone", "quantity":"50"}]
                    collection.forEach(loop_object => {
                        element.innerHTML += collection_content
                        this.parsed_template = dom_template.documentElement.innerHTML
                        for (const [key, value] of Object.entries(loop_object)) {
                            parse_value(`#${variable}.${key}`, value)
                        }
                        dom_template = parser.parseFromString(this.parsed_template, 'text/html')
                        element = dom_template.querySelector(`[data-collection="${variable}"]`)
                    })
                })
            }
        })
        //Parse and transform final template string to DOM structure.
        dom_template = parser.parseFromString(this.parsed_template, 'text/html')
        return this.parsed_template;
    }
}