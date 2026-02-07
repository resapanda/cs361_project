import React, { useState, useEffect } from "react";
import CreateDailyCheckInForm from "../components/CreateDailyCheckInForm";
import CreateVetRecordForm from "../components/CreateVetRecordForm";
import "../CreateHealthForm.css";

function AddHealth({ backendURL }) {
    const [profiles, setProfiles] = useState([]);
    const [activeTab, setActiveTab] = useState("checkin");

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const currentUserId = localStorage.getItem('userId');
                const response = await fetch(`${backendURL}/profile/${currentUserId}`);
                const data = await response.json();
                setProfiles(data.profiles || []);
            } catch (err) {
                console.error("Failed to fetch profiles:", err);
            }
        };
        fetchProfiles();
    }, [backendURL]);

    return (
        <div className="main-card-2">
            <div className="tab-container">
                <button 
                    className={`tab ${activeTab === "checkin" ? "active" : "inactive"}`}
                    onClick={() => setActiveTab("checkin")}
                >
                    Add New Daily Check-In
                </button>
                <button 
                    className={`tab ${activeTab === "vet" ? "active" : "inactive"}`}
                    onClick={() => setActiveTab("vet")}
                >
                    Add New Vet Record
                </button>
            </div>

            <div className="form-content-area">
                {activeTab === "checkin" ? (
                    <CreateDailyCheckInForm profiles={profiles} backendURL={backendURL} />
                ) : (
                    <CreateVetRecordForm profiles={profiles} backendURL={backendURL} />
                )}
            </div>
        </div>
    )
} export default AddHealth;