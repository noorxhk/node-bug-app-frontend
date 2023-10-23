import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import { useState, useEffect } from 'react';
import {  Divider, Grid, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Button } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import 'date-fns';
import Radio from '@material-ui/core/Radio';
import Snackbar from '@material-ui/core/Snackbar';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ImageDropzone from './imageDropzone';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import config from '../../config';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 765,
    height: 900,
    backgroundColor: '#fff',
    top: '50%',  
    left: '50%', 
    borderRadius: "12px",
    transform: 'translate(-50%, -50%)', 
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    boxShadow: '0px -5px 5px rgba(0, 0, 0, 0.1)'
  },
  header: {
    height: '71px',
    backgroundColor: '#F5F6F8',
    display: 'flex',
    borderRadius: "12px",
    paddingRight: "30px",
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 30px',
  },
  button: {
    width: '203px',
    height: '56px',
    fontSize: '18px',
    fontWeight: '400',
    textTransform: 'none',
    marginRight: '16px',
    marginTop: '15px'
  },
  dropImage: {
    borderRadius: '12px',
    height: "150px",
    width: "700px",
    backgroundColor: '#FAFBFC',
    textAlign: 'center',
    cursor: 'pointer',
    marginLeft: '30px',
    marginRight: '30px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

function fetchDevelopers() {
  const headers = {
    'Content-Type': 'application/json',
  };

  const requestOptions = {
    method: 'POST',
    headers: headers,
  };
  const api_endpoint = `${config.baseUrl}/users/developers`
  return fetch(api_endpoint, requestOptions)
    .then((response) => response.json())
    .then((data) => data.developers)
    .catch((error) => {
      console.log('API request failed:', error);
      throw error; 
    })
}

export default function BugAdd({ open, onClose, user, project, onBugUpdate }) {
  const classes = useStyles();
  const [bugTitle, setBugTitle] = useState('');
  const [bugDetails, setBugDetails] = useState('');
  const [developers, setDevelopers] = useState();
  const [bugDeveloper, setBugDeveloper] = useState();
  const [image, setImage] = useState(null); 
  const [bugTitleError, setBugTitleError] = useState('');
  const [type, setType] = useState('');
  const [typeError, setTypeError] = useState('');
  const [selectedDate, setSelectedDate] = useState('2017-05-24');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleClose = () => {
    setBugTitle('');
    setBugDetails('');
    setBugTitleError('');
    setImage(null);
    setType('');
    setTypeError('');
    onClose();
  }
  const handleOnDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (userName, user_id) => {
    setBugDeveloper(user_id)
    setAnchorEl(null);
  };
  const handleBugTitle = () => {
    if (!bugTitle) {
      setBugTitleError('Bug Title is required');
    }
  }

  const handleBugType = () => {
    if (!type) {
      setTypeError('Bug Type is required');
    }
  };

  const handleTitleChange =(e) => {
    setBugTitle(e.target.value)
    setBugTitleError('')
  }

  const handleTypeChange =(e) => {
    setType(e.target.value)
    setTypeError('')
  }
  

  const { getRootProps, getInputProps } = useDropzone({});

  const handleRemoveImage = () => {
    setImage(null)
  }

  const handleAddBug = () => {
    setBugTitleError('');
    setTypeError('');

    if (!bugTitle) {
      setBugTitleError('Bug Title is required');
    }
    if (!type) {
      setTypeError('Bug Type is required');
    }

    if (bugTitle && type) {
      const bugData = new FormData();
      bugData.append('bug_title', bugTitle);
      bugData.append('bug_type', type);
      bugData.append('bug_description', bugDetails);
      bugData.append('bug_status', 'new');
      bugData.append('bug_deadline', selectedDate);
      bugData.append('project_id', project.project_id);
      bugData.append('creator_user_id', user.user_id);
      bugData.append('developer_user_id', bugDeveloper ? bugDeveloper : 1);
      bugData.append('bug_screenshot', image);
      const api_endpoint = `${config.baseUrl}/bugs`
      fetch(api_endpoint, {
        method: 'POST',
        body: bugData,
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.success === false) {
            setBugTitleError(data.message);
          } else {
          console.log("bug new data", data)
          onBugUpdate(data.bug)
          handleClose();
          onClose();
          showSnackbar();

        }
        })
        .catch((error) => {
          console.error('Error creating a BUG:', error);
        });
    }
  };

  
  useEffect(() => {

    fetchDevelopers()
      .then((developers) => {
          if (developers.length === 0){
            setDevelopers([]);
            console.log("no developers found")
          } else {
            setDevelopers(developers);
          }
      })
      .catch((error) => {
        console.log("API request Failed")
      });
  }, []);

  const showSnackbar = () => {
    setSnackbarOpen(true);
  };

  const body = (
      <div className={classes.paper}>
      <Grid container style={{ borderRadius:"12px"}}>
        <Grid item md={12} container alignItems="center"justifyContent="flex-end" style={{ height: "70px", backgroundColor: "#F5F6F8", borderRadius: "12px 12px 0 0", paddingRight: "20px"}}>
            <CancelIcon fontSize='large' onClick={handleClose}/>
        </Grid>
        <Grid item md={6}>
          <Typography variant='h5' component="h1" style={{ marginLeft: "30px", marginTop: "28px", marginBottom: "28px"}}>
            Add new bug
          </Typography>
        </Grid>
        <Grid item md={6} container alignItems="center"justifyContent="flex-end" style={{ paddingRight: "30px"}}>
          <MoreHorizIcon fontSize='large'/>
        </Grid>
        <Grid item md={12}>
          <Divider/>
        </Grid>
        <Grid item md={12} style={{ display: "flex", paddingLeft: "30px", marginTop: "25px", gap:"20px", marginBottom: "50px" }}>
          <div style={{ display: "flex", alignItems: "center"  }}>
            <Typography style={{ fontWeight: "400", marginRight: "30px"}}>
              Assign to
            </Typography>
            <Avatar 
                alt="Trevor Henderson" 
                src="/images/avatar.png"
                onClick={(e) => setAnchorEl(e.currentTarget)} />
            <Typography style={{ fontWeight: "400", marginLeft: "50px"}}>
              Add Due Date
            </Typography>
            <form className={classes.container} noValidate>
              <TextField
                id="date"
                type="date"
                value={selectedDate}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleDateChange}
              />
            </form>
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            style={{ width: "30ch"}}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              style: {
                width: '40ch',
                maxHeight: 48 * 4.5,
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.15)",
                borderRadius: '0px 3px 3px 3px',
                background: '#FFF',
              },
            }}
          >
          {developers &&developers.length > 0 ? (
            developers.map((developer) => (
              <MenuItem key={developer.user_id} onClick={() => handleMenuClick(developer.name, developer.user_id)}>
                {developer.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              No developers found
            </MenuItem>
          )}
          </Menu>
        </Grid>
        <Grid item md={12}>
          <InputBase
            style={{ paddingLeft: '30px', fontSize: '30px', marginBottom: '15px' }}
            className={classes.margin}
            placeholder="Add Title Here"
            inputProps={{ 'aria-label': 'naked' }}
            value={bugTitle}
            onBlur={handleBugTitle}
            onChange={handleTitleChange}
            error={Boolean(bugTitleError)}
          />
          {bugTitleError && (
            <div style={{ color: 'red', paddingLeft: '30px' }}>{bugTitleError}</div>
          )}

        </Grid>

        <Grid item md={12}>
          <Typography style={{ fontWeight: "400", marginLeft: "30px"}}>
            Bug details:
           </Typography>
        </Grid>
        <Grid item md={12} style={{ paddingLeft: "30px", paddingRight:"30px", marginTop: "15px",marginBottom: "30px"}}>
          <TextField 
            id="outlined-basic" 
            label="" 
            variant="outlined"
            fullWidth placeholder='Add here' 
            value={bugDetails}
            onChange={(e) => setBugDetails(e.target.value)} />
        </Grid>
        <Grid item md={12}>
          <Typography style={{ fontWeight: "400", marginLeft: "30px" }}>
            Bug Type:
          </Typography>
        </Grid>
        <Grid item md={12} style={{ display: "flex", paddingLeft: "30px", paddingRight: "30px", marginTop: "10px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <RadioGroup
            row
            aria-label="bugType"
            name="bugType"
            value={type}
            onBlur={handleBugType}
            onChange={handleTypeChange}
          >
            <FormControlLabel
              value="feature"
              control={<Radio />}
              label={<span style={{ fontWeight: '400' }}>Feature</span>}
            />
            <FormControlLabel
              value="bug"
              control={<Radio />}
              label={<span style={{ fontWeight: '400' }}>Bug</span>}
            />
          </RadioGroup>
          </div>
        </Grid>
          {typeError && (
            <div style={{ color: 'red', paddingLeft: '30px', display: "inline-block" }}>{typeError}</div>
          )}

          <Grid item md={12}>
            {image ? (
              <div className={classes.dropImage}>
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
                <img src={URL.createObjectURL(image)} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', }} />
              </div>
            ) : (
              <ImageDropzone onDrop={handleOnDrop} />
            )}
          </Grid>
        <Grid item md={3} style={{ paddingLeft: '30px' }}>
          <Button variant="contained" className={classes.button} style={{ backgroundColor: '#007DFA', color: '#FFF' }} onClick={handleAddBug}>
            Add
          </Button>
        </Grid>
        <Grid item md={3} style={{ paddingLeft: '60px' }}>
          <Button variant="outlined" className={classes.button} onClick={handleClose}>
            Cancel
          </Button>
        </Grid>


        <Grid container className={classes.bottomContainer} >
        <Grid item md={12} container alignItems="center" justifyContent="center" style={{ height: "86px", borderRadius: "0 0 12px 12px", paddingRight: "20px"}}>
          <div {...getRootProps()} style={{ display: "flex"}}>
          <input {...getInputProps()} />
            <img src="/images/upload.png" alt="" style={{ height: "28px", width: "28px", marginRight: "10px"}}/>
            <Typography style={{ fontSize: "16px", color: "rgba(76, 83, 95, 0.40)"}}>
              Drop any file here or <span style={{ color: "#007DFA"}}>browse</span>
            </Typography>
          </div>
        </Grid>
        </Grid>
      </Grid>
      </div>
     
  );

  return (
    <div>
     
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: "12px" }}
      >
        {body}
      </Modal>
      <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message="Bug Added Succesfully"
        >
      </Snackbar>
    </div>
  );
}
