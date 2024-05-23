const {
  OFFSET_TIMEZONE_BRAZIL,
  ONE_HOUR_IN_MILLISECONDS,
  ONE_MINUTE_IN_MILLISECONDS,
} = require("../constants/Date");

function adjustToBrazilTimezone(date) {
  const utcDate = new Date(
    date.getTime() + date.getTimezoneOffset() * ONE_MINUTE_IN_MILLISECONDS
  );
  return new Date(
    utcDate.getTime() + OFFSET_TIMEZONE_BRAZIL * ONE_HOUR_IN_MILLISECONDS
  );
}

module.exports = { adjustToBrazilTimezone };
