// https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-table
import {
    UseExpandedHooks,
    UseExpandedInstanceProps,
    UseExpandedOptions,
    UseExpandedRowProps,
    UseExpandedState,
} from 'react-table';

declare module 'react-table' {
    export interface TableOptions<D extends Record<string, unknown>> extends UseExpandedOptions<D> {}

    export interface Hooks<D extends Record<string, unknown> = Record<string, unknown>> extends UseExpandedHooks<D> {}

    export interface TableInstance<D extends Record<string, unknown> = Record<string, unknown>>
        extends UseExpandedInstanceProps<D> {}

    export interface TableState<D extends Record<string, unknown> = Record<string, unknown>>
        extends UseExpandedState<D> {}

    export interface Row<D extends Record<string, unknown> = Record<string, unknown>> extends UseExpandedRowProps<D> {}
}
