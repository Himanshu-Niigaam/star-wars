import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StarWarService } from '../services/star-war.service'
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

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
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      name: ['', Validators.required],
      birth_year: ['', Validators.required]
  });
  }
  

  get loginValue() { 
    return this.loginForm.controls; 
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.starwarservice.login(this.loginValue.name.value, this.loginValue.birth_year.value).
    pipe(first()).subscribe(
      resData => {
        this.data = resData.results;
        console.log(this.data);
        let a = this.loginValue.name.value;
        let b = this.loginValue.birth_year.value;
        let objName = this.data.find(function (obj) { return obj.name === a });
        let objBirth = this.data.find(function (obj) { return obj.birth_year === b });
        if(objName.name && objBirth.birth_year){
          this.router.navigateByUrl('/search');
        } else {
          alert("Invalid Credential");
        }
      },
      errRes => {
        alert("Invalid Credential");
        console.log(errRes);
      }
    );
  }

}
