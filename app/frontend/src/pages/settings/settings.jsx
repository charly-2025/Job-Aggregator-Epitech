import "./settings.css";
import { useState,useEffect, use } from "react";

function Settings({ user }) {
    const [userEmail, setUserEmail] = useState(user?.email || "");
    const [userLastName, setUserLastName] = useState(user?.last_name || "");
    const [userFirstName, setUserFirstName] = useState(user?.first_name || "");
    const [userCreatedAt, setUserCreatedAt] = useState(user?.created_at || "");
    const [userSkills, setUserSkills] = useState(user?.skills || []);


    const getTimeSinceCreation = (creationDate) => {
        const now = new Date();
        const creation = new Date(creationDate);
        const diffInMs = now - creation;
        const diffInDays = diffInMs / (1000 * 3600 * 24);
        
        if (diffInDays < 1) {
            const diffInHours = diffInMs / (1000 * 3600);
            if (diffInHours < 1) {
                const diffInMinutes = diffInMs / (1000 * 60);
                if (diffInMinutes < 1) {
                    return "Just now";
                }
                return `${Math.floor(diffInMinutes)} minute(s) ago`;
            }
            return `${Math.floor(diffInHours)} hour(s) ago`;
        }
        return `${Math.floor(diffInDays)} day(s) ago`;
        };

    useEffect(() => {
        const getAllSkills = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/skills/allSkills", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });
                const data = await response.json();
                if (response.ok) {
                    console.log("Success :", data);
                } else {
                    console.log("Error:", data.message);
                }
            } catch (error) {
                console.error("Server error:", error);
            }
        };
        getAllSkills();
    }, []);


    return (
        <div className="settings-page">
            <div className="settings-container">
                <div className="settings-header">
                    <h1>Settings</h1>
                    <p>Manage your account and preferences</p>
                </div>
                <div className="settings-body">
                    <div className="settings-section">
                        <div className="user-information">
                            <h2>Account Information</h2>
                            <p><strong>Email:</strong> {userEmail}</p>
                            <p><strong>Last Name:</strong> {userLastName}</p>
                            <p><strong>First Name:</strong> {userFirstName}</p>
                            <p><strong>Member Since:</strong> {getTimeSinceCreation(userCreatedAt)}</p>
                        </div>
                        <div className="user-skills">
                            <h2>Skills</h2>
                            {userSkills.length > 0 ? (
                                <ul>
                                    {userSkills.map((skill, index) => (
                                        <li key={index}>{skill}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No skills added yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    }

    export default Settings;