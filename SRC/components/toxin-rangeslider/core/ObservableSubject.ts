/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

// export interface Observer {
//   updateInObserver(data: any): void;
// }

// export default class ObservableSubject {
//   private observers: Observer[] = [];

//   public addObserver(observer: Observer): void {
//     const isExist = this.observers.includes(observer);
//     if (!isExist) {
//       this.observers.push(observer);
//     }
//   }

//   public detach(observer: Observer): void {
//     const observerIndex = this.observers.indexOf(observer);
//     if (observerIndex !== -1) {
//       this.observers.splice(observerIndex, 1);
//     }
//   }

//   public notify(data: any): void {
//     for (const observer of this.observers) {
//       observer.updateInObserver(data);
//     }
//   }
// }

class ObservableSubject {
  private observers: anyFunctionArray = [];

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
