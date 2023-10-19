export const initHomePage = async () => {
  const gotDatas = await fetch("https://api.gameofthronesquotes.xyz/v1/random");
  const JsonData = await gotDatas.json();
};
