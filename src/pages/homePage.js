export const initHomePage = () => {
  getRandomQuotes();
  getListOfFamily();
};
const selectListFamilyLeft = document.querySelector(
  ".select-family-left select"
);
const selectListFamilyRight = document.querySelector(
  ".select-family-right select"
);
const selectListCharacterLeftBtn = document.querySelector(
  ".select-characters-left"
);
const selectListCharacterRightBtn = document.querySelector(
  ".select-characters-right"
);

async function getRandomQuotes() {
  const responseQuotes = await fetch(
    "https://api.gameofthronesquotes.xyz/v1/random"
  );
  const randomQuotes = await responseQuotes.json();
  showRondomQoute(randomQuotes);
}
function showRondomQoute(quotes) {
  const topQuote = document.querySelector(".top-quote p:nth-of-type(1)");
  const topQuoteCharacter = document.querySelector(
    ".top-quote p:nth-of-type(2)"
  );
  topQuote.innerHTML = quotes.sentence;
  topQuoteCharacter.innerHTML = quotes.character.name;
}

async function getListOfFamily() {
  const responseFamily = await fetch(
    "https://api.gameofthronesquotes.xyz/v1/houses"
  );
  const familyList = await responseFamily.json();
  showFamilyList(familyList);
}

async function showFamilyList(families) {
  fillDropDown(selectListFamilyLeft, families);
  fillDropDown(selectListFamilyRight, families);
}

function fillDropDown(dropDown, families) {
  families.map((familie) => {
    const option = document.createElement("option");
    option.value = familie.slug;
    option.text = familie.slug;
    dropDown.appendChild(option);
  });
}
selectListFamilyLeft.addEventListener("change", getOptionfromLeft);
selectListFamilyRight.addEventListener("change", getOptionfromRight);

function getOptionfromLeft() {
  const selectedFamilyLeft =
    selectListFamilyLeft.options[selectListFamilyLeft.selectedIndex].value;
  getCharacters(selectedFamilyLeft, selectListCharacterLeftBtn);
}
function getOptionfromRight() {
  const selectedFamilyRight =
    selectListFamilyRight.options[selectListFamilyRight.selectedIndex].value;
  getCharacters(selectedFamilyRight, selectListCharacterRightBtn);
}

async function getCharacters(selectedFamily, selectListBtn) {
  const characters = await fetch(
    `https://api.gameofthronesquotes.xyz/v1/house/${selectedFamily}`
  );
  const characterData = await characters.json();
  showCharacters(characterData, selectListBtn);
}

function showCharacters(characters, selectListBtn) {
  const selectCharacterBtn = document.createElement("select");

  characters[0].members.map((member) => {
    const option = document.createElement("option");
    option.value = member.name;
    option.text = member.name;
    selectCharacterBtn.appendChild(option);
  });

  if (selectListBtn.innerHTML) {
    selectListBtn.innerHTML = "";
  }
  selectListBtn.appendChild(selectCharacterBtn);
}
