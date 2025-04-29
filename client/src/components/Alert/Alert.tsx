import MUIAlert from "@mui/material/Alert";
import MUIAlertTitle from "@mui/material/AlertTitle";
import { styled } from "@mui/material/styles";

interface AlertProps {
    title: string;
    message: string;
}

const StyledAlert = styled(MUIAlert)(({ theme }) => ({
    "&": {
        position: "fixed",
        bottom: "100px",
        right: "30px",
    },
}));

const Alert = ({ title, message }: AlertProps) => {
    return (
        <>
            <StyledAlert severity="error">
                <MUIAlertTitle>{title}</MUIAlertTitle>
                {message}
            </StyledAlert>
        </>
    );
};

export default Alert;
