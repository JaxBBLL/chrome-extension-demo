import "./content.css";
import Message from "./message";

const oWrap = document.createElement("div");
oWrap.classList.add("e-container");

oWrap.innerHTML =
  '<div><button class="e-button login" type="button">Link to baidu</button><button class="e-button go" type="button">触发</button></div>';
document.body.appendChild(oWrap);

(oWrap.querySelector(".login") as Element).addEventListener("click", () => {
  chrome.runtime.sendMessage({ from: "content", type: "START" });
});

(oWrap.querySelector(".go") as Element).addEventListener("click", () => {
  chrome.runtime.sendMessage({ from: "content", type: "ACTION" });
  Message.success("Message");
});
