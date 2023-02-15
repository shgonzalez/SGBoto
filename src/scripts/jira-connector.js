// require("dotenv").config({ path: __dirname + "../.env" });

const jiraToken = process.env.JIRA_API_TOKEN;
const jiraEmailUser = process.env.JIRA_EMAIL_USER;
const jiraHostname = process.env.JIRA_HOSTNAME;

const myTicketExample = "MYS-3";
const projectKey = "MYS";

import { Version3Client } from "jira.js";
import axios from "axios";

const jiraClient = new Version3Client({
  host: jiraHostname,
  authentication: {
    basic: {
      email: jiraEmailUser,
      apiToken: jiraToken,
    },
  },
});

// create req headers
let jiraUsername = jiraEmailUser + ":" + jiraToken;
let buff = Buffer.from(jiraUsername);
let jiraAuthString = buff.toString("base64");

const req_headers = {
  headers: {
    Authorization: "Basic " + jiraAuthString,
    "Content-Type": "application/json",
  },
};

async function getProjects() {
  const projects = await jiraClient.projects.getAllProjects();
  if (projects.length) {
    return projects;
  }
}

async function getIssue(ticketKey = myTicketExample) {
  try {
    const issue = await jiraClient.issues.getIssue({ issueIdOrKey: ticketKey });
    return issue;
  } catch (error) {
    console.log(error);
  }
}

async function getIssues(projectID = projectKey) {
  console.log(projectID);
  // const getData = await axios.get(
  //   `${jiraHostname}/rest/api/3/issue/MYS-3`,
  //     req_headers
  //   );
  // console.log("response: ", getData.data.key);
  const post_headers = {
    headers: {
      Authorization: "Basic " + jiraAuthString,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const bodyData = {
    expand: ["names", "schema", "operations"],
    fields: ["summary", "status", "assignee"],
    fieldsByKeys: false,
    jql: 'labels = on-call and issuekey != MYS-2 and status in ("To Do",Open, "In Progress") and assignee is EMPTY order by created DESC',
    maxResults: 5,
    startAt: 0,
  };
  try {
    const getData = await axios.post(
      `${jiraHostname}/rest/api/3/search`,
      bodyData,
      post_headers
    );
    const issueKeys = getData.data.issues;
    const returnData = [];
    if (issueKeys.length > 0) {
      for (let issue of issueKeys) {
        returnData.push({
          link_issue: `${jiraHostname}/browse/${issue.key}`,
          summary: issue.fields.summary,
        });
      }
    }
    return returnData;
  } catch (error) {
    console.log(error);
  }
}

async function cloneIssue(summary, label) {
  try {
    let cloneTicket = await getIssue();
    let issueLinks = cloneTicket.fields.issuelinks;
    console.log(issueLinks);
    // let { id, key } = await jiraClient.issues.createIssue({
    //   fields: {
    //     summary: summary,
    //     labels: [label],
    //     issuetype: {
    //       name: "Task",
    //     },
    //     project: {
    //       key: projectKey,
    //     },
    //     issuelinks: issueLinks,
    //   },
    // });
    // return `link Issue: ${jiraHostname}/browse/${key}`;
  } catch (error) {
    console.log(error);
  }
}

async function createIssue(summary, label) {
  try {
    let { id, key } = await jiraClient.issues.createIssue({
      fields: {
        summary: summary,
        labels: label,
        issuetype: {
          name: "Task",
        },
        project: {
          key: projectKey,
        },
      },
    });
    return `link Issue: ${jiraHostname}/browse/${key}`;
  } catch (error) {
    console.log(error);
  }
}

// module.exports = {
//   getProjects: getProjects,
//   getIssue: getIssue,
//   createIssue: createIssue,
//   cloneIssue: cloneIssue,
//   getIssues: getIssues,
// };

export default {
  getIssues,
  createIssue,
  getProjects,
};
