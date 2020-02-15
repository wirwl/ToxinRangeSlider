/**
 * Options for the example plugin.
 */
interface ExamplePluginOptions {
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
}
/**
 * Global options of the example plugin available as properties on $.fn object.
 */
interface ExamplePluginGlobalOptions {
    /**
     * Global options of the example plugin.
     */
    options?: ExamplePluginOptions;
}

/**
 * Function to apply the example plugin to the selected elements of a jQuery result.
 */
interface ExamplePluginFunction {
    /**
     * Apply the example plugin to the elements selected in the jQuery result.
     *
     * @param options Options to use for this application of the example plugin.
     * @returns jQuery result.
     */
    (options?: ExamplePluginOptions): JQuery;
}

/**
 * Declaration of the example plugin.
 */
interface ExamplePlugin extends ExamplePluginGlobalOptions, ExamplePluginFunction {}

/**
 * Extend the jQuery result declaration with the example plugin.
 */
interface JQuery {
    /**
     * Extension of the example plugin.
     */
    examplePlugin: ExamplePlugin;
}
