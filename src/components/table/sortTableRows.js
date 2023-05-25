import { Popover, Select } from '@geist-ui/core';
import { useState } from 'react';
import { ArrowRight, Sort } from 'iconoir-react';

const SortTableRows = ({ updateTableRows, columns }) => {
    const [orderArray, setOrderArray] = useState([]);

    const [sortKey, setSortKey] = useState('');
    const [sortOrderKey, setSortOrderKey] = useState('');

    const handler = (v) => {
        setSortOrderKey(v);
        updateTableRows(sortKey, v);
    };
    const fieldHandler = (v) => {
        setSortOrderKey('');
        setSortKey(v);
        setOrderArray([]);
        const fieldIndex = columns.findIndex((x) => x.id === v);
        const { dataType } = columns[fieldIndex];
        let sortString = 'a2z';
        if (dataType === 'Number') {
            sortString = '129';
            setSortOrderKey('129');
            setOrderArray([
                { start: '1', end: '9', value: '129' },
                { start: '9', end: '1', value: '921' },
            ]);
        } else {
            setSortOrderKey('a2z');
            sortString = 'a2z';
            setOrderArray([
                { start: 'A', end: 'Z', value: 'a2z' },
                { start: 'Z', end: 'A', value: 'z2a' },
            ]);
        }
        updateTableRows(v, sortString);
    };

    return (
        <div>
            <Popover
                content={() => (
                    <>
                        <Popover.Item width="250px">
                            <Select
                                scale={2 / 3}
                                placeholder="Choose a field to sort"
                                onChange={fieldHandler}
                                width="100%"
                                value={sortKey}
                            >
                                {columns.map((cl, key) => (
                                    <Select.Option value={cl.id} key={key}>
                                        {cl.title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Popover.Item>
                        {orderArray.length > 0 && (
                            <Popover.Item width="250px">
                                <Select
                                    scale={2 / 3}
                                    onChange={handler}
                                    width="100%"
                                    value={sortOrderKey}
                                >
                                    {orderArray.map((order, key) => (
                                        <Select.Option
                                            key={key}
                                            value={order.value}
                                        >
                                            {order.start} <ArrowRight />{' '}
                                            {order.end}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Popover.Item>
                        )}
                    </>
                )}
            >
                <div className="option">
                    <Sort />
                    <span>Sort</span>
                </div>
            </Popover>
        </div>
    );
};

export default SortTableRows;
