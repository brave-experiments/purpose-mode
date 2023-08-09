import { useChromeStorageLocal } from "use-chrome-storage";

import "../mystyles.css";
import facebookIcon from "data-base64:~assets/Facebook.png";
import twitterIcon from "data-base64:~assets/Twitter.png";
import linkedInIcon from "data-base64:~assets/LinkedIn.png";
import youTubeIcon from "data-base64:~assets/YouTube.png";
import axios from 'axios';

function SkipButton({size}){
    
    return(
        <button className={"button is-warning "+size}
            onClick={(e) => {
                var con = confirm("Are you sure to skip and quit this questionnaire?");
                if (con) {
                    chrome.storage.local.get(["sampled_feature_questioinnaire"]).then(function (questionnaire_status) {
                        chrome.storage.local.set({"sampled_esm": null}); // reset sampled ESM
                        if(questionnaire_status.sampled_feature_questioinnaire === null){
                            chrome.action.setBadgeText({ text: "" }); // remove badge notification
                        }
                        //close the window
                        window.close();
                    });
                }
            }
        }
        >Skip & Close</button>
    );
}

function NoESMPage(){
    return(
        <section className="hero is-primary">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title has-text-centered">
                        No ESM to reply right now. Please close the page and check in later!
                    </h1>
                </div>
            </div>
        </section>
    );
}

function ESMPage() {

    const [esm] = useChromeStorageLocal("esm_in_progress");
    const [uid] = useChromeStorageLocal("uid");
    
    if(!esm){
        return(
            <NoESMPage/>
        );
    }

    console.log("ESM", esm);
    // get site name
    const esmSite = esm.esm_site;
    if(esmSite != "Twitter" && esmSite != "Facebook" && esmSite != "LinkedIn" && esmSite != "YouTube"){
        return(
            <NoESMPage/>
        );
    }
    // get site logo
    var siteLogo;
    if(esmSite === "Twitter"){
        siteLogo = twitterIcon;
    }
    else if(esmSite === "Facebook"){
        siteLogo = facebookIcon;
    }
    else if(esmSite === "YouTube"){
        siteLogo = youTubeIcon;
    }
    else if(esmSite === "LinkedIn"){
        siteLogo = linkedInIcon;
    }
    // get esm time
    const timestamp = esm.esm_time;


    return (
    <div>
        <section className="hero is-primary is-small">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">
                        User Experience Questionnaire
                    </h1>
                </div>
            </div>
        </section>
        <div className="container">
            <div className="section">
                <div className="box">
                    <div className="container">
                        <p className="content has-text-centered subtitle is-5">Webpage Screenshot</p>
                        <figure className="image block">
                            <img id="webpage_screenshot" 
                            style={{height: "450px", width: "auto", marginLeft: "auto", marginRight: "auto", border: "solid", borderWidth: "5px", borderColor: "hsl(171, 100%, 41%)"}} 
                            src={esm.esm_screenshot}/>
                        </figure>
                        <br/>
                        <p className="content">
                            We notice that you are currently browsing <span>{esmSite}</span> {" "}
                            <img 
                            style={{height: "20px", 
                                    width: "20px"}}
                            src={siteLogo}></img>. Let us know what your experience is!
                            <br />
                            Current as of: <span id="esm_time">{timestamp}</span>
                        </p>
                        <p className="content">
                            If you can not response to this questionnaire for any reason (e.g., this does not match your current browsing activity), please hit <SkipButton size="is-small"/> to skip this questionnaire.
                        </p>
                    </div>
                </div>
                <div>
                    <div className="box">
                        <label className="label">
                            1. Please briefly describe what you are currently doing on {esmSite}: 
                            <span style={{color:"red"}}>*</span>
                        </label>
                        <p className="help">your response to this question will be used in the interview to help you recall your memory about this moment. Please note any information that will help you to remember.</p><br/>
                        <div className="control">
                            <input className="input" type="q_activity" id="q_activity" required
                            />
                        </div>
                    </div>
                    <div className="box">
                        <label className="label">
                            2. Which of the following best describes your purpose for browsing {esmSite} at the moment:
                            <span style={{color:"red"}}>*</span>
                        </label>    
                        <div className="control">
                            <div className="select">
                                <select id="q_purpose"
                                onChange={(e) => {
                                    console.log("Others onchange");
                                    if(e.target.value=="Others"){
                                        document.getElementById("q_purpose_others").disabled = false;
                                    }else{
                                        document.getElementById("q_purpose_others").disabled = true;
                                    }
                                }}>
                                    <option></option>
                                    <option
                                        value="Finding">
                                        Finding: Looking for specific facts or information (e.g., weather, location)
                                    </option>
                                    <option
                                        value="Information gathering">
                                        Researching/ Information gathering: Researching some broader topic (e.g., job hunting, planning a vacation)
                                    </option>
                                    <option value="Browsing">
                                        Browsing: Pure browsing out of personal or work-related interest with no specific goal in mind (e.g., for self's routine/habit/passing time/entertainment)</option>
                                    <option value="Communicating">
                                        Communicating: (e.g., messaging, blogging and posting updates)</option>
                                    <option value="Others">
                                        Others (Fill in the blank if you choose 'Others')</option>
                                </select>
                            </div>
                            <p className="help has-text-danger">
                                <br/>
                                Fill in the following blank if you choose 'Others':
                            </p>
                            <div className="content">
                                <input className="input" id="q_purpose_others"
                                    placeholder="Fill in this blank if you choose 'Others'" disabled/>
                            </div>
                        </div>
                    </div>
                    <div className="box">
                        <div className="field">
                            <label className="label">
                                3. Reflecting on your current browsing experience on {esmSite}: Do you find this page distracting for the purposes of you browsing {esmSite} at the moment?
                                <span style={{color:"red"}}>*</span>
                            </label>
                            <div className="control">
                                <label className="radio">
                                    <input type="radio" value="Yes" name="q_distraction"
                                    onClick={(e) => {
                                        if(e.target.checked){
                                            document.getElementById("q_distraction_detail").innerHTML = "4. Please explain what things about " + esmSite + " lead you to feel distracted: <span style='color:red'>*</span>";
                                        }
                                    }}
                                    />
                                    {" "}Yes.<br/>
                                </label>
                                <label className="radio">
                                    <input type="radio" value="No" name="q_distraction"
                                    onClick={(e) => {
                                        if(e.target.checked){
                                            document.getElementById("q_distraction_detail").innerHTML = "4. Please explain what things about " + esmSite + " lead you to feel not distracted: <span style='color:red'>*</span>";
                                        }
                                    }}/>
                                    {" "}No.<br/>
                                </label>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label" id="q_distraction_detail">
                                4. Please explain what things about {esmSite} lead you to feel distracted or not distracted (based on your answer to Q3):
                                <span style={{color:"red"}}>*</span>
                            </label>
                            <div className="control">
                                <input className="input" type="q_explanation" id="q_distraction_text" required
                                    />
                            </div>
                        </div>
                    </div>

                    <div className="box">
                        <p className="label">
                            Reflecting on your current browsing experience on {esmSite}:
                        </p>
                        <br/>
                        
                        <div className="field">
                            <p className="label">
                                5. How much do you feel out of or in control?<span style={{color:"red"}}>*</span>
                            </p>
                            <div className="columns">
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        1: Very out of control  <br />
                                        <input type="radio" value="1" name="q_control"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        2: Out of control <br />
                                        <input type="radio" value="2" name="q_control"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        3: Neither out of nor in control <br />
                                        <input type="radio" value="3" name="q_control"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        4: In control <br />
                                        <input type="radio" value="4" name="q_control"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        5: Very in control <br />
                                        <input type="radio" value="5" name="q_control"/>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <p className="label">
                                6. How much do you feel dissatisfied or satisfied?<span style={{color:"red"}}>*</span>
                            </p>
                            <div className="columns">
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        1: Very dissatisfied <br />
                                        <input type="radio" value="1" name="q_satisfaction"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        2: Dissatisfied <br />
                                        <input type="radio" value="2" name="q_satisfaction"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        3: Neither dissatisfied nor satisfied <br />
                                        <input type="radio" value="3" name="q_satisfaction"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        4: Satisfied <br />
                                        <input type="radio" value="4" name="q_satisfaction"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        5: Very satisfied <br />
                                        <input type="radio" value="5" name="q_satisfaction"/>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <p className="label">
                                7. How much does the current browsing experience conflict with or support your personal goals?<span style={{color:"red"}}>*</span>
                            </p>
                            <div className="columns">
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        1: Very in conflict <br />
                                        <input type="radio" value="1" name="q_goal"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        2: In conflict <br />
                                        <input type="radio" value="2" name="q_goal"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        3: Neither in conflict nor supported <br />
                                        <input type="radio" value="3" name="q_goal"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        4: Supported <br />
                                        <input type="radio" value="4" name="q_goal"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        5: Very supported <br />
                                        <input type="radio" value="5" name="q_goal"/>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="buttons">
                    <button className="button is-primary is-medium" id="btn_submit"
                        onClick={(e) => {
                            var answers = {};
                            var onboarding = false;
                            var required_check = [
                                false, // current_activity
                                false, // purpose
                                false, // distraction
                                false, // distraction_text
                                false, // agency
                                false, // satisfaction
                                false  // goal_alignment
                                ]
                            
                            // current browsing activity
                            answers["current_activity"] = document.getElementById("q_activity").value;
                            if (answers["current_activity"]) {
                                required_check[0] = true;
                                if(answers["current_activity"].includes("study onboarding")){
                                    onboarding = true;
                                }
                            }

                            // browsing purpose
                            var q_purpose = document.getElementById("q_purpose");
                            var q_purpose_index = q_purpose.selectedIndex;
                            if (q_purpose[q_purpose_index].value == "Others") {
                                var q_purpose_others = document.getElementById("q_purpose_others");
                                answers["purpose_other"] = q_purpose_others.value;
                            }
                            answers["purpose"] = q_purpose[q_purpose_index].value;

                            if (answers["purpose"] == "Others"){
                                if(answers["purpose_other"]){
                                    required_check[1] = true;
                                }
                            }
                            else{
                                if (answers["purpose"]){
                                    required_check[1] = true;
                                }
                            }
                            
                            // distraction
                            var required_distraction = false;
                            var q_distraction = document.getElementsByName("q_distraction");
                            for (var i = 0; i < q_distraction.length; ++i) {
                                if (q_distraction[i].checked) {
                                    answers["distraction"] = q_distraction[i].value;
                                    required_distraction = true;
                                    break;
                                }
                            }
                            required_check[2] = required_distraction;
                            
                            // distraction text
                            answers["distraction_text"] = document.getElementById("q_distraction_text").value;
                            if (answers["distraction_text"]) {
                                required_check[3] = true;
                            }
                            
                            // agency
                            var required_control = false;
                            var q_control = document.getElementsByName("q_control");
                            for (var i = 0; i < q_control.length; ++i) {
                                if (q_control[i].checked) {
                                    answers["agency"] = q_control[i].value;
                                    required_control = true;
                                    break;
                                }
                            }
                            required_check[4] = required_control;

                            // satisfaction
                            var required_satisfaction = false;
                            var q_satisfaction = document.getElementsByName("q_satisfaction");
                            for (var i = 0; i < q_satisfaction.length; ++i) {
                                if (q_satisfaction[i].checked) {
                                    answers["satisfaction"] = q_satisfaction[i].value;
                                    required_satisfaction = true;
                                    break;
                                }
                            }
                            required_check[5] = required_satisfaction;

                            // goal alignment
                            var required_goal_alignment = false;
                            var q_goal_alignment = document.getElementsByName("q_goal");
                            for (var i = 0; i < q_goal_alignment.length; ++i) {
                                if (q_goal_alignment[i].checked) {
                                    answers["goal_alignment"] = q_goal_alignment[i].value;
                                    required_goal_alignment = true;
                                    break;
                                }
                            }
                            required_check[6] = required_goal_alignment;
                            
                            chrome.storage.local.get(["esm_counter_today","esm_counter_total","last_esm_time","sampled_feature_questioinnaire","enableIntervention"]).then(function (esm_counters) {
                                var current_time = new Date().getTime()/1000;
                                var last_esm_time_diff = current_time - esm_counters.last_esm_time;
                                if(esm_counters.esm_counter_today >= 6){
                                    var alert_message = "You have reached your daily maximum!\nPlease close the questionnaire and come back tomorrow!";
                                    alert(alert_message);
                                }
                                else if(last_esm_time_diff < 60*60){
                                    var alert_message = "You have submitted a questionnaire in an hour!\nPlease close the questionnaire and come back later!";
                                    alert(alert_message);
                                }
                                else{
                                    //esm counter checks and check required fields
                                    var pass_requirement_check = true;
                                    var alarmIndex = [];
                                    for (var i = 0; i < required_check.length; ++i) {
                                        if (!required_check[i]) {
                                            pass_requirement_check = false;
                                            alarmIndex.push(i + 1);
                                        }
                                    }
                                    if (!pass_requirement_check) {
                                        var alert_message = "Please answer the following questions: " + alarmIndex.join(',');
                                        alert(alert_message);
                                    }
                                    else{
                                        console.log("ESM responses:", answers);
                                        var esm_record = {};
                                        esm_record["esm_responses"]              = answers;
                                        esm_record["esm_site"]                   = esm.esm_site;
                                        esm_record["esm_is_homepage"]            = esm.esm_is_homepage;
                                        esm_record["esm_is_youtube_watch"]       = esm.esm_is_youtube_watch;
                                        esm_record["esm_time"]                   = esm.esm_time;
                                        esm_record["esm_time_unix_second"]       = esm.esm_time_unix_second;
                                        esm_record["distractions"]               = esm.distractions;
                                        esm_record["features"]                   = esm.features;
                                        esm_record["adjusted_distractions"]      = esm.adjusted_distractions;
                                        esm_record["study_status_intervention"]  = esm_counters.enableIntervention;
                                        
                                        console.log("ESM record:", esm_record);

                                        axios.post('https://purpose-mode-backend.nymity.ch/submit', {
                                            uid: uid,
                                            type: "esm",
                                            data: esm_record
                                        })
                                        .then(function (response) {
                                            console.log(response);
                                            chrome.storage.local.set({"sampled_esm": null}); // reset sampled ESM
                                            if(!onboarding){
                                                chrome.storage.local.set({"esm_counter_today": esm_counters.esm_counter_today+1}); // today's ESM counter ++
                                                chrome.storage.local.set({"esm_counter_total": esm_counters.esm_counter_total+1}); // overall ESM counter ++
                                            }
                                            chrome.storage.local.set({"last_esm_time": current_time}); // record current time
                                            alert("Response submitted!");
                                            if(esm_counters.sampled_feature_questioinnaire === null){
                                                chrome.action.setBadgeText({ text: "" });
                                            }
                                            window.close();
                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                            alert("Submission failed: "+ error);
                                        });
                                    }
                                }
                            });
                        }}
                    >Submit</button>
                    <SkipButton
                    size="is-medium"/>
                    </div>
                    </div>
                </div>
        </div>
    </div>
    )
}

export default ESMPage



