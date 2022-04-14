import { storage } from '@vulcan/utils'
import { APPID } from '@/constant'

storage.setPrefix(`${APPID}:`)

export default storage
