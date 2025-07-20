const tests = () => {
    daysPassed = 5
    let new_citizen = {}
    new_citizen.id = citizens.length
    new_citizen.father = 6
    new_citizen.mother = 1
    new_citizen.children = []
    new_citizen.couple = null
    new_citizen.role = new_citizen.rolekey = "unassigned"
    new_citizen.birthWeek = document.getElementById("passedWeeks").innerHTML*1 - 780 //Just born assumed
    new_citizen.birthWeeks = 780 //Weeks already lived.
    new_citizen.ageYears = 15 //Just born assumed
    new_citizen.ageWeeks = 0 //Just born assumed
    new_citizen.status = "idle"
    new_citizen.gender = ["Femenine", "Masculine"][Math.floor(Math.random()*2)]
    new_citizen.name = set_random_name(language, new_citizen.gender)
    new_citizen.xp = 0
    new_citizen.leftHand = new_citizen.rightHand = ""
    new_citizen.outfit = "No"
    new_citizen.fertility = 10 + Math.floor(Math.random() * 91)
    build_citizen(translation = true, new_citizen.id, new_citizen)
}
export default tests