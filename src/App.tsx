import "./App.css";
import Chat from "./components/Chat/Chat";
import Header from "./components/Header/Header";
import NamePromptDialog from "./components/NamePromptDialog/NamePromptDialog";

function App() {
    return (
        <>
            <NamePromptDialog />
            <Header />
            <Chat />
        </>
    );
}

export default App;
