const fs = require("fs");

const decodeBaseValue = (base, encodedValue) => {
  return parseInt(encodedValue, base);
};

const calculateConstant = (dataPoints) => {
  let constantTerm = 0;

  for (let i = 0; i < dataPoints.length; i++) {
    let { x: currentX, y: currentY } = dataPoints[i];
    let termValue = currentY;

    for (let j = 0; j < dataPoints.length; j++) {
      if (i !== j) {
        let { x: otherX } = dataPoints[j];
        termValue *= -otherX / (currentX - otherX);
      }
    }

    constantTerm += termValue;
  }

  return Math.round(constantTerm);
};

const findShamirConstant = (filePath) => {
  const inputData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const { keys: metadata, ...rootData } = inputData;
  const parsedPoints = [];

  Object.entries(rootData).forEach(([key, { base, value }]) => {
    const xCoordinate = parseInt(key, 10);
    const yCoordinate = decodeBaseValue(parseInt(base, 10), value);
    parsedPoints.push({ x: xCoordinate, y: yCoordinate });
  });

  const requiredRoots = metadata.k;
  const selectedDataPoints = parsedPoints.slice(0, requiredRoots);

  const secretConstant = calculateConstant(selectedDataPoints);
  return secretConstant;
};

const testFile1 = "./test1.json"; 
const testFile2 = "./test2.json"; 

console.log("Test 1: Constant Term =", findShamirConstant(testFile1));
console.log("Test 2: Constant Term =", findShamirConstant(testFile2));
