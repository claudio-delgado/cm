var language, citizensAmount, citizensFemaleAmount, citizensMaleAmount
var daysPassed = 0, dayPassed = weekPassed = false, searchingZone = zoneSearched = lifeStarted = false
var colonyWaterReservoir = ""
var wagonsAmount, horsesAmount
var colonyScore, colonyLifeQuality

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
let searchZone = () => {
    document.querySelector("#searchZone > span").innerText = translate(language, "Your citizens are searching the zone...")
    document.querySelector("#searchZone > i").classList.add("fa-beat")
    searchingZone = true
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
        zoneSearched = currentYear == 1 && currentWeek == 1 && currentDay == 1 && currentHour == 3
        //Perform updating tasks inside game panels that involve daily changes
        //Efectuar tareas de actualización de partes del juego que involucren avances diarios.
        //console.log("y"+currentYear+"w"+currentWeek+"d"+currentDay+"h"+currentHour+", daysPassed: "+daysPassed+" dayPassed: "+dayPassed+", weekPassed: "+weekPassed)
        if(zoneSearched){
            searchingZone = false
            lifeStarted = true
            //Remove search zone button from Colony's available actions
            document.querySelector("#colony-actions > p > button").remove()
            s = new element("span", "", [{"key":"data-i18n", "value":""}], document.querySelector("#colony-actions > p")); s.create(); s.appendContent(translate(language, "No actions available"))
            //Remove warning
            document.querySelector("#searchZoneWarning").remove()
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
            modalPopup("Zone researched!", "ZoneSearched")
            modal.show()
            //Update all water bearers and fishermen status (from "assigned" to "working")
            document.querySelectorAll('[data-status="assigned"]').forEach((citizenStatus) => {
                let citizenIndex = citizenStatus.id.split("-")[1]
                if(["waterbearing", "fishing"].includes(document.getElementById("citizen-"+citizenIndex+"-role").getAttribute("data-role"))){
                    citizenStatus.innerHTML = translate(language, "Working")
                }
            })
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

//searchZone()
fillCitizenInfo()
translateAll(language)
setRandomNames(language)

enableNotificationEvents()
//daysPassed = 6

let citizenIndex
let handleToggleWorker = (e) => {
    e.target.removeEventListener("click", handleToggleWorker)
    //Get citizen index
    let citizenIndex = e.target.id.split("-")[1]
    //if(document.querySelector(".waterReservoir .assignedWorkers #assigned-citizen-"+citizenIndex) == null){
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
        let assignRolePanel = new panel("assignRole", objectData, "citizen", citizenIndex, "actions")
        assignRolePanel.hidePreviousOptions()
        assignRolePanel.buildPanel()
        //For each button with an assignable role, add a click event
        document.querySelectorAll(".assignableRole").forEach((valueButton) => {
            valueButton.addEventListener("click", (e) => {
                //Check if citizen is idle or busy.
                if(document.querySelector("#citizen-"+citizenIndex+"-status").innerText == translate(language, "Idle")){
                    //Check previous role if exists.
                    previousRole = document.querySelector("#citizen-"+citizenIndex+"-role").getAttribute("data-role")
                    //If citizen have had another role previously, change all panels in which the role was involved
                    if(previousRole != translate(language, "Unassigned")){ postconditionsChangingRole(previousRole, citizenIndex) }
                    //Update role in Citizen's info.
                    document.querySelector("#citizen-"+citizenIndex+"-role").innerText = e.target.innerText
                    document.querySelector("#citizen-"+citizenIndex+"-role").setAttribute("data-role", e.target.getAttribute("data-rolekey"))
                    //document.querySelector("#citizen-"+citizenIndex+"-role").setAttribute("data-role", )
                    //Update role icon in Citizen's info.
                    document.querySelector("#citizen-"+citizenIndex+"-role-icon").classList.remove("hidden")
                    document.querySelector("#citizen-"+citizenIndex+"-role-icon").classList = "text-green-500 fa me-1 fa-"+e.target.getAttribute("data-icon")
                    assignRolePanel.removePanel()
                    assignRolePanel.showPreviousOptions()
                    //New role is "Water bearer"?
                    if(["waterbearing", "fishing"].includes(e.target.getAttribute("data-rolekey"))){
                        //Add citizen to Water Reservoir Available workers.
                        addAvailableWorkerToMount(citizenIndex, "waterReservoir")
                        document.getElementById("citizen-"+citizenIndex+"-assign").setAttribute("data-class", "waterReservoir")
                        document.getElementById("citizen-"+citizenIndex+"-assign").addEventListener("click", handleToggleWorker)
                    }
                    if(e.target.getAttribute("data-rolekey") == "expeditioning"){
                        if(document.querySelector(".newExpedition") != null){
                            addAvailableWorkerToExpedition(citizenIndex, "newExpedition")
                            document.getElementById("citizen-"+citizenIndex+"-assign").setAttribute("data-class", "newExpedition")
                            document.getElementById("citizen-"+citizenIndex+"-assign").addEventListener("click", handleToggleWorker)
                        }
                    }
                } else {
                    modalPopup("Can't change role", "RoleCitizenBusy")
                    modal.show()
                }
            })
        })
    })
})

document.querySelector("#searchZone").addEventListener("click", function(e){
    e.target.removeEventListener("click", function(){})
    searchZone()
})

