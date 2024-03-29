export const M_PI_2 = Math.PI / 2;
export const M_3_PI_2 = (3 * Math.PI) / 2;
export const M_2_PI = 2 * Math.PI;

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

export function adjustDirection(direction){
  if (direction >= M_2_PI) {
    return direction - M_2_PI;
  } else if (direction < 0) {
    return direction + M_2_PI;
  }
  return direction;
}