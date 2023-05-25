import { Badge, Button, Input, Modal, Select } from '@geist-ui/core';
import { useState } from 'react';
import { DeleteCircle, Filter } from 'iconoir-react';

const FilterRows = ({
    updateTableRowsOnFilter,
    columns,
    clearFilterFromRows,
}) => {
    const [showInputBox, setShowInputBox] = useState(false);
    const [state, setState] = useState(false);

    const [filterKey, setFilterKey] = useState('');
    const [filterCondition, setFilterCondition] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [isFilterApplied, setIsFilterApplied] = useState(false);

    const [filterOptions, setFilterOptions] = useState([
        'contains',
        'does not contains',
        'is equal to',
        'is not equal to',
        'is empty',
        'is not empty',
    ]);

    const handlerCondition = (v) => {
        setFilterCondition(v);
        if (
            v === 'contains' ||
            v === 'does not contains' ||
            v === 'is equal to' ||
            v === 'is not equal to' ||
            v === ''
        ) {
            setShowInputBox(true);
        } else {
            setInputValue('');
            setShowInputBox(false);
        }
    };
    const fieldHandler = (v) => {
        setFilterKey(v);
    };

    const closeHandler = (event) => {
        setState(false);
    };

    const filterRowsData = () => {
        if (filterKey && filterCondition) {
            setIsFilterApplied(true);
            updateTableRowsOnFilter(filterKey, filterCondition, inputValue);
        }
    };

    return (
        <div>
            <Modal visible={state} onClose={closeHandler}>
                <Modal.Content>
                    <Select
                        scale={2 / 3}
                        placeholder="Choose a field to filter"
                        onChange={fieldHandler}
                        width="100%"
                        value={filterKey}
                    >
                        {columns.map((cl, key) => (
                            <Select.Option value={cl.id} key={key}>
                                {cl.title}
                            </Select.Option>
                        ))}
                    </Select>
                    <br />
                    <br />
                    <Select
                        scale={2 / 3}
                        onChange={handlerCondition}
                        width="100%"
                        value={filterCondition}
                    >
                        {filterOptions.map((opt, key) => (
                            <Select.Option key={key} value={opt}>
                                {opt}
                            </Select.Option>
                        ))}
                    </Select>
                    {showInputBox && (
                        <>
                            <br />
                            <br />

                            <Input
                                scale={2 / 3}
                                width="100%"
                                placeholder="enter value"
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </>
                    )}
                    <br />
                    <br />
                    <Button
                        icon={<Filter />}
                        type="secondary"
                        scale={2 / 3}
                        onClick={filterRowsData}
                        width="100px"
                    >
                        Filter
                    </Button>
                    &nbsp; &nbsp;
                    <Button
                        icon={<DeleteCircle />}
                        scale={2 / 3}
                        onClick={() => {
                            clearFilterFromRows();
                            setIsFilterApplied(false);
                        }}
                        width="120px"
                    >
                        Clear Filter
                    </Button>
                </Modal.Content>
            </Modal>
            <div className="option" onClick={() => setState(true)}>
                <Filter />
                <span>
                    Filter {isFilterApplied && <Badge scale={1 / 2}>1</Badge>}
                </span>
            </div>
        </div>
    );
};

export default FilterRows;
