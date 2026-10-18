import React, { useContext, useState } from 'react'
import { PiSmileyLight } from "react-icons/pi";
import { FiPlus } from "react-icons/fi";
import { LuSendHorizonal } from "react-icons/lu";
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Picker from 'emoji-picker-react';

const Input = () => {
  const[text, setText] = useState("");
  const[img, setImg] = useState("");
  const[smile, setSmile] = useState("");
  // const[file, setFile] =useState(null)
  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);
  const [showPicker, setShowPicker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
 
  const handleSelect = () => {
    setShowPicker(!showPicker);
  };

  const handleChange = (event) => {
    setText(event.target.value);
    // setSmile(event.target.value);
  };

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  const handleSend = async() =>{
    if(img){
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(       
          (error) => {
            // Handle unsuccessful uploads
            // setErr(true)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId),{
                messages: arrayUnion({
                  id:uuid(),
                  text,
                  smile,
                  senderId:currentUser.uid,
                  date: Timestamp.now(),
                  img:downloadURL,
                }),
              }); 
            });
          }
        );
  
    }else{
    await updateDoc(doc(db, "chats", data.chatId),{
      messages: arrayUnion({
        id:uuid(),
        text,
        smile,
        senderId:currentUser.uid,
        date: Timestamp.now(),

      }),
    });
    }
    // to update user chats to last messages and date 
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMesage"]: {
        text
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMesage"]: {
        text
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    // to make clean text after sending in input
    setText("");
    setImg("");
  };
  return (
    <div className='input'>
             <PiSmileyLight onClick={handleSelect} className='smiley' value={smile} onChange={handleChange}/>
      
      {showPicker && (
        <Picker
          onEmojiClick={(event, emojiObject) => {
            // Handle the selected emoji, you can update your state or perform any other actions here
            console.log(emojiObject.target);
            setSmile(emojiObject.target);
          }}
          className='smileyEmoji'
        />
      )}

      <input type="file" id='file' style={{display:"none"}} onChange={e=>setImg(e.target.files[0])} onClick={handleSend}/>
            <label htmlFor="file">
            <FiPlus  className='plus'/>
            </label>   
      <input type="text" placeholder='Type a message' className='inputText'  onChange={handleChange} value={text + (smile || '')}/>
      <button onClick={handleSend}>
      <LuSendHorizonal  className='send'/>
      </button>
    </div>
  )
}

export default Input