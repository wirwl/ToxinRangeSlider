/* eslint-disable import/prefer-default-export */
export const mergeSliderOptions = (state: RangeSliderOptions, newState: AnyObject): RangeSliderOptions => {
  const { items } = newState;
  const values = items && items.values;
  if (values?.length > 0) state.items.values = [];
  $.extend(true, state, newState);
  return state;
};

export const isEqualArrays = (ar1: (string | number)[] | null, ar2: (string | number)[] | null): boolean => {
  if (!ar1 || !ar2) return false;
  if (ar1.length !== ar2.length) return false;
  return ar1.every((value, index) => value === ar2[index]);
};

export const convertPixelValueToRelativeValue = (
  val: number,
  lineWidth: number,
  state: RangeSliderOptions,
): number | string => {
  let result: number | string;
  const { items, maxValue, minValue } = state;
  const values = items?.values;
  const isUsingItemsCurrent = items && values && values.length > 1;
  let restoreIndex = -1;

  if (isUsingItemsCurrent) {
    const pxStep = lineWidth / (items.values.length - 1);
    restoreIndex = Math.round(val / pxStep);
    result = values[restoreIndex];
  } else {
    const percent = val / lineWidth;
    result = Math.round(Number(minValue) + percent * (Number(maxValue) - Number(minValue)));
  }
  return result;
};

export const convertRelativeValueToPixelValue = (
  val: string | number,
  lineWidth: number,
  state: RangeSliderOptions,
): number => {
  const { items, minValue, maxValue } = state;
  const values = items?.values;
  const isHasValues = items && values && values.length > 1;
  let result;
  if (isHasValues) {
    const pxStep = lineWidth / (values.length - 1);
    const index = values.indexOf(val);
    result = index === -1 ? 0 : index * pxStep;
  } else {
    const relLength = Number(maxValue) - Number(minValue);
    const relPercent = (Number(val) - Number(minValue)) / relLength;
    result = lineWidth * relPercent;
  }
  return result;
};
