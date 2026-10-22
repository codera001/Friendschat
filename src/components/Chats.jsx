
import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Chats = () => {
  const [chats, setChats] = useState({});
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (!currentUser?.uid) {
      setChats({});
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      doc(db, "userChats", currentUser.uid),
      (snapshot) => {
        setChats(snapshot.exists() ? snapshot.data() : {});
        setLoading(false);
      },
      (error) => {
        console.error("Could not load chats:", error);
        setChats({});
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const handleSelect = (user, chatId) => {
    dispatch({
      type: "CHANGE_USER",
      payload: { ...user, chatId },
    });
  };

  if (loading) {
    return <div className="chats">Loading conversations...</div>;
  }

  const chatEntries = Object.entries(chats).sort(
    ([, a], [, b]) =>
      (b.date?.toMillis?.() ?? 0) - (a.date?.toMillis?.() ?? 0)
  );

  if (chatEntries.length === 0) {
    return (
      <div className="chats">
        <p className="noChats">
          No conversations yet. Search for a friend to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="chats">
      {chatEntries.map(([chatId, chat]) => (
        <div
          className="userChat"
          key={chatId}
          onClick={() => handleSelect(chat.userInfo, chatId)}
        >
          <img
            src={chat.userInfo?.photoURL || "/avatars/avatar1.png"}
            alt={chat.userInfo?.displayName || "Friend"}
          />

          <div className="userChatInfo">
            <span>{chat.userInfo?.displayName || "Friend"}</span>
            <p>
              {chat.lastMessage?.text ||
                chat.lastMesage?.text ||
                "Start a conversation"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
