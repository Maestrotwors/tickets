import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Ticket } from 'src/app/interfaces/tickets/ticket.interface';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketsMenuComponent } from './components/menu/tickets-menu.component';
import { TicketsListComponent } from './components/tickets-list/tickets-list.component';
import { TicketInfoPageComponent } from './pages/ticket-info/ticket-info-page.component';
import { TicketsStoreService } from '../../services/tickets/tickets.store';
import { debounceTime, filter, switchMap } from 'rxjs';
import { TicketsFilter } from 'src/app/interfaces/tickets/tickets-filter.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-tickets-page',
  templateUrl: './tickets-page.component.html',
  styleUrls: ['./tickets-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TicketsMenuComponent,
    TicketsListComponent,
    TicketsPageComponent,
    TicketInfoPageComponent,
    RouterOutlet,
    RouterLink,
  ],
})
export class TicketsPageComponent {
  private ticketsService = inject(TicketsService);
  private ticketsStore = inject(TicketsStoreService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.ticketsService
      .getTicketsStatusTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    this.ticketsStore.selectedTicketId$
      .pipe(
        filter((id) => id !== null),
        debounceTime(100),
        switchMap((id) => {
          return this.ticketsService.getTicketInfo(<string>id);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((ticket: Ticket | null) => {
        this.ticketsStore.ticketInfo$.next(ticket);
      });

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((queryParams) => {
        this.ticketsStore.ticketsStatusFilter$.next(queryParams);
      });

    this.ticketsStore.ticketsStatusFilter$
      .pipe(
        switchMap((filter: TicketsFilter) => {
          return this.ticketsService.getTickets(filter);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
