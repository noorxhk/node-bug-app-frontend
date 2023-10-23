import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import IconButton from '@material-ui/core/IconButton';
import { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import TableBody from '@material-ui/core/TableBody';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Checkbox from '@material-ui/core/Checkbox'; 
import BugEdit from './bugEdit';
import config from '../../config';

const ITEM_HEIGHT = 48;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  blueDiv: {
    width: '10px',
    height: '10px',
    borderRadius: '6px',
    marginLeft: "10px ",
    marginRight: "10px "

  },
  flexContainer: {
    display: 'flex',
    color: 'rgba(58, 53, 65, 0.68)',
    alignItems: 'center',
  },
  customRow: {
    height: '50px', 
  },
  badge: {
    fontSize: "13px",
    padding: "4px 10px",
    display: "inline-block",
    verticalAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius:"4.25px",
  },
});
export default function BugTable({ bugs, onBugUpdate }) {
  const classes = useStyles();
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
  const [selectedBugData, setSelectedBugData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openModals, setOpenModals] = useState(bugs.map(() => false));
  const [menuAnchors, setMenuAnchors] = useState(bugs.map(() => null));
  useEffect(() => {
    setMenuAnchors(bugs.map(() => null));
  }, [bugs]);

  const handleMenuClick = (event, bugIndex) => {
    setMenuAnchors((prevAnchors) => {
      const newAnchors = [...prevAnchors];
      newAnchors[bugIndex] = event.currentTarget;
      return newAnchors;
    });
  };
  
  const handleMenuClose = (bugIndex) => {
    setMenuAnchors((prevAnchors) => {
      const newAnchors = [...prevAnchors];
      newAnchors[bugIndex] = null;
      return newAnchors;
    });
  };
  
  const showSnackbar = () => {
    setSnackbarOpen(true);
  };
  
  const handleStatusUpdate= (new_status, bug_id, bugIndex) => {
    handleMenuClose(bugIndex);
    const api_endpoint = `${config.baseUrl}/bugs/${bug_id}`
    fetch(api_endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bug_status: new_status }),
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
        setSnackbarMessage("Bug Status Updated Succesfully")
        showSnackbar();
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });
  }

  const handleBugDelete= ( bug_id, project_id, bug_screenshot, bugIndex) => {
    handleMenuClose(bugIndex);
    setMenuAnchors((prevAnchors) => {
      const newAnchors = [...prevAnchors];
      newAnchors.splice(bugIndex, 1); 
      return newAnchors;
    });
    handleMenuClose(bugIndex);

    const api_endpoint = `${config.baseUrl}/bugs/${bug_id}`

    fetch(api_endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        project_id: project_id,
        bug_screenshot: bug_screenshot
       }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        onBugUpdate(data.bugs)
        setSnackbarMessage("Bug Deleted Succesfully")
        showSnackbar();
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });

  }
  

  const handleRowClick = (bugData, bugIndex) => {
    setSelectedBugData(bugData);
    openModals[bugIndex] = true;
    setOpenModals([...openModals]);
  };

  const handleCloseModal = (bugIndex) => {
    openModals[bugIndex] = false;
    setOpenModals([...openModals]);
  };

  return (
    <div>
      <TableContainer component={Paper} style={{ marginTop:"30px", marginBottom: "100px"}}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead style={{ backgroundColor: "#F9FAFC", color: "rgba(58, 53, 65, 0.87)"}}>
            <TableRow style={{ color: "rgba(58, 53, 65, 0.87)"}}>
              <TableCell style={{ maxWidth: "3px", paddingRight:"5px"}}></TableCell> 
              <TableCell style={{color:"rgba(58, 53, 65, 0.87)", width: '500px'}}>BUG DETAILS</TableCell>
              <TableCell align="center" style={{color:"rgba(58, 53, 65, 0.87)"}}>BUG STATUS</TableCell>
              <TableCell align="center" style={{color:"rgba(58, 53, 65, 0.87)"}}>DUE DATE</TableCell>
              <TableCell align="center" style={{color:"rgba(58, 53, 65, 0.87)"}}>ASSIGNED TO</TableCell>
              <TableCell align="center" style={{color:"rgba(58, 53, 65, 0.87)"}}>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bugs && bugs.map((bug, bugIndex) => (
                <TableRow key={bug.bug_id} className={classes.customRow} onClick={() => handleRowClick(bug, bugIndex)}>
                  <TableCell style={{ maxWidth: "3px", paddingRight: "5px"}}>
                    <Checkbox />
                  </TableCell>
                  <TableCell component="th" scope="row" style={{width: '500px'}} color='secondary'>
                    <div className={classes.flexContainer}>
                      <div className={classes.blueDiv} style={{ backgroundColor: getStatusColor(bug.bug_status), color: getStatusColor(bug.bug_status) }}></div>
                      {bug.bug_description}
                    </div>
                  </TableCell>
                  <TableCell align="center">
                      <div>
                        <Typography className={classes.badge} style={{ backgroundColor: getStatusBackgroundColor(bug.bug_status), color: getStatusColor(bug.bug_status) }}>
                          {bug.bug_status}
                        </Typography>
                      </div>
                  </TableCell>
                  <TableCell  align="center" style={{ color: "rgba(58, 53, 65, 0.68)"}}>
                      {bug.bug_deadline ? (
                        bug.bug_deadline
                      ) : (
                        <img src="/images/calendar.png" alt="" />
                      )}
                    </TableCell>
                  <TableCell align="center" style={{ textAlign: "center"}}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Avatar alt="Trevor Henderson" src="/images/avatar.png" />
                    </div>
                  </TableCell>

                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>

                    <IconButton
                      aria-label="more"
                      aria-controls={`menu-${bug.bug_id}`}
                      aria-haspopup="true"
                      onClick={(e) => handleMenuClick(e, bugIndex)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                    style={{ border: "none"}}
                      id={`menu-${bug.bug_id}`}
                      anchorEl={menuAnchors[bugIndex]}
                      keepMounted
                      open={Boolean(menuAnchors[bugIndex])}
                      onClose={() => handleMenuClose(bugIndex)}
                      PaperProps={{
                        style: {
                          maxHeight: ITEM_HEIGHT * 10,
                          width: '30ch',
                          boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.15)",
                          background: '#FFF',
                        },
                      }}
                    >
                        <MenuItem onClick={handleMenuClose} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>
                              Change Status
                            </Typography>
                            <SettingsIcon/>
                        </MenuItem>
                        <MenuItem  onClick={() => handleStatusUpdate('new', bug.bug_id, bugIndex)}>
                          <Typography className={classes.badge} style={{ backgroundColor: getStatusBackgroundColor('new'), color: getStatusColor('new') }}>
                            New
                          </Typography>
                        </MenuItem>
                        <MenuItem  onClick={() => handleStatusUpdate('started', bug.bug_id, bugIndex)}>
                          <Typography className={classes.badge} style={{ backgroundColor: getStatusBackgroundColor('started'), color: getStatusColor('started') }}>
                            Started
                          </Typography>
                        </MenuItem>
                        <MenuItem  onClick={() => handleStatusUpdate(bug.bug_type === 'bug' ? 'resolved' : 'completed', bug.bug_id, bugIndex)}>
                          <Typography className={classes.badge} style={{ backgroundColor: getStatusBackgroundColor(bug.bug_type === "bug" ? "resolved" : "completed"), color: getStatusColor(bug.bug_type === "bug" ? "resolved" : "completed") }}>
                            {(bug.bug_type === "bug") ? "Resolved" : "Completed"}
                          </Typography>
                        </MenuItem>
                        <MenuItem  onClick={handleMenuClose}>
                          <div style={{ width: "100%", height: "1px", backgroundColor: "#50A885" }}></div>
                        </MenuItem>
                        <MenuItem onClick={() => handleBugDelete(bug.bug_id, bug.project_id, bug.bug_screenshot)} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography style={{ color: "#EB4C42" }}>
                              Delete
                            </Typography>
                            <DeleteOutlinedIcon  style={{ color:"#EB4C42"}}/>
                        </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
            ))}
            {bugs &&
              bugs.map((bug, bugIndex) => (
                <BugEdit
                  key={bug.bug_id}
                  open={openModals[bugIndex]}
                  onClose={() => handleCloseModal(bugIndex)}
                  bugData={selectedBugData}
                  onBugUpdate = {onBugUpdate}

                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        >
      </Snackbar>
    </div>
  );
}
