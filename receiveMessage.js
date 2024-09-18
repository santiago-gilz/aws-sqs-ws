require("dotenv").config();
const SQSHelper = require("./SQSHelper");

(async () => {
  const sqs = new SQSHelper();
  const params = {
    QueueUrl: "[YOUR_QUEUE_URL]",
    MaxNumberOfMessages: 1,
  };
  console.log(await sqs.receiveMessage(params));
})();
