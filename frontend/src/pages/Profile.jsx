import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "../CreateProfileForm.css";
import DeleteForm from '../components/DeleteForm';
import PetPhoto from '../components/PetPhoto';

const Profile = ({backendURL}) => {
    const [profiles, setProfiles] = useState([]);
    const [calorieGoals, setCalorieGoals] = useState({});
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
            
            if (profiles) {
                profiles.forEach(profile => {
                    fetchGoal(profile.profile_id);
                });
            }

        } catch (error) {
            // If the API call fails, print the error to the console
            console.log(error);
        }
    };

    const fetchGoal = async (id) => {
        try {
            const res = await fetch(`${backendURL}/api/daily-goal/${id}`);
            const data = await res.json();
            // Store the goal in the calorieGoals state object keyed by pet ID
            setCalorieGoals(prev => ({ ...prev, [id]: data.daily_target }));
        } catch (error) {
            console.log(`Error fetching calorie goal for ID ${id}:`, error);
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
                        <PetPhoto 
                            profileId={profile.profile_id} 
                            backendURL={backendURL} 
                            defaultImage={DEFAULT_PET_IMAGE} 
                        />
                        
                        <div className="pet-info-main">
                            <h3 className="pet-name-title">
                                {profile.name} <span className={`gender-icon ${profile.gender.toLowerCase()}`}>
                                                {profile.gender.toLowerCase() === 'girl' ? '♀' : '♂'}</span>
                            </h3>
                          
                            <div className="pet-stats-grid">
                                <span className="stat-label">Age:</span> <span>{profile.age} years old</span>
                                <span className="stat-label">Breed:</span> <span>{profile.breed}</span>
                                <span className="stat-label">Weight:</span> <span>{profile.weight} lb</span>

                                <span className="stat-label">Daily Goal:</span> 
                                <span className="calorie-text">
                                    {calorieGoals[profile.profile_id] ? `${calorieGoals[profile.profile_id]} kcal` : 'Calculating...'}
                                </span>
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