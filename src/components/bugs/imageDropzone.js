import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dropzone: {
    border: '2px dashed #4C535F',
    borderRadius: '12px',
    padding: '20px',
    backgroundColor: '#FAFBFC',
    textAlign: 'center',
    cursor: 'pointer',
    marginLeft: "30px",
    marginRight: "30px",
    marginTop: "10px",
    position: 'relative',
  },
  imagePlaceholder: {
    width: '40px',
    height: '40px',
    margin: '0 auto',
    display: 'block',
  },
}));

const ImageDropzone = ( { onDrop }) => {
  const classes = useStyles();

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}
      className={classes.dropzone}>
      <input {...getInputProps()} />
      <img
          src="/images/gallery-add.png"
          alt=""
          className={classes.imagePlaceholder}
        />
        <Typography style={{ marginTop: "21px", color: "#4C535F", fontSize:"16px"}}>
          Add image here
        </Typography>
    </div>
  );
};

export default ImageDropzone;