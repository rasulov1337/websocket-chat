import { Avatar, Button, Skeleton } from '@mui/material';
import './Header.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Types';
import { sliceActions } from '../../slices/Slice';

export default function Header() {
    const username = useSelector((state: RootState) => state.slice.username);
    const loggedIn = useSelector((state: RootState) => state.slice.loggedIn);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(sliceActions.logout());
    };

    return (
        <header className="header">
            <img width="130px" src="/logo.png" />
            <div className="header__right">
                <div className="header__user-data">
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
                </div>
                <Button variant="outlined" onClick={handleLogout}>
                    ВЫХОД
                </Button>
            </div>
        </header>
    );
}
