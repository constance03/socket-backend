import { Socket } from 'socket.io'
import db from '../../../..' // Certifique-se de que este é o caminho correto para o seu módulo de banco de dados
import * as dbQueries from '../../../../shared/db/queries'

export const acceptServiceHandler = (socket: Socket, id: string) => {
    dbQueries.acceptService(db, id, socket.id, (err) => {
        if (err) {
            console.error('Erro ao aceitar o serviço:', err)
            socket.emit('error_accepting_service', { error: err.message })
        } else {
            socket.broadcast.emit('service_accepted', { id })

            dbQueries.getServiceById(db, id, (err, service) => {
                if (err) {
                    console.error('Erro ao buscar o serviço:', err)
                    socket.emit('error_fetching_service', {
                        error: err.message
                    })
                } else if (service) {
                    socket.broadcast.emit('service_accepted', service)
                }
            })
        }
    })
}
