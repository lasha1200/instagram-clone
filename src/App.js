import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Post from './Post.js';
import { Button, Input, Modal } from '@mui/material';
import { makeStyles } from '@mui/styles';

const BASE_URL ="http://localhost:8000/"

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(() => ({
  paper: {
    backgroundColor: 'white',
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
    padding: '16px 32px 24px',
  }
}))

function App() {
const classes = useStyles();

const [posts, setPosts]=useState([]);
const [openSignIn, setOpenSignIn]=useState(false);
const [openSignUp, setOpenSignUp]=useState(false);
const [modalStyle, setModalStyle]=useState(getModalStyle);
const [email, setEmail]=useState('');
const [username, setUsername] = useState(
  window.localStorage.getItem('username') || ''
);
const [password, setPassword] = useState('');

const [authToken, setAuthToken] = useState(
  window.localStorage.getItem('authToken') || null
);
const [authTokenType, setAuthTokenType] = useState(
  window.localStorage.getItem('authTokenType') || null
);
const [userId, setUserId] = useState(
  window.localStorage.getItem('userId') || ''
);

// Stores auth data in localStorage whenever state changes
useEffect(() => {
  authToken
    ? window.localStorage.setItem('authToken', authToken)
    : window.localStorage.removeItem('authToken');
  authTokenType
    ? window.localStorage.setItem('authTokenType', authTokenType)
    : window.localStorage.removeItem('authTokenType');
  userId
    ? window.localStorage.setItem('userId', userId)
    : window.localStorage.removeItem('userId');
  username
    ? window.localStorage.setItem('username', username)
    : window.localStorage.removeItem('username');
}, [authToken, authTokenType, userId]);

useEffect(() => {
 fetch(BASE_URL + 'post/all')
 .then(response =>{
  const json = response.json()
  console.log(json)
  if (response.ok){
    return json
  }
  throw response
 })
 .then(data=>{ //Displays posts newest to oldest
  const result = data.sort((a,b)=> {
 const t_a = a.timestamp.split(/[-T:]+/);
 const t_b = b.timestamp.split(/[-T:]+/);
 const d_a = new Date(Date.UTC(t_a[0],t_a[1]-1,t_a[2],t_a[3],t_a[4],t_a[5]));
 const d_b = new Date(Date.UTC(t_b[0],t_b[1]-1,t_b[2],t_b[3],t_b[4],t_b[5]));
 return d_b - d_a
  })
  return result
 })
 .then(data => {
  setPosts(data)
 })
 .catch(error =>{
  console.log(error);
  alert(error)
 })
 
},[]) 

const signIn = (event) =>{
  event.preventDefault();

  let formData = new FormData();
  formData.append('username', username)
  formData.append('password', password)

  const requestOptions = {
    method: 'POST',
    body: formData
  }

  fetch(BASE_URL + 'login', requestOptions)
  .then (response =>{
    if (response.ok){
    return response.json()
    }
    throw response
  
  })
    .then(data =>{
      console.log(data);
      setAuthToken(data.access_token)
      setAuthTokenType(data.token_type)
      setUserId(data.user_id)
      setUsername(data.username)
    })
    .catch (error =>{
      console.log(error);
      alert(error);
    })
  setOpenSignIn(false);
}

const logOut = (event) => {
  setAuthToken(null)
  setAuthTokenType(null)
  setUserId('')
  setUsername('')
}

const signUp = (event) =>{
  
}

  return (
    <div className='app'>

      <Modal
      open = {openSignIn}
      onClose={() => setOpenSignIn(false)}>
        <div style = {modalStyle} className ={classes.paper}>
      <form className ="app_signin">
        <center>
          <img className ="app_headerImage"
          src ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY-0y1vWRxqeWnurh214AIqYiQ08C9GjjTV9OBOg_BDw&s=10"
          alt = "Instagram"/>
        </center>
          <Input
          placeholder='username'
          type ="text"
          value ={username}
          onChange={(e) => setUsername(e.target.value)}
          />
          <Input
          placeholder='password'
          type ="password"
          value ={password}
          onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button 
          type ="submit"
          onClick={signIn}>Login</Button>
          
          
      </form>
        </div>
      </Modal>

      <Modal
      open = {openSignUp}
      onClose={() => setOpenSignUp(false)}>
        <div style = {modalStyle} className ={classes.paper}>
      <form className ="app_signin">
        <center>
          <img className ="app_headerImage"
          src ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY-0y1vWRxqeWnurh214AIqYiQ08C9GjjTV9OBOg_BDw&s=10"
          alt = "Instagram"/>
        </center>
          <Input
          placeholder='username'
          type ="text"
          value ={username}
          onChange={(e) => setUsername(e.target.value)}
          />

          <Input
          placeholder='email'
          type ="text"
          value ={email}
          onChange={(e) => setEmail(e.target.value)}
          />


          <Input
          placeholder='password'
          type ="password"
          value ={password}
          onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button 
          type ="submit"
          onClick={signUp}>Sign Up</Button>
          
          
      </form>
        </div>
      </Modal>
      <div className='app_header'>
        <img className='app_headerImage'
        src ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY-0y1vWRxqeWnurh214AIqYiQ08C9GjjTV9OBOg_BDw&s=10"
        alt = "Instagram"/>
        <h1 className='app_headerTitle'>Instagram</h1>
        {authToken? (
          <Button onClick={() =>logOut()}>Logout</Button>
        ) : (
       <div>
         <Button onClick ={() => setOpenSignIn(true)}>Login</Button>

         <Button onClick ={() => setOpenSignUp(true)}>Signup</Button>
       </div>
        )
}
      </div>
   <div className="app_posts">
      {
        posts.map(post =>(
          <Post
          key = {post.id}
          post = {post}
          />
        ))
      }
       </div>
    </div>
  );
}

export default App;
