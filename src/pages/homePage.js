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
document.querySelector(".story-btn button").addEventListener("click", async () => {
  await createStory();
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

  quoteBtnLeft.addEventListener("click", async () => {
    const selectedCharacterLeft = leftContainer.querySelector(".select-characters select");
    var { sentence } = await getQuote(selectedCharacterLeft);
    leftContainer.querySelector(".quote-text-container .quote-text").innerHTML = sentence;
  });
  quoteBtnRight.addEventListener("click", async () => {
    const selectedCharacterRight = rightContainer.querySelector(".select-characters select");
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
async function createStory() {
  var leftChar =
    leftContainer.querySelector(".select-characters select").options[leftContainer.querySelector(".select-characters select").selectedIndex].innerText;
  var rightChar =
    rightContainer.querySelector(".select-characters select").options[rightContainer.querySelector(".select-characters select").selectedIndex].innerText;
  var leftQuote = leftContainer.querySelector(".quote-text-container .quote-text").innerHTML;
  var rightQuote = rightContainer.querySelector(".quote-text-container .quote-text").innerHTML;
  var message = {
    [leftChar]: leftQuote,
    [rightChar]: rightQuote,
  };
  var story = await GetStory(message);
  document.querySelector(".story-box .story-text").innerHTML = story;
}

async function GetStory(message) {
  const apiKey = "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";
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  var requestBody = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `I want to extend the Game Of Thrones story. I'll provide two characters with a sentence belonging to each. You should create a story of 30 words in length and tell me the story in a tag of '<p>'. Make sure to incorporate the exact sentences provided. English level should be B1.
          For example:
          I'll provide:
          {
          "daenerys":"I am the blood of the dragon.",
          "tyrion":"That's what I do: I drink and I know things."
          }
          You would tell the story in the following format:
          <p> Daenerys declared 'I am the blood of the dragon.' while Tyrion wittily quipped, 'That's what I do: I drink and I know things.'</p>
      `,
      },
      {
        role: "user",
        content: JSON.stringify(message),
      },
    ],
    temperature: 1.8,
    max_tokens: 180,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  };

  try {
    var response = await fetch(apiUrl, requestOptions);
    var data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    alert("Error happened while fetching story. " + err);
  }
}
