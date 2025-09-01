//Long term global variables
var language = "ES", citizensFemaleAmount, citizensMaleAmount
var citizens = [], pregnancies = []
var daysPassed = 0, dayPassed = weekPassed = yearPassed = false, searchingZone = zoneSearched = lifeStarted = false
var colony_water_reservoir = "", resourcesExpeditionsDone = 0, ruinsExpeditionsDone = 0, huntingMountDiscovered = false
var wagonsAmount, horsesAmount
var colonyScore, colonyLifeQuality
var rule_last_id = 0
//Constants
const zoneSearchHoursNeeded = 10
const minimalExpeditionDuration = 0 //In game hours
const same_age_in_relationship_attraction_percent = 5
//Expeditionaries xp gain
const resourcesExpeditionSuccessXPGain = 1
const resourcesExpeditionFailXPGain = 0.25
const ruinsExpeditionSuccessXPGain = 0.5
const ruinsExpeditionFailXPGain = 0.1
//Citizen vital needs
const citizenDailyWaterNeeds = 2 //liquid litres per day
const citizenDailyFoodNeeds = 1 //kilograms per day
//User configuration variables
var showModalZoneSearched = true
//Temporary global variables
var citizenIndex, expeditionIndex = 1, rule_id = 1, relationship_id = 1
var currently_used_panel
var initial_population = 10, initial_water_income = 28, initial_food_income = 20

//Ruins expedition resource or product loots probabilities
var ruinsExpeditionResourcesFoundProbability = 0.6, ruinsExpeditionProductsFoundProbability = 0.4
var ruinsExpeditionStoneMountResourcesProbability = 0.3
var ruinsExpeditionClayMountResourcesProbability = 0.27
var ruinsExpeditionWoodMountResourcesProbability = 0.23
var ruinsExpeditionIronMountResourcesProbability = 0.2
var ruinsExpeditionResourceCategoriesProbability = [0.42, 0.26, 0.16, 0.11, 0.05]
var ruinsExpeditionProductCategoriesProbability = [0.4, 0.25, 0.15, 0.1, 0.07, 0.03]
var ruinsExpeditionStonesmithProductsProbability = 0.16
var ruinsExpeditionWoodsmithProductsProbability = 0.15
var ruinsExpeditionFarmProductsProbability = 0.15
var ruinsExpeditionBarnyardProductsProbability = 0.14
var ruinsExpeditionSlaughterhouseProductsProbability = 0.12
var ruinsExpeditionMillProductsProbability = 0.1
var ruinsExpeditionFurnacesProductsProbability = 0.07
var ruinsExpeditionSawmillProductsProbability = 0.05
var ruinsExpeditionBlacksmithProductsProbability = 0.03
var ruinsExpeditionWorkshopProductsProbability = 0.02
var ruinsExpeditionTextileProductsProbability = 0.01
//General dinamic panels
var newExpeditionPanel, assignRolePanel