import { Injectable, Inject } from "@angular/core";
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient } from "selenium-webdriver/http";

@Injectable()
export class ExpenseService {
  myAppUrl: string = "";
  constructor(private _http: Http, @Inject('BASE_URL') baseUrl: string) {
    this.myAppUrl = baseUrl;
  }

  getAllCategory() {
    return this._http.get(this.myAppUrl + 'api/Expense/GetAllCategory')
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }
  getSubCategory(category) {
    var data = { category1Id: category }
    return this._http.post(this.myAppUrl + 'api/Expense/GetSubCategory', data)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }
  getGroupExpenses(groupId, userId) {
    var data = { Groupid: groupId, Owndby: userId }
    return this._http.post(this.myAppUrl + 'api/Expense/GetGroupExpenses', data)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }
  getExpenseDetail(expenseId) {
    var data = { ExpenseId: expenseId }
    return this._http.post(this.myAppUrl + 'api/Expense/GetExpenseDetail', data)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }

  postFile(fileToUpload: File) {
    const endpoint = 'api/Expense/FileUpload';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this._http
      .post(endpoint, formData)
      .map(() => { return true; })
      .catch(this.errorHandler);
  }
  save(expense) {
    console.log(expense);
    return this._http.post(this.myAppUrl + 'api/Expense/SaveExpense', expense)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }
  update(expense) {
    console.log(expense);
    return this._http.post(this.myAppUrl + 'api/Expense/UpateExpense', expense)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }
  delete(expenseId) {
    var data = { ExpenseId: expenseId };
    return this._http.post(this.myAppUrl + 'api/Expense/DeleteExpense', data)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }

  savePayment(payment) {
    return this._http.post(this.myAppUrl + 'api/Expense/SavePayment', payment)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }
  updatePayment(payment) {
    return this._http.post(this.myAppUrl + 'api/Expense/SavePayment', payment)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }
  getPaymentDetails(paymentId) {
    var data = { PaymentId: paymentId }
    return this._http.post(this.myAppUrl + 'api/Expense/GetPaymentDetails', data)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }
  deletePayment(paymentId) {
    var data = { PaymentId: paymentId };
    return this._http.post(this.myAppUrl + 'api/Expense/DeletePayment', data)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }
  getUserExpenseList(userId) {
    var data = { Owndby: userId }
    return this._http.post(this.myAppUrl + 'api/Expense/GetUserExpenseList', data)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }
  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}
