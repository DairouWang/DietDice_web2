import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

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

// 表名
export const TABLE_NAME = "DietDiceRecipes";

export { docClient };