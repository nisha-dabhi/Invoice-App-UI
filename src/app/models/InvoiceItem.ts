export interface InvoiceItem {
  id : number
  description: string;
  rate: number;
  quantity: number;
  discount: number;
  tax: number;
  amount: number;
  clientId : number;
  compId : number;
}
