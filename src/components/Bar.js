import React from "react";
import { AppBar, Container, Toolbar, Typography, FormControl, Select, MenuItem } from "@mui/material";

export default function Bar({imageFile, setImageFile}) {
  const onSelectChange = event => {
    setImageFile(event.target.value);
  };
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Garment Design</Typography>
          <FormControl>
            <Select 
              displayEmpty 
              color='primary'
              onChange={onSelectChange} 
              value={imageFile} 
              sx={{ backgroundColor: '#ffffff', minWidth: 120}}
            >
              <MenuItem value={'/images/body0.png'}>Image #0</MenuItem>
              <MenuItem value={'/images/body1.png'}>Image #1</MenuItem>
              <MenuItem value={'/images/body2.png'}>Image #2</MenuItem>
              <MenuItem value={'/images/body3.png'}>Image #3</MenuItem>
              <MenuItem value={'/images/body4.png'}>Image #4</MenuItem>
            </Select>
          </FormControl>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
