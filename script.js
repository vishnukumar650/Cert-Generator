const userName = document.getElementById("name");
const submitBtn = document.getElementById("submitBtn");

const { PDFDocument, rgb, degrees } = PDFLib;


const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

let certpath = './certificate';
submitBtn.addEventListener("click", () => {
  const val = capitalize(userName.value);
  var select = document.getElementById('course');
var value = select.options[select.selectedIndex].value;
console.log(value);
  if(value === 'java')
    certpath += '2';

  //check if the text is empty or not
  if (val.trim() !== "" && userName.checkValidity()) {
    // console.log(val);
    generatePDF(val);
  } else {
    userName.reportValidity();
  }
});

const generatePDF = async (name) => {
  const existingPdfBytes = await fetch(certpath+'.pdf').then((res) =>
    res.arrayBuffer()
  );

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  //get font
  const fontBytes = await fetch("./LeagueSpartanFont.ttf").then((res) =>
    res.arrayBuffer()
  );

  // Embed our custom font in the document
  const LeagueFont = await pdfDoc.embedFont(fontBytes);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  console.log(firstPage.getWidth());
  let lenspace = name.length*10;

  // Draw a string of text diagonally across the first page
  firstPage.drawText(name, {
    x: 792/2-lenspace,
    y: 350,
    size: 30,
    font: LeagueFont,
    color: rgb(0.81961,0.15294,0.75686),
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  console.log("Done creating");

  // this was for creating uri and showing in iframe

  // const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  // document.getElementById("pdf").src = pdfDataUri;

  var file = new File(
    [pdfBytes],
    "suretrust.pdf",
    {
      type: "application/pdf;charset=utf-8",
    }
  );
 saveAs(file);
};

// init();
