var language;
var defaultLanguage = "hu";

function checkEarlierLanguageSetting(){
    let currentLanguage = localStorage.getItem("user-lang");
    if (currentLanguage == null){
        setLanguage(defaultLanguage);
    }
}

function getPermanentElements() {    
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
        .then(data => showPermanentElements(data));
}

function getLanguageDependentElements() {
    fetch(window.location.href + "/languages/" + localStorage.getItem("user-lang") + ".json")
        .then(
            response => response.json(),
            err => console.error(err)
        )
        .then(data => showLanguageDependentElements(data));
}

function setLanguage(lang) {
    localStorage.setItem("user-lang", lang);
}

function changeLanguage(){
    
}

function showPermanentElements(data){
    console.log("here comes permanent elements: ", data);
}

function showLanguageDependentElements(data){
    console.log("here comes language dependent elements:" , data);
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