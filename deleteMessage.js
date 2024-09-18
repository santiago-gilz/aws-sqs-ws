require("dotenv").config();
const SQSHelper = require("./SQSHelper");

(async () => {
  const sqs = new SQSHelper();
  const params = {
    QueueUrl: "[YOUR_QUEUE_URL]",
    ReceiptHandle: "[YOUR_RECEIPT_HANDLE]",
  };
  console.log(await sqs.deleteMessage(params));
})();
