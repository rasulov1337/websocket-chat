import { Box, Button, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface MessageProps {
    author: string;
    filename: string;
    error?: boolean;
    time: string;
}

export default function Message({
    author,
    filename,
    error,
    time,
}: MessageProps) {
    return (
        <Box className="chat" display="flex" gap="10px" position="relative">
            <Avatar></Avatar>
            <Box display="flex" flexDirection="column" gap="3px">
                <Typography> {author}</Typography>
                {error ? (
                    <ErrorOutlineIcon />
                ) : (
                    <Button variant="outlined" startIcon={<SaveAltIcon />}>
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
                {time}
            </Typography>
        </Box>
    );
}
