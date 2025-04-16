import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";  // 新增

// AWS 配置
const config = {
  region: "us-west-2", 
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  }
};

// 创建 DynamoDB 客户端
const client = new DynamoDBClient(config);

// 创建 DynamoDB Document 客户端（提供更友好的 API）
const docClient = DynamoDBDocumentClient.from(client);

const s3Client = new S3Client(config);

export const BUCKET_NAME = "dietdice-recipe-images";

// 表名
export const TABLE_NAME = "DietDiceRecipes";

export { docClient, s3Client };