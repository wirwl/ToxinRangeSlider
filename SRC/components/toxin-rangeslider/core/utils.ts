/* eslint-disable import/prefer-default-export */
export const mergeSliderOptions = (state: RangeSliderOptions, newState: AnyObject): RangeSliderOptions => {
  const { items } = newState;
  const values = items && items.values;
  if (values?.length > 0) state.items.values = [];
  $.extend(true, state, newState);
  return state;
};
