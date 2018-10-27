import { Component, Inject } from '@angular/core';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {

  isExpanded = false;
  isLoggedIn = false;
  title: string = 'Login';
  users: any[] = [];
  groups: any[] = [];
  errorMessage: any;
  currentUserId: number;

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private _userService: UserService, private _router: Router) {
    if (this.storage.get('userId') != '') {
      this.currentUserId = this.storage.get('userId');
      if (this.currentUserId > 0) {
        this.isLoggedIn = true;
        this.title = 'Dashboard';

        this._userService.getAllGroups(this.storage.get('userId'))
          .subscribe((data) => {
            this.groups = data;
          }, error => this.errorMessage = error)

        this._userService.GetFriends(this.storage.get('userId'), '')
          .subscribe((data) => {
            this.users = data;
          }, error => this.errorMessage = error)

      }
    }
  }
  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
