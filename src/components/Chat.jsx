import React, { useContext } from "react";
import { PiVideoCamera, PiPhoneCall } from "react-icons/pi";
import { IoIosSearch } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  // data name coming from chatContext as state set
  const { data } = useContext(ChatContext)


  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <PiVideoCamera />
          <PiPhoneCall />
          <p></p>
          <IoIosSearch />
          <MdKeyboardArrowDown />
        </div>
       
      </div>
      <Messages />
       <Input />
    </div>
  );
};

export default Chat;
