export class Logger {
    static log(message, level, icon) {
        const formattedMessage = `${icon} [${level}] ${message}`;
        console.log(formattedMessage);
        // Opcional: Salve em arquivo
    }

    static error(message) {
        this.log(message, "ERROR", "❌ ");
    }

    static sucess(message) {
        this.log(message, "SUCESS", "✅ ");
    }

    static info(message) {
        this.log(message, "INFO", "ℹ️ ");
    }

    static tryAgain(message) {
        this.tryAgain(message, "TRY AGAIN", "🔄 ");
    }

    static infoMS(message) {
        this.tryAgain(message, "EXECUTION TIME", "");
    }

    static warn(message) {
        this.log(message, "WARNING", "⚠️ ");
    }

    static debug(message) {
        this.log(message, "DEBUG", "🐞 ");
    }

    static timeOut(message) {
        this.log(message, "TIMEOUT", "⏳ ");
    }

    static bench(message) {
        this.log(message, "BENCHMARK", "⏱️ ");
    }
}

// Uso:
// Logger.log("Jogador entrou no jogo", "INFO");
// Logger.error("Erro ao spawnar entidade!");