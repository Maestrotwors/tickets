import { inject, Injectable } from '@angular/core';
import { TicketsStoreService } from './tickets.store';
import { ApiService } from '../api/api.service';
import { tap, startWith, distinctUntilChanged } from 'rxjs';
import { TicketStatusInterface } from 'src/app/interfaces/tickets/ticket-status.interface';
import { ticketStatusAdaptor } from './adaptors/ticket-status.adaptor';
import { TicketsFilter } from 'src/app/interfaces/tickets/tickets-filter.interface';
import { Router } from '@angular/router';
import { Ticket } from 'src/app/interfaces/tickets/ticket.interface';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  private ticketsStore = inject(TicketsStoreService);
  private api = inject(ApiService);
  private router = inject(Router);

  setTicketId(ticketId: string | null) {
    this.ticketsStore.selectedTicketId$.next(ticketId);
  }

  getTickets(filter: TicketsFilter) {
    return this.api.getTickets(filter).pipe(
      startWith(null),
      tap((tickets) => {
        this.ticketsStore.ticketsList$.next(tickets);
      })
    );
  }

  getTicketInfo(id: string) {
    return this.api.getTicketById(id).pipe(startWith(null));
  }

  getTicketsStatusTypes() {
    return this.api.getTicketsStatusTypes().pipe(
      tap((ticketsStatusTypes: TicketStatusInterface[]) => {
        this.ticketsStore.ticketsStatusTypes$.next(
          ticketStatusAdaptor(ticketsStatusTypes)
        );
      })
    );
  }

  changeTicketsFilter(filters: TicketsFilter) {
    this.router.navigate([], {
      queryParams: filters,
      queryParamsHandling: 'merge',
    });
  }

  deleteTicket(id: string) {
    return this.api.deleteTicket(id).pipe(tap(response => {
      if (response.status === 'ok') {
        let ticketsList = this.ticketsStore.ticketsList$.getValue() as Ticket[];
        ticketsList = ticketsList?.filter(ticket => {
          return ticket.id !== id;
        });
        this.ticketsStore.ticketsList$.next(ticketsList);
        this.router.navigate(['tickets'], {
          queryParamsHandling: 'merge',
        });
      }
    }));
  }
}
