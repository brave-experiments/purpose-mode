//get advertisement
getESM().then(result => {
    var esm_info = result.esm_info;
    console.log("esm", result.esm_info);
    document.getElementById("esm_site").innerHTML = esm_info.esm_site;
    document.getElementById("esm_time").innerHTML = esm_info.esm_time;
    document.getElementById("site_logo").setAttribute("src", "./icons/"+esm_info.esm_site+".png");
    
    /* TODO: calculate the time between the ESM time and the current time to hint participants*/
});

//get ESM
function getESM() {
    return new Promise(async (resolve, reject) => {
        chrome.storage.local.get(['sampled_esm']).then(function (result) {
            if (result.hasOwnProperty('sampled_esm')) {
                let esm_info = result.sampled_esm;
                chrome.storage.local.set({ 'sampled_esm': null});
                var result = { 'esm_info': esm_info};
                resolve(result);
            }
        });
    });
}