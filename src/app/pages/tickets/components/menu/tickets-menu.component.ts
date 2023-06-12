import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketsStoreService } from 'src/app/services/tickets/tickets.store';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketsStatusChangerComponent } from './components/ticket-status-changer/tickets-status-changer.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { skip } from 'rxjs';

@Component({
  selector: 'app-tickets-menu',
  templateUrl: './tickets-menu.component.html',
  styleUrls: ['./tickets-menu.component.scss'],
  imports: [TicketsStatusChangerComponent, AsyncPipe, ReactiveFormsModule, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TicketsMenuComponent implements OnInit {
  private router = inject(Router);
  private ticketsStoreService = inject(TicketsStoreService);
  private ticketsService = inject(TicketsService);

  protected ticketsStatusTypes$ = this.ticketsStoreService.ticketsStatusTypes$;

  menuTicketsForm = new FormGroup({
    ticketStatus: new FormControl<number | string | null>(null),
    ticketStatusInput: new FormControl<number | string | null>(null)
  });

  ngOnInit() {
    this.menuTicketsForm.controls.ticketStatus.valueChanges.subscribe(
      (status) => {
        this.menuTicketsForm.controls.ticketStatusInput.setValue(status, {
          emitEvent: false,
        });
      }
    );

    this.menuTicketsForm.controls.ticketStatusInput.valueChanges.pipe(skip(1)).subscribe(
      (status) => {
        this.menuTicketsForm.controls.ticketStatus.setValue(status, {
          emitEvent: false,
        });
		this.statusFilterChanged(status);
      }
    );

    this.ticketsStoreService.ticketsStatusFilter$.subscribe((filterValue) => {
      this.menuTicketsForm.controls.ticketStatusInput.setValue(
        filterValue?.status || null
      );
    });
  }

  goToMainPage() {
    this.router.navigate(['']);
  }

  goToCreateTicketPage() {
    this.router.navigate(['tickets', 'new'], {
      queryParamsHandling: 'merge',
    });
  }

  statusFilterChanged(status: string | number | null) {
    status === 'null' || status === null
      ? this.ticketsService.changeTicketsFilter({ status: null })
      : this.ticketsService.changeTicketsFilter({ status });
  }
}