

// Define the currencyRates object before populating the dropdowns
const currencyRates = {
  USDollar: {
    USD: 1.00,
    Euro: 0.92,
    BritishPound: 0.79,
    IndianRupee: 83.32,
    AustralianDollar: 1.51,
    SingaporeDollar: 1.34,
    JapaneseYen: 147.38,
    ChineseYuan: 7.09,

    // Other currencies...
  },
  Euro: {
    USD: 1.08,
    Euro: 1,
    BritishPound: 0.86,
    IndianRupee: 90.39,
    AustralianDollar: 1.63,
    SingaporeDollar: 1.45,
    JapaneseYen: 159.95,
    ChineseYuan: 7.70,

  },
  BritishPound: {
    USD: 1.26,
    Euro: 1.16,
    BritishPound: 0.79,
    IndianRupee: 105.23,
    AustralianDollar: 1.90,
    SingaporeDollar: 1.69,
    JapaneseYen: 186.33,
    ChineseYuan: 8.96,

  },
  IndianRupee: {
    USD: 0.012,
    Euro: 0.011,
    BritishPound: 0.0095,
    IndianRupee: 1.00,
    AustralianDollar: 0.018,
    SingaporeDollar: 0.016,
    JapaneseYen: 1.77,
    ChineseYuan: 0.085,

  },
  AustralianDollar: {
    USD: 1 / 1.51,
    Euro: 1 / 1.63,
    BritishPound: 1 / 1.9,
    IndianRupee: 1 / 0.018,
    AustralianDollar: 1.00,
    SingaporeDollar: 0.89,
    JapaneseYen: 97.86,
    ChineseYuan: 4.7,

  },
  SingaporeDollar: {
    USD: 1 / 1.34,
    Euro: 1 / 1.45,
    BritishPound: 1 / 1.69,
    IndianRupee: 1 / 0.016,
    AustralianDollar: 1 / 0.89,
    SingaporeDollar: 1.00,
    JapaneseYen: 110.27,
    ChineseYuan: 5.3,

  },
  JapaneseYen: {
    USD: 1 / 147.38,
    Euro: 1 / 159.95,
    BritishPound: 1 / 186.33,
    IndianRupee: 1 / 1.77,
    AustralianDollar: 1 / 97.86,
    SingaporeDollar: 1 / 110.27,
    JapaneseYen: 1.00,
    ChineseYuan: 0.048,

  },
  ChineseYuan: {
    USD: 1 / 7.09,
    Euro: 1 / 7.7,
    BritishPound: 1 / 8.96,
    IndianRupee: 1 / 0.085,
    AustralianDollar: 1 / 4.7,
    SingaporeDollar: 1 / 5.3,
    JapaneseYen: 1 / 0.048,
    ChineseYuan: 1,

  },
  // Other currency rates...
};
document.addEventListener('DOMContentLoaded', function () {
  const sourceSelect = document.querySelector('#source'); // use of queryselector instead of getelementbyid
  const targetSelect = document.querySelector('#target');
  const amountInput = document.querySelector('#amount');
  const convertButton = document.querySelector('#convert');
  const resultDiv = document.querySelector('#result');
  const table = document.querySelector('#table');



  const currencies = Object.keys(currencyRates); // object . keys returns the array of the property names

  // Add currencies as options to both source and target dropdowns
  currencies.forEach(currency => {
    const sourceOption = document.createElement('option');
    const targetOption = document.createElement('option');

    sourceOption.value = currency;
    targetOption.value = currency;
    sourceOption.textContent = currency;
    targetOption.textContent = currency;

    sourceSelect.appendChild(sourceOption);
    targetSelect.appendChild(targetOption);
  });

  // Set default options for the dropdowns
  if (currencies.length >= 2) {
    sourceSelect.value = currencies[0];
    targetSelect.value = currencies[1];
  }

  // Function to handle currency conversion
  function convertCurrency() {
    var amount = parseFloat(amountInput.value);
    const sourceCurrency = sourceSelect.value;
    const targetCurrency = targetSelect.value;

    if (!isNaN(amount)) { // check for making sure there's an input
      if (amountInput.value < 0) {
        amount = amount * -1;
        amountInput.value = amountInput.value * -1;

      }


      if (currencyRates[sourceCurrency] && currencyRates[sourceCurrency][targetCurrency]) {
        const conversionRate = currencyRates[sourceCurrency][targetCurrency];
        const convertedAmount = (amount * conversionRate);
        resultDiv.textContent = `${amount} ${sourceCurrency} = ${convertedAmount.toFixed(2)} ${targetCurrency}`;


        table.insertBefore((createTableData(JSONCreate(amount, sourceCurrency, targetCurrency, convertedAmount.toFixed(2)))), table.childNodes[2]);

      } else {
        console.error(`Conversion rate from ${sourceCurrency} to ${targetCurrency} not available.`);
        resultDiv.textContent = 'Conversion rate not available.';
      }
    } else {
      console.error('Please enter a valid amount.');
      resultDiv.textContent = 'Please enter a valid amount.';
    }
  }
  // Event listener for the convert button
  convertButton.addEventListener('click', convertCurrency);

});
function amountOnKeyDown() {
  const amountInput = document.querySelector('#amount');
  if (amountInput.value < 0) {
    amountInput.value = amountInput.value * -1;
  }
  return true;

}
function createTableData(JSONElement) {
  const tableRow = document.createElement("tr");


  tableRow.appendChild(createTableData1(JSONElement.date));
  tableRow.appendChild(createTableData1(JSONElement.amount));
  tableRow.appendChild(createTableData1(JSONElement.from));
  tableRow.appendChild(createTableData1(JSONElement.to));
  tableRow.appendChild(createTableData1(JSONElement.result));




  return tableRow;
}
function JSONCreate(amount, from, to, result) {
  return {
    amount: amount,
    from: from,
    to: to,
    result: result,
    date: new Date(Date.now()).toLocaleTimeString()


  }
}
function createTableData1(data) {
  const tableData = document.createElement("td");

  tableData.innerText = data;
  return tableData;
}