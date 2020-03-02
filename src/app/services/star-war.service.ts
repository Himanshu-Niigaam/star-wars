import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utils/api-constant';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user'

@Injectable({
  providedIn: 'root'
})
export class StarWarService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  public baseUrl = "https://swapi.co/api/planets";
  public searchResults: any;

  constructor(private http: HttpClient) { 
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(name: string, birth_year: string) {
     return this.http.post<any>(API.LOGIN,
      { name: name, birth_year: birth_year }
    )
  }

  // Get data from api
  searchEntries(term): Observable<any> {
    if(term == ""){
      console.log("Not Defined");
    } else {
      let params = {q: term}
      return this.http.get(this.baseUrl, {params}).pipe(
        map(response => {
          console.log(response);
          return this.searchResults = response['results']
        })
      )
    }
  }

  _searchEntries(term) {
    return this.searchEntries(term);
  }
}
