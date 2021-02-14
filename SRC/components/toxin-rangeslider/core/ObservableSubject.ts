/* eslint-disable @typescript-eslint/no-explicit-any */

class ObservableSubject {
  private observers: anyFunction[] = [];

  public addObserver(func: anyFunction): void {
    this.observers.push(func);
  }

  public detach(func: anyFunction): void {
    this.observers = this.observers.filter(subscriber => subscriber !== func);
  }

  public notify(data?: any): void {
    this.observers.forEach(subscriber => subscriber(data));
  }
}

export default ObservableSubject;
