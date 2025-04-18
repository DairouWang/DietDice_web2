// src/services/s3-service.js (新文件)

import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "../config/aws-config";

// 上传图片到 S3
export const uploadImageToS3 = async (file, recipeId) => {
  try {
    // 生成唯一的文件名
    const fileExtension = file.name.split('.').pop();
    const fileName = `${recipeId}-${Date.now()}.${fileExtension}`;
    const key = `recipe-images/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    
    // 设置上传参数
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: arrayBuffer,
      ContentType: file.type,
    };
    
    // 上传文件到 S3
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // 返回文件的S3键值
    return key;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw error;
  }
};

// 生成预签名URL以获取图片
export const getImageUrl = async (key) => {
  try {
    // 如果没有键值，返回默认图片
    if (!key) {
      return '/images/default-recipe.jpg';
    }
    
    // 生成预签名URL, 链接有效期为1小时
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return '/images/default-recipe.jpg';
  }
};