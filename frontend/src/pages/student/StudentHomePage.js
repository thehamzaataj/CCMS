import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getNotices } from "../../redux/noticeRelated/noticeHandle";
import { getSubjects } from "../../redux/subjectRelated/subjectHandle";
import { getStudentDetails } from "../../redux/studentRelated/studentHandle";
import { Paper, Box, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';

const StudentHomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { studentDetails, loading, error } = useSelector((state) => state.student);
    const { noticesList } = useSelector((state) => state.notice);
    const { subjectsList } = useSelector((state) => state.subject);

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getStudentDetails(currentUser._id));
            dispatch(getNotices(currentUser._id));
            dispatch(getSubjects(currentUser._id));
        }
    }, [currentUser?._id, dispatch]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            Welcome, {studentDetails?.name || 'Student'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Roll Number: {studentDetails?.rollNum}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Class: {studentDetails?.sclassName?.sclassName || 'N/A'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Semester: {studentDetails?.semester || 'N/A'}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Recent Notices
                        </Typography>
                        {noticesList?.length > 0 ? (
                            noticesList.map((notice) => (
                                <Card key={notice._id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">{notice.title}</Typography>
                                        <Typography variant="body2">{notice.details}</Typography>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography>No notices available</Typography>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Your Subjects
                        </Typography>
                        <Grid container spacing={2}>
                            {subjectsList?.length > 0 ? (
                                subjectsList.map((subject) => (
                                    <Grid item xs={12} sm={6} md={4} key={subject._id}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6">{subject.subName}</Typography>
                                                <Typography variant="body2">
                                                    Teacher: {subject.teacher?.name || 'N/A'}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Typography>No subjects available</Typography>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StudentHomePage;