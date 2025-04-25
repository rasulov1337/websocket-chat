import "./App.css";
import Chat from "./components/Chat/Chat";
import Header from "./components/Header/Header";
import NamePromptDialog from "./components/NamePromptDialog/NamePromptDialog";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
    return (
        <>
            <CssBaseline />
            <NamePromptDialog />
            <Header />
            <Chat />
        </>
    );
}

export default App;
