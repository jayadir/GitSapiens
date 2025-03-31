"use server";
import axios from "axios";
import { auth } from "../auth";
import { fetchIssues,fetchRepositoryIssues } from "../lib/github";
import {redis} from "../lib/redis";
export const fetch_issues = async (data) => {
  console.log("received request");
  const session = await auth();
  if (!session) {
    return;
  }
  const { state, language, sort, order, label, pageNumber } = data;
  const cacheKey = `issues:${state}:${language}:${sort}:${order}:${label}:${pageNumber}`;
  const cachedData = await redis.get(cacheKey);
  try {
    if (cachedData) {
      console.log("cache hit");
      return JSON.parse(cachedData);
    } else {
      console.log("cache miss");
    }
  } catch (error) {
    console.log("error in fetching cache", error);  
  }
  const url = `https://api.github.com/search/issues?q=state:${state}+language:${language}+label:"${label}"&sort=${sort}&order=${order}&per_page=30&page=${pageNumber}`;
  try {
    console.log("processing request");
    const response = await fetchIssues(data)
    // console.log(response.data.items.length);
    const linkHeader=response.headers.link
    const hasNextPage=linkHeader && linkHeader.includes('rel="next"')
    // const 
    const responseData = {
      data: response.data.items,
      hasNextPage
    };
    await redis.set(cacheKey, JSON.stringify(responseData), 'EX', 60 * 60 * 24); 
    return responseData
  } catch (error) {
    console.log(error);
  }
};

export const fetch_repository_issues=async (url)=>{
  const session = await auth();
  if (!session) {
    return;
  }
  const cacheKey = `repository_issues:${url}`;
  const cachedData = await redis.get(cacheKey);
  // try {
  //   if (cachedData) {
  //     console.log("cache hit");
  //     return JSON.parse(cachedData);
  //   } else {
  //     console.log("cache miss");
  //   }
  // } catch (error) {
  //   console.log("error in fetching cache", error);  
  // }
  try {
    console.log("processing request");
    const response = await fetchRepositoryIssues(url)
    console.log(response)
    // console.log(response.data.items.length);
    // const linkHeader=response.headers.link
    // const hasNextPage=linkHeader && linkHeader.includes('rel="next"')
    const responseData = {
      data: response?.data?.items,
      // hasNextPage
    };
    await redis.set(cacheKey, JSON.stringify(responseData), 'EX', 60 * 60 * 24); 
    return responseData
  } catch (error) {
    console.log(error);
  }
}