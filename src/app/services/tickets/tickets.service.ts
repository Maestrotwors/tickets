import { inject, Injectable } from '@angular/core';
import { TicketsStoreService } from './tickets.store';
import { ApiService } from '../api/api.service';
import { tap, startWith } from 'rxjs';
import { TicketStatusInterface } from 'src/app/interfaces/tickets/ticket-status.interface';
import { ticketStatusAdaptor } from './adaptors/ticket-status.adaptor';
import { TicketsFilter } from 'src/app/interfaces/tickets/tickets-filter.interface';
import { Router } from '@angular/router';

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

  getTickets() {
    return this.api.getTickets().pipe(
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
      queryParamsHandling: 'merge'
    });
  }
}
