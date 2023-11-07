import sqlite3 from 'sqlite3'
import { SCService } from '../../types/service'
import { v4 as uuid } from 'uuid'

export const getAllServices = (
    db: sqlite3.Database,
    callback: (err: Error | null, rows?: any) => void
) => {
    db.all('SELECT id, allocatedAgent, description, category, patient, requestTimestamp, acceptTimestamp, rating, createAt, agentFeedback FROM ISCServiceView', [], callback)
}

export const insertService = (
    db: sqlite3.Database,
    data: Partial<SCService>,
    callback: (err: Error | null, insertedService: SCService | null) => void
) => {
    const { description, category, requestTimestamp, patient, createAt } = data

    const id = uuid() // Generate a UUID for the new service id.

    db.run(
        `INSERT INTO ISCServiceView (id, allocatedAgent, description, category, patient, requestTimestamp, acceptTimestamp, rating, createAt, agentFeedback) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            null, // allocatedAgent is null initially
            description,
            category, // Assuming 'category' is a string or null.
            patient,
            requestTimestamp ? new Date(requestTimestamp).toISOString() : null, // Convert to ISO string if not null.
            null, // acceptTimestamp is null initially
            null, // rating is null initially
            createAt ? new Date(createAt).toISOString() : null, // Convert to ISO string if not null.
            null // agentFeedback is null initially
        ],
        function (err) {
            if (err) {
                callback(err, null); // Handle the error and return null for the insertedService.
            } else {
                // Service inserted successfully, now fetch the inserted service by its ID.
                db.get(
                    'SELECT * FROM ISCServiceView WHERE id = ?',
                    [id],
                    (err, row) => {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, row as any); // Return the inserted service in the callback.
                        }
                    }
                );
            }
        }
    );
};


export const acceptService = (
    db: sqlite3.Database,
    id: string,
    agentId: string,
    callback: (err: Error | null, row?: any) => void
) => {
    const acceptTimestamp = new Date().toISOString()
    db.run(
        'UPDATE ISCServiceView SET acceptTimestamp = ?, allocatedAgent = ? WHERE id = ?',
        [acceptTimestamp, agentId, id],
        callback
    )
}

export const allocateServiceToAgent = (
    db: sqlite3.Database,
    serviceId: string,
    agentId: string,
    callback: (err: Error | null) => void
) => {
    db.run(
        'UPDATE ISCServiceView SET allocatedAgent = ? WHERE id = ?',
        [agentId, serviceId],
        callback
    )
}

export const getServiceById = (
    db: sqlite3.Database,
    serviceId: string,
    callback: (err: Error | null, row?: any) => void
) => {
    db.get('SELECT * FROM ISCServiceView WHERE id = ?', [serviceId], callback)
}
