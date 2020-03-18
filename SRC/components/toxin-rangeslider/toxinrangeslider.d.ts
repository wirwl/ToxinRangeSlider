/**
 * Options for the rangeslider plugin.
 */
interface RangeSliderOptions {
    isVertical?: boolean;
    isTwoHandles?: boolean;
    isTip?: boolean;
    isScale?: boolean;
    minValue?: number | string;
    maxValue?: number | string;
    stepValue?: number;
    valueFrom?: number | string;
    valueTo?: number | string;
    items?: RangeSliderItems;
    onHandlePositionChange?: Function;
}

interface RangeSliderItems {
    values?: (number | string)[];
    indexFrom?: number;
    indexTo?: number;
}

interface HandleMovingResult {
    isFromHandle: boolean;
    value: number | string;
    isUsingItems: boolean;
    index: number;
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