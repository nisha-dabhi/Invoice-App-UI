export type OrderStatus = 'Available' | 'Low Stock' | 'Stock Out' | 'On the Way'

export interface Product {
    id : number;
    productName : string;
    description : string;
    stock : number;
    status : OrderStatus;
    category : string;
    price : number;
}
