/**
 * Options for the rangeslider plugin.
 */
interface RangeSliderOptions {
    isVertical?: boolean;
    isInterval?: boolean;
    isTip?: boolean;
    isScale?: boolean;
    minValue?: number;
    maxValue?: number;
    stepValue?: number;
    valueFrom?: number;
    valueTo?: number;
    values?: any[] | null;
    length?: number;
    onHandlePositionChange?: Function;
    //onHandlePositionChange?(pos: number): Function;
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
