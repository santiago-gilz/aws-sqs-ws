require("dotenv").config();
const SNSHelper = require("./SNSHelper");

(async () => {
  const sns = new SNSHelper();
  const params = {
    TopicArn: "[YOUR TOPIC ARN]",
    MessageStructure: "json",
    Message: JSON.stringify({
      default: "This is a test message",
      sqs: "Hey! SQS, process this.",
      sms: "ALERT: SQS has been notified about the message."
    }),
  };
  console.log(await sns.publishMessage(params));
})();
