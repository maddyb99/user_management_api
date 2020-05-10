import * as firebaseHelper from 'firebase-functions-helper'
import * as express from 'express'
import { db } from '../index'
// import { admin } from 'firebase-admin/lib/database';
// import * from admin
// import { apiKey } from './main';
const admin= require('firebase-admin');

class User {
    constructor(
        public name: String = '',
        public mobile: number = 0,
        public uid: string = '',
        public profilePic: String =''
    ) { }
}

const userReqValidator = (arr: any[], target: any[]) => arr.every(v => target.includes(v)) && !('uid' in arr);
const userCollection = 'Users'
const userKeys = Object.keys(new User())
const userModule = express()
// const request = require('request-promise');

// Add new user
userModule.post('/', async (req, res) => {
    const exist=await firebaseHelper.firestore.checkDocumentExists(db,userCollection,req.body['uid'])
    if(exist===true)
    {
        res.status(403).send(`Forbidden! User already exists`)
        return
    }
    try {
        // Manual body serialization
        // TODO: Do something about this
        const user: User = {
            name: req.body['name'],
            mobile: Number(req.body['mobile']),
            uid: req.body['uid'],
            profilePic: req.body['profilePic']
        }
        const newDoc = await firebaseHelper.firestore
            .createDocumentWithID(db, userCollection, user.uid, user)
        res.status(201).send(`Created a new user: ${newDoc}`)
    } catch (error) {
        res.status(400).send(`User should only contains firstName, lastName and email!`)
    }
})

// Update new user
userModule.patch('/:userId', async (req, res) => {
    const reqKeys = Object.keys(req.body)
    if (!userReqValidator(reqKeys, userKeys)) {
        res.status(400).send('Invalid request body!')
        return
    }
    if (req.body['uid']!==req.params.userId) {
        res.status(403).send('Forbidden request!')
        return
    }

    const updatedDoc = await firebaseHelper.firestore
        .updateDocument(db, userCollection, req.params.userId, req.body)
    res.status(204).send(`Update a new user: ${updatedDoc}`)
})

// View a user
userModule.get('/:userId', async (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, userCollection, req.params.userId)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get user: ${error}`))
})

userModule.get('/exist/:mobile',async(req,res)=>{
    admin.auth().getUserByPhoneNumber(req.params.mobile).then(function(userRecord){
console.log('exists')
res.status(200).send('User exists')
    }).catch(function(error){
        console.log('does not exists')
        
res.status(400).send('User does not exists')

    })
})

// View all users
userModule.get('/', (req, res) => {
    firebaseHelper.firestore
        .backup(db, userCollection)
        .then(data => {
            const _data = Object(data)[userCollection]
            return res.status(200).send(Object.keys(_data).map(key => _data[key]))
        })
        .catch(error => res.status(400).send(`Cannot get users: ${error}`))
})

// Delete a user
userModule.delete('/:userId', async (req, res) => {
    const exist=await firebaseHelper.firestore.checkDocumentExists(db,userCollection,req.params.userId)
    if(exist){
        // const user = await firebaseHelper.firestore.getDocument(db,userCollection,req.params.userId)
        // const events=user['events']
        // Object.values(events).forEach(async (element) => {
        //     console.log(element)
        //     var options={
        //         method: 'DELETE',
        //         uri: `https://the-angel-bridge.firebaseapp.com/api/v1/event/${element}`,
        //         headers: {
        //             authorization:apiKey
        //             /* 'content-type': 'application/x-www-form-urlencoded' */ // Is set automatically
        //         },
        //         family: 4
        //     }
        //     await request(options)
        //         .then(function (body:any) {
        //             console.log(body)
        //         })
        //         .catch(function (err:any) {
        //             res.status(400).send(`Error deleting events:${element}:${err}`)
        //             return
        //         });
        // });
        const deletedUser = await firebaseHelper.firestore
            .deleteDocument(db, userCollection, req.params.userId)
        res.status(204).send(`User is deleted: ${deletedUser}`)
    }

    else
        res.status(400).send('Event does not exist')
})

export { userModule }
