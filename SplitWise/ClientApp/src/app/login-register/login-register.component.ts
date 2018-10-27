import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { ToastsManager } from 'ng2-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login-register.component.html',
})
export class LoginComponent implements OnInit {
  regform: FormGroup;
  loginform: FormGroup;
  errorMessage: any;
  loginError: boolean = false;
  isRegistered: boolean = false;
  public data: any = [];

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private formBuilder: FormBuilder,
    private _userService: UserService, private _router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }
  ngOnInit(): void {
    console.log(this.storage.get('userId'));
    if (this.storage.get('userId') != null && this.storage.get('userId') != '') {
      this._router.navigate(['home']);
    }
    this.regform = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
    this.loginform = this.formBuilder.group({
      email1: [null, [Validators.required, Validators.email]],
      password1: [null, Validators.required],
    });
  }
  onLogin() {
    if (!this.loginform.valid) {
      return;
    }
    this._userService.loginUser(this.loginform.value)
      .subscribe((data) => {
        if (data != 0) {
         // this.loginError = false;
          this.storage.set('userId', data);
          this.data['userId'] = this.storage.get('userId');
          this._router.navigate(['home']);
        }
        else {
          this.toastr.error('Login Credentials donot match','Error');
         // this.loginError = true;
          return;
        }
      }, error => this.errorMessage = error)
  }
  onRegistration() {

    if (!this.regform.valid) {
      return;
    }
    this._userService.registerUser(this.regform.value)
      .subscribe((data) => {
        this.toastr.success('You are Registered successfully Please Login to continue!', 'Success!');
        console.log('reg');
      }, error => this.errorMessage = error)

  }
  get name() { return this.regform.get('name'); }
  get email() { return this.regform.get('email'); }
  get password() { return this.regform.get('password'); }

  get email1() { return this.loginform.get('email1'); }
  get password1() { return this.loginform.get('password1'); }

}
