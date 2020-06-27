// import * as firebaseHelper from 'firebase-functions-helper'
import * as express from 'express'
import { db ,notif } from './main'
const notificationModule = express()

// Add new notification
notificationModule.post('/', async (req, res) => {
    const adminCollection = db.collection('Admin')
    const notificationDocument=adminCollection.doc('Notification');
    const notification= {}
    notification[req.body['uid']]=req.body['token']
    try {
        console.log(notification)
        const ans=await notificationDocument.set(notification,{merge:true})
        console.log(ans)
        res.status(201).send(`added a new notification token`)
    } catch (error) {
        console.log(error)
        res.status(400).send(`Error updating token!`)
    }
})

notificationModule.post('/send/', async (req, res) => {
    const adminCollection = db.collection('Admin')
    const notification= {}
    notification[req.body['uid']]=req.body['token']
    try {
        console.log(notification)
        const notificationDocument=await adminCollection.doc('Notification').get();
        const key=notificationDocument.data()[req.body['uid']]
        const payload = {
            notification: {
              title: 'You have a new follower!',
              body: ` is now following you.`
            //   icon: follower.photoURL
            }
          };
        const ans=await notif.sendToDevice(key,payload)
        res.status(201).send(`added a new notification token ${ans}`)
    } catch (error) {
        console.log(error)
        res.status(400).send(`User does not exist`)
    }
})

export { notificationModule }
