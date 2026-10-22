
import React, { useContext } from "react";
import { PiVideoCamera, PiPhoneCall, PiChatsCircle } from "react-icons/pi";
import { IoIosSearch } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  if (!data?.user || !data?.chatId) {
    return (
      <div className="chat">
        <div className="emptyChat">
          <div className="emptyChatIcon">
            <PiChatsCircle />
          </div>
          <h2>Your conversations start here</h2>
          <p>
            Choose a friend from your chat list or search for someone
            to start chatting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="chatUserDetails">
          <img
            className="chatHeaderAvatar"
            src={data.user.photoURL || "/avatars/avatar1.png"}
            alt={data.user.displayName || "Friend"}
          />
          <div className="chatHeaderText">
            <span>{data.user.displayName}</span>
            <small>FriendsChat conversation</small>
          </div>
        </div>

        <div className="chatIcons">
          <PiVideoCamera title="Video call" />
          <PiPhoneCall title="Voice call" />
          <IoIosSearch title="Search" />
          <MdKeyboardArrowDown title="More options" />
        </div>
      </div>

      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
