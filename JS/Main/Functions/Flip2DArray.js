export default function flip2DArray(array, axis, newArray) {
  //axis is "x" for x axis and "y" for y axis
  //newArray is a boolean for whether or not to return a new array or modify the old one directly

  if (newArray) {
    array = _.cloneDeep(array);
  }

  if (axis === "y") {
    array.reverse();
  }
  if (axis === "x") {
    for (let i = 0, l = array.length; i < l; i++) {
      array[i].reverse();
    }
  }

  return array;
}