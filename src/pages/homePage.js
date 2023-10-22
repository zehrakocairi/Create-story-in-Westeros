export const initHomePage = () => {
  getRandomQuotes();
  getListOfFamily();
};

const gotApiURL = "https://api.gameofthronesquotes.xyz/v1";

const leftContainer = document.querySelector(".select-section .left");
const rightContainer = document.querySelector(".select-section .right");

const familySelectLeft = leftContainer.querySelector(".select-family select");
const familySelectRight = rightContainer.querySelector(".select-family select");

const characterSelectLeftContainer = leftContainer.querySelector(".select-characters");
const characterSelectRightContainer = rightContainer.querySelector(".select-characters");

const quoteBtnLeft = leftContainer.querySelector(".quote-btn");
const quoteBtnRight = rightContainer.querySelector(".quote-btn");

familySelectLeft.addEventListener("change", () => {
  getFamily(familySelectLeft, characterSelectLeftContainer);
});
familySelectRight.addEventListener("change", () => {
  getFamily(familySelectRight, characterSelectRightContainer);
});

async function getRandomQuotes() {
  const responseQuote = await fetch(gotApiURL + "/random");
  const randomQuote = await responseQuote.json();
  showRondomQoute(randomQuote);
}

function showRondomQoute(quote) {
  const topQuote = document.querySelector(".top-quote p:nth-of-type(1)");
  const topQuoteCharacter = document.querySelector(".top-quote p:nth-of-type(2)");
  topQuote.innerHTML = quote.sentence;
  topQuoteCharacter.innerHTML = quote.character.name;
}

async function getListOfFamily() {
  const responseFamily = await fetch(gotApiURL + "/houses");
  const familyList = await responseFamily.json();
  showFamilyList(familyList);
}

async function showFamilyList(families) {
  // Adding placehoder option
  families.unshift({ name: "Select Your Family", disabled: true });

  // fill with familes
  fillFamilies(familySelectLeft, families);
  fillFamilies(familySelectRight, families);
}

function fillFamilies(familySelect, families) {
  families.map((family) => {
    const option = document.createElement("option");
    option.value = family.slug;
    option.text = family.name;
    option.disabled = family.disabled;
    familySelect.appendChild(option);
  });
}

function getFamily(familySelect, charSelectContainer) {
  const selectedFamily = familySelect.options[familySelect.selectedIndex].value;
  getCharacters(selectedFamily, charSelectContainer);
}

async function getCharacters(selectedFamily, charSelectContainer) {
  const family = await fetch(`${gotApiURL}/house/${selectedFamily}`);
  const familyData = await family.json();
  showCharacters(familyData, charSelectContainer);
}

function showCharacters(familyData, charSelectContainer) {
  if (charSelectContainer.innerHTML) {
    charSelectContainer.innerHTML = "";
  }
  const select = document.createElement("select");
  familyData[0].members.map((member) => {
    const option = document.createElement("option");
    option.value = member.slug;
    option.text = member.name;
    select.appendChild(option);
  });

  charSelectContainer.appendChild(select);
  const selectedCharacterLeft = leftContainer.querySelector(".select-characters select");
  const selectedCharacterRight = rightContainer.querySelector(".select-characters select");

  quoteBtnLeft.addEventListener("click", async () => {
    var { sentence } = await getQuote(selectedCharacterLeft);
    leftContainer.querySelector(".quote-text-container .quote-text").innerHTML = sentence;
  });
  quoteBtnRight.addEventListener("click", async () => {
    var { sentence } = await getQuote(selectedCharacterRight);
    rightContainer.querySelector(".quote-text-container .quote-text").innerHTML = sentence;
  });
}

async function getQuote(characterSelect) {
  const selectedCharacter = characterSelect.value;
  const res = await fetch(`${gotApiURL}/author/${selectedCharacter}/1`);

  const quote = await res.json();
  return quote;
}
