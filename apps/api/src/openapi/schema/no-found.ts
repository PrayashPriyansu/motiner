import { HttpMsg } from 'api/http'
import createMessageObjectSchema from './create-message-object'

const notFoundSchema = createMessageObjectSchema(HttpMsg.NOT_FOUND)

export default notFoundSchema
