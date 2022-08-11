const select = document.querySelector("#sMoney");
const iAmount = document.querySelector("#iAmount");
const btn = document.querySelector("#btn");
const calcualte = document.querySelector("h3");
let dailyIndicators = {};
let chart;
const url = "https://mindicador.cl/api/";

async function getMoney() {
  try {
    const resp = await fetch(url);
    dailyIndicators = await resp.json();
    return Object.keys(dailyIndicators).filter(
      (key) =>
        key && key !== "version" && key !== "autor" && key !== "fecha"
    );
  } catch (error) {
    alert(error.message);
  }
}

let html = `<option>Seleccione moneda</option>`;

getMoney().then((data) => {
  html += data.map(
    (m) =>
      `<option value="${dailyIndicators[m].codigo}">${dailyIndicators[m].nombre}</option>`
  );
  select.innerHTML = html;
});

async function getDate() {
  try {
    const url = `https://mindicador.cl/api/${select.value}/`;
    const resp = await fetch(url);
    return await resp.json();
    console.log("",resp);
  } catch (error) {
    alert(error.message);
  }
}

const convert1 = () => {
  const tValue = select.value;
  let res1 = "";

  if (dailyIndicators[tValue].unidad_medida == "Porcentaje")
    res1 = (
      (iAmount.value * dailyIndicators[tValue].valor) /
      100
    ).toFixed(2);
  else res1 = (iAmount.value * dailyIndicators[tValue].valor).toFixed();
  return res1;
};

function getAndCreateDataToChart() {
  if(chart) chart.destroy();
  
  const chartType = "line";
  const title = "Cambio de moneda";
  const lineColor = "rgb(50, 107, 84)";

  getDate().then((data) => {
    let newdat = data.serie.reverse(); 
    let fechas = newdat.map(m => m.fecha);
    let values = newdat.map(m => m.valor);
    const config = {
      type: chartType,
      data: {
        labels: fechas,
        datasets: [
          {
            label: title,
            backgroundColor: lineColor,
            borderColor: lineColor,
            data: values,
          },
        ],
      },
    };
    const chartDOM = document.getElementById("myChart");
    chart = new Chart(chartDOM, config);
  });;
}

async function renderGraphic() {
  const config = getAndCreateDataToChart();
}

btn.addEventListener("click", async () => {
  calcualte.innerHTML = convert1();
  await renderGraphic();
});