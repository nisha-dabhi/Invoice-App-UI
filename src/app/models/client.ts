export interface Client {
    id: number;
    invoiceNo : string;
    clientName? : string;
    billTo : string;
    phone : string;
    mobile?: string;
    email : string;
    address : string;
    date : Date;
    dueDate : Date;
    compId : number;
}
