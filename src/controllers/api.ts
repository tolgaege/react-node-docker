import github from "octonode";
import fetch from "node-fetch";
// import NodeGit, { Repository, Commit, Revwalk, Diff } from "nodegit";
import { Response, Request, NextFunction } from "express";
import { UserStore } from "../database/stores/UserStore";
import { GithubHookStore } from "../database/stores/GithubHookStore";
// import { UserDocument } from "../models/User";
import logger from "../util/logger";
import rp from "request-promise";
import * as healthcheck from "../util/healthcheck";


// Mimic github hooks here
// Originally we are using AWS Lambda for reliability
// You can send test webhooks here: https://github.com/organizations/usehaystack/settings/apps/haystack-analytics-local/advanced
// You can see all incoming events here:https://smee.io/9T6lkRHG3tqFROb
if (process.env.NODE_ENV !== "production") {
  const Verify = require("@octokit/webhooks/verify");
  const EventSource = require("eventsource");
  const webhookProxyUrl = "https://smee.io/9T6lkRHG3tqFROb";
  const source = new EventSource(webhookProxyUrl);

  source.onmessage = async (event: any) => {
    const webhookEvent = JSON.parse(event.data);

    const sig = webhookEvent["x-hub-signature"];
    const githubEvent = webhookEvent["x-github-event"];
    const id = webhookEvent["x-github-delivery"];

    const isVerified = await Verify(process.env.GITHUB_APP_WEBHOOK_SECRET, webhookEvent.body, sig);

    if (!isVerified) {
      logger.error("Could not verify webhook");
      return;
    }

    GithubHookStore.create(false, githubEvent, webhookEvent.body);
  };
}

/**
 * GET /api
 * List of API examples.
 */
export const getApi = (req: Request, res: Response) => {
  res.render("api/index", {
    title: "API Examples",
  });
};

export const testApi = (req: Request, res: Response) => {
  const name = req.query.name || "World";
  logger.info("testapi");
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
};

export const healthCheck = async () => {
  const BASE_URL = process.env.SITE_URL || "http://haystack:5000";

  const queryParams = "?username=gadybadger";


  healthcheck.notifyStart(process.env.HEALTHCHECK_HEALTH_PING_URL);

  const options = {
      headers: {
          "User-Agent": "Request-Promise"
      },
      resolveWithFullResponse: true       
  };

  // Get Cycle Time (as a health check)
  logger.info("---pingCycleTime--------------------------"); 
  const url = `${BASE_URL}/api/analytic/cycle_time${queryParams}`;
  logger.info(`pingCycleTime: ${url}`);
  try { 
    await rp(Object.assign(options, {uri: url})).then(function(response){
      logger.info(`Status: ${response.statusCode}`); 
      if (response.statusCode==200){
         healthcheck.notifySuccess(process.env.HEALTHCHECK_HEALTH_PING_URL); 
      }
    });
  } catch (e) { 
    logger.info(`pingCycleTime Error: ${e}`); 
    healthcheck.notifyFail(process.env.HEALTHCHECK_HEALTH_PING_URL);
  }
  logger.info("------------------------------------");   

  return true;
};


// /**
//  * OAuth authentication routes. (Sign in)
//  */
// export const githubAuth = (req: any, res: Response, next: NextFunction) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Accept": "application/json",
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       client_id: process.env.GITHUB_CLIENT_ID,
//       client_secret: process.env.GITHUB_CLIENT_SECRET,
//       code: req.body.code
//     })
//   };

//   const GithubTokenURL = "https://github.com/login/oauth/access_token";

//   fetch(GithubTokenURL, options)
//   .then(r => r.json())
//   .then(json => {
//     const accessToken = json.access_token;
//     const scope = json.scope;
//     req.auth = {
//       id: accessToken
//     };
//     req.user = {
//       id: accessToken
//     };

//     const client = github.client(accessToken);
//     client.get("/user", {}, async function (err: any, status: any, data: any) {
//       if (err) {
//         logger.error("error");
//         logger.error(JSON.stringify(err));
//         next();
//         return;
//       }


//       const name = data.name;
//       const username = data.login;
//       const email = data.email;

//       const user = await UserStore.create(username, accessToken, name, email);
//       logger.info("User Created => " + JSON.stringify(user));
//       next();
//     });
//   });
// };

// export const testGit = (req: Request, res: Response) => {
//   // var asdas = 5
//   // Clone a given repository into the `./tmp` folder.
//   logger.info("cloning");
//   let cloneURL = "https://github.com/demiculus/katan.git";
//   // let cloneURL = "https://github.com/demiculus/kan-test.git";
//   let localPath = "./tmp";
//   let GITHUB_TOKEN = '3aaae9f42529847076faf1c3b631f0055acefc7b'
//   let cloneOptions = {
//     fetchOpts: {
//       callbacks: {
//         certificateCheck: function() { return 0; },
//         credentials: function() {
//           return NodeGit.Cred.userpassPlaintextNew(GITHUB_TOKEN, "x-oauth-basic");
//         }
//       }
//     }
//   };

//   // commit.author()
//   // commit.committer() // don't use this
//   // commit.time()
//   // commit.timeMs()
//   // commit.date()
//   // commit.getDiffWithOptions(options: Object, callback?: Function): Promise<Diff[]>;
//   // commit.getDiff(callback?: Function): Promise<Diff[]>;
//   // commit.body()
//   // commit.message()
//   // commit.treeId():
//   // commit.id():
//   // commit.sha():

//   // @ts-ignore
//   var cloneRepository = NodeGit.Clone(cloneURL, localPath, cloneOptions).then(function() {
//     return attemptToOpen()
//   });

//   var attemptToOpen = function() {
//     return NodeGit.Repository.open(localPath);
//   };

//   let repo: Repository
//   let commitObj: Commit
//   let walker: Revwalk

//   cloneRepository.catch(attemptToOpen)
//   .then(function(repository: Repository) {
//     // Access any repository methods here.
//     logger.info("repo");

//     let repo = repository;
//     let walker = repository.createRevWalk();
//     // walker.sorting(NodeGit.Revwalk.SORT.TIME);

//     return repository.getBranchCommit("staging").then(function(commit: Commit) {
//       logger.info("getBranchCommit");
//       commitObj = commit

//       logger.info([
//         commit.author().name(),
//         commit.committer().name(),
//         commit.author().email(),
//         commit.committer().email(),
//         commit.time(),
//         commit.timeMs(),
//         commit.date(),
//         commit.body(),
//         commit.message(),
//         commit.treeId(),
//         commit.id(),
//         commit.sha()
//       ].join('\n'))

//       walker.push(commit.id());
//     }).then(function() {
//       logger.info("here");
//       return walker.getCommits(10)
//     .then(async function(commits: Commit[]) {
//         logger.info("walking");
//         // assert.equal(commits.length, 990);

//         // @ts-ignore
//         logger.info(commits.length);
//         // logger.info(commits);
//         // let statsList = []

//         let statsList = await Promise.all(commits.map(async function (commit: Commit) {
//           return getCommitStats(commit)
//         }))
//           // for (var i = commits.length - 1; i >= 0; i--) {
//           //   let commit = commits[i]
//             // logger.info(commit.sha())
//           //   logger.info([
//           //     commit.author(),
//           //     commit.committer(),
//           //     commit.time(),
//           //     commit.timeMs(),
//           //     commit.date(),
//           //     commit.body(),
//           //     commit.message(),
//           //     commit.treeId(),
//           //     commit.id(),
//               // commit.sha()
//             // let commit = commits[0]
//             // let stats = await getCommitStats(commit)
//             // logger.info(commit.sha() + " " + JSON.stringify(stats))
//         //     statsList.push(stats)
//         //   }
//         // )

//         function getSum(total: any, stat: any) {
//           return {
//             totalContext: total.totalContext + stat.totalContext,
//             totalAdditions: total.totalAdditions + stat.totalAdditions,
//             totalDeletions: total.totalDeletions + stat.totalDeletions,
//           };
//         }

//         logger.info(JSON.stringify(statsList.reduce(getSum, {
//           totalContext: 0,
//           totalAdditions: 0,
//           totalDeletions: 0,
//         })))

//         res.send(JSON.stringify({ greeting: `Hello!` }));
//       });
//     });
//   });

// async function getCommitStats(commit: Commit): Promise<object> {
//   let totalContext = 0
//   let totalAdditions = 0
//   let totalDeletions = 0

//   logger.info('Being ' + commit.sha())

//   let diffs = await commit.getDiff()
//   await Promise.all(
//     diffs.map(async function(diff: Diff) {
//       let patches = await diff.patches()
//       await Promise.all(
//         patches.map(async function (patch: any) {
//           let lineStats = await patch.lineStats()

//           // let hunkHeaders = patch.hunks().map(function(hunk) {
//           //   return hunk.header
//           // })

//           logger.info(JSON.stringify({
//             commitSha: await commit.sha(),
//             status: patch.status(),
//             size: await patch.size(),
//             hunks: await patch.hunks(),
//             oldFile: await patch.oldFile().path(),
//             newFile: await patch.newFile().path(),
//             isUnmodified: await patch.isUnmodified(),
//             isAdded: await patch.isAdded(),
//             isDeleted: await patch.isDeleted(),
//             isModified: await patch.isModified(),
//             isRenamed: await patch.isRenamed(),
//             isCopied: await patch.isCopied(),
//             isIgnored: await patch.isIgnored(),
//             isUntracked: await patch.isUntracked(),
//             isTypeChange: await patch.isTypeChange(),
//             isUnreadable: await patch.isUnreadable(),
//             isConflicted: await patch.isConflicted(),
//           }, null, 2))

//           totalContext += lineStats.total_context
//           totalAdditions += lineStats.total_additions
//           totalDeletions += lineStats.total_deletions
//         })
//       )
//     })
//   );

//   logger.info('End' + commit.sha())

//   return {
//     totalContext: totalContext,
//     totalAdditions: totalAdditions,
//     totalDeletions: totalDeletions,
//   }
// }

  // NodeGit.Clone(cloneURL, "./tmp", cloneOptions)
  //   // Look up this known commit.
  //   .then(function(repo) {
  //     // Use a known commit sha from this repository.
  //     logger.info("repo");
  //     logger.info(JSON.stringify(repo));
  //     return repo.getCommit("643ba90d31b3364a06e5cd961fb8572a630c71a9");
  //   })
  //   // Look up a specific file within that commit.
  //   .then(function(commit) {
  //     logger.info("commit");
  //     logger.info(JSON.stringify(commit));
  //     return commit.getEntry("README.md");
  //   })
  //   // Get the blob contents from the file.
  //   .then(function(entry) {
  //     // Patch the blob to contain a reference to the entry.
  //     logger.info("entry");
  //     logger.info(JSON.stringify(entry));
  //     return entry.getBlob().then(function(blob) {
  //       blob.entry = entry;
  //       return blob;
  //     });
  //   })
  //   // Display information about the blob.
  //   .then(function(blob) {
  //     logger.info("blob");
  //     logger.info(JSON.stringify(blob));
  //     // Show the path, sha, and filesize in bytes.
  //     console.log(blob.entry.path() + blob.entry.sha() + blob.rawsize() + "b");

  //     // Show a spacer.
  //     console.log(Array(72).join("=") + "\n\n");

  //     // Show the entire file.
  //     console.log(String(blob));
  //   })
  //   .catch(function(err) { console.log(err); });

// };
