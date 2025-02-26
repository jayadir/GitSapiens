import Project from "../models/Project";
import { Octokit } from "octokit";
import Commits from "../models/Commits";
import axios from "axios";
import { generateSummary } from "./gemini";
export const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
});

// const url = "https://github.com/docker/scout-cli";
export const getCommits = async (url) => {
  const [owner, repo] = url.split("/").slice(-2);
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });
  return data
    .sort(
      (a, b) => new Date(b.commit.author.date) - new Date(a.commit.author.date)
    )
    .map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message ?? "No message",
      url: commit.html_url,
      author: commit.commit.author.name ?? "Unknown author",
      date: commit.commit.author.date ?? "Unknown date",
      authorAvatar: commit.author?.avatar_url ?? "No avatar",
    }));
};
export const checkCommitUpdates = async (id) => {
  const project = await Project.findById(id, { repositoryUrl: 1 });
  if (!project) {
    throw new Error("Project not found");
  }
  console.log(project);
  const commits = await getCommits(project?.repositoryUrl);
  const oldCommits = await Commits.find({ projectId: id });
  const newCommits = commits.filter((commit) => {
    return !oldCommits.some((oldCommit) => oldCommit.sha === commit.sha);
  });
  const summaries = await Promise.allSettled(
    newCommits.map(async (commit) => {
      const summary = await summarize(project?.repositoryUrl, commit.sha);
      return summary;
    })
  );
  const finalSummaries=summaries.map((res)=>{
    if(res.status==="fulfilled"){
      return res.value;
    }
    return "";
  })
  const newCommitsWithSummaries=await Commits.insertMany(newCommits.map((commit,index)=>{
    console.log("commit ",index);
    return{
      projectId:id,
      message:commit.message,
      sha:commit.sha,
      url:commit.url,
      author:commit.author,
      date:commit.date,
      authorAvatar:commit.authorAvatar,
      aiSummary:finalSummaries[index]
    }
  }));
  console.log(newCommitsWithSummaries);
  return newCommitsWithSummaries;
};
export const summarize = async (url, hash) => {
  // console.log(`${url}/commit/${hash}.diff`);
  const { data } = await await axios.get(`${url}/commit/${hash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });
  const res = await generateSummary(data);
  return res;
};

export const fetchUpdatedCommits=async(id)=>{
  await checkCommitUpdates(id);
  const newCommits=await Commits.find({projectId:id});
  return newCommits;
}