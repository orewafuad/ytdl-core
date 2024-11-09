export type YTDL_DecipherFunction = {
    /* You can specify what variable name should define the actual signature. The argument names specified here are defined as follows.
     * var [ARGUMENT_NAME] = [SIGNATURE CONTENT];
     * */
    argumentName: string;

    /* You can specify the actual decoding code. Note that this code should be in the following format.
     * Code Format: var FUNCTION_NAME = {...FUNCTION...};FUNCTION_NAME(ARGUMENT_NAME);
     * */
    code: string;
};

export type YTDL_NTransformFunction = {
    /* The name of the variable that defines the actual N code can be specified. The argument names specified here are defined as follows.
    * var [ARGUMENT_NAME] = [N CODE];
    * */
    argumentName: string;

    /* You can specify the actual N transform code. Note that this code should be in the following format.
    * Code Format: var FUNCTION_NAME = {...FUNCTION...};FUNCTION_NAME(ARGUMENT_NAME);
    * */
    code: string;
};
