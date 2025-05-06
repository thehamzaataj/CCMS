import axios from "axios";
import { fetchStart, fetchSuccess, fetchFailure } from "./subjectSlice";

export const getSubjects = (id) => async (dispatch) => {
    dispatch(fetchStart());
    try {
        const { data } = await axios.get(`/api/Subject/Student/${id}`);
        if (data) {
            dispatch(fetchSuccess(data));
        }
    } catch (error) {
        dispatch(fetchFailure(error.response?.data?.message || "Failed to fetch subjects"));
    }
}; 