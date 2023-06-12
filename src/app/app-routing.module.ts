import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/main/main-page.module').then(m => m.MainPageModule)},
  { path: 'tickets', loadChildren: () => import('./pages/tickets/tickets-page.module').then(m => m.TicketsPageModule)},
  { path: '**', redirectTo: "/"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
