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
    const htmlBody = htmlFormattedBody(problems);
 
    MailApp.sendEmail(Session.getActiveUser().getEmail(), emailSubject, textBody, {
      htmlBody: htmlBody,
    });
  }
}

function htmlFormattedBody(problems) {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  const spreadSheetName = activeSpreadsheet.getName();
  const spreadSheetUrl = activeSpreadsheet.getUrl();
  const emailBody = `
  <div style="width: 500px; padding: 10px; margin: 0 auto; margin-top: 10px; border-radius: 10px; background-color: #edf2f7;">
      <h2>${ greeting() }</h2>

      <h3>Leetcode Problems</h3>

      You need to solve the following problems on Leetcode today:

      <ol>
          ${ problems.map(problem => `
          <li>${problem.html}</li>
          `).join("\n") }
      </ol>

      <p>Update the review date of each of the problems listed above in the spreadsheet <a href="${spreadSheetUrl}">${spreadSheetName}</a>. If you don't have time to solve a problem today, set its review date to a future date.</p>

      <h3>Review Process's Spaced Repetition Scheme</h3>

      Set a problem's <b>review date</b> to:

      <ul>
          <li><b>1 day from today</b>. If you couldn't solve the problem in the time slot (e.g., 30 minutes), didn't have any idea how to solve, and needed to watch a video and/or read the solution.</li>
          <li><b>3 days from today</b>. If you solved the problem without any help but it took you the entire time slot (e.g., 30 minutes).</li>
          <li><b>7 days from today</b>. If you didn't exceed 1/2 (e.g., 15 minutes) of the entire time slot (e.g., 30 minutes) to solve the problem without help.</li>
          <li><b>30 days from today</b>. If you didn't exceed 1/3 (e.g., 10 minutes) of the entire time slot (e.g., 30 minutes) to solve the problem without help.</li>
      </ul>

      <hr />

      <p style="font-size: small; font-style: italic;">This email is sent automatically based on the spreadsheet <a href="${spreadSheetUrl}">${spreadSheetName}</a>'s <b>Review Date</b> column.</p>
  </div>
  `;
  
  return emailBody;
}

function greeting() {
  const hour = new Date().getHours();
  const greetingMessage = `Good ${(hour < 12 && "Morning" || hour < 18 && "Afternoon" || "Evening")}`;
  const emoji = (hour < 12 && "🌄" || hour < 18 && "🌇" || "🌃");
  return `${emoji} ${greetingMessage}`;
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
