import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        allVariants: {
            color: "#fff",
        },
        button: {
            fontWeight: 700, // Делаем все кнопки жирными
        },
        h2: {
            fontSize: "32px",
        },
    },
    palette: {
        primary: {
            main: "#E12726", // Custom primary color (Deep Orange)
            contrastText: "#fff",
        },
        secondary: {
            main: "#ffffff9c",
            contrastText: "#fff",
        },
        background: {
            default: "#000",
            paper: "#000",
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: (theme) => ({
                body: theme.palette.primary.main,
            }),
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    height: "45px",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiInputBase-input": {
                        color: "#fff", // Цвет текста
                    },
                    "& .MuiInputLabel-root": {
                        color: "#aaa", // Цвет label
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "#aaa", // Цвет label при вводе (фокус)
                    },
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#555" }, // Обычная рамка
                        "&:hover fieldset": { borderColor: "#fff" }, // Рамка при наведении
                        "&.Mui-focused fieldset": { borderColor: "#555" }, // Рамка при фокусе
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    "& .MuiAlert-filled": {},
                },
            },
        },
    },
});

export default theme;
