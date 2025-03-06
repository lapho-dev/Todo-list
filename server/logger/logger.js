const colors = {
    reset: "\x1b[0m",
    fgGreen: "\x1b[32m",
    fgRed: "\x1b[31m",
    fgYellow: "\x1b[33m"
  };
  
  function getStatusColor(status) {
    if (status >= 200 && status < 300) {
      return colors.fgGreen; // Success (green)
    } else if (status >= 400 && status < 600) {
      return colors.fgRed; // Error (red)
    } else {
      return colors.fgYellow; // Others (yellow)
    }
  }
  
  function logRequest(status, method, timeTaken, path, sender) {
    const statusColor = getStatusColor(status);
    const logMessage = `${statusColor}${status}${colors.reset} ${method} ${timeTaken}ms ${path} from ${sender}`;
    console.log(logMessage);
  }
  
  module.exports = { logRequest };