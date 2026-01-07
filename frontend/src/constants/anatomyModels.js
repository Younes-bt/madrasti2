// GitHub Repository URLs for 3D anatomy models
// Using raw.githubusercontent.com for better CORS support with WebGL
const GITHUB_USERNAME = 'Younes-bt';
const REPO_NAME = 'madrasti-3d-models';
const BRANCH = 'main'; // or 'master' depending on your default branch

const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/${BRANCH}`;

export const ANATOMY_MODELS = {
  // Circulatory System
  heart: `${GITHUB_RAW_URL}/heart.glb`,
  arteries : `${GITHUB_RAW_URL}/arteries.glb`,
  veins : `${GITHUB_RAW_URL}/Veins.glb`,

  // Respiratory System
  lungs: `${GITHUB_RAW_URL}/lungs2.glb`,
  trachea: `${GITHUB_RAW_URL}/trachea.glb`,
  bronchi: `${GITHUB_RAW_URL}/bronchi.glb`,

  // Nervous System
  brain: `${GITHUB_RAW_URL}/brain.glb`,
  spinalCord: `${GITHUB_RAW_URL}/spinal-cord.glb`,
  neurons: `${GITHUB_RAW_URL}/neurons.glb`,

  // Digestive System
  stomach: `${GITHUB_RAW_URL}/Stomach.glb`,
  liver: `${GITHUB_RAW_URL}/liver.glb`,
  intestines: `${GITHUB_RAW_URL}/intestines.glb`,
  SmallIntestine: `${GITHUB_RAW_URL}/SmallIntestine.glb`,
  LargeIntestine: `${GITHUB_RAW_URL}/LargeIntestine.glb`,
  pancreas: `${GITHUB_RAW_URL}/pancreas.glb`,

  // Urinary System
  kidney: `${GITHUB_RAW_URL}/kidney.glb`,
  ureters: `${GITHUB_RAW_URL}/ureters.glb`,
  bladder: `${GITHUB_RAW_URL}/bladder.glb`,

  // Muscular System
  muscles: `${GITHUB_RAW_URL}/muscles.glb`,

  // Immune System
  lymphNode: `${GITHUB_RAW_URL}/lymph-node.glb`,
  spleen: `${GITHUB_RAW_URL}/spleen.glb`,
  thymus: `${GITHUB_RAW_URL}/thymus.glb`,
};

// Helper function to get model URL
export const getModelUrl = (modelName) => {
  return ANATOMY_MODELS[modelName] || null;
};

// Get all model URLs as array
export const getAllModelUrls = () => {
  return Object.values(ANATOMY_MODELS);
};
