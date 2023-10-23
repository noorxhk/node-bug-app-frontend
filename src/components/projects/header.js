import { Container, Divider, Typography } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import NewProject from "../projects/newProject";

const useStyles = makeStyles((theme) => ({
  textField: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '100%'
  },
  button: {
    marginLeft: '20px',
    textTransform: "none",
    marginTop: '22px',
    height:"45px",
    backgroundColor: "#007DFA",
    color: "#FFFF",
    "&:hover": {
      backgroundColor: "#4169E1", 
    },
    "&:disabled": {
      backgroundColor: "#CCC",
      color: "#666",
      pointerEvents: "none",
    },
  },
  searchField: {
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    marginTop: '25px' 
  },
  logo: {
    height: '45px',
    width: '50px',
    backgroundColor: "#007DFA",
    borderRadius: "5px",
    marginTop: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"

  }
}));



const Header = ({user, onProjectUpdate}) => {
  const classes = useStyles();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const openNewProjectModal = () => {
    setIsNewProjectModalOpen(true);
  };

  const closeNewProjectModal = () => {
    setIsNewProjectModalOpen(false);
  };

  return ( 
    <Container style={{maxWidth: "100%"}}>
      <Grid container style={{ marginTop: "20px"}}>
        <Grid item md={1} >
          <div style={{ width: "4px", height: "82px", backgroundColor: "#50A885" }}></div>
          </Grid>
            <Grid item md={3} style={{ marginLeft: '-90px', marginTop: "15px" }}>
            <Typography variant="h6" component="h2">
              Projects
            </Typography>
            <Typography color="secondary" style={{marginBottom: "10px", marginRight: "20px"}}>
              Hi {user &&user.name.slice(0, 6)}, welcome to ManageBug
            </Typography>
          </Grid>
          <Grid item md={3}>
            <div className={classes.searchField}>
              <SearchIcon style={{ margin: '0 8px' }} color="secondary" />
              <TextField
                placeholder="Search for Projects here"
                InputProps={{ disableUnderline: true }}
                fullWidth
              />
            </div>
          </Grid>
          <Grid item md={2} >
            
              <Button  size="large"  
                  className={classes.button} 
                  onClick={openNewProjectModal}
                >
                + Add New Project
              </Button>
              
          </Grid>
          <Grid item md={1}>
           <div className={classes.textField}>
              <Typography> Sort By</Typography>
              <KeyboardArrowDownIcon/>
           </div>
          </Grid>
          <Grid item md={1} style={{marginLeft: "60px"}}>
           <div className={classes.textField}>
              <Typography> My Project</Typography>
              <KeyboardArrowDownIcon/>
           </div>
          </Grid>
          <Grid item md={1} style={{marginLeft: "30px"}}>
            <div className={classes.logo}>
              <img src="/images/Group.png" alt="" />
            </div>
          </Grid>
      </Grid>
      <Divider />

      <NewProject open={isNewProjectModalOpen} onClose={closeNewProjectModal} user={user} onProjectUpdate={onProjectUpdate}/>
    </Container>
   );
}
 
export default Header;