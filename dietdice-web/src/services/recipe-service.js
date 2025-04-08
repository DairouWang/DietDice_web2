// src/services/recipe-service.js
import { 
    PutCommand, 
    GetCommand, 
    ScanCommand, 
    UpdateCommand, 
    DeleteCommand 
  } from "@aws-sdk/lib-dynamodb";
  import { docClient, TABLE_NAME } from "../config/aws-config";
  
  // 获取所有食谱
  export const getAllRecipes = async () => {
    try {
      const command = new ScanCommand({
        TableName: TABLE_NAME,
      });
      
      const response = await docClient.send(command);
      return response.Items || [];
    } catch (error) {
      console.error("Error fetching recipes:", error);
      throw error;
    }
  };
  
  // 获取单个食谱
  export const getRecipeById = async (id) => {
    try {
      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      });
      
      const response = await docClient.send(command);
      return response.Item;
    } catch (error) {
      console.error(`Error fetching recipe with ID ${id}:`, error);
      throw error;
    }
  };
  
  // 添加新食谱
  export const addRecipe = async (recipe) => {
    try {
      // 确保食谱有一个 ID
      const newRecipe = {
        ...recipe,
        id: recipe.id || Date.now().toString(), // 使用时间戳作为唯一 ID
        createdAt: new Date().toISOString(),
      };
      
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: newRecipe,
      });
      
      await docClient.send(command);
      return newRecipe;
    } catch (error) {
      console.error("Error adding recipe:", error);
      throw error;
    }
  };
  
  // 更新食谱
  export const updateRecipe = async (id, recipeData) => {
    try {
      // 构建更新表达式
      let updateExpression = "SET ";
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};
      
      // 遍历食谱数据的每个属性
      Object.entries(recipeData).forEach(([key, value], index, array) => {
        if (key !== "id") { // 跳过 ID，因为它是主键
          const nameKey = `#${key}`;
          const valueKey = `:${key}`;
          
          updateExpression += `${nameKey} = ${valueKey}`;
          if (index < array.length - 1) updateExpression += ", ";
          
          expressionAttributeNames[nameKey] = key;
          expressionAttributeValues[valueKey] = value;
        }
      });
      
      // 添加 updatedAt 时间戳
      updateExpression += ", #updatedAt = :updatedAt";
      expressionAttributeNames["#updatedAt"] = "updatedAt";
      expressionAttributeValues[":updatedAt"] = new Date().toISOString();
      
      const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      });
      
      const response = await docClient.send(command);
      return response.Attributes;
    } catch (error) {
      console.error(`Error updating recipe with ID ${id}:`, error);
      throw error;
    }
  };
  
  // 删除食谱
  export const deleteRecipe = async (id) => {
    try {
      const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
      });
      
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error(`Error deleting recipe with ID ${id}:`, error);
      throw error;
    }
  };