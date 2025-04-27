import { Box, Button, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export interface MessageProps {
    author: string;
    file: File;
    error?: boolean;
    time: string;
}

export default function Message({ author, file, error, time }: MessageProps) {
    const handleDownloadFile = () => {
        const blob = new Blob([file], { type: 'text/plain' });

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;

        // Append the anchor to the document
        document.body.appendChild(a);

        // Trigger a click on the anchor
        a.click();
    };

    return (
        <Box className="chat" display="flex" gap="10px" position="relative">
            <Avatar></Avatar>
            <Box display="flex" flexDirection="column" gap="3px">
                <Typography> {author}</Typography>
                {error ? (
                    <ErrorOutlineIcon />
                ) : (
                    <Button
                        variant="outlined"
                        startIcon={<SaveAltIcon />}
                        onClick={handleDownloadFile}
                    >
                        {file.name}
                    </Button>
                )}
            </Box>
            <Typography
                position="absolute"
                right="0px"
                fontSize="12px"
                color="secondary.main"
            >
                {time}
            </Typography>
        </Box>
    );
}
