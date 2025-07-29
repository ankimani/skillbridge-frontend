// src/services/authService.js
export const loginUser = async (username, password) => {
    const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8089";
    const loginUrl = `${BACKEND_BASE_URL}/api/v1/auth/login`;
    const profileUrl = `${BACKEND_BASE_URL}/api/v1/users/me`;

    try {
        // Step 1: Login and get JWT token
        const loginResponse = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
            // Extract the customerMessage from the error response
            const errorMessage = loginData.headers?.customerMessage || "Login failed";
            throw new Error(errorMessage);
        }

        const token = loginData.body.data;

        // Step 2: Use token to get user profile
        const profileResponse = await fetch(profileUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!profileResponse.ok) {
            throw new Error("Failed to fetch user profile");
        }

        const userData = await profileResponse.json();
        return {
            token,
            user: userData.body.data
        };
    } catch (error) {
        console.error("Auth error:", error);
        throw error;
    }
};