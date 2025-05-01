// src/services/auth-service.js
import axios from 'axios';
import { 
  PutCommand, 
  GetCommand,
  QueryCommand
} from "@aws-sdk/lib-dynamodb";
import { docClient, USER_TABLE, TOKEN_TABLE } from "../config/aws-config";
import oauthConfig from '../config/oauth-config';

// 存储用户信息
export const storeUser = async (userData) => {
  try {
    const command = new PutCommand({
      TableName: USER_TABLE,
      Item: {
        id: userData.sub || userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        createdAt: new Date().toISOString()
      }
    });
    
    await docClient.send(command);
    return true;
  } catch (error) {
    console.error("Error storing user:", error);
    throw error;
  }
};

// 存储令牌
export const storeTokens = async (userId, tokens) => {
  try {
    const command = new PutCommand({
      TableName: TOKEN_TABLE,
      Item: {
        userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        id_token: tokens.id_token,
        expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
        createdAt: new Date().toISOString()
      }
    });
    
    await docClient.send(command);
    return true;
  } catch (error) {
    console.error("Error storing tokens:", error);
    throw error;
  }
};

// 获取用户的令牌
export const getUserTokens = async (userId) => {
  try {
    const command = new GetCommand({
      TableName: TOKEN_TABLE,
      Key: { userId }
    });
    
    const response = await docClient.send(command);
    return response.Item;
  } catch (error) {
    console.error("Error getting user tokens:", error);
    throw error;
  }
};

// 交换授权码获取令牌
export const exchangeCodeForTokens = async (code) => {
  try {
    const tokenResponse = await axios.post(oauthConfig.tokenEndpoint, {
      grant_type: 'authorization_code',
      code,
      client_id: oauthConfig.clientId,
      redirect_uri: oauthConfig.redirectUri
    });
    
    return tokenResponse.data;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    throw error;
  }
};

// 使用令牌获取用户信息
export const getUserInfo = async (accessToken) => {
  try {
    const userInfoResponse = await axios.get(oauthConfig.userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return userInfoResponse.data;
  } catch (error) {
    console.error("Error getting user info:", error);
    throw error;
  }
};

// 刷新访问令牌
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(oauthConfig.tokenEndpoint, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: oauthConfig.clientId
    });
    
    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

// 检查用户是否已登录
export const isAuthenticated = () => {
  const tokens = JSON.parse(localStorage.getItem('auth_tokens'));
  if (!tokens) return false;
  
  // 检查令牌是否过期
  return tokens.expires_at > Math.floor(Date.now() / 1000);
};

// 登出
export const logout = () => {
  localStorage.removeItem('auth_tokens');
  localStorage.removeItem('user_info');
};