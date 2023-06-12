import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketsPageComponent } from './tickets-page.component';

const routes: Routes = [
  {
    path: '',
    component: TicketsPageComponent,
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./pages/new/new-ticket-page.component').then(
            (c) => c.TicketNewPageComponent
          ),
      },
      {
        path: ':ticketId',
        loadComponent: () =>
          import('./pages/ticket-info/ticket-info-page.component').then(
            (c) => c.TicketInfoPageComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsPageRoutingModule {}
