import { useState } from "react";
import "./home.css";
import '@coreui/coreui/dist/css/coreui.min.css';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

 
function Home({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("discover");
 
 
 
  return (
    <div className="page-container">
    <div className="logo-holder"> <img src="/logo.png" alt="logo" className="logo" /></div>
    <div className="topnav">
    <a href="#"><NotificationsNoneOutlinedIcon/></a>
    <a href="#"><DarkModeOutlinedIcon/></a>
    <a href="#"><ExitToAppOutlinedIcon/></a>
    
      

    </div>
    <div class="sidenav">
     
    <a href="#"><DashboardOutlinedIcon/> Dashboard</a><br/>
    <a href="#"><SearchOutlinedIcon/> Search</a><br/>
    <a href="#"><FavoriteBorderOutlinedIcon/> Saved Jobs</a><br/>
    <a href="#"><SettingsOutlinedIcon/> Settings</a><br/>
    <a href="#"><ShieldOutlinedIcon/> Admin Panel</a><br/>
    </div></div>
    



  );
}
 
export default Home;
