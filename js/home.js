//Long term global variables
var language, citizensAmount, citizensFemaleAmount, citizensMaleAmount
var daysPassed = 0, dayPassed = weekPassed = false, searchingZone = zoneSearched = lifeStarted = false
var colonyWaterReservoir = "", resourcesExpeditionsDone = 0, ruinsExpeditionsDone = 0
var wagonsAmount, horsesAmount
var colonyScore, colonyLifeQuality
//Constants
const zoneSearchHoursNeeded = 1
//User configuration variables
var showModalZoneSearched = true
//Temporary global variables
var citizenIndex, expeditionIndex = 1
//General dinamic panels
var newExpeditionPanel, assignRolePanel

let initColonyInfo = () => {
    language = "ES", colonyScore = 0, colonyLifeQuality = 10
    citizensAmount = 10, citizensFemaleAmount = 5, citizensMaleAmount = 5
    daysPassed = 0, dayPassed = false, weekPassed = false
    wagonsAmount = 3, horsesAmount = 6
    //colonyWaterReservoir = waterReservoirs[Math.floor(Math.random() * waterReservoirs.length)].name
    colonyWaterReservoir = Object.keys(waterReservoirs)[Math.floor(Math.random() * Object.keys(waterReservoirs).length)]
}
let loadInitialRandomGoods = () => {
    stock.resources.stone = 800 + Math.floor(Math.random() * (1000 - 800))
    stock.resources.gravel = 800 + Math.floor(Math.random() * (1000 - 800))
    stock.resources.clay = 800 + Math.floor(Math.random() * (1000 - 800))
    stock.products["wooden plank"] = 1000 + Math.floor(Math.random() * (1200 - 1000))
    stock.products["wooden plate"] = 20 + Math.floor(Math.random() * (50 - 20))
    stock.products["roof tile"] = 400 + Math.floor(Math.random() * (800 - 400))
    stock.products.brick = 500 + Math.floor(Math.random() * (900 - 500))
    stock.products.rag += 600 + Math.floor(Math.random() * (800 - 600))
    stock.products.hay += 400 + Math.floor(Math.random() * (600 - 400))
}
let colonySatisfaction = (lifeQuality, population) => {
    let satisfaction = {}
    if(lifeQuality >= population){
        if(lifeQuality >= 1.5 * population){
            if(lifeQuality >= 2 * population){
                satisfaction.word = "Extreme happiness"
                satisfaction.icon = "face-laugh-squint" 
                satisfaction.color = "text-green-400"
            } else { 
                satisfaction.word = "Happiness" 
                satisfaction.icon = "face-laugh" 
                satisfaction.color = "text-green-400"
            }
        } else {
            satisfaction.word = "Satisfaction"
            satisfaction.icon = "face-smile"
            satisfaction.color = "text-green-400"
        }
    } else {
        if(lifeQuality <= 0.5 * population){ 
            satisfaction.word = "Dissapointment"
            satisfaction.icon = "face-weary"
            satisfaction.color = "text-red-400"
        } else { 
            satisfaction.word = "Dissatisfaction"
            satisfaction.icon = "face-meh"
            satisfaction.color = "text-yellow-400"
        }
    }
    return satisfaction
}
let searchZone = (e) => {
    document.querySelector("#searchZone > span").innerText = translate(language, "Your citizens are searching the zone...")
    document.querySelector("#searchZone > i").classList.add("fa-beat")
    searchingZone = true
    e.target.removeEventListener("click", searchZone)
}

let lifeInterval = setInterval(() => {
    if(lifeStarted || searchingZone){
        //Update hours.
        let currentHour = Number(document.querySelector("#currentHour").innerText)
        currentHour = ((currentHour < 23 ? currentHour+1 : 0)+"").padStart(2, "0")
        document.querySelector("#currentHour").innerText = currentHour
        //Daily flag
        dayPassed = (currentHour == "00")
        //Update days.
        daysPassed+= (dayPassed ? 1 : 0)
        let currentDay = Number(document.querySelector("#currentDay").innerText)
        currentDay = 1 + (daysPassed % 7)
        document.querySelector("#currentDay").innerText = currentDay
        //Update weeks.
        let currentWeek = Number(document.querySelector("#currentWeek").innerText)
        currentWeek = 1 + (Math.floor(daysPassed / 7) % 52)
        //Weekly flag
        weekPassed = dayPassed && Math.floor(daysPassed / 7) == daysPassed / 7
        document.querySelector("#currentWeek").innerText = currentWeek
        document.querySelector("#passedWeeks").innerText = Math.floor(daysPassed / 7)
        //Update years.
        let currentYear = Number(document.querySelector("#currentYear").innerText)
        currentYear = 1 + Math.floor(daysPassed / 364)
        document.querySelector("#currentYear").innerText = currentYear
        //Zone searched flag
        zoneSearched = currentYear == 1 && currentWeek == 1 && currentDay == 1 && currentHour == zoneSearchHoursNeeded
        //Perform updating tasks inside game panels that involve hourly changes
        //Process countdowns
        processCountdowns()
        //Perform updating tasks inside game panels that involve daily changes
        //Efectuar tareas de actualización de partes del juego que involucren avances diarios.
        //console.log("y"+currentYear+"w"+currentWeek+"d"+currentDay+"h"+currentHour+", daysPassed: "+daysPassed+" dayPassed: "+dayPassed+", weekPassed: "+weekPassed)
        if(zoneSearched){
            searchingZone = false
            lifeStarted = true
            //Remove search zone button from Colony's available actions
            document.querySelector("#colony-actions > p > button").remove()
            s = new element("span", "", [{"key":"data-i18n", "value":""}], document.querySelector("#colony-actions > p")); s.create(); s.appendContent(translate(language, "No actions available"))
            //Remove warnings
            document.querySelectorAll("#searchZoneWarning").forEach((element) => { element.remove() })
            //Update initial stock
            loadInitialRandomGoods()
            //Update initial shelter capacity
            buildings.shelter["campaign tent"] = 5
            s1 = document.querySelector("#colonyShelterCapacityInfo")
            s1.classList.remove("text-red-400")
            s1.classList.add("text-green-400")
            document.querySelector("#shelterCapacityIcon").remove()
            document.querySelector("#colonyShelterCapacity").innerHTML = shelterCapacities["campaign tent"] * buildings.shelter["campaign tent"]
            s1.innerHTML+= " ("
            s2 = new element("span", "me-1", [{"key":"data-i18n","value":""}], s1); s2.create(); s2.appendContent("Occupation")
            s2 = new element("span", "font-bold", [], s1, "colonyShelterOccupation"); s2.create(); s2.appendContent("67%")
            s1.innerHTML+= ")"
            i = new element("i", "ms-1 fa fa-face-smile", [], s1, "shelterCapacityIcon"); i.create()
            //Update initial buildings
            updateColony()
            if(showModalZoneSearched) { 
                modalPopup("Zone researched!", "ZoneSearched") 
                modal.show()
            }
            //Update all water bearers and fishermen status (from "assigned" to "working")
            document.querySelectorAll('[data-status="assigned"]').forEach((citizenStatus) => {
                let citizenIndex = citizenStatus.id.split("-")[1]
                if(["waterbearing", "fishing"].includes(document.getElementById("citizen-"+citizenIndex+"-role").getAttribute("data-role"))){
                    citizenStatus.innerHTML = translate(language, "Working")
                }
            })
            //Update possible actions blocked by not having searched the zone previously.
            if(document.querySelectorAll(".newExpedition .assignedWorkers .assignedWorker").length){
                //If there were expeditionaries assigned to an expedition, add button to start it.
                document.getElementById("newExpeditionNoActions").classList.add("hidden")
                document.querySelector("#expeditionStart").classList.remove("hidden")
            }
        }
        if(dayPassed){
            //Update resource extractions
            let dailyWaterGained = document.querySelector("#colony-water-income").innerText * 1 - document.querySelector("#colony-water-consumption").innerText * 1
            document.querySelectorAll("#colony-water-stock").forEach((value) => {
                value.innerText = value.innerText * 1 + (dailyWaterGained)
            })
            let dailyFoodGained = document.querySelector("#colony-food-income").innerText * 1 - document.querySelector("#colony-food-consumption").innerText * 1
            document.querySelectorAll("#colony-food-stock").forEach((value) => {
                value.innerText = value.innerText * 1 + (dailyFoodGained)
            })
            //Update productions
        }
        if(weekPassed){
            //Update citizens age
            document.querySelectorAll("#accordion-citizens .citizen-properties").forEach((value) => {
                let citizenYearsAge = document.querySelector("#citizen-"+value.dataset.index+"-ageYears")
                let citizenWeeksAge = document.querySelector("#citizen-"+value.dataset.index+"-ageWeeks")
                citizenWeeksAge.innerText = (citizenWeeksAge.innerText*1 + 1) % 52
                citizenYearsAge.innerText = citizenYearsAge.innerText*1 + (citizenWeeksAge.innerText*1 == 0 ? 1 : 0)
            })
        }
        //clearInterval(lifeInterval)
    }
}, 1790);

let processCountdowns = () => {
    let hours, days, weeks, years
    document.querySelectorAll(".countdownTime").forEach((elem) => {
        let idArray = elem.querySelector("span:first-child").id.split("-")
        let prefix = idArray[0]+"-"+idArray[1]+"-"+idArray[2]
        //Correct unit numbers (singulars and plurals) before processing values
        hours = 1*elem.querySelector(".countdown.hours").innerText
        elem.querySelector("#"+prefix+"-hoursText").innerText = hours == 1 ? "h" : "hs"
        days = 1*elem.querySelector(".countdown.days").innerText
        elem.querySelector("#"+prefix+"-daysText").innerText = days == 1 ? translate(language, "days").slice(0, -1) : translate(language, "days")
        weeks = 1*elem.querySelector(".countdown.weeks").innerText
        elem.querySelector("#"+prefix+"-weeksText").innerText = weeks == 1 ? translate(language, "weeks").slice(0, -2)+"." : translate(language, "weeks")
        years = 1*elem.querySelector(".countdown.years").innerText
        elem.querySelector("#"+prefix+"-yearsText").innerText = weeks == 1 ? translate(language, "years").slice(0, -1) : translate(language, "years")
        //If hours > 0 => decrement them
        if(1*elem.querySelector(".countdown.hours").innerText){
            //Decrement pending hours
            hours = 1*elem.querySelector(".countdown.hours").innerText - 1
            elem.querySelector(".countdown.hours").innerText = hours.toString().padStart(2, "0")
            //Arrange unit number: singular or plural
            elem.querySelector("#"+prefix+"-hoursText").innerText = hours == 1 ? "h" : "hs"
        } else {
            //hours == 00
            //If days > 0 => decrement them
            if(1*elem.querySelector(".countdown.days").innerText){
                //Decrement pending days
                days = 1*elem.querySelector(".countdown.days").innerText - 1
                elem.querySelector(".countdown.days").innerText = days.toString()
                //Hide days if they are 0 and both weeks and years are hidden
                if(!days && elem.querySelector(".countdown.weeks").classList.contains("hidden")
                        && elem.querySelector(".countdown.years").classList.contains("hidden")){
                    elem.querySelector("#"+prefix+"-days").classList.add("hidden")
                    elem.querySelector("#"+prefix+"-daysText").classList.add("hidden")
                }
                //Set hours to max value - 1 => hours = 23
                hours = "23"
                elem.querySelector(".countdown.hours").innerText = hours
                //Arrange unit number: singular or plural
                elem.querySelector("#"+prefix+"-daysText").innerText = days == 1 ? translate(language, "days").slice(0, -1) : translate(language, "days")
            } else {
                //days == 0 & hours == 00
                //If weeks > 0 => decrement them
                if(1*elem.querySelector(".countdown.weeks").innerText){
                    //Decrement pending weeks
                    weeks = 1*elem.querySelector(".countdown.weeks").innerText - 1
                    elem.querySelector(".countdown.weeks").innerText = weeks.toString()
                    //Hide weeks if they are 0 and years is hidden
                    if(!weeks && elem.querySelector(".countdown.years").classList.contains("hidden")){
                        elem.querySelector("#"+prefix+"-weeks").classList.add("hidden")
                        elem.querySelector("#"+prefix+"-weeksText").classList.add("hidden")
                    }
                    //Set days to max value - 1 => days = 6
                    elem.querySelector(".countdown.days").innerText = "6"
                    //Set hours to max value - 1 => hours = 23
                    elem.querySelector(".countdown.hours").innerText = "23"
                    //Arrange unit number: singular or plural
                    elem.querySelector("#"+prefix+"-weeksText").innerText = weeks == 1 ? translate(language, "weeks").slice(0, -2)+"." : translate(language, "weeks")
                } else {
                    //weeks = 0 & days == 0 & hours == 00
                    //If years > 0 => decrement them
                    if(1*elem.querySelector(".countdown.years").innerText){
                        //Decrement pending years
                        years = 1*elem.querySelector(".countdown.years").innerText - 1
                        elem.querySelector(".countdown.years").innerText = years.toString()
                        //Hide years if they are 0
                        if(!years){
                            elem.querySelector("#"+prefix+"-years").classList.add("hidden")
                            elem.querySelector("#"+prefix+"-yearsText").classList.add("hidden")
                        }
                        //Set weeks to max value - 1 => weeks = 51
                        elem.querySelector(".countdown.weeks").innerText = "51"
                        //Set days to max value - 1 => days = 6
                        elem.querySelector(".countdown.days").innerText = "6"
                        //Set hours to max value - 1 => hours = 23
                        elem.querySelector(".countdown.hours").innerText = "23"
                        //Arrange unit number: singular or plural
                        elem.querySelector("#"+prefix+"-yearsText").innerText = weeks == 1 ? translate(language, "years").slice(0, -1) : translate(language, "years")
                    } else {
                        //Remove countdown
                        if(elem.classList.contains("activeExpedition")){
                            endActiveExpedition()
                        }
                    }
                }
            }
        }
        if( !hours &&
            elem.querySelector("#"+prefix+"-days").classList.contains("hidden") &&
            elem.querySelector("#"+prefix+"-weeks").classList.contains("hidden") &&
            elem.querySelector("#"+prefix+"-years").classList.contains("hidden")){
            //Remove countdown
            if(elem.classList.contains("activeExpedition")){
                endActiveExpedition()
            }
        }
    })
}

let endActiveExpedition = () => {
    //Restore expeditionaries status to idle.
    document.querySelectorAll(".accordion-active-expedition [data-accordion] h2").forEach((elem) => {
        let citizenIndex = elem.querySelector("i").id.split("-")[3]
        document.querySelectorAll("#citizen-"+citizenIndex+"-status").forEach((status) => {
            status.setAttribute("data-status", "idle")
            status.innerText = translate(language, "Idle")
        })
    })
    //Remove active expedition
    document.querySelector(".accordion-active-expedition").remove()
    let d = document.getElementById("active-expeditions-area")
    //If no other active expedition, show empty text.
    if(!d.children.length){
        p = new element("p", "empty ms-1 text-xs flex justify-between text-gray-500 dark:text-gray-200", [], d); p.create()
        s = new element("span", "", [], p.getNode()); s.create()
        i = new element("i", "fa fa-light fa-empty-set me-1", [], s.getNode()); i.create()
        s1 = new element("span", "", [{"key":"data-i18n","value":""},{"key":"gender","value":"f"}], s.getNode()); s1.create(); s1.appendContent(translate(language, "None", "f"))
    }
}

let citizenDescription = (gender, language, texts, attributes) => {
    let textAttr = "", prefix = "", gen = (gender == "Femenine" || gender == "Femenino" ? "F" : "M"), adjective = "", text = ""
    let connector
    if(language == "ES" && (texts == "Ella es una mujer" || texts == "El es un hombre")) { connector = " y " }
    if(language == "ES" && !(texts == "Ella es una mujer" || texts == "El es un hombre")) { connector = " o " }
    if(language == "EN" && (texts[0] == "She is a" || texts[0] == "He is a")) { connector = " and " }
    if(language == "EN" && !(texts[0] == "She is a" || texts[0] == "He is a")) { connector = " or " }
    if(gen == "F"){
        if(language == "EN"){
            attributes.forEach(function(value, index){
                prefix = (index<2 ? (index ? ", " : " ") : connector)
                adjective = attributesAdjectives[language][value]
                textAttr+= prefix+"<strong class='"+attributesColors[language][value]+"'>"+adjective+"</strong>"
            })
            text+= texts[0]+textAttr+" "+texts[1]
        }
        if(language == "ES"){
            attributes.forEach(function(value, index){
                prefix = (index<2 ? (index ? ", " : " ") : (value == "Inteligencia" && connector == " y " ? " e " : connector))
                if(typeof attributesAdjectives[language][value] == "undefined") debugger
                adjective = attributesAdjectives[language][value][gen]
                textAttr+= prefix+"<strong class='"+attributesColors[language][value]+"'>"+adjective+"</strong>"
            })
            text+= texts + textAttr
        }
    }
    if(gen == "M"){
        if(language == "EN"){
            attributes.forEach(function(value, index){
                prefix = (index<2 ? (index ? ", " : " ") : connector)
                adjective = attributesAdjectives[language][value]
                textAttr+= prefix+"<strong class='"+attributesColors[language][value]+"'>"+adjective+"</strong>"
            })
            text+= texts[0]+textAttr+" "+texts[1]
        }
        if(language == "ES"){
            attributes.forEach(function(value, index){
                prefix = (index<2 ? (index ? ", " : " ") : (value == "Inteligencia" && connector == " y " ? " e " : connector))
                if(typeof attributesAdjectives[language][value] == "undefined") debugger
                adjective = attributesAdjectives[language][value][gen]
                textAttr+= prefix+"<strong class='"+attributesColors[language][value]+"'>"+adjective+"</strong>"
            })
            text+= texts + textAttr
        }
    }
    return text
}
let setRandomNames = (language) => {
    //Assign random names for all citizens
    var femaleNames = naming['names'][language]['F']
    var maleNames = naming['names'][language]['M']
    //Assign random families for all citizens
    var femaleFamilies = naming['families'][language]['F']
    var maleFamilies = naming['families'][language]['M']
    //Iterate over each citizen and assign names and families
    for(let i = 1; i<=citizensAmount; i++){
        let randomCitizenName = "", randomCitizenFamily = "", iconGroup = "", genderClass = "", genderColour = ""
        if(i<=citizensAmount/2){
            iconGroup = "fa"; genderClass = "fa-venus"; genderColour = "text-red-500"
            randomCitizenName = femaleNames[Math.floor(Math.random() * femaleNames.length)]
            femaleNames = femaleNames.filter(item => item !== randomCitizenName)
            randomCitizenFamily = femaleFamilies[Math.floor(Math.random() * femaleFamilies.length)]
            femaleFamilies = femaleFamilies.filter(item => item !== randomCitizenFamily)
        } else {
            iconGroup = "fa"; genderClass = "fa-mars"; genderColour = "text-blue-500"
            randomCitizenName = maleNames[Math.floor(Math.random() * maleNames.length)]
            maleNames = maleNames.filter(item => item !== randomCitizenName)
            randomCitizenFamily = maleFamilies[Math.floor(Math.random() * maleFamilies.length)]
            maleFamilies = maleFamilies.filter(item => item !== randomCitizenFamily)
        
        }
        document.querySelector("#citizen-"+i+"-gender-icon").classList.remove("hidden")
        document.querySelector("#citizen-"+i+"-gender-icon").classList.add(iconGroup, genderClass, genderColour)
        document.querySelector("#citizen-"+i+"-name").innerHTML = randomCitizenName+", "+randomCitizenFamily
        //"<i id='citizen-"+i+"-gender-icon' class='text-red-500 fa fa-venus me-1'></i><i id='citizen-"+i+"-role-icon' class='text-green-500 hidden fa me-1'></i></i><span class='text-yellow-500 border border-yellow-500 rounded px-1 me-1'>2</span>"+
    }
}
let getRandomAttributes = (language, amount = 3, excludeThis = []) => {
    let attributeGroups = JSON.parse(JSON.stringify(attributes[language]))
    //Excluir los atributos necesarios.
    attributeGroups.forEach(function(valueA, indexA){
        excludeThis.forEach(function(valueE, indexE){
            valueA.attributes = valueA.attributes.filter(item => item !== valueE)
        })
    })
    let citizenAttributes = []
    for(i=0; i<amount; i++){
        let randomIndexGroup = Math.floor(Math.random() * attributeGroups.length)
        let randomGroup = attributeGroups[randomIndexGroup]
        while(!randomGroup.attributes.length){
            randomIndexGroup = Math.floor(Math.random() * attributeGroups.length)
            randomGroup = attributeGroups[randomIndexGroup]
        }
        let randomAttribute = randomGroup.attributes[Math.floor(Math.random() * randomGroup.attributes.length)]
        //Quitar atributo de la lista para que no vuelva a ser elegido.
        attributeGroups[randomIndexGroup].attributes = attributeGroups[randomIndexGroup].attributes.filter(item => item !== randomAttribute)
        //Agregar atributo propio
        citizenAttributes.push(randomAttribute)
    }
    return citizenAttributes
}
let fillCitizenInfo = () => {
    let descriptionText1 = {"ES" : {"F": "Ella es una mujer", "M": "El es un hombre"}, "EN" : {"F": ["She is a", "woman"], "M": ["He is a", "man"]}}
    let descriptionText2 = {"ES" : {"F": "A ella le gusta un hombre", "M": "A él le gusta una mujer"}, "EN" : {"F": ["She likes a", "man"], "M": ["He likes a", "woman"]}}
    let descriptionText3 = {"ES" : {"F": "Ella prefiere que no sea", "M": "Él prefiere que no sea"}, "EN" : {"F": ["She prefers a no", "man"], "M": ["He prefers a no", "woman"]}}
    //Cargar atributos propios aleatorios para los 10 habitantes.
    //Generar también edades aletatorias.
    let attributeGroups = JSON.parse(JSON.stringify(attributes[language]))
    let citizenOwnAttributes = [], citizenWishedAttributes = [], citizenMustAttribute
    let citizenDescriptions = []
    let citizenBirthweeks = [], citizenFertilities = [], citizenWeekDeaths = []
    //Iterate over each citizen
    for(h=1; h<=citizensAmount; h++){
        citizenBirthweeks.push(1092 + Math.floor(Math.random() * (1820-1092)))
        citizenWeekDeaths.push(3120 + Math.floor(Math.random() * (4420-3120)))
        citizenFertilities.push(10 + Math.floor(Math.random() * 90))
        citizenOwnAttributes = getRandomAttributes(language)
        citizenWishedAttributes = getRandomAttributes(language)
        citizenMustAttribute = getRandomAttributes(language, 1, citizenWishedAttributes)
        citizenBio = citizenDescription(h<=5 ? "Femenine" : "Masculine", language, (h<=5 ? descriptionText1[language]["F"] : descriptionText1[language]["M"]), citizenOwnAttributes)+".</br>"
        citizenBio+= citizenDescription(h<=5 ? "Masculine" : "Femenine", language, (h<=5 ? descriptionText2[language]["F"] : descriptionText2[language]["M"]), citizenWishedAttributes)+".</br>"
        citizenBio+= citizenDescription(h<=5 ? "Masculine" : "Femenine", language, (h<=5 ? descriptionText3[language]["F"] : descriptionText3[language]["M"]), citizenMustAttribute)
        citizenDescriptions.push(citizenBio)
        
        //Ubicar descripción en panel de habitante actual
        document.querySelector("#citizen-"+h+"-description").innerHTML = "\""+citizenDescriptions[h-1]+"\""
        
        //Ubicar edad en panel de habitante actual
        let birthweek = Math.floor(-citizenBirthweeks[h-1]), ageYears = Math.floor(citizenBirthweeks[h-1]/52), ageWeeks = citizenBirthweeks[h-1] % 52
        document.querySelector("#citizen-"+h+"-birthWeek").innerText = birthweek
        document.querySelector("#citizen-"+h+"-ageYears").innerText = ageYears
        document.querySelector("#citizen-"+h+"-ageWeeks").innerText = ageWeeks
        //Define age icon according to citizen's weekage
        iconGroup = "fa"; ageColour = "text-white"
        ageClass = (ageYears <= 5 ? "fa-baby" : (ageYears < 15 ? "fa-child" : (ageYears < 21 ? "fa-person-walking" : (ageYears < 50 ? "fa-person" : (ageYears < 65 ? "fa-person" : "fa-person-cane"))))); 
        document.querySelector("#citizen-"+h+"-age-icon").classList.remove("hidden")
        document.querySelector("#citizen-"+h+"-age-icon").classList.add(iconGroup, ageClass, ageColour)
        //Ubicar fertilidad en panel de habitante actual
        document.querySelector("#citizen-"+h+"-fertility").innerHTML = citizenFertilities[h-1]
        attributeGroups = JSON.parse(JSON.stringify(attributes[language]))
        //document.querySelector("#citizen-"+h+"-role").innerHTML += " - " + (citizenWeekDeaths[h-1] - citizenBirthweeks[h-1]) 
    }
}

initColonyInfo()

accordionNews()
accordionColony()
accordionBuildings()
accordionCitizens(citizensAmount)
accordionLandforms()
accordionExpeditions()

fillCitizenInfo()
translateAll(language)
setRandomNames(language)

enableNotificationEvents()

let assignRoleToCitizen = (rolekey, roleText, roleIcon, assignRolePanelExists = true) => {
    //Check if citizen is idle or busy.
    if(document.querySelector("#citizen-"+citizenIndex+"-status").getAttribute("data-status") == "idle"){
        //Check previous role if exists.
        previousRole = document.querySelector("#citizen-"+citizenIndex+"-role").getAttribute("data-role")
        //If citizen have had another role previously, change all panels in which the role was involved
        if(previousRole != translate(language, "Unassigned")){ postconditionsChangingRole(previousRole, citizenIndex) }
        //Update role in Citizen's info.
        document.querySelector("#citizen-"+citizenIndex+"-role").innerText = roleText
        document.querySelector("#citizen-"+citizenIndex+"-role").setAttribute("data-role", rolekey)
        //Update role icon in Citizen's info.
        document.querySelector("#citizen-"+citizenIndex+"-role-icon").classList.remove("hidden")
        document.querySelector("#citizen-"+citizenIndex+"-role-icon").classList = "text-green-500 fa me-1 fa-"+roleIcon
        if(assignRolePanelExists){
            assignRolePanel.removePanel()
            assignRolePanel.showPreviousOptions()
        }
        //New role is "Water bearer"?
        if(["waterbearing", "fishing"].includes(rolekey)){
            //Add citizen to Water Reservoir Available workers.
            addAvailableWorkerToMount(citizenIndex, "waterReservoir")
            document.getElementById("citizen-"+citizenIndex+"-assign").setAttribute("data-class", "waterReservoir")
            document.getElementById("citizen-"+citizenIndex+"-assign").addEventListener("click", handleToggleWorker)
        }
        if(rolekey == "expeditioning"){
            if(document.querySelector(".newExpedition") != null){
                addAvailableWorkerToExpedition(citizenIndex, "newExpedition")
                document.getElementById("citizen-"+citizenIndex+"-assign").setAttribute("data-class", "newExpedition")
                document.getElementById("citizen-"+citizenIndex+"-assign").addEventListener("click", handleToggleWorker)
            }
        }
        /*
        //Check if there is a new expedition panel opened to add expeditionary as available there.
        let availableWorkersPanel = document.querySelector("#newExpedition-available-workers .availableWorkers")
        if(availableWorkersPanel!=null){
            addAvailableWorkerToExpedition(citizenIndex, "newExpedition")
            document.getElementById("citizen-"+citizenIndex+"-assign").setAttribute("data-class", "newExpedition")
            document.getElementById("citizen-"+citizenIndex+"-assign").addEventListener("click", handleToggleWorker)
        }
        */
    } else {
        modalPopup("Can't change role", "RoleCitizenBusy")
        modal.show()
    }
}

//Testing functionality
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    searchingZone = true
    //Avoid modal pop up when zone searched
    showModalZoneSearched = false
    //Assign role to citizen 1 & 6 manually
    citizenIndex = 1;
    assignRoleToCitizen("expeditioning", translate(language, "Expeditionary", "f"), "map-location-dot", false)
    citizenIndex = 6;
    assignRoleToCitizen("expeditioning", translate(language, "Expeditionary", "m"), "map-location-dot", false)
    //daysPassed = 6
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let handleToggleHorse = (e) => {
    e.target.removeEventListener("click", handleToggleHorse)
    if(e.target.classList.contains("fa-plus")){
        addAssignedHorseToExpedition(e.target.closest("h2"))
    } else {
        deassignHorseToExpedition(e.target.closest("h2"))
    }
    //Check amount of citizens and horses already assigned.
    let expeditionariesAlreadyAssigned = document.querySelectorAll(".assignedWorkers .assignedWorker").length
    let horsesAlreadyAssigned = document.querySelectorAll(".assignedWorkers .assignedHorse").length
    let timeString = ""
    if(expeditionariesAlreadyAssigned){
        //Calculate required expedition time.
        let timeRequired = expeditionRequiredTime(resourcesExpeditionsDone, (expeditionariesAlreadyAssigned <= horsesAlreadyAssigned) ? expeditionariesAlreadyAssigned : 0)
        //Update expedition required time.
        document.getElementById("newExpedition-required-info").classList.remove("hidden")
        document.querySelectorAll(".unknownTime").forEach((elem) => elem.classList.add("hidden"))
        if(timeRequired.inGame.clock.years > 0){ 
            document.getElementById("newExpedition-required-years").classList.remove("hidden")
            document.getElementById("newExpedition-required-yearsText").classList.remove("hidden")
            document.getElementById("newExpedition-required-yearsComma").classList.remove("hidden")
            document.getElementById("newExpedition-required-years").innerText = timeRequired.inGame.clock.years
        }
        if(timeRequired.inGame.clock.weeks > 0){ 
            document.getElementById("newExpedition-required-weeks").classList.remove("hidden")
            document.getElementById("newExpedition-required-weeksText").classList.remove("hidden")
            document.getElementById("newExpedition-required-weeksComma").classList.remove("hidden")
            document.getElementById("newExpedition-required-weeks").innerText = timeRequired.inGame.clock.weeks
        }
        if(timeRequired.inGame.clock.days > 0){ 
            document.getElementById("newExpedition-required-days").classList.remove("hidden")
            document.getElementById("newExpedition-required-daysText").classList.remove("hidden")
            document.getElementById("newExpedition-required-daysComma").classList.remove("hidden")
            document.getElementById("newExpedition-required-days").innerText = timeRequired.inGame.clock.days
        }
        document.getElementById("newExpedition-required-hours").innerText = timeRequired.inGame.clock.hours
    } else {
        if(lifeStarted){
            document.getElementById("expeditionStart").classList.add("hidden")
            document.getElementById("newExpeditionNoActions").classList.remove("hidden")
        } else {
            document.querySelectorAll("#searchZoneWarning").forEach((element) => { element.classList.add("hidden") })
        }
        //Hide required time info and show "(Unknown yet)"
        document.getElementById("newExpedition-required-info").classList.add("hidden")
        document.querySelectorAll(".unknownTime").forEach((elem) => elem.classList.remove("hidden"))
    }
    e.target.addEventListener("click", handleToggleHorse)
}
let handleToggleWorker = (e) => {
    e.target.removeEventListener("click", handleToggleWorker)
    //Get citizen index
    let citizenIndex = e.target.id.split("-")[1]
    //Get expedition type
    let expeditionType = document.querySelector("#expeditions-newExpedition .expeditionType span:last-child").getAttribute("data-type")
    let expeditionTypeText
    //Define type description to be included in "Start expedition" button
    switch (expeditionType){
        case "of resources": expeditionTypeText = "Start resources mounts expedition"; break
        case "of ruins": expeditionTypeText = "Start ancient ruins expedition"; break
        case "of combat": expeditionTypeText = "Start attack expedition"; break
    }
    //If expeditionary is about to be added up, check if it has to be added to a mount or a new expedition
    if(e.target.classList.contains("fa-plus")){
        if(["waterReservoir", "stoneMount", "clayMount", "woodMount", "mine"].includes(e.target.getAttribute("data-class"))){
            addAssignedWorkerToMount(citizenIndex, e.target.getAttribute("data-class"))
        } else {
            if(e.target.getAttribute("data-class") == "newExpedition") {
                addAssignedWorkerToExpedition(citizenIndex, e.target.getAttribute("data-class"))
            }
        }
    } else {
        if(["waterReservoir", "stoneMount", "clayMount", "woodMount", "mine"].includes(e.target.getAttribute("data-class"))){
            deassignWorkerToMount(citizenIndex, e.target.getAttribute("data-class"))
        } else {
            if(e.target.getAttribute("data-class") == "newExpedition") {
                deassignWorkerToExpedition(citizenIndex, e.target.getAttribute("data-class"))
            }
        }
    }
    //Check amount of citizens and horses already assigned.
    let expeditionariesAlreadyAssigned = document.querySelectorAll(".assignedWorkers .assignedWorker").length
    let horsesAlreadyAssigned = document.querySelectorAll(".assignedWorkers .assignedHorse").length
    //Calculate probability of finding a new resources mount.
    let mountDiscoveryProbability = resourcesExpeditionProbability(resourcesExpeditionsDone, expeditionariesAlreadyAssigned)*1
    if(lifeStarted){
        //Show "Start new expedition" button and hide "No actions available"
        document.querySelector("#expeditionStart span").innerText = translate(language, expeditionTypeText)
        document.getElementById("newExpeditionNoActions").classList.add("hidden")
        document.getElementById("expeditionStart").classList.remove("hidden")
        //Add click "Start new expedition" button event
        document.querySelector("#expeditionStart").addEventListener("click", (e) => {
            //Prepare expedition data to add in new Active Expedition panel.
            let departedInHours = document.getElementById("currentHour").innerText
            let departedInDays = document.getElementById("currentDay").innerText
            let departedInWeeks = document.getElementById("currentWeek").innerText
            let departedInYears = document.getElementById("currentYear").innerText
            let returnsInHours = document.getElementById("newExpedition-required-hours").innerText
            let returnsInDays = document.getElementById("newExpedition-required-days").innerText
            let returnsInWeeks = document.getElementById("newExpedition-required-weeks").innerText
            let returnsInYears = document.getElementById("newExpedition-required-years").innerText
            //Define data to be parsed while building active expedition panel.
            let expeditionData = {
                "id": expeditionIndex,
                "departedIn":{"year":departedInYears, "week":departedInWeeks, "day":departedInDays, "hour":departedInHours},
                "returnsIn":{"years":returnsInYears, "weeks":returnsInWeeks, "days":returnsInDays, "hours":returnsInHours},
                "crew":[]
            }
            let expeditionMember
            document.querySelectorAll("#newExpedition-assigned-workers h2").forEach((elem) => {
                expeditionMember = {}
                expeditionMember.index = elem.id.split("-")[2]
                expeditionMember.type = elem.classList.contains("assignedWorker") ? "expeditionary" : "horse"
                if(expeditionMember.type == "expeditionary"){
                    expeditionMember.name = elem.querySelector("div span span:last-child").innerText
                    expeditionMember.gender = elem.querySelector("div span i:first-child").classList.contains("fa-venus") ? "F" : "M"
                    expeditionMember.age = elem.querySelector("div span i:nth-child(2)").classList.contains("fa-person") 
                                            ? "adult" 
                                            : elem.querySelector("div span i:nth-child(2)").classList.contains("fa-person")
                                                ? "ancient"
                                                : elem.querySelector("div span i:nth-child(2)").classList.contains("fa-person")
                                                    ? "grown adult"
                                                    : elem.querySelector("div span i:nth-child(2)").classList.contains("fa-person")
                                                        ? "teen"
                                                        : elem.querySelector("div span i:nth-child(2)").classList.contains("fa-person")
                                                            ? "child"
                                                            : "baby"
                    expeditionMember.xp = elem.querySelector("div span:first-child span").innerText
                }
                expeditionData.crew.push(expeditionMember)
            })
            //Display active expedition with all its data
            buildActiveExpedition(document.getElementById("active-expeditions-area"), expeditionData)
            enableAccordions("#accordion-expedition-"+expeditionIndex+" [data-accordion-target]")
            //Remove new expedition panel.
            newExpeditionPanel.removePanel()
            newExpeditionPanel.showPreviousOptions()
            expeditionIndex++
        })
    } else {
        //Can't start new expedition if life hasn't started. Search zone needed.
        document.querySelectorAll("#searchZoneWarning").forEach((element) => { element.classList.remove("hidden") })
    }
    if(mountDiscoveryProbability > 0){
        document.getElementById("expeditionProbability").innerText = (mountDiscoveryProbability * 100).toFixed(1)+"%"
    } else {
        document.getElementById("expeditionProbability").innerText = "("+translate(language, "Unknown yet", "f")+")"
        if(lifeStarted){
            document.getElementById("expeditionStart").classList.add("hidden")
            document.getElementById("newExpeditionNoActions").classList.remove("hidden")
        } else {
            document.querySelectorAll("#searchZoneWarning").forEach((element) => { element.classList.add("hidden") })
        }
    }
    let timeString = ""
    //Expedition crew well formed? It has at least one expeditionary or horse?
    if(expeditionariesAlreadyAssigned + horsesAlreadyAssigned){
        if(e.target.getAttribute("data-class") == "newExpedition"){
            //Calculate required expedition time.
            let timeRequired = expeditionRequiredTime(resourcesExpeditionsDone, (expeditionariesAlreadyAssigned <= horsesAlreadyAssigned) ? expeditionariesAlreadyAssigned : 0)
            //Update expedition required time.
            document.getElementById("newExpedition-required-info").classList.remove("hidden")
            document.querySelectorAll(".unknownTime").forEach((elem) => elem.classList.add("hidden"))
            if(timeRequired.inGame.clock.years > 0){ 
                document.getElementById("newExpedition-required-years").classList.remove("hidden")
                document.getElementById("newExpedition-required-yearsText").classList.remove("hidden")
                document.getElementById("newExpedition-required-yearsComma").classList.remove("hidden")
                document.getElementById("newExpedition-required-years").innerText = timeRequired.inGame.clock.years
            }
            if(timeRequired.inGame.clock.weeks > 0){ 
                document.getElementById("newExpedition-required-weeks").classList.remove("hidden")
                document.getElementById("newExpedition-required-weeksText").classList.remove("hidden")
                document.getElementById("newExpedition-required-weeksComma").classList.remove("hidden")
                document.getElementById("newExpedition-required-weeks").innerText = timeRequired.inGame.clock.weeks
            }
            if(timeRequired.inGame.clock.days > 0){ 
                document.getElementById("newExpedition-required-days").classList.remove("hidden")
                document.getElementById("newExpedition-required-daysText").classList.remove("hidden")
                document.getElementById("newExpedition-required-daysComma").classList.remove("hidden")
                document.getElementById("newExpedition-required-days").innerText = timeRequired.inGame.clock.days
            }
            document.getElementById("newExpedition-required-hours").innerText = timeRequired.inGame.clock.hours
        }
    } else {
        if(lifeStarted){
            document.getElementById("expeditionStart").classList.add("hidden")
            document.getElementById("newExpeditionNoActions").classList.remove("hidden")
        } else {
            document.querySelectorAll("#searchZoneWarning").forEach((element) => { element.classList.add("hidden") })
        }
        //Hide required time info and show "(Unknown yet)"
        document.getElementById("newExpedition-required-info").classList.add("hidden")
        document.querySelectorAll(".unknownTime").forEach((elem) => elem.classList.remove("hidden"))
    }
    e.target.addEventListener("click", handleToggleWorker)
}
//Panel Citizens - Action: Assign Role
document.querySelectorAll(".assignRole").forEach((value, index) => {
    value.addEventListener("click", function(e){
        //Get citizen & gender
        citizenIndex = e.target.id ? e.target.id.match(/\d+/g)[0] : e.target.parentElement.id.match(/\d+/g)[0]
        gender = document.querySelector("#citizen-"+citizenIndex+"-gender-icon").classList.contains("fa-venus") ? "F" : "M"
        let objectData = {"language": language, "gender": gender, "parentId": "#accordion-citizen-"+citizenIndex+"-body"}
        //Build assign role panel
        assignRolePanel = new panel("assignRole", objectData, "citizen", citizenIndex, "actions")
        assignRolePanel.hidePreviousOptions()
        assignRolePanel.buildPanel()
        //For each button with an assignable role, add a click event
        document.querySelectorAll(".assignableRole").forEach((valueButton) => {
            valueButton.addEventListener("click", (e) => {
                assignRoleToCitizen(e.target.getAttribute("data-rolekey"), e.target.innerText, e.target.getAttribute("data-icon"))
            })
        })
    })
})

document.querySelector("#searchZone").addEventListener("click", searchZone)