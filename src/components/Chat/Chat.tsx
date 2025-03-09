import TextField from "@mui/material/TextField/TextField";
import "./Chat.scss";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function Chat() {
  return (
    <div className="chat">
      <div className="controls">
        <TextField
          className="controls__text-field"
          id="outlined-basic"
          label="Сообщение"
          variant="outlined"
        />
        <Button
          className="controls__button"
          variant="contained"
          startIcon=<UploadFileIcon />
        >
          Прикрепить
        </Button>
        <Button
          className="controls__button"
          variant="contained"
          endIcon=<SendIcon />
        >
          отправить
        </Button>
      </div>
    </div>
  );
}
