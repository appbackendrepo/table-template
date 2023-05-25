import {
    Button,
    Divider,
    Input,
    Modal,
    Select,
    Text,
    useToasts,
} from '@geist-ui/core';
import { Download } from 'iconoir-react';
import { useState } from 'react';
import XLSX, { utils, writeFileXLSX } from 'xlsx';

const DownloadTableData = ({ data, columns }) => {
    const { setToast } = useToasts({ placement: 'topRight' });
    const [state, setState] = useState(false);
    const [fileName, setFileName] = useState('output');

    const [fileType, setFileType] = useState('');

    const handler = () => setState(true);

    const closeHandler = (event) => {
        setState(false);
    };

    const handleFileType = (val) => setFileType(val);

    const exportDataFn = () => {
        const fieldsToRemove = ['qid', 'questionType', 'aid', 'q', 'a'];
        const dataArray = data.map((obj) => {
            const newObj = { ...obj }; // Create a copy of the object

            // Remove the specified fields from the object
            fieldsToRemove.forEach((field) => delete newObj[field]);

            return newObj; // Return the updated object
        });
        if (fileType === 'JSON') {
            const dataString = JSON.stringify(dataArray, null, 2);

            const blob = new Blob([dataString], {
                type: 'application/json',
            });

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'example';
            link.click();

            window.URL.revokeObjectURL(link.href);
        }

        if (fileType === 'CSV') {
            const items = dataArray;
            const replacer = (key, value) => (value === null ? '' : value); // Handle null values

            const header = Object.keys(items[0]);
            let csv = header.join(',') + '\r\n'; // Create CSV header row

            csv += items
                .map((item) => {
                    return header
                        .map((fieldName) =>
                            JSON.stringify(item[fieldName], replacer)
                        )
                        .join(',');
                })
                .join('\r\n');

            const csvData = new Blob([csv], {
                type: 'text/csv;charset=utf-8;',
            });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(csvData);
            link.download = 'untitled';
            link.click();
            window.URL.revokeObjectURL(link.href);
        }

        if (fileType === 'EXCEL') {
            // generate worksheet using data with the order specified in the columns array
            const ws = utils.json_to_sheet(dataArray, {
                header: columns.map((c) => c.id || c.title),
                dense: true,
            });
            // rewrite header row with titles
            utils.sheet_add_aoa(ws, [columns.map((c) => c.title || c.id)], {
                origin: 'A1',
            });
            // create workbook
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, 'Export'); // replace with sheet name
            // download file
            // XLSX.stream.to_csv(wb);
            writeFileXLSX(wb, 'output.xlsx');
        }
    };

    return (
        <>
            <div className="option" onClick={() => handler()}>
                <Download />
                <span>Download</span>
            </div>
            <Modal visible={state} onClose={closeHandler} width="400px">
                <div className="clone-table">
                    <Text h5 my={0}>
                        Export Data
                    </Text>
                    <Text small>
                        Into CSV, JSON, EXCEL format with one click.
                    </Text>

                    <br />
                    <br />
                    <Input
                        placeholder="Give a file name"
                        initialValue={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        width="100%"
                    />
                    <br />
                    <br />
                    <Select
                        placeholder="Select the file format to download"
                        onChange={handleFileType}
                        width="100%"
                    >
                        <Select.Option value="CSV">CSV</Select.Option>
                        <Select.Option value="JSON">JSON</Select.Option>
                        <Select.Option value="EXCEL">Excel</Select.Option>
                    </Select>
                    <br />
                    <br />
                    <Button
                        icon={<Download />}
                        type="secondary"
                        scale={2 / 3}
                        width="170px"
                        disabled={fileType === ''}
                        onClick={exportDataFn}
                    >
                        Download {fileType} File
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default DownloadTableData;
