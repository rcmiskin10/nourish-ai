export interface FeaturesConfig {
  auth: boolean
  billing: boolean
  email: boolean
  analytics: boolean
  ai: boolean
  aiChat: boolean
  landingGenerator: boolean
  marketResearch: boolean
  socialListening: boolean
  teams: boolean
  admin: boolean
  waitlist: boolean
  blog: boolean
  api: boolean
  fileUploads: boolean
  notifications: boolean
  entityCrud: boolean
  entityExport: boolean
  entitySearch: boolean
}

export const featuresConfig: FeaturesConfig = {
  auth: true,
  billing: true,
  email: true,
  analytics: true,
  ai: true,
  aiChat: true,
  landingGenerator: false,
  marketResearch: false,
  socialListening: false,
  teams: false,
  admin: true,
  waitlist: false,
  blog: true,
  api: false,
  fileUploads: false,
  notifications: true,
  entityCrud: true,
  entityExport: true,
  entitySearch: true
}

export function isFeatureEnabled(feature: keyof FeaturesConfig): boolean {
  return featuresConfig[feature] === true
}

export function getEnabledFeatures(): (keyof FeaturesConfig)[] {
  return (Object.keys(featuresConfig) as (keyof FeaturesConfig)[]).filter(
    (key) => featuresConfig[key],
  )
}
