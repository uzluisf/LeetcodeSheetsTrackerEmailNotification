// Name of the sheet where the Leetcode problems are being tracked.
const SHEET_NAME = "ProblemTracker";

// Specify the name of the columns, as they appear in the sheet, used in the script.
const COLUMN = {
  name: "Name",
  link: "Link",
  reviewDate: "Review Date",
  lastReviewDate: "Last Review Date",
};

function sendEmail() {
  const dueProblems = getDueProblems(SHEET_NAME);
  sendEmailForReviewProblems(dueProblems);

  function getDueProblems(sheetName) {
    const today = new Date();

    // Get active spreadsheet's specified sheet by name.
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

    // Get a 2D array of all rows in the sheet.
    const values = sheet.getDataRange().getValues();
    const header = values.shift();
    const rows = values;

    // Map the header columns to their indexes so we don't need to specify indexes and
    // the script doesn't break if we move columns around.
    const headerToIndex = {};
    for (let i = 0; i < header.length; i++) {
      headerToIndex[header[i]] = i;
    }

    const dueProblems = [];
    for (const row of rows) {
      const name = row[headerToIndex[COLUMN.name]];
      const link = row[headerToIndex[COLUMN.link]];
      const lastReviewDate = new Date(row[headerToIndex[COLUMN.lastReviewDate]])
      const reviewDate = new Date(row[headerToIndex[COLUMN.reviewDate]]);

      if (reviewDate.toDateString() === today.toDateString() && (name || link)) {
        const updatedReviewDates = getUpdatedReviewDates({
          reviewDate,
          lastReviewDate
        });
        dueProblems.push({
          text: `${name} - ${link}`,
          html: `<li><b><a href="${link}">${name}</a></b></li>`,
          html: `
          <li><b><a href="${link}">${name}</a></b></li>
          <ul>
            <li style="color: #1e824c"><b>Good.</b> LRD: ${updatedReviewDates.good.lastReviewDate} | RD: ${updatedReviewDates.good.reviewDate}</li>
            <li style="color: #f22613"><b>Bad.</b> LRD: ${updatedReviewDates.bad.lastReviewDate} | RD: ${updatedReviewDates.bad.reviewDate}</li>
          </ul>
        `,
        });
      }
    }

    return dueProblems;
  }

  function sendEmailForReviewProblems(problems) {
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
          ${ problems.map(problem => problem.html).join("\n") }
      </ol>

      <p>Update the review dates of each of the problems listed above in the spreadsheet <a href="${spreadSheetUrl}">${spreadSheetName}</a>, depending on whether you solved the problem in the alloted time, i.e., <b>good</b> (successful) and <b>bad</b> (failure). If you don't have time to solve a problem today, set its review date to a future date.</p>

      <h3>Review Process's Spaced Repetition Scheme</h3>

      <ul>
          <li>The first time you do a problem, set <b>Inception Date</b> (ID) and <b>Last Review Date</b> (LRD) to today and <b>Review Date</b> (RD) to the next date.</li>
        
        <li>When a review is due:</li>
          <ul>
        <li><b>Good.</b> If you solved the problem within the given time, set the new <b>Review Date</b> to <code>(Review Date + floor(2.5 * (Review Date - Last Review Date)))</code>. For example if <b>Review Date</b> is <code>2024-08-07</code> and <b>Last Review Date</b> is <code>2024-08-02</code>, then the new <b>Review Date</b> is <code>2024-08-19</code>.</li> 
        <li><b>Bad</b>. If you didn't solve the problem, set <b>Last Review Date</b> to today and <b>Review Date</b> to the next date.</li>
        </ul>
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

  function getUpdatedReviewDates({
    lastReviewDate,
    reviewDate
  }) {
    // https://stackoverflow.com/a/15289883/10824322 
    function dateDiffInDays(a, b) {
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;
      // Discard the time and time-zone information.
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

      return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
    }

    // https://stackoverflow.com/a/19691491/10824322
    function addDays(date, days) {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }

    function getDateStr(date) {
      return new Date(date).toISOString().split('T')[0];
    }

    let updatedLastReviewDate = new Date(lastReviewDate);
    let updatedReviewDate = new Date(reviewDate);

    // Calculate dates for successful answer.
    const MULTIPLIER = 2.5;
    const waitedDays = dateDiffInDays(updatedReviewDate, updatedLastReviewDate);
    const good = {
      lastReviewDate: getDateStr(updatedReviewDate),
      reviewDate: getDateStr(addDays(updatedReviewDate, Math.floor(MULTIPLIER * waitedDays))),
    };

    // Calculate dates for bad answer.
    const bad = {
      lastReviewDate: getDateStr(updatedReviewDate),
      reviewDate: getDateStr(addDays(updatedReviewDate, 1)),
    };

    return {
      good,
      bad,
    }
  }
}
