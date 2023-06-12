import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Dictionary } from '../../../../../../interfaces/dictionary.interface';

@Component({
  selector: 'app-tickets-status-changer',
  templateUrl: './tickets-status-changer.component.html',
  styleUrls: ['./tickets-status-changer.component.scss'],
  imports: [NgIf, AsyncPipe, NgForOf, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TicketsStatusChangerComponent),
      multi: true,
    },
  ],
})
export class TicketsStatusChangerComponent implements ControlValueAccessor {
  @Input() options: Dictionary | null = [];
  protected selectedValue = 0;

  identify(index: number, item: any) {
    return item.id;
  }

  onChange: any = (value: number) => {};

  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(input: number) {
    this.selectedValue = input;
  }

  modelChanged(value: number) {
    this.selectedValue = value;
    this.onChange(value);
  }
}
