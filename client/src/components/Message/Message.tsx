import { Box, Button, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { dataUrlToFile, downloadFile } from '../../Utils';
import { MessagePayload } from '../../Types';

export default function Message(payload: MessagePayload) {
    const handleDownloadFile = async () => {
        downloadFile(
            await dataUrlToFile(
                payload.message!.data,
                payload.message!.filename
            )
        );
    };

    return (
        <Box className="chat" display="flex" gap="10px" position="relative">
            <Avatar></Avatar>
            <Box display="flex" flexDirection="column" gap="3px">
                <Typography> {payload.username}</Typography>
                {payload.error_flag ? (
                    <ErrorOutlineIcon />
                ) : (
                    <Button
                        variant="outlined"
                        startIcon={<SaveAltIcon />}
                        onClick={handleDownloadFile}
                    >
                        {payload.message?.filename}
                    </Button>
                )}
            </Box>
            <Typography
                position="absolute"
                right="0px"
                fontSize="12px"
                color="secondary.main"
            >
                {payload.timestamp}
            </Typography>
        </Box>
    );
}
