var availableLanguages;
var defaultLanguage = "hu";

function checkEarlierLanguageSetting(){
    let currentLanguage = localStorage.getItem("user-lang");
    if (currentLanguage === undefined || currentLanguage === null){
        setLanguage(defaultLanguage);
    }
}

function getAvailableLanguages() {
    availableLanguages = langsJSON;
    /*
    fetch(window.location.href + "/languages/langs.json")
        .then(
            response => response.json(),
            err => console.error(err)
        )
        .then(data => availableLanguages = data);
    */
}

function getPermanentElements() {
    showPermanentElements(permanentJSON);
    /*
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
    */
}

function getLanguageDependentElements() {
    if (localStorage.getItem("user-lang") == "hu")
    {
        showLanguageDependentElements(hungarianJSON);
    } else {
        showLanguageDependentElements(englishJSON);
    }
    
    /*
    fetch(window.location.href + "/languages/" + localStorage.getItem("user-lang") + ".json")
        .then(
            response => response.json(),
            err => console.error(err)
        )
        .then(data => showLanguageDependentElements(data));
    */
}

function setLanguage(lang) {
    localStorage.setItem("user-lang", lang);
}

function changeLanguage(){
    /*
    let languageButton = document.querySelector("#lang-img");
    let selectedLanguageCode = languageButton.getAttribute("data-country-code");
    setLanguage(selectedLanguageCode);
    getLanguageDependentElements();
    */
   window.open("index-en.html", "_self");
}

function showPermanentElements(data){
    // console.log("here comes permanent elements: ", data);
}

function showLanguageDependentElements(data){
    refreshLanguageSelector(data.languageCode);
    console.log(data);
}

function refreshLanguageSelector(languageCode){
    let optionalLanguageCode = getOptionalLanguageCode(languageCode);
    setImgAttributes(optionalLanguageCode);
}

function showText(){
    getPermanentElements();
    getLanguageDependentElements();
}

function getOptionalLanguageCode(actualLanguageCode){
    let optionalLanguageCode;
    if (actualLanguageCode == "hu") {
        optionalLanguageCode = "en";
    } else if (actualLanguageCode == "en") {
        optionalLanguageCode = "hu";
    }
    return optionalLanguageCode;
}

function setImgAttributes(optionalLanguageCode){
    let optionalLanguage = availableLanguages[optionalLanguageCode];
    let languageButton = document.querySelector("#lang-img");
    languageButton.setAttribute("src", "images/"+ optionalLanguageCode +".png");
    languageButton.setAttribute("data-country-code", optionalLanguageCode);
    languageButton.setAttribute("alt", optionalLanguage);
}

function start() {
    checkEarlierLanguageSetting();
    getAvailableLanguages();
    showText();
    let languageButton = document.querySelector("#lang-img");
    languageButton.addEventListener("click", changeLanguage);
}



var permanentJSON = {
    "programmingLanguages": ["Java SE", "Python", "Javascript", "SQL"],
    "serverSideFrameworks": ["Spring Boot", "Flask", "Node.js"],
    "front-end": ["HTML", "CSS"],
    "IDE": ["VS Code","IntelliJ IDEA", "Spring Tool Suite", "Android Studio"],
    "versionCotrolling": ["Git"],
    "testing": ["TestLink", "JUnit", "Mockito"],
    "petProjects": [
        {
            "title": "Round Food",
            "thumbnail": "images/",
            "url": "https://round-food.herokuapp.com/"
        },
        {
            "title": "Laptop Spider",
            "thumbnail": "images/",
            "url": "https://laptop-spider.herokuapp.com"
        },
        {
            "title": "News About Europe",
            "thumbnail": "images/",
            "url": "https://news-about-europe.herokuapp.com/"
        }
    ]
}

var englishJSON = {
    "languageCode": "en",
    "programmingLanguages": "Programming languages",
    "serverSideFrameworks": "Server side frameworks",
    "testing": "testing",
    "additionalTestingData": ["manual testing", "writing unit tests"],
    "other": ["Others"],
    "otherData": ["REST architecture", "data interchange in JSON"],
    "petProjectDescriptions": {
        "Round Food": "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        "Laptop Spider": "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        "News About Europe": "Ohh yeahhh."
    }
}

var hungarianJSON = {
    "languageCode": "hu",
    "programmingLanguages": "Programozási nyelvek",
    "serverSideFrameworks": "Szerveroldali keretrendszerek",
    "petProjectDescriptions": {
        "Round Food": "A Lorem Ipsum az 1500-as évek óta standard szövegrészletként szolgált az iparban; mikor egy ismeretlen nyomdász összeállította a betûkészletét és egy példa-könyvet vagy szöveget nyomott papírra, ezt használta. Nem csak 5 évszázadot élt túl, de az elektronikus betûkészleteknél is változatlanul megmaradt.",
        "Laptop Spider": "Az 1960-as években népszerûsítették a Lorem Ipsum részleteket magukbafoglaló Letraset lapokkal, és legutóbb softwarekkel mint például az Aldus Pagemaker.",
        "News About Europe": "Ó, igen..."
    }
}

var langsJSON = {
    "hu": "Magyar",
    "en": "English"
}



start();