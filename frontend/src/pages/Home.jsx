import React, { useState, useEffect } from 'react';
import WelcomePopup from '../components/WelcomePopup';
import PetPhoto from '../components/PetPhoto';

const Home = ({ backendURL }) => {
    const DEFAULT_PET_IMAGE = "/images/placeholder.png";
    const [profiles, setProfiles] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [formData, setFormData] = useState({
        mood: 'Neutral',
        morning: false,
        treat: false,
        night: false,
        pee: false,
        poop: false
    });

    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await fetch(`${backendURL}/home/${userId}`);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Server returned an error page instead of JSON:", errorText);
                    return;
                }

                const data = await response.json();
              
                if (data.profiles && data.profiles.length > 0) {
                    setProfiles(data.profiles);
                    setSelectedPet(data.profiles[0]); 
                }  else {
                    setShowWelcome(true);
                }
            } catch (err) {
                console.error("Home data fetch failed", err);
            }
        };
        fetchHomeData();
    }, [backendURL]);

    const handlePetChange = (e) => {
        const pet = profiles.find(p => p.profile_id === parseInt(e.target.value));
        setSelectedPet(pet);
    };

    const handleSaveCheckIn = async () => {
        try {
            const response = await fetch(`${backendURL}/home/quick-checkin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pet_id: selectedPet.profile_id,
                    date: new Date().toISOString().split('T')[0],
                    mood: formData.mood,
                    food_morning: formData.morning,
                    food_treat: formData.treat,
                    food_night: formData.night,
                    toilet_pee: formData.pee,
                    toilet_poop: formData.poop
                }),
            });
          if (response.ok) alert(`Check-in saved for ${selectedPet.name}!`);
        } catch (err) {
            console.error("Save failed", err);
        }
    };

    return (
        <div className="home-main-card">
            <div className="header-container">
                <h2 className="section-header">Home</h2>
            </div>
            {selectedPet ? (
                <div className="home-content">
                    <div className="pet-selector">
                        <div className="pet-badge">
                            <select onChange={handlePetChange} value={selectedPet.profile_id} className="pet-dropdown-inline">
                                {profiles.map(p => <option key={p.profile_id} value={p.profile_id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="profile-brief-card">
                        <PetPhoto 
                            profileId={selectedPet.profile_id} 
                            backendURL={backendURL} 
                            defaultImage={DEFAULT_PET_IMAGE} 
                        />
                        <div className="profile-details">
                            <h3>{selectedPet.name}</h3>
                            <p>Weight: {selectedPet.weight} lb</p>
                            <p>Breed: {selectedPet.breed}</p>
                        </div>
                    </div>

                    {/* Quick Check-In Form */}
                    <div className="short-checkin-card">
                        <div className="checkin-header">
                            <span className="checkin-title">Quick Daily Check-In</span>
                            <div className="mood-btns small">
                                {['Bad', 'Neutral', 'Good'].map(m => (
                                <button 
                                    key={m}
                                    className={`mood-btn ${m.toLowerCase()} ${formData.mood === m ? 'selected' : ''}`}
                                    onClick={() => setFormData({...formData, mood: m})}
                                >
                                    {m}
                                </button>
                                ))}
                            </div>
                        </div>

                        <div className="checkin-row">
                            <span className="row-label">Food:</span>
                            <label>Morning <input type="checkbox" checked={formData.morning} onChange={e => setFormData({...formData, morning: e.target.checked})} /></label>
                            <label>Treat <input type="checkbox" checked={formData.treat} onChange={e => setFormData({...formData, treat: e.target.checked})} /></label>
                            <label>Night <input type="checkbox" checked={formData.night} onChange={e => setFormData({...formData, night: e.target.checked})} /></label>
                        </div>

                        <div className="checkin-row">
                            <span className="row-label">Toilet:</span>
                            <label>Pee <input type="checkbox" checked={formData.pee} onChange={e => setFormData({...formData, pee: e.target.checked})} /></label>
                            <label>Poop <input type="checkbox" checked={formData.poop} onChange={e => setFormData({...formData, poop: e.target.checked})} /></label>
                            <button className="save-btn small-right" onClick={handleSaveCheckIn}>Save Check-In</button>
                        </div>
                    </div>
                </div>
                ) : (
                    <div className="home-content">
                        <p>No pet profiles found. "Add Pet" to get started!</p>
                    </div>
                )}
                <WelcomePopup
                isOpen={showWelcome} 
                onClose={() => setShowWelcome(false)} 
                />
        </div>
    );
};
export default Home;