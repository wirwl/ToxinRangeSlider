import './index.less';
import '../../favicons/favicons.js';
import SelectItems from '../../components/select-items/select-items';
import Panel from '../../components/panel/panel';

const $selectItems = $('.js-select-items');
$selectItems.each((index, element) => {
  new SelectItems(element);
});

const $panels = $('.panel');
$panels.each((_, element) => {
  new Panel(element);
});
