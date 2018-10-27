import { Component, OnInit, Inject, EventEmitter, group, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../Services/user.service';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { ExpenseService } from '../Services/expense.service';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { DatePipe } from '@angular/common';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { SettlementComponent } from './settlement.component';
import { ToastsManager } from 'ng2-toastr';

@Component({
  templateUrl: './expenses.component.html',
})
export class ExpenseComponent implements OnInit {
  groupId: string = '';
  groupName: string = '';
  groupMembers: any[] = [];
  errorMessage: any;
  isAddBill: boolean = false;
  isSubCategory: boolean = false;
  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownList1: any[] = [];
  category: any[] = [];
  selectedCategory: number;
  subCategory: any[] = [];
  selectedSubCategory: string = '';
  dropdownSettings = {};
  paidBy: any[] = [];
  selectedPayedBy: string = '';
  isMultipleUsers: boolean = false;
  splitby: string = '';
  splitTabActive: string = '';
  isAddImage: boolean = false;
  fileToUpload: File = null;
  splitEqually: any[] = [];
  amount: number;
  currentUserId: string = '';
  totalAmount: number = 0;
  remainingAmount: number = 0;
  totalPercent: number = 0;
  remainingPercent: number = 0;
  totalShare: number = 0;
  finalAmount: number = 0;
  owe: string = '';
  splitAmount: number = 0;
  isMultiUserChecked: boolean = false;
  isExactAmountChange: boolean = false;
  description: string = '';
  expDate: any;
  notes: string = '';
  expenseDistributions: any[] = [];
  paidByUsers: any[] = [];
  isDefaultList: boolean = false;
  groupExpenses: any[] = [];
  equallyTab: boolean = false;
  groupMemberChanged: EventEmitter<boolean> = new EventEmitter();
  isAttachment: boolean = false;
  imgAttachment: string = '';
  isUpdate: boolean = false;
  expenseId: number = 0;
  isdateChange: boolean = false;
  public myDatePickerModel: IMyDateModel;
  userDetailTab: boolean = false;
  activeUserDetailId: number = 0;
  userSettlement: any[] = [];
  amtDistribution: any[] = [];

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private _userService: UserService, private _expenseService: ExpenseService,
    private _avRoute: ActivatedRoute, private dialogService: DialogService,
    public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this._avRoute.params.subscribe(params => {
      this.isAddBill = false;
      this.isSubCategory = false;
      this.groupId = params["id"];
      this.isMultipleUsers = false;
      this.splitby = 'equally';
      this.splitTabActive = '1';
      this.isDefaultList = true;
      if (this.groupId != '') {
        this._userService.getGroupDetail(this.groupId)
          .subscribe((data) => {
            this.groupName = data.groupName;
          }, error => this.errorMessage = error)
        this.getExpenseList();
        this.getGroupMembersList();
      }
    });
    this.groupMemberChanged.subscribe(data => {
      if (data) {
        this.bindGroupMembers();
      }
    });

  }
  formatDate(date) {


    var day = date.getDate();
    var monthIndex = date.getMonth() + 1;
    var year = date.getFullYear();

    return monthIndex + '-' + day + '-' + year;
  }
  showConfirm(paymentId: number = 0) {
    let disposable = this.dialogService.addDialog(SettlementComponent, {
      groupId: this.groupId,
      paymentId: paymentId
    })
      .subscribe((isConfirmed) => {
        //We get dialog result
        if (isConfirmed) {
          this.toastr.success('Payment added successfully', 'Success!');

          this.getExpenseList();
          this.getGroupMembersList();
          this.isAddBill = false;
          this.isDefaultList = true;
        }
        else {

        }
      });
    //We can close dialog calling disposable.unsubscribe();
    //If dialog was not closed manually close it by timeout
    //setTimeout(() => {
    //  disposable.unsubscribe();
    //}, 10000);
  }

  ngOnInit() {

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  getExpenseList() {
    this._expenseService.getGroupExpenses(this.groupId, this.storage.get('userId'))
      .subscribe((data) => {
        this.groupExpenses = data;
        console.log('grp', this.groupExpenses);
      }, error => this.errorMessage = error)
  }
  getGroupMembersList() {
    this._userService.getGroupMemberList(this.groupId)
      .subscribe((data) => {
        this.groupMembers = data;
        console.log('gm', data);

        this.currentUserId = this.storage.get('userId');
      }, error => this.errorMessage = error)
  }
  bindExpenseDetail(item: number) {
    this.expenseId = item;
    this.isUpdate = true;
    this._expenseService.getExpenseDetail(item)
      .subscribe((data) => {

        this.selectedCategory = data.category1Id;
        if (this.selectedCategory != 0) {
          this.isSubCategory = true;
          this.selectedSubCategory = data.category2;
          this.onCategorySelected(this.selectedCategory);
        }


        var datePipe = new DatePipe('en-US');
        this.myDatePickerModel = { date: { month: parseInt(datePipe.transform(data.expenseDate, 'MM')), day: parseInt(datePipe.transform(data.expenseDate, 'dd')), year: parseInt(datePipe.transform(data.expenseDate, 'yyyy')) }, jsdate: data.expenseDate, formatted: data.expenseDate, epoc: 0 };



        this.description = data.description;
        this.amount = data.amount;
        this.selectedPayedBy = data.paidBy == null ? 'x' : data.paidBy;
        this.onPaidBySelected(this.selectedPayedBy);
        this.equallyTab = data.splitEqually > 1 ? true : false;

        if (data.splitEqually > 1) {
          this.onSplit(data.splitEqually);

        }
        this.totalPercent = 0;
        this.totalAmount = 0;
        this.groupMembers.forEach(x => {
          if (data.expenseDistributionModel.findIndex(y => y.userId == x.userId) == -1) {
            this.groupMembers.splice(this.groupMembers.findIndex(z => z.userId == x.userId), 1);
          }
          console.log(data.paidByUserModel);
          var paidByUserAmount = data.paidByUserModel.find(y => y.userId == x.userId);
          console.log(paidByUserAmount);
          if (paidByUserAmount.paidAmount > 0) {
            x.multiUserAmount = paidByUserAmount.paidAmount;
          }
          else {
            x.multiUserAmount = 0;
          }
          var expenseDistributionModel = data.expenseDistributionModel.find(y => y.userId == x.userId);

          if (this.splitTabActive == '2') {
            x.amount = expenseDistributionModel.shareAmount;
            this.totalAmount += parseInt(x.amount);
          }
          else if (this.splitTabActive == '3') {

            x.percent = (expenseDistributionModel.shareAmount / this.amount) * 100;
            x.percentAmount = expenseDistributionModel.shareAmount
            this.totalPercent += parseInt(x.percent);
          }
          else if (this.splitTabActive == '4') {
            x.shareAmount = expenseDistributionModel.shareAmount;
            x.share = expenseDistributionModel.share;

          }
        });

        this.remainingAmount = this.amount - this.totalAmount;
        this.remainingPercent = 100 - this.totalPercent;
        if (data.attachment != '' || data.notes) {
          this.isAddImage = true;
          this.notes = data.notes;
          if (data.attachment != '') {
            this.isAttachment = true;
            this.imgAttachment = '/Upload/' + data.attachment;
          }
          else {
            this.isAttachment = false;
          }
        }
        this.groupMemberChanged.emit(true);
      }, error => this.errorMessage = error)
  }
  addBill(item: number = 0) {
    this.isAddBill = true;
    this.isDefaultList = false;
    this._expenseService.getAllCategory()
      .subscribe((data1) => {
        this.category = data1;

        if (item > 0) {
          this.bindExpenseDetail(item);

        } else {
          this.selectedCategory = 1;//General category
          this.selectedSubCategory = '1';
          this.onCategorySelected(this.selectedCategory);
          this.description = '';
          //this.amount = '';
          let date = new Date();
          this.myDatePickerModel = { date: { month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() }, jsdate: date, formatted: this.formatDate(date), epoc: 0 };

          if (this.currentUserId != '') {
            this.selectedPayedBy = this.currentUserId;
          }
          this.dropdownList = [];
          this.groupMembers.forEach(item => {
            item.isChecked = true;
            item.percent = 0;
            item.share = 1;
            item.shareAmount = 0;
            item.multiUserAmount = 0;
            if (this.currentUserId != '' && item.userId != this.currentUserId) {
              this.dropdownList.push({ item_id: item.userId, item_text: item.name });

            }
          });


          this.paidBy = Array.from(this.groupMembers);
          this.paidBy.push({ userId: 'x', name: 'Multiple Users' });


          this.selectedItems = this.dropdownList;
          this.dropdownList1 = this.dropdownList;
        }


      }, error => this.errorMessage = error);
  }
  bindGroupMembers() {
    this.dropdownList = [];
    this.groupMembers.forEach(item => {
      item.isChecked = true;
      // item.percent = 0;
      //item.share = 1;
      //item.shareAmount = 0;
      //item.multiUserAmount = 0;
      if (this.currentUserId != '' && item.userId != this.currentUserId) {
        this.dropdownList.push({ item_id: item.userId, item_text: item.name });

      }
    });


    this.paidBy = Array.from(this.groupMembers);
    this.paidBy.push({ userId: 'x', name: 'Multiple Users' });


    this.selectedItems = this.dropdownList;
    this.dropdownList1 = this.dropdownList;
  }
  cancel() {
    this.isAddBill = false;
    this.isDefaultList = true;
    this.getExpenseList();
  }
  onItemSelect(item: any) {


    this.groupMembers.push({
      userId: item.item_id,
      name: item.item_text,
      isChecked: true,
      percent: 0,
      share: 1,
      shareAmount: 0,
      multiUserAmount: 0,

    });
    this.paidBy = Array.from(this.groupMembers);
    this.paidBy.push({ userId: 'x', name: 'Multiple Users' });
  }
  OnItemDeSelect(item: any) {
    let index = this.groupMembers.findIndex(x => x.userId == item.item_id);
    if (index > 0) {
      this.groupMembers.splice(index, 1);
    }
    this.paidBy = Array.from(this.groupMembers);
    this.paidBy.push({ userId: 'x', name: 'Multiple Users' });
  }
  onSelectAll(items: any) {
    console.log('onSelectAll', items);
    console.log(this.selectedItems);

  }
  onDeSelectAll(items: any) {
    console.log('onDeSelectAll', items);
    console.log(this.selectedItems);

  }
  onCategorySelected(items: number) {
    this.selectedCategory = items;
    if (items > 0) {
      this.isSubCategory = true;
      this.selectedCategory = items;
      this._expenseService.getSubCategory(this.selectedCategory)
        .subscribe((data) => {
          this.subCategory = data;
        }, error => this.errorMessage = error)
    }
  }
  onSubCategorySelected(items: any) {
    console.log('onOptionsSelected', items);
  }
  onPaidBySelected(item: string) {
    if (item == 'x') {
      this.isMultipleUsers = true;
    }
    else {
      this.isMultipleUsers = false;
    }
  }
  onSplitChange() {
    if (this.equallyTab) {
      this.equallyTab = false
      if (this.splitTabActive != '1') {
        this.splitby = 'unequally';
      }

    }
    else {
      this.splitby = 'equally';
      this.equallyTab = true;
    }

    this.splitEqual();
  }
  onSplit(item: string) {
    if (item != '1') {
      this.splitby = 'unequally';
    }
    else {
      this.splitby = 'equally';

    }
    this.owe = 'owe';
    this.splitTabActive = item;
    if (item == '1') {
      this.splitEqual();
    } else if (item == '2') {
      this.splitEqual();

    } else if (item == '3') {
      this.splitEqual();

    } else if (item == '4') {
      this.splitEqual();
    }
  }
  onAddImage() {
    if (this.isAddImage == false) {
      this.isAddImage = true;
    }
    else {
      this.isAddImage = false;
    }
  }
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'mm-dd-yyyy',
  };
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
  SaveExpense() {

    if (this.remainingAmount != 0 && this.splitTabActive == '2') {
      alert('The total of everyone`s owned share ($' + this.totalAmount + ') is different than total cost ($' + this.amount + ')');
      return;
    }

    if (this.remainingPercent != 0 && this.splitTabActive == '3') {
      alert('The total of everyone`s owned share ($' + ((this.amount / 100) * this.totalPercent) + ') is different than total cost ($' + this.amount + ')');
      return;
    }
    if (this.fileToUpload != null) {
      this._expenseService.postFile(this.fileToUpload).subscribe(data => {
        // do something, if upload success

        console.log('Uploaded');
      }, error => {
      });
    }

    this.expenseDistributions = [];
    var checkedLength = 0;
    checkedLength = this.groupMembers.length;

    this.splitEqually.forEach(x => {
      // var userIds = [];
      if (!this.equallyTab) {
        x.amount = this.amount / checkedLength;
        this.splitTabActive = '1';
        x.isChecked = true;
      }

      if (this.isMultipleUsers && x.multiUserAmount != null) {
        if ((this.splitTabActive == '1' && x.isChecked) || this.splitTabActive == '2') {
          //if ((x.multiUserAmount - x.amount) > 0) {
          //  userIds.push(x.userId);
          //}
          this.paidByUsers.push({
            UserId: x.userId,
            paidAmount: x.multiUserAmount,
            remainingAmount: x.multiUserAmount - x.amount,
          });
        }
        else if (this.splitTabActive == '3') {
          //if ((x.multiUserAmount - x.percentAmount) > 0) {
          //  userIds.push(x.userId);
          //}
          this.paidByUsers.push({
            UserId: x.userId,
            paidAmount: x.multiUserAmount,
            remainingAmount: x.multiUserAmount - x.percentAmount,
          });
        }
        else if (this.splitTabActive == '4') {
          //if ((x.multiUserAmount - x.shareAmount) > 0) {
          //  userIds.push(x.userId);
          //}
          this.paidByUsers.push({
            UserId: x.userId,
            paidAmount: x.multiUserAmount,
            remainingAmount: x.multiUserAmount - x.shareAmount,
          });
        }

      }
      else {
        var singlePaidBy = 0;
        if (this.selectedPayedBy != 'x' && x.userId == parseInt(this.selectedPayedBy)) {
          singlePaidBy = this.amount;
        }
        else {
          singlePaidBy = 0;
        }

        if ((this.splitTabActive == '1' && x.isChecked) || this.splitTabActive == '2') {

          this.paidByUsers.push({
            UserId: x.userId,
            paidAmount: singlePaidBy,
            remainingAmount: singlePaidBy - x.amount,
          });
        }
        else if (this.splitTabActive == '3') {

          this.paidByUsers.push({
            UserId: x.userId,
            paidAmount: singlePaidBy,
            remainingAmount: singlePaidBy - x.percentAmount,
          });
        }
        else if (this.splitTabActive == '4') {

          this.paidByUsers.push({
            UserId: x.userId,
            paidAmount: singlePaidBy,
            remainingAmount: singlePaidBy - x.shareAmount,
          });
        }
      }
      if (this.splitTabActive == '1' && x.isChecked) {
        this.expenseDistributions.push({
          UserId: x.userId,
          ShareAmount: x.amount
        });
      } else if (this.splitTabActive == '2') {
        this.expenseDistributions.push({
          UserId: x.userId,
          ShareAmount: x.amount
        });
      }
      else if (this.splitTabActive == '3') {
        this.expenseDistributions.push({
          UserId: x.userId,
          ShareAmount: x.percentAmount
        });
      }
      else if (this.splitTabActive == '4') {
        this.expenseDistributions.push({
          UserId: x.userId,
          ShareAmount: x.shareAmount,
          Share: x.share
        });
      }
    });
    if (this.paidByUsers != null) {
      this.paidByUsers.forEach(x => {
        if (x.remainingAmount > 0) {
          this.paidByUsers.forEach(y => {
            if (y.remainingAmount < 0 && x.UserId != y.UserId) {
              //if ((x.remainingAmount + y.remainingAmount) != 0) {
              // x.remainingAmount = x.remainingAmount + y.remainingAmount;
              if ((x.remainingAmount + y.remainingAmount || x.remainingAmount > y.remainingAmount) >= 0) {
                this.amtDistribution.push({
                  userId: x.UserId,
                  remainingAmount: Math.abs(y.remainingAmount),
                  touserId: y.UserId,
                  isPaid: 0
                });
              }
              else {
                this.amtDistribution.push({
                  userId: x.UserId,
                  remainingAmount: Math.abs(x.remainingAmount + y.remainingAmount),
                  touserId: y.UserId,
                  isPaid: 0
                });
              }
              //}
            }
          });
        } else if (x.remainingAmount < 0) {

          this.paidByUsers.forEach(y => {
            if (y.remainingAmount > 0 && x.UserId != y.UserId) {
              //x.remainingAmount = y.remainingAmount + x.remainingAmount;
              if ((y.remainingAmount + x.remainingAmount || y.remainingAmount > x.remainingAmount) >= 0) {
                this.amtDistribution.push({
                  userId: x.UserId,
                  remainingAmount: x.remainingAmount,//- y.remainingAmount,
                  touserId: y.UserId,
                  isPaid: 0
                });
              }
              else {
                this.amtDistribution.push({
                  userId: x.UserId,
                  remainingAmount: y.remainingAmount + x.remainingAmount,
                  touserId: y.UserId,
                  isPaid: 0
                });
              }

            }
          });
        }
      });
    }
    console.log('last amt', this.amtDistribution);
    var paidBy = this.selectedPayedBy;
    if (this.selectedPayedBy == 'x') {
      paidBy = null;
    }
    var attachment = this.fileToUpload != null ? this.fileToUpload.name : '';
    if (this.isUpdate) {
      attachment = this.imgAttachment.replace('/Upload/', '');

    }

    var expense = {
      ExpenseId: this.expenseId,
      Description: this.description,
      Amount: this.amount,
      ExpenseDate: this.myDatePickerModel != null ? this.myDatePickerModel.formatted : '',
      Category2: this.selectedSubCategory,
      Attachment: attachment,
      Notes: this.notes,
      PaidBy: paidBy,
      PaidByUser: this.paidByUsers,
      Groupid: this.groupId,
      Createdby: this.currentUserId,
      Owndby: this.currentUserId,
      SplitEqually: this.splitTabActive,
      ExpenseDistribution: this.expenseDistributions,
      AmtDistribution: this.amtDistribution
    };

    console.log(expense);

    if (this.isUpdate == true) {
      this._expenseService.update(expense)
        .subscribe((data) => {
          this.toastr.success('Bill Updated successfully in group ' + this.groupName, 'Success!');

        }, error => this.errorMessage = error);
    } else {
      this._expenseService.save(expense)
        .subscribe((data) => {
          this.toastr.success('Bill Added successfully in group ' + this.groupName, 'Success!');
          this.getExpenseList();
          this.getGroupMembersList();
          this.isAddBill = false;
          this.isDefaultList = true;
        }, error => this.errorMessage = error);
    }
  }
  onUserDetail(id: number) {
    this.userDetailTab = false;
    this.activeUserDetailId = id;

    this._userService.getUserSettlement(id, this.groupId)
      .subscribe((data) => {
        console.log(data);
        this.userSettlement = data;
      }, error => this.errorMessage = error)
    if (this.userDetailTab) {
      this.userDetailTab = false;
    }
    else {
      this.userDetailTab = true;
    }
  }
  onDatechange(item) {
    this.myDatePickerModel = item;
    this.isdateChange = true;
  }
  onAmountChange() {
    this.splitEqual();
  }
  splitEqual() {
    var checkedLength = 0;
    checkedLength = this.groupMembers.length;

    this.splitEqually = Array.from(this.groupMembers);

    if (this.equallyTab) {
      this.totalAmount = 0;
      this.totalPercent = 0;
      this.totalShare = 0;
      this.finalAmount = 0;

      if (this.splitTabActive == '1') {

        checkedLength = this.groupMembers.filter(this.checkedUser).length;
      }
      this.splitEqually.forEach(x => {

        if (this.isMultipleUsers) {

          if (this.isMultiUserChecked) {
            this.isMultiUserChecked = false;
            x.multiUserAmount = this.amount / checkedLength;
            this.isMultiUserChecked = true;
          }
          else {
            //  x.multiUserAmount = x.amount;

          }
        }

        if (this.splitTabActive == '2') {

          this.totalAmount += x.amount;

          this.getBackAmount(x, x.amount);


        }
        if (this.splitTabActive == '3') {
          this.totalPercent += x.percent;
          x.percentAmount = (this.amount * x.percent) / 100;
          this.getBackAmount(x, x.percentAmount);
        }
        if (this.splitTabActive == '4') {
          this.totalShare += x.share;
        }


        if (this.splitTabActive == '1') {
          if (!this.isMultiUserChecked || !this.isExactAmountChange) {
            if (x.isChecked) {
              x.amount = this.amount / checkedLength;
            }
            else {
              x.amount = 0;
            }
          }
          this.splitAmount = x.amount;
        }
      });
      if (this.splitTabActive == '4') {
        this.splitEqually.forEach(x => {
          x.shareAmount = x.share * (this.amount / this.totalShare);
          this.getBackAmount(x, x.shareAmount);
        });
      }
      this.remainingAmount = this.amount - this.totalAmount;
      this.remainingPercent = 100 - this.totalPercent;
    }
    else {
      if (this.isMultipleUsers && this.isMultiUserChecked && this.amount != null) {
        this.splitEqually.forEach(x => {
          this.isMultiUserChecked = false;
          x.multiUserAmount = this.amount / checkedLength;
          this.isMultiUserChecked = true;

        });
      }
      this.splitAmount = this.amount / checkedLength;
    }
    if (this.finalAmount > 0) {
      this.owe = 'get back';
    }
    else {
      this.owe = 'owe';
      this.finalAmount = Math.abs(this.finalAmount);
    }
  }
  onUserCheckedChange() {
    this.splitEqual();
  };

  onExactAmountChange(user, value) {
    this.isExactAmountChange = true;
    user.amount = parseInt(value);
    this.splitEqual();
    this.isExactAmountChange = false;

  }
  onPercentChange(user, value) {
    user.percent = parseInt(value);
    this.splitEqual();

  }
  onShareChange(user, value) {
    user.share = parseInt(value);
    this.splitEqual();

  }
  onMultiUserAmountChange(user, value) {
    user.multiUserAmount = parseInt(value);
    this.splitEqual();
  }
  getBackAmount(user, amount: number) {
    if (this.isMultipleUsers && this.isMultiUserChecked && this.amount != null) {
      this.isMultiUserChecked = false;
      user.multiUserAmount = amount;
      this.isMultiUserChecked = true;
    }
    if (!this.isMultipleUsers && this.selectedPayedBy == user.userId) {
      this.finalAmount = this.amount - amount;
    }
    else if (this.isMultipleUsers && this.currentUserId == user.userId) {
      this.finalAmount = user.multiUserAmount - amount;
    }
  }
  onMultiUserCheckChange(item: boolean) {
    this.isMultiUserChecked = item;
    //if (item == true) {
    this.splitEqual();
    //}
  }
  onExpenseSelect(item: number) {
    console.log(item);
  }
  bindCategory() {

  }
  deleteExpense(id: number) {
    if (confirm("Are you sure to delete this Expense?")) {
      this._expenseService.delete(id)
        .subscribe((data) => {
          this.toastr.success('Expense deleted added successfully', 'Success!');
          this.getExpenseList();
          this.getGroupMembersList();
          this.isAddBill = false;
          this.isDefaultList = true;
          console.log('deleted');
        }, error => this.errorMessage = error);
    }
  }
  deletePayment(id: number) {
    if (confirm("Are you sure to delete this Payment?")) {
      this._expenseService.deletePayment(id)
        .subscribe((data) => {
          this.toastr.success('Payment deleted added successfully', 'Success!');
          this.getExpenseList();
          this.getGroupMembersList();
          this.isAddBill = false;
          this.isDefaultList = true;
          console.log('deleted');
        }, error => this.errorMessage = error);
    }
  }
  private checkedUser(user) {
    return user.isChecked;
  }
}
