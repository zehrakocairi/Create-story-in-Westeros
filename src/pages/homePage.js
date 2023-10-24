export const initHomePage = () => {
  getRandomQuotes();
  getListOfFamily();
};
// I couldn't make it run

// require('dotenv').config();
// const apiKey = process.env.API_KEY;
const apiKey = "secret secret secret";

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

function showFamilyList(families) {
  // Adding placeholder option to family list
  families.unshift({ name: "Select Your Family" });

  // fill with families
  fillFamilies(familySelectLeft, families);
  fillFamilies(familySelectRight, families);
}

function fillFamilies(familySelect, families) {
  families.map((family) => {
    const option = document.createElement("option");
    option.value = family.slug;
    option.text = family.name;
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
}

quoteBtnLeft.addEventListener("click", async () => {
  const selectedCharacterLeft = leftContainer.querySelector(".select-characters select");
  const { sentence } = (await getQuote(selectedCharacterLeft)) ?? {}; // I did it cool here :)))
  leftContainer.querySelector(".quote-text-container .quote-text").innerHTML = sentence ?? "";
});
quoteBtnRight.addEventListener("click", async () => {
  const selectedCharacterRight = rightContainer.querySelector(".select-characters select");

  const { sentence } = (await getQuote(selectedCharacterRight)) ?? {}; // same here :)))
  rightContainer.querySelector(".quote-text-container .quote-text").innerHTML = sentence ?? ""; // I'm learning :);
});

async function getQuote(characterSelect) {
  if (characterSelect !== null) {
    const selectedCharacter = characterSelect.value;
    const res = await fetch(`${gotApiURL}/author/${selectedCharacter}/1`);
    const quote = await res.json();
    return quote;
  } else {
    alert("Please select a family first!");
  }
}

async function createStory() {
  const selectCharLeft = leftContainer.querySelector(".select-characters select");
  const selectCharRight = rightContainer.querySelector(".select-characters select");

  if (selectCharLeft === null && selectCharRight === null) {
    alert("Please fill in the blanks!");
    return;
  }
  const leftChar = selectCharLeft.options[leftContainer.querySelector(".select-characters select").selectedIndex].innerText;
  const rightChar = selectCharRight.options[rightContainer.querySelector(".select-characters select").selectedIndex].innerText;
  const leftQuote = leftContainer.querySelector(".quote-text-container .quote-text").innerHTML;
  const rightQuote = rightContainer.querySelector(".quote-text-container .quote-text").innerHTML;

  const message = {
    [leftChar]: leftQuote,
    [rightChar]: rightQuote,
  };

  if (message[leftChar] && message[leftChar].trim() !== "" && message[rightChar] && message[rightChar].trim() !== "") {
    if (leftChar === rightChar) {
      alert(`${leftChar}: You chose same characters.So, I'm the only hero of this story!`);
    }
    const story = await GetStory(message);
    document.querySelector(".story-box .story-text").innerHTML = story;
  } else alert("Please get quote!");
}

async function GetStory(message) {
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const requestBody = {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `I want to extend the Game Of Thrones story. I'll provide two characters with a sentence belonging to each. You should create a story of 150 words in length and tell me the story in a tag of '<p>'. Make sure to incorporate the exact sentences provided. English level should be B1.
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
    temperature: 1,
    max_tokens: 4181,
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
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    alert(`Error happened while fetching story. ${err}`);
  }
}
