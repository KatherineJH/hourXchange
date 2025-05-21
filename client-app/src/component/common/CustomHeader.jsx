import React from 'react';
import {Typography} from "@mui/material";

function CustomHeader({text}) {
    return (
        <Typography variant="h4" sx={{mt: 4}} gutterBottom>
            {text}
        </Typography>
    );
}

export default CustomHeader;