import path from "path";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Slack Bot
const botToken = process.env.SLACK_BOT_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;
const appToken = process.env.APP_TOKEN;

// Jira tokens
const jiraToken = process.env.JIRA_API_TOKEN;
const jiraEmailUser = process.env.JIRA_EMAIL_USER;
const jiraHostname = process.env.JIRA_HOSTNAME;

export default {
    botToken,
    signingSecret,
    appToken,
    jiraToken,
    jiraEmailUser,
    jiraHostname
}