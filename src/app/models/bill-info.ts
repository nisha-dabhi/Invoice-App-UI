export interface BillInfo {
    id : number;
    invoiceNo: string;
    date : Date;
    dueDate : Date;
    clientName : string;
    companyName : string;
    amount : number;
}
