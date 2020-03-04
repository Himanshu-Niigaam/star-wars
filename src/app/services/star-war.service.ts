import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utils/api-constant';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user'

@Injectable({
  providedIn: 'root'
})
export class StarWarService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  public searchResults: any;

  constructor(
    private http: HttpClient,
    
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    console.log(this.currentUserSubject.value)
    return this.currentUserSubject.value;
  }

  login(name: string, birth_year: string) {
    return this.http.post<any>(API.LOGIN,
      { name: name, birth_year: birth_year }
    )
  }

  // Get data from api
  public searchPlanets(term: string): Observable<any> {
    if (term == "") {
      return of(null);
    } else {
      return this.http.get<any>(`${API.SEARCH}planets?search=${term}`).pipe(
        map(response => {
          console.log(response);
          return this.searchResults = response['results']
        })
      )
    }
  }

  public _searchPlanetsByName(term) {
    return this.searchPlanets(term);
  }
}
