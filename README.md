# LeetcodeSheetsTrackerEmailNotification

## Motivation

I wanted to keep track of the Leetcode problems I've worked on, as well as be notified when problems needed to be reviewed according to the review date I've set up, however I didn't want to use Notion simply because of that. Thus Google Sheets it is.

### Related

- https://github.com/nithin1shastry/revisionEmailNotification

## Usage

When adding a Leetcode problem to the sheet, I add a **Review Date** in the future (e.g., 3 days, 1 week, etc) based on how I did previously. If I don't want to be notified for a particularly problem, I simply leave the last **Review Date** as-is. 

## Setup

1. Download the Google Sheets `leetcode-problem-tracker.xlsx` in this repo and open it in your Google Sheets account. The automation script uses the columns as they are in this sheet so if you modify the columns in it, make sure you also modify the script accordingly.

<img width="1754" alt="sheet" src="https://github.com/user-attachments/assets/c639ba17-98c5-4d57-8c8d-f03599c86abf">

2. Once the sheet is opened, Click on **Extensions** > **Apps Script**.

<img width="1754" alt="click-apps-script" src="https://github.com/user-attachments/assets/76f3cddc-c866-49bd-ad54-e380e3eb2c45">

3. Copy the code from `Code.gs`, paste in the Apps Script editor, and name the script.

<img width="1643" alt="adding-script" src="https://github.com/user-attachments/assets/1dd5b42c-f526-4697-8c59-bbbd20713978">

4. Click on **Triggers** on the left menu, then **Add Trigger**, and set up your preferred trigger's cadence; for example, this trigger runs daily after midnight. Make sure you choose the `sendEmail` function. Finally click **Save**.

<img width="1643" alt="script-trigger" src="https://github.com/user-attachments/assets/f518b7a5-e64a-4021-af1b-24985b1105be">

5. When you click **Save**, a warning will pop out. Click on **Advanced** and then **Go to...**.

<img width="864" alt="verifying-app" src="https://github.com/user-attachments/assets/6d51ba4c-8815-4554-874d-9bb1040056ca">

6. If you trust the app you created, then click **Allow**.
   
<img width="1246" alt="allow-app" src="https://github.com/user-attachments/assets/1aa5201b-f636-4dee-86b4-59426f4a9e7e">

7. When the script is triggered, you should receive an email if you've Leetcode problems to review in the sheet for that day.

<img width="1403" alt="email" src="https://github.com/user-attachments/assets/e04fc24d-0a7f-4496-95f8-4ce5ee9ad2cd">

