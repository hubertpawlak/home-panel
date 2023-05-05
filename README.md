# What is Home Panel?
Home Panel is a secure control panel accessible anywhere. Currently available only in Polish. It started as a simple local temperature monitoring system. The end goal is to expand it into a complete solution to manage things at my home such as motors, thermostats and pumps based on manual input or data gathered from sensors. It would be great to automatically open blindfolds, water my plants or simply get notified when something goes wrong without my interaction. There are existing solutions to these problems but I wanted to improve both my programming and tinkering skills.

Home Panel is designed to be hosted in the cloud. It depends on the following services:
- Vercel (with Edge Config)
- Supertokens (for GitHub and Google OAuth, can be self-hosted)
- Supabase (for PostgreSQL, can be self-hosted)
- Upstash (serverless Redis, used to prevent notification spam)
- Logtail (for finding rare bugs)

You probably can run it locally but it's not officially supported.

# Supported sources
- Temperature sensors
- Uninterruptible power supplies

I recommend using [universal-data-source](https://github.com/hubertpawlak/universal-data-source) as it is designed to work with Home Panel out of the box.

# Configuration
## Environment variables
Check out example [.env](.env) file and fill in the required values.

| key                      | description                                  | required |
| ------------------------ | -------------------------------------------- | -------- |
| SUPERTOKENS_CONN_URI     | Supertokens connection URI                   | **yes**  |
| SUPERTOKENS_API_KEY      | Supertokens API key                          | **yes**  |
| GITHUB_CLIENT_ID         | GitHub OAuth client ID                       | **yes**  |
| GITHUB_CLIENT_SECRET     | GitHub OAuth client secret                   | **yes**  |
| GOOGLE_CLIENT_ID         | Google OAuth client ID                       | **yes**  |
| GOOGLE_CLIENT_SECRET     | Google OAuth client secret                   | **yes**  |
| SUPABASE_URL             | Supabase instance URL                        | **yes**  |
| SUPABASE_KEY             | Supabase service key                         | **yes**  |
| JWT_PUBLIC               | JWT public key                               | **yes**  |
| JWT_PRIVATE              | JWT private key                              | **yes**  |
| VAPID_SUBJECT            | VAPID subject                                | **yes**  |
| VAPID_PUBLIC             | VAPID public key                             | **yes**  |
| VAPID_PRIVATE            | VAPID private key                            | **yes**  |
| UPSTASH_REDIS_REST_URL   | Upstash Redis REST URL                       | **yes**  |
| UPSTASH_REDIS_REST_TOKEN | Upstash Redis REST token                     | **yes**  |
| NEXT_PUBLIC_APP_URL      | Domain that will be used as part of base URL | **yes**  |
| LOGTAIL_SOURCE_TOKEN     | Logtail source token                         | **yes**  |

JWT keys can be generated by sending a GET request to `/api/trpc/seed.generateVapidKeys`.
VAPID keys can be generated by sending a GET request to `/api/trpc/seed.generateKeys`.

## Edge Config
Make sure to at least run `seed.createDefaultRoles`, log in, give yourself root by calling `seed.addRootRole` and disable seeding functions with Edge Config. Example config for both production and development environments can be found in [edgeConfig.example.json](edgeConfig.example.json).

# How to contribute?
If you want to contribute, please fork this repository, create a new branch and submit a pull request. It will be reviewed and merged if it's a good fit. You may also create an issue if you find a bug or have a feature request.

# Special thanks
...to everyone involved in the development of all the dependencies used in this project.

Check out:
- [attribution.txt](oss-attribution/attribution.txt)
- [package.json](package.json)
- special `/thanks` page in the app

to find out more.

# License
This project is licensed under the Open Software License version 3.0 - see the [LICENSE](LICENSE) file for details.
