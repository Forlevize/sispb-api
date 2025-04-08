
export interface BidItem {
  id: number;
  productName: string;
  quantity: number;
  unit: string;
  batch: string;
  bidValue: number;
  victoryDate: string;
  status: 'won' | 'lost' | 'pending';
}

export interface RepresentativeStats {
  totalItemsWon: number;
  totalItemsLost: number;
}

export interface OngoingQuotation {
  id: number;
  productName: string;
  quantity: number;
  unit: string;
  deadline: string;
  status: 'open' | 'submitted' | 'closed';
}

export interface QuotationFormData {
  bidPrice: number;
  deliveryDate: string;
  notes: string;
}

export interface BidFilters {
  unit: string;
  startDate: string;
  endDate: string;
  productName: string;
  status: string;
}
