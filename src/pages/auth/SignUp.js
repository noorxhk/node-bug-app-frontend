import React, { useState } from 'react';
import Container from "@material-ui/core/Container";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import FormControl from '@material-ui/core/FormControl';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import LeftPane from '../../components/auth_components/LeftPane';
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

const SignUp = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState('');
  const [values, setValues] = useState({
    name: '',
    user_type: role.toLowerCase(),
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateEmail = () => {
    const newErrors = { ...errors };
    if (values.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!isValidEmailFormat(values.email)) {
      newErrors.email = 'Invalid email format';
    } else {
      newErrors.email = '';
    }
  
    setErrors(newErrors);
  };
  
  const isValidEmailFormat = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; 
    return emailRegex.test(email);
  };
  
  const validatePassword = () => {
    const newErrors = { ...errors };
  
    if (values.password.trim() === '') {
      newErrors.password = 'Password is required';
    } else {
      newErrors.password = '';
    }
  
    setErrors(newErrors);
  };
  
  const validateName = () => {
    const newErrors = { ...errors };
  
    if (values.name.trim() === '') {
      newErrors.name = 'Name is required';
    } else {
      newErrors.name = '';
    }
  
    setErrors(newErrors);
  };

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  const handleSignUp = () => {
    const requiredFields = ['name', 'user_type', 'email', 'password'];
    const newErrors = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!values[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is Required`;
        isValid = false;
      }
    });

    if (values.email && !isValidEmailFormat(values.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    const api_endpoint = `${config.baseUrl}/auth/sign-up`

    fetch(api_endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
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
  };

  return (
    <Container style={{ margin: '0px', padding: '0px', maxWidth: '100%', fontFamily: 'Poppins, sans-serif' }}>
      <Grid container>
          <LeftPane />

        <Grid item md={6} style={{ width: '100%' }}>
          <Grid item
            style={{
              maxWidth: "443px",
              marginTop: "250px"
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              color="primary"
              style={{ marginBottom: "30px", fontWeight: "700" }}
            >
              Sign Up
            </Typography>
            <Typography
              variant="body1"
              color="secondary"
              style={{ marginTop: "30px", minWidth: '443px' }}
            >
              Please fill in your information below
            </Typography>

            <FormControl style={{ marginTop: '30px' }} variant="outlined" fullWidth>
              <TextField
                id="outlined-adornment-name"
                variant="outlined"
                name="name"
                type="text"
                label="Name"
                placeholder="Name"
                value={values.name}
                onBlur={validateName}
                onChange={handleFieldChange}
                error={!!errors.name}
                helperText={errors.name} 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton edge="start">
                        <PersonIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl style={{ marginTop: '30px' }} variant="outlined" fullWidth>
              <TextField
                id="outlined-adornment-type"
                variant="outlined"
                name="user_type"
                type="text"
                label="User Type"
                placeholder="User Type"
                value={toTitleCase(values.user_type)}
                onChange={handleFieldChange}
                error={!!errors.user_type} 
                helperText={errors.user_type} 
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton edge="start">
                        <PeopleIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl style={{ marginTop: '30px' }} variant="outlined" fullWidth>
              <TextField
                id="outlined-adornment-email"
                variant="outlined"
                name="email"
                type="email"
                label="E-mail"
                placeholder="E-mail"
                value={values.email}
                onBlur={validateEmail}
                onChange={handleFieldChange}
                error={!!errors.email} 
                helperText={errors.email} 
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
                variant="outlined"
                name="password"
                type="password"
                label="Password"
                placeholder="Password"
                value={values.password}
                onBlur={validatePassword}
                onChange={handleFieldChange}
                error={!!errors.password} 
                helperText={errors.password} 
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

          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            endIcon={<ChevronRightIcon />}
            onClick={handleSignUp}
            style={{ height: "48px", textAlign: "left", width: "139px", backgroundColor: '#007DFA', gap: "37px" }}
          >
            <Typography className={classes.customButtonLabelStyle}>Sign Up</Typography>
          </Button>
          <div style={{ display: 'flex', marginTop: '60px', justifyContent: "space-between" }}>
            <Typography color='secondary' style={{ fontSize: '14px' }}>Already have an account?</Typography>
            <Typography onClick={() => navigate('/login')} style={{ fontSize: '14px', color: "#007DFA", cursor: 'pointer' }}>Login to your account</Typography>
          </div>
        </Grid>
      </Grid>
    </Grid>
  </Container>
);
}

export default SignUp;

