const ALPHANUMERIC = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890";
const CONSONANTS = "QWRTPSDFGHJKLZXCVBNM";
const VOGALS = "AEIOU";

/**
 *
 * @param {Number} passwordLength
 * @returns {string}
 */
export function createSyllabicPassword(passwordLength) {
  let word = [];
  for (let i = 0; i < passwordLength; i++) {
    if (i % 2 == 0) {
      word.push(CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)]);
    } else {
      word.push(VOGALS[Math.floor(Math.random() * VOGALS.length)]);
    }
  }

  return word.join("");
}

/**
 *
 * @param {Number} passwordLength
 * @returns {string}
 */
export function createAlphanumericPassword(passwordLength) {
  let word = [];
  for (let i = 0; i < passwordLength; i++) {
    word.push(ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)]);
  }

  return word.join("");
}
