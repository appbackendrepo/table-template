import React from 'react';
import { CableTag } from 'iconoir-react';
import { Text } from '@geist-ui/core';

const PoweredBy = () => {
    return (
        <a
            href="https://tablebackend.com"
            target="_blank"
            className="powered-by"
        >
            <CableTag />
            <Text small>Table Backend</Text>
        </a>
    );
};

export default PoweredBy;
