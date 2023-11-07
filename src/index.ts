require('dotenv').config()
import sqlite3 from 'sqlite3'

const DATABASE_NAME = process.env.DATABASE_NAME || 'database.db'

const db = new sqlite3.Database(DATABASE_NAME, handleConnection)

function handleConnection(err: any) {
    if (err) {
        console.error('Erro ao conectar com o banco de dados:', err)
        process.exit(1)
    } else {
        console.log('Conectado ao banco de dados SQLite')
        createTable()
    }
}

function createTable() {
    db.run(
        `CREATE TABLE IF NOT EXISTS ISCServiceView (
            id TEXT PRIMARY KEY,
            allocatedAgent TEXT,
            description TEXT,
            category TEXT,
            patient TEXT,
            requestTimestamp TEXT,
            acceptTimestamp TEXT,
            rating INTEGER,
            createAt TEXT,
            agentFeedback TEXT
        )`,
        handleTableCreation
    )
}

function handleTableCreation(err: Error) {
    if (err) {
        console.error('Erro ao criar a tabela:', err)
        process.exit(1)
    } else {
        import('./infra/socket/index')
    }
}

export default db
