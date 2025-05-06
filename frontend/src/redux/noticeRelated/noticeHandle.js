import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    noticesList: [],
    loading: false,
    error: null,
    response: null,
};

export const getNotices = (id, address) => async (dispatch) => {
    dispatch(fetchStart());
    try {
        const { data } = await axios.get(`/api/Notice/${address}/${id}`);
        if (data) {
            dispatch(fetchSuccess(data));
        }
    } catch (error) {
        dispatch(fetchFailure(error.response?.data?.message || "Failed to fetch notices"));
    }
};

export const getAllNotices = (id, address) => async (dispatch) => {
    dispatch(fetchStart());
    try {
        const { data } = await axios.get(`/api/Notice/${address}List/${id}`);
        if (data) {
            dispatch(fetchSuccess(data));
        }
    } catch (error) {
        dispatch(fetchFailure(error.response?.data?.message || "Failed to fetch notices"));
    }
};

const noticeSlice = createSlice({
    name: "notice",
    initialState,
    reducers: {
        fetchStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchSuccess: (state, action) => {
            state.loading = false;
            state.noticesList = action.payload;
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

export const { fetchStart, fetchSuccess, fetchFailure, clearResponse } = noticeSlice.actions;
export default noticeSlice.reducer;