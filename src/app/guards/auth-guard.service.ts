import { Injectable } from '@angular/core';
import { StarWarService } from '../services/star-war.service'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
  public user: any;
  constructor(
    private starwarservice: StarWarService, 
    private router: Router
  ) {
    this.getDataFromLocalStorage();
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

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.user.name && this.user.birth_year) {
        return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
