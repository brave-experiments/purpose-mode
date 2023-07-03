const states = [
  "disabled",
  "purpose_mode"
  // "reader_mode"
];

// If the user enables Purpose Mode while on a page, inject the content script
// into the current page.
document.getElementById("purpose_mode").addEventListener("click", onExtEnable);
// Update state when the user enables or disables the extension.
states.forEach(function(state) {
  document.getElementById(state).addEventListener("click", onExtStateChange);
})

// Initialize the buttons with our previously-saved state.
retrieveButtonState()

async function onExtEnable() {
  let queryOptions = {
    active: true,
    currentWindow: true
  };
  let tab = await chrome.tabs.query(queryOptions);
  let url = new URL(tab[0].url);
  let result = await chrome.storage.local.get(["supportedSites"]);
  if (!result.supportedSites.includes(url.hostname)) {
    console.log("Not injecting content script into unsupported site.");
    return
  }

  await chrome.scripting.executeScript({
    target: {
      tabId: tab[0].id
    },
    files: ["content-script.js"]
  });
  console.log("Injected content script into: " + url);
}

function onExtStateChange(event) {
  let state = event.srcElement.id;
  chrome.storage.local.set({"state": state}).then(
    console.log("Set extension state to: " + state)
  )
}

function retrieveButtonState() {
  chrome.storage.local.get(["state"], (result) => {
    document.getElementById(result.state).checked = true;
    console.log("Set button state to: " + result.state);
  })
}

// message handling
var myPort = chrome.runtime.connect({ name: 'port-from-cs' });

//show menu
function switchMenu() {
  var dropdown_setting = document.getElementById("dropdown_setting");
  var dropdown_setting_class = dropdown_setting.getAttribute('class');
  if (dropdown_setting_class == "dropdown is-right") {
    dropdown_setting.setAttribute('class', "dropdown is-right is-active");
  }
  else {
    dropdown_setting.setAttribute('class', "dropdown is-right");
  }
}

//test notification
function testNotification() {
  var message = {
    'type': 'test notification',
  };
  myPort.postMessage(message);
  document.getElementById('dropdown_setting').setAttribute('class', 'dropdown is-right');
}

function openQuestionnaire(e) {
  /*insert fake data for demo purpose*/
  //get current time
  var date = new Date(Date.now());
  var current_time = date.toString().replace(/ \(.*\)/ig, '');//.replace(/(-|:|\.\d*)/g,'');//format: yyyyMMddThhmmssZ eg:19930728T183907Z
  var esm = {};
  esm['esm_site'] = "Twitter";
  esm['esm_time'] = current_time;
  
  var distractions = {};
  distractions['has_infinite_scrolling'] = 0;
  distractions['has_autoplay'] = 0;
  distractions['has_notifications'] = 0;
  distractions['has_recommendations'] = 0;
  distractions['has_cluttered_UI'] = 0;
  distractions['has_colorfulness'] = 0;
  esm['distractions'] = distractions;
  chrome.storage.local.set({"sampled_esm": esm}).then(
    console.log(esm)
  );
  /*END*/
  
  // open ESM interface
  var message = { type: "open questionnaire" };
  myPort.postMessage(message);
}

document.getElementById('setting_trigger').addEventListener("click", switchMenu);
document.getElementById('test_notification').addEventListener("click", testNotification);
document.getElementById('questionnaire').addEventListener("click", openQuestionnaire);