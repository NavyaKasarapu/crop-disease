import { DiseaseInfo } from '../types/prediction';

export interface PlantVillageClass {
  id: string;
  crop: string;
  condition: string;
  isHealthy: boolean;
  sampleCount: number;
}

// 38 PlantVillage Classes Breakdown
export const PLANT_VILLAGE_CLASSES: PlantVillageClass[] = [
  { id: 'apple_scab', crop: 'Apple', condition: 'Apple Scab', isHealthy: false, sampleCount: 630 },
  { id: 'apple_black_rot', crop: 'Apple', condition: 'Black Rot', isHealthy: false, sampleCount: 621 },
  { id: 'apple_cedar_rust', crop: 'Apple', condition: 'Cedar Apple Rust', isHealthy: false, sampleCount: 275 },
  { id: 'apple_healthy', crop: 'Apple', condition: 'Healthy', isHealthy: true, sampleCount: 1645 },
  { id: 'blueberry_healthy', crop: 'Blueberry', condition: 'Healthy', isHealthy: true, sampleCount: 1502 },
  { id: 'cherry_powdery_mildew', crop: 'Cherry', condition: 'Powdery Mildew', isHealthy: false, sampleCount: 1052 },
  { id: 'cherry_healthy', crop: 'Cherry', condition: 'Healthy', isHealthy: true, sampleCount: 854 },
  { id: 'corn_cercospora', crop: 'Corn (Maize)', condition: 'Cercospora Leaf Spot (Gray Leaf Spot)', isHealthy: false, sampleCount: 513 },
  { id: 'corn_common_rust', crop: 'Corn (Maize)', condition: 'Common Rust', isHealthy: false, sampleCount: 1192 },
  { id: 'corn_northern_leaf_blight', crop: 'Corn (Maize)', condition: 'Northern Leaf Blight', isHealthy: false, sampleCount: 985 },
  { id: 'corn_healthy', crop: 'Corn (Maize)', condition: 'Healthy', isHealthy: true, sampleCount: 1162 },
  { id: 'grape_black_rot', crop: 'Grape', condition: 'Black Rot', isHealthy: false, sampleCount: 1180 },
  { id: 'grape_esca', crop: 'Grape', condition: 'Esca (Black Measles)', isHealthy: false, sampleCount: 1383 },
  { id: 'grape_leaf_blight', crop: 'Grape', condition: 'Leaf Blight (Isariopsis Leaf Spot)', isHealthy: false, sampleCount: 1076 },
  { id: 'grape_healthy', crop: 'Grape', condition: 'Healthy', isHealthy: true, sampleCount: 423 },
  { id: 'orange_haunglongbing', crop: 'Orange', condition: 'Huanglongbing (Citrus Greening)', isHealthy: false, sampleCount: 5507 },
  { id: 'peach_bacterial_spot', crop: 'Peach', condition: 'Bacterial Spot', isHealthy: false, sampleCount: 2297 },
  { id: 'peach_healthy', crop: 'Peach', condition: 'Healthy', isHealthy: true, sampleCount: 360 },
  { id: 'pepper_bacterial_spot', crop: 'Pepper Bell', condition: 'Bacterial Spot', isHealthy: false, sampleCount: 997 },
  { id: 'pepper_healthy', crop: 'Pepper Bell', condition: 'Healthy', isHealthy: true, sampleCount: 1478 },
  { id: 'potato_early_blight', crop: 'Potato', condition: 'Early Blight', isHealthy: false, sampleCount: 1000 },
  { id: 'potato_late_blight', crop: 'Potato', condition: 'Late Blight', isHealthy: false, sampleCount: 1000 },
  { id: 'potato_healthy', crop: 'Potato', condition: 'Healthy', isHealthy: true, sampleCount: 152 },
  { id: 'raspberry_healthy', crop: 'Raspberry', condition: 'Healthy', isHealthy: true, sampleCount: 371 },
  { id: 'soybean_healthy', crop: 'Soybean', condition: 'Healthy', isHealthy: true, sampleCount: 5090 },
  { id: 'squash_powdery_mildew', crop: 'Squash', condition: 'Powdery Mildew', isHealthy: false, sampleCount: 1835 },
  { id: 'strawberry_leaf_scorch', crop: 'Strawberry', condition: 'Leaf Scorch', isHealthy: false, sampleCount: 1109 },
  { id: 'strawberry_healthy', crop: 'Strawberry', condition: 'Healthy', isHealthy: true, sampleCount: 456 },
  { id: 'tomato_bacterial_spot', crop: 'Tomato', condition: 'Bacterial Spot', isHealthy: false, sampleCount: 2127 },
  { id: 'tomato_early_blight', crop: 'Tomato', condition: 'Early Blight', isHealthy: false, sampleCount: 1000 },
  { id: 'tomato_late_blight', crop: 'Tomato', condition: 'Tomato Late Blight', isHealthy: false, sampleCount: 1909 },
  { id: 'tomato_leaf_mold', crop: 'Tomato', condition: 'Leaf Mold', isHealthy: false, sampleCount: 952 },
  { id: 'tomato_septoria_leaf_spot', crop: 'Tomato', condition: 'Septoria Leaf Spot', isHealthy: false, sampleCount: 1771 },
  { id: 'tomato_spider_mites', crop: 'Tomato', condition: 'Spider Mites (Two-Spotted Spider Mite)', isHealthy: false, sampleCount: 1676 },
  { id: 'tomato_target_spot', crop: 'Tomato', condition: 'Target Spot', isHealthy: false, sampleCount: 1404 },
  { id: 'tomato_yellow_leaf_curl', crop: 'Tomato', condition: 'Tomato Yellow Leaf Curl Virus', isHealthy: false, sampleCount: 3208 },
  { id: 'tomato_mosaic_virus', crop: 'Tomato', condition: 'Tomato Mosaic Virus', isHealthy: false, sampleCount: 373 },
  { id: 'tomato_healthy', crop: 'Tomato', condition: 'Healthy', isHealthy: true, sampleCount: 1591 }
];

export const AGRONOMIC_DISEASE_DB: Record<string, DiseaseInfo> = {
  'Tomato Late Blight': {
    name: 'Tomato Late Blight',
    plant: 'Tomato',
    scientificName: 'Phytophthora infestans',
    severity: 'high',
    symptoms: [
      'Large, irregular dark water-soaked lesions on upper foliage and stems.',
      'Pale green chlorotic borders surrounding rapidly expanding brown lesions.',
      'White fungal-like downy sporulation on the underside of leaves under humid conditions.',
      'Dark brown, greasy lesions appearing on green tomato fruit.'
    ],
    causes: [
      'Oomycete pathogen Phytophthora infestans.',
      'Prolonged cool, wet weather with temperatures between 15°C and 22°C (60°F - 72°F).',
      'Extended leaf wetness (more than 8 to 10 hours) and relative humidity exceeding 90%.'
    ],
    prevention: [
      'Plant certified disease-free transplants and resistant cultivars when available.',
      'Ensure adequate row spacing to promote canopy ventilation and rapid foliage drying.',
      'Avoid overhead sprinkler irrigation; implement drip or furrow irrigation to keep leaves dry.',
      'Regularly scout fields and remove infected volunteer plants and cull piles promptly.'
    ],
    optimalConditions: 'High humidity (>90%) with cool temperatures (15°C - 20°C).'
  },
  'Tomato Early Blight': {
    name: 'Tomato Early Blight',
    plant: 'Tomato',
    scientificName: 'Alternaria solani',
    severity: 'moderate',
    symptoms: [
      'Concentric ring-patterned brown spots ("target-like" or bullseye lesions) on older leaves.',
      'Yellow chlorotic halos developing around leaf spots as lesions expand.',
      'Premature defoliation starting from lower canopy moving upward, exposing fruit to sunscald.',
      'Stem lesions that appear sunken and elongated near soil level.'
    ],
    causes: [
      'Fungal pathogen Alternaria solani surviving in crop debris and solanaceous weeds.',
      'Alternating wet and dry periods with warm temperatures (24°C - 29°C / 75°F - 85°F).',
      'Plant stress caused by heavy fruit load, nitrogen deficiency, or drought.'
    ],
    prevention: [
      'Practice crop rotation with non-solanaceous crops for a minimum of 2-3 years.',
      'Apply organic or plastic mulch around plant bases to prevent soil splash during rain.',
      'Prune lower foliage (bottom 12-18 inches) once plants are established to reduce soil contact.',
      'Sanitize garden stakes, cages, and field equipment after each harvest cycle.'
    ],
    optimalConditions: 'Warm temperatures (24°C - 29°C) with frequent dew or rainfall cycles.'
  },
  'Tomato Yellow Leaf Curl Virus': {
    name: 'Tomato Yellow Leaf Curl Virus',
    plant: 'Tomato',
    scientificName: 'TYLCV (Begomovirus)',
    severity: 'high',
    symptoms: [
      'Upward curling and cupping of leaflet margins.',
      'Marked interveinal yellowing (chlorosis) and severe stunting of young shoots.',
      'Reduced leaf size, giving infected branches a bushy, compact appearance.',
      'Substantial flower drop, leading to minimal or aborted fruit set.'
    ],
    causes: [
      'Transmitted exclusively by the silverleaf whitefly (Bemisia tabaci).',
      'High whitefly population densities in warm, arid or semi-arid agricultural climates.'
    ],
    prevention: [
      'Install fine insect-exclusion netting (50-mesh) in greenhouses and seedling nurseries.',
      'Use reflective silver mulches to repel whitefly vectors from landing on young seedlings.',
      'Remove and safely dispose of early-infected plants to limit in-field viral reservoir.',
      'Select TYLCV-resistant or tolerant commercial tomato varieties.'
    ],
    optimalConditions: 'Warm, dry weather favoring prolific whitefly reproduction.'
  },
  'Tomato Bacterial Spot': {
    name: 'Tomato Bacterial Spot',
    plant: 'Tomato',
    scientificName: 'Xanthomonas campestris pv. vesicatoria',
    severity: 'moderate',
    symptoms: [
      'Small, circular dark-brown to black spots (1-3 mm) on foliage with water-soaked margins.',
      'Leaves take on a torn or ragged appearance as dry dead tissue falls out.',
      'Rough, raised, scab-like brown lesions on green and ripening fruit.'
    ],
    causes: [
      'Bacterial pathogen Xanthomonas introduced via infected seed or seedbeds.',
      'Dispersed through splashing water, windblown rain, and contact during field operations.'
    ],
    prevention: [
      'Use certified pathogen-free seeds treated with hot-water seed treatment protocols.',
      'Avoid entering fields or handling crop foliage while leaves are wet.',
      'Rotate fields away from peppers and tomatoes for at least 1-2 seasons.',
      'Incorporate resistant varieties and ensure balanced soil fertility.'
    ],
    optimalConditions: 'High temperatures (25°C - 30°C) combined with high rainfall or overhead watering.'
  },
  'Potato Early Blight': {
    name: 'Potato Early Blight',
    plant: 'Potato',
    scientificName: 'Alternaria solani',
    severity: 'moderate',
    symptoms: [
      'Small dark brown or black spots developing on older, mature foliage.',
      'Diagnostic concentric dark rings within spots giving a target appearance.',
      'Leaves turn yellow, dry out, and drop prematurely.',
      'Brown, dry, leathery sunken lesions on potato tuber skins.'
    ],
    causes: [
      'Soil-borne fungal pathogen Alternaria solani.',
      'Warm temperatures accompanied by frequent irrigation or high atmospheric humidity.'
    ],
    prevention: [
      'Plant high-quality certified seed tubers.',
      'Maintain adequate nitrogen and potassium fertilization to sustain vine vigor.',
      'Allow tuber skins to mature fully before harvest to minimize skinning and spore entry.'
    ]
  },
  'Potato Late Blight': {
    name: 'Potato Late Blight',
    plant: 'Potato',
    scientificName: 'Phytophthora infestans',
    severity: 'high',
    symptoms: [
      'Water-soaked dark lesions on leaves that rapidly enlarge into necrotic patches.',
      'White downy fungal growth on leaf undersides in high humidity.',
      'Purplish-brown granular rot extending into the tuber flesh.'
    ],
    causes: [
      'Phytophthora infestans oomycete.',
      'Cool temperatures (10°C - 20°C) with prolonged moisture.'
    ],
    prevention: [
      'Destroy all cull piles and volunteer potato plants before the growing season.',
      'Harvest only when vines are completely dead and dry.',
      'Store harvested tubers in well-ventilated, cool storage facilities.'
    ]
  },
  'Apple Scab': {
    name: 'Apple Scab',
    plant: 'Apple',
    scientificName: 'Venturia inaequalis',
    severity: 'moderate',
    symptoms: [
      'Olive-green to velvety dark brown lesions on the upper leaf surface.',
      'Distorted, curled leaves that fall early in the season.',
      'Dark, scabby corky spots on fruit that crack as the apple expands.'
    ],
    causes: [
      'Ascomycete fungus Venturia inaequalis overwintering in fallen leaves.',
      'Spring rain splashing ascospore inocula onto newly emerged apple leaves.'
    ],
    prevention: [
      'Rake, shred, or compost fallen autumn apple leaves to break the fungal life cycle.',
      'Prune tree canopy annually to facilitate sunlight penetration and wind drying.',
      'Plant apple cultivars with known genetic resistance to scab (e.g., Liberty, Enterprise).'
    ]
  },
  'Corn Northern Leaf Blight': {
    name: 'Corn Northern Leaf Blight',
    plant: 'Corn (Maize)',
    scientificName: 'Exserohilum turcicum',
    severity: 'moderate',
    symptoms: [
      'Long, elliptical cigar-shaped grayish-green to tan lesions (2.5 to 15 cm long).',
      'Lesions coalesce under favorable conditions, burning entire leaves.',
      'Dark fungal sporulation visible across mature lesions on humid mornings.'
    ],
    causes: [
      'Fungus Exserohilum turcicum surviving on corn residue on soil surface.',
      'Moderate temperatures (18°C - 27°C) accompanied by extended dew periods.'
    ],
    prevention: [
      'Select maize hybrids with designated Ht multi-gene resistance.',
      'Practice crop rotation with non-host crops such as soybeans or small grains.',
      'Deep tillage in fields with high residue where soil conservation practices permit.'
    ]
  },
  'Healthy': {
    name: 'Healthy Foliage',
    plant: 'Healthy Plant',
    scientificName: 'Physiologically Normal',
    severity: 'healthy',
    symptoms: [
      'Vibrant uniform green coloration without chlorosis or necrosis.',
      'Normal leaf morphology and turgidity without curling or wilting.',
      'Absence of fungal spots, viral mosaic patterns, or insect feeding scars.'
    ],
    causes: [
      'Balanced soil nutrition, optimal hydration, and effective pest management.',
      'Absence of pathogenic infection.'
    ],
    prevention: [
      'Continue routine agronomic management including balanced NPK fertility.',
      'Regular moisture monitoring through soil sensors or tensiometers.',
      'Maintain routine IPM (Integrated Pest Management) scouting schedules.'
    ]
  }
};

export function lookupDiseaseDetails(diseaseName: string, plantName?: string): DiseaseInfo | null {
  // Normalize lookup
  const cleanName = diseaseName.trim();
  
  if (AGRONOMIC_DISEASE_DB[cleanName]) {
    return AGRONOMIC_DISEASE_DB[cleanName];
  }

  // Check case-insensitive match
  const lower = cleanName.toLowerCase();
  for (const [key, value] of Object.entries(AGRONOMIC_DISEASE_DB)) {
    if (key.toLowerCase() === lower || key.toLowerCase().includes(lower)) {
      return value;
    }
  }

  // Check if it's healthy
  if (lower.includes('healthy')) {
    return {
      ...AGRONOMIC_DISEASE_DB['Healthy'],
      name: `${plantName || 'Plant'} - Healthy`,
      plant: plantName || 'Crop'
    };
  }

  // If not found in detailed records, return null so frontend only displays confirmed data
  return null;
}
