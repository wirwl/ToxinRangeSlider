$(document).ready(() => {
    const $selectItems = $('.select-items');
    $selectItems.each(function() {
        const $si = $(this);
        const $add = $si.find('.select-items__button-add');
        const $remove = $si.find('.select-items__button-remove');
        $add.click(function() {
            const $select = $si.find('.select-items__options');
            $select.append(new Option('test'));
        });
        $remove.click(function() {
            const $select = $si.find('.select-items__options');
            $select.find('option:selected').remove();
        });
    });
});
