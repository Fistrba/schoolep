import { update, ref } from 'firebase/database'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { db, rdb } from '../../firebase'


const Friend = (props) => {

  const [friend, setFriend] = useState()
  const [lastMessage, setLastMessage] = useState()
  const [sawMessage, setSawMessage] = useState()

  const { currentUser } = useAuth()

  useEffect(() => {
    props.allUsers.filter((f) => {
      return f.id === props.friend.id
    }).map((f) => {
      setFriend(f)
    })



  }, [])




  useEffect(() => {
    if(friend) {
      if(props.activeFriend === friend.id){
          update(ref(rdb, "users/" + currentUser.uid + "/messages/" + props.activeFriend), {
            saw: true
          })
      }
    }
  }, [props.activeFriend, props.handleSendMessage])

  

  return (
    <>
    
    {  friend &&

    <div className={props.friend.id === props.activeFriend ? 'friend active' : "friend" } 
    onClick={() => {
        props.setActiveFriend(props.friend.id)
        props.setSearchFriend("")
    }} >
        <div className='wrapper' >
        <img src={friend.profilePic} />
            <div className='right-side' >
                <h4>{friend.username}</h4>
                {props.friend.message && <p  className={props.friend.saw ? "null" : "saw_false"} >{props.friend.toId === friend.id ? props.friend.message.length > 25 ? "Ja: " + props.friend.message.substr(0, 25) + "..." : "Ja: " + props.friend.message : props.friend.message.length > 25 ? props.friend.message.substr(0, 25) + "..." : props.friend.message}</p>}
                {!props.friend.message && <p  className="null" >{friend.email}</p>}
            </div>
        </div>
    </div>

    }
    
    </>
  )
}

export default Friend