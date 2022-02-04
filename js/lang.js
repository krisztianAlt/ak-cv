var language;
var defaultLanguage = "hu";

function checkEarlierLanguageSetting(){
    let currentLanguage = localStorage.getItem("user-lang");
    if (currentLanguage == null){
        setLanguage(defaultLanguage);
    }
}

function getPermanentElements() {
    /*
    $.ajax({ 
        url: "languages/permanentElements.json", 
        dataType: "json",
        async: false,
        success: function (dataPackage) {
            console.log(dataPackage);
            showPermanentElements();
        }
    });
    */
    
    let fetchOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    };
    fetch(window.location.href + "/languages/permanentElements.json", fetchOptions)
        .then(
            response => response.json(),
            err => console.error(err)
        )
        .then(data => console.log(data));
    
}

function getLanguageDependentElements() {
    /*$.ajax({ 
        url:  "/languages/" +  localStorage.getItem("user-lang") + ".json", 
        dataType: "json",
        async: false,
        success: function (langDataPackage) {
            console.log(langDataPackage);
            // setImgAlternate();
            showLanguageDependentElements();
        }
    });*/
}

function setLanguage(lang) {
    localStorage.setItem("user-lang", lang);
}

function changeLanguage(){
    
}

function showPermanentElements(){
    console.log("here comes permanent elements")
}

function showLanguageDependentElements(){
    console.log("here comes language dependent elements")
}

function showText(){
    getPermanentElements();
    getLanguageDependentElements();
}

function setImgAlternate(){
    let languageButton = document.querySelector("#lang-img");
    languageButton.setAttribute("alt", "test");
}

function start() {
    checkEarlierLanguageSetting();
    let languageButton = document.querySelector("#lang-img");
    languageButton.addEventListener("click", changeLanguage);
    showText();
}

start();