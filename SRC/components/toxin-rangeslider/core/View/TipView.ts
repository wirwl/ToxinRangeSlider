/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import DOMOperations from './DOMOperations';

export default class TipView extends DOMOperations {
  setText(value: string | number): void {
    this.$el.text(value);
  }

  getText(): string | number {
    return this.$el.text();
  }

  updateInObserver(data: any) {
    const { value } = data;
    this.setText(value);
  }
}
