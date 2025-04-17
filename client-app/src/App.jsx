import "./App.css";
import Login from "./userComponent/Login";
import Home from "./userComponent/Home";
import { Route, Routes } from "react-router-dom";
import Navbar from "./userComponent/navbar/Navbar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Theme from "./Theme";
import EmailLoginForm from "./userComponent/EmailLoginForm";
import ChatRoom from "./userComponent/chat/ChatRoom";

function App() {
  return (
    <>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-login" element={<EmailLoginForm />} />
          <Route path="/chat-room/:chatRoomId" element={<ChatRoom />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
