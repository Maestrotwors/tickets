import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ticket } from '../../interfaces/tickets/ticket.interface';
import { Dictionary } from 'src/app/interfaces/dictionary.interface';
import { TicketsFilter } from 'src/app/interfaces/tickets/tickets-filter.interface';

@Injectable({
  providedIn: 'root',
})
export class TicketsStoreService {
  public selectedTicketId$ = new BehaviorSubject<string | null>(null);
  public ticketInfo$ = new BehaviorSubject<Ticket | null>(null);
  public ticketsList$ = new BehaviorSubject<Ticket[] | null>(null);
  public ticketsStatusTypes$ = new BehaviorSubject<Dictionary>([]);
  public ticketsStatusFilter$ = new BehaviorSubject<TicketsFilter>({});
}
