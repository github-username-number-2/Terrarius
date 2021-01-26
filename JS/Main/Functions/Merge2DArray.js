export default function merge2DArray(array1, array2, skipValues = []) {
  //skipValues is an array of values to skip over entirely
  array1 = _.cloneDeep(array1);

  //all 2d arrays are y x arrays
  //finds smallest array lengths
  const yLength = Math.min(array1.length, array2.length),
    xLength = Math.min(array1[0].length, array2[0].length);

  for (let y = 0; y < yLength; y++) {
    for (let x = 0; x < xLength; x++) {
      //skip values in skipValues array
      if (!skipValues.includes(array2[y][x])) {
        array1[y][x] = array2[y][x];
      }
    }
  }

  return array1;
}