const rp = require('request-promise');
const { PdfReader } = require('pdfreader');
const timeRegex = /^\d\d:\d\d[\*]{0,1}$/;

function parseToJSON(buffer) {
  const reader = new PdfReader();

  return new Promise((resolve, reject) => {
    let pages = {};
    let pageNumber = 1;
    reader.parseBuffer(buffer, function(err, item) {
      if (err) {
        console.log(err);
        reject(err);
      } else if (!item) {
        /* pdfreader queues up the items in the PDF and passes them to
         * the callback. When no item is passed, it's indicating that
         * we're done reading the PDF. */
        resolve(pages);
      } else if (item.page) {
        // Page items simply contain their page number.
        pages[`page${pageNumber}`] = [];
        pageNumber++;
      } else if (item.text) {
        const row = pages[`page${pageNumber - 1}`] || [];
        row.push(item.text);
        pages[`page${pageNumber - 1}`] = row;
      }
    });
  });
}

function extractBusScheduleTable(array, regex) {
  let obj = { 0: [] };
  let busLineSet = new Set();
  let weekdaySet = new Set();
  // console.log(array);
  array.forEach(item => {
    const weekdayRegex = /SEGUNDA A SEXTA|SÁBADO|DOMINGO/;
    if (weekdayRegex.test(item)) {
      weekdaySet.add(item);
    }

    const busLineRegex = /^[A-Z]*$|>>/;
    if (busLineRegex.test(item)) {
      busLineSet.add(item);
    }

    if (regex.test(item)) {
      // Get the current quantity of tables
      let arraysLength = Object.keys(obj).length;
      for (let index = 0; index < arraysLength; index++) {
        // Check if has already an array of schedules
        if (obj[index].length === 0) {
          obj[index].push(item);
          break;
        }
        // Check if the time is already in the array
        if (
          obj[index].every(
            elem =>
              parseInt(elem.replace(':', '')) !==
              parseInt(item.replace(':', ''))
          )
        ) {
          obj[index].push(item);
          break;
        }
        // If it is the last array, create a new one
        if (index === arraysLength - 1) {
          obj[arraysLength] = [];
          obj[arraysLength].push(item);
          break;
        }
      }
    }
  });

  // Object.keys(obj).map(key => {
  //   obj[key].sort(
  //     (a, b) => parseInt(a.replace(':', '')) - parseInt(b.replace(':', ''))
  //   );
  // });
  console.log(weekdaySet);
  console.log(busLineSet);
  console.log(Object.keys(obj).length);
  console.log(obj);
  return obj;
}

function parsePDF(url) {
  const options = {
    uri: url,
    method: 'GET',
    encoding: null,
    headers: {
      'Content-type': 'application/pdf',
    },
  };
  rp(options).then(async function(buffer, data) {
    const jsonFile = await parseToJSON(buffer);

    const obj = extractBusScheduleTable(jsonFile.page1, timeRegex);
    // console.log(obj);
  });
}

module.exports = {
  parsePDF,
};
