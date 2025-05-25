## How to Run Locally

Clone the repository and install dependencies.

Create a `.env.local` file in the root directory.

Inside `.env.local`, add the following environment variables:

- `NEXT_PUBLIC_BASE_URL`: This should be your public ngrok URL that forwards to your local server on port 3000.
- `DATABASE_URL`: A connection string to a local PostgreSQL database. You can use a local database or run one using Docker.
- `QSTASH_URL`: The QStash publish URL from your Upstash account.
- `QSTASH_TOKEN`: Your QStash access token.
- `QSTASH_CURRENT_SIGNING_KEY`: The current signing key from your QStash dashboard.
- `QSTASH_NEXT_SIGNING_KEY`: The next signing key, also from your QStash dashboard.

Make sure your PostgreSQL server is running and accessible using the connection string you provide.

Start ngrok and expose port 3000. Copy the generated HTTPS URL and assign it to `NEXT_PUBLIC_BASE_URL` in your `.env.local` file.

Once your environment is set up, start the development server.

Make sure:

- Your database is up and reachable
- Ngrok is running and correctly forwarding requests to port 3000
- Your `.env.local` file is configured correctly
- Your QStash credentials are valid

You’re now ready to run the project locally.

## Interview Assignment

### Introduction

Within Sylla we have an ‘event-driven’ architecture which means that many user actions trigger certain events that in turn trigger background jobs to run. To test your skills, we’d like you to solve a ‘simplified’ version of a task on our backlog which involves message queue’s and real time data updates.

### What do you need to build

The idea is that we mimic some existing production behaviour of a PDF export. However, we’d like a postgres table to store those PDF exports and have expiring URLs such that if a user visits that URL after expiry, nothing happens.

Therefore, you have to create a simple page that has a button, that triggers a background job. This background job produces a PDF url/PDF export (this will be a dummy URL that we will specify). Then, the app would update the DB, store that ‘pdf export’, and subsequently will produce a temporary URL for downloading that. The link should expire in 120 seconds. That link, as soon as it’s available, should show up on the page where the trigger is.

**Requirements**:

- Use QStash as a message queue ([docs here](https://upstash.com/docs/qstash/overall/getstarted))
- The PDF URL that you can use is [`this url here`](https://sylla-dev-public-bucket.s3.eu-central-1.amazonaws.com/books/47f4cad9aa3c005ce22fbdef05545308495bd571c55e02f7ae69353ac831d787)
- The user never sees this source URL
- You have to define a table for these PDF exports
- Download URL expires in 120 seconds
- As soon as the database is populated with this new PDF export, we have to update the UI to show the new Download URL

**Doubts/questions**:
Please email Dennis at `dennis.stander@sylla.io`
