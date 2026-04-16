export interface Client {
    id: number;   
    clientName? : string;
    billTo : string;
    phone : string;
    mobile?: string;
    email : string;
    address : string;
    compId : number;
}