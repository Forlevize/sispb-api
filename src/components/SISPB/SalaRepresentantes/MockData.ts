
import { BidItem, RepresentativeStats, OngoingQuotation } from "./types";

// Mock data
export const mockStats: RepresentativeStats = {
  totalItemsWon: 42,
  totalItemsLost: 18
};

export const mockBidItems: BidItem[] = [
  {
    id: 1,
    productName: "Paracetamol 500mg",
    quantity: 500,
    unit: "Unidade A",
    batch: "LOTE-2024-001",
    bidValue: 25.50,
    victoryDate: "2024-04-15",
    status: 'won'
  },
  {
    id: 2,
    productName: "Ibuprofeno 200mg",
    quantity: 300,
    unit: "Unidade B", 
    batch: "LOTE-2024-002",
    bidValue: 30.75,
    victoryDate: "2024-04-16", 
    status: 'lost'
  },
  {
    id: 3,
    productName: "Dipirona 1g",
    quantity: 200,
    unit: "Unidade C", 
    batch: "LOTE-2024-003",
    bidValue: 18.30,
    victoryDate: "2024-04-10", 
    status: 'won'
  },
  {
    id: 4,
    productName: "Loratadina 10mg",
    quantity: 400,
    unit: "Unidade A", 
    batch: "LOTE-2024-004",
    bidValue: 22.45,
    victoryDate: "2024-04-05", 
    status: 'lost'
  },
  {
    id: 5,
    productName: "Amoxicilina 500mg",
    quantity: 150,
    unit: "Unidade B", 
    batch: "LOTE-2024-005",
    bidValue: 40.20,
    victoryDate: "2024-04-18", 
    status: 'won'
  }
];

// Mock ongoing quotations
export const mockOngoingQuotations: OngoingQuotation[] = [
  {
    id: 101,
    productName: "Dipirona 500mg",
    quantity: 1000,
    unit: "Caixa",
    deadline: "2024-04-25",
    status: 'open'
  },
  {
    id: 102,
    productName: "Amoxicilina 500mg",
    quantity: 500,
    unit: "Caixa",
    deadline: "2024-04-30",
    status: 'open'
  },
  {
    id: 103,
    productName: "Loratadina 10mg",
    quantity: 300,
    unit: "Caixa",
    deadline: "2024-04-28",
    status: 'submitted'
  }
];
