import Alert from './components/Alert/Alert';
import Chat from './components/Chat/Chat';
import Header from './components/Header/Header';
import NamePromptDialog from './components/NamePromptDialog/NamePromptDialog';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
    return (
        <>
            <CssBaseline />
            <NamePromptDialog />
            <Header />
            <Chat />
            <Alert
                title="Не удалось отправить сообщение"
                message="Вы можете только принимать сообщения"
            ></Alert>
        </>
    );
}

export default App;
