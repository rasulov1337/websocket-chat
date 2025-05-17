import Button from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { DialogActions, DialogContent, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Types';
import { login, sliceActions } from '../../slices/Slice';
import { useUserName } from '../../indexedDB';

const StyledDialog = styled(MUIDialog)(({ theme }) => ({
    '.MuiDialog-paper': {
        borderRadius: '0',
        padding: '5px 10px',
        border: '1px solid',
        borderColor: theme.palette.primary.main,
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(4),
        background: theme.palette.secondary,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(3),
    },
}));

export default function NamePromptDialog() {
    const open = useSelector((state: RootState) => state.slice.dialogOpen);
    const dispatch = useDispatch<AppDispatch>();
    const { username } = useUserName();

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(sliceActions.setUsername(e.target.value.trim()));
    };

    const handleLogin = () => {
        dispatch(login());
    };

    return (
        <StyledDialog open={open}>
            <DialogContent>
                <Typography gutterBottom variant="h2" component="h2">
                    Добро пожаловать в мессенджер ROCKETLAB
                </Typography>
                <Typography gutterBottom variant="h2" component="h2">
                    ВВЕДИТЕ ИМЯ, КОТОРОЕ БУДЕТ ОТОБРАЖАТЬСЯ ДРУГИМ
                </Typography>
                <TextField
                    id="outlined-basic"
                    label="Отображаемое имя"
                    variant="outlined"
                    onChange={handleNameChange}
                    value={username}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    endIcon={<CheckIcon />}
                    sx={{ width: '100%' }}
                    onClick={handleLogin}
                >
                    Войти
                </Button>
            </DialogActions>
        </StyledDialog>
    );
}
