# What is Home Panel?
Home Panel is a secure control panel accessible anywhere. Currently available only in Polish. It started as a simple local temperature monitoring system. The end goal is to expand it into a complete solution to manage things at my home such as motors, thermostats and pumps based on manual input or data gathered from sensors. It would be great to automatically open blindfolds, water my plants or simply get notified when something goes wrong without my interaction. There are existing solutions to these problems but I wanted to improve both my programming and tinkering skills.

# How to modify this project?
1. Copy `.env` to `.env.development.local` and make sure to configure everything
2. Get dependencies
    ```bash
    npm install
    ```
3. Run the following command to start a development server
    ```bash
    npm run dev
    ```

# How to create a production build?
1. Copy `.env` to `.env.production.local` and make sure to configure everything
2. Get dependencies
    ```bash
    npm install --production
    ```
3. Run the following command to start a production server
    ```bash
    npm run start
    ```
*This project was created with serverless deployment (Vercel) in mind.*
