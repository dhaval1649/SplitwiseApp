import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  currentUserId: number;
  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private _router: Router) {
    this.checklogin()

  }
  checklogin() {
    this.currentUserId = this.storage.get('userId');

    if (this.currentUserId > 0) {
      console.log('user', this.currentUserId);
    }
    else {
      this._router.navigate(['/']);

    }
  }
}
