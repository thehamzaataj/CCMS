import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { CircularProgress } from '@mui/material';

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('')
    const [className, setClassName] = useState('')
    const [sclassName, setSclassName] = useState('')
    const [semester, setSemester] = useState('')

    const adminID = currentUser._id
    const role = "Student"

    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id);
        }
    }, [params.id, situation]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const changeHandler = (event) => {
        if (event.target.value === 'Select Class') {
            setClassName('Select Class');
            setSclassName('');
        } else {
            const selectedClass = sclassesList.find(
                (classItem) => classItem.sclassName === event.target.value
            );
            setClassName(selectedClass.sclassName);
            setSclassName(selectedClass._id);
        }
    }

    const validateFields = () => {
        if (!name.trim()) {
            setMessage("Name is required");
            return false;
        }
        if (!rollNum) {
            setMessage("Roll Number is required");
            return false;
        }
        if (!password) {
            setMessage("Password is required");
            return false;
        }
        if (!sclassName) {
            setMessage("Please select a class");
            return false;
        }
        if (!semester) {
            setMessage("Please enter semester");
            return false;
        }
        if (semester < 1 || semester > 8) {
            setMessage("Semester must be between 1 and 8");
            return false;
        }
        return true;
    }

    const submitHandler = (event) => {
        event.preventDefault()
        if (!validateFields()) {
            setShowPopup(true);
            return;
        }

        const fields = { 
            name: name.trim(), 
            rollNum: parseInt(rollNum), 
            password, 
            sclassName, 
            adminID, 
            role,
            semester: parseInt(semester)
        }

        setLoader(true)
        dispatch(registerUser(fields, role))
    }

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl())
            navigate(-1)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <>
            <div className="register">
                <form className="registerForm" onSubmit={submitHandler} style={{backgroundColor: 'white', padding: '34px', borderRadius: '8px',  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'}}>
                    <span className="registerTitle">Add Student</span>
                    <label>Name</label>
                    <input className="registerInput" type="text" placeholder="Enter student's name..."
                        value={name}
                        style={{ border: '1px solid black' }}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name" required />

                    {
                        situation === "Student" &&
                        <>
                            <label>Class</label>
                            <select
                                className="registerInput"
                                value={className}
                                onChange={changeHandler} required>
                                <option value='Select Class'>Select Class</option>
                                {sclassesList.map((classItem, index) => (
                                    <option key={index} value={classItem.sclassName}>
                                        {classItem.sclassName}
                                    </option>
                                ))}
                            </select>
                        </>
                    }

                    <label>Roll Number</label>
                    <input className="registerInput" type="number" placeholder="Enter student's Roll Number..."
                        value={rollNum}
                        style={{ border: '1px solid black' }}
                        onChange={(event) => setRollNum(event.target.value)}
                        min="1"
                        required />
                    
                    <label>Semester</label>
                    <input className="registerInput" type="number" placeholder="Enter student's Semester..."
                        value={semester}
                        style={{ border: '1px solid black' }}
                        onChange={(event) => setSemester(event.target.value)}
                        min="1"
                        max="8"
                        required />

                    <label>Password</label>
                    <input className="registerInput" type="password" placeholder="Enter student's password..."
                        value={password}
                        style={{ border: '1px solid black' }}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength="6"
                        autoComplete="new-password" required />

                    <button className="registerButton" type="submit" disabled={loader}>
                        {loader ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Add'
                        )}
                    </button>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    )
}

export default AddStudent;