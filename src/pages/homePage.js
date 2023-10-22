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
const selectListCharacterLeft = document.querySelector(
  ".select-characters-left"
);
const selectListCharacterRight = document.querySelector(
  ".select-characters-right"
);
const quoteBtnLeft = document.querySelector(
  ".quote-buttons-container button:nth-of-type(1)"
);
const quoteBtnRight = document.querySelector(
  ".quote-buttons-container button:nth-of-type(2)"
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
selectListFamilyLeft.addEventListener("change", getFAmilyfromLeft);
selectListFamilyRight.addEventListener("change", getFamilyfromRight);

function getFAmilyfromLeft() {
  const selectedFamilyLeft =
    selectListFamilyLeft.options[selectListFamilyLeft.selectedIndex].value;
  getCharacters(selectedFamilyLeft, selectListCharacterLeft);
}

function getFamilyfromRight() {
  const selectedFamilyRight =
    selectListFamilyRight.options[selectListFamilyRight.selectedIndex].value;
  getCharacters(selectedFamilyRight, selectListCharacterRight);
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
    option.value = member.slug;
    option.text = member.name;
    selectCharacterBtn.appendChild(option);
  });

  if (selectListBtn.innerHTML) {
    selectListBtn.innerHTML = "";
  }
  selectListBtn.appendChild(selectCharacterBtn);

  selectCharacterBtn.addEventListener("click", () => {
    detectSelectedCharacter(selectCharacterBtn);
  });
}

function detectSelectedCharacter(selectCharacterBtn) {
  const selectedCharacter =
    selectCharacterBtn.options[selectCharacterBtn.selectedIndex].value;

  getQuote(selectedCharacter);
}

async function getQuote(selectedCharacter) {
  const res = await fetch(
    `https://api.gameofthronesquotes.xyz/v1/author/${selectedCharacter}/1`
  );

  let quote = await res.json();

  quoteBtnLeft.addEventListener("click", () => {
    showQuote(quote.sentence);
  });
  quoteBtnRight.addEventListener("click", () => {
    showQuote(quote.sentence);
  });
}
function showQuote(quote) {
  alert(quote);
}
