import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DeleteForm from '../components/DeleteForm';
import RecordDetailPopup from '../components/RecordDetailPopup';
import "../CreateHealthForm.css";

const Health = ({ backendURL }) => {
    const [dailyCheckins, setDailyCheckins] = useState([]);
    const [vetRecords, setVetRecords] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [selectedPet, setSelectedPet] = useState("");

    const [viewingRecord, setViewingRecord] = useState(null);
    const [viewType, setViewType] = useState('');

    const handleOpenDetails = (record, type) => {
        setViewingRecord(record);
        setViewType(type);
    };

    const getData = async function () {
        try {
            const currentUserId = localStorage.getItem('userId');
            const response = await fetch(`${backendURL}/health/${currentUserId}`);
            if (!response.ok) return console.error("Health fetch failed");

            const { dailyCheckIns, profiles, vetRecords } = await response.json();
            setDailyCheckins(dailyCheckIns || []);
            setProfiles(profiles || []);
            setVetRecords(vetRecords || []); 
        } catch (error) {
              console.log(error);
        }
    };

    useEffect(() => { getData(); }, []);

    return (
        <div className="main-card">
            <div className="header-container">
                <h2 className="section-header">Health Record</h2>
                <Link to="/add-health" className="add-pet-btn" style={{ textDecoration: 'none' }}>
                    + Add New
                </Link>
            </div>

            <div className="health-main-content">
                <div className="pet-filter-sidebar">
                    <div className="pet-badge">
                        <select 
                            value={selectedPet} 
                            onChange={(e) => setSelectedPet(e.target.value)}
                            className="pet-dropdown-inline"
                        >
                            <option value="">All Pets</option>
                            {profiles.map(p => <option key={p.profile_id} value={p.profile_id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="health-dashboard-grid">
                    {/* Daily Check-In Column */}
                    <div className="record-column">
                        <div className="column-header blue">Daily Check-In Records</div>
                        <div className="records-list">
                            {dailyCheckins
                                .filter(record => !selectedPet || record.profile_id == selectedPet)
                                .map((record, index) => (
                                <div  
                                    key={index} 
                                    className="record-card pointer" 
                                    onClick={() => handleOpenDetails(record, 'daily_checkin')}
                                  >
                                    <div className="record-icons" onClick={(e) => e.stopPropagation()}>
                                        <span className="edit-icon">✎</span>
                                        <DeleteForm rowObject={record} idColumnName="daily_checkin_id" idKey="delete_daily_checkin_id" endpoint="/daily_checkin/delete" backendURL={backendURL} refresh={getData} messageType="daily_checkin" buttonType="icon" />
                                    </div>
                                    <p><strong>Date:</strong> {record.date ? record.date.split('T')[0] : 'n/a'}</p>
                                    <p><strong>Mood:</strong> {record.mood}</p>
                                    <p><strong>Symptoms:</strong> {record.symptoms || 'n/a'}</p>
                                </div>
                            ))}
                        </div>
                        <button className="view-more-btn">View More</button>
                    </div>

                    {/* Vet Records Column */}
                    <div className="record-column">
                        <div className="column-header blue">Vet Records</div>
                        <div className="records-list">
                            {vetRecords
                                .filter(record => !selectedPet || record.profile_id == selectedPet)
                                .map((record, index) => (
                                <div 
                                    key={index} 
                                    className="record-card pointer" 
                                    onClick={() => handleOpenDetails(record, 'vet_record')}
                                >
                                    <div className="record-icons" onClick={(e) => e.stopPropagation()}>
                                      <span className="edit-icon">✎</span>
                                      <DeleteForm rowObject={record} idColumnName="vet_record_id" idKey="delete_vet_record_id" endpoint="/vet_record/delete" backendURL={backendURL} refresh={getData} messageType="vet_record" buttonType="icon" />
                                    </div>
                                    <p><strong>Date:</strong> {record.date ? record.date.split('T')[0] : 'n/a'}</p>
                                    <p><strong>Clinic:</strong> {record.clinic}</p>
                                    <p><strong>Diagnosis:</strong> {record.diagnosis || 'n/a'}</p>
                                </div>
                            ))}
                        </div>
                        <button className="view-more-btn">View More</button>
                    </div>
                </div>
            </div>

            {/* Detailed View Popup */}
            <RecordDetailPopup 
                isOpen={!!viewingRecord} 
                onClose={() => setViewingRecord(null)} 
                record={viewingRecord}
                type={viewType}
            />
        </div>
    );
};
export default Health;