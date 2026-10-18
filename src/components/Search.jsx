import { React, useContext, useState } from "react";
// import user from "../images/user.jpg";
import { collection, query, where , getDocs, getDoc, setDoc, doc, updateDoc, serverTimestamp} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const {currentUser} = useContext(AuthContext)

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", userName));
   try{
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setUser(doc.data())
    });
   }catch{
setErr(true);
   }
  };
  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async() => {
    // check whether the group(chats in firestore) exists, if not create
    const combinedId = 
    currentUser.uid > user.uid 
    ? currentUser.uid + user.uid 
    : user.uid + currentUser.uid;
     try{
    const res = await getDoc(doc(db, "chats", combinedId));
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [combinedId+".userInfo"]: {
        uid:user.uid,
        displayName:user.displayName,
        photoURL:user.photoURL
      },
      // [combinedId+"date"] :serverTimestamp()
    });
    await updateDoc(doc(db, "userChats", user.uid), {
      [combinedId+".userInfo"]: {
        uid:currentUser.uid,
        displayName:currentUser.displayName,
        photoURL:currentUser.photoURL
      },
      // [combinedId+"date"] :serverTimestamp()
    });
    if(!res.exists()){
      // create a chat in chat collection
      await setDoc(doc(db, "chats", combinedId), {messages:[]});
   
      // create user chats
    
    }

     }catch(err){
     }    
     setUser(null);
     setUserName("")
    // create user chats
    // userChats:{
    //   janesId:{
    //     combinedId:{
    //       userInfo{
    //         dn, img, id
    //       },
    //       lastMessage:"",
    //       date:

    //     }
    //   }
    // }
  
  }; 
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        />
        {err && <span>User not found</span>}
        {user && <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default Search;
