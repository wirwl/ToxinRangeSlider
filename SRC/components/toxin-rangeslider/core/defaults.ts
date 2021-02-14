import block from 'bem-cn';

const b = block('rangeslider');

export const SliderDomEntities = {
  rootElement: `<div class='${b()}'></div>`,
  tipMin: `<div class='${b('tip-min')}'>00</div>`,
  tipMax: `<div class='${b('tip-max')}'>99</div>`,
  tipFrom: `<div class='${b('tip')} ${b('tip-from')}'>23</div>`,
  tipTo: `<div class='${b('tip')} ${b('tip-to')}'>456</div>`,
  lineMain: `<div class='${b('line')}'></div>`,
  lineSelected: `<div class='${b('line-selected')}'></div>`,
  handleFrom: `<div class='${b('handle')} ${b('handle-from')}'>`,
  handleTo: `<div class='${b('handle')} ${b('handle-to')}'>`,
};

const defaultRangeSliderState = {
  isVertical: false,
  isTwoHandles: true,
  isTip: true,
  minValue: 0,
  maxValue: 1234,
  stepValue: 1,
  valueFrom: 0,
  valueTo: 1234,
  items: { indexFrom: 0, indexTo: 0, values: [] },
};

export default defaultRangeSliderState;
