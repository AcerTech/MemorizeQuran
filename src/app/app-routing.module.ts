import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AyahComponent } from './ayah/ayah.component';


const routes: Routes = [
  { path: 'home', component: AyahComponent },
  { path: "*", pathMatch: "full", redirectTo: "home" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
