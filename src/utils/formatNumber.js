/**
 * Format large numbers into readable format
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
export const formatCurrency = (num) => {
  if (!num || num === 0) return '₹0';
  
  const absNum = Math.abs(num);
  const isNegative = num < 0;
  
  let formatted;
  
  if (absNum >= 10000000) { // 1 Crore and above
    formatted = `₹${(absNum / 10000000).toFixed(1)}Cr`;
  } else if (absNum >= 100000) { // 1 Lakh and above
    formatted = `₹${(absNum / 100000).toFixed(1)}L`;
  } else if (absNum >= 1000) { // 1 Thousand and above
    formatted = `₹${(absNum / 1000).toFixed(1)}K`;
  } else {
    formatted = `₹${absNum.toFixed(0)}`;
  }
  
  return isNegative ? `-${formatted}` : formatted;
};

/**
 * Format number with proper Indian numbering system
 * @param {number} num - The number to format
 * @returns {string} - Formatted number with commas
 */
export const formatIndianCurrency = (num) => {
  if (!num || num === 0) return '₹0.00';
  
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  
  // Convert to string and split decimal
  const [integerPart, decimalPart = '00'] = absNum.toFixed(2).split('.');
  
  // Apply Indian numbering system (lakhs, crores)
  let formatted = integerPart;
  if (integerPart.length > 3) {
    // Add commas as per Indian system
    formatted = integerPart.replace(/\B(?=(\d{2})+(\d{3})+$)/g, ',');
    // Fix for thousands place
    formatted = formatted.replace(/,(\d{3})$/, ',$1');
    // Fix pattern for Indian numbering
    formatted = formatted.replace(/(\d+),(\d{2}),(\d{3})/, '$1,$2,$3');
  }
  
  const result = `₹${formatted}.${decimalPart}`;
  return isNegative ? `-${result}` : result;
};

/**
 * Get compact display for stats
 * @param {number} num - The number to format
 * @returns {object} - Object with main value and subtitle
 */
export const getCompactDisplay = (num) => {
  if (!num || num === 0) return { main: '₹0', sub: '' };
  
  const absNum = Math.abs(num);
  const isNegative = num < 0;
  
  let main, sub;
  
  if (absNum >= 10000000) { // 1 Crore+
    main = `${(absNum / 10000000).toFixed(1)}Cr`;
    sub = formatIndianCurrency(num);
  } else if (absNum >= 100000) { // 1 Lakh+
    main = `${(absNum / 100000).toFixed(1)}L`;
    sub = formatIndianCurrency(num);
  } else if (absNum >= 1000) { // 1K+
    main = `${(absNum / 1000).toFixed(1)}K`;
    sub = formatIndianCurrency(num);
  } else {
    main = `₹${absNum.toFixed(0)}`;
    sub = '';
  }
  
  if (isNegative) {
    main = `-${main}`;
  }
  
  return { main, sub };
};
