import React, { useState, useEffect } from 'react';
import Container from "@material-ui/core/Container";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import LeftPane from '../../components/auth_components/LeftPane';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: '30px',
    marginLeft: '2px'
  },
  customButtonLabelStyle: {
    width: '100%',
    display: 'inherit',
    alignItems: 'inherit',
    justifyContent: 'space-around',
  }
}));

const Login = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  

  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [unauthorized, setUnauthorized] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const location = useLocation();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setUnauthorized("")
    setErrorMessage('')
  };

  useEffect(() => {
    if (location.state && location.state.error) {
      setUnauthorized(location.state.error);
    }
  }, [location.state]);

 
  const validateEmail = () => {
    const newErrors = {};
    if (formData.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!isValidEmailFormat(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
  
    setEmailError(newErrors.email); 
  };
  
  const isValidEmailFormat = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  
  const validatePassword = () => {
    const newErrors = {};
  
    if (formData.password.trim() === '') {
      newErrors.password = 'Password is required';
    }
  
    setPasswordError(newErrors.password); // Update passwordError state
  };
 

  const handleLogin = () => {
    const newErrors = {};

    if (formData.email.trim() === '') {
    newErrors.email = 'Email is required';
  } else if (!isValidEmailFormat(formData.email)) {
    newErrors.email = 'Invalid email format';
  }

    if (formData.password.trim() === '') {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const api_endpoint = `${config.baseUrl}/auth/login`
      
      fetch(api_endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          if (data.success === false) {
            setErrorMessage(data.message);
          } else {
            navigate('/projects', { state: { user: data.data[0] } });
          }
        })
        .catch(error => {
          console.log("error", error);
          setErrorMessage('Someting Went Wrong. Please try again later.');
        });
  }};

  return (
    <Container style={{ margin: '0px', padding: '0px', maxWidth: '100%', fontFamily: 'Poppins, sans-serif' }}>
      <Grid container>
        <LeftPane />
        <Grid item md={6} style={{ width: '100%' }}>
          <Grid item style={{ maxWidth: "443px", marginTop: "300px" }}>
            <Typography variant="h5" component="h1" color="primary" style={{ marginBottom: "30px", fontWeight: "700" }}>
              Login
            </Typography>
            <Typography variant="body1" color="secondary" style={{ marginTop: "30px", minWidth: '443px' }}>
              Please enter your login details
            </Typography>
            <FormControl style={{ marginTop: '30px' }} variant="outlined" fullWidth>
              <TextField
                  id="outlined-adornment-email"
                  variant='outlined'
                  name="email"
                  type="email"
                  label="E-mail"
                  placeholder="E-mail"
                  value={formData.email}
                  onBlur={validateEmail}
                  onChange={handleInputChange}
                  error={!!emailError}
                  helperText={emailError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton edge="start">
                          <EmailIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
            </FormControl>
            <FormControl style={{ marginTop: '30px' }} variant="outlined" fullWidth>
              <TextField
                id="outlined-adornment-password"
                name="password"
                variant="outlined"
                type="password"
                label="Password"
                placeholder="Password"
                value={formData.password}
                onBlur={validatePassword}
                onChange={handleInputChange}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton aria-label="toggle password visibility" edge="start">
                        <LockIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            {errorMessage && (
              <Typography color="error" style={{ marginTop: '10px' }}>
                {errorMessage}
              </Typography>
            )}
            {unauthorized && (
              <Typography color="error" style={{ marginTop: '10px' }}>
                {unauthorized}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              endIcon={<ChevronRightIcon />}
              style={{ height: "48px", textAlign: "left", width: "139px", backgroundColor: '#007DFA', gap: "37px" }}
              onClick={handleLogin}
            >
              <Typography className={classes.customButtonLabelStyle}>Login</Typography>
            </Button>
            <div style={{ display: 'flex', marginTop: '60px', justifyContent: "space-between" }}>
              <Typography color='secondary' style={{ fontSize: '14px' }}>Don't have an account?</Typography>
              <span href="#" style={{ textDecoration: 'none' }}>
                <Typography onClick={() => navigate('/')} style={{ fontSize: '14px', color: "#007DFA", cursor: 'pointer' }}>Create Your account</Typography>
              </span>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Login;
