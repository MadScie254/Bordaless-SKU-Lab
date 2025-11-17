export interface User {
  id: string;
  name: string;
  role: 'supplier' | 'buyer' | 'inspector';
  country: string;
}

export interface Supplier {
    id: string;
    name: string;
    country: string;
    verificationStatus: 'Verified' | 'Pending' | 'Unverified';
    rating: number;
    memberSince: string;
    bio: string;
}

export interface Product {
  id: string;
  supplierId: string;
  title: string;
  category: string;
  country: string;
  description: string;
  materials: string[];
  specs: Record<string, string>;
  moq: number;
  leadTimeDays: number;
  images: string[];
  videoUrl?: string;
  modelUrl?: string;
}

export interface Batch {
  id: string;
  productId: string;
  qtyAvailable: number;
  unitPriceUSD: number;
  status: 'verifying' | 'available' | 'sold';
  mlQualityScore?: 'A' | 'B' | 'C' | 'D';
}

export interface ProductBatch extends Product, Batch {}

export interface QualityAnalysisResult {
    qualityScore: 'A' | 'B' | 'C' | 'D';
    issues: string[];
}

export interface ListingSuggestions {
    suggestedTitle: string;
    suggestedDescription: string;
    suggestedKeywords: string[];
    locationInsight: string;
}

export interface SearchFilters {
    searchTerm?: string;
    countries?: string[];
    category?: string;
    maxPrice?: number;
    minPrice?: number;
    maxMoq?: number;
    minMoq?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'quality_asc';
}

// New Types for V2 features

export type OrderStatus = 'Production' | 'QC' | 'Packaging' | 'Export Prep' | 'Shipped';

export interface Order {
  id: string;
  product: ProductBatch;
  status: OrderStatus;
}

export interface FunnelData {
  stage: string;
  count: number;
}

export interface GeoData {
  country: string;
  countryCode: string;
  views: number;
}

export interface SkuPerformanceData {
  skuId: string;
  skuTitle: string;
  views: number;
  favorites: number;
  orders: number;
}

export interface AnalyticsV2 {
  conversionFunnels: FunnelData[];
  geoDemographics: GeoData[];
  topPerformingSkus: SkuPerformanceData[];
}

export interface Trend {
    name: string;
    change: number; // percentage change
}

export interface PriceShift {
    month: string;
    avgPrice: number;
}

export interface MarketTrendData {
    trendingCategories: Trend[];
    inDemandMaterials: Trend[];
    globalPriceShifts: {
        [category: string]: PriceShift[];
    }
}