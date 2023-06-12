import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { DictionaryPipe } from 'src/app/pipes/dictionary.pipe';
import { TicketsStoreService } from 'src/app/services/tickets/tickets.store';
import { Router } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private destroyRef = inject(DestroyRef);
  protected ticketsStore = inject(TicketsStoreService);
  protected ticketsService = inject(TicketsService);

  protected ticketsList$ = this.ticketsStore.ticketsList$;
  protected ticketsStatusTypes$ = this.ticketsStore.ticketsStatusTypes$;
  protected selectedTicketId$ = this.ticketsStore.selectedTicketId$;

  identify(index: number, item: any) {
    return item.id;
  }

  selectTicket(id: string) {
    this.router.navigate(['tickets', id], {
      queryParamsHandling: 'merge',
    });
  }

  deleteTicket(id: string) {
    this.ticketsService
      .deleteTicket(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
