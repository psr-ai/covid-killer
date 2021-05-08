import * as React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

const availableFilterOperations = [
    'equal', 'notEqual',
    'greaterThan', 'greaterThanOrEqual',
    'lessThan', 'lessThanOrEqual',
];

export const IntegerTypeProvider = props => (
    <DataTypeProvider
        availableFilterOperations={availableFilterOperations}
        {...props}
    />
);
