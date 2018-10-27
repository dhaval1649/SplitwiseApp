import { Component, Inject, group, ViewContainerRef } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { IMyDateModel, IMyDpOptions } from 'mydatepicker';
import { UserService } from '../Services/user.service';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { ExpenseService } from '../Services/expense.service';
import { from } from 'rxjs/observable/from';
import { DatePipe } from '@angular/common';
import { ToastsManager } from 'ng2-toastr';

export interface ConfirmModel {
  groupId: string;
  paymentId: number;
}
@Component({
  templateUrl: './settlement.component.html',
})
export class SettlementComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {
  groupId: string;
  paymentId: number;
  public myDatePickerModel: IMyDateModel;
  isAttachment: boolean = false;
  imgAttachment: string = '';
  isAddImage: boolean = false;
  amount: number;
  userSettlement: any[] = [];
  currentUserId: number;
  errorMessage: any;
  fileToUpload: File = null;
  isUpdate: boolean = false;
  notes: string = '';
  settlementAmount: number;
  fromUserId: number;
  toUserId: number;
  name: string;
  paidByName: string;
  paidToName: string;
  test: string;


  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, dialogService: DialogService, private _userService: UserService,
    private _expenseService: ExpenseService,
    public toastr: ToastsManager, vcr: ViewContainerRef) {
    super(dialogService);
    this.toastr.setRootViewContainerRef(vcr);
    let date = new Date();
    this.myDatePickerModel = { date: { month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() }, jsdate: date, formatted: this.formatDate(date), epoc: 0 };
    this.currentUserId = this.storage.get('userId');



  }
  formatDate(date) {
    var day = date.getDate();
    var monthIndex = date.getMonth() + 1;
    var year = date.getFullYear();
    return monthIndex + '-' + day + '-' + year;
  }
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'mm-dd-yyyy',
  };
  ngAfterViewInit() {


    if (this.paymentId > 0) {
      this.bindPaymentDetails();
    }
    else {
      this.bindSettlementDetails();
    }
  }
  bindSettlementDetails() {
    this._userService.getUserSettlement(this.currentUserId, this.groupId)
      .subscribe((data) => {
        this.userSettlement.push(data.find(y => y.settlementAmount != 0)); //
        console.log(this.userSettlement);

        this.settlementAmount = this.userSettlement[0].settlementAmount;
        this.name = this.userSettlement[0].name;
        if (this.settlementAmount > 0) {
          this.fromUserId = this.userSettlement[0].userId;
          this.toUserId = this.storage.get('userId');
          this.paidByName = this.userSettlement[0].name;
          this.paidToName = 'You';

        }
        else if (this.settlementAmount < 0) {
          this.toUserId = this.userSettlement[0].userId;
          this.fromUserId = this.storage.get('userId');
          this.paidToName = this.userSettlement[0].name;
          this.paidByName = 'You';
        }

      }, error => this.errorMessage = error)
  }
  bindPaymentDetails() {
    this._expenseService.getPaymentDetails(this.paymentId)
      .subscribe((data) => {
        console.log('paymentdetails', data);
        this.fromUserId = data.fromUserid;
        this.toUserId = data.toUserId;
        if (this.fromUserId == this.storage.get('userId')) {
          this.name = data.paidByName;
          this.paidToName = data.paidToName;
          this.paidByName = 'You';
        } else {
          this.paidByName = data.paidByName;
          this.paidToName = 'You';
        }
        var datePipe = new DatePipe('en-US');
        this.myDatePickerModel = { date: { month: parseInt(datePipe.transform(data.paymentDate, 'MM')), day: parseInt(datePipe.transform(data.paymentDate, 'dd')), year: parseInt(datePipe.transform(data.paymentDate, 'yyyy')) }, jsdate: data.paymentDate, formatted: data.paymentDate, epoc: 0 };
        this.settlementAmount = data.amount;
        this.test = data.settlementAmount3+'-'+ data.settlementAmount1+'-'+data.settlementAmount2
        if ((data.attachment != null && data.attachment != '') || (data.notes != null && data.notes != '')) {
          this.isAddImage = true;
          this.notes = data.notes;
          if (data.attachment != null && data.attachment != '') {
            this.isAttachment = true;
            this.imgAttachment = '/Upload/' + data.attachment;
          }
          else {
            this.isAttachment = false;
          }
        }

      }, error => this.errorMessage = error)
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
  confirm() {
    console.log('this.myDatePickerModel', this.myDatePickerModel);

    if (this.fileToUpload != null) {
      this._expenseService.postFile(this.fileToUpload).subscribe(data => {
        // do something, if upload success

        console.log('Uploaded');
      }, error => {
      });
    }
    let date = new Date();
    var attachment = this.fileToUpload != null ? this.fileToUpload.name : '';
    if (this.isUpdate) {
      attachment = this.imgAttachment.replace('/Upload/', '');

    }
    var payment = {
      paymentId: this.paymentId,
      fromUserId: this.fromUserId,
      toUserId: this.toUserId,
      amount: this.settlementAmount,
      paymentDate: this.myDatePickerModel != null ? this.myDatePickerModel.formatted : '',
      Attachment: attachment,
      Notes: this.notes,
      createdBy: this.currentUserId,
      paymentMode: 0,
      groupId: this.groupId
    }
    console.log(payment);

    this._expenseService.updatePayment(payment)
      .subscribe((data) => {

      }, error => this.errorMessage = error);
    //if (this.paymentId > 0) {

    //} else {
    //  this._expenseService.savePayment(payment)
    //    .subscribe((data) => {

    //    }, error => this.errorMessage = error);
    //}
    // we set dialog result as true on click on confirm button, 
    // then we can get dialog result from caller code 
    this.result = true;
    this.close();
  }
  onAddImage() {
    if (this.isAddImage == false) {
      this.isAddImage = true;
    }
    else {
      this.isAddImage = false;
    }
  }
}
