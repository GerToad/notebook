import { Box, Typography, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import Editor from "../components/Editor";

export default function Home() {
  const [paletteIndex, setPaletteIndex] = useState(0);

  const handlePaletteChange = (event) => {
    setPaletteIndex(event.target.value);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        ProseMirror Editor with Material-UI
      </Typography>

      {/* Color Palette Selector */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1">Select a Color Palette:</Typography>
        <Select
          value={paletteIndex}
          onChange={handlePaletteChange}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value={0}>Black on White</MenuItem>
          <MenuItem value={1}>White on Black</MenuItem>
          <MenuItem value={2}>Red on Yellow</MenuItem>
          <MenuItem value={3}>Blue on Cyan</MenuItem>
        </Select>
      </Box>

      {/* Editor Component */}
      <Editor paletteIndex={paletteIndex} />
    </Box>
  );
}
