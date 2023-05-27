import Head from 'next/head';
import dynamic from 'next/dynamic';
import meta from '../../meta.json';
import { useEffect, useState } from 'react';
import { Input, Text } from '@geist-ui/core';
import { Search } from 'iconoir-react';
import PoweredBy from '@/components/table/poweredBy';
const TableGrid = dynamic(
    () => {
        return import('../components/table/grid');
    },
    { ssr: false }
);
let stopper = true;
export default function Home() {
    const [tableRows, setTableRows] = useState([]);
    const [copyTableRows, setCopyTableRows] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            stopper = false;
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_TABLE_BACKEND_API}?columnFields=1`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const { data, columns } = await res.json();
                setTableColumns(columns);
                setTableRows(data);
                setCopyTableRows(data);
                setTimeout(() => {
                    stopper = true;
                }, 1000);
            } catch (error) {
                console.error(error);
            }
        };
        if (stopper) fetchData();
    }, []);

    const updateTableRowsOnFilter = (filterKey, condition, value) => {
        const filterArray = copyTableRows.filter(function (obj) {
            let propValue = obj[filterKey];

            try {
                switch (condition) {
                    case 'contains':
                        return propValue.includes(value);
                    case 'does not contain':
                        return !propValue.includes(value);
                    case 'is equal to':
                        return propValue === value;
                    case 'is not equal to':
                        return propValue !== value;
                    case 'is empty':
                        return !propValue || propValue.length === 0;
                    case 'is not empty':
                        return propValue && propValue.length > 0;
                    default:
                        return false;
                }
            } catch (error) {
                console.log(error);
            }
        });

        if (filterArray.length === 0) {
            let newRowObj = {};
            for (let u = 0; u < tableColumns.length; u++) {
                newRowObj[tableColumns[u].id] = '';
            }

            setTableRows([newRowObj]);
        } else {
            setTableRows([...filterArray]);
        }
    };
    const clearFilterFromRows = () => {
        setTableRows([...copyTableRows]);
    };

    const updateTableRowsOnSort = (sKey, sortOrder) => {
        let ascending =
            sortOrder === 'a2z' || sortOrder === '129' ? true : false;
        tableRows.sort(function (a, b) {
            if (typeof a[sKey] === 'string' && typeof b[sKey] === 'string') {
                try {
                    return ascending
                        ? a[sKey]?.localeCompare(b[sKey])
                        : b[sKey]?.localeCompare(a[sKey]);
                } catch (error) {
                    console.log('error on sort');
                }
            } else {
                try {
                    return ascending ? a[sKey] - b[sKey] : b[sKey] - a[sKey];
                } catch (error) {
                    console.log('error on sort');
                }
            }
        });
        setTableRows([...tableRows]);
    };

    const searchResult = (e) => {
        const { value } = e.target;

        if (value === '') {
            setTableRows(copyTableRows);
            return;
        }

        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_TABLE_BACKEND_API}/search?q=${value}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const { hits } = await res.json();
                setTableRows(hits);
                // handle success
            } catch (error) {
                console.error(error);
                // handle error
            }
        }, 500);

        setTimer(newTimer);
    };

    return (
        <>
            <Head>
                <title>{meta.title.value}</title>
                <meta name="description" content={meta.description.value} />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <PoweredBy />
                <div className="table-section">
                    <div className="search-input">
                        <Text h2>Table Template</Text>
                        <Input
                            icon={<Search />}
                            placeholder="Advance search into this table"
                            width="100%"
                            onChange={searchResult}
                        />
                    </div>
                    <TableGrid
                        tableRows={tableRows}
                        tableColumns={tableColumns}
                        updateTableRowsOnFilter={updateTableRowsOnFilter}
                        clearFilterFromRows={clearFilterFromRows}
                        updateTableRowsOnSort={updateTableRowsOnSort}
                    />
                </div>
            </main>
        </>
    );
}
