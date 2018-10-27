import { Component, Inject, EventEmitter, group, ViewContainerRef } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { IMyDateModel, IMyDpOptions } from 'mydatepicker';
import { SettlementComponent } from '../expenses/settlement.component';
import { ExpenseService } from '../Services/expense.service';
import { UserService } from '../Services/user.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  isDefaultList: boolean = true;
  isAddBill: boolean = false;
  isSubCategory: boolean = false;
  equallyTab: boolean = false;
  isUpdate: boolean = false;
  isMultipleUsers: boolean = false;
  isAttachment: boolean = false;
  isMultiUserChecked: boolean = false;
  isExactAmountChange: boolean = false;
  isAddImage: boolean = false;
  isdateChange: boolean = false;
  userDetailTab: boolean = false;
  userDetailTab1: boolean = false;
  isNonGroupExpenses: boolean = false;
  isUserDetail: boolean = false;

  selectedCategory: number;
  amount: number;
  expenseId: number = 0;
  totalPercent: number = 0;
  totalAmount: number = 0;
  remainingAmount: number = 0;
  remainingPercent: number = 0;
  totalShare: number = 0;
  finalAmount: number = 0;
  splitAmount: number = 0;
  activeUserDetailId: number = 0;
  activeUserDetailId1: number = 0;
  totalBalance: number;
  youOwe: number;
  youGetback: number;
  groupId: number;
  currentUserId: string = '';
  selectedSubCategory: string = '';
  description: string = '';
  selectedPayedBy: string = '';
  splitby: string = '';
  splitTabActive: string = '';
  owe: string = '';
  imgAttachment: string = '';
  notes: string = '';
  title: string = 'Dashboard';

  category: any[] = [];
  subCategory: any[] = [];
  dropdownList: any[] = [];
  groupMembers: any[] = [];
  selectedItems: any[] = [];
  dropdownList1: any[] = [];
  paidBy: any[] = [];
  splitEqually: any[] = [];
  paidByUsers: any[] = [];
  expenseDistributions: any[] = [];
  amtDistribution: any[] = [];
  groupExpenses: any[] = [];
  members: any[] = [];
  memberDetails: any[] = [];

  dropdownSettings = {};
  errorMessage: any;
  MemberChanged: EventEmitter<boolean> = new EventEmitter();
  fileToUpload: File = null;

  public myDatePickerModel: IMyDateModel;

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private dialogService: DialogService,
    private _expenseService: ExpenseService,
    private _userService: UserService,
    private _avRoute: ActivatedRoute,
    public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.splitby = 'equally';
    let date = new Date();
    this.myDatePickerModel = { date: { month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() }, jsdate: date, formatted: this.formatDate(date), epoc: 0 };

    this.currentUserId = this.storage.get('userId');
    this.toastr.setRootViewContainerRef(vcr);
    this._avRoute.params.subscribe(params => {
      this.groupId = params["id"];
      this.getMembersList();
      if (this.groupId >= 0) {
        this.isNonGroupExpenses = true;
        if (this.groupId > 0) {
          this.getUserExpenseList();
          console.log('user', this.groupId);
          this.getUserSettlementDetails(this.groupId);
          this.isUserDetail = true;
          this.onUserDetail(this.groupId);
        }
        else {
          this.title = 'Non-Group expenses';
          this.getExpenseList();
          this.isUserDetail = false;
        }
      }
      else {

        this.getYouGetList();
        this.getUserSettlementDetails(this.currentUserId);
      }
      this.MemberChanged.subscribe(data => {
        if (data) {
          this.bindMembers();
        }
      });
    });
  }

  getMembersList() {
    this._userService.getAllFriends(this.currentUserId)
      .subscribe((data) => {
        this.groupMembers = data;
        console.log('gm', data);

        this.currentUserId = this.storage.get('userId');
      }, error => this.errorMessage = error)
  }
  getYouGetList() {
    this._userService.getMemberList(this.currentUserId)
      .subscribe((data) => {
        this.members = data;
        console.log('gm', data);

        this.currentUserId = this.storage.get('userId');
      }, error => this.errorMessage = error)
  }
  getUserSettlementDetails(id) {
    this._userService.getUserSettlementDetails(id)
      .subscribe((data) => {
        this.totalBalance = data.settlementAmount;
        this.youOwe = data.oweAmount;
        this.youGetback = data.getBackAmount;
        if (this.currentUserId != id) {
          this.title = data.name;
        }
        this.currentUserId = this.storage.get('userId');
      }, error => this.errorMessage = error)
  }
  getExpenseList() {
    this._expenseService.getGroupExpenses(null, this.storage.get('userId'))
      .subscribe((data) => {
        this.groupExpenses = data;
        console.log('grp', this.groupExpenses);
      }, error => this.errorMessage = error)
  }
  getUserExpenseList() {
    this._expenseService.getUserExpenseList(this.groupId)
      .subscribe((data) => {
        this.groupExpenses = data;
        console.log('grp', this.groupExpenses);
      }, error => this.errorMessage = error)
  }
  bindMembers() {
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
    console.log('bindmembers', this.groupMembers);

    this.paidBy = Array.from(this.groupMembers);
    this.paidBy.push({ userId: 'x', name: 'Multiple Users' });


    this.selectedItems = this.dropdownList;
    this.dropdownList1 = this.dropdownList;
  }
  onUserDetail(id: number = 0) {
    this.userDetailTab = false;
    this.activeUserDetailId = id;

    this._userService.getMemberDetails(id)
      .subscribe((data) => {
        this.memberDetails = data;
        console.log('data', data);
      }, error => this.errorMessage = error)

    if (this.userDetailTab) {
      this.userDetailTab = false;
    }
    else {
      this.userDetailTab = true;
    }
  }
  onUserDetail1(id: number = 0) {
    this.userDetailTab1 = false;
    this.activeUserDetailId1 = id;

    this._userService.getMemberDetails(id)
      .subscribe((data) => {
        this.memberDetails = data;
      }, error => this.errorMessage = error)

    if (this.userDetailTab1) {
      this.userDetailTab1 = false;
    }
    else {
      this.userDetailTab1 = true;
    }
  }
  addBill(item: number = 0) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.splitTabActive = '1';
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
          this.amount = 0;
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
        this.MemberChanged.emit(true);
      }, error => this.errorMessage = error)
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
          this.toastr.success('Bill updated successfully', 'Success!');

        }, error => this.errorMessage = error);
    } else {
      this._expenseService.save(expense)
        .subscribe((data) => {
          this.toastr.success('Bill Added Successfully', 'Success!');

          this.getExpenseList();
          //this.getGroupMembersList();
          this.isAddBill = false;
          this.isDefaultList = true;
        }, error => this.errorMessage = error);
    }
  }
  cancel() {
    this.isAddBill = false;
    this.isDefaultList = true;
    this.getExpenseList();
  }
  onAmountChange() {
    this.splitEqual();
  }
  onDatechange(item) {
    this.myDatePickerModel = item;
    this.isdateChange = true;
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
    this.splitEqual();
  }
  OnItemDeSelect(item: any) {
    let index = this.groupMembers.findIndex(x => x.userId == item.item_id);
    if (index > 0) {
      this.groupMembers.splice(index, 1);
    }
    this.paidBy = Array.from(this.groupMembers);
    this.paidBy.push({ userId: 'x', name: 'Multiple Users' });
    this.splitEqual();
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
  onMultiUserCheckChange(item: boolean) {
    this.isMultiUserChecked = item;
    //if (item == true) {
    this.splitEqual();
    //}
  }
  onExpenseSelect(item: number) {
    console.log(item);
  }
  formatDate(date) {
    var day = date.getDate();
    var monthIndex = date.getMonth() + 1;
    var year = date.getFullYear();
    return monthIndex + '-' + day + '-' + year;
  }
  deleteExpense(id: number) {
    if (confirm("Are you sure to delete this Expense?")) {
      this._expenseService.delete(id)
        .subscribe((data) => {
          this.getExpenseList();
          //this.getGroupMembersList();
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
          this.getExpenseList();
          //this.getGroupMembersList();
          this.isAddBill = false;
          this.isDefaultList = true;
          console.log('deleted');
        }, error => this.errorMessage = error);
    }
  }
  showConfirm(paymentId: number = 0) {
    let disposable = this.dialogService.addDialog(SettlementComponent, {
      groupId: null,
      paymentId: paymentId
    })
      .subscribe((isConfirmed) => {
        //We get dialog result
        if (isConfirmed) {
          this.toastr.success('Payment added successfully', 'Success!');

          this.getExpenseList();
          //this.getGroupMembersList();
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
  onAddImage() {
    if (this.isAddImage == false) {
      this.isAddImage = true;
    }
    else {
      this.isAddImage = false;
    }
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
  private checkedUser(user) {
    return user.isChecked;
  }
}
