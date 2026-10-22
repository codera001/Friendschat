
import React, { useContext, useRef, useState } from "react";
import { PiSmileyLight } from "react-icons/pi";
import { FiPlus } from "react-icons/fi";
import { LuSendHorizonal } from "react-icons/lu";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, 
  // storage
 } from "../firebase";
import { v4 as uuid } from "uuid";
// import {
//   getDownloadURL,
//   ref,
//   uploadBytes,
// } from "firebase/storage";
import Picker from "emoji-picker-react";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const fileInputRef = useRef(null);

  const hasChat = Boolean(data?.chatId && data?.user?.uid);

  // Insert the selected emoji into the message text.
  const handleEmojiClick = (emojiData) => {
    setText((previousText) => previousText + emojiData.emoji);
    setShowPicker(false);
  };

  // Select an image only. Do not send it yet.
  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    setImg(selectedFile);
    setError("");
  };

  const handleSend = async (event) => {
    event.preventDefault();

    if (!hasChat || sending) return;

    const trimmedText = text.trim();

    // Do not send a message if both text and image are missing.
    if (!trimmedText && !img) return;

    setSending(true);
    setError("");

    try {
      let imageUrl = "";

      // Upload the selected image, if any.
      // if (img) {
      //   const storageRef = ref(storage, `chatImages/${uuid()}-${img.name}`);

      //   await uploadBytes(storageRef, img);
      //   imageUrl = await getDownloadURL(storageRef);
      // }

      const message = {
        id: uuid(),
        text: trimmedText,
        senderId: currentUser.uid,
        date: Timestamp.now(),
        ...(imageUrl ? { img: imageUrl } : {}),
      };

      // Save the message in the conversation.
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion(message),
      });

      // Update the sender's chat list.
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text: trimmedText || (imageUrl ? "📷 Image" : ""),
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      // Update the recipient's chat list.
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text: trimmedText || (imageUrl ? "📷 Image" : ""),
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      // Clear the input only after the message saves successfully.
      setText("");
      setImg(null);
      setShowPicker(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(
        "Your message could not be sent. Please check your connection and try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="input" onSubmit={handleSend}>
      <button
        type="button"
        className="emojiButton"
        onClick={() => setShowPicker((previous) => !previous)}
        disabled={!hasChat || sending}
        aria-label="Choose emoji"
      >
        <PiSmileyLight className="smiley" />
      </button>

      {showPicker && hasChat && (
        <div className="emojiPickerContainer">
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        id="file"
        hidden
        onChange={handleImageChange}
        disabled={!hasChat || sending}
      />

      <button
        type="button"
        className="attachmentButton"
        onClick={() => fileInputRef.current?.click()}
        disabled={!hasChat || sending}
        aria-label="Attach image"
      >
        <FiPlus className="plus" />
      </button>

      <div className="messageInputWrapper">
        <input
          type="text"
          placeholder={
            hasChat ? "Type a message..." : "Select a conversation first"
          }
          className="inputText"
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={!hasChat || sending}
        />

        {img && (
          <div className="selectedImage">
            <span>📷 {img.name}</span>
            <button
              type="button"
              onClick={() => {
                setImg(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              aria-label="Remove selected image"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!hasChat || sending || (!text.trim() && !img)}
        aria-label="Send message"
      >
        <LuSendHorizonal className="send" />
      </button>

      {error && <p className="inputError" role="alert">{error}</p>}
    </form>
  );
};

export default Input;
