import { React, useState } from "react";
import "./style.scss";
import Add from "../images/add.png";
import { createUserWithEmailAndPassword , updateProfile} from "firebase/auth";
import { auth , storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from "react-router-dom";


const Register = () => {
  const [err, setErr] = useState(false);
  // const [upload, setUpload] = useState()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(e.target[0].value)
    const nickName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];


    // const auth = getAuth();
    try {
      
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, nickName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
      //   'state_changed', 
      // (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      //   const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //   console.log('Upload is ' + progress + '% done');
      //   setUpload('Upload is ' + progress + '% done')
      //   switch (snapshot.state) {
      //     case 'paused':
      //       console.log('Upload is paused');
      //       break;
      //     case 'running':
      //       console.log('Upload is running');
      //       break;
      //   }
      // }, 
        
        (error) => {
          // Handle unsuccessful uploads
          setErr(true)
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            console.log("File available at", downloadURL);
            await updateProfile(res.user,{
              displayName:nickName,
              photoURL:downloadURL
            })

            await setDoc(doc(db, "users", res.user.uid), {
              uid:res.user.uid,
              displayName:nickName,
              email,
              photoURL:downloadURL
              
            });

            await setDoc(doc(db, "userChats", res.user.uid) ,{});
            navigate("/")
          });
        }
      );

   
    } catch (err) {
      setErr(true);
    }
    // .then((userCredential) => {
    //   // Signed up
    //   const user = userCredential.user;
    //   // ...
    // })
    // .catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   // ..
    // });
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Friends chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="nick name" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input type="file" id="file" style={{ display: "none" }} />
          <label htmlFor="file">
            <img src={Add} alt="add avatar" />
            <span > Add an Avatar</span>
          </label>
          <button>Sign up</button>
          {err && <span>Something went wrong</span>}
          <p>
            You already have an account?<Link to = "/login" >Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
