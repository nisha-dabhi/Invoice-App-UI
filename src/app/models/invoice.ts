export interface Invoice {
    id: number;
    invoiceNo: string;
    date: Date;
    dueDate: Date;
    compId: number;
    clientId : number;
    totalAmount : number;
}
