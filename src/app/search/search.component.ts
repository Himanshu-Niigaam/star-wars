import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Subject, throwError } from 'rxjs'
import { map, debounceTime, distinctUntilChanged, switchMap, catchError, retry, retryWhen } from 'rxjs/operators'
import { StarWarService } from '../services/star-war.service' 
import { NgxSpinnerService } from "ngx-spinner";  

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public loading: boolean;
  public searchTerm = new Subject<string>();
  public searchResults: any;
  public paginationElements: any;
  public errorMessage: any;
  public user:any;

  constructor(
    private searchservice: StarWarService,
    private spinnerservice: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.search();
    this.getDataFromLocalStorage();
  }

  public searchForm = new FormGroup({
    search: new FormControl("", Validators.required),
  })
  public search() {
    this.searchTerm.pipe(
      map((e: any) => {
        console.log(e.target.value);
        return e.target.value
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        this.spinnerservice.show();
        console.log(term);
        return this.searchservice._searchEntries(term);
        
      }),
      catchError((e) => {
        console.log(e);
        this.spinnerservice.hide();
        this.errorMessage = e.message;
        return throwError(e);
      }),
    ).subscribe(v => {
      console.log(v);
      this.spinnerservice.hide();
      this.searchResults = v;
      console.log(this.searchResults);
      this.paginationElements = this.searchResults;
    })
  }
  
  // Get data from local storage
  getDataFromLocalStorage() {
    var keys = Object.keys(localStorage);
    keys.forEach(key=>{
    var json_data =localStorage.getItem(key)
    try {
        var user_data = JSON.parse(json_data);
        this.user = user_data;
      } catch (e) {
    }
  })
  }
}
