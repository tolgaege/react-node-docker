export default {
  tasks: [
    {
      id: 0,
      type: "Meeting",
      title: "Meeting with Andrew Piker",
      time: "9:00"
    },
    {
      id: 1,
      type: "Call",
      title: "Call with HT Company",
      time: "12:00"
    },
    {
      id: 2,
      type: "Meeting",
      title: "Meeting with Zoe Alison",
      time: "14:00"
    },
    {
      id: 3,
      type: "Interview",
      title: "Interview with HR",
      time: "15:00"
    }
  ],
  bigStat: [
    {
      product: "Light Blue",
      total: {
        monthly: 4232,
        weekly: 1465,
        daily: 199,
        percent: { value: 3.7, profit: false }
      },
      color: "primary",
      registrations: {
        monthly: { value: 830, profit: false },
        weekly: { value: 215, profit: true },
        daily: { value: 33, profit: true }
      },
      bounce: {
        monthly: { value: 4.5, profit: false },
        weekly: { value: 3, profit: true },
        daily: { value: 3.25, profit: true }
      }
    },
    {
      product: "Sing App",
      total: {
        monthly: 754,
        weekly: 180,
        daily: 27,
        percent: { value: 2.5, profit: true }
      },
      color: "warning",
      registrations: {
        monthly: { value: 32, profit: true },
        weekly: { value: 8, profit: true },
        daily: { value: 2, profit: false }
      },
      bounce: {
        monthly: { value: 2.5, profit: true },
        weekly: { value: 4, profit: false },
        daily: { value: 4.5, profit: false }
      }
    },
    {
      product: "RNS",
      total: {
        monthly: 1025,
        weekly: 301,
        daily: 44,
        percent: { value: 3.1, profit: true }
      },
      color: "secondary",
      registrations: {
        monthly: { value: 230, profit: true },
        weekly: { value: 58, profit: false },
        daily: { value: 15, profit: false }
      },
      bounce: {
        monthly: { value: 21.5, profit: false },
        weekly: { value: 19.35, profit: false },
        daily: { value: 10.1, profit: true }
      }
    }
  ],
  // notifications: [
  //   {
  //     id: 0,
  //     icon: "thumbs-up",
  //     color: "primary",
  //     content:
  //       'Ken <span className="fw-semi-bold">accepts</span> your invitation'
  //   },
  //   {
  //     id: 1,
  //     icon: "file",
  //     color: "success",
  //     content: "Report from LT Company"
  //   },
  //   {
  //     id: 2,
  //     icon: "envelope",
  //     color: "danger",
  //     content: '4 <span className="fw-semi-bold">Private</span> Mails'
  //   },
  //   {
  //     id: 3,
  //     icon: "comment",
  //     color: "success",
  //     content: '3 <span className="fw-semi-bold">Comments</span> to your Post'
  //   },
  //   {
  //     id: 4,
  //     icon: "cog",
  //     color: "light",
  //     content: 'New <span className="fw-semi-bold">Version</span> of RNS app'
  //   },
  //   {
  //     id: 5,
  //     icon: "bell",
  //     color: "info",
  //     content:
  //       '15 <span className="fw-semi-bold">Notifications</span> from Social Apps'
  //   }
  // ],
  longPullRequests: [
    {
      id: 0,
      // number: 12,
      title: "EN-6995 ApiClients sync",
      opened_at: "11 May 2019",
      repository: "km-kube",
      link: "https://github.com/repos/kmtv/km-kube/pulls/12",
      status: "open"
    },
    {
      id: 1,
      // number: 562,
      title: "IAB update, removed hack added pull mappings from s3",
      opened_at: "4 Jun 2019",
      repository: "km-api",
      link: "https://github.com/repos/kmtv/km-api/pulls/562",
      status: "open"
    },
    {
      id: 2,
      // number: 487,
      title: "update rest-client to 2.1.0 from 1.6",
      opened_at: "27 Aug 2018",
      repository: "km-api",
      link: "https://github.com/repos/kmtv/km-api/pulls/487",
      status: "open"
    },
    {
      id: 3,
      // number: 371,
      title: "join the raw-serendipity stream with asset-values-table",
      opened_at: "19 Feb 2018",
      repository: "km-api",
      link: "https://github.com/repos/kmtv/km-api/pulls/371",
      status: "open"
    },
    {
      id: 4,
      // number: 320,
      title: "Small refactor",
      opened_at: "1 Mar 2018",
      repository: "km-api",
      link: "https://github.com/repos/kmtv/km-api/pulls/320",
      status: "open"
    }
  ],
  selfMergedPullRequests: [
    {
      id: 0,
      // number: 42,
      title: "fix: Add extra check for id",
      opened_at: "9 December 2019",
      repository: "km-cosmos",
      link: "https://github.com/repos/kmtv/km-cosmos/pulls/42",
      status: "merged"
    },
    {
      id: 1,
      // number: 721,
      title: "raise limit on VI requests to 20k",
      opened_at: "9 December 2019",
      repository: "km-api",
      link: "https://github.com/repos/kmtv/km-api/pulls/721",
      status: "merged"
    },
    {
      id: 2,
      // number: 714,
      title: "set min.insync.replicas to 2 for hammer producer",
      opened_at: "8 December 2019",
      repository: "km-api",
      link: "https://github.com/repos/kmtv/km-api/pulls/714",
      status: "merged"
    },
    {
      id: 3,
      // number: 92,
      title: "Feature/api clients is active",
      opened_at: "4 December 2019",
      repository: "km-transporter",
      link: "https://github.com/repos/kmtv/km-transporter/pulls/92",
      status: "merged"
    }
  ]
};
