import { Avatar, Button } from '@mui/material';
import './Header.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Types';
import { sliceActions } from '../../slices/Slice';

export default function Header() {
    const username = useSelector((state: RootState) => state.slice.username);
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
                    <span className="header__username">
                        {username && `@${username}`}
                    </span>
                </div>
                <Button variant="outlined" onClick={handleLogout}>
                    ВЫХОД
                </Button>
            </div>
        </header>
    );
}
