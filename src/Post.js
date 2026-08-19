import React, {useState, useEffect} from 'react'
import './Post.css'
import { Avatar, Button } from '@mui/material';

const BASE_URL ="http://localhost:8000/"

function Post({post, authToken, authTokenType, username}){
    
    const [imageUrl, setImageUrl] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    
    useEffect(() => {
      if(post.image_url_type === 'absolute'){
        setImageUrl(post.image_url)
      }
      else {
        setImageUrl(BASE_URL + post.image_url)
      }
    },[])

    useEffect(()=>{
        setComments(post.comments)
    },[])

    const handleDelete = (event) => {
        event?.preventDefault();

        const requestOptions = {
            method: 'GET',
            headers: new Headers({
                'Authorization': authTokenType + ' ' + authToken
            })
        }
        fetch(BASE_URL + 'post/delete/' + post.id, requestOptions)
        .then(response=> {
            if (response.ok){
                alert('Post deleted');
                window.location.reload();
                window.scrollTo(0,0);
            }
            else{
                alert('Something went wrong');
            }
        })
        .catch(error => {
            alert(error);
        })
    }

    const postComment = (event) => {
        event?.preventDefault();

        const json_string = JSON.stringify({
            username: username,
            post_id: post.id,
            text: newComment
        });

        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Authorization': authTokenType + ' ' + authToken,
                'Content-Type': 'application/json'
            }),
            body: json_string
        }

        fetch(BASE_URL + 'comment', requestOptions)
        .then(response=> {
            if (response.ok){
                return response.json()
            }
        })
        .then(data => {
            fetchComments()
        })
        .catch(error => {
            console.log(error)
            alert(error)
        })
        .finally(() =>{
            setNewComment('')
        })
    }

    const fetchComments = () => {
        fetch(BASE_URL + 'comment/all/' + post.id)
        .then (response =>{
            if (response.ok){
                return response.json()
            }
        })
        .then (data => {
            setComments(data)
        })
        .catch (error => {
            console.log(error)
        })
    }


    return (
        <div className='post'>
            <div className='post_header'>
                <Avatar
                alt= 'Lasha'
                src= ''/>
            <div className='post_header_info'>
                <h3>{post.user.username}</h3>
                <Button className='post_delete' onClick = {handleDelete}>Delete</Button>
            </div>
            </div>
            <img className='post_image'
            src = {imageUrl} alt="Post" />
            <h4 className ='post_text'>{post.caption}</h4>
            <div className = 'post_comments'>
                {comments.map((comment) =>(
                    <p> <strong>{comment.username}</strong> {comment.text}</p>
                ))}
            </div>
            {authToken && (
                <form className ="post_commnetbox">
                    <input className="post_input"
                    type = "text"
                    placeholder="Add a comment.."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className = "post_button"
                    type = "submit"
                    disabled={!newComment}
                    onClick={postComment}>
                        Post
                    </button>
                </form>
            )}
        </div>
    )
}

export default Post