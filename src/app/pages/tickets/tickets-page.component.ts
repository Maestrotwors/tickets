import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Ticket } from 'src/app/interfaces/tickets/ticket.interface';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketsMenuComponent } from './components/menu/tickets-menu.component';
import { TicketsListComponent } from './components/tickets-list/tickets-list.component';
import { TicketInfoPageComponent } from './pages/ticket-info/ticket-info-page.component';
import { TicketsStoreService } from '../../services/tickets/tickets.store';
import { combineLatest, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
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
export class TicketsPageComponent implements OnInit {
  private ticketsService = inject(TicketsService);
  private ticketsStore = inject(TicketsStoreService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    combineLatest([
      this.ticketsService.getTickets(),
      this.ticketsService.getTicketsStatusTypes(),
    ]).subscribe();

    this.ticketsStore.selectedTicketId$
      .pipe(
        filter((id) => id !== null),
        distinctUntilChanged(),
        debounceTime(100),
        switchMap((id) => {
          return this.ticketsService.getTicketInfo(<string>id);
        })
      )
      .subscribe((ticket: Ticket | null) => {
        this.ticketsStore.ticketInfo$.next(ticket);
    });

    this.route.queryParams.subscribe((queryParams) => {
		this.ticketsStore.ticketsStatusFilter$.next(queryParams);
	});

  }
}
