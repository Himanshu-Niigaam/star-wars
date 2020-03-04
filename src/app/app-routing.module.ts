import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthGuardService } from './guards/auth-guard.service'
import { LoginComponent } from './login/login.component'; 
import { SearchComponent } from './search/search.component'; 
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component'; 

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuardService]},
  { path: 'pagenotfound', component: PagenotfoundComponent},
  { path: '**', redirectTo: 'pagenotfound' },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],

  exports: [RouterModule]
})
export class AppRoutingModule { }
