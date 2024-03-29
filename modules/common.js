export function decimalToHex(decimal) {
  decimal = Math.floor(decimal);
  // Convert decimal to hexadecimal
  let hex = decimal.toString(16);
  // Pad the hexadecimal string if necessary
  return hex.padStart(2, "0");
}

export function distance(x1, y1, x2, y2) {
  return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5;
}

export function reflect(dir_x, dir_y, normal_x, normal_y) {
  let dot = dir_x * normal_x + dir_y * normal_y;
  let ref_x = dir_x - 2 * dot * normal_x;
  let ref_y = dir_y - 2 * dot * normal_y;

  return [ref_x, ref_y];
}
