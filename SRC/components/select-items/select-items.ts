$(document).ready(() => {
    const $selectItems = $('.select-items');
    $selectItems.each(function() {
        const $si = $(this);
        const $buttonAdd = $si.find('.select-items__button-add');
        const $buttonRemove = $si.find('.select-items__button-remove');
        const $select = $si.find('.select-items__options');
        const select = $select[0] as HTMLSelectElement;
        $buttonAdd.click(function() {
            $select.append(new Option('108'));
            if (select.length > 1) $si.removeClass('select-items_not-using');
            else $si.addClass('select-items_not-using');
            if (select.length > 0) {
                $buttonRemove.prop('disabled', false);
                $buttonRemove.removeClass('select-items__button-remove_disabled');
            }
        });
        $buttonRemove.click(function() {
            $select.find('option:selected').remove();
            if (select.length > 1) $si.removeClass('select-items_not-using');
            else $si.addClass('select-items_not-using');
            if (select.length == 0) {
                $buttonRemove.prop('disabled', true);
                $buttonRemove.addClass('select-items__button-remove_disabled');
            }
        });
    });
});
