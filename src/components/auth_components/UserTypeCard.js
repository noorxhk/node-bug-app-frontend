import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import BusinessCenterOutlinedIcon from '@material-ui/icons/BusinessCenterOutlined';
import { useNavigate } from 'react-router-dom';


const UserTypeCard = ({ user }) => {
  const navigate = useNavigate();
  
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  let userIcon;

  switch (user.userType) {
    case 'Manager':
      userIcon = <AccountCircleRoundedIcon style={{ height: '44px', width: '44px', color: '#007DFA' }} />;
      break;
    case 'Developer':
      userIcon = <BusinessCenterOutlinedIcon style={{ height: '44px', width: '44px', color: '#007DFA' }} />;
      break;
    case 'QA':
      userIcon = <AccountCircleOutlinedIcon style={{ height: '44px', width: '44px', color: '#007DFA' }} />;
      break;
    default:
      userIcon = null;
      break;
  }
  const handleCardClick = () => {
    navigate(`/sign-up/${user.userType.toLowerCase()}`)
  };
  return (
      <Card 
        style={{ paddingBottom: '0px', 
                  maxWidth: '430px',
                  marginTop: '35px', 
                  cursor: 'pointer',  
                  borderRadius: '6px',
                  backgroundColor: isHovered ? '#f0f0f0' : 'transparent',
                  border: isHovered ? '1px solid #007DFA' : '1px solid transparent'
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleCardClick}
        >

        <CardContent style={{paddingBottom: '16px'}}>
          <Grid container alignItems="center">
            <Grid item  md={2}> 
              {userIcon}
            </Grid>

            <Grid item md={8} style={{marginLeft: '10px'}}>
              <Typography color='primary'>
                {user.userType}
              </Typography>
              <Typography  gutterBottom
                style={{fontSize: '14px', textAlign: 'left'}}
                color="secondary">
                {user.description}
              </Typography>
            </Grid>

            <Grid item  md={1}> 
            {isHovered && (
                <ArrowForwardRoundedIcon
                  color={'primary'}
                  style={{ marginLeft: "25px", color: '#007DFA' }}
                />
              )}
            </Grid>

          </Grid>
        </CardContent>
      </Card>
   );
}
 
export default UserTypeCard
;