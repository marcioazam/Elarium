import { system } from "@minecraft/server";
import { SafeHandler } from './Handler.js';

export class EventQueue {
    constructor(batchSize = 5, handlers = []) {
      this.queue = []; // Fila de eventos
      this.isProcessing = false; // Controle de processamento
      this.batchSize = batchSize; // Tamanho do lote de processamento
      this.handlers = handlers; // Lista de handlers
    }
  
    // Adiciona um evento à fila
    addEvent(event) {
      this.queue.push(event);
      this.processQueue();
    }
  
    // Processa a fila
    processQueue() {
      if (this.isProcessing || this.queue.length === 0) return; // Se já estiver processando ou a fila estiver vazia, retorne
  
      this.isProcessing = true; // Marca como "em processamento"
      const event = this.queue.shift(); // Remove o primeiro evento da fila
  
      let index = 0;
  
      // Intervalo para processar handlers em lotes
      const intervalId = system.runInterval(() => {
        for (let i = 0; i < this.batchSize && index < this.handlers.length; i++, index++) {
          try {
            if (this.shouldSkipEvent(event)) break; // Verifica se o evento deve ser ignorado
            SafeHandler(this.handlers[index], event); // Executa o handler
          } catch (error) {
            console.error(`Erro em ${this.handlers[index].name}:`, error);
          }
        }
  
        // Se todos os handlers foram processados
        if (index >= this.handlers.length) {
          system.clearRun(intervalId); // Interrompe o intervalo
          this.isProcessing = false; // Libera o processamento
          this.processQueue(); // Processa o próximo evento na fila
        }
      }, 1); // Executa a cada 1 tick
    }
  
    // Método para verificar se o evento deve ser ignorado (pode ser sobrescrito)
    shouldSkipEvent(event) {
      // Implementação padrão: não ignora nenhum evento
      return false;
    }
  }