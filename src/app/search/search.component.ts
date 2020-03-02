import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Subject, throwError } from 'rxjs'
import { map, debounceTime, distinctUntilChanged, switchMap, catchError, retry, retryWhen } from 'rxjs/operators'
import { StarWarService } from '../services/star-war.service' 

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

  constructor(
    private searchservice: StarWarService
  ) { }

  ngOnInit() {
    this.search();
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
        this.loading = true;
        console.log(term);
        return this.searchservice._searchEntries(term);
        
      }),
      catchError((e) => {
        console.log(e);
        this.loading = false;
        this.errorMessage = e.message;
        return throwError(e);
      }),
    ).subscribe(v => {
      console.log(v);
      this.loading = false;
      this.searchResults = v;
      console.log(this.searchResults);
      this.paginationElements = this.searchResults;
    })
  }

}
