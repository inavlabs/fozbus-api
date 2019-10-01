const rp = require('request-promise');
const pdf = require('pdf-parse');

function render_page(pageData) {
  //check documents https://mozilla.github.io/pdf.js/
  let render_options = {
    //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: false,
    //do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: false,
  };

  return pageData.getTextContent(render_options).then(function(textContent) {
    let lastY,
      text = '';
    for (let item of textContent.items) {
      if (lastY == item.transform[5] || !lastY) {
        text += item.str;
      } else {
        text += '\n' + item.str;
      }
      lastY = item.transform[5];
    }
    return text;
  });
}

let parseOptions = {
  pagerender: render_page,
};

function parsePDF(url) {
  const options = {
    uri: url,
    method: 'GET',
    encoding: null,
    headers: {
      'Content-type': 'application/pdf',
    },
  };
  rp(options).then(function(buffer, data) {
    // console.log(buffer);
    pdf(buffer, parseOptions).then(function(data) {
      // number of pages
      // console.log(data.numpages);
      // number of rendered pages
      // console.log(data.numrender);
      // PDF info
      //   console.log(data.info);
      // PDF metadata
      // console.log(data.metadata);
      // PDF.js version
      // check https://mozilla.github.io/pdf.js/getting_started/
      // console.log(data.version);
      // PDF text
      let rawTextArray = data.text.split('\n').filter(Boolean);
      console.log(rawTextArray.map(str => str.trim()));
    });
  });
}

module.exports = {
  parsePDF,
};
