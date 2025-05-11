import { Box, Button, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export interface MessageProps {
    username: string;
    message?: {
        filename: string;
        data: string;
    };
    error?: boolean;
    timestamp: string;
}

export default function Message({
    username,
    message,
    error,
    timestamp,
}: MessageProps) {
    const handleDownloadFile = () => {
        if (!message) return;

        const blob = new Blob([message.data], { type: 'text/plain' });

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = message.filename;

        // Append the anchor to the document
        document.body.appendChild(a);

        // Trigger a click on the anchor
        a.click();
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
                        {message?.filename}
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
