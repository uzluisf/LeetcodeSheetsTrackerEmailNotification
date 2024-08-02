// Name of the sheet where the Leetcode problems are being tracked.
const SHEET_NAME = "ProblemTracker";

// Specify where the name, link, and reviewDate columns are. Remember the rows are 0-indexed.
const COLUMN_HEADER_TO_INDEX = {
  name: 0,
  link: 1,
  reviewDate: 7,
};

const dueProblems = getDueProblems(SHEET_NAME);
sendEmail(dueProblems);

function sendEmail(problems) {
  if (problems && problems.length > 0) {
    const emailSubject = `${problems.length} Leetcode Problems Due Today - ${new Date().toDateString()}`;
    const textBody = problems.map(problem => `* ${problem.text}`).join("\n");
    const htmlBody = "<ol>\n" + problems.map(problem => `<li>${problem.html}</li>`).join("\n") + "\n</ol>";
    
    MailApp.sendEmail(Session.getActiveUser().getEmail(), emailSubject, textBody, {
      htmlBody,
    });
  }
}

function formatEmail(problems) {
  const emailSubject = `${problems.length} Leetcode Problems Due Today - ${new Date().toDateString()}`;
  const emailBody = "<ol>\n" + problems.map(problem => `<li>${problem}</li>`).join("\n") + "\n</ol>";
  
  return {
    emailSubject, emailBody
  }
}

function getDueProblems(sheetName) {
  // Get active spreadsheet's specified sheet by name.
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  // Get a 2D array of all rows in the sheet.
  const values = sheet.getDataRange().getValues();

  const today = new Date();
  
  const dueProblems = [];
  for (let i = 1; i < values.length; i++) {
    const dataRow = values[i];
   
    const name = dataRow[COLUMN_HEADER_TO_INDEX.name];
    const link = dataRow[COLUMN_HEADER_TO_INDEX.link];
    const reviewDateStr = dataRow[COLUMN_HEADER_TO_INDEX.reviewDate];

    const reviewDate = new Date(reviewDateStr);
    if (reviewDate.toDateString() === today.toDateString() && (name || link)) {
      dueProblems.push({
        text: `${name} - ${link}`,
        html: `<b><a href="${link}">${name}</a></b>`,
      });
    }
  }

  return dueProblems;
}
