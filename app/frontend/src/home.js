import { useState } from "react";
import "./home.css";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
 
function Home({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("discover");
 
 
 
  return (
    <div className="page-container">
    <div className="topnav">
      <a className="active" href="#home">Home</a>
      <a href="#news">News</a>
      <a href="#contact">Contact</a>
      <a href="#about">About</a>
    </div>
    <div class="sidenav">
      <img src="/logo.png" alt="logo" className="logo" />
    <a href="#"><DashboardOutlinedIcon/> Dashboard</a><br/>
    <a href="#"><SearchOutlinedIcon/> Search</a><br/>
    <a href="#"><FavoriteBorderOutlinedIcon/> Saved Jobs</a><br/>
    <a href="#"><SettingsOutlinedIcon/> Settings</a><br/>
    <a href="#"><ShieldOutlinedIcon/> Admin Panel</a><br/>
    </div></div>
    



  );
}
 
export default Home;
