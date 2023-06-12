import { inject, Injectable } from '@angular/core';
import { TicketsStoreService } from './tickets.store';
import { ApiService } from '../api/api.service';
import { tap, startWith, distinctUntilChanged, Observable } from 'rxjs';
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

  getTickets(filter: TicketsFilter): Observable<Ticket[] | null> {
    return this.api.getTickets(filter).pipe(
      startWith(null),
      tap((tickets) => {
        this.ticketsStore.ticketsList$.next(tickets);
      })
    );
  }

  getTicketInfo(id: string): Observable<Ticket | null> {
    return this.api.getTicketById(id).pipe(startWith(null));
  }

  getTicketsStatusTypes(): Observable<TicketStatusInterface[]> {
    return this.api.getTicketsStatusTypes().pipe(
      tap((ticketsStatusTypes: TicketStatusInterface[]) => {
        this.ticketsStore.ticketsStatusTypes$.next(
          ticketStatusAdaptor(ticketsStatusTypes)
        );
      })
    );
  }

  changeTicketsFilter(filters: TicketsFilter): void {
    this.router.navigate([], {
      queryParams: filters,
      queryParamsHandling: 'merge',
    });
  }

  deleteTicket(id: string) {
    return this.api.deleteTicket(id).pipe(
      tap((response) => {
        if (response.status === 'ok') {
          let ticketsList =
            this.ticketsStore.ticketsList$.getValue() as Ticket[];
          ticketsList = ticketsList?.filter((ticket) => {
            return ticket.id !== id;
          });
          this.ticketsStore.ticketsList$.next(ticketsList);
          this.router.navigate(['tickets'], {
            queryParamsHandling: 'merge',
          });
        }
      })
    );
  }

  createTicket(ticket: Ticket): boolean {
    const newTicket = {
      ...ticket,
      id: Math.floor(Math.random() * 100000000).toString(),
    };
    // add ticket. Its works before list updated
    console.log(newTicket);
    const ticketsList = this.ticketsStore.ticketsList$.getValue();
    ticketsList?.push(newTicket);
    this.ticketsStore.ticketsList$.next(ticketsList);
    alert('added');
    return true;
  }

  // update ticket. Its works before list updated
  updateTicket(ticket: Ticket): boolean {
    const ticketsList = this.ticketsStore.ticketsList$.getValue();
    const ticketIndex = ticketsList?.findIndex((t) => t.id === ticket.id);
    if (!ticketsList || !ticketIndex || ticketIndex === -1) {
      alert('oops. Error');
      return false;
    }
    ticketsList[ticketIndex] = ticket;
    this.ticketsStore.ticketsList$.next(ticketsList);
    return true;
  }

  //private
}
