/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

export default class TipView {
  $el: JQuery<HTMLElement>;

  $parentElement: JQuery<HTMLElement>;

  constructor(data: any) {
    this.$parentElement = data.$parentElement;
    this.$el = $(data.domEntity);
  }

  setVertical() {
    console.log('setVertical from TipView.ts file, 15 line');
    return null;
  }

  setText(value: string | number): void {
    this.$el.text(value);
  }

  getText(): string | number {
    return this.$el.text();
  }

  appendToDomTree(): void {
    this.$parentElement.append(this.$el);
  }

  removeFromDomTree(): void {
    this.$el.off();
    this.$el.remove();
  }
}
