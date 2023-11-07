import { Socket } from 'socket.io'
import db from '../../../..'
import * as dbQueries from '../../../../shared/db/queries'

export const getAllServicesHandler = (socket: Socket) => {
    dbQueries.getAllServices(db, (err, rows) => {
        if (err) {
            console.error('Error fetching all services:', err)
            socket.emit('error_fetching_services', { error: err.message })
            return
        }
        console.log(rows)
        socket.emit('services_list', rows)
    })
}
