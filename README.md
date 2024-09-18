# Getting familiar with SQS and NodeJS
This is a short workshop about AWS SQS in NodeJS that helps you become familiar with SQS management from NodeJS Using the AWS SDK library.

## Prerequisites
To be able to run this workshop, the following tools/facilities are required:
1. A Unix-like environment. If your PC is Linux or Mac, you are all set! if you use Windows, we recommend to [install WSL2](https://learn.microsoft.com/en-us/windows/wsl/install). You can also spin up a Linux VM machine or even run everything on a Linux container.
2. AWS CLI installed on your environment. Here is an [installation guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
3. AWS ACCESS and SECRET keys configured. [Creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey).
4. NodeJS and NPM installed.

## Creating an SQS queue in Amazon
For creating a new queue, you have to follow the next steps: 

1. Open the [Amazon SQS console](https://console.aws.amazon.com/sqs/)
2. Choose Create queue
3. The Standard queue type is selected by default (You can't change queue type after you have created it)
4. Enter a Name for your queue
5. Create the queue with the default parameters, so, scroll to the bottom and choose Create Queue

Finally, Amazon SQS creates the queue and displays the queue's details page. Here we have the following information.

![AWS SQS Queue description](./assets/sample-sqs-creation.png)

## Getting started

In this section, you are going to use NodeJS, SQS, and AWS-SDK for javascript which is a library provided by Amazon to interact with its services.

### Creating our project

Create a new NodeJS project by following the steps below:

~~~bash
mkdir sqsnodejs
cd sqsnodejs
npm init -y
~~~

We need the following libraries, let's install them:

~~~bash
npm i -S @aws-sdk/client-sqs 
npm i -D dotenv
~~~
**Note**: `dotenv` will help you set environment variables needed to authenticate against AWS, and `@aws-sdk/client-sqs` will ease the interaction with Amazon SQS API.

If you want to take a look at the full solution, [here it is](https://github.com/santiago-gilz/aws-sqs-ws).

### Setting up the AWS credentials

The easiest way to connect your project to AWS is by using environment variables, let's create a .env file in your project's root folder that will be loaded by dotenv to perform that magic:

~~~config
AWS_ACCESS_KEY_ID=[YOUR_AWS_ACCESS_KEY_ID]
AWS_SECRET_ACCESS_KEY=[YOUR_AWS_SECRET_ACCESS_KEY]
AWS_DEFAULT_REGION=[YOUR_AWS_DEFAULT_REGION]
~~~

**Note**: you have to change values in brackets with your credentials from AWS. If you don't know how to get this information, head to the [prerequisites section](#prerequisites).

Now, it's a good idea to create a file called `SQSHelper.js` where you'll gather all the functions related to SQS.

~~~JavaScript
const { SQSClient } = require("@aws-sdk/client-sqs");

class SQSHelper {
  constructor() {
    this.sqsClient = new SQSClient();
  }
}

module.exports = SQSHelper
~~~

**Note**: When SQSClient is initialized, it takes environment variables and connects to Amazon SQS.

### Listing existing queues

Now, you created an SQSHelper class and its constructor initialized a SQSClient which will interact with Amazon SQS. Next, let's create a method to list existing queues, in the SQSHelper file add the following code:

~~~JavaScript
const { SQSClient, ListQueuesCommand } = require("@aws-sdk/client-sqs");

class SQSHelper {
  constructor() {
    this.sqsClient = new SQSClient();
  }

  listQueues() {
    return this.sqsClient.send(new ListQueuesCommand({}));
  }
}

module.exports = SQSHelper;
~~~
As you noticed, you have a new class called ListQueuesCommand imported from @aws-sdk/client-sqs, that class helps you to list existing queues from SQS. Therefore, you have an asynchronous method which uses the send method from SQSClient and as parameter it takes ListQueuesCommand where its constructor can have some parameters which are explain [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#listQueues-property).

In order to run the previous code, let's create a new file called `listQueues.js` in the root folder and add the following code:

~~~JavaScript
require("dotenv").config();
const SQSHelper = require("./SQSHelper");

(async () => {
  const sqs = new SQSHelper();
  console.log(await sqs.listQueues());
})()
~~~

Here, you imported dotenv and SQSHelper where dotenv helps you to load the environment variables you have in .env file and SQSHelper is the class you created before. In order to run it, let's create a new command in your `package.json` called `listQueuescode`. Your package file should look like this:

~~~JSON
{
  "name": "sqsnodejs",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "listQueues": "node listQueues.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@aws-sdk/client-sqs": "^3.651.1"
  },
  "devDependencies": {
    "dotenv": "^16.4.5"
  }
}
~~~

Now, to run your code, execute the following command:

~~~Bash
npm run listQueues
~~~

Your result must be pretty similar to this:

~~~JSON
{
  '$metadata': {
    httpStatusCode: 200,
    requestId: '1f207e6b-6485-588f-acd7-abcd7d0e0db6',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  QueueUrls: [
    '[YOUR_QUEUE_URL]'
  ]
}
~~~

### Getting queue properties

Amazon has an API method which allows you to get some queue attributes mentioned on Amazon SQS article. Add the following method to your SQSHelper class:

~~~javaScript
const {
  ...
  GetQueueAttributesCommand
} = require("@aws-sdk/client-sqs");

class SQSHelper {
  ...

  getQueueAttributes(params) {
    return this.sqsClient.send(new GetQueueAttributesCommand(params));
  }

  ...
}
~~~

We've imported a new class called GetQueueAttributesCommand from the @aws-sdk/client-sqs package. This command lets you get information about an SQS queue. You'll need to provide the queue's URL as input. For a complete list of possible parameters, check [this link](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#getQueueAttributes-property).

Create a new file named `getQueueAttributes.js` in your root project folder. When you run this file, make sure to include the **QueueUrl** and **AttributeNames** parameters. AttributeNames specifies which specific details you want to retrieve from the queue:

~~~javaScript
require("dotenv").config();
const SQSHelper = require("./SQSHelper");

(async () => {
  const sqs = new SQSHelper();
  const params = {
    QueueUrl: "[YOUR_QUEUE_URL]",
    AttributeNames: ["All"],
  };
  console.log(await sqs.getQueueAttributes(params));
})();
~~~

Again, We will add a new command in your `package.json` called **getQueueAttributes**:

~~~JSON
{
  ...
  "scripts": {
    "listQueues": "node listQueues.js",
    "getQueueAttributes": "node getQueueAttributes"
  },
  ...
}
~~~

Execute the following command in your terminal:
~~~Bash
npm run getQueueAttributes
~~~

You will get something like this:

~~~JSON
{
  '$metadata': {
    httpStatusCode: 200,
    requestId: '76592950-a9d3-50af-b063-70ed3c4b165d',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Attributes: {
    QueueArn: '[YOUR_CURRENT_QUEUE_ARN]',
    ApproximateNumberOfMessages: '0',
    ApproximateNumberOfMessagesNotVisible: '0',
    ApproximateNumberOfMessagesDelayed: '0',
    CreatedTimestamp: '1631573601',
    LastModifiedTimestamp: '1631573601',
    VisibilityTimeout: '30',
    MaximumMessageSize: '262144',
    MessageRetentionPeriod: '345600',
    DelaySeconds: '0',
    Policy: '[YOUR_CURRENT_QUEUE_POLICY]',
    ReceiveMessageWaitTimeSeconds: '0'
  }
}
~~~

### Sending a message to a queue

Let's create a new method to send a message to the queue taking the default parameters set when the queue was created. In the SQSHelper file, add the following code:

~~~JavaScript
const {
  ...
  SendMessageCommand,
} = require("@aws-sdk/client-sqs");

class SQSHelper {
  ...

  sendMessage(params) {
    return this.sqsClient.send(new SendMessageCommand(params));
  }
}

module.exports = SQSHelper;
~~~

We've added a new command called **SendMessageCommand** from the `@aws-sdk/client-sqs package`. This command lets you send a message to an SQS queue.

Create a new file named `sendMessage.js` in your main project folder and add the following code:

~~~JavaScript
require("dotenv").config();
const SQSHelper = require("./SQSHelper");

(async () => {
  const sqs = new SQSHelper();
  const params = {
    QueueUrl: "[YOUR_QUEUE_URL]",
    MessageBody: JSON.stringify({
      message: "Hello AWS SQS!",
    }),
  };
  console.log(await sqs.sendMessage(params));
})();
~~~

To use this command, you'll need to provide two pieces of information: the queue's URL and the message you want to send. The message should be a simple text string. This message will be stored in SQS and can be retrieved later.

For more details on additional parameters you can use, check [this link](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#sendMessage-property).

Now, let's test this command. Add a new script called sendMessage to your `package.json` file and add the following code:

~~~JSON
{
  ...
  "scripts": {
    "listQueues": "node listQueues",
    "getQueueAttributes": "node getQueueAttributes",
    "sendMessage": "node sendMessage"
  },
  ...
}
~~~

Now run the next two commands:

~~~Bash
npm run sendMessage
npm run getQueueAttributes
~~~

After running the previous command, you'll see a property called **ApproximateNumberOfMessages**. If its value is 1, it means there's one message waiting in the queue. You can also verify this information by checking the queue details on the Amazon SQS console.

~~~JSON
{
  '$metadata': {
    httpStatusCode: 200,
    requestId: '607e5260-3c23-53f7-a5fb-0ba475e18181',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Attributes: {
    QueueArn: "[YOUR_QUEUE_ARN]",
    ApproximateNumberOfMessages: '1',
    ApproximateNumberOfMessagesNotVisible: '0',
    ApproximateNumberOfMessagesDelayed: '0',
    CreatedTimestamp: '1631573601',
    LastModifiedTimestamp: '1631573601',
    VisibilityTimeout: '30',
    MaximumMessageSize: '262144',
    MessageRetentionPeriod: '345600',
    DelaySeconds: '0',
    Policy: "[YOUR_POLICY]",
    ReceiveMessageWaitTimeSeconds: '0'
  }
}
~~~

### Receiving messages from a queue

To work with Amazon SQS, you'll need to send and receive messages. Let's create a function to receive messages from SQS. Add the following code to the `SQSHelper` file:


~~~JavaScript
const {
  ...
  ReceiveMessageCommand
} = require("@aws-sdk/client-sqs");

class SQSHelper {
  ...

  receiveMessage(params) {
    return this.sqsClient.send(new ReceiveMessageCommand(params));
  }
}

module.exports = SQSHelper;
~~~

We've added a new command called ReceiveMessageCommand from the @aws-sdk/client-sqs package. This command lets you receive a message from an SQS queue.

Create a new file named `receiveMessage.js` and add the following code:

~~~JavaScript
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
~~~

To use this command, you'll need to provide the queue's URL and the maximum number of messages you want to receive. Keep in mind that the maximum number per request is 10.

For more details on additional parameters you can use, check [this link](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#receiveMessage-property).

Now, let's test this command. Add a new script called receiveMessage to your package.json file and add the following code:

~~~JSON
{
  ...
  "scripts": {
    "listQueues": "node listQueues.js",
    "getQueueAttributes": "node getQueueAttributes",
    "sendMessage": "node sendMessage",
    "receiveMessage": "node receiveMessage"
  },
  ...
}
~~~

To check what you just developed, run the following command in your terminal:

~~~Bash
npm run receiveMessage
~~~

The output will be an object containing a property called **Messages**. This property will hold an array of received messages. The first message in the array will have a body property containing the content you sent to the queue:

~~~JSON
{
  '$metadata': {
    httpStatusCode: 200,
    requestId: '6e393410-f5b6-56e2-acfb-6dd4baeabef3',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Messages: [
    {
      MessageId: '28ae9326-bb9a-4788-b35d-5e7a4b3dcc86',
      ReceiptHandle: "[YOUR_RECEIPT_HANDLE]",
      MD5OfBody: 'd66a75e8c90fcceebe7a2ff57635cba9',
      Body: '{"message":"Hello AWS SQS!"}',
      Attributes: undefined,
      MD5OfMessageAttributes: undefined,
      MessageAttributes: undefined
    }
  ]
}
~~~

Indeed, once this message reaches visibility timeout, it will be appearing once again until a consumer deletes it or the message reaches the retention period of time set.

### Deleting a message from a queue

After receiving a message from SQS, you should delete it to prevent it from being received again. Let's create a new function to delete messages. Add the following code to the `SQSHelper` file:

~~~JavaScript
const {
  ...
  DeleteMessageCommand
} = require("@aws-sdk/client-sqs");

class SQSHelper {
  ...

  deleteMessage(params) {
    return this.sqsClient.send(new DeleteMessageCommand(params));
  }
}

module.exports = SQSHelper;
~~~

We've added a new command called **DeleteMessageCommand** from the `@aws-sdk/client-sqs` package. This command lets you delete a message from an SQS queue.

Create a new file named `deleteMessage.js` in your main project folder with the following code in it:

~~~JavaScript
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
~~~

To use this command, you'll need to provide the queue's URL and the `ReceiptHandle` property that was returned when you received the message.

Now, let's test this command. Add a new script called `deleteMessage` to your `package.json` file and add the following code:

~~~JSON
{
  ...
  "scripts": {
    "listQueues": "node listQueues.js",
    "getQueueAttributes": "node getQueueAttributes",
    "sendMessage": "node sendMessage",
    "receiveMessage": "node receiveMessage",
    "deleteMessage": "node deleteMessage"
  },
  ...
}
~~~

Now, execute the next commands in your terminal:

~~~Bash
npm run deleteMessage
npm run getQueueAttributes
~~~

After running the previous command, you'll see a property called `ApproximateNumberOfMessages`. If its value is 0, it means the message has been deleted:

~~~JSON
{
  '$metadata': {
    httpStatusCode: 200,
    requestId: 'd3873207-2455-542f-a909-6bc346b0753e',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Attributes: {
    QueueArn: "[YOUR_QUEUE_ARN]",
    ApproximateNumberOfMessages: '0',
    ApproximateNumberOfMessagesNotVisible: '0',
    ApproximateNumberOfMessagesDelayed: '0',
    CreatedTimestamp: '1631573601',
    LastModifiedTimestamp: '1631573601',
    VisibilityTimeout: '30',
    MaximumMessageSize: '262144',
    MessageRetentionPeriod: '345600',
    DelaySeconds: '0',
    Policy: "[YOUR_QUEUE_POLICY]",
    ReceiveMessageWaitTimeSeconds: '0'
  }
}
~~~

## Conclusion

We've covered some fundamental methods for using Amazon SQS with Node.js. However, there are many more methods available that weren't discussed in this Workshop. Now that you have a basic understanding, you can explore the [Amazon SQS documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/) for more in-depth information.
