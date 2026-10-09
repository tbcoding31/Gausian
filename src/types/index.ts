export interface Building {
  id: string;
  name: string;
  subtitle?: string;
  zone?: string;
  buildingArea: string;
  landArea: string;
  floor: string;
  description: string;
  heroImage?: string;
  gallery?: string[];
  viewerPath: string;
  mapPosition: {
    x: number;
    y: number;
    z: number;
  };
  mapRotation?: {
    x: number;
    y: number;
    z: number;
  };
  mapScale?: number;
}

export interface OpportunityItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface DirectionMapRoute {
  title: string;
  duration: string;
  description: string;
}

export interface DirectionMapData {
  title: string;
  subtitle: string;
  nationalRoute: DirectionMapRoute;
  tollRoute: DirectionMapRoute;
  totalDuration: string;
  googleMapsUrl: string;
  mapImage: string;
}

export interface LandingData {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    backgroundImage: string;
  };
  whyTanjungLesung: {
    title: string;
    subtitle: string;
    items: OpportunityItem[];
  };
  directionMap: DirectionMapData;
}
