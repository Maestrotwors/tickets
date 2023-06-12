import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DictionaryPipe } from 'src/app/pipes/dictionary.pipe';
import { TicketsStoreService } from 'src/app/services/tickets/tickets.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, AsyncPipe, DictionaryPipe, NgIf],
  standalone: true,
})
export class TicketsListComponent {
	private router = inject(Router);
	protected ticketsStore = inject(TicketsStoreService);

	protected ticketsList$ = this.ticketsStore.ticketsList$;
	protected ticketsStatusTypes$ = this.ticketsStore.ticketsStatusTypes$;
	protected selectedTicketId$ = this.ticketsStore.selectedTicketId$;

	selectTicket(id: string) {
		this.router.navigate(['tickets', id], {
			queryParamsHandling: 'merge',
		});
	}
}
