import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    button: {
      fontWeight: 700, // Делаем все кнопки жирными
    },
  },
  palette: {
    primary: {
      main: "#E12726", // Custom primary color (Deep Orange)
    },
    secondary: {
      main: "#03a9f4", // Custom secondary color (Light Blue)
    },
  },
  components: {
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
  },
});

export default theme;
