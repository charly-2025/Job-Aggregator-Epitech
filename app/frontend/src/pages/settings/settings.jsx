import "./settings.css";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Modal,
  Box,
  Typography,
  Autocomplete,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, use } from "react";

function Settings({ user, refreshAccessToken }) {
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const [allSkills, setAllSkills] = useState([]);
  const [userEmail, setUserEmail] = useState(user?.email || "");
  const [userLastName, setUserLastName] = useState(user?.last_name || "");
  const [userFirstName, setUserFirstName] = useState(user?.first_name || "");
  const [userCreatedAt, setUserCreatedAt] = useState(user?.created_at || "");
  const [userSkills, setUserSkills] = useState(
    (user?.skills || []).map((s) => (typeof s === "string" ? { name: s } : s)),
  );

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
        const response = await fetch(
          "http://localhost:3001/api/skills/allSkills",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
        const data = await response.json();
        if (response.ok) {
          setAllSkills(data);
          console.log("Success fetching skills");
        } else if (response.status === 401) {
          console.log("Unauthorized, refreshing token...");
          await refreshAccessToken();
          getAllSkills();
        } else {
          console.log("Error:", data.message);
        }
      } catch (error) {
        console.error("Server error:", error);
      }
    };
    getAllSkills();
  }, []);

  const availableSkills = allSkills.filter(
    (skill) => !userSkills.some((userSkill) => userSkill.name === skill.name),
  );

  const handleAddSkill = () => {
    if (
      selectedSkill &&
      !userSkills.some((s) => s.name === selectedSkill.name)
    ) {
      setUserSkills([...userSkills, selectedSkill]);
      setSelectedSkill(null);
      setOpenModal(false);
    }
  };

  const handleRemoveSkill = (skillName) => {
    setUserSkills(userSkills.filter((skill) => skill.name !== skillName));
  };

  const handleSaveChanges = async (retry = false) => {
    try {
      setIsSaving(true);

      const response = await fetch("http://localhost:3001/api/users/userInfo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          first_name: userFirstName,
          last_name: userLastName,
          email: userEmail,
          skills: userSkills.map((skill) => skill.name),
          password: confirmPassword,
        }),
      });

      if (response.status === 401 && !retry) {
        console.log("Unauthorized, refreshing token...");

        await refreshAccessToken();

        return handleSaveChanges(true);
      }

      const data = await response.json();

      if (response.ok) {
        setToast({
          open: true,
          message: "Profile updated successfully",
          severity: "success",
        });

        setOpenSaveModal(false);
        setConfirmPassword("");
        return;
      }

      if (response.status === 401) {
        setToast({
          open: true,
          message: "Incorrect password",
          severity: "error",
        });
        return;
      }

      if (response.status === 429) {
        setToast({
          open: true,
          message: "Too many attempts. Please try again later.",
          severity: "error",
        });
        return;
      }

      setToast({
        open: true,
        message: data.message || "Something went wrong",
        severity: "error",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Server error",
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
              <div className="user-name">
                <p>
                  <strong>First Name:</strong>{" "}
                  <input
                    type="text"
                    value={userFirstName}
                    onChange={(e) => setUserFirstName(e.target.value)}
                  />
                </p>
                <p>
                  <strong>Last Name:</strong>{" "}
                  <input
                    type="text"
                    value={userLastName}
                    onChange={(e) => setUserLastName(e.target.value)}
                  />
                </p>
              </div>
              <p>
                <strong>Email:</strong>{" "}
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </p>
              <p>
                <strong>Member Since:</strong>{" "}
                {getTimeSinceCreation(userCreatedAt)}
              </p>
            </div>
            <div className="user-skills">
              <div className="skills-header">
                <h2>Skills</h2>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setOpenModal(true)}
                >
                  Add Skill
                </Button>
              </div>
              {userSkills.length > 0 ? (
                <div className="skills-list">
                  {userSkills.map((skill) => (
                    <div
                      key={skill.skill_id || skill.name}
                      className="skill-badge"
                    >
                      <span>{skill.name}</span>

                      <button
                        className="remove-skill-btn"
                        onClick={() => handleRemoveSkill(skill.name)}
                      >
                        <CloseIcon sx={{ fontSize: "12px", color: "white" }} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-skills">No skills added yet.</p>
              )}
            </div>
            <Button
              className="save-button"
              onClick={() => setOpenSaveModal(true)}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box className="skill-modal">
          <Typography variant="h6">Add a Skill</Typography>

          <Autocomplete
            options={availableSkills}
            getOptionLabel={(option) => option.name}
            value={selectedSkill}
            onChange={(event, newValue) => setSelectedSkill(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select a skill" />
            )}
          />

          <Button
            variant="contained"
            onClick={handleAddSkill}
            disabled={!selectedSkill}
          >
            Add
          </Button>
        </Box>
      </Modal>
      <Modal
        open={openSaveModal}
        onClose={() => !isSaving && setOpenSaveModal(false)}
      >
        <Box className="save-modal">
          <h2>Confirm Changes</h2>

          <p className="save-modal-text">
            Enter your password to save changes.
          </p>

          <input
            type="password"
            placeholder="Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isSaving}
          />

          <Button
            variant="contained"
            onClick={() => handleSaveChanges()}
            disabled={!confirmPassword || isSaving}
            className="confirm-save-btn"
          >
            {isSaving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Confirm"
            )}
          </Button>
        </Box>
      </Modal>
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Settings;
