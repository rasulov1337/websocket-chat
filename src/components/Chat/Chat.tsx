import { Box, Button, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Message from '../Message/Message';
import { useSelector } from 'react-redux';
import { RootState } from '../../Types';

export default function Chat() {
    const username = useSelector((state: RootState) => state.slice.username);

    const handleSend = () => {
        console.log(username);
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                border: '1px solid',
                borderColor: 'primary.main',
            }}
            className="chat"
        >
            <Box padding="20px 50px">
                <Typography sx={{ textAlign: 'center' }} color="secondary.main">
                    8 марта
                </Typography>
                <Box display="flex" flexDirection="column" gap="25px">
                    <Message
                        author="Vladislav Andrest"
                        filename="IMAGE.JPG"
                        time="09:00"
                    />
                    <Message
                        author="Vladislav Andrest"
                        filename="IMAGE.JPG"
                        error
                        time="09:01"
                    />
                </Box>
            </Box>
            <Box
                className="controls"
                sx={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'space-between',
                    padding: '0 30px',
                    width: '100%',
                    height: '54px',
                    position: 'fixed',
                    bottom: '20px',
                    fontWeight: '800',
                }}
            >
                <Button
                    className="controls__button"
                    variant="contained"
                    startIcon=<UploadFileIcon />
                    sx={{ flex: '1 1 auto' }}
                >
                    Прикрепить файл
                </Button>
                <Button
                    className="controls__button"
                    variant="contained"
                    endIcon=<SendIcon />
                    sx={{ flex: '0 1 auto' }}
                    onClick={handleSend}
                >
                    отправить
                </Button>
            </Box>
        </Box>
    );
}
