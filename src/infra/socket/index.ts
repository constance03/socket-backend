import { Server } from 'socket.io'
import { createServer } from 'http'
import app from '../http'

import { getAllServicesHandler } from '../../modules/services/socket/handlers/getAllServices'
import { receiveServiceHandler } from '../../modules/services/socket/handlers/receiveServicesHandler'
import { acceptServiceHandler } from '../../modules/services/socket/handlers/acceptServiceHandler'
import { allocateServiceHandler } from '../../modules/services/socket/handlers/allocateServiceHandler'

const socketServer = createServer(app)
const io = new Server(socketServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

const nsp = io.of('/HAC')

nsp.on('connection', (socket) => {
    console.log('Cliente conectado ao namespace HAC:', socket.id)

    // External Handlers
    getAllServicesHandler(socket)
    allocateServiceHandler(socket)

    // Core Handlers
    socket.on('receive_service', (data) => receiveServiceHandler(socket, data))
    socket.on('accept_service', (id) => acceptServiceHandler(socket, id))
})

socketServer.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`)
})
