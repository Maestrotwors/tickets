import { Pipe, PipeTransform } from '@angular/core';
import { Dictionary } from '../interfaces/dictionary.interface';

@Pipe({ name: 'dictionaryPipe', standalone: true })
export class DictionaryPipe implements PipeTransform {
  transform(value: number, dictionary: Dictionary | null) {
    if (!value) return value;
    if (typeof value !== 'number') {
      return value;
    }
    if (dictionary === null) {
      return value;
    }
    const response = dictionary.find(el => {
      return el.key === value;
    })
    return response?.value || value;
  }
}
