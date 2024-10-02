function getUserTimeZoneId() {
  const timeZoneId = Intl.DateTimeFormat().resolvedOptions().timeZone
  return timeZoneId
}

function getUserTimeZoneLocale() {
  const timeZoneLocale = Intl.DateTimeFormat().resolvedOptions().locale
  return timeZoneLocale
}

function UTCtoLocalFormat(utcTimeString:string) {
  const utcDate = new Date(utcTimeString)
  const formattedDate = utcDate.toLocaleString('en-GB')
  return formattedDate
}

export { getUserTimeZoneId, getUserTimeZoneLocale, UTCtoLocalFormat }
