
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
  description: string;
  materials: string[];
  specs: Record<string, string>;
  moq: number;
  leadTimeDays: number;
  images: string[];
  videoUrl?: string;
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
