import { Routes } from '@angular/router';
import { AddClient } from './components/client/add-client/add-client';
import { AddUser } from './components/user/add-user/add-user';
import { InvoiceComponent } from './in-voice/in-voice';
import { AddProduct } from './components/product/add-product/add-product';
import { AddInvoice } from './components/Invoice/add-invoice/add-invoice';
import { AddInvoiceItem } from './components/add-invoice-item/add-invoice-item';

export const routes: Routes = [
    // { path : 'invoice' , component:InvoiceComponent },
    { path: 'client', component: AddClient },
    { path: 'user', component: AddUser },
    { path: 'addInvoice', component: AddInvoice },
    { path: 'addItem', component: AddInvoiceItem },
    { path: 'invoice/:invoiceId', component: InvoiceComponent },
    { path: 'product', component: AddProduct }, 

     { path: '', redirectTo: 'invoice', pathMatch: 'full' }
];
