class SelectItems {
  private $selectItems: JQuery<HTMLElement>;

  private $buttonAdd: JQuery<HTMLElement>;

  private $buttonRemove: JQuery<HTMLElement>;

  private $select: JQuery<HTMLElement>;

  private select: HTMLSelectElement;

  constructor(element: HTMLElement) {
    this.$selectItems = $(element);
    this.$buttonAdd = this.$selectItems.find('.js-select-items__button-add');
    this.$buttonRemove = this.$selectItems.find('.js-select-items__button-remove');
    this.$select = this.$selectItems.find('.js-select-items__options');
    this.select = this.$select[0] as HTMLSelectElement;

    this.addEventListeners();
  }

  private addEventListeners() {
    this.$buttonAdd.on('click.buttonAdd', this.handleButtonAddClick.bind(this));
    this.$buttonRemove.on('click.buttonRemove', this.handleButtonRemoveClick.bind(this));
  }

  private handleButtonAddClick() {
    const randomValue = Math.random();
    const newValue = parseInt((randomValue * 1000).toString(), 10).toString();
    const item = prompt('Введите новый объект', newValue);
    if (item) this.$select.append(new Option(item));
    if (this.select.length > 1) this.$selectItems.removeClass('select-items_not-using');
    else this.$selectItems.addClass('select-items_not-using');
    if (this.select.length > 0) {
      this.$buttonRemove.prop('disabled', false);
      this.$buttonRemove.removeClass('select-items__button-remove_disabled');
    }
  }

  private handleButtonRemoveClick() {
    this.$select.find('option:selected').remove();
    if (this.select.length > 1) this.$selectItems.removeClass('select-items_not-using');
    else this.$selectItems.addClass('select-items_not-using');
    if (this.select.length === 0) {
      this.$buttonRemove.prop('disabled', true);
      this.$buttonRemove.addClass('select-items__button-remove_disabled');
    }
  }
}

const $selectItems = $('.js-select-items');
$selectItems.each((index, element) => {
  new SelectItems(element);
});
