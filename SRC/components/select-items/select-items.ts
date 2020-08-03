const $selectItems = $('.js-select-items');
$selectItems.each(function () {
    const $si = $(this);
    const $buttonAdd = $si.find('.js-select-items__button-add');
    const $buttonRemove = $si.find('.js-select-items__button-remove');
    const $select = $si.find('.js-select-items__options');
    const select = $select[0] as HTMLSelectElement;
    $buttonAdd.on('click.buttonAdd', function () {
        const randomValue = Math.random();
        const item = prompt('Введите новый объект', (~~(randomValue * 1000)).toString());
        if (item) $select.append(new Option(item));

        if (select.length > 1) $si.removeClass('select-items_not-using');
        else $si.addClass('select-items_not-using');
        if (select.length > 0) {
            $buttonRemove.prop('disabled', false);
            $buttonRemove.removeClass('select-items__button-remove_disabled');
        }
    });

    $buttonRemove.on('click.buttonRemove', function () {
        $select.find('option:selected').remove();
        if (select.length > 1) $si.removeClass('select-items_not-using');
        else $si.addClass('select-items_not-using');
        if (select.length == 0) {
            $buttonRemove.prop('disabled', true);
            $buttonRemove.addClass('select-items__button-remove_disabled');
        }
    });
});

