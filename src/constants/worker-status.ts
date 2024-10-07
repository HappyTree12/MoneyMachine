export enum WorkerStatus {
  submitted = 'submitted',
  waiting = 'waiting',
  running = 'running',
  completed = 'completed',
  error = 'error',
  stopped = 'stopped',
}

export const workerRunningStatus = [WorkerStatus.running, WorkerStatus.waiting];
