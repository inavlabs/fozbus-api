const rp = require('request-promise');
const $ = require('cheerio');
const parser = require('../parser');

const baseURL = 'http://www.pmfi.pr.gov.br';
const url = 'http://www.pmfi.pr.gov.br/conteudo/?idMenu=570';

rp(url)
  .then(function(html) {
    // console.log($('.textoMenuTopoRapido', html).length);
    // console.log($('.textoMenuTopoRapido', html));
    const blobSite = Array.from($('.textoMenuTopoRapido', html));
    const titlePDF = $('.colTitulo', html)
      .text()
      .split(') (');
    const busPDFUrls = blobSite.map(item => item.attribs.href).splice(8);
    // console.log('URLS', busPDFUrls.length);
    // console.log(titlePDF.length);

    let finalJSON = [];
    for (let index = 0; index < busPDFUrls.length; index++) {
      finalJSON.push({ name: titlePDF[index], link: busPDFUrls[index] });
    }
    // console.log(finalJSON);

    parser.parsePDF(baseURL + '/ArquivosDB?idMidia=107048');
  })
  .catch(function(er) {
    console.log('error', er);
  });
