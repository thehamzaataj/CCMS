import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress, MenuItem, Select, FormControl, InputLabel} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bgpic from "../../assets/designlogin.jpg"
import { LightPurpleButton } from '../../components/buttonStyles';
import { registerUser, fetchAllAdmins } from '../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import styled from 'styled-components';
// import Popup from '../../components/Popup';

const defaultTheme = createTheme();

const StudentRegisterPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, currentUser, response, error, currentRole, userDetails, loading } = useSelector(state => state.user);
    const { sclassesList, loading: loadingClasses } = useSelector((state) => state.sclass);

    const [toggle, setToggle] = useState(false)
    const [loader, setLoader] = useState(false)
    // const [showPopup, setShowPopup] = useState(false);
    // const [message, setMessage] = useState("");
    const [school, setSchool] = useState('');
    const [schools, setSchools] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [classes, setClasses] = useState([]);
    const [selectedAdminId, setSelectedAdminId] = useState('');

    const [passwordError, setPasswordError] = useState(false);
    const [studentNameError, setStudentNameError] = useState(false);
    const [rollNumError, setRollNumError] = useState(false);
    const [cgpaError, setCgpaError] = useState(false);
    const [schoolError, setSchoolError] = useState(false);
    const [classError, setClassError] = useState(false);
    const role = "Student"

    useEffect(() => {
        dispatch(fetchAllAdmins());
    }, [dispatch]);

    useEffect(() => {
        if (userDetails && Array.isArray(userDetails)) {
            // Store both school name and ID
            const schoolOptions = userDetails.map(admin => ({
                name: admin.schoolName,
                id: admin._id
            })).filter(school => school.name);
            
            if (schoolOptions.length > 0) {
                setSchools(schoolOptions);
                // If there's only one school, select it automatically
                if (schoolOptions.length === 1) {
                    setSchool(schoolOptions[0].id);
                    setSelectedAdminId(schoolOptions[0].id);
                    dispatch(getAllSclasses(schoolOptions[0].id, "Sclass"));
                }
            } else {
                // setMessage('Welcome to the Registration Page');
                // setShowPopup(true);
            }
        }
    }, [userDetails, dispatch]);

    useEffect(() => {
        if (school) {
            // Find the selected school object
            const selectedSchool = schools.find(s => s.id === school);
            if (selectedSchool) {
                setSelectedAdminId(selectedSchool.id);
                dispatch(getAllSclasses(selectedSchool.id, "Sclass"));
            }
        }
    }, [school, schools, dispatch]);

    useEffect(() => {
        if (sclassesList && Array.isArray(sclassesList)) {
            setClasses(sclassesList);
        }
    }, [sclassesList]);

    useEffect(() => {
        if (error) {
            // const errorMessage = typeof error === 'string' ? error : 'An error occurred. Please try again.';
            // setMessage(errorMessage);
            // setShowPopup(true);
        }
    }, [error]);

    useEffect(() => {
        if (status === 'success') {
            // Reset all form fields
            setSchool('');
            setSelectedClass('');
            setClasses([]);
            setSelectedAdminId('');
            // Redirect to login page
            navigate('/Studentlogin', { replace: true });
        }
        else if (status === 'failed') {
            setLoader(false);
        }
        else if (status === 'error') {
            setLoader(false);
        }
    }, [status, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoader(true);

        const name = event.target.studentName.value;
        const password = event.target.password.value;
        const rollNum = event.target.rollNum.value;
        const cgpa = parseFloat(event.target.cgpa.value);

        // Validate CGPA
        if (cgpa > 2.0) {
            // setMessage('Only Probationary Students are allowed to register');
            // setShowPopup(true);
            setCgpaError(true);
            setLoader(false);
            return;
        }

        if (!name || !password || !rollNum || !cgpa || !school || !selectedClass) {
            if (!name) setStudentNameError(true);
            if (!password) setPasswordError(true);
            if (!rollNum) setRollNumError(true);
            if (!cgpa) setCgpaError(true);
            if (!school) setSchoolError(true);
            if (!selectedClass) setClassError(true);
            setLoader(false);
            return;
        }

        // Find the selected class object to get its ID
        const selectedClassObj = classes.find(c => c.sclassName === selectedClass);
        if (!selectedClassObj) {
            // setMessage('Invalid class selection');
            // setShowPopup(true);
            setLoader(false);
            return;
        }

        // Verify school exists
        const selectedSchool = schools.find(s => s.id === school);
        if (!selectedSchool) {
            // setMessage('Selected school not found');
            // setShowPopup(true);
            setLoader(false);
            return;
        }

        const fields = { 
            name, 
            password, 
            rollNum, 
            cgpa, 
            school: selectedSchool.id,
            sclassName: selectedClassObj._id,
            role: "Student" 
        };

        try {
            await dispatch(registerUser(fields, "Student"));
        } catch (error) {
            // setMessage('Registration failed. Please try again.');
            // setShowPopup(true);
        } finally {
            setLoader(false);
        }
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'password') setPasswordError(false);
        if (name === 'studentName') setStudentNameError(false);
        if (name === 'rollNum') setRollNumError(false);
        if (name === 'cgpa') setCgpaError(false);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
                            Student Register
                        </Typography>
                        <Typography variant="h7">
                            Register as a Student to access your academic information.
                            <br />
                            View your attendance, marks, and stay updated with school notices.
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="studentName"
                                label="Name *"
                                name="studentName"
                                autoComplete="name"
                                autoFocus
                                error={studentNameError}
                                helperText={studentNameError && 'Name is required'}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="rollNum"
                                label="Roll Number *"
                                name="rollNum"
                                error={rollNumError}
                                helperText={rollNumError && 'Roll Number is required'}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="cgpa"
                                label="Enter Your SGPA"
                                name="cgpa"
                                type="number"
                                inputProps={{ 
                                    min: 0,
                                    max: 2.0,
                                    step: "0.01"
                                }}
                                error={cgpaError}
                                helperText={cgpaError ? 'SGPA must be between 0 and 2.0' : 'SGPA is required (0-2.0)'}
                                onChange={handleInputChange}
                            />
                            <FormControl fullWidth margin="normal" error={schoolError}>
                                <InputLabel id="school-label">School *</InputLabel>
                                <Select
                                    labelId="school-label"
                                    id="school"
                                    value={school}
                                    label="School *"
                                    onChange={(e) => {
                                        setSchool(e.target.value);
                                        setSchoolError(false);
                                        setSelectedClass(''); // Reset class when school changes
                                        setClasses([]); // Reset classes when school changes
                                    }}
                                >
                                    {loading ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={20} />
                                            Loading schools...
                                        </MenuItem>
                                    ) : schools.length === 0 ? (
                                        <MenuItem disabled>No schools available</MenuItem>
                                    ) : (
                                        schools.map((schoolOption) => (
                                            <MenuItem key={schoolOption.id} value={schoolOption.id}>
                                                {schoolOption.name}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                                {schoolError && <Typography color="error" variant="caption">School is required</Typography>}
                            </FormControl>
                            <FormControl fullWidth margin="normal" error={classError}>
                                <InputLabel id="class-label">Class *</InputLabel>
                                <Select
                                    labelId="class-label"
                                    id="class"
                                    value={selectedClass}
                                    label="Class *"
                                    onChange={(e) => {
                                        setSelectedClass(e.target.value);
                                        setClassError(false);
                                    }}
                                    disabled={!school || loadingClasses}
                                >
                                    {loadingClasses ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={20} />
                                            Loading classes...
                                        </MenuItem>
                                    ) : classes.length === 0 ? (
                                        <MenuItem disabled>No classes available</MenuItem>
                                    ) : (
                                        classes.map((classItem) => (
                                            <MenuItem key={classItem._id} value={classItem.sclassName}>
                                                {classItem.sclassName}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                                {classError && <Typography color="error" variant="caption">Class is required</Typography>}
                            </FormControl>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password *"
                                type={toggle ? 'text' : 'password'}
                                id="password"
                                autoComplete="new-password"
                                error={passwordError}
                                helperText={passwordError && 'Password is required'}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)}>
                                                {toggle ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                            </Grid>
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loader}
                            >
                                {loader ? <CircularProgress size={24} color="inherit"/> : "Register"}
                            </LightPurpleButton>
                            <Grid container>
                                <Grid>
                                    Already have an account?
                                </Grid>
                                <Grid item sx={{ ml: 2 }}>
                                    <StyledLink to="/Studentlogin">
                                        Log in
                                    </StyledLink>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </Grid>
            {/* <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} /> */}
        </ThemeProvider>
    );
}

export default StudentRegisterPage;

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
`;
