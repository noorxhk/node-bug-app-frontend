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
    marginLeft: "20px",
    height: "152px",
    width: "152px",
    marginRight: "30px",
    marginTop: "10px",
    position: 'relative',
  },
  imagePlaceholder: {
    width: '60px',
    height: '60px',
    margin: '0 auto',
    display: 'block',
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
}));

const ProjectImage = ({onDrop}) => {
  const classes = useStyles();
  

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className={classes.dropzone}>
      <input {...getInputProps()} />
      <div className={classes.contentWrapper}>
        <img
          src="/images/gallery-add.png" 
          alt="cloud"
          className={classes.imagePlaceholder}
        />
        <Typography style={{ marginTop: "21px", color: "#4C535F", fontSize: "16px" }}>
          Upload project photo
        </Typography>
      </div>
    </div>
  );
};

export default ProjectImage;
