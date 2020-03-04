import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StarWarService } from '../services/star-war.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";  

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  data: any;

  constructor(
    private formBuilder: FormBuilder,
    private starwarservice: StarWarService,
    private router: Router,
    private spinnerservice: NgxSpinnerService,
  ) { }

  // Angular life cycle hook
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      name: ['', Validators.required],
      birth_year: ['', Validators.required]
    });
    
  }

  // This method get value from user
  get loginValue() { 
    return this.loginForm.controls; 
  }

  // This fuction perform login when user submit their credentials
  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.spinnerservice.show();
    this.starwarservice.login(this.loginValue.name.value, this.loginValue.birth_year.value).
    pipe(first()).subscribe(
      resData => {
        this.spinnerservice.hide();
        this.data = resData.results;
        console.log(this.data);
        let userValue = this.loginValue.name.value;
        let birthValue = this.loginValue.birth_year.value;
        let objName = this.data.find(function (obj) { return obj.name === userValue });
        let objBirth = this.data.find(function (obj) { return obj.birth_year === birthValue });
        if (objName && objBirth){
          this.router.navigateByUrl('/search');
          localStorage.setItem('character', JSON.stringify(objName, objBirth));
        } else {
          alert("Invalid Credentials !")
        }
      },
      errRes => {
        alert("Invalid Credentials !");
        console.log(errRes);
      } 
    );
  }
}
