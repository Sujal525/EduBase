import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3e7eff',
    },
    secondary: {
      main: '#6c63ff',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: ['"Roboto"', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
  },
});

export default theme;
