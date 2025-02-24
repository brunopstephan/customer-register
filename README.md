# Customer Register

A simple and functional customers CRUD builded in Serverless Architecture (AWS Lambda, AWS API Gateway and DynamoDB).

In this project, no production library was used except for `@aws/sdk`.

This project includes:
- Object-Oriented Programming (OOP);
- Unit Tests (Jest);
- Good practices of code and architecture;

![image](https://github.com/user-attachments/assets/110b86a0-c9af-4241-9e40-94288ef8aa43)

## Setup

Requirements:
- AWS CLI configured with your account.

After cloning the repo, install the dependencies:

```bash
yarn
```

Build the project:

```bash
yarn build
```

### Copy code to a S3 Bucket:

```bash
aws s3 mb s3://customers-crud-code

zip -r customers-crud-code.zip dist/

aws s3 cp customers-crud-code.zip s3://customers-crud-code
```

### Deploy:

Using SAM (Serverless Application Model
```
sam deploy --guided 
```

Using AWS Cloudformation:

```bash
aws cloudformation create-stack \
  --stack-name customers-crud \
  --template-body file://template.yaml \
  --capabilities CAPABILITY_NAMED_IAM
```

Or if exists:

```bash
aws cloudformation update-stack \
  --stack-name customers-crud \
  --template-body file://template.yaml \
  --capabilities CAPABILITY_NAMED_IAM
```


### Running locally:

Obs.: To run locally, you'll have to run and configure the local DynamoDB or create on AWS.

```bash
yarn start
```

