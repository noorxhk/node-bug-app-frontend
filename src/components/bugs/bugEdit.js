import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import { useState, useEffect } from 'react';
import { Button, Divider, Grid, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useDropzone } from 'react-dropzone';
import Snackbar from '@material-ui/core/Snackbar';
import ImageDropzone from './imageDropzone';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import config from '../../config'

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: "80%",
    height: 900,
    backgroundColor: '#fff',
    top: '50%',  
    left: '50%', 
    borderRadius: "12px",
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

export default function BugEdit({ open, onClose, bugData, onBugUpdate }) {
  const classes = useStyles();
  const [bugDetails, setBugDetails] = useState('');
  const [removeImage, setRemoveImage] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [image, setImage] = useState(); 
  const handleClose = () => {
    onClose(); 
    setImage(null)
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

  const handleUpdateBug = (oldBugData, bug_id) => {
    const bugData = new FormData();
      
      bugData.append('bug_description', bugDetails ? bugDetails : oldBugData.bug_description);
      bugData.append('bug_screenshot', image ?  image : oldBugData.bug_screenshot);
      bugData.append('developer_user_id', bugDeveloper ? bugDeveloper : oldBugData.developer_user_id)
      const api_endpoint = `${config.baseUrl}/bugs/${bug_id}`
      fetch(api_endpoint, {
        method: 'PUT',
        body: bugData,
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to create a BUG');
          }
          return response.json();
        })
        .then((data) => {
          onBugUpdate(data.bugs);
          onClose();
          showSnackbar();
        })
        .catch((error) => {
          console.error('Error creating a BUG:', error);
        });

  };

  const handleImageUpdate= ( bug_id) => {
    const api_endpoint = `${config.baseUrl}/bugs/${bug_id}`
    fetch(api_endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bug_screenshot: '' }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update status');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Status updated:', data.bugs);
        onBugUpdate(data.bugs);
        setImage('')
        setRemoveImage(false)
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });
  }

  
  const handleOnDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [developers, setDevelopers] = useState();
  const [bugDeveloper, setBugDeveloper] = useState();
  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'new':
        return 'rgba(238, 243, 2555, 1)'; 
      case 'resolved':
        return 'rgba(0, 184, 148, 0.08)'; 
      case 'completed':
        return 'rgba(0, 184, 148, 0.08)'; 
      case 'started':
        return 'rgba(253, 242, 242, 1)'; 
      default:
        return '';     }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'rgba(48, 105, 254, 1)'; 
      case 'resolved':
        return 'rgba(0, 184, 148, 1)'; 
      case 'completed':
        return 'rgba(0, 184, 148, 1)'; 
      case 'started':
        return 'rgba(236, 89, 98, 1)'; 
      default:
        return '';     }
  };



  const handleMenuClick = (userName, user_id) => {
    setBugDeveloper(user_id)
    setAnchorEl(null);
  };
  
  const { getRootProps, getInputProps } = useDropzone({});
  
  const showSnackbar = () => {
    setSnackbarOpen(true);
  };

  const body = (
      <div className={classes.paper}>
        {/* Left side of edit page */}
      <Grid container style={{ borderRadius:"12px"}}> 
        <Grid md={12} container alignItems="center"justifyContent="flex-end" style={{ height: "70px", backgroundColor: "#F5F6F8", borderRadius: "12px 12px 0 0", paddingRight: "20px"}}>
            <CancelIcon fontSize='large' onClick={handleClose}/>
        </Grid>
        <Grid item container md={6}>
          <Grid item md={6} style={{ display: "flex", paddingLeft: "30px", marginTop: "25px",  marginBottom: "20px" }}>
              <Button disabled style={{ textTransform: "none", backgroundColor: getStatusBackgroundColor(bugData && bugData.bug_status), color: getStatusColor(bugData && bugData.bug_status), marginRight: "30px" }}>
                { bugData &&  bugData.bug_status}
              </Button>
              <Avatar 
                  alt="Trevor Henderson" 
                  src="/images/avatar.png"
                  onClick={(e) => setAnchorEl(e.currentTarget)} />
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
          <Grid item md={6} container alignItems="center"justifyContent="flex-end" style={{ paddingRight: "30px"}}>
            <MoreHorizIcon fontSize='large'/>
          </Grid>
          <Grid item md={12}>
            <Divider/>
          </Grid>
          <Grid item md={8}>
          <Typography
            style={{ paddingLeft: "30px", fontSize: "25px", marginTop:"10px", marginBottom: "15px"}}
            className={classes.margin}
          >
            {bugData && bugData.bug_title}
          </Typography>

          </Grid>
          <Grid item md={12}>
            {image ? (
              <div style={{ display: 'flex' }}>
              <div className={classes.dropImage} style={{ position: 'relative' }}>
                <CancelIcon fontSize='small' onClick={() => handleImageUpdate(bugData.bug_id)}
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
                <img
                  src={URL.createObjectURL(image)}
                  alt="Uploaded"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
                />
              </div>
            </div>
            ) : (
              
              (removeImage && bugData && bugData.bug_screenshot) ? (
                <div style={{ display: 'flex' }}>
                  <div className={classes.dropImage} style={{ position: 'relative' }}>
                    <CancelIcon fontSize='small' onClick={() => handleImageUpdate(bugData.bug_id)}
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
                    <img src={bugData && `${config.baseUrl}/${bugData.bug_screenshot}`} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
                  </div>
                </div>
              ) : (
                <ImageDropzone onDrop={handleOnDrop} />
              )
            )}
          </Grid>
          <Grid item md={12}>
            <Typography style={{ fontWeight: "400", marginLeft: "30px", marginTop: "20px"}}>
              Bug details:
            </Typography>
          </Grid>
          <Grid item md={12} style={{ paddingLeft: "30px", paddingRight:"30px", marginTop: "15px", paddingBottom:"270px" }}>
            <TextField id="outlined-basic" 
              label="" variant="outlined"
              fullWidth
              placeholder='Add here' 
              value={bugDetails ? bugDetails : (bugData && bugData.bug_description) }
              onChange={(e) => setBugDetails(e.target.value)}
              style={{ marginBottom:"10px"}} />
              <Button variant="contained" className={classes.button} style={{ backgroundColor: '#007DFA', color: '#FFF' }} onClick={() => handleUpdateBug(bugData, bugData.bug_id)}>
                Update
              </Button>
              <Button variant="outlined" className={classes.button} onClick={handleClose}>
                Cancel
              </Button>
            </Grid>

          <Grid item md={3} style={{ paddingLeft: '30px' }}>
          
        </Grid>
          
          <Grid  className={classes.bottomContainer} md={12}>
            <Grid item md={12} container alignItems="center" justifyContent="center" style={{ height: "86px", borderRadius: "0 0 12px 12px", paddingRight: "20px"}}>
              <div {...getRootProps()} style={{ display: "flex"}}>
              <input {...getInputProps()} />
                <img src="/images/upload.png" alt="cloud" style={{ height: "28px", width: "28px", marginRight: "10px"}}/>
                <Typography style={{ fontSize: "16px", color: "rgba(76, 83, 95, 0.40)"}}>
                  Drop any file here or <span style={{ color: "#007DFA"}}>browse</span>
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Divider orientation="vertical" flexItem />
        {/* Right side of grid */}
        <Grid item container md = {5}>
          <Grid item md={4} style={{ paddingLeft: "30px", marginTop: "25px"}}>
            <Typography style={{ color: 'rgba(149, 146, 152, 0.30)'}}> Created :</Typography>
            <Typography style={{ color: "#8D98AA"}}> Aug 10, 2023 </Typography>
          </Grid>
          <Grid item md={7} style={{ paddingLeft: "30px", marginTop: "25px"}}>     
            <img src="/images/calendar.png" alt='date'/>
          </Grid>
           <Grid item md={12} >
            <div style={{ backgroundColor: "#F5F6F8", height: "658px", marginTop:"10px", paddingRight:"20px", marginRight:"-120px"}}>
              <div style={{ display: "flex", justifyContent:"space-between", padding:"40px"}}>
                <Typography style= {{color:"#A1A1AA", fontSize:"14px"}}>
                    This task was created by DeVisnext
                </Typography>
                <Typography style= {{color:"#A1A1AA", fontSize:"14px"}}>
                Aug 10, 6:16 pm
                </Typography>
              </div>
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
          message="Bug Updated Succesfully"
        >
      </Snackbar>
    </div>
  );
}
