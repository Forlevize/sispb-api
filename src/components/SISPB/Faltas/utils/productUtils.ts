
import { Produto } from "../types";

export const findProductByBarcode = (produtos: Produto[], barcode: string): Produto | undefined => {
  return produtos.find(p => p.codigoBarras === barcode);
};

export const validateBarcodeLength = (barcode: string, minLength: number = 8): boolean => {
  return barcode.length >= minLength;
};
