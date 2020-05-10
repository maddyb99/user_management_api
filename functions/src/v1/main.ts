import * as express from 'express'
import { userModule } from './user'
import * as functions from 'firebase-functions'
import * as utils from './utils'

const apiInternal = express()
const version = '/api/v1'

const userApi = utils.registerModule('/user', userModule)

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

export { apiInternal,apiKey }