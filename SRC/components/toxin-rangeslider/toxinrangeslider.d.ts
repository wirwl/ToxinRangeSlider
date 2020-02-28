/**
 * Options for the example plugin.
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
 * Global options of the example plugin available as properties on $.fn object.
 */
interface RangeSliderGlobalOptions {
    /**
     * Global options of the example plugin.
     */
    options?: RangeSliderOptions;
}

/**
 * Function to apply the example plugin to the selected elements of a jQuery result.
 */
interface RangeSliderFunction {
    /**
     * Apply the example plugin to the elements selected in the jQuery result.
     *
     * @param options Options to use for this application of the example plugin.
     * @returns jQuery result.
     */
    (options?: RangeSliderOptions): JQuery;
}

/**
 * Declaration of the example plugin.
 */
interface RangeSlider extends RangeSliderGlobalOptions, RangeSliderFunction {}

/**
 * Extend the jQuery result declaration with the example plugin.
 */
interface JQuery {
    /**
     * Extension of the example plugin.
     */
    toxinRangeSlider: RangeSlider;
}
