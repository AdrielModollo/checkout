import { createLogger, transports, format } from 'winston';

export const logger = createLogger({
    level: 'info', // Define o nível de log
    format: format.combine(
        format.timestamp(), // Adiciona um timestamp ao log
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // Exibe os logs no console
        new transports.File({ filename: 'logs/app.log' }), // Salva logs em um arquivo
    ],
});
