const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amount = document.getElementById("amount");
const loader = document.getElementById("loader");
const resultDiv = document.getElementById("result");

document.getElementById("swap-button").addEventListener("click", function () {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
});

document
  .getElementById("currency-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    loader.style.display = "block";
    resultDiv.innerHTML = "";

    if (fromCurrency.value === toCurrency.value) {
      loader.style.display = "none";
      resultDiv.innerHTML = "Waluty są identyczne. Wybierz różne waluty.";
      return;
    }

    let url = `https://api.nbp.pl/api/exchangerates/rates/a/${fromCurrency.value}/?format=json`;

    if (fromCurrency.value === "pln") {
      url = `https://api.nbp.pl/api/exchangerates/rates/a/${toCurrency.value}/?format=json`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const mid = data?.rates?.[0]?.mid;

        if (!mid) {
          resultDiv.innerHTML = "Wystąpił problem z przeliczeniem waluty.";
          return;
        }

        let rate;

        if (fromCurrency.value === "pln") {
          rate = 1 / mid;
        } else if (toCurrency.value === "pln") {
          rate = mid;
        } else {
          rate = mid;
          return fetch(
            `https://api.nbp.pl/api/exchangerates/rates/a/${toCurrency.value}/?format=json`
          )
            .then((response) => response.json())
            .then((data2) => {
              const mid2 = data2?.rates?.[0]?.mid;
              if (!mid2) {
                resultDiv.innerHTML =
                  "Wystąpił problem z przeliczeniem waluty.";
                return;
              }
              return rate / mid2;
            });
        }

        return rate;
      })
      .then((finalRate) => {
        if (finalRate) {
          const result = (amount.value * finalRate).toFixed(2);
          resultDiv.innerHTML = `Wynik: <strong>${result} ${toCurrency.value.toUpperCase()}</strong>`;
        }
      })
      .catch((error) => {
        resultDiv.innerHTML = "Wystąpił błąd podczas pobierania danych.";
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        loader.style.display = "none";
      });
  });
