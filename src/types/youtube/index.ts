export * from './Renderers';
export * from './Misc';
export * from './Player';
export * from './Next';
export * from './Formats';

export type YT_PreconditionErrorResponse = {
    error: {
        code: number;
        message: string;
        errors: Array<{
            message: string;
            domain: string;
            reason: string;
        }>;
        status: string;
    };
};
