// import { RTMClient } from "@slack/rtm-api";
import pkg from '@slack/bolt';
const { App } = pkg;
//import { App } from "@slack/bolt";
//import { Version3Client } from "jira.js";
//const jiraConnector = require("./scripts/jira-connector.cjs");
import jiraConnector from "./scripts/jira-connector.js";
// Slack Bot
// const botToken = process.env.SLACK_BOT_TOKEN;
// const signingSecret = process.env.SLACK_SIGNING_SECRET;
// const appToken = process.env.APP_TOKEN;

import config from "./config.js"

const app = new App({
  token: config.botToken,
  signingSecret: config.signingSecret,
  socketMode: true, // enable the following to use socket mode
  appToken: config.appToken,
});

// app.message("!sgboto", async ({ message, say }) => {
//   // say() sends a message to the channel where the event was triggered
//   console.log(message);
//   await say(`Hola, te saluda Mauricio y Wheels :dog: <@${message.user}>!`);
// });

app.message(/^!bot jira projects$/, async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  console.log(message);
  let projects = await jiraConnector.getProjects();
  console.log(projects);
  let projectsRetrieved = [];
  for (let project of projects) {
    console.log(project.name);
    projectsRetrieved.push(project.name);
  }
  console.log(projects);
  //   projects.then((result) => console.log(result));
  if (projects) {
    console.log(projectsRetrieved);
    await say(
      `Hola, estos son los proyectos :jira: ${projectsRetrieved}`
    );
  }
});

app.message(
  /^!bot jira create issue (.*) summary: (.*)$/,
  async ({ message, context, say }) => {
    // say() sends a message to the channel where the event was triggered
    // console.log(context);
    //   let projects = await jiraConnector.getIssue();
    //   console.log(projects.fields.issuelinks);
    // console.log(context);
    let label = context.matches[1].split(",");
    let summary = context.matches[2];
    let issue = await jiraConnector.createIssue(summary, label);
    await say(`Hola, <@${message.user}>! tu ticket esta en ${issue} :jira:`);
  }
);

app.message(/^!bot jira issues(.*)$/, async ({ message, context, say }) => {
  // console.log(context, message);
  let projectID = context.matches[1];
  let summary = context.matches[2];
  let issues = await jiraConnector.getIssues();
  console.log(issues);
  if (issues.length == 0) {
    await say(`Hola, <@${message.user}>! No hay tareas pendientes :jira:`);
  } else {
    let messageData = ""
    for (let issue of issues) {
      messageData += `summary: ${issue.summary}\nlink: ${issue.link_issue}\n\n`
    }
    await say(`Hola, <@${message.user}>! tareas pendientes :jira:\n ${messageData}`);
  }
  
});

app.message(/^!bot (hi|hello|hey)$/, async ({ message, context, say }) => {
  // RegExp matches are inside of context.matches
  console.log(message, context);
  const greeting = context.matches[0];

  await say(`<@${message.user}>, como estas?`);
});

(async () => {
  // Start your app
  await app.start();

  console.log("⚡️ Bolt app is running!");
})();

export default app;