import React, {useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {
    SortingState, SelectionState, FilteringState, GroupingState, SearchState,
    IntegratedFiltering, IntegratedGrouping, IntegratedSorting, IntegratedSelection,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    VirtualTable, TableHeaderRow, TableFilterRow, TableSelection, TableGroupRow,
    GroupingPanel, DragDropProvider, TableColumnReordering, Toolbar, SearchPanel,
    TableColumnResizing
} from '@devexpress/dx-react-grid-material-ui';


import {ProgressBarCell} from './theme-sources/progress-bar-cell';
import {HighlightedCell} from './theme-sources/highlighted-cell';
import {CurrencyTypeProvider} from './theme-sources/currency-type-provider';
import {PercentTypeProvider} from './theme-sources/percent-type-provider';
import {BooleanTypeProvider} from './theme-sources/boolean-type-provider';
import {IntegerTypeProvider} from "./theme-sources/integer-type-provider";
import {DateTypeProvider} from "./theme-sources/date-type-provider";

import {
    generateRows,
    globalSalesValues,
} from './demo-data/generator';

const Cell = (props) => {
    const {column} = props;
    if (column.name === 'discount') {
        return <ProgressBarCell {...props} />;
    }
    if (column.name === 'amount') {
        return <HighlightedCell {...props} />;
    }
    return <VirtualTable.Cell {...props} />;
};

const getRowId = row => row.id;

export default ({rows}) => {
    const [columns] = useState([
        {name: 'availability_at', title: 'Availability At'},
        {name: 'name', title: 'Center Name'},
        {name: 'address', title: 'Address'},
        {name: 'block_name', title: 'Block Name'},
        {name: 'pincode', title: 'Pincode'},
        {name: 'lat', title: 'Latitude'},
        {name: 'long', title: 'Longitude'},
        {name: 'from', title: 'Open From'},
        {name: 'to', title: 'Open Till'},
        {name: 'fee_type', title: 'Fee Type'},
        {name: 'date', title: 'Date'},
        {name: 'available_capacity', title: 'Available Capacity'},
        {name: 'min_age_limit', title: 'Min Age Limit'},
        {name: 'vaccine', title: 'Vaccine'},
    ]);
    const [tableColumnExtensions] = useState([
        {columnName: 'name', align: 'left'},
        {columnName: 'address', align: 'left'},
    ]);
    // const [currencyColumns] = useState(['amount']);
    // const [percentColumns] = useState(['discount']);
    // const [booleanColumns] = useState(['shipped']);
    const [integerColumns] = useState(['pincode', 'lat', 'long', 'available_capacity', 'min_age_limit']);
    const [dateColumns] = useState(['availability_at']);

    return (
        <Paper>
            <Grid
                rows={rows}
                columns={columns}
                getRowId={getRowId}
            >
                <DragDropProvider/>

                <FilteringState/>
                <SearchState/>
                <SortingState
                    defaultSorting={[
                        {columnName: 'availability_at', direction: 'desc'},
                        {columnName: 'date', direction: 'asc'}
                    ]}
                />
                <GroupingState
                    defaultGrouping={[]}
                    defaultExpandedGroups={[]}
                />
                <SelectionState/>

                <IntegratedFiltering/>
                <IntegratedSorting/>
                <IntegratedGrouping/>
                <IntegratedSelection/>

                {/*<CurrencyTypeProvider for={currencyColumns} />*/}
                {/*<PercentTypeProvider for={percentColumns} />*/}
                {/*<BooleanTypeProvider for={booleanColumns} />*/}
                <IntegerTypeProvider for={integerColumns}/>
                <DateTypeProvider for={dateColumns}/>
                <VirtualTable
                    columnExtensions={tableColumnExtensions}
                    cellComponent={Cell}
                />
                <TableHeaderRow showSortingControls/>
                <TableColumnReordering defaultOrder={columns.map(column => column.name)}/>
                <TableFilterRow showFilterSelector/>
                <TableSelection showSelectAll/>
                <TableGroupRow/>
                <Toolbar/>
                <SearchPanel/>
                <GroupingPanel showSortingControls/>
            </Grid>
        </Paper>
    );
};
