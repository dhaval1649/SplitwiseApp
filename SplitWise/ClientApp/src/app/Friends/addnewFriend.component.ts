import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-addFriend',
  templateUrl: './addnewFriend.component.html',
})
export class AddNewFriend implements OnInit {

  users: any[] = [];
  searchform: FormGroup;
  errorMessage: any;
  userFriends: any;

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private formBuilder: FormBuilder,
    private _userService: UserService, private _router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);

  }
  ngOnInit(): void {
    this.searchform = this.formBuilder.group({
      name: [null, Validators.required]
    });

    if (this.storage.get('userId') != '') {
      console.log('component', this.storage.get('userId'));
      this.getUserList();

    }
  }
  getUserList() {
    this._userService.getUser(this.storage.get('userId'), '')
      .subscribe((data) => {
        console.log(data);
        this.users = data;
      }, error => this.errorMessage = error)
  }
  onSearch() {
    //if (!this.searchform.valid) {
    //  return;
    //}

    if (this.storage.get('userId') != '') {
      console.log('component', this.storage.get('userId'));
      this._userService.getUser(this.storage.get('userId'), this.searchform.get('name').value)
        .subscribe((data) => {

          this.users = data;
        }, error => this.errorMessage = error)

    }
  }
  onAddClick(userid) {
    console.log(userid);
    if (this.storage.get('userId') != '') {
      this.userFriends = { UserOneId: this.storage.get('userId'), UserTwoId: userid, ActionUserId: this.storage.get('userId') }
      this._userService.addFriend(this.userFriends)
        .subscribe((data) => {
          this.toastr.success('Friend Added Successfully', 'Success');
          this.getUserList();
        }, error => this.errorMessage = error)

    }
  }
  get name() { return this.searchform.get('name'); }
}
