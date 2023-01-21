import constants from "./constants";

export function getFormattedDate(date) {
    const today = new Date();
  
    if (today.getDate() === date.getDate()) {
      return `Today (${date.getDate()})`;
    }
  
    return `${constants.days[date.getDay()]} ${date.getDate()}`;
}