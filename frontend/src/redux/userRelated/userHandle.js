import axios from 'axios';
import {
    authRequest,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
} from './userSlice';

export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        console.log('Attempting login with:', { ...fields, role });
        
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${role}Login`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        
        console.log('Login response:', result.data);
        
        if (result.data.role) {
            // Handle successful login
            const userData = {
                ...result.data,
                role: role // Ensure role is set correctly
            };
            console.log('Dispatching success with:', userData);
            dispatch(authSuccess(userData));
        } else if (result.data.message) {
            // Handle error message
            console.log('Login failed with message:', result.data.message);
            dispatch(authFailed(result.data.message));
        } else {
            console.log('Login failed with no specific message');
            dispatch(authFailed("Login failed. Please try again."));
        }
    } catch (error) {
        console.error('Login error:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorMessage = error.response.data.message || "Login failed";
            console.log('Server error response:', error.response.data);
            dispatch(authFailed(errorMessage));
        } else if (error.request) {
            // The request was made but no response was received
            console.log('No response received from server');
            dispatch(authFailed("No response from server. Please check your connection."));
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Request setup error:', error.message);
            dispatch(authFailed("An error occurred. Please try again."));
        }
    }
};

export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        // Ensure all required fields are present
        if (role === "Student") {
            if (!fields.name || !fields.rollNum || !fields.password || !fields.sclassName || !fields.adminID || !fields.semester) {
                dispatch(authFailed("All fields are required"));
                return;
            }
        }

        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${role}Reg`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (result.data.message) {
            // Handle error messages from the server
            dispatch(authFailed(result.data.message));
        } else if (result.data.schoolName) {
            // Handle admin registration success
            dispatch(authSuccess(result.data));
        } else if (result.data.school && result.data.teacher) {
            // Handle teacher registration success
            dispatch(stuffAdded(result.data));
        } else if (result.data.name && result.data.rollNum) {
            // Handle student registration success
            dispatch(stuffAdded(result.data));
        } else {
            dispatch(authFailed("Registration failed. Please try again."));
        }
    } catch (error) {
        console.error('Registration error:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorMessage = error.response.data.message || "Registration failed";
            dispatch(authFailed(errorMessage));
        } else if (error.request) {
            // The request was made but no response was received
            dispatch(authFailed("No response from server. Please check your connection."));
        } else {
            // Something happened in setting up the request that triggered an Error
            dispatch(authFailed("An error occurred. Please try again."));
        }
    }
};

export const logoutUser = () => (dispatch) => {
    dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}

export const deleteUser = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getDeleteSuccess());
        }
    } catch (error) {
        dispatch(getError(error));
    }
}


// export const deleteUser = (id, address) => async (dispatch) => {
//     dispatch(getRequest());
//     dispatch(getFailed("Sorry the delete function has been disabled for now."));
// }

export const updateUser = (fields, id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.schoolName) {
            dispatch(authSuccess(result.data));
        }
        else {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}

export const addStuff = (fields, address) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${address}Create`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded(result.data));
        }
    } catch (error) {
        dispatch(authError(error));
    }
};