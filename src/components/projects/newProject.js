import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import ProjectImage from './projectImage';
import Snackbar from '@material-ui/core/Snackbar';
import config from '../../config'

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 825,
    height: 465,
    backgroundColor: '#fff',
    top: '50%',
    left: '50%',
    borderRadius: '12px',
    transform: 'translate(-50%, -50%)',
  },
  button: {
    width: '203px',
    height: '56px',
    fontSize: '18px',
    fontWeight: '400',
    textTransform: 'none',
    marginRight: '16px',
  },
}));

export default function NewProject({ open, onClose, user, onProjectUpdate}) {
  const classes = useStyles();

  const [projectName, setProjectName] = useState('');
  const [image, setImage] = useState(null); 
  const [projectNameError, setProjectNameError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleProjectNameChange = (event) => {
    const name = event.target.value;
    setProjectName(name);

    if (!name) {
      setProjectNameError('Project Name is required');
    } else {
      setProjectNameError('');
    }
  };
  const handleClose = () => {
    onClose(); 
    setProjectName('');
    setProjectNameError('');
  };
  const handleRemoveImage = () => {
    setImage(null)
  }
  const handleOnDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };

  const handleProjectName = () => {
    if (!projectName) {
      setProjectNameError('Project Name is required');
    }
  }
  const handleAddProjectClick = () => {
    if (!projectName) {
      setProjectNameError('Project Name is required');
      return;
    }
    const user_id = user.user_id;
    const projectData = {
      project_name: projectName,
      manager_id: user_id,
    };

    const api_endpoint = `${config.baseUrl}/projects`
    console.log("from neww")
    fetch(api_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to create a project');
      }
      return response.json();
    })
    .then((data) => {
      onProjectUpdate(data.projects)
      handleClose();
      showSnackbar();
    })
    .catch((error) => {
      console.error('Error creating a project:', error);
    });
  };
  const showSnackbar = () => {
    setSnackbarOpen(true);
  };

  const body = (
    <div className={classes.paper}>
      <Grid container style={{ borderRadius: '12px' }}>
        <Grid item md={6}>
          <Typography variant="h5" component="h1" style={{ marginLeft: '30px', marginTop: '28px', marginBottom: '28px' }}>
            Add new Project
          </Typography>
        </Grid>

        <Grid item md={8}>
          <Typography style={{ fontWeight: '400', marginLeft: '30px' }}>
            Project Name
          </Typography>
          <div style={{ paddingLeft: '30px', paddingRight: '30px', marginTop: '15px', marginBottom: '30px' }}>
            <TextField
              id="outlined-basic"
              label="Project Name"
              variant="outlined"
              fullWidth
              onBlur={handleProjectName}
              placeholder="Enter project name"
              value={projectName}
              onChange={handleProjectNameChange}
              error={Boolean(projectNameError)}
              helperText={projectNameError}
            />
          </div>
          <Typography style={{ fontWeight: '400', marginLeft: '30px' }}>
            Short details
          </Typography>
          <div style={{ paddingLeft: '30px', paddingRight: '30px', marginTop: '15px', marginBottom: '30px' }}>
            <TextField id="outlined-basic" label="" variant="outlined" fullWidth placeholder="Enter details here" />
          </div>
        </Grid>
        <Grid item md={4} style={{ height: '194px', width: '194px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {image ? (
            <div style={{ height: '100%', width: '100%', marginTop: "50px", position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CancelIcon fontSize='small' onClick={handleRemoveImage}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 1,
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '50%',
                }}
              />
              <img src={URL.createObjectURL(image)} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          ) : (
            <ProjectImage onDrop={handleOnDrop}/>
          )}
        </Grid>
        <Grid item md={3} style={{ paddingLeft: '30px' }}>
          <Button variant="contained" className={classes.button} style={{ backgroundColor: '#007DFA', color: '#FFF' }} onClick={handleAddProjectClick}>
            Add
          </Button>
        </Grid>
        <Grid item md={3} style={{ paddingLeft: '60px' }}>
          <Button variant="outlined" className={classes.button} onClick={handleClose}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}
      >
        {body}
      </Modal>
      <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message="Project added successfully"
        >
      </Snackbar>
      </div>
  );
}
