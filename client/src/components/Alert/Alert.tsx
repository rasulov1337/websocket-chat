import MUIAlert from "@mui/material/Alert";
import MUIAlertTitle from "@mui/material/AlertTitle";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Types";
import { Snackbar, SnackbarCloseReason } from "@mui/material";
import { alertActions } from "../../slices/Alert";

const StyledAlert = styled(MUIAlert)(({ theme }) => ({
    "&": {
        position: "fixed",
        bottom: "100px",
        right: "30px",
    },
}));

const Alert = () => {
    const title = useSelector((state: RootState) => state.alert.title);
    const errorMessage = useSelector((state: RootState) => state.alert.text);
    const open = useSelector((state: RootState) => state.alert.open);

    const dispatch = useDispatch();

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === "clickaway") {
            return;
        }

        dispatch(alertActions.hide());
    };

    return (
        <>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <StyledAlert severity="error">
                    <MUIAlertTitle>{title}</MUIAlertTitle>
                    {errorMessage}
                </StyledAlert>
            </Snackbar>
        </>
    );
};

export default Alert;
