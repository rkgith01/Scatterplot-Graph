const urlData =
"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(urlData)
.then((response) => {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
})
.then((data) => {
  const postSection = document.getElementById("post");

  data.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Dynamically assign class based on doping status
    if (item.Doping) {
      card.classList.add("doping");
    } else {
      card.classList.add("no-doping");
    }

    const name = document.createElement("h2");
    name.textContent = item.Name;
    card.appendChild(name);

    const year = document.createElement("p");
    year.textContent = `Year: ${item.Year}`;
    card.appendChild(year);

    const nationality = document.createElement("p");
    nationality.textContent = `Nationality: ${item.Nationality}`;
    card.appendChild(nationality);

    const doping = document.createElement("p");
    doping.textContent = item.Doping
      ? `Doping: ${item.Doping}`
      : "No doping allegation";
    card.appendChild(doping);

    postSection.appendChild(card);
  });
})
.catch((error) => {
  console.error("There was a problem with the fetch operation:", error);
});