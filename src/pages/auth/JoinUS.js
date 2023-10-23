import React from 'react';
import Container  from "@material-ui/core/Container";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import UserTypeCard from "../../components/auth_components/UserTypeCard";
import LeftPane from '../../components/auth_components/LeftPane';
import { useNavigate } from 'react-router-dom';

const JoinUs = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      userType: 'Manager',
      description: 'Signup as a manager to manage tasks and bugs',
    },
    {
      userType: 'Developer',
      description: 'Signup as a Developer to assign the relevant task to QA',
    },
    {
      userType: 'QA',
      description: 'Signup as a QA to create the bugs and report in tasks'
    },
  ];
  return ( 
    <Container style={{margin: '0px', padding: '0px', maxWidth: '100%', fontFamily: 'Poppins, sans-serif'}}>
      <Grid container >
        <LeftPane/>
        <Grid item md={6} style={{width: '100%'}}>
          <Typography 
            color="secondary"
            style={{
              paddingRight: "44px",
              marginTop: "36px",
              textAlign: 'right'
            }}
          >
            Already have an account?{' '}
            <span  
              onClick={() => navigate('/login')}
              style={{ 
                color: '#007DFA', 
                cursor: 'pointer',
                textDecoration: 'none' 
              }}
              >

              Sign In

              </span>
          </Typography>
          <Grid item
            style={{
                maxWidth: "426px", 
                marginTop: "200px"
              }}
               
          >
            <Typography
              variant="h5"
              component= "h1"
              color="primary"
              style={{fontWeight: '700'}}
            >
                Join Us!
            </Typography>
            <Typography
              variant="body1"
              color="secondary"
            >
                To begin this journey, tell us what type of account you’d be opening.
            </Typography>
            {userTypes.map((user, index) => (
              <UserTypeCard user={user} key={index}/>
            ))}
          </Grid>
        </Grid>
       
      </Grid>
    </Container>
  );
}
 
export default JoinUs;