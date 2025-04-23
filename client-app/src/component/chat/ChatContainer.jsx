// src/component/chat/ChatContainer.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../../state/auth/Action";
import { fetchChatRooms } from "../../state/ChatApis";
import Chat from "./Chat";

function ChatContainer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [chatRooms, setChatRooms] = useState([]);
  const [chatError, setChatError] = useState(null);

  useEffect(() => {
    if (!user && !isLoading && !error) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, isLoading, error]);

  useEffect(() => {
    if (user) {
      fetchChatRooms(user.id)
        .then((rooms) => setChatRooms(rooms))
        .catch((err) => setChatError(err.message));
    }
  }, [user]);

  return (
    <Chat chatRooms={chatRooms} chatError={chatError} navigate={navigate} />
  );
}

export default ChatContainer;
