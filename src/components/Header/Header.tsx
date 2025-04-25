import { Avatar, Button } from "@mui/material";
import "./Header.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Header() {
    return (
        <header className="header">
            <img width="130px" src="/logo.png" />
            <div className="header__right">
                <div className="header__user-data">
                    <Avatar />
                    <span className="header__username">@USER</span>
                </div>
                <Button variant="outlined">ВЫХОД</Button>
            </div>
        </header>
    );
}
