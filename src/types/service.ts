export type SCService = {
    id?: string
    description?: string | null
    category?: string // Adicionado se você estiver usando categorias para os serviços
    requestTimestamp?: string | Date
    acceptTimestamp?: string | Date | null
    allocatedAgent?: string | null
    patient?: string | null // Agora é opcional e pode ser null
    rating?: number | null
    createAt?: string | Date
    agentFeedback?: string | null
}
