const dropdownContents = document.querySelectorAll(".dropdownContent");
const btnBack = document.querySelector(".btn-back");
const btnConvert = document.querySelector(".btn-convert");
const currenciesGroup = document.querySelectorAll(".currency-group");
const amountGroup = document.querySelector(".amount-group");
const amountInput = document.getElementById("amount");
const convertIcon = document.querySelector(".convert-icon");
const footer = document.querySelector(".footer-part");
const resultsFrom = document.querySelector(".results--from");
const resultsTo = document.querySelector(".results--to");
const firstCurEx = document.querySelector(".firstCurEx");
const secondCurEx = document.querySelector(".secondCurEx");
const logoBox = document.querySelector(".logo-box");
const fromLogo = document.querySelector(".from-logo");
const toLogo = document.querySelector(".to-logo");

const fetchCurrencyName = async () => {
  try {
    const currencyNameResponse = await fetch(
      "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json"
    );

    if (currencyNameResponse.status !== 200) {
      throw new Error("Error!");
    } else {
      const namesObj = await currencyNameResponse.json();

      const nameArray = Object.entries(namesObj);

      let currencyNameHtml = "";
      nameArray.forEach((array) => {
        currencyNameHtml += `<a class="option" value="${
          array[0]
        }">${array[0].toUpperCase()} - <span>${
          array[1].length > 13
            ? array[1].toUpperCase().slice(0, 14) + "..."
            : array[1].toUpperCase().slice(0, 14)
        }</span></a>`;
      });

      dropdownContents.forEach((dropdownContent) => {
        dropdownContent.insertAdjacentHTML("beforeend", currencyNameHtml);
      });
      const options = document.querySelectorAll(".option");

      options.forEach((option) => {
        option.addEventListener("click", (e) => {
          const dropdownContentNode = option.parentElement;
          const dropdownbtn = dropdownContentNode.previousElementSibling;
          dropdownbtn.textContent = option.getAttribute("value");
        });
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

fetchCurrencyName();

const fetchExchangeDetails = async (from, to) => {
  try {
    const currencyExchangeResponse = await fetch(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}/${to}.json`
    );

    if (currencyExchangeResponse.status !== 200) {
      throw new Error("Error");
    } else {
      const data = await currencyExchangeResponse.json();

      const amountInput = document.getElementById("amount").value;
      const exchangeRate = data[to];
      const finalAmount = amountInput * exchangeRate;

      resultsFrom.textContent = `${from} ${amountInput} =`;
      resultsTo.textContent = `${to} ${finalAmount.toFixed(4)}`;

      firstCurEx.textContent = `1 ${from} = ${exchangeRate.toFixed(4)} ${to}`;
      secondCurEx.textContent = `1 ${to} = ${(1 / exchangeRate).toFixed(
        4
      )} ${from}`;
    }
  } catch (err) {
    console.log(err.message);
  }
};

const fetchCountryLogo = async (currency, box) => {
  try {
    const countryDetailsResponse =
      await fetch(`https://restcountries.com/v3.1/currency/${currency}
    `);

    if (countryDetailsResponse.status !== 200) {
      throw new Error("Error!");
    } else {
      const data = await countryDetailsResponse.json();
      box.src = `${data[0].flags.png}`;
      box.style.display = "block";
    }
  } catch (err) {
    console.log(err.message);
  }
};

let screen = "header";

const screenCheck = (screen) => {
  if (screen == "header") {
    footer.style.opacity = 0;
    footer.style.transform = "translateY(200px)";
  } else {
    footer.style.opacity = 1;
    footer.style.transform = "translateY(0px)";

    amountInput.addEventListener("keydown", () => {
      const fromCur = document.getElementById("from").textContent;
      const toCur = document.getElementById("to").textContent;

      fetchExchangeDetails(fromCur, toCur);
    });
  }
};

screenCheck(screen);

btnConvert.addEventListener("click", (e) => {
  const amountInput = +document.getElementById("amount").value;
  const fromCur = document.getElementById("from").textContent;
  const toCur = document.getElementById("to").textContent;

  if (
    typeof amountInput === "number" &&
    amountInput > 0 &&
    fromCur !== "From" &&
    toCur !== "To"
  ) {
    screen = "footer";
    screenCheck(screen);
    console.log(toCur);
    fetchExchangeDetails(fromCur, toCur);
    fetchCountryLogo(fromCur, fromLogo);
    fetchCountryLogo(toCur, toLogo);

    //btn-convert
    btnConvert.style.flex = 0;
    btnConvert.style.padding = 0;

    //currencyGroup
    currenciesGroup.forEach((currencyGroup) => {
      currencyGroup.style.display = "none";
    });

    //amount-group
    amountGroup.style.flex = "none";

    //convert-icon
    convertIcon.style.display = "none";

    //btn-back
    btnBack.style.transform = "translateX(0)";

    //logo-box
    logoBox.style.display = "flex";
  }
});

btnBack.addEventListener("click", (e) => {
  screen = "header";
  screenCheck(screen);

  //btn-convert
  btnConvert.style.flex = 1;
  btnConvert.style.padding = "1rem 2rem";

  //currencyGroup
  currenciesGroup.forEach((currencyGroup) => {
    currencyGroup.style.display = "flex";
    currencyGroup.style.flex = 3;
  });

  //amount-group
  amountGroup.style.flex = 3;

  //convert-icon
  convertIcon.style.display = "flex";

  //btn-back
  btnBack.style.transform = "translateX(-10rem)";

  //logo-box
  logoBox.style.display = "none";

  //log
  fromLogo.style.display = "none";
  toLogo.style.display = "none";

  //exchange details
  resultsFrom.textContent = "";
  resultsTo.textContent = "";
  firstCurEx.textContent = "";
  secondCurEx.textContent = "";
});
