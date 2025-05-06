import axios from "axios";
import { fetchStart, fetchSuccess, fetchFailure, fetchStudentDetails } from './studentSlice';

export const getAllStudents = (adminID) => async (dispatch) => {
    dispatch(fetchStart());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Student/${adminID}`);
        if (result.data) {
            // Ensure we're dispatching an array
            const studentsList = Array.isArray(result.data) ? result.data : 
                               result.data.students ? result.data.students : [];
            dispatch(fetchSuccess(studentsList));
        } else {
            dispatch(fetchFailure("No data found"));
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        dispatch(fetchFailure(error.response?.data?.message || "Failed to fetch students"));
    }
};

export const getStudentDetails = (studentID) => async (dispatch) => {
    dispatch(fetchStart());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Student/details/${studentID}`);
        if (result.data) {
            dispatch(fetchStudentDetails(result.data));
        } else {
            dispatch(fetchFailure("No data found"));
        }
    } catch (error) {
        console.error('Error fetching student details:', error);
        dispatch(fetchFailure(error.response?.data?.message || "Failed to fetch student details"));
    }
};

export const updateStudentFields = (id, fields) => async (dispatch) => {
    dispatch(fetchStart());
    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/Student/${id}`, fields);
        if (result.data) {
            dispatch(fetchSuccess(result.data));
        }
    } catch (error) {
        console.error('Error updating student:', error);
        dispatch(fetchFailure(error.response?.data?.message || "Failed to update student"));
    }
};

export const removeStuff = (id, address) => async (dispatch) => {
    dispatch(fetchStart());
    try {
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data) {
            dispatch(fetchSuccess(result.data));
        }
    } catch (error) {
        console.error('Error removing student:', error);
        dispatch(fetchFailure(error.response?.data?.message || "Failed to remove student"));
    }
};