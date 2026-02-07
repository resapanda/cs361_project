import React, { useState } from "react";
import "../CreateProfileForm.css";

const CreatePetForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        gender: "Boy",
        age: "1",
        species: "Dog",
        breed: "Affenpinscher",
        weight: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Saving Pet Profile:", formData);
    };

    return (
        <div className="form-container">
            <h2 className="header-title">Add New Pet Profile</h2>
            <form onSubmit={handleSubmit} className="pet-form">
                <div className="form-content">
                    {/* Left Side: Photo Upload */}
                    <div className="photo-upload-section">
                        <div className="photo-circle">
                            <span>Upload Photo</span>
                        </div>
                    </div>

                    {/* Right Side: Input Fields */}
                    <div className="fields-section">
                        <div className="form-group">
                            <label>Name :</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Gender :</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="Boy">Boy</option>
                                <option value="Girl">Girl</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Age :</label>
                            <select name="age" value={formData.age} onChange={handleChange}>
                                {[...Array(30).keys()].map((n) => (
                                  <option key={n + 1} value={n + 1}>{n + 1}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Species :</label>
                            <select name="species" value={formData.species} onChange={handleChange}>
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Breed :</label>
                            <select name="breed" value={formData.breed} onChange={handleChange}>
                                <option value="Affenpinscher">Affenpinscher</option>
                                <option value="Labrador">Labrador</option>
                                <option value="Poodle">Poodle</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Weight :</label>
                            <div className="input-with-unit">
                                <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
                                <span className="unit-label">lb</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className="save-btn">Save Profile</button>
            </form>
        </div>
    );
};

export default CreatePetForm;