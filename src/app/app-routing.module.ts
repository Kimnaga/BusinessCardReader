import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './home/home.component';
import {ScannerComponent} from './scanner/scanner.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './login/auth.guard';
import {SignupComponent} from './signup/signup.component';
import {HistoryComponent} from './history/history.component';

const routes: Routes = [
  {path : "", redirectTo:'home', pathMatch: 'full'},
  {path : "home", component: HomeComponent},
  {path : "login", component : LoginComponent},
  {path : "scanner", component: ScannerComponent, canActivate:[AuthGuard]},
  {path : "history", component: HistoryComponent, canActivate:[AuthGuard]},
  {path : "signup", component : SignupComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


}
