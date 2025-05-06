import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';

const StudentMarks = () => {
    const { currentUser, userDetails } = useSelector((state) => state.user);
    const [examResult, setExamResult] = useState([]);

    useEffect(() => {
        if (userDetails) {
            setExamResult(userDetails.examResult || []);
        }
    }, [userDetails]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Exam Results
            </Typography>
            {examResult && examResult.length > 0 ? (
                <Box>
                    {examResult.map((result, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="h6">
                                {result.subName.subName}: {result.marksObtained}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography variant="h6">No exam results found</Typography>
            )}
        </Box>
    );
};

export default StudentMarks; 