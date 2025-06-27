export const debug = {
  log: (component, message, data = {}) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[${timestamp}] [${component}] ${message}`, data);
  },
  error: (component, message, error) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.error(`[${timestamp}] [${component}] ERROR: ${message}`, error);
  },
  trace: (component) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[${timestamp}] [${component}] Component mounted`);
    return () => console.log(`[${timestamp}] [${component}] Component unmounted`);
  }
}; 