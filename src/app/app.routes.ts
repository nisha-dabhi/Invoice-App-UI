import { Routes } from '@angular/router';
import { AddClient } from './components/client/add-client/add-client';
import { AddUser } from './components/user/add-user/add-user';
import { AddItem } from './components/item/add-item/add-item';
import { InvoiceComponent } from './in-voice/in-voice';
import { ItemDetails } from './components/details/item-details/item-details';
import { ClientDetails } from './components/details/client-details/client-details';
import { UserDetails } from './components/details/user-details/user-details';
import { AddProduct } from './components/product/add-product/add-product';

export const routes: Routes = [
    { path : 'invoice' , component:InvoiceComponent },
    { path: 'client', component: AddClient },
    { path: 'user', component: AddUser },
    { path: 'item', component: AddItem },
    { path: 'product', component: AddProduct },
    { path: 'client/details/:id', component: ClientDetails },
    { path: 'item/details/:id', component: ItemDetails },
    { path: 'user/details/:id', component: UserDetails },

     { path: '', redirectTo: 'invoice', pathMatch: 'full' }
];
