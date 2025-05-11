import { Box, Skeleton } from '@mui/material';

export default function MessageSkeleton() {
    return (
        <Box className="chat" display="flex" gap="10px" position="relative">
            <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{ fontSize: '20px' }}
            />
            <Box display="flex" flexDirection="column" gap="3px">
                <Skeleton
                    sx={{ fontSize: '20px' }}
                    variant="rounded"
                    width={70}
                    height={20}
                />
                <Skeleton
                    variant="rounded"
                    width={210}
                    height={35}
                    sx={{ fontSize: '20px' }}
                />
            </Box>
            <Skeleton
                sx={{ fontSize: '16px', position: 'absolute', right: '0' }}
                variant="text"
                width={40}
            />
        </Box>
    );
}
