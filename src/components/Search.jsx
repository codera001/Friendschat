
import React, { useContext, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");
  const [searching, setSearching] = useState(false);
  const [selecting, setSelecting] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async (event) => {
    event?.preventDefault();

    const searchName = userName.trim();

    if (!searchName) {
      setUser(null);
      setErr("Enter a name to search.");
      return;
    }

    setSearching(true);
    setUser(null);
    setErr("");

    try {
      // Fetch users and compare names without case sensitivity.
      const snapshot = await getDocs(collection(db, "users"));

      const matchedUser = snapshot.docs
        .map((userDoc) => ({
          ...userDoc.data(),
          uid: userDoc.id,
        }))
        .find(
          (candidate) =>
            candidate.uid !== currentUser?.uid &&
            candidate.displayName?.trim().toLowerCase() ===
              searchName.toLowerCase()
        );

      if (matchedUser) {
        setUser(matchedUser);
      } else {
        setErr("No user found with that name.");
      }
    } catch (error) {
      console.error("Error searching for users:", error);
      setErr("Could not search right now. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = async () => {
    if (!user || !currentUser?.uid || selecting) return;

    setSelecting(true);
    setErr("");

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      // Create the conversation if it doesn't exist.
      await setDoc(
        doc(db, "chats", combinedId),
        { messages: [] },
        { merge: true }
      );

      // Add the conversation to the current user's chat list.
      await setDoc(
        doc(db, "userChats", currentUser.uid),
        {
          [combinedId]: {
            userInfo: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL || "/avatars/avatar1.png",
            },
            date: serverTimestamp(),
          },
        },
        { merge: true }
      );

      // Add the conversation to the other user's chat list.
      await setDoc(
        doc(db, "userChats", user.uid),
        {
          [combinedId]: {
            userInfo: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL:
                currentUser.photoURL || "/avatars/avatar1.png",
            },
            date: serverTimestamp(),
          },
        },
        { merge: true }
      );

      setUser(null);
      setUserName("");
    } catch (error) {
      console.error("Error creating conversation:", error);
      setErr("Could not start this conversation. Please try again.");
    } finally {
      setSelecting(false);
    }
  };

  return (
    <div className="search">
      <form
        className="searchForm"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Find a user"
          value={userName}
          onChange={(event) => {
            setUserName(event.target.value);
            setUser(null);
            setErr("");
          }}
          autoComplete="off"
          aria-label="Search users by name"
        />

        <button type="submit" disabled={searching}>
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {err && <p className="searchMessage" role="status">{err}</p>}

      {user && (
        <button
          type="button"
          className="searchResult"
          onClick={handleSelect}
          disabled={selecting}
        >
          <img
            src={user.photoURL || "/avatars/avatar1.png"}
            alt=""
          />

          <span className="searchResultInfo">
            <strong>{user.displayName}</strong>
            <small>{selecting ? "Opening conversation..." : "Start chatting"}</small>
          </span>

          <span className="searchResultArrow">›</span>
        </button>
      )}
    </div>
  );
};

export default Search;
