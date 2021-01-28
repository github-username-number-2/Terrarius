export default function rotateArray(array, rotate) {
  array = _.cloneDeep(array);

  switch (rotate) {
    case 0:
      break;
    case 1:
      for (
        let y = 0, yLength = array.length, oldArray = _.cloneDeep(array); y < yLength; y++
      ) {
        const xOldArray = [...oldArray[y]];
        for (
          let x = 0, xLength = array[y].length; x < xLength; x++
        ) {
          array[x][y] = xOldArray[x];
        }
      }
      for (let y = 0, yLength = array.length; y < yLength; y++) {
        array[y].reverse();
      }
      break;
    case 2:
      array.reverse();
      for (let y = 0, yLength = array.length; y < yLength; y++) {
        array[y].reverse();
      }
      break;
    case 3:
      for (
        let y = 0, yLength = array.length, oldArray = _.cloneDeep(array); y < yLength; y++
      ) {
        const xOldArray = [...oldArray[y]];
        for (
          let x = 0, xLength = array[y].length; x < xLength; x++
        ) {
          array[x][y] = xOldArray[x];
        }
      }
      array.reverse();
      break;
  }
  return array;
}