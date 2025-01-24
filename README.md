# Customer Register

A simple and functional customers CRUD builded in Serverless Architecture (AWS Lambda, AWS API Gateway and DynamoDB).

In this project was not used any production lib instead of `@aws/sdk`.

This project includes:
- Object-Oriented Programming (OOP);
- Unit Tests (Jest);
- Good practices of code and architecture;

![image](https://github.com/user-attachments/assets/110b86a0-c9af-4241-9e40-94288ef8aa43)

## Setup

Requirements:
- AWS CLI configured with you account.

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

### Running:

Using SAM (Serverless Application Model
```
sam deploy --guided 
```

Using AWS Cloudformation:

```bash
aws cloudformation create-stack \
  --stack-name customers-crud \
  --template-body file://template.yml \
  --capabilities CAPABILITY_NAMED_IAM
```

Running locally (using SAM):

```
yarn start
```
