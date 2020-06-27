import * as functions from 'firebase-functions'
import { apiInternal as apiV1 } from './v1/main'
const webAppV1 = functions.https.onRequest(apiV1)

export { webAppV1 }