const cardContainer = document.getElementById("cardContainer");
const issuesCount = document.getElementById("issuesCount");
const allButton = document.getElementById("allButton");
const openedButton = document.getElementById("openedButton");
const ClosedButton = document.getElementById("ClosedButton");
const searchBox = document.getElementById("searchBox");
const loadingSpinner = document.getElementById("spinner");
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
  const closedIssues = issueArray.filter((issue) => issue.status === "closed");
  displayAllIssues(closedIssues);
  hideLoading();
});
openedButton.addEventListener("click", () => {
  showLoading();
  const OpenedIssues = issueArray.filter((issue) => issue.status === "open");
  displayAllIssues(OpenedIssues);
  hideLoading();
});
allButton.addEventListener("click", () => {
  showLoading();
  displayAllIssues(issueArray);
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
    div.className = `p-4 bg-white rounded-md shadow-sm border-t-4 space-y-3 border-[${issue.status == "open" ? "#00A96E" : "#A855F7"}]`;
    div.innerHTML = `
                  <div id="topOfCard" class="flex justify-between">
              <img
                src="./assets/${issue.status == "open" ? "Open-Status.png" : "Closed-Status.png"}"
                alt="status image"
                class="w-[10%] rounded-full"
              />
<div class="badge badge-soft ${issue.priority == "high" ? "badge-secondary" : issue.priority == "medium" ? "badge-warning" : issue.priority == "low" ? "badge-primary" : "NO priority set"}">${issue.priority}</div>
            </div>
            <div id="middleOfCard" class="space-y-3">
              <h2 class="font-semibold text-[20px]">
                ${issue.title}
              </h2>
              <p class="text-[#64748B] loading-2">
              ${issue.description}
              </p>
              <div>
                ${labels}
              </div>
            </div>
            <hr class="border-gray-400 mt-6" />
            <div id="bottomOfCard" class="space-y-2 text-[14px">
              <div class="flex justify-between">
                <p id="author" class="text-[#64748B]">#${issue.id} by ${issue.author}</p>
                <p id="date" class="text-[#64748B]">${new Date(issue.createdAt).toLocaleDateString("en-US")}</p>
              </div>
            </div>
            <div class="flex justify-between">
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
});

loadAllIssues();
