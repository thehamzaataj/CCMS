import { Container, Grid, Paper } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);

    const { currentUser } = useSelector(state => state.user)

    const adminID = currentUser._id

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} lg={4}>
                        <StyledPaper elevation={3}>
                            <ImageContainer>
                                <img src={Students} alt="Students" />
                            </ImageContainer>
                            <Title>
                                Total Students
                            </Title>
                            <Data start={0} end={numberOfStudents} duration={2.5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <StyledPaper elevation={3}>
                            <ImageContainer>
                                <img src={Classes} alt="Classes" />
                            </ImageContainer>
                            <Title>
                                Total Classes
                            </Title>
                            <Data start={0} end={numberOfClasses} duration={5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <StyledPaper elevation={3}>
                            <ImageContainer>
                                <img src={Teachers} alt="Teachers" />
                            </ImageContainer>
                            <Title>
                                Total Teachers
                            </Title>
                            <Data start={0} end={numberOfTeachers} duration={2.5} />
                        </StyledPaper>
                    </Grid>
                    {/* <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src={Fees} alt="Fees" />
                            <Title>
                                Fees Collection
                            </Title>
                            <Data start={0} end={23000} duration={2.5} prefix="$" />                        </StyledPaper>
                    </Grid> */}
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <SeeNotice />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

const StyledPaper = styled(Paper)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 250px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageContainer = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Title = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
  margin: 8px 0;
  color: #333;
`;

const Data = styled(CountUp)`
  font-size: 2rem;
  font-weight: bold;
  color: #2e7d32;
  margin-top: 8px;
`;

export default AdminHomePage