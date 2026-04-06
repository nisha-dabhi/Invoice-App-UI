export interface InvoiceItem {
    id : number;
    invoiceId : number;
    compId : number;
    clientId : number;
    prodId : number;
    productName : string;
    quantity : number;
    price : number;
    disc : number;
    tax : number;
    amount : number;
}
