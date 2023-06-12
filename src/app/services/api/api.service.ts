import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { TicketStatusInterface } from 'src/app/interfaces/tickets/ticket-status.interface';
import { Ticket } from '../../interfaces/tickets/ticket.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  //private http = inject(HttpClient);

  getTickets(): Observable<Ticket[]> {
    const mockTickets: Ticket[] = [];
    for (let i = 1; i < 51; i++) {
      mockTickets.push({
        id: i.toString(),
        title: 'title ' + i,
        status: i > 10 ? 1 : 2,
        description: 'description ' + i,
      });
    }
    return of(mockTickets).pipe(delay(1000));
  }

  getTicketById(id: string): Observable<Ticket> {
    return of({
      id,
      title: 'title ' + id,
      status: +id > 10 ? 1 : 2,
      description: 'description ' + id,
    }).pipe(delay(200));
  }

  getTicketsStatusTypes(): Observable<TicketStatusInterface[]> {
    return of([
      { status: 0, title: 'ToDo' },
      { status: 1, title: 'Dev' },
      { status: 2, title: 'Ready for test' },
      { status: 10, title: 'Done' },
      { status: 100, title: 'Deleted' },
    ]).pipe(delay(400));
  }

  createTicket() {}

  deleteTicket() {}

  updateTicket() {}
}