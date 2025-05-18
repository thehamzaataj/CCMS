import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Box, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styled from 'styled-components';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { GreenButton } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';

const defaultTheme = createTheme();

const AddClass = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const { loading, error, response } = useSelector(state => state.user);

    const [sclassName, setSclassName] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!sclassName.trim()) {
            setMessage('Please enter a class name');
            setShowPopup(true);
            return;
        }

        const fields = {
            sclassName,
            adminID: currentUser._id
        };

        try {
            await dispatch(addStuff(fields, "Sclass"));
            if (!error) {
                navigate("/Admin/classes");
            }
        } catch (error) {
            setMessage('Failed to add class. Please try again.');
            setShowPopup(true);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container maxWidth="sm">
                <StyledPaper elevation={3}>
                    <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                        Add New Class
                    </Typography>
                    
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            fullWidth
                            label="Class Name"
                            variant="outlined"
                            value={sclassName}
                            onChange={(e) => setSclassName(e.target.value)}
                            placeholder="e.g., BSSE-4-A"
                            helperText="Enter class name in format: Program-Year-Section (e.g., BSSE-4-A)"
                            sx={{ mb: 3 }}
                        />

                        <ButtonContainer>
                            <GreenButton
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{ minWidth: '200px' }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Class'}
                            </GreenButton>
                        </ButtonContainer>
                    </Box>
                </StyledPaper>
            </Container>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );
};

const StyledPaper = styled(Paper)`
    padding: 2rem;
    margin-top: 2rem;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 2rem;
`;

export default AddClass;