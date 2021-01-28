export function flip2DArray(array, axis, newArray) {
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

export function merge2DArray(array1, array2, skipValues = []) {
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

export function rotate2DArray(array, rotate) {
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

//can only flip square arrays
export function flip2DArrayDiagonal(array, slope, newArray) {
  //slope is either "upward" or "downward"

  if (newArray) {
    array = _.cloneDeep(array);
  }

  const yLen = array.length,
    xLen = array[0].length;


  if (slope === "upward") {
    const loopNum = Math.floor(yLen / 2) * xLen + Math.floor(xLen / 2);


    for (let i = 0; i < loopNum; i++) {
      const y = Math.floor(i / xLen),
        x = i % xLen;

      [
        array[y][x],
        array[xLen - x - 1][yLen - y - 1],
      ] = [
          array[xLen - x - 1][yLen - y - 1],
          array[y][x],
        ];
    }
  }
  if (slope === "downward") {
    for (let x = 1; x < xLen; x++) {
      for (let y = 0, yLoop = Math.ceil(yLen / 2); y < yLoop; y++) {
        [
          array[y][x],
          array[x][y],
        ] = [
            array[x][y],
            array[y][x],
          ];
      }
    }
  }

  return array;
}