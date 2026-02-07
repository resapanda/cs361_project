import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "../CreateProfileForm.css";
import DeleteForm from '../components/DeleteForm';

const Profile = ({backendURL}) => {
    const [profiles, setProfiles] = useState([]);
    const DEFAULT_PET_IMAGE = "/images/placeholder.png";

    const getData = async function () {
        try {
            const currentUserId = localStorage.getItem('userId');
            // Make a GET request to the backend
            const response = await fetch(`${backendURL}/profile/${currentUserId}`);
            
            // Convert the response into JSON format
            const {profiles} = await response.json();

            // Update the profiles state with the response data
            setProfiles(profiles || []);
            
        } catch (error) {
            // If the API call fails, print the error to the console
            console.log(error);
        }
    };

    // Load table on page load
    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="main-card">
            <div className="header-container">
                <h2 className="section-header">Pet Profiles</h2>
                <Link to="/add-profile" className="add-pet-btn" style={{ textDecoration: 'none' }}>
                    + Add Pet
                </Link>
            </div>

            <div className="profile-list">
                {profiles.map((profile, index) => (
                    <div key={index} className="pet-profile-card">
                        <img src={profile.photo_url || DEFAULT_PET_IMAGE} alt={profile.name} className="profile-img-large" />
                        
                        <div className="pet-info-main">
                            <h3 className="pet-name-title">
                                {profile.name} <span className={`gender-icon ${profile.gender.toLowerCase()}`}>
                                                {profile.gender.toLowerCase() === 'girl' ? '♀' : '♂'}</span>
                            </h3>
                          
                            <div className="pet-stats-grid">
                                <span className="stat-label">Age:</span> <span>{profile.age} years old</span>
                                <span className="stat-label">Breed:</span> <span>{profile.breed}</span>
                                <span className="stat-label">Weight:</span> <span>{profile.weight} lb</span>
                            </div>
                          
                            <div className="card-actions">
                                <button className="action-btn edit">Edit</button>
                                <DeleteForm rowObject={profile} idColumnName="profile_id" idKey="delete_profile_id" endpoint="/profile/delete" backendURL={backendURL} refresh={getData} messageType="profile" buttonType="button" />
                            </div>                          
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Profile;