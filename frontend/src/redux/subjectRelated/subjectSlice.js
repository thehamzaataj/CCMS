import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    subjectsList: [],
    subjectDetails: null,
    loading: false,
    error: null,
    response: null,
};

const subjectSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {
        fetchStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchSuccess: (state, action) => {
            state.loading = false;
            state.subjectsList = action.payload;
            state.error = null;
        },
        fetchSubjectDetails: (state, action) => {
            state.loading = false;
            state.subjectDetails = action.payload;
            state.error = null;
        },
        fetchFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearResponse: (state) => {
            state.response = null;
        },
    },
});

export const {
    fetchStart,
    fetchSuccess,
    fetchSubjectDetails,
    fetchFailure,
    clearResponse
} = subjectSlice.actions;

export const subjectReducer = subjectSlice.reducer;
export default subjectSlice.reducer; 