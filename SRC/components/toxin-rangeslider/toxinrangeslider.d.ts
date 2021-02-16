/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Options for the rangeslider plugin.
 */
interface RangeSliderOptions {
  isVertical: boolean;
  isTwoHandles: boolean;
  isTip: boolean;
  minValue: number | string;
  maxValue: number | string;
  stepValue: number;
  valueFrom: number | string;
  valueTo: number | string;
  items: RangeSliderItems;
  onHandlePositionChange?(this: Readonly<RangeSliderOptions>, data: HandleMovingResult): void;
}

interface RangeSliderItems {
  values: (number | string)[];
  indexFrom: number;
  indexTo: number;
}

interface HandleMovingResult {
  isFromHandle: boolean;
  relValue: number | string;
}

/**
 * Global options of the rangeslider plugin available as properties on $.fn object.
 */
interface RangeSliderGlobalOptions {
  /**
   * Global options of the rangeslider plugin.
   */
  options?: RangeSliderOptions;
}

/**
 * Function to apply the rangeslider plugin to the selected elements of a jQuery result.
 */
interface RangeSliderFunction {
  /**
   * Apply the rangeslider plugin to the elements selected in the jQuery result.
   *
   * @param options Options to use for this application of the rangeslider plugin.
   * @returns jQuery result.
   */
  (options?: RangeSliderOptions): JQuery;
}

/**
 * Declaration of the rangeslider plugin.
 */
interface RangeSlider extends RangeSliderGlobalOptions, RangeSliderFunction {}

/**
 * Extend the jQuery result declaration with the rangeslider plugin.
 */
interface JQuery {
  /**
   * Extension of the rangeslider plugin.
   */
  toxinRangeSlider: RangeSlider;
}

type anyFunction = (data?: any) => void;

interface DomEntities {
  domEntity: string;
  $parentElement: JQuery<HTMLElement>;
}

interface SubViewData {
  domEntity: string;
  $parentElement: JQuery<HTMLElement>;
}

interface AnyObject {
  [key: string]: any;
}
