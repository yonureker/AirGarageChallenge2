const express = require("express");
const app = express();
const port = 3000;

//import json files
const paid = require("./paid.json");
const scanned = require("./scans.json");

// the hash for creating combinations
let myHash = { "0": "O", "1": "I", "4": "A", "O": "0", 'I': '1', 'A': '4' };

//create combinations of scanned plates
function combinations(str) {
  const r = (active, rest, a) => {
    if (!active && !rest) return;
    if (!rest) {
      a.push(active);
    } else {
      r(active + rest[0], rest.slice(1), a);
      r(active, rest.slice(1), a);
    }
    return a;
  };
  return r('', str, []);
}

const getAllCombinations = (str, hash) => {
  const indexes = [...str].reduce(
    (acc, cur, i) => (hash[cur] ? [...acc, i] : acc),
    [],
  );

  const indexCombs = combinations(indexes.join(''));
  const result = indexCombs.map(perm => {
    const split = perm.split('');

    return split
      .reduce(
        (acc, cur) => {
          acc[cur] = hash[acc[cur]];
          return acc;
        },
        [...str],
      )
      .join('');
  });
  // return result;
  let x = result.concat([str])
  return x;
};

// to check if plate includes those characters
let regex = /[AIO140]/

// return array of arrays of scanned plates with all possible combinations
let scannedCombinations = scanned.map((item) => {
  if(regex.test(item)){
    console.log(`${item} is ok`)
    return getAllCombinations(item, myHash)
  } else {
    console.log(`${item} is not ok`)
    return [item];
  }
})

//filter all combinations by comparing each element in the array to paid array.
let unpaid = scannedCombinations.filter((item) => {
  if (item.some(plate => paid.includes(plate))){
    return false;
  }
  return true;
}).map(item => item[0])

app.get("/api/unpaid", (req, res) => res.send(unpaid));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
