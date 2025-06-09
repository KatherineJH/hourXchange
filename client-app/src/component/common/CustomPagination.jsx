import React from 'react';
import {Box, Pagination, Stack} from "@mui/material";

function CustomPagination({totalPages, page, setPage}) {
    return (
        <Box sx={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
            <Stack spacing={2}>
                <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={(event, value) => setPage(value - 1)}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                />
            </Stack>
        </Box>
    );
}

export default CustomPagination;