import React, {useEffect, useState} from 'react';
import {Box, Button, List, ListItem, ListItemButton, ListItemText, Paper, TextField} from "@mui/material";
import {useCustomDebounce} from "../../assets/useCustomDebounce.js";
import {getAutocompleteSuggestions} from "../../api/donationApi.js";

function DonationSearch({setPage, keyword, setKeyword}) {
    const [searchInput, setSearchInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const debouncedInput = useCustomDebounce(searchInput, 300);

    useEffect(() => {
        if (searchInput.trim() === "" || searchInput === keyword) {
            setSuggestions([]);
            return;
        }
        getAutocompleteSuggestions(debouncedInput)
            .then(res => setSuggestions(res.data))
            .catch(e => {
                console.error("추천 검색어 실패", e);
                setSuggestions([]);
            });
        setHighlightedIndex(-1);
    }, [debouncedInput, keyword]);

    const handleSearch = () => {
        setKeyword(searchInput);
        setPage(0);
    };

    return (
    <Box sx={{ position: "relative", width: "300px" }}>
        <TextField
            fullWidth
            variant="outlined"
            placeholder="검색어를 입력하세요"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setHighlightedIndex((prev) =>
                        prev < suggestions.length - 1 ? prev + 1 : 0
                    );
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlightedIndex((prev) =>
                        prev > 0 ? prev - 1 : suggestions.length - 1
                    );
                } else if (e.key === "Enter") {
                    if (
                        highlightedIndex >= 0 &&
                        highlightedIndex < suggestions.length
                    ) {
                        const selected = suggestions[highlightedIndex];
                        setSearchInput(selected);
                        setKeyword(selected);
                        setPage(0);
                        setSuggestions([]);
                        setHighlightedIndex(-1);
                    } else {
                        handleSearch();
                    }
                }
            }}
            size="small"
        />
        <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
                position: "absolute",
                top: 0,
                right: 0,
                height: "100%",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
            }}
        >
            검색
        </Button>

        {/* 추천 검색어 */}
        {suggestions.length > 0 && (
            <Paper
                sx={{
                    position: "absolute",
                    width: "100%",
                    mt: "4px",
                    zIndex: 10,
                    maxHeight: 200,
                    overflowY: "auto",
                }}
            >
                <List dense>
                    {suggestions.map((s, idx) => (
                        <ListItem key={idx} disablePadding>
                            <ListItemButton
                                selected={idx === highlightedIndex}
                                onMouseEnter={() => setHighlightedIndex(idx)}
                                onClick={() => {
                                    setSearchInput(s);
                                    setKeyword(s);
                                    setPage(0);
                                    setSuggestions([]);
                                    setHighlightedIndex(-1);
                                }}
                            >
                                <ListItemText primary={s} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        )}
    </Box>
    );
}

export default DonationSearch;