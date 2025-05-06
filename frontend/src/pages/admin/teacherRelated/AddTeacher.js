import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress } from '@mui/material';

const AddTeacher = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subjectID = params.id

  const { status, response, error } = useSelector(state => state.user);
  const { subjectDetails } = useSelector((state) => state.sclass);

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
  }, [dispatch, subjectID]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false)

  const role = "Teacher"
  const school = subjectDetails && subjectDetails.school
  const teachSubject = subjectDetails && subjectDetails._id
  const teachSclass = subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName._id

  const fields = { name, email, password, role, school, teachSubject, teachSclass }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitHandler = (event) => {
    event.preventDefault()
    setEmailError('');
    setMessage('');

    if (!name || !email || !password) {
      setMessage("Please fill in all fields")
      setShowPopup(true)
      return
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!school || !teachSubject || !teachSclass) {
      setMessage("Missing required information. Please try again.")
      setShowPopup(true)
      return
    }

    setLoader(true)
    dispatch(registerUser(fields, role))
  }

  useEffect(() => {
    if (status === 'added') {
      setMessage("Teacher registered successfully!")
      setShowPopup(true)
      setTimeout(() => {
        dispatch(underControl())
        navigate("/Admin/teachers")
      }, 2000)
    }
    else if (status === 'failed') {
      if (response && response.includes("already exists")) {
        setEmailError("Email already exists. Please use a different email.");
      } else {
        setMessage(response || "Failed to add teacher")
        setShowPopup(true)
      }
      setLoader(false)
    }
    else if (status === 'error') {
      setMessage("Network Error. Please check your connection and try again.")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <div>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Add Teacher</span>
          <br />
          <label>
            Subject : {subjectDetails && subjectDetails.subName}
          </label>
          <label>
            Class : {subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName}
          </label>
          <label>Name</label>
          <input className="registerInput" type="text" placeholder="Enter teacher's name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name" required />

          <label>Email</label>
          <input 
            className={`registerInput ${emailError ? 'error' : ''}`} 
            type="email" 
            placeholder="Enter teacher's email..."
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError('');
            }}
            autoComplete="email" 
            required 
          />
          {emailError && <span className="error-message">{emailError}</span>}

          <label>Password</label>
          <input className="registerInput" type="password" placeholder="Enter teacher's password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password" required />

          <button className="registerButton" type="submit" disabled={loader}>
            {loader ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  )
}

export default AddTeacher