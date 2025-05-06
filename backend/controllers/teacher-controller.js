const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');

const teacherRegister = async (req, res) => {
    const { name, email, password, role, school, teachSubject, teachSclass } = req.body;
    try {
        // Check if teacher with email already exists
        const existingTeacherByEmail = await Teacher.findOne({ email });
        if (existingTeacherByEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Check if subject already has a teacher
        const subjectWithTeacher = await Subject.findOne({ _id: teachSubject, teacher: { $exists: true } });
        if (subjectWithTeacher) {
            return res.status(400).json({ message: 'Subject already has a teacher assigned' });
        }

        // Create new teacher
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const teacher = new Teacher({ 
            name, 
            email, 
            password: hashedPass, 
            role, 
            school, 
            teachSubject, 
            teachSclass 
        });

        // Save teacher and update subject
        const result = await teacher.save();
        await Subject.findByIdAndUpdate(teachSubject, { teacher: result._id });
        
        // Remove password from response
        result.password = undefined;
        
        // Send success response with teacher data
        res.status(201).json({ 
            message: 'Teacher registered successfully',
            teacher: result,
            school: school // Include school in response
        });
    } catch (err) {
        console.error('Teacher registration error:', err);
        res.status(500).json({ 
            message: 'Error registering teacher',
            error: err.message 
        });
    }
};

const teacherLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find teacher by email
        const teacher = await Teacher.findOne({ email });
        
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, teacher.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Populate references
        const populatedTeacher = await Teacher.findById(teacher._id)
            .populate('school', 'schoolName')
            .populate('teachSubject', 'subName sessions')
            .populate('teachSclass', 'sclassName');

        // Convert to plain object and remove sensitive data
        const teacherData = populatedTeacher.toObject();
        delete teacherData.password;

        // Send success response
        res.status(200).json({
            ...teacherData,
            role: "Teacher"
        });

    } catch (err) {
        console.error('Teacher login error:', err);
        res.status(500).json({ 
            message: "Error during login",
            error: err.message 
        });
    }
};

const getTeachers = async (req, res) => {
    try {
        let teachers = await Teacher.find({ school: req.params.id })
            .populate("teachSubject", "subName")
            .populate("teachSclass", "sclassName");
        if (teachers.length > 0) {
            let modifiedTeachers = teachers.map((teacher) => {
                return { ...teacher._doc, password: undefined };
            });
            res.send(modifiedTeachers);
        } else {
            res.send({ message: "No teachers found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await Teacher.findById(req.params.id)
            .populate("teachSubject", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclass", "sclassName")
        if (teacher) {
            teacher.password = undefined;
            res.send(teacher);
        }
        else {
            res.send({ message: "No teacher found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateTeacherSubject = async (req, res) => {
    const { teacherId, teachSubject } = req.body;
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { teachSubject },
            { new: true }
        );

        await Subject.findByIdAndUpdate(teachSubject, { teacher: updatedTeacher._id });

        res.send(updatedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

        if (!deletedTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Remove teacher reference from subjects
        await Subject.updateMany(
            { teacher: deletedTeacher._id },
            { $unset: { teacher: 1 } }
        );

        res.status(200).json({ message: "Teacher deleted successfully", deletedTeacher });
    } catch (error) {
        res.status(500).json({ message: "Error deleting teacher", error: error.message });
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ school: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            return res.status(404).json({ message: "No teachers found to delete" });
        }

        // Remove teacher references from all subjects
        await Subject.updateMany(
            { school: req.params.id },
            { $unset: { teacher: 1 } }
        );

        res.status(200).json({ 
            message: "Teachers deleted successfully", 
            deletedCount 
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting teachers", error: error.message });
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ teachSclass: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            return res.status(404).json({ message: "No teachers found to delete" });
        }

        // Remove teacher references from subjects in this class
        await Subject.updateMany(
            { sclassName: req.params.id },
            { $unset: { teacher: 1 } }
        );

        res.status(200).json({ 
            message: "Teachers deleted successfully", 
            deletedCount 
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting teachers", error: error.message });
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass
};