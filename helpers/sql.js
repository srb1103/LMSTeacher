import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('database.db')

export const createTable = ()=>{
    const promise = new Promise((resolve,reject)=>{
        db.transaction(tx=>{
            tx.executeSql(`create table if not exists user (id INTEGER PRIMARY KEY NOT NULL, userID TEXT NOT NULL,name TEXT NOT NULL, img TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL, category TEXT NOT NULL, joiningDate TEXT NOT NULL,iid TEXT NOT NULL,iname TEXT NOT NULL,token TEXT, fbID TEXT)`,
                [],
                ()=>{
                    resolve()
                },
                (_,err)=>{
                    reject(err)
                }
            )
        })
    })
    return promise
}
export const deleteUser = ()=>{
    const promise = new Promise((resolve,reject)=>{
        db.transaction(tx=>{
            tx.executeSql(`drop table user`,
            [],
            ()=>{
                resolve()
            },
            (_,err)=>{
                reject(err)
            })
        })
    })
    return promise
}
export const findUserID = ()=>{
    const promise = new Promise((resolve,reject)=>{
        db.transaction(tx=>{
            tx.executeSql(`select * from user`,
            [],
            (_,result)=>{resolve(result)},
            (_,err)=>{reject(err)}
            )
        })
    })
    return promise
}
export const setTeacher = (t)=>{
    let {id,name,img_url,phone,email,category,joiningDate,instituteID,iname,token,fbID} = t
    const promise = new Promise((resolve,reject)=>{
        db.transaction(tx=>{
            tx.executeSql(`insert into user (userID,name,img,phone,email,category,joiningDate,iid,iname,token,fbID) values (?,?,?,?,?,?,?,?,?,?,?)`,
            [id,name,img_url,phone,email,category,joiningDate,instituteID,iname,token,fbID],
            ()=>{resolve();console.log('done')},
            (_,err)=>{reject(err)}
            )
        })
    })
    return promise
}