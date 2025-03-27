"use server";
import axios from "axios";
import { auth } from "../auth";
import { fetchIssues } from "../lib/github";

export const fetch_issues = async (data) => {
  console.log("received request");
  const session = await auth();
  if (!session) {
    return;
  }
  const { state, language, sort, order, label, pageNumber } = data;
  const url = `https://api.github.com/search/issues?q=state:${state}+language:${language}+label:"${label}"&sort=${sort}&order=${order}&per_page=30&page=${pageNumber}`;
  try {
    console.log("processing request");
    const response = await fetchIssues(data)
    // console.log(response.data.items.length);
    const linkHeader=response.headers.link
    const hasNextPage=linkHeader && linkHeader.includes('rel="next"')
    // const 
    return {
      data:response.data.items,
      hasNextPage
    }
  } catch (error) {
    console.log(error);
  }
};
