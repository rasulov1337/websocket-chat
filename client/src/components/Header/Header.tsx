import { Avatar, Box, Button, Skeleton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Types';
import { logout } from '../../slices/Slice';

export default function Header() {
    const username = useSelector((state: RootState) => state.slice.username);
    const loggedIn = useSelector((state: RootState) => state.slice.loggedIn);
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <Box
            component="header"
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '20px',
                px: { xs: 2, sm: 8 },
                py: 0,
                width: '100%',
                height: '100px',
                color: 'white',
            }}
        >
            <img width="130px" src="/logo.png" />
            <Box
                sx={{
                    display: 'flex',
                    gap: { xs: '10px', sm: '50px' },
                    alignItems: 'center',
                }}
            >
                <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <Avatar />
                    {loggedIn ? (
                        <span className="header__username">
                            {`@${username}`}
                        </span>
                    ) : (
                        <Skeleton
                            sx={{ fontSize: '30px' }}
                            variant="text"
                            width={70}
                        />
                    )}
                </Box>
                <Button variant="outlined" onClick={handleLogout}>
                    ВЫХОД
                </Button>
            </Box>
        </Box>
    );
}
