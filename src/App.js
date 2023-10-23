import { Routes,  Route } from 'react-router-dom'
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import JoinUs from './pages/auth/JoinUS';

// import './App.css';
import { createTheme, ThemeProvider } from '@material-ui/core//styles'
import Projects from './pages/project/projects';
import Bugs from './pages/bug/bugs';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2F3367'
    },
    secondary: {
      main: '#8692A6'
    }
  },
  typography: {
    fontFamily: 'Poppins',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
  }
})


function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
          <Route exact path="/" element={<JoinUs />}/>
            
          <Route  path="/sign-up/:role" element={<SignUp />}/>
            
          <Route path="/login" element={<Login />}/>
          <Route path="/projects" element={<Projects/>}/>
          <Route path="/bugs" element={<Bugs/>}/>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
