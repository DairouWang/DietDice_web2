// src/services/auth-service.js
import { 
  getCurrentUser, 
  fetchUserAttributes,
  fetchAuthSession,
  signOut 
} from 'aws-amplify/auth';
import { 
  PutCommand, 
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { docClient, USER_TABLE } from "../config/aws-config";

// 存储用户信息到 DynamoDB
export const storeUser = async (userData) => {
  try {
    const command = new PutCommand({
      TableName: USER_TABLE,
      Item: {
        id: userData.userId || userData.username,
        email: userData.email,
        name: userData.name || userData.email?.split('@')[0] || 'User',
        picture: userData.picture || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
    
    await docClient.send(command);
    return true;
  } catch (error) {
    console.error("Error storing user:", error);
    throw error;
  }
};

// 从 DynamoDB 获取用户信息
export const getUser = async (userId) => {
  try {
    const command = new GetCommand({
      TableName: USER_TABLE,
      Key: { id: userId }
    });
    
    const response = await docClient.send(command);
    return response.Item;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

// 获取当前认证用户信息
export const getCurrentAuthUser = async () => {
  try {
    const user = await getCurrentUser();
    const attributes = await fetchUserAttributes();
    
    return {
      username: user.username,
      userId: user.userId,
      email: attributes.email,
      name: attributes.name || attributes.email?.split('@')[0] || 'User',
      picture: attributes.picture || null,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};

// 获取当前会话和令牌
export const getCurrentSession = async () => {
  try {
    const session = await fetchAuthSession();
    return {
      tokens: session.tokens,
      credentials: session.credentials,
      identityId: session.identityId,
    };
  } catch (error) {
    console.error("Error getting session:", error);
    throw error;
  }
};

// 检查用户是否已登录
export const isAuthenticated = async () => {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
};

// 登出
export const logout = async () => {
  try {
    await signOut();
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};