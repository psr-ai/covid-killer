import * as React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

const Formatter = ({ value }) => (value ? (new Date(value)).toTimeString() : 'NA');

export const DateTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={Formatter}
        {...props}
    />
);
