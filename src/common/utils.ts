import bcrypt from 'bcrypt';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(
  password: string | undefined,
  hash: string | undefined | null,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

export function getVariableName<TResult>(
  getVar: () => TResult,
): string | undefined {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replaceAll(/(\r\n|\n|\r|\s)/gm, ''),
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }

  const fullMemberName = m[1];

  const memberParts = fullMemberName.split('.');

  return memberParts.at(-1);
}

export const validateText = (text: string): boolean => {
  // let result = false;

  //   Explanation:
  // ^ matches the start of the string.
  // [^\d\\/] matches any character that is not a digit (\d) or a forward slash (\/), thanks to the ^ inside the square brackets that negates the character class.
  // {1,} matches the previous pattern (any non-digit character except slash) two or more times. This ensures the minimum length of the string is two characters.
  // $ matches the end of the string.

  const isValid: boolean = /^[^\d\\/]{1,}$/.test(text);

  return isValid;
};

export const validateUserLastName = (userLastName: string): boolean => {
  let result = false;

  //   Explanation:
  //   ^: Matches the start of the string
  // [^\d\\/]*: Matches any character that is not a digit (\d), a forward slash (\/), or a backslash (\\), zero or more times
  // [a-zA-Zа-яА-ЯіІїЇ]: Matches any letter, including Cyrillic characters used in Ukrainian language (a-z, A-Z, а-я, А-Я, і, І, ї, Ї)
  // \s?: Matches an optional whitespace character
  // [^\d\\/]*: Same as the first instance, matches any character that is not a digit, a forward slash, or a backslash, zero or more times
  // [a-zA-Zа-яА-ЯіІїЇ]: Same as the first instance, matches any letter
  // [^\d\\/]*: Same as the first instance, matches any character that is not a digit, a forward slash, or a backslash, zero or more times
  // $: Matches the end of the string

  const isValid: boolean =
    /^[^\d\\/]*[a-zA-Zа-яА-ЯіІїЇ][^\d\\/]*\s?[^\d\\/]*[a-zA-Zа-яА-ЯіІїЇ][^\d\\/]*$/.test(
      userLastName,
    );

  if (isValid) {
    return (result = true);
  }

  return result;
};

export const validateEmail = (text: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(text);
};

export const validateTextLength = (text: string, length: number = 1): boolean => {
  return text.length >= length
};

export const validateStringNumber = (str: string): boolean => {
  return !isNaN(Number(str));
};
