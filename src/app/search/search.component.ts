import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { Subject, throwError, interval } from 'rxjs'
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators'
import { StarWarService } from '../services/star-war.service'
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  // Variables declared here
  public searchTerm = new Subject<string>();
  public searchResults: any;
  public storeData: any;
  public errorMessage: any;
  public user: any;
  public today = Date.now();
  todaysDataTime = '';
  searchCount = 0;
  startTime;
  endTime;

  constructor(
    private searchservice: StarWarService,
    private spinnerservice: NgxSpinnerService,
    private router: Router,
  ) { }

  // Angular lifecycle hook
  ngOnInit() {
    this.search();
    this.getDataFromLocalStorage();
    this.todaysDataTime = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
    history.pushState(null, null, location.href);
    window.onpopstate = function (event) {
      history.go(1);
    };
  }

  // Formgroup and Formcontrol name define here
  public starWarSearch = new FormGroup({
    search: new FormControl("", Validators.required),
  })

  // This fuction is to subscribe service and get result by searchterm using rxjs operators
  public search() {
    this.searchTerm.pipe(
      map((e: any) => {
        return e.target.value
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {

        // this code gives you permission to search 15 times in a minute except Luke 
        // Skywalker and  also verify that you are human or a bot
        if (this.user.name != 'Luke Skywalker') {
          this.searchCount++;
          if (this.searchCount == 1) {
            this.startTime = new Date();
          }
          if (this.searchCount == 15) {
            this.endTime = new Date();
            if (Math.abs(this.endTime - this.startTime) / 1000 < 60) {
              this.searchCount = 0;
              alert("You seems to be suspecious ! so if you are human please login again..");
              this.router.navigateByUrl('/login');
              localStorage.clear();
            } else {
              this.searchCount = 0;
            }
          }
        }
        this.spinnerservice.show();
        return this.searchservice._searchPlanetsByName(term);
      }),
      catchError((e) => {
        console.log(e);
        this.spinnerservice.hide();
        this.errorMessage = e.message;
        return throwError(e);
      }),
    ).subscribe(resData => {
      this.spinnerservice.hide();
      this.searchResults = resData;
      this.storeData = this.searchResults;
    })
  }

  // This function is used to get data from local storage
  getDataFromLocalStorage() {
    var keys = Object.keys(localStorage);
    keys.forEach(key => {
      var json_data = localStorage.getItem(key)
      try {
        var user_data = JSON.parse(json_data);
        this.user = user_data;
      } catch (e) {
      }
    })
  }


  // This function is used to logout user 
  logout() {
    this.router.navigateByUrl('/login');
    localStorage.clear();
  }
}
