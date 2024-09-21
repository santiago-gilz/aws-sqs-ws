const {
  SNSClient,
  PublishCommand
} = require("@aws-sdk/client-sns");

class SNSHelper {
  constructor() {
    this.snsClient = new SNSClient();
  }

  publishMessage(params) {
    return this.snsClient.send(new PublishCommand(params));
  }
}

module.exports = SNSHelper;
