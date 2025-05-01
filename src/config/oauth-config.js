// src/config/oauth-config.js
const oauthConfig = {
    // 根据你选择的OAuth提供商填写这些信息
    clientId: process.env.REACT_APP_OAUTH_CLIENT_ID,
    redirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI || `${window.location.origin}/auth/callback`,
    authorizationEndpoint: process.env.REACT_APP_OAUTH_AUTH_ENDPOINT,
    tokenEndpoint: process.env.REACT_APP_OAUTH_TOKEN_ENDPOINT,
    userInfoEndpoint: process.env.REACT_APP_OAUTH_USERINFO_ENDPOINT,
    scope: "openid profile email" // 根据需要调整
  };
  
  export default oauthConfig;