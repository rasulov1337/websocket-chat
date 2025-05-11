import { Box, Button, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { dataUrlToFile, downloadFile } from '../../Utils';

export interface MessageProps {
    username: string;
    dataUrl: string;
    filename: string;
    error?: boolean;
    timestamp: string;
}

export default function Message({
    username,
    dataUrl,
    filename,
    error,
    timestamp,
}: MessageProps) {
    const handleDownloadFile = async () => {
        downloadFile(await dataUrlToFile(dataUrl, filename));
    };

    return (
        <Box className="chat" display="flex" gap="10px" position="relative">
            <Avatar></Avatar>
            <Box display="flex" flexDirection="column" gap="3px">
                <Typography> {username}</Typography>
                {error ? (
                    <ErrorOutlineIcon />
                ) : (
                    <Button
                        variant="outlined"
                        startIcon={<SaveAltIcon />}
                        onClick={handleDownloadFile}
                    >
                        {filename}
                    </Button>
                )}
            </Box>
            <Typography
                position="absolute"
                right="0px"
                fontSize="12px"
                color="secondary.main"
            >
                {timestamp}
            </Typography>
        </Box>
    );
}
