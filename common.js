function decimalToHex(decimal) {
    decimal = Math.floor(decimal);
    // Convert decimal to hexadecimal
    let hex = decimal.toString(16);
    // Pad the hexadecimal string if necessary
    return hex.padStart(2, '0');
}