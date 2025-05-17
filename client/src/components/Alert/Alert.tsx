import MUIAlert from '@mui/material/Alert';
import MUIAlertTitle from '@mui/material/AlertTitle';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Types';
import { Snackbar, SnackbarCloseReason } from '@mui/material';
import { alertActions } from '../../slices/Alert';

const Alert = () => {
    const title = useSelector((state: RootState) => state.alert.title);
    const errorMessage = useSelector((state: RootState) => state.alert.text);
    const open = useSelector((state: RootState) => state.alert.open);

    const dispatch = useDispatch();

    const handleClose = (
        _: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch(alertActions.hide());
    };

    return (
        <>
            <Snackbar open={open} onClose={handleClose}>
                <MUIAlert severity="error" variant="filled">
                    <MUIAlertTitle>{title}</MUIAlertTitle>
                    {errorMessage}
                </MUIAlert>
            </Snackbar>
        </>
    );
};

export default Alert;
