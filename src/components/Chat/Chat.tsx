import { Box, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function Chat() {
    return (
        <Box
            sx={{
                width: "100%",
                height: "60vh",
                border: "1px solid",
                borderColor: "primary.main",
            }}
            className="chat"
        >
            <Box
                className="controls"
                sx={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "space-between",
                    padding: "0 30px",
                    width: "100%",
                    height: "54px",
                    position: "fixed",
                    bottom: "20px",
                    fontWeight: "800",
                }}
            >
                <Button
                    className="controls__button"
                    variant="contained"
                    startIcon=<UploadFileIcon />
                    sx={{ flex: "1 1 auto" }}
                >
                    Прикрепить файл
                </Button>
                <Button
                    className="controls__button"
                    variant="contained"
                    endIcon=<SendIcon />
                    sx={{ flex: "0 1 auto" }}
                >
                    отправить
                </Button>
            </Box>
        </Box>
    );
}
