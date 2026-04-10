import { Routes } from '@angular/router';
import { AddClient } from './components/client/add-client/add-client';
import { AddUser } from './components/user/add-user/add-user';
import { AddProduct } from './components/product/add-product/add-product';
import { AddInvoice } from './components/Invoice/add-invoice/add-invoice';
import { AddInvoiceItem } from './components/add-invoice-item/add-invoice-item';
import { Login } from './login/login';
import { InvoiceComponent } from './components/in-voice/in-voice';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard } from './auth-guard';
import { AddCustomer } from './components/customer/customer';
import { AddBill } from './components/bill/bill';
import { AddBillInfo } from './components/bill-info/bill-info';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: Login },

    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: 'client', component: AddClient },
            { path: 'user', component: AddUser },
            { path: 'addInvoice', component: AddInvoice },
            { path: 'addItem', component: AddInvoiceItem },
            { path: 'invoice/:invoiceId', component: InvoiceComponent },
            { path: 'product', component: AddProduct },
            { path: 'customer', component: AddCustomer },
            { path: 'bill', component: AddBill },
            { path: 'billInfo', component: AddBillInfo },
        ]
    },

    { path: '**', redirectTo: 'login' }
];
