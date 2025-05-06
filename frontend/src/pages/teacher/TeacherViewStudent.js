import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { Box, Typography } from '@mui/material';

const TeacherViewStudent = () => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const params = useParams();
    const [examResult, setExamResult] = useState([]);

    useEffect(() => {
        dispatch(getUserDetails(params.id, "Student"));
    }, [dispatch, params.id]);

    useEffect(() => {
        if (userDetails) {
            setExamResult(userDetails.examResult || []);
        }
    }, [userDetails]);

    return (
        <Box sx={{ p: 3 }}>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <>
                    <Typography variant="h4" gutterBottom>
                        Student Details
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Name: {userDetails?.name}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Roll Number: {userDetails?.rollNum}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Class: {userDetails?.sclassName?.sclassName}
                    </Typography>
                    {/* <Typography variant="h5" gutterBottom>
                        School: {userDetails?.school?.schoolName}
                    </Typography> */}
                </>
            )}
        </Box>
    );
};

export default TeacherViewStudent;