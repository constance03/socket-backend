import { Socket } from 'socket.io'
import db from '../../../..'
import * as dbQueries from '../../../../shared/db/queries'

export const allocateServiceHandler = (socket: Socket) => {
    socket.on('allocate_service', (serviceId, agentId: string) => {
        dbQueries.allocateServiceToAgent(db, serviceId, agentId, (err) => {
            if (err) {
                console.error('Erro ao alocar serviço:', err)
                socket.emit('error_allocating_service', {
                    error: err.message,
                    serviceId
                })
                return
            }

            dbQueries.getServiceById(db, serviceId, (err, service) => {
                if (err) {
                    console.error('Erro ao obter serviço:', err)
                    socket.emit('error_fetching_service', {
                        error: err.message,
                        serviceId
                    })
                    return
                }

                if (service) {
                    socket.broadcast.emit('service_allocated', service)
                } else {
                    console.error(
                        'Serviço não encontrado após alocação:',
                        serviceId
                    )
                    socket.emit('service_not_found', { serviceId })
                }
            })
        })
    })
}
