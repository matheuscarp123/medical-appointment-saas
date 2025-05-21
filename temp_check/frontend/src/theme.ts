import { createTheme, ThemeOptions, Components, Theme } from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography';

// Definição de cores
const colors = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#3f51b5', 
    light: '#757de8',
    dark: '#002984',
    contrastText: '#ffffff',
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
    contrastText: '#ffffff',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
    contrastText: '#ffffff',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
    contrastText: '#ffffff',
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  background: {
    default: '#f8fafc', 
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
};

// Definição de tipografia
const typography: TypographyOptions = {
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', 
  h1: {
    fontWeight: 700,
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.01562em',
  },
  h2: {
    fontWeight: 600,
    fontSize: '2rem',
    lineHeight: 1.3,
    letterSpacing: '-0.00833em',
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.75rem',
    lineHeight: 1.3,
    letterSpacing: '0em',
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4,
    letterSpacing: '0.00735em',
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.4,
    letterSpacing: '0em',
  },
  h6: {
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.4,
    letterSpacing: '0.0075em',
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.57,
    letterSpacing: '0.00714em',
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.75,
    textTransform: 'none' as const,
    letterSpacing: '0.02857em',
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 2.66,
    textTransform: 'uppercase',
    letterSpacing: '0.08333em',
  },
};

// Base transition settings for animation consistency
const baseTransition = {
  duration: '0.3s',
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

// Definição de componentes
const components: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    styleOverrides: {
      '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      },
      html: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        scrollBehavior: 'smooth',
      },
      body: {
        transition: `background-color ${baseTransition.duration} ${baseTransition.easing}`,
      },
      '::selection': {
        backgroundColor: colors.primary.main,
        color: colors.primary.contrastText,
      },
      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: 'rgba(0,0,0,0.03)',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'rgba(0,0,0,0.15)',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(0,0,0,0.25)',
      },
    },
  },
  MuiButtonBase: {
    defaultProps: {
      disableRipple: false, 
    },
    styleOverrides: {
      root: {
        transition: `all ${baseTransition.duration} ${baseTransition.easing}`,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        textTransform: 'none' as const,
        fontWeight: 600,
        padding: '10px 20px',
        transition: `all ${baseTransition.duration} ${baseTransition.easing}`,
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255,255,255,0.1)',
          opacity: 0,
          transition: `opacity ${baseTransition.duration} ${baseTransition.easing}`,
        },
        '&:hover::after': {
          opacity: 1,
        },
      },
      contained: {
        boxShadow: '0 3px 6px rgba(0,0,0,0.08), 0 3px 6px rgba(0,0,0,0.12)',
        '&:hover': {
          boxShadow: '0 5px 12px rgba(0,0,0,0.12), 0 5px 12px rgba(0,0,0,0.18)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transform: 'translateY(1px)',
        },
      },
      outlined: {
        borderWidth: 2,
        '&:hover': {
          borderWidth: 2,
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(1px)',
        },
      },
      text: {
        '&:hover': {
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(1px)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
        transition: `all ${baseTransition.duration} ${baseTransition.easing}`,
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        transition: `all ${baseTransition.duration} ${baseTransition.easing}`,
      },
      elevation1: {
        boxShadow: '0 3px 12px rgba(0,0,0,0.06)',
      },
      elevation2: {
        boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
      },
      elevation3: {
        boxShadow: '0 7px 18px rgba(0,0,0,0.1)',
      },
      elevation4: {
        boxShadow: '0 9px 22px rgba(0,0,0,0.12)',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 10,
          transition: `all ${baseTransition.duration} ${baseTransition.easing}`,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.main,
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            transition: `all ${baseTransition.duration} ${baseTransition.easing}`,
          },
        },
        '& label': {
          transition: `all ${baseTransition.duration} ${baseTransition.easing}`,
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: '14px 16px',
        borderBottom: `1px solid ${colors.grey[200]}`,
      },
      head: {
        fontWeight: 600,
        backgroundColor: colors.grey[50],
        color: colors.primary.dark,
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        transition: `background-color ${baseTransition.duration} ${baseTransition.easing}`,
        '&:hover': {
          backgroundColor: `rgba(25, 118, 210, 0.04)`,
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        transition: `all ${baseTransition.duration} ${baseTransition.easing}`,
        '&:hover': {
          backgroundColor: `rgba(25, 118, 210, 0.04)`,
          transform: 'translateX(2px)',
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        transition: `all ${baseTransition.duration} ${baseTransition.easing}`,
        '&:hover': {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transform: 'translateY(-1px)',
        },
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        transition: `all ${baseTransition.duration} ${baseTransition.easing}`,
        position: 'relative',
        '&:hover': {
          textDecoration: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -2,
          left: 0,
          width: 0,
          height: '2px',
          backgroundColor: 'currentColor',
          transition: `all ${baseTransition.duration} ${baseTransition.easing}`,
        },
        '&:hover::after': {
          width: '100%',
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: 3,
        borderRadius: '3px 3px 0 0',
        transition: `all ${baseTransition.duration} ${baseTransition.easing}`,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        transition: `all ${baseTransition.duration} ${baseTransition.easing}`,
        '&:hover': {
          backgroundColor: `rgba(25, 118, 210, 0.04)`,
        },
      },
    },
  },
  MuiCircularProgress: {
    styleOverrides: {
      root: {
        transition: `all ${baseTransition.duration} ${baseTransition.easing}`,
      },
    },
  },
  MuiBackdrop: {
    styleOverrides: {
      root: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(5px)',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      },
    },
  },
  MuiPopover: {
    styleOverrides: {
      paper: {
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        borderRadius: 10,
      },
    },
  },
};

// Criação do tema MUI
const theme = createTheme({
  palette: colors,
  typography,
  components,
  shape: {
    borderRadius: 10,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.06)',
    '0px 6px 12px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(0, 0, 0, 0.1)',
    '0px 10px 20px rgba(0, 0, 0, 0.12)',
    ...Array(19).fill('none'), 
  ],
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
} as ThemeOptions);

export default theme;