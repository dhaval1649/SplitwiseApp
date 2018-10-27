import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-addFriend',
  templateUrl: './addnewGroup.component.html',
})
export class AddNewGroup implements OnInit {

  users: any[] = [];
  checkedUser: any[] = []
  searchform: FormGroup;
  errorMessage: any;
  userFriends: any;
  myForm: FormGroup;

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private formBuilder: FormBuilder,
    private _userService: UserService, private _router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);

  }
  ngOnInit(): void {
    this.searchform = this.formBuilder.group({
      name: [null, Validators.required],
      //});
      //this.searchform = this.formBuilder.group({
      allowAddMembers: this.formBuilder.array([])
    });
    if (this.storage.get('userId') != '') {
      console.log('component', this.storage.get('userId'));
      this._userService.getAllFriends(this.storage.get('userId'))
        .subscribe((data) => {
          console.log(data);
          this.users = data;
        }, error => this.errorMessage = error)

    }
  }

  onSearch() {
    if (!this.searchform.valid) {
      return;
    }

    if (this.storage.get('userId') != '') {
      this._userService.addGroup(this.storage.get('userId'), this.searchform.get('name').value, this.checkedUser)
        .subscribe((data) => {
          console.log(data);
          this.users = data;
        }, error => this.errorMessage = error)

    }
  }
  onCheckChange(userid: number, isChecked: boolean) {
    if (isChecked) {
      this.checkedUser.push({ userid: userid });
    } else {
      let index = this.checkedUser.findIndex(x => x.id == userid)
      this.checkedUser.splice(index);
    }
    console.log(this.checkedUser);
  }
  onAddClick(userid) {
    if (!this.searchform.valid) {
      return;
    }
    console.log(userid);
    if (this.storage.get('userId') != '') {
      this.userFriends = { UserOneId: this.storage.get('userId'), UserTwoId: userid, Status: 1, ActionUserId: this.storage.get('userId') }
      this._userService.addFriend(this.userFriends)
        .subscribe((data) => {
          this.toastr.success('Group added successfully', 'Success!');
          console.log(data);
          // this.users = data;
        }, error => this.errorMessage = error)

    }
  }
  get name() { return this.searchform.get('name'); }
}
