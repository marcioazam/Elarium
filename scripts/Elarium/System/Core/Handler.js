import { system } from "@minecraft/server";
import { Logger } from "../Helper/Log.js";
import { Analisys } from "./Analisy.js";
import { EntityWrapper } from "../Class/Entity.js";

const LowMSMax = 5,
  LowMSMin = 3;
const MediumMSMin = 6,
  MediumMSMax = 10;
const AltoMSMin = 11,
  AltoMSMax = 15;
const CriticoMSMin = 16;

const MAX_EXECUTION_TIME = 5000;

// 📊 Armazena tempos médios de execução por função
const executionStats = {};

/**
 * Executa funções de forma segura com retry e timeout
 * @param {Function} func - Função a ser executada
 * @param {number} [maxRetries=1] - Quantidade de tentativas em caso de erro
 * @param {boolean} [debug=false] - Ativa logs detalhados
 * @param  {...any} args - Argumentos da função
 */

export function SafeHandler(
  func,
  maxRetries = 1,
  debug = false,
  ...args
) {
  if (!Verify(func, debug)) return;

  let retries = maxRetries;
  let lastError = null;
  const startTime = Date.now();

  while (retries > 0) {
    let timeout = false;
    const timeoutId = system.runTimeout(() => {
      timeout = true;
      var timeoutMessage = TimeoutMessage(func, debug);
      lastError = new Error(timeoutMessage);
    }, MAX_EXECUTION_TIME / 50);

    try {
      DebugRetry(func, debug);


      func(...args);

      system.clearRun(timeoutId); // Cancela timeout se executou com sucesso
      FinalizeHandler(startTime, func, debug);
      return;
    } catch (error) {
      lastError = error;
      ErrorMessage(error, func);
      retries--;
    } finally {
      system.clearRun(timeoutId);
    }
  }

  ExecutionError(func, maxRetries, lastError);
}

/**
 * Executa funções assíncronas de forma segura com timeout e retry.
 * @param {Function} func - Função assíncrona a ser executada
 * @param {number} [maxRetries=1] - Número máximo de tentativas em caso de erro
 * @param {boolean} [debug=false] - Ativa logs detalhados
 * @param {boolean} [forceSync=false] - Força execução síncrona de funções assíncronas
 * @param  {...any} args - Argumentos da função
 */
export async function SafeAsyncHandler(
  func,
  maxRetries = 1,
  debug = false,
  forceSync = false,
  ...args
) {
  if (!Verify(func, debug)) return;

  let retries = maxRetries;
  let lastError = null;
  const startTime = Date.now();
  let isCompleted = false;

  while (retries > 0) {
    let timeoutId = system.runTimeout(() => {
      if (!isCompleted) {
        var timeoutMessage = TimeoutMessage(func, debug);
        lastError = new Error(timeoutMessage);
      }
    }, MAX_EXECUTION_TIME / 50);

    try {
      DebugRetry(func, debug);
 

      if (forceSync) {
        func(...args);
        isCompleted = true;
        system.clearRun(timeoutId);
        FinalizeHandler(startTime, func, debug);
      } else {
        func(...args)
          .then(() => {
            isCompleted = true;
            system.clearRun(timeoutId);
            FinalizeHandler(startTime, func, debug);
          })
          .catch((error) => {
            lastError = error;
            ErrorMessage(error, func);
            retries--;
          });
      }

      return; // Sai da função imediatamente
    } catch (error) {
      lastError = error;
      ErrorMessage(error, func);
      retries--;
    }
  }

  ExecutionError(func, maxRetries, lastError);
}

// 📊 Registra mensagens de timeout com estatísticas
function TimeoutMessage(func, debug) {
  const text = `${func.name} demorou mais de ${MAX_EXECUTION_TIME}ms!`;
  Logger.timeOut(text);

  if (debug) {
    // Adiciona estatísticas ao log
    if (!executionStats[func.name])
      executionStats[func.name] = { runs: 0, totalTime: 0 };
    executionStats[func.name].runs++;
    executionStats[func.name].totalTime += MAX_EXECUTION_TIME;
  }

  return text;
}

function ErrorMessage(error, func) {
  Logger.error(`Erro na execução de ${func.name}: ${error.message || error}`);
  Logger.error(error.stack);
}

function DebugRetry(func, debug) {
  if (debug) Logger.tryAgain(`Tentativa de execução da função: ${func}`);
}

function Verify(func, debug) {
  if (typeof func !== "function") {
    Logger.error(`Tentativa de executar algo que não é uma função: ${func}`);
    return false;
  }

  if (debug) {
    Analisys.StartBenchmark(func.name);
    Logger.debug(`Iniciando função ${func.name}`);
  }

  return true;
}

function FinalizeHandler(startTime, func, debug) {
  const executionTime = Date.now() - startTime;

  if (debug) {
    // Atualiza estatísticas
    if (!executionStats[func.name])
      executionStats[func.name] = { runs: 0, totalTime: 0 };
    executionStats[func.name].runs++;
    executionStats[func.name].totalTime += executionTime;
  }

  handleExecutionComplete(startTime, func.name, debug);
  if (debug) Logger.sucess(`Finalizando função ${func.name}`);
  if (debug) Analisys.EndBenchmark();
}

function ExecutionError(func, maxRetries, lastError) {
  Logger.error(`${func.name} falhou após ${maxRetries} tentativas!`);
  if (lastError) Logger.error(lastError.stack);
}

function handleExecutionComplete(startTime, funcName, debug) {
  const executionTime = Date.now() - startTime;
  const text = `${funcName} executado em ${executionTime}ms`;

  if (debug) {
    const avgTime = executionStats[funcName]
      ? (
          executionStats[funcName].totalTime / executionStats[funcName].runs
        ).toFixed(2)
      : "N/A";

    text += `- (Média: ${avgTime}ms)`;
  }

  if (executionTime >= LowMSMin && executionTime <= LowMSMax) {
    Logger.executionTime(`🟢 ${text}`);
  } else if (executionTime >= MediumMSMin && executionTime <= MediumMSMax) {
    Logger.executionTime(`🟡 ${text}`);
  } else if (executionTime >= AltoMSMin && executionTime <= AltoMSMax) {
    Logger.executionTime(`🟠 ${text}`);
    Logger.warn(`Tempo de execução alto em ${funcName}!`);
  } else if (executionTime >= CriticoMSMin) {
    Logger.executionTime(`🔴 ${text}`);
    Logger.error(`Tempo de execução crítico em ${funcName}!`);
  } else if (debug) {
    Logger.executionTime(`🟢 ${text}`);
  }
}
