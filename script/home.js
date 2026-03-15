const cardContainer = document.getElementById("cardContainer");
const issuesCount = document.getElementById("issuesCount");
const allButton = document.getElementById("allButton");
const openedButton = document.getElementById("openedButton");
const ClosedButton = document.getElementById("ClosedButton");
const searchBox = document.getElementById("searchBox");
const loadingSpinner = document.getElementById("spinner");
const cardModalOpen = document.getElementById("cardModal");
const modalAssignee = document.getElementById("modalAssignee");
const modalPriority = document.getElementById("modalPriority");
const modalDescription = document.getElementById("modalDescription");
const modalLables = document.getElementById("modalLables");
const modalCreateDate = document.getElementById("modalCreateDate");
const modalAuthor = document.getElementById("modalAuthor");
const modalBadge = document.getElementById("modalBadge");
const modalTitle = document.getElementById("modalTitle");
const newIssueButton = document.getElementById("newIssue");
const newModal = document.getElementById("newModal");
const newIssueTitle = document.getElementById("newIssueTitle");
const newIssueDescription = document.getElementById("newIssueDescription");
const newIssuePirority = document.getElementById("newIssuePirority");
const labelBug = document.getElementById("labelBug");
const labelHelpWanted = document.getElementById("labelHelpWanted");
const labelEnhancement = document.getElementById("labelEnhancement");
const labelDocumentation = document.getElementById("labelDocumentation");
const labelFirstIssue = document.getElementById("labelFirstIssue");
const newIssueAuthor = document.getElementById("newIssueAuthor");
const createIssueBtn = document.getElementById("createIssueBtn");
const modalUPdated = document.getElementById("Updated");
let localIssues = [];

newIssueButton.addEventListener("click", () => {
  // window.location.assign("./newIssue.html");
  newModal.showModal();
});

let issueArray = [];

function showLoading() {
  loadingSpinner.classList.remove("hidden");
  loadingSpinner.classList.add("grid");
  cardContainer.innerHTML = "";
}
function hideLoading() {
  loadingSpinner.classList.add("hidden");
}

async function loadAllIssues() {
  // showLoading();
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await res.json();
  issueArray = data.data;
  displayAllIssues(data.data);
  hideLoading();
}

function buttonColor(id) {
  allButton.classList.add("btn-primary");
  openedButton.classList.add("btn-primary");
  ClosedButton.classList.add("btn-primary");

  allButton.classList.remove("btn-primary");
  openedButton.classList.remove("btn-primary");
  ClosedButton.classList.remove("btn-primary");

  const selected = document.getElementById(id);
  selected.classList.add("btn-primary");
}

ClosedButton.addEventListener("click", () => {
  showLoading();
  const allIssues = [...issueArray, ...localIssues];
  const closedIssues = allIssues.filter((issue) => issue.status === "closed");
  displayAllIssues(closedIssues);
  hideLoading();
});

openedButton.addEventListener("click", () => {
  showLoading();
  const allIssues = [...issueArray, ...localIssues];
  const openedIssues = allIssues.filter((issue) => issue.status === "open");
  displayAllIssues(openedIssues);
  hideLoading();
});

allButton.addEventListener("click", () => {
  showLoading();
  displayAllIssues([...issueArray, ...localIssues]);
  hideLoading();
});

function displayAllIssues(issues) {
  cardContainer.innerHTML = "";
  issuesCount.innerText = issues.length;
  issues.forEach((issue) => {
    const labels = issue.labels
      .map((label) => {
        let colorClass = "primary";
        if (label.toLowerCase() === "bug")
          colorClass = "badge badge-outline badge-error badge-lg";
        if (label.toLowerCase() === "help wanted")
          colorClass = "badge badge-outline badge-warning badge-lg";
        if (label.toLowerCase() === "good first issue")
          colorClass = "badge badge-outline badge-primary badge-lg";
        if (label.toLowerCase() === "enhancement")
          colorClass = "badge badge-outline badge-accent badge-lg";
        if (label.toLowerCase() === "documentation")
          colorClass = "badge badge-outline badge-info badge-lg";

        return `<span class="px-4 rounded-full py-[6px] border-[1px] ${colorClass}">${label}</span>`;
      })
      .join(" ");
    const div = document.createElement("div");
    div.className = `card p-4 bg-white rounded-md shadow-sm border-t-4 space-y-3 border-[${issue.status == "open" ? "#00A96E" : "#A855F7"}]`;
    div.innerHTML = `
                  <div onclick="openModal(${issue.id})" id="topOfCard" class="flex justify-between">
              <div class='flex'><img
                src="./assets/${issue.status == "open" ? "Open-Status.png" : "Closed-Status.png"}"
                alt="status image"
                class="w-[100%] rounded-full"
              />
              <h2 class='${issue.status == "open" ? "badge badge-soft badge-lg badge-success" : "badge badge-soft badge-lg badge-error"}'>${issue.status}</h2>
              </div>
<div onclick="openModal(${issue.id})" class="badge rounded-full ${issue.priority == "high" ? "badge-secondary" : issue.priority == "medium" ? "badge-warning" : issue.priority == "low" ? "badge-primary" : "NO priority set"}">${issue.priority}</div>
            </div>
            <div id="middleOfCard" class="space-y-3">
              <h2 onclick="openModal(${issue.id})" class="font-semibold text-[20px]">
                ${issue.title}
              </h2>
              <p onclick="openModal(${issue.id})" class="text-[#64748B] loading-2">
              ${issue.description}
              </p>
              <div onclick="openModal(${issue.id})">
                ${labels}
              </div>
            </div>
            <hr class="border-gray-400 mt-6" />
            <div onclick="openModal(${issue.id})" id="bottomOfCard" class="space-y-2 text-[14px">
              <div onclick="openModal(${issue.id})" class="flex justify-between">
                <p id="author" class="text-[#64748B]">#${issue.id} by ${issue.author}</p>
                <p id="date" class="text-[#64748B]">${new Date(issue.createdAt).toLocaleDateString("en-US")}</p>
              </div>
            </div>
            <div onclick="openModal(${issue.id})" class="flex justify-between">
              <p id="assignee" class="text-[#64748B]">Assignee: ${issue.assignee ? issue.assignee : "No assignee"}</p>
              <p id="update" class="text-[#64748B]">Updated: ${new Date(issue.updatedAt).toLocaleDateString("en-US")}</p>
            </div>
          </div>
      `;
    cardContainer.appendChild(div);
  });
}

searchBox.addEventListener("input", async (event) => {
  const url = ` https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${event.target.value}`;
  // console.log(url);
  const res = await fetch(url);
  const filteredData = await res.json();
  if (event.target.value != "") {
    displayAllIssues(filteredData.data);
  } else {
    loadAllIssues();
  }
  if (issuesCount.innerText == "0") {
    cardContainer.innerHTML = `<h2 class="text-center text-4xl font-bold col-span-4 p-10">No Matching Issues</h2>`;
  }
});

async function openModal(issueId) {
  let cardDetails;

  const localIssue = localIssues.find((issue) => issue.id === issueId);
  // console.log(localIssue);
  if (localIssue) {
    cardDetails = localIssue;
  } else {
    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`,
    );
    const data = await res.json();
    cardDetails = data.data;
  }

  const labels = cardDetails.labels
    .map((label) => {
      let colorClass = "primary";
      if (label.toLowerCase() === "bug")
        colorClass = "badge badge-outline badge-error badge-lg";
      if (label.toLowerCase() === "help wanted")
        colorClass = "badge badge-outline badge-warning badge-lg";
      if (label.toLowerCase() === "good first issue")
        colorClass = "badge badge-outline badge-primary badge-lg";
      if (label.toLowerCase() === "enhancement")
        colorClass = "badge badge-outline badge-accent badge-lg";
      if (label.toLowerCase() === "documentation")
        colorClass = "badge badge-outline badge-info badge-lg";

      return `<span class="px-4 rounded-full py-[6px] border-[1px] ${colorClass}">${label}</span>`;
    })
    .join(" ");

  modalTitle.innerText = cardDetails.title;
  modalDescription.innerText = cardDetails.description;
  modalAuthor.innerText = cardDetails.author;
  modalAssignee.innerText = `${cardDetails.assignee ? cardDetails.assignee : "No assignee"}`;
  modalCreateDate.innerText = new Date(
    cardDetails.createdAt,
  ).toLocaleDateString("en-US");
  modalBadge.innerText = cardDetails.status;
  modalBadge.className = `badge ${cardDetails.status == "open" ? "badge-success" : "badge-primary"} badge-md rounded-full`;
  modalLables.innerHTML = `${labels}`;
  modalPriority.innerHTML = cardDetails.priority;
  modalPriority.className = `badge ${cardDetails.priority == "high" ? "badge-secondary" : cardDetails.priority == "medium" ? "badge-warning" : cardDetails.priority == "low" ? "badge-primary" : "NO priority set"} rounded-full`;
  modalUPdated.innerText = `${new Date(cardDetails.updatedAt).toLocaleDateString("en-US")}`;
  cardModalOpen.showModal();
}

loadAllIssues();

searchBox.addEventListener("click", () => {
  searchBox.classList.remove(`max-sm:w-1`);
});

createIssueBtn.addEventListener("click", () => {
  let issue = {
    id: "",
    title: "",
    description: "",
    priority: "",
    labels: [],
    author: "",
    createdAt: "",
    status: "open",
    updatedAt: "",
    assignee: "",
  };
  issue.title = newIssueTitle.value;
  issue.description = newIssueDescription.value;
  issue.priority =
    newIssuePirority.value != "Choose from here" ? newIssuePirority.value : "";
  labelBug.checked ? issue.labels.push("bug") : "";
  labelHelpWanted.checked ? issue.labels.push("help wanted") : "";
  labelEnhancement.checked ? issue.labels.push("enhancement") : "";
  labelDocumentation.checked ? issue.labels.push("documentation") : "";
  labelFirstIssue.checked ? issue.labels.push("good first issue") : "";
  issue.author = newIssueAuthor.value;
  issue.id = Number(issuesCount.innerText) + 1;
  issue.createdAt = new Date().toISOString();
  issue.updatedAt = new Date().toISOString();

  // console.log(issue);
  // console.log(issue.labels);

  const labels = issue.labels
    .map((label) => {
      let colorClass = "primary";
      if (label.toLowerCase() === "bug")
        colorClass = "badge badge-outline badge-error badge-lg";
      if (label.toLowerCase() === "help wanted")
        colorClass = "badge badge-outline badge-warning badge-lg";
      if (label.toLowerCase() === "good first issue")
        colorClass = "badge badge-outline badge-primary badge-lg";
      if (label.toLowerCase() === "enhancement")
        colorClass = "badge badge-outline badge-accent badge-lg";
      if (label.toLowerCase() === "documentation")
        colorClass = "badge badge-outline badge-info badge-lg";

      return `<span class="px-4 rounded-full py-[6px] border-[1px] ${colorClass}">${label}</span>`;
    })
    .join(" ");
  const div = document.createElement("div");
  div.className = `card p-4 bg-white rounded-md shadow-sm border-t-4 space-y-3 border-[${issue.status == "open" ? "#00A96E" : "#A855F7"}]`;
  div.innerHTML = `
                  <div onclick="openModal(${issue.id})" id="topOfCard" class="flex justify-between">
              <div class='flex'><img
                src="./assets/${issue.status == "open" ? "Open-Status.png" : "Closed-Status.png"}"
                alt="status image"
                class="w-[100%] rounded-full"
              />
              <h2 class='${issue.status == "open" ? "badge badge-soft badge-lg badge-success" : "badge badge-soft badge-lg badge-error"}'>${issue.status}</h2>
              </div>
<div onclick="openModal(${issue.id})" class="badge rounded-full ${issue.priority == "high" ? "badge-secondary" : issue.priority == "medium" ? "badge-warning" : issue.priority == "low" ? "badge-primary" : "NO priority set"}">${issue.priority}</div>
            </div>
            <div id="middleOfCard" class="space-y-3">
              <h2 onclick="openModal(${issue.id})" class="font-semibold text-[20px]">
                ${issue.title}
              </h2>
              <p onclick="openModal(${issue.id})" class="text-[#64748B] loading-2">
              ${issue.description}
              </p>
              <div onclick="openModal(${issue.id})">
                ${labels}
              </div>
            </div>
            <hr class="border-gray-400 mt-6" />
            <div onclick="openModal(${issue.id})" id="bottomOfCard" class="space-y-2 text-[14px">
              <div onclick="openModal(${issue.id})" class="flex justify-between">
                <p id="author" class="text-[#64748B]">#${issue.id} by ${issue.author}</p>
                <p id="date" class="text-[#64748B]">${new Date(issue.createdAt).toLocaleDateString("en-US")}</p>
              </div>
            </div>
            <div onclick="openModal(${issue.id})" class="flex justify-between">
              <p id="assignee" class="text-[#64748B]">Assignee: ${issue.assignee ? issue.assignee : "No assignee"}</p>
              <p id="update" class="text-[#64748B]">Updated: ${new Date(issue.updatedAt).toLocaleDateString("en-US")}</p>
            </div>
          </div>
      `;
  cardContainer.appendChild(div);
  issuesCount.innerText = Number(issuesCount.innerText) + 1;
  localIssues.push(issue);
  newModal.close();
});
