import { Container, Divider } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import config from "../../config";

const useStyles = makeStyles((theme) => ({
  profileButton: {
    display: 'flex', 
    cursor: "pointer",
    alignItems: 'center',
    gap: '10px',
    marginLeft: "10px",
    height: "70px",
    width: '168px',
    borderRadius: '8px',
    justifyContent: 'space-evenly',
    border: '1px solid #F5F5F7',
    background: '#F5F5F7'
  },
}));

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [snackbarOpen, setSnackbarOpen] = useState(false);


  const showSnackbar = () => {
    console.log("snack")
    setSnackbarOpen(true);
  };

  const handleSignOut = (user_id) => {
    const api_endpoint = `${config.baseUrl}/users/sign-out`;

    fetch(api_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id }),
    })
      .then((response) => {
        if (response.ok) {
          navigate('/login');
          showSnackbar(); 
        } else {
          throw new Error('Sign-out request was not successful');
        }
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  }

  const headerContent = [
    {
      image: '/images/tiles.png',
      title: 'Projects'
    },
    {
      image: '/images/Bag.png',
      title: 'Tasks'
    },
    {
      image: '/images/Solid.png',
      title: 'Tickets'
    },
    {
      image: '/images/persons.png',
      title: 'Users'
    },
  ] 
  return ( 
    <div>
      <Container style={{ maxWidth: "100%", paddingTop: "40px"}}>
        <Grid container alignItems="center" alignContent="center" style={{fontFamily: 'Poppins'}}>
          <Grid item md={3}>
            <img src="/images/nav_logo.png" alt="" />  
          </Grid>
            {headerContent.map((header, index) => (
              <Grid item md={1} key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginRight: "35px" }}>
                <img src={header.image} alt="" style={{ height: "22px", width: "22px" }} />
                <span>{header.title}</span>
              </Grid>
            ))}
          <Grid item md={1} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: "50px" }}>
            <img src="/images/Notification.png" alt="" style={{ height: "26px", width: "26px", marginRight: "18px" }} />
            <img src="/images/Message.png" alt="" style={{ height: "26px", width: "26px" }} />
          </Grid>
          <Grid item md={2} className={classes.profileButton} onClick={() => handleSignOut(user && user.user_id)}>
              <img src="/images/vis_logo.png" alt="" style={{ height: "44px", width: "44px" }} />
              <span> Logout</span>
              <KeyboardArrowDownIcon/>
          </Grid>
        </Grid>
        <Divider style={{ marginTop: "40px"}}/>
      </Container>
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
 
export default Navbar;