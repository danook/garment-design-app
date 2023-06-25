import React from "react";
import Bar from './Bar';
import Garment from './Garment';
import { Container } from "@mui/material";

export default function App() {
  const [imageFile, setImageFile] = React.useState('/images/body0.png');
  return (
    <>
      <Bar imageFile={imageFile} setImageFile={setImageFile}/>
      <Container sx={{width: 'max-content'}}>
        <Container sx={{margin: 'auto'}}>
          <Garment imageFile={imageFile}/>
        </Container>
      </Container>
    </>
  );
}

