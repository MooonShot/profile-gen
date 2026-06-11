export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export const TABS = ['Profile Generator', 'Address Generator', 'Name Generator', 'Phone Generator']

export const TAB_DESCS = [
  'Complete profiles: name, gender, phone, DOB, and a real geocoded address from the selected area.',
  'Real addresses geocoded from the selected area via Mapbox.',
  'First + last names with matching gender.',
  'Phone numbers with correct country code for the selected region.',
]

export const COUNTRIES = {
  FR: 'France',
  GB: 'United Kingdom',
  DE: 'Germany',
  US: 'United States',
  ES: 'Spain',
  IT: 'Italy',
  NL: 'Netherlands',
  BE: 'Belgium',
}

export const COUNTRY_CENTERS = {
  FR: [2.35, 46.5],
  GB: [-2, 54],
  DE: [10.4, 51.2],
  US: [-98, 39],
  ES: [-3.7, 40.4],
  IT: [12.5, 42],
  NL: [5.3, 52.3],
  BE: [4.4, 50.5],
}

export const COUNTRY_ZOOM = {
  FR: 4.8, GB: 4.8, DE: 5, US: 3.2,
  ES: 5, IT: 5, NL: 6.5, BE: 7,
}

export const PHONE_PREFIX = {
  FR: '+33', GB: '+44', DE: '+49', US: '+1',
  ES: '+34', IT: '+39', NL: '+31', BE: '+32',
}

export const DEFAULT_BBOX = {
  FR: [[-5, 41], [9.6, 51.1]],
  GB: [[-8.7, 49.8], [1.8, 60.9]],
  DE: [[5.8, 47.2], [15.1, 55.1]],
  US: [[-125, 24], [-66, 49]],
  ES: [[-9.4, 35.9], [4.4, 43.8]],
  IT: [[6.6, 35.5], [18.8, 47.1]],
  NL: [[3.3, 50.7], [7.3, 53.6]],
  BE: [[2.5, 49.5], [6.4, 51.5]],
}

export const FIRST_NAMES_M = ['James','Liam','Noah','Oliver','William','Lucas','Henry','Alexander','Mason','Ethan','Daniel','Matthew','Jackson','Samuel','David','Joseph','Carter','Owen','Wyatt','John','Jack','Luke','Julian','Levi','Isaac','Gabriel','Anthony','Dylan','Lincoln','Caleb','Joshua','Christopher','Andrew','Theodore','Ryan','Nathan','Aaron','Leo','Hunter','Christian','Eli','Ezra','Isaiah','Nolan','Adrian','Diego','Evan','Cameron','Jordan','Adam','Kevin','Chase','Austin','Jason','Logan','Tyler','Zachary','Brandon','Xavier','Dominic','Ian','Max','Cole','Gavin','Tristan','Hugo','Felix','Jasper','Vincent','Elliot','Marcus','Miles','Tobias','Mateo','Elias','Kai','Finn','Declan','Rowan','Emmett','August','Silas','Atlas']

export const FIRST_NAMES_F = ['Emma','Olivia','Ava','Isabella','Sophia','Charlotte','Mia','Amelia','Harper','Evelyn','Abigail','Emily','Elizabeth','Mila','Ella','Avery','Sofia','Camila','Aria','Scarlett','Victoria','Madison','Luna','Grace','Chloe','Penelope','Layla','Riley','Zoey','Nora','Lily','Eleanor','Hannah','Lillian','Addison','Aubrey','Ellie','Stella','Natalie','Zoe','Leah','Hazel','Violet','Aurora','Savannah','Audrey','Brooklyn','Bella','Claire','Skylar','Lucy','Paisley','Everly','Anna','Caroline','Nova','Emilia','Kennedy','Samantha','Maya','Willow','Kinsley','Naomi','Aaliyah','Elena','Sarah','Ariana','Allison','Gabriella','Alice','Madelyn','Cora','Ruby','Eva','Serenity','Autumn','Adeline','Hailey','Gianna','Valentina','Iris','Freya','Isla','Piper','Quinn']

export const LAST_NAMES = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Martinez','Wilson','Anderson','Taylor','Thomas','Hernandez','Moore','Martin','Jackson','Thompson','White','Lopez','Lee','Gonzalez','Harris','Clark','Lewis','Robinson','Walker','Perez','Hall','Young','Allen','Sanchez','Wright','King','Scott','Green','Baker','Adams','Nelson','Hill','Ramirez','Campbell','Mitchell','Roberts','Carter','Phillips','Evans','Turner','Torres','Parker','Collins','Edwards','Stewart','Flores','Morris','Nguyen','Murphy','Rivera','Cook','Rogers','Morgan','Peterson','Cooper','Reed','Bailey','Bell','Gomez','Kelly','Howard','Ward','Cox','Diaz','Richardson','Wood','Watson','Brooks','Bennett','Gray','James','Reyes','Cruz','Hughes','Price','Myers','Long','Foster','Sanders','Ross','Morales','Powell','Sullivan','Russell','Ortiz']
