export default class SelectItems {
  readonly CLASSES = {
    modNotUsing: 'select-items_not-using',
    modRemoveDisabled: 'select-items__button-remove_disabled',
  };

  private $selectItems: JQuery<HTMLElement>;

  private $buttonAdd: JQuery<HTMLElement>;

  private $buttonRemove: JQuery<HTMLElement>;

  private $select: JQuery<HTMLElement>;

  private select: HTMLSelectElement | null;

  constructor(element: HTMLElement) {
    this.$selectItems = $(element);
    this.$buttonAdd = this.$selectItems.find('.js-select-items__button-add');
    this.$buttonRemove = this.$selectItems.find('.js-select-items__button-remove');
    this.$select = this.$selectItems.find('.js-select-items__options');
    this.select = document.querySelector('.js-select-items__options');
    this.bindThis();
    this.addEventListeners();
  }

  private bindThis(): void {
    this.handleButtonAddClick = this.handleButtonAddClick.bind(this);
    this.handleButtonRemoveClick = this.handleButtonRemoveClick.bind(this);
  }

  private addEventListeners(): void {
    this.$buttonAdd.on('click.buttonAdd', this.handleButtonAddClick);
    this.$buttonRemove.on('click.buttonRemove', this.handleButtonRemoveClick);
  }

  private handleButtonAddClick(): void {
    const randomValue = Math.random();
    const newValue = parseInt((randomValue * 1000).toString(), 10).toString();
    const item = prompt('Введите новый объект', newValue);
    if (item) this.$select.append(new Option(item));
    const lengthSelect = this.select?.length || -1;
    if (lengthSelect > 1) this.$selectItems.removeClass(this.CLASSES.modNotUsing);
    else this.$selectItems.addClass(this.CLASSES.modNotUsing);
    if (lengthSelect > 0) {
      this.$buttonRemove.prop('disabled', false);
      this.$buttonRemove.removeClass(this.CLASSES.modRemoveDisabled);
    }
  }

  private handleButtonRemoveClick(): void {
    this.$select.find('option:selected').remove();
    const lengthSelect = this.select?.length || -1;
    if (lengthSelect > 1) this.$selectItems.removeClass(this.CLASSES.modNotUsing);
    else this.$selectItems.addClass(this.CLASSES.modNotUsing);
    if (lengthSelect === 0) {
      this.$buttonRemove.prop('disabled', true);
      this.$buttonRemove.addClass(this.CLASSES.modRemoveDisabled);
    }
  }
}
