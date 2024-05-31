# Support.ai Backend App (Nodejs, Express, MySQL, TypeORM)

## 1. Introduction

This is the backend project of my app Support.ai an AI chatbot. I have used Node.js, Express.js for api development along with MySQL for databse. I have used typeORM database ORM. For Authentication I have used JWT tokens.

The App uses OpenAI's api to generate ai generated responses. I have mainly used 3 api's
</br> 
* Chat api: To generate text responses
* Audio Transcriptions: For Text-to-speech
* Audio Speech: For Speech-to-text


## 2. Running project
### Stable environment

1. Node version: ```14.0.0```
2. Yarn version: ```1.22.4```
3. NPM version: ```6.14.5```
4. MySQL version: ```8.0.21```

#### 2.1. Setup
1. Install packages

```$ yarn``` or ```$ yarn install```

2. Create .env file in the root folder and update some variables
```
DB_HOST={your_host}
DB_USER={your_user}
DB_PASSWORD={your_password}
DB_NAME={your_db}
PORT=5555
TOKEN_SECRET_KEY={your_key}
OPEN_API_KEY={openApi_key}
SMTP_HOST={mailtrap_host}
SMTP_PORT= 587
SMTP_USER= {mailtrap_user}
SMTP_PASS= {mailtrap_pass}
SMTP_SENDER= {mailtrap_sender_mail}
```

#### 2.2. Running
```$ yarn dev``` or ```$ npm run dev```




## 3. Roadmap

Since this is just a take home assignment there are lot more feature that can be added on a longer run

* More ways to interact with the chatbot 
* Different methods for signup
* More robust api architecture





## 4. Contact

Your Name - [@dakamihir](https://twitter.com/dakamihir) - dakamihir@gmail.com
