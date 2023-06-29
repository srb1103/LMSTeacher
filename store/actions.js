import { fetch_data } from "../firebase-config/functions"
import { createTable, deleteUser } from "../helpers/sql"
export const SET_USER = 'SET_USER'
export const MARK_TOPIC_COMPLETE = 'MARK_TOPIC_COMPLETE'
export const DELETE_TOPIC = 'DELETE_TOPIC'
export const START_TOPIC = 'START_TOPIC'
export const UPDATE_TOPIC = 'UPDATE_TOPIC'
export const ADD_TOPIC = 'ADD_TOPIC'
export const DELETE_CHAPTER = 'DELETE_CHAPTER'
export const UPDATE_CHAPTER = 'UPDATE_CHAPTER'
export const ADD_CHAPTER = 'ADD_CHAPTER'
export const SET_DATA = 'SET_DATA'
export const LOGOUT_fun = 'LOGOUT_fun'
export const RESULT = 'RESULT'
export const REMOVE_ANNOUNCEMENT = 'REMOVE_ANNOUNCEMENT'
export const ADD_ANNOUNCEMENT = 'ADD_ANNOUNCEMENT'
export const ADD_ASSIGNMENT = 'ADD_ASSIGNMENT'
export const UPDATE_ASSIGNMENT = 'UPDATE_ASSIGNMENT'
export const REMOVE_ASSIGNMENT = 'REMOVE_ASSIGNMENT'
export const ADD_EXAM = 'ADD_EXAM'
export const UPDATE_EXAM = 'UPDATE_EXAM'
export const REMOVE_EXAM = 'REMOVE_EXAM'
export const ADD_HW = 'ADD_HW'
export const UPDATE_HW = 'UPDATE_HW'
export const REMOVE_HW = 'REMOVE_HW'
export const ADD_ATTENDANCE = 'ADD_ATTENDANCE'
export const SUBMIT_ASSIGNMENT = 'SUBMIT_ASSIGNMENT'
export const SEND_RESPONSE = 'SEND_RESPONSE'
export const INQUIRY = 'INQUIRY'
export const NOTIF = 'NOTIF'

export const setUID = (id)=>{
    return async dispatch=>{
        let subjects = await fetch_data('subjects')
        let allteachers = await fetch_data('teachers');
        let institutions = await fetch_data('institutions');
        let chapters = await fetch_data('chapters');
        let topics = await fetch_data('topics');
        let classes = await fetch_data('classes');
        let teacher = allteachers.find(e=>e.id == id)
        let iname = institutions.find(e=>e.iid == teacher.instituteID).Name
        let sub = teacher.subjects_allotted
        let s = []
        sub.forEach(e=>{
            s.push(subjects.find(sb=>sb.id == e))
        })
        let cls = []
        s.forEach(a=>{
            let cls_array = a.class_id
            cls_array.forEach(cl=>{
                let i1 = cls.findIndex(i=>i.id == cl)
                if(i1 == -1){
                    let clsID = cl
                    let cl1 = classes.find(e=>e.id == cl)
                    let clsName = cl1 ? cl1.name : ''
                    let obj = {id:clsID,name:clsName}
                    cls.push(obj)
                }
            })
        })
        dispatch({type: SET_USER,data:{...teacher,iname},subjects:s,topics,classes:cls,chapters})
    }
}
export const setData = (iid)=>{
    return async dispatch=>{
        try{
            let assignments = await fetch_data('assignments')
            let institutions = await fetch_data('institutions')
            let sessions = await fetch_data('sessions')
            let assignment_submissions = await fetch_data('assignment-submissions')
            let students = await fetch_data('students')
            let timetable = await fetch_data('timetable')
            let attendance = await fetch_data('attendance')
            let results = await fetch_data('results')
            let homework = await fetch_data('homework')
            let announcements = await fetch_data('teacher-announcements')
            let notifications = await fetch_data('admin-announcements')
            let inquiries = await fetch_data('inquiries');
            let teacher_attendance = await fetch_data('teacher-attendance')
            let it = institutions.find(e=>e.iid == iid)
            let sesID = it.sessionID
            let type = it.type
            students = students.filter(e=>e.instituteID == iid)
            let session = sessions.find(e=>e.id == sesID && e.instituteID == iid)
            homework = homework.filter(e=>e.session == sesID && e.instituteID == iid)
            inquiries = inquiries.filter(e=>e.session == sesID && e.instituteID == iid)
            assignments = assignments.filter(e=>e.iid == iid && e.session == sesID)
            timetable = timetable.filter(e=>e.instituteID == iid && e.session == sesID)
            attendance = attendance.filter(e=>e.instituteID == iid && e.session == sesID)
            teacher_attendance = teacher_attendance.filter(e=>e.instituteID == iid && e.sessionID == sesID)
            results = results.filter(e=>e.instituteID == iid && e.session == sesID)
            announcements = announcements.filter(e=>e.instituteID == iid && e.session == sesID)
            notifications = notifications.filter(e=>e.instituteID == iid && e.session == sesID)
            assignment_submissions = assignment_submissions.filter(e=>e.instituteID == iid)
            dispatch({type: SET_DATA,announcements,notifications,assignments,timetable,students,attendance,assignment_submissions,results,session,itype:type,homework,inquiries,teacher_attendance})
        }catch(err){console.warn(err)}
    }
}
export const markTopicComplete = (subject_id,chapter_id,topic_id,date)=>{
    return async dispatch=>{
        dispatch({type: MARK_TOPIC_COMPLETE,subject_id,chapter_id,topic_id,date})
    }
}
export const startTopicAction = (subject_id,chapter_id,topic_id)=>{
    return async dispatch=>{
        dispatch({type: START_TOPIC,subject_id,chapter_id,topic_id})
    }
}
export const deleteTopic = (subject_id,chapter_id,topic_id)=>{
    return async dispatch=>{
        dispatch({type: DELETE_TOPIC,subject_id,chapter_id,topic_id})
    }
}
export const updateChapter = (subject_id,chapter_id,name,count)=>{
    return async dispatch=>{
        dispatch({type: UPDATE_CHAPTER,subject_id,chapter_id,name,count})
    }
}
export const addNewChapter = (subject_id,data)=>{
    return async dispatch=>{
        dispatch({type: ADD_CHAPTER,subject_id,data})
    }
}
export const deleteChapter = (subject_id,chapter_id)=>{
    return async dispatch=>{
        dispatch({type: DELETE_CHAPTER,subject_id,chapter_id})
    }
}
export const updateTopic = (subject_id,chapter_id,topic_id,name,count)=>{
    return async dispatch=>{
        dispatch({type: UPDATE_TOPIC,subject_id,chapter_id,topic_id,name,count})
    }
}
export const addNewTopic = (data)=>{
    return async dispatch=>{
        dispatch({type: ADD_TOPIC,data})
    }
}
export const deleteAnnouncement = id=>{
    return async dispatch=>{
        dispatch({type:REMOVE_ANNOUNCEMENT,id})
    }
}
export const addNewAnnouncement = data=>{
    return async dispatch=>{
        dispatch({type:ADD_ANNOUNCEMENT,data})
    }
}
export const addAssignment = obj=>{
    return async dispatch=>{
        dispatch({type:ADD_ASSIGNMENT,obj})
    }
}
export const removeAssignment = id=>{
    return async dispatch=>{
        dispatch({type:REMOVE_ASSIGNMENT,id})
    }
}
export const updateAssignment = data=>{
    return async dispatch=>{
        dispatch({type:UPDATE_ASSIGNMENT,data})
    }
}
export const submitAssignmentAction = data=>{
    return async dispatch=>{
        dispatch({type:SUBMIT_ASSIGNMENT,data})
    }
}
export const addAttendace = (classID,data,date)=>{
    return async dispatch=>{
        dispatch({type:ADD_ATTENDANCE,classID,attendance:data,today:date})
    }
}
export const addExam = (data)=>{
    return async dispatch=>{
        dispatch({type:ADD_EXAM,data})
    }
}
export const UpdateExam = (data)=>{
    return async dispatch=>{
        dispatch({type:UPDATE_EXAM,data})
    }
}
export const removeExam = (id)=>{
    return async dispatch=>{
        dispatch({type:REMOVE_EXAM,id})
    }
}
export const addHWAction = (data)=>{
    return async dispatch=>{
        dispatch({type:ADD_HW,data})
    }
}
export const updateHWAction = (data)=>{
    return async dispatch=>{
        dispatch({type:UPDATE_HW,data})
    }
}
export const removeHWAction = (id)=>{
    return async dispatch=>{
        dispatch({type:REMOVE_HW,id})
    }
}
export const addResultData = (obj)=>{
    return async dispatch=>{
        dispatch({type:RESULT,obj})
    }
}
export const addNotif = (obj)=>{
    return async dispatch=>{
        dispatch({type:NOTIF,obj})
    }
}
export const logOUT = (id)=>{
    return async dispatch=>{
        try{
            await deleteUser();
            await createTable();
            dispatch({type:LOGOUT_fun,id})
        }catch(err){console.log(err)}
    }
}
export const respondInquiry = (id,note)=>{
    return async dispatch=>{
        dispatch({type:SEND_RESPONSE,id,note})
    }
}
export const newStudentInquiry = (data)=>{
    return async dispatch=>{
        dispatch({type:INQUIRY,data})
    }
}
