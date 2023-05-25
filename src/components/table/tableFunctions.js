import { GridColumnIcon } from '@glideapps/glide-data-grid';

export const columnWithHeaderIcons = (columns) => {
    const iconMapping = {
        shortText: GridColumnIcon.HeaderString,
        longText: GridColumnIcon.HeaderMarkdown,
        email: GridColumnIcon.HeaderEmail,
        phoneNumber: GridColumnIcon.HeaderPhone,
        date: GridColumnIcon.HeaderDate,
        number: GridColumnIcon.HeaderNumber,
        checkbox: GridColumnIcon.HeaderSplitString,
        fileUpload: GridColumnIcon.HeaderImage,
        dropdown: GridColumnIcon.HeaderSingleValue,
        yesNo: GridColumnIcon.HeaderBoolean,
        opinionScale: GridColumnIcon.HeaderEmoji,
        rating: GridColumnIcon.HeaderEmoji,
        Uri: GridColumnIcon.HeaderUri,
    };
    return columns.map((obj) => {
        obj.icon = iconMapping[obj.dataType] || GridColumnIcon.HeaderString;
        return obj;
    });
};
