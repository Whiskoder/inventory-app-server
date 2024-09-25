/**
 * RFC CERTIFIED SUPPLIER
 * [A-ZÑ&]{3,4}: Matches the first three or four characters of the RFC, which can be uppercase letters and the special character &.
 * [0-9]{2}: Matches exactly two digits.
 * (0[1-9]|1[0-2]): Matches a month from 01 to 12.
 * ([12][0-9]|0[1-9]|3[01]): Matches days from 01 to 31, taking into account leap years for February and the end of months with fewer than 31 days.
 * [A-Z0-9]{3}: Matches exactly three characters which can be uppercase letters or digits.
 */
export const RFC_REGEX =
  /^[A-ZÑ&]{3,4}[0-9]{2}(0[1-9]|1[0-2])([12][0-9]|0[1-9]|3[01])[A-Z0-9]{3}$/
