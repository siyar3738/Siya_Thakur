const countryList = {
  USD: "US", INR: "IN", EUR: "FR", GBP: "GB", AUD: "AU",
  CAD: "CA", AED: "AE", AFN: "AF", ALL: "AL", AMD: "AM",
  ARS: "AR", AZN: "AZ", BDT: "BD", BGN: "BG", BHD: "BH",
  BOB: "BO", BRL: "BR", CHF: "CH", CNY: "CN", COP: "CO",
  CZK: "CZ", DKK: "DK", EGP: "EG", HKD: "HK", IDR: "ID",
  ILS: "IL", JPY: "JP", KRW: "KR", MXN: "MX", MYR: "MY",
  NGN: "NG", NPR: "NP", NZD: "NZ", PKR: "PK", PLN: "PL",
  QAR: "QA", RUB: "RU", SAR: "SA", SGD: "SG", THB: "TH",
  TRY: "TR", TWD: "TW", UAH: "UA", VND: "VN", ZAR: "ZA"
};

let from = document.getElementById("from");
let to = document.getElementById("to");

// add dropdown options
for (let code in countryList) {
  from.add(new Option(code, code));
  to.add(new Option(code, code));
}

// update flags
from.onchange = () => updateFlag(from, "fromFlag");
to.onchange = () => updateFlag(to, "toFlag");

function updateFlag(select, imgId) {
  let country = countryList[select.value];
  document.getElementById(imgId).src =
    `https://flagsapi.com/${country}/flat/64.png`;
}

// convert function
async function convert() {
  let amount = document.getElementById("amount").value || 1;

  let url = `https://api.exchangerate-api.com/v4/latest/${from.value}`;
  let res = await fetch(url);
  let data = await res.json();

  let rate = data.rates[to.value];
  let result = amount * rate;

  document.getElementById("result").innerText =
    `${amount} ${from.value} = ${result.toFixed(2)} ${to.value}`;
}