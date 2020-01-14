import logger from "../util/logger";
import { PullRequest } from "../database/entity/PullRequest";
import { PullRequestCommit } from "../database/entity/PullRequestCommit";
import { Commit } from "../database/entity/Commit";

/**************************** Cycle Time ****************************/

const getFirstCommitDate = (commits: Commit[]): Date => {
    const minCommit = commits.reduce((a: Commit, b: Commit) => { return a.date < b.date ? a : b; });
    return minCommit.date;
};

// Return either closed or merged of a pull reqest
// If the PR is still open, it returns undefined
const getPullRequestClosedOrMergedDate = (pullRequest: PullRequest): Date => {
    const epoch = new Date(1970, 1, 1);
    if (pullRequest.prMergedAt > epoch) {
      return pullRequest.prMergedAt;
    } else if (pullRequest.prClosedAt > epoch) {
      return pullRequest.prClosedAt;
    } else {
      return undefined;
    }
};

const getCommitReworkStartEndDates = (commits: Commit[], pullRequest: PullRequest): any => {
    let reworkDates: any;
    const filteredCommits = commits.filter((commit: Commit) => {
      return new Date(commit.date).getTime() > new Date(pullRequest.prCreatedAt).getTime();
    });

    // If not commit exist, return empty date
    // TODO: This might be wrong
    if (!filteredCommits.length) {
      return { min: 0 ,max: 0 };
    }

    const minCommitAfterPR = filteredCommits.reduce((a: Commit, b: Commit) => { return a.date < b.date ? a : b; });
    const maxCommitAfterPR = filteredCommits.reduce((a: Commit, b: Commit) => { return a.date > b.date ? a : b; });

    return { min: minCommitAfterPR.date ,max: maxCommitAfterPR.date };
};

export const analyzeCycleTime = (pullRequestList: PullRequest[]): any => {
  const dataHolder = [];
  for (const pullRequest of pullRequestList) {
    const commits: Commit[] = pullRequest.pullRequestCommits.map((commitWrapper: PullRequestCommit) => { return commitWrapper.commit; });

    // We have this check because Julian somehow did a PR withouut commits
    // @ts-ignore
    if (commits == "") {
      continue;
    }

    // Check if PR is closed or merged
    if (pullRequest.state == "open") {
      continue;
    }

    const filterDate = pullRequest.prCreatedAt;
    const filterRepository = pullRequest.repository.name;
    const filterMember = pullRequest.creator.name;
    let filterTeam: string[] = [];
    if (pullRequest.creator.teamMembers.length > 0 && pullRequest.creator.teamMembers[0].team != null) {
      filterTeam = pullRequest.creator.teamMembers.map((wrapper) => { return wrapper.team.name; });
    }

    // Development Time
    const firstCommitDate = getFirstCommitDate(commits);
    const pullRequestOpenDate = pullRequest.prCreatedAt;
    const developmentTime = pullRequestOpenDate.getTime() - firstCommitDate.getTime();

    // Rework Time
    const reworkDates = getCommitReworkStartEndDates(commits, pullRequest);
    const reworkTime = reworkDates.max - reworkDates.min;

    // Review Time
    const prFinishDate = getPullRequestClosedOrMergedDate(pullRequest);
    const reviewTime = prFinishDate.getTime() - pullRequestOpenDate.getTime();

    dataHolder.push({
        filter: {
            date: filterDate,
            repository: filterRepository,
            team: filterTeam,
            member: filterMember
        },
        developmentTime: developmentTime,
        reworkTime: reworkTime,
        reviewTime: reviewTime,
    });
  }

  return dataHolder;
};

/**************************** Throughput ****************************/

export const analyzeThroughput = (pullRequestList: PullRequest[]): any => {
  const dataHolder = [];
  for (const pullRequest of pullRequestList) {
    const filterDate = pullRequest.prCreatedAt;
    const filterRepository = pullRequest.repository.name;
    const filterMember = pullRequest.creator.name;
    let filterTeam: string[] = [];
    if (pullRequest.creator.teamMembers.length > 0 && pullRequest.creator.teamMembers[0].team != null) {
      filterTeam = pullRequest.creator.teamMembers.map((wrapper) => { return wrapper.team.name; });
    }

    let state = pullRequest.state;

    const epoch = new Date(1970, 1, 1);
    if (state == "closed" && pullRequest.prMergedAt > epoch) {
        state = "merged";
    }

    dataHolder.push({
        filter: {
            date: filterDate,
            repository: filterRepository,
            team: filterTeam,
            member: filterMember
        },
        state: state,
    });
  }

  return dataHolder;
};

/**************************** Heatmap ****************************/

export const analyzeActivityHeatmap = (pullRequestList: PullRequest[]): any => {
  const dataHolder = [];
  for (const pullRequest of pullRequestList) {
    const commits: Commit[] = pullRequest.pullRequestCommits.map((commitWrapper: PullRequestCommit) => { return commitWrapper.commit; });

    // We have this check because Julian somehow did a PR withouut commits
    // @ts-ignore
    if (commits == "") {
      continue;
    }

    const filterDate = pullRequest.prCreatedAt;
    const filterRepository = pullRequest.repository.name;
    const filterMember = pullRequest.creator.name;
    let filterTeam: string[] = [];
    if (pullRequest.creator.teamMembers.length > 0 && pullRequest.creator.teamMembers[0].team != null) {
      filterTeam = pullRequest.creator.teamMembers.map((wrapper) => { return wrapper.team.name; });
    }

    const thinCommits = commits.map((commit: Commit) => { return commit.date; });

    dataHolder.push({
        filter: {
            date: filterDate,
            repository: filterRepository,
            team: filterTeam,
            member: filterMember
        },
        commits: thinCommits,
    });
  }

  return dataHolder;
};
/**************************** Sprint Report ****************************/

export const analyzeSprintReport = (pullRequestList: PullRequest[]): any => {
  const dataHolder = [];
  for (const pullRequest of pullRequestList) {
    const filterDate = pullRequest.prCreatedAt;
    const filterRepository = pullRequest.repository.name;
    const filterMember = pullRequest.creator.name;
    let filterTeam: string[] = [];
    if (pullRequest.creator.teamMembers.length > 0 && pullRequest.creator.teamMembers[0].team != null) {
      filterTeam = pullRequest.creator.teamMembers.map((wrapper) => { return wrapper.team.name; });
    }

    dataHolder.push({
        filter: {
            date: filterDate,
            repository: filterRepository,
            team: filterTeam,
            member: filterMember
        },
        data: {
            number: pullRequest.number,
            title: pullRequest.title,
            prCreatedAt: pullRequest.prCreatedAt,
            prClosedAt: pullRequest.prClosedAt,
            prMergedAt: pullRequest.prMergedAt,
            state: pullRequest.state,
            repositoryName: pullRequest.repository.name,
            url: pullRequest.url,
        },
    });
  }

  return dataHolder;
};
