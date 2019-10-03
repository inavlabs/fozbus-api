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
  const obj = { 0: [] };
  array.forEach(item => {
    if (regex.test(item)) {
      if (obj[0].length === 0) {
        obj[0].push(item);
      }
      if (
        obj[0].every(
          elem =>
            parseInt(elem.replace(':', '')) !== parseInt(item.replace(':', ''))
        )
      ) {
        obj[0].push(item);
      }
    }
  });
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
    console.log(obj);
  });
}

module.exports = {
  parsePDF,
};
