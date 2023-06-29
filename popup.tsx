import { useState } from "react"
import { sendToContentScript } from "@plasmohq/messaging"
import { useChromeStorageLocal } from "use-chrome-storage";
import "./ToggleSwitch.css";

const extName = "Purpose Mode";

function setBool(key: string, value: boolean) {
    console.log("Setting '" + key + "' to '" + value + "'.");
    chrome.storage.local.set({key: JSON.stringify(value)});
}

function ToggleSwitch({ label, storage_var, checked, update }) {
  return (
    <div className="container">
      <div className="container-child">
        {label}{" "}
      </div>

      <div className="toggle-switch">
        <input type="checkbox"
               className="checkbox"
               name={label}
               id={label}
               checked={checked}
               onChange={(e) => {
                 update(e.target.checked);
                 setBool(storage_var, e.target.checked);
                 const resp = sendToContentScript({
                  name: "toggle",
                  body: {"button": storage_var, "state": e.target.checked}
                })
               }} />

        <label className="label" htmlFor={label}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
}

function GlobalSwitches() {
  const [desaturate, setDesaturate] =
    useChromeStorageLocal("Desaturate", false);
  const [compact, setCompact] =
    useChromeStorageLocal("Compact", false);

  return (
    <div>
    <hr />
    <ToggleSwitch
      label="Desaturate"
      storage_var="Desaturate"
      checked={desaturate}
      update={setDesaturate}
    />
    <ToggleSwitch
      label="Compact"
      storage_var="Compact"
      checked={compact}
      update={setCompact}
    />
    <hr />
    </div>
  );
}

function TwitterSwitches() {
  const [readOnly, setReadOnly] =
    useChromeStorageLocal("TwitterReadOnly", false);
  const [hideClutter, setHideClutter] =
    useChromeStorageLocal("hide-clutter", false);

  return (
    <div>
      Twitter:
      <ToggleSwitch
        label="Read only"
        storage_var="TwitterReadOnly"
        checked={readOnly}
        update={setReadOnly}
      />
      <ToggleSwitch
        label="Hide clutter"
        storage_var="TwitterHideClutter"
        checked={hideClutter}
        update={setHideClutter}
      />
    <hr />
    </div>
  )
}

function IndexPopup() {
  const [enabled, setEnabled] = useChromeStorageLocal("Enable", false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        width: "300px"
      }}>

      <h2>{extName}</h2>

      <ToggleSwitch
        label="Enable"
        storage_var="Enable"
        checked={enabled}
        update={setEnabled}
      />
      { enabled && <div><GlobalSwitches /> <TwitterSwitches /></div>}

      <a href="https://github.com/brave-experiments/purpose-mode"
         target="_blank">
        GitHub
      </a>
    </div>
  )
}

export default IndexPopup