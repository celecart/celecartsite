type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = import.meta.env.MODE !== 'production';
const enableDebug = isDev || import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true';

const prefixArgs = (level: LogLevel, args: unknown[]) => {
  const ts = new Date().toISOString();
  return [`[${ts}] [${level.toUpperCase()}]`, ...args];
};

export const logger = {
  debug: (...args: unknown[]) => {
    if (enableDebug) console.debug(...prefixArgs('debug', args));
  },
  info: (...args: unknown[]) => {
    if (enableDebug) console.info(...prefixArgs('info', args));
  },
  warn: (...args: unknown[]) => {
    console.warn(...prefixArgs('warn', args));
  },
  error: (...args: unknown[]) => {
    console.error(...prefixArgs('error', args));
  },
};

export default logger;