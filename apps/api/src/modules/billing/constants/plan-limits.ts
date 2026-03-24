export enum PlanType {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  AGENCY = 'AGENCY',
}

export interface PlanLimits {
  maxInfluencers: number;
  maxCampaigns: number;
  brandPortal: boolean;
  aiContractAnalysis: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  [PlanType.FREE]: {
    maxInfluencers: 10,
    maxCampaigns: 1,
    brandPortal: false,
    aiContractAnalysis: false,
  },
  [PlanType.STARTER]: {
    maxInfluencers: 50,
    maxCampaigns: 10,
    brandPortal: false,
    aiContractAnalysis: true,
  },
  [PlanType.PRO]: {
    maxInfluencers: 500,
    maxCampaigns: 100,
    brandPortal: true,
    aiContractAnalysis: true,
  },
  [PlanType.AGENCY]: {
    maxInfluencers: Infinity,
    maxCampaigns: Infinity,
    brandPortal: true,
    aiContractAnalysis: true,
  },
};
