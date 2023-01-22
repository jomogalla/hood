import constants from "./constants";

export function getFormattedDate(date) {
    const today = new Date();
  
    if (today.getDate() === date.getDate()) {
      return `Today (${date.getDate()})`;
    }
  
    return `${constants.days[date.getDay()]} ${date.getDate()}`;
}

export function generateStripes(color = 'black') {
  // create a 10x10 px canvas for the pattern's base shape
  let shape = document.createElement('canvas')
  shape.width = 10
  shape.height = 10
  // get the context for drawing
  let c = shape.getContext('2d')

  // c.translate(0.5, 0.5);
  c.lineWidth = 2;
  // draw 1st line of the shape 
  c.strokeStyle = color
  c.beginPath()
  c.moveTo(10, 0)
  c.lineTo(0, 10)
  // c.moveTo(0, 0)
  // c.lineTo(10, 10)
  c.stroke()
  // draw 2nd line of the shape 
  c.beginPath()
  c.moveTo(0,0)
  c.lineTo(10,10)
  c.stroke()
  // create the pattern from the shape
  return c.createPattern(shape, 'repeat')
}