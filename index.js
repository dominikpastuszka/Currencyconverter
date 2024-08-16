document.querySelector(".swap-button").addEventListener("click", function () {
  const currency1 = document.querySelector(
    '.currency-select[name="currency1"]'
  );
  const currency2 = document.querySelector(
    '.currency-select[name="currency2"]'
  );

  const temp = currency1.value;
  currency1.value = currency2.value;
  currency2.value = temp;
});

document
  .querySelector(".currency-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const loader = document.querySelector(".loader");
    const resultDiv = document.querySelector(".result");
    const currency1 = document.querySelector(
      '.currency-select[name="currency1"]'
    ).value;
    const currency2 = document.querySelector(
      '.currency-select[name="currency2"]'
    ).value;
    const amount = parseFloat(document.querySelector(".amount-input").value);

    loader.style.display = "block";
    resultDiv.innerHTML = "";

    if (currency1 === currency2) {
      loader.style.display = "none";
      resultDiv.innerHTML = "Waluty są identyczne. Wybierz różne waluty.";
      return;
    }

    let url = `https://api.nbp.pl/api/exchangerates/rates/a/${currency1}/?format=json`;

    if (currency1 === "pln") {
      url = `https://api.nbp.pl/api/exchangerates/rates/a/${currency2}/?format=json`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let rate;

        if (currency1 === "pln") {
          rate = 1 / data.rates[0].mid;
        } else if (currency2 === "pln") {
          rate = data.rates[0].mid;
        } else {
          rate = data.rates[0].mid;
          return fetch(
            `https://api.nbp.pl/api/exchangerates/rates/a/${currency2}/?format=json`
          )
            .then((response) => response.json())
            .then((data2) => {
              const rate2 = data2.rates[0].mid;
              return rate / rate2;
            });
        }

        return rate;
      })
      .then((finalRate) => {
        const result = (amount * finalRate).toFixed(2);

        loader.style.display = "none";
        resultDiv.innerHTML = `Wynik: <strong>${result} ${currency2.toUpperCase()}</strong>`;
      })
      .catch((error) => {
        loader.style.display = "none";
        resultDiv.innerHTML = "Wystąpił błąd podczas pobierania danych.";
        console.error("Error fetching data:", error);
      });
  });
