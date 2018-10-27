import { Injectable, Inject } from "@angular/core";
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { element } from "protractor";

@Injectable()
export class UserService {
  myAppUrl: string = "";
  constructor(private _http: Http, @Inject('BASE_URL') baseUrl: string) {
    this.myAppUrl = baseUrl;
  }

  registerUser(user) {
    return this._http.post(this.myAppUrl + 'api/User', user)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }
  loginUser(user) {
    var data = { email: user.email1, password: user.password1 }
    return this._http.post(this.myAppUrl + 'api/User/Login', data)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }
  getUser(userid, name) {
    var data = { userId: userid, name: name }
    return this._http.post(this.myAppUrl + 'api/User/GetUsers', data)
      .map((response: Response) =>
        response.json())
      .catch(this.errorHandler)
  }
  addFriend(userFriends) {
    console.log(userFriends);
    return this._http.post(this.myAppUrl + 'api/User/AddFriend', userFriends)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }
  GetFriends(userid, name) {
    var data = { userId: userid, name: name }
    return this._http.post(this.myAppUrl + 'api/User/GetFriends', data)
      .map((response: Response) =>
        response.json())
      .catch(this.errorHandler)
  }
  getAllFriends(userid) {
    var data = { userId: userid }
    return this._http.post(this.myAppUrl + 'api/User/GetAllFriends', data)
      .map((response: Response) =>
        response.json())
      .catch(this.errorHandler)
  }
  addGroup(userid, name, groupMembers) {
    var data = { CreatedBy: userid, GroupName: name, GroupMembers: groupMembers }
    return this._http.post(this.myAppUrl + 'api/User/AddGroup', data)
      .map((response: Response) =>
        response.json())
      .catch(this.errorHandler)
  }
  getAllGroups(userid) {
    var data = { userId: userid }
    return this._http.post(this.myAppUrl + 'api/User/GetAllGroups', data)
      .map((response: Response) =>
        response.json())
      .catch(this.errorHandler)
  }
  getGroupMemberList(groupid) {
    var data = { groupId: groupid }
    return this._http.post(this.myAppUrl + 'api/User/GetGroupMemberList', data)
      .map((response: Response) =>
        response.json())
      .catch(this.errorHandler)
  }
  getGroupDetail(groupid) {
    var data = { groupId: groupid }
    return this._http.post(this.myAppUrl + 'api/User/GetGroupDetail', data)
      .map((response: Response) =>
        response.json())
      .catch(this.errorHandler)
  }
  getUserSettlement(userId, groupid) {
    if (groupid > 0) {
      var data = { GroupId: groupid, CreatedBy: userId }
      return this._http.post(this.myAppUrl + 'api/User/GetUserSettlement', data)
        .map((response: Response) => response.json())
        .catch(this.errorHandler)
    }
    else {
      var data1 = { UserId: userId }
      return this._http.post(this.myAppUrl + 'api/User/GetFriendsSettlement', data1)
        .map((response: Response) => response.json())
        .catch(this.errorHandler)
    }
  }
  getMemberList(userId) {
    var data = { UserId: userId }
    return this._http.post(this.myAppUrl + 'api/User/GetMemberList', data)
      .map((response: Response) =>
        response.json())
      .catch(this.errorHandler)
  }
  getMemberDetails(userId) {
    var data = { UserId: userId }
    return this._http.post(this.myAppUrl + 'api/User/GetMemberDetails', data)
      .map((response: Response) =>
        response.json())
      .catch(this.errorHandler)
  }
  getUserSettlementDetails(userId) {
    var data = { UserId: userId }
    return this._http.post(this.myAppUrl + 'api/User/GetUserSettlementDetails', data)
      .map((response: Response) =>
        response.json())
      .catch(this.errorHandler)
  }
  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}
