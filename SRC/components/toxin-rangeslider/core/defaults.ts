/* eslint-disable */

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

// export function deepCopy(o: { [x: string]: any; hasOwnProperty: (arg0: string) => any }) {
//   // "string", number, boolean
//   if (typeof o != 'object') {
//     return o;
//   }

//   // null
//   if (!o) {
//     return o; //null
//   }

//   var r = o instanceof Array ? [] : {};
//   for (var i in o) {
//     if (o.hasOwnProperty(i)) {
//       r[i] = deepCopy(o[i]);
//     }
//   }
//   return r;
// }
