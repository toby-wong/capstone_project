import { createTheme } from "@mui/material";

const colors = {
  green: "#3da886",
  dark: "#353837",
  light: "#f7f7f7",
  purple: "#7e78d2",
  red: "#ef6461",
  background: "#ffffff",
  yellow: "#FFD233",
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.green,
      contrastText: colors.light,
    },
    secondary: {
      main: colors.purple,
      contrastText: colors.light,
    },
    container: {
      main: colors.light,
    },
    yellow: {
      main: colors.yellow,
    },
    warning: {
      main: colors.red,
      contrastText: colors.light,
    },
    text: {
      primary: colors.green,
      secondary: colors.dark,
      warning: colors.red,
      disabled: colors.light,
    },
  },
  typography: {
    fontFamily: "Montserrat",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    brandName: {
      fontFamily: "Bungee",
      fontSize: "2rem",
      lineHeight: 1,
      marginLeft: 7,
    },
    modalTitle: {
      fontFamily: "Montserrat",
      fontSize: "30px",
    },
    modalSubtitle: {
      fontFamily: "Montserrat",
      marginLeft: "15px",
    },
    modalContent: {
      fontFamily: "Montserrat",
      fontSize: "16px",
      color: colors.dark,
    },
    sectionTitle: {
      fontFamily: "Montserrat",
      fontSize: "30px",
      fontWeight: "bold",
      color: colors.dark,
    },
    sectionSubTitle: {
      fontFamily: "Montserrat",
      fontSize: "20px",
      color: colors.dark,
    },
    sectionContent: {
      fontFamily: "Montserrat",
      fontSize: "16px",
      color: colors.dark,
    },
    sectionSubContent: {
      fontFamily: "Montserrat",
      fontSize: "14px",
      color: colors.dark,
    },
    carSpaceModalSubTitle: {
      fontFamily: "Montserrat",
      fontSize: "20px",
      fontWeight: "bold",
      color: colors.dark,
      marginBottom: "5px",
    },
    carSpaceModalContent: {
      fontFamily: "Montserrat",
      fontSize: "18px",
      color: colors.dark,
    },
    carSpaceModalSubContent: {
      fontFamily: "Montserrat",
      fontSize: "14px",
      color: colors.dark,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          color: colors.light,
          borderRadius: 20,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.light,
          borderRadius: 15,
          padding: "30px 40px",
          display: "flex",
          fontFamily: "Montserrat",
        },
      },
      variants: [
        {
          props: { variant: "sectionBody" },
          style: {
            backgroundColor: colors.background,
            height: "100%",
            width: "100%",
          },
        },
        {
          props: { variant: "sectionContent" },
          style: {
            display: "flex",
            flexDirection: "column",
            position: "relative",
            height: "100%",
            width: "100%",
            padding: 0,
            backgroundColor: colors.background,
          },
        },
        {
          props: { variant: "sectionContentBody" },
          style: {
            flex: 1,
            marginTop: "20px",
            padding: 0,
          },
        },
      ],
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          border: "none",
          borderRadius: 25,
          backgroundColor: colors.background,
          boxShadow: "10px #ef6461",
          color: colors.dark,
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          display: "block",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: "10px",
          paddingLeft: "15px",
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: colors.light,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: 15,
        },
      },
      variants: [
        {
          props: { variant: "sideMenu" },
          style: {
            display: "flex",
            flexDirection: "column",
            padding: "10px 5px 10px",
            backgroundColor: colors.light,
          },
        },
      ],
    },
    MuiTab: {
      variants: [
        {
          props: { variant: "sideMenu" },
          style: {
            justifyContent: "flex-start",
            textTransform: "none",
            minHeight: "50px",
            padding: "0 10px",
          },
        },
      ],
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: colors.dark,
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          color: colors.dark,
        },
      },
    },
    MuiIcon: {
      variants: [
        {
          props: { variant: "menu" },
          style: {
            color: colors.light,
            backgroundColor: colors.green,
            borderRadius: "50%",
            padding: "4px",
            fontSize: "30px",
          },
        },
      ],
    },
  },
});
