export interface InvoiceItem {
    id: number;
    invoiceId: number;
    invoiceNo: string;
    compId: number;
    clientId: number;
    prodId: number;
    productName: string;
    quantity: number;
    price: number;
    disc: number;
    tax: number;
    amount: number;

   company: {
    companyName: string;
    email: string;
    phone: string;
    address: string;
  };

   client:{
    billTo : string ;
    phone: string;
    email: string;
    address: string;
   }

   invoice: {
    invoiceNo: string;
    date: Date ;
    dueDate: Date;
   }
}
