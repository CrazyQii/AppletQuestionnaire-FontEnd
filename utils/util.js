const formatTime = date => {
  date = new Date(date)
  console.log(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[year, month, day].join('/')} ${[hour, minute, second].join(':')}`
}

const formatDate = date => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${[year, month, day].join('/')}`
}

const formatMonth = date => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return `${[year, month].join('/')}`
}

module.exports = {
  formatTime,
  formatDate,
  formatMonth
}