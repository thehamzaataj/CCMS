import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userRelated/userSlice';
import { studentReducer } from './studentRelated/studentSlice';
import { sclassReducer } from './sclassRelated/sclassSlice';
import { subjectReducer } from './subjectRelated/subjectSlice';
import { noticeReducer } from './noticeRelated/noticeSlice';
import { teacherReducer } from './teacherRelated/teacherSlice';
import { complainReducer } from './complainRelated/complainSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        student: studentReducer,
        sclass: sclassReducer,
        subject: subjectReducer,
        notice: noticeReducer,
        teacher: teacherReducer,
        complain: complainReducer
    },
});

export default store;
