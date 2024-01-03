import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Views/Home";
import Chat from "./Views/Chat";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
