import React, { useEffect, useState } from "react";
import axios from "axios";

function UserInfo() {
    const [userInfo, setUserInfo] = useState(null);
    const [age, setAge] = useState("");
    const [nationality, setNationality] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/auth/userinfo", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserInfo(response.data);
                setAge(response.data.age);
                setNationality(response.data.nationality);
            } catch (err) {
                alert("Unauthorized! Please login.");
            }
        };

        fetchUserInfo();
    }, []);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                "http://localhost:5000/auth/update",
                { age, nationality },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update userInfo with the new values locally
            setUserInfo((prev) => ({
                ...prev,
                age,
                nationality,
            }));

            alert("Profile updated successfully!");
            setIsEditing(false);
        } catch (err) {
            alert("Failed to update profile!");
        }
    };

    return (
        <div>
            <h1>User Info</h1>
            {userInfo ? (
                <div>
                    <p>Username: {userInfo.username}</p>
                    {isEditing ? (
                        <>
                            <p>
                                Age: <input value={age} onChange={(e) => setAge(e.target.value)} />
                            </p>
                            <p>
                                Nationality:{" "}
                                <input
                                    value={nationality}
                                    onChange={(e) => setNationality(e.target.value)}
                                />
                            </p>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <p>Age: {userInfo.age}</p>
                            <p>Nationality: {userInfo.nationality}</p>
                            <button onClick={() => setIsEditing(true)}>Edit</button>
                        </>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default UserInfo;