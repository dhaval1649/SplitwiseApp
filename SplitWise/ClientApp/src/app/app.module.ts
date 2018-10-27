import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { StorageServiceModule } from 'angular-webstorage-service';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login-register/login-register.component';
import { UserService } from './Services/user.service';
import { AddNewFriend } from './Friends/addnewFriend.component';
import { AddNewGroup } from './groups/addnewGroup.component';
import { ExpenseComponent } from './expenses/expenses.component';
import { AddBillComponent } from './expenses/addBill.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ExpenseService } from './Services/expense.service';
import { MyDatePickerModule } from 'mydatepicker';
import { AbsPipe } from './util/abs.pipe';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { SettlementComponent } from './expenses/settlement.component';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    AddNewFriend,
    AddNewGroup,
    ExpenseComponent,
    AddBillComponent,
    AbsPipe,
    SettlementComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    StorageServiceModule,
    NgMultiSelectDropDownModule,
    MyDatePickerModule,
    BootstrapModalModule.forRoot({ container: document.body }),
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'home/:id', component: HomeComponent },
      { path: 'AddFriend', component: AddNewFriend },
      { path: 'AddGroup', component: AddNewGroup },
      { path: 'group/:id', component: ExpenseComponent },
    ])
  ],
  entryComponents: [
    SettlementComponent
  ],
  providers: [UserService, ExpenseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
