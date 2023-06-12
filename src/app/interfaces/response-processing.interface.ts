import { LoadingStatus } from './loading-status.interface';

export interface ResponseProcessing<T> {
  data?: T;
  status: LoadingStatus;
}
