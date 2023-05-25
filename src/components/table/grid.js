import DataEditor, { GridCellKind } from '@glideapps/glide-data-grid';
import { useExtraCells } from '@glideapps/glide-data-grid-cells';
import { useCallback, useState } from 'react';
import '@glideapps/glide-data-grid/dist/index.css';
import '@glideapps/glide-data-grid-cells/dist/index.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { columnWithHeaderIcons } from './tableFunctions';
import FilterRows from './filterRows';
import SortTableRows from './sortTableRows';
import DownloadTableData from './downloadTableData';
import { Calculator } from 'iconoir-react';
import { Modal, Text } from '@geist-ui/core';

const TableGrid = ({
    tableRows,
    tableColumns,
    readOnlyFlag = true,
    updateTableRowsOnFilter,
    clearFilterFromRows,
    updateTableRowsOnSort,
}) => {
    const cellProps = useExtraCells();
    const [showSearch, setShowSearch] = useState(false);
    const [gridSelection, setGridSelection] = useState(undefined);

    const [activeRow, setActiveRow] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const getContent = useCallback(
        (cell) => {
            const [col, row] = cell;
            const objKey = tableColumns[col]?.id;

            if (objKey === undefined) {
                return;
            }
            // if (dataRow[objKey] === undefined) dataRow[objKey] = '';
            // const d = dataRow[objKey] ?? '';
            const d = String(tableRows[row]?.[tableColumns[col].id] ?? '');

            const { dataType, possibleTags, allowedValues } = tableColumns[col];

            if (dataType === 'Number') {
                const dateValue = d === null ? '' : d;
                return {
                    allowOverlay: false,
                    kind: GridCellKind.Number,
                    data: dateValue,
                    displayData: dateValue.toString(),
                    readonly: readOnlyFlag,
                };
            } else if (dataType === 'Protected') {
                const dataValue = d === '' ? '' : d;
                return {
                    kind: GridCellKind.Protected,
                    data: dataValue,
                    displayData: dataValue,
                    allowOverlay: false,
                    readonly: readOnlyFlag,
                };
            } else if (dataType === 'Image') {
                return {
                    kind: GridCellKind.Image,
                    data: [d],
                    allowOverlay: false,
                    allowAdd: true,
                    readonly: readOnlyFlag,
                };
            } else if (dataType === 'Boolean') {
                const dateValue = d === 'true' ? true : false;
                return {
                    kind: GridCellKind.Boolean,
                    data: dateValue,
                    readonly: false,
                    allowOverlay: false,
                    readonly: readOnlyFlag,
                };
            } else if (dataType === 'Uri') {
                const dateValue = d === '' ? '' : d;
                return {
                    kind: GridCellKind.Uri,
                    data: dateValue,
                    allowOverlay: false,
                    readonly: readOnlyFlag,
                };
            } else if (dataType === 'Bubble') {
                return {
                    kind: GridCellKind.Bubble,
                    data: ['sss', 'ss'],
                    allowOverlay: false,
                    readonly: readOnlyFlag,
                };
            } else if (dataType === 'SingleDropdown') {
                return {
                    kind: GridCellKind.Custom,
                    allowOverlay: false,
                    copyData: 4,
                    data: {
                        kind: 'dropdown-cell',
                        allowedValues: ['Good', 'Better', 'Best'],
                        value: 'Good',
                    },
                    readonly: readOnlyFlag,
                };
            } else if (dataType === 'Rating') {
                const dateValue = d !== '' ? d : 0;
                return {
                    kind: GridCellKind.Custom,
                    allowOverlay: false,
                    copyData: '4',
                    data: {
                        kind: 'star-cell',
                        label: 'Rating',
                        rating: dateValue,
                    },
                    readonly: readOnlyFlag,
                };
            } else if (dataType === 'Tags') {
                const dateValue = d !== '' ? d.split(',') : [];
                return {
                    kind: GridCellKind.Custom,
                    allowOverlay: false,
                    copyData: '4',
                    data: {
                        kind: 'tags-cell',
                        possibleTags: possibleTags ? possibleTags : [],
                        readonly: false,
                        // readonly: row % 2 === 0,
                        tags: dateValue,
                    },
                    readonly: readOnlyFlag,
                };
            } else if (dataType === 'Select') {
                const dateValue = d !== '' ? d : [];
                return {
                    kind: GridCellKind.Custom,
                    allowOverlay: false,
                    copyData: '4',
                    data: {
                        kind: 'dropdown-cell',
                        allowedValues: allowedValues ? allowedValues : [],
                        value: dateValue,
                    },
                    readonly: readOnlyFlag,
                };
            } else if (dataType === 'DatePicker') {
                const dateValue =
                    d !== '' ? moment.unix(d / 1000).format('MM/DD/YYYY') : '';

                // const dateValue = d !== '' ? d : '';

                return {
                    kind: GridCellKind.Custom,
                    allowOverlay: false,
                    copyData: '4',
                    data: {
                        kind: 'date-picker-cell',
                        date: new Date(),
                        displayDate: dateValue,
                        format: 'date',
                    },
                    readonly: readOnlyFlag,
                };
            } else {
                return {
                    kind: GridCellKind.Text,
                    allowOverlay: false,
                    readonly: false,
                    displayData: d,
                    data: d,
                    readonly: true,
                    readonly: readOnlyFlag,
                };
            }
        },
        [tableRows, tableColumns]
    );

    const renderSearchOption = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.keyCode === 70) {
            setShowSearch((cv) => !cv);
            event.stopPropagation();
            event.preventDefault();
        }
    };

    const onSearchClose = useCallback(() => setShowSearch(false), []);
    const onGridSelection = (newVal) => {
        setGridSelection(newVal);
        const copyData = tableRows;
        const idArray = [];
        newVal.rows.items.forEach((e) => {
            idArray.push(...copyData.slice(e[0], e[1]).map((x) => x._id));
        });
    };

    const onCellActivated = (cell) => {
        const [col, row] = cell;
        const { dataType, id } = tableColumns[col];
        setShowInfoModal(true);
        setActiveRow(tableRows[row]);
    };

    function renderValue(value) {
        if (typeof value === 'number') {
            return (
                <Text small type="secondary">
                    {value}
                </Text>
            );
        } else if (typeof value === 'string') {
            if (
                value.startsWith('http') &&
                /\.(png|jpg|jpeg|gif)$/i.test(value)
            ) {
                return <img src={value} alt="Image" />;
            } else {
                return (
                    <Text small type="secondary">
                        {value.toString()}
                    </Text>
                );
            }
        } else {
            return (
                <Text small type="secondary">
                    {value.toString()}
                </Text>
            );
        }
    }

    function KeyValueList({ data }) {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data).map(([key, value]) => (
                        <tr key={key}>
                            <td>
                                <Text small>{key}</Text>
                            </td>
                            {renderValue(value)}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <>
            <Modal
                visible={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                width="550px"
            >
                <div style={{ textAlign: 'left' }}>
                    <Text h3>Data Details</Text>
                    <KeyValueList data={activeRow} />
                </div>
            </Modal>
            <div className="table-header">
                <div className="table-option">
                    <FilterRows
                        columns={tableColumns}
                        updateTableRowsOnFilter={updateTableRowsOnFilter}
                        clearFilterFromRows={clearFilterFromRows}
                    />

                    <SortTableRows
                        columns={tableColumns}
                        updateTableRows={updateTableRowsOnSort}
                    />

                    <div className="option">
                        <Calculator />
                        <span>
                            {tableRows.length} rows & {tableColumns.length}{' '}
                            column
                        </span>
                    </div>
                </div>
                <div className="table-more-options">
                    <DownloadTableData
                        data={tableRows}
                        columns={tableColumns}
                    />
                </div>
            </div>
            <DataEditor
                {...cellProps}
                getCellContent={getContent}
                columns={columnWithHeaderIcons(tableColumns)}
                rows={tableRows.length}
                rowMarkers={'both'}
                showSearch={showSearch}
                getCellsForSelection={true}
                onSearchClose={onSearchClose}
                gridSelection={gridSelection}
                onGridSelectionChange={onGridSelection}
                width={'100%'}
                onCellActivated={onCellActivated}
                allowOverlay={false}
                theme={{
                    fontFamily: 'DM Sans',
                    accentColor: '#000',
                }}
                selection={{
                    current: undefined,
                }}
                smoothScrollX={true}
                smoothScrollY={true}
                onKeyDown={renderSearchOption}
                verticalBorder={(c) => c > 0}
                rightElementProps={{
                    fill: false,
                    sticky: true,
                }}
            />
            {/* <div id="portal" /> */}
        </>
    );
};

export default TableGrid;
