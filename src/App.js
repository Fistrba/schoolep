import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Loading from './components/Loading/Loading'
import "./App.css"
import logo from "./assets/logo_white.png"
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SettingsIcon from '@mui/icons-material/Settings';
import { ArrowBack, AutoAwesomeMotion, Logout } from '@mui/icons-material'
import { rdb } from './firebase'
import { onValue, ref } from 'firebase/database'
import { useAuth } from './context/AuthContext'
import MenuIcon from '@mui/icons-material/Menu';


const App = ({children}) => {


  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(true)

  let location = useLocation();
  let path = location.pathname

  const { currentUser, logout} = useAuth()

  // odhlasenie  
  const handleLogout = async() => {

    try{
      await logout()
        
    }catch(err) {
      console.log(err)
    }

  }

  // dostať info o uživatelovi
  const getUser = () => {
        const starCountRef = ref(rdb, `users/${currentUser.uid}`);
          onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          setUser(data);
        });
  }



  useEffect(() => {
  
    //zmeni title 
    setTimeout(() => {
      setLoading(false)
      document.title = "Schoolep"
    }, 1000)
   

      getUser()


  }, [])

  return (
    <>
    { !loading ? 
      <div id="main" >

            <div className='navbar left-side ' id='menu' >
              <div className='wrapper-navbar' >
              <ArrowBack onClick={() => {document.getElementById("menu").classList.remove("left-menu");  document.body.style.overflow="visible"}} className='arrow-back-mobile' />
              <nav>
                <img src={logo} alt="logo" />
                <ul>
                  <Link to="/" className={path === "/" ? "active" : null} >
                    <HomeIcon />
                    Domov
                  </Link>
                  <Link to="/chat" className={path === "/chat" ? "active" : null} >
                    <ChatIcon />
                    Chat
                  </Link>
                  <Link to="/notes" className={path.includes("notes") ? "active" : null}>
                    <AutoAwesomeMotion  />
                    Poznámky
                  </Link>
                  <Link to="/schoolepai" className={path === "/schoolepai" ? "active" : null}>
                    <SmartToyIcon />
                    SchoolepAI
                  </Link>
                  <Link to="/settings" className={path === "/settings" ? "active" : null}>
                    <SettingsIcon />
                    Nastavania
                  </Link>
                </ul>
              </nav>
                <div className='logout'  onClick={handleLogout} >
                  <Logout className='icon' />
                  <h4>Odlásiť sa</h4>
                </div>
              </div>
            </div>

          <div className='right-side' >
            <div className='mobile_top_bar' >
                { user && 
              <div className='profile' >
                <img src={user.profilePic} />
                <h3>{user.username}</h3>
              </div>
                }
              <MenuIcon onClick={() => {document.getElementById("menu").classList.add("left-menu"); document.body.style.overflow="hidden"} } className='menu-bar-icon' />
            </div>
            <div id='children' >
              {children}
            </div>
          </div>

      </div> : <Loading />
    }
  </>
  )
}

export default App