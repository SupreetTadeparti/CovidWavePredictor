async function main() {
  // fetch the data from the website
  const res = await fetch("https://pomber.github.io/covid19/timeseries.json");

  // turn it into the json format
  const dataJSON = await res.json();

  // SIMPLIFYING THE DATA

  /*
  change it from
  {
    country: [
        {
            confirmed: x,
            ...
        },
        ...
    ],
    country2: [
        
    ]
    ...
  }
  to
  [
    [
        {
            confirmed: x,
            ...
        },
        ...
    ],
    ...
  ]
  (removed the country key)
  */

  let data = Object.values(dataJSON);

  /*
  change it from
  [
    [
        {
            confirmed: x,
            ...
        },
        ...
    ],
    ...
  ]
  to
  [
    [
        x1,
        x2,
        x3
        ...
    ],
    ...
  ]
  */
  data = data.map((country) => country.map((data) => data.confirmed));

  // change it from total cases upto that day to daily cases
  // by subtracting the previous day fro the current day

  /*
  [
    [
        x1,
        x2 -= x1,
        x3 -= x2
        ...
    ],
    ...
  ]
  */

  const globalDailyCases = data[0];
  for (let i = globalDailyCases.length; i > 0; i--) {
    globalDailyCases[i] -= globalDailyCases[i - 1];
  }

  for (let i = 1; i < data.length; i++) {
    globalDailyCases[0] += data[i][0];
    for (let j = 1; j < data[i].length; j++) {
      globalDailyCases[j] += data[i][j] - data[i][j - 1];
    }
  }

  console.log(globalDailyCases);
}

main();
