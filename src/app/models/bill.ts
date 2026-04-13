export interface Bill {
    id : number;
    date : Date;
    dueDate : Date;
    customerName : string;
    invoiceNo : string;
    companyName : string;
    productName : string;
    quantity : number;
    disc? : number;
    price : number;
    tax? : number;
    amount : number;
    compId : number;
    custoId : number;
    prodId : number;

    company: {
    companyName: string;
    email: string;
    phone: string;
    address: string;
  };

  customer : {
    id : number;
    customerName : string;
    billTo : string;
    phone : string;
    email : string;
    address : string;
    compId : number;
    companyName : string;
}
}
