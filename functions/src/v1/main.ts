import * as express from 'express'
import { userModule } from './user'
import * as admin from 'firebase-admin'
import { notificationModule } from './notification'
import * as functions from 'firebase-functions'
import * as utils from './utils'


admin.initializeApp(functions.config().firebase)

const db = admin.firestore()
// const updatedb=admin.firestore
const notif=admin.messaging()
const auth=admin.auth()

const apiInternal = express()
const version = '/api/v1'

const userApi = utils.registerModule('/user', userModule)
const notificationApi = utils.registerModule('/notification', notificationModule)

const apiKey = functions.config().video_call_api.client_key;
const authMiddleware = function (req: any, res: any, next: any) {
  if (req.headers.authorization !== apiKey) {
    return res.status(403).json({ error: 'Unauthorized request!$' });
  }
  next();
  return null;
}

apiInternal.use(authMiddleware)
apiInternal.use(version, userApi)
apiInternal.use(version, notificationApi)

export { apiInternal,apiKey,db,notif,auth }