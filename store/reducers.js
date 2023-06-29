import Course from "../models/course"
import Announcement from '../models/announcement'
import Cls from '../models/class'
import Notif from '../models/notification'
import Assignment from "../models/assignment"
import { ADD_ANNOUNCEMENT, ADD_ASSIGNMENT, ADD_ATTENDANCE, ADD_EXAM, ADD_HW, ADD_TOPIC, DELETE_TOPIC, LOGOUT_fun, MARK_TOPIC_COMPLETE, REMOVE_ANNOUNCEMENT, REMOVE_ASSIGNMENT, REMOVE_EXAM, REMOVE_HW, RESULT, SET_DATA, SET_USER, SUBMIT_ASSIGNMENT, UPDATE_EXAM, UPDATE_TOPIC,UPDATE_HW, SEND_RESPONSE, INQUIRY,NOTIF,START_TOPIC,ADD_CHAPTER,UPDATE_CHAPTER,DELETE_CHAPTER } from "./actions"

const initialState = {
    user:{id: '',name:'',email:'',phone:'',category:'',joiningDate:'',img:'',iid:'',iname:'',token:'',fbID:''},
    students:[],
    subjects:[],
    attendance:[],
    classes: [],
    announcements:[],
    notifications:[],
    assignments:[],
    result:[],
    timetable: [],
    assignment_submissions:[],
    session:{id:'',name:''},
    type:'',
    homework:[],
    inquiries:[],teacher_attendance:[]
}

export default (state=initialState, action)=>{
    switch (action.type){
        case LOGOUT_fun:
            let us = {id: '',name:'',email:'',phone:'',category:'',joiningDate:'',img:'',iid:'',iname:''}
            return{...state,user:us}
        case SET_USER:
            let user = action.data
            let subj = action.subjects
            let cls1 = action.classes
            let u = state.user
            u.id = user.id
            u.name = user.name
            u.email = user.email
            u.phone = user.phone
            u.category = user.category
            u.joiningDate = user.joiningDate
            u.img = user.img_url
            u.iid = user.instituteID
            u.iname = user.iname
            u.token = user.token
            u.fbID = user.fbID
            let chaps = action.chapters.filter(e=>e.instituteID == user.instituteID)
            let tops = action.topics.filter(e=>e.instituteID == user.instituteID)
            let cls = cls1.map(c=>new Cls(c.id,c.name))
            let s = subj.map(c=>{
                let chap = chaps.filter(e=>e.subjectID == c.id)
                chap.sort(function(a,b){
                    let c1 = a.count
                    let c2 = b.count
                    return c1 - c2
                })
                let chapters = []
                chap.forEach(c=>{
                    let {name,count,id} = c
                    let topics = tops.filter(e=>e.chapterID === c.id)
                    topics.sort(function(a,b){
                        let d1 = a.count
                        let d2 = b.count
                        return d1 - d2
                    })
                    let obj = {id,count,name,topics}
                    chapters.push(obj)
                })
                return new Course(c.id,c.name,'',c.class_id,chapters)})
            return{...state,user: u,classes:cls,subjects:s}
        case MARK_TOPIC_COMPLETE:
            let {subject_id,topic_id,date,chapter_id} = action
            let sub = state.subjects
            s = sub.find(e=>e.id == subject_id)
            let chps = s.chapters.find(e=>e.id === chapter_id)
            let topics = chps.topics
            let i = topics.findIndex(e=>e.id == topic_id)
            topics[i].status = 'complete'
            topics[i].completedOn = date
            return{...state,subjects: sub}
        case START_TOPIC:
            subject_id = action.subject_id
            topic_id = action.topic_id
            chapter_id = action.chapter_id
            sub = state.subjects
            s = sub.find(e=>e.id == subject_id)
            chps = s.chapters.find(e=>e.id === chapter_id)
            topics = chps.topics
            i = topics.findIndex(e=>e.id == topic_id)
            topics[i].status = 'current'
            return{...state,subjects: sub}
        case DELETE_TOPIC:
            subject_id = action.subject_id
            topic_id = action.topic_id
            sub = state.subjects
            chapter_id = action.chapter_id
            s = sub.findIndex(e=>e.id == subject_id)
            let c = sub[s].chapters.findIndex(e=>e.id == chapter_id)
            sub[s].chapters[c].topics = sub[s].chapters[c].topics.filter(e=>e.id != topic_id)
            return{...state,subjects:sub}
        case UPDATE_TOPIC:
            subject_id = action.subject_id
            topic_id = action.topic_id
            chapter_id = action.chapter_id
            let t_name = action.name
            let t_count = action.count
            sub = state.subjects
            s = sub.find(e=>e.id == subject_id)
            chps = s.chapters.find(e=>e.id === chapter_id)
            topics = chps.topics
            i = topics.findIndex(e=>e.id == topic_id)
            topics[i].name = t_name
            topics[i].count = t_count
            return{...state,subjects: sub}
        case ADD_TOPIC:
            let obj = action.data
            sub = state.subjects
            let {chapterID} = obj
            subjectID = obj.subjectID
            s = sub.findIndex(e=>e.id == subjectID)
            let topic = {name:obj.name,id:obj.id,status:'pending',completedOn:'',date:obj.date,count:obj.count}
            let ci = sub[s].chapters.findIndex(e=>e.id === chapterID)
            chps = sub[s].chapters.find(e=>e.id === chapterID)
            topics = chps.topics
            sub[s].chapters[ci].topics = topics.concat(topic)
            return{...state,subjects: sub}
        case SET_DATA:
            let iid = state.user.iid
            let t_id = state.user.id
            let ans = action.announcements.filter(e=>e.teacherID == t_id && e.instituteID == iid)
            let notifs = action.notifications.filter(e=>(e.to == 'Teachers' || e.to == 'Everyone') && e.instituteID == iid)
            let assingments = action.assignments
            let assignment_submissions = action.assignment_submissions
            let dsfkjsdl = action.attendance
            let {inquiries,teacher_attendance,timetable} = action
            let result = action.results
            let ass = assingments.map(obj=>new Assignment(obj.id,obj.title,obj.description,obj.submissionDate,obj.createdOn,obj.subjectID,obj.submitted))
            let students = action.students
            let itype = action.itype
            cls = state.classes
            let st = []
            cls.forEach(e=>{
                st = students.filter(c=>c.classId == e.id)
            })
            let ses = action.session
            let sesID = ses.id
            let sesName = ses.title
            let session = {id:sesID,name:sesName}
            st = st.sort(
                (p1, p2) => (p1.rollNo > p2.rollNo) ? 1 : (p1.rollNo < p2.rollNo) ? -1 : 0)
            let anmts = ans.map(e=> new Announcement(e.id,e.title,e.date,e.classes,e.text))
            let ntf = notifs.map(e=>new Notif(e.id,e.title,e.text,e.date))
            let periods = [{day:'Monday',subjects:[]},{day:'Tuesday',subjects:[]},{day:'Wednesday',subjects:[]},{day:'Thursday',subjects:[]},{day:'Friday',subjects:[]},{day:'Saturday',subjects:[]},]
            sub = state.subjects
            let hw_data = action.homework
            let hw_array = []
            let inq_data = []
            if(sub){
                sub.forEach(s=>{
                    let sid = s.id
                    let obj = hw_data.filter(e=>e.subjectID == sid)
                    let obj1 = inquiries.filter(e=>e.subjectID == sid)
                    obj.forEach(o=>{
                        let {id,title,description,date,subjectID} = o
                        let ob = {id,title,description,date,subjectID}
                        hw_array.push(ob)
                    })
                    obj1.forEach(o=>{
                        let {id,title,inquiry,status,date,response,studentID,subjectID} = o
                        let ob = {id,title,inquiry,status,date,response,studentID,subjectID}
                        inq_data.push(ob)
                    })
                })
            }
            timetable.forEach(e=>{
                let {period,time,subjects,class_id,days} = e
                let isCls = cls.filter(c=>c.id == class_id)
                if(isCls.length > 0){
                    days.forEach(d=>{
                        if(d.subject){
                            let day = d.name
                            let subID = d.subject
                            let tchr_array = subjects.find(s=>s.subjectID == subID)
                            let tchrID = tchr_array.teacher
                            let substitute = tchr_array.substitute
                            let subj = sub.find(e=>e.id == subID)
                            if(subj){
                                if(tchrID == t_id){
                                    let pr = periods.find(p=>p.day == day)
                                    pr.subjects.push({period,time,subjectID:subID,teacherID:tchrID,substitute})
                                }
                            }
                        }
                    })
                }
            })
            return{...state,announcements:anmts,notifications:ntf,assignments:ass,timetable:periods,students:st,attendance:dsfkjsdl,assignment_submissions,result,session,type:itype,homework:hw_array,inquiries:inq_data,teacher_attendance}
        case RESULT:
            obj = action.obj
            id = obj.id
            res = obj.result
            let kdfksd = state.result
            ind = kdfksd.findIndex(e=>e.id == id)
            kdfksd[ind].result = res
            return {...state,result:kdfksd}
        case REMOVE_ANNOUNCEMENT:
            id = action.id
            ans = state.announcements
            let a = ans.filter(e=>e.id !== id)
            return{...state,announcements:a}
        case REMOVE_ASSIGNMENT:
            id = action.id
            ans = state.assignments
            a = ans.filter(e=>e.id !== id)
            return{...state,assignments:a} 
        case SUBMIT_ASSIGNMENT:
            data = action.data
            assignment_submissions = state.assignment_submissions.concat(data)
            return{...state,assignment_submissions}
        case ADD_ANNOUNCEMENT:
            let data = action.data
            ans = state.announcements
            let new_ans = new Announcement(data.id,data.title,data.date,data.classes,data.text)
            ans = ans.concat(new_ans)
            return{...state,announcements:ans}
        case ADD_ASSIGNMENT:
            obj = action.obj
            let new_ass = new Assignment(obj.id,obj.title,obj.description,obj.submissionDate,obj.createdOn,obj.subjectID,obj.submitted)
            ans = state.assignments.concat(new_ass)
            return{...state,assignments:ans}
        case ADD_ATTENDANCE:
            let {attendance,classID,today} = action
            let attn = state.attendance.concat({date:today,classID,attendance})
            return{
                ...state,attendance:attn
            }
        case ADD_EXAM:
            data = action.data
            data = {...data,result:null}
            let res = state.result.concat(data)
            return{...state,result:res}
        case REMOVE_EXAM:
            let ID = action.id
            res = state.result.filter(e=>e.id == ID)
            return{...state,result:res}
        case UPDATE_EXAM:
            let id = action.data.id
            let {title,type,marksType,maxMarks,examDate,subjectID} = action.data
            c = state.result
            let ind = c.findIndex(e=>e.id == id)
            c[ind].title = title
            c[ind].type = type
            c[ind].marksType = marksType
            c[ind].maxMarks = maxMarks
            c[ind].examDate = examDate
            c[ind].subjectID = subjectID
            return{...state,result:c}
        case ADD_HW:
            data = action.data
            data = {...data}
            let homework = state.homework.concat(data)
            return{...state,homework}
        case REMOVE_HW:
            ID = action.id
            homework = state.homework.filter(e=>e.id == ID)
            return{...state,homework}
        case UPDATE_HW:
            let ad = action.data
            id = ad.id
            title = ad.title
            description = ad.description
            let hw = state.homework
            ind = hw.findIndex(e=>e.id == id)
            hw[ind].title = title
            hw[ind].description = description
            return{...state,homework:hw}
        case SEND_RESPONSE:
            id = action.id
            let {note} = action
            let q = state.inquiries
            ind = q.findIndex(e=>e.id == id)
            q[ind].status = 'responded'
            q[ind].response = note
            return{...state,inquiries:q}
        case INQUIRY:
            let inq = action.data
            q = state.inquiries.concat(inq)
            return{...state,inquiries:q}
        case NOTIF:
            inq = action.data
            let notif = new Notif(inq.id,inq.title,inq.text,inq.date)
            q = state.notifications.concat(notif)
            return{...state,notifications:q}
        case DELETE_CHAPTER:
            subject_id = action.subject_id
            chapter_id = action.chapter_id
            sub = state.subjects
            s = sub.findIndex(e=>e.id === subject_id)
            sub[s].chapters = sub[s].chapters.filter(e=>e.id !== chapter_id)
            return{...state,subjects:sub}
        case UPDATE_CHAPTER:
            subject_id = action.subject_id
            chapter_id = action.chapter_id
            let c_name = action.name
            let {count} = action
            sub = state.subjects
            let si = sub.findIndex(e=>e.id == subject_id)
            ci = sub[si].chapters.findIndex(e=>e.id == chapter_id)
            sub[si].chapters[ci].count = count
            sub[si].chapters[ci].name = c_name
            return{...state,subjects: sub}
        case ADD_CHAPTER:
            obj = action.data
            sub = state.subjects
            let s_id = action.subject_id
            s = sub.findIndex(e=>e.id == s_id)
            chaps = sub[s].chapters
            sub[s].chapters = chaps.concat(obj)
            return{...state,subjects: sub}
    }
    return state
}