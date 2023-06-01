
// Variables globales
let total_energy = 0.0;
let total_energy_unit = "kW";
let today_energy = 0.0;
let today_energy_unit = "kW";
let curr_power = 0.0;
let curr_power_unit = "kW";
let balance = 0.0;
let balance_unit = "kW";
let consumo_actual_kW = 0.0;

let tiempo = 0; // Tiempo en segundos
const PERIODO = 2; // Período de captura de datos en segundos

let curr_power_kW_array = [];
let balance_kW_array = [];
let consumo_actual_kW_array = [];

let grafica = null;

function tokW(valor, unidad) {
  if(unidad === "kW") {
    return valor;
  } else if(undad === "W") {
    return valor / 1000.0;
  } else if(unidad === "MW") {
    return valor * 1000.0;
  }
  return valor;
}

function resize_array(a) {
  if(a.length > 48*360) {
    a.shift();
  }
  return a;
}

function actualizarValores() {
  let curr_power_kW = tokW(curr_power, curr_power_unit);
  let balance_kW = tokW(balance, balance_unit);
  consumo_actual_kW = curr_power_kW + balance_kW;
  //if((tiempo % (60/PERIODO)) == 0) { // Se almacenan los valores cada 60 segundos 
  if((tiempo % (PERIODO)) == 0) { // Se almacenan los valores cada 60 segundos 
    curr_power_kW_array.push({x: tiempo/3600.0, y: curr_power_kW});
    balance_kW_array.push({x: tiempo/3600.0, y: balance_kW});
    consumo_actual_kW_array.push({x: tiempo/3600.0, y: consumo_actual_kW});
    resize_array(curr_power_kW_array);
    resize_array(balance_kW_array);
    resize_array(consumo_actual_kW_array);
  }
}

function actualizarGUI() {
  document.getElementById('today_energy').innerHTML = today_energy;
  document.getElementById('today_energy_unit').innerHTML = today_energy_unit;
  document.getElementById('curr_power').innerHTML = curr_power.toFixed(1);
  document.getElementById('curr_power_unit').innerHTML = curr_power_unit;
  document.getElementById('total_energy').innerHTML = total_energy;
  document.getElementById('total_energy_unit').innerHTML = total_energy_unit;
  document.getElementById('balance').innerHTML = balance.toFixed(1);
  document.getElementById('balance_unit').innerHTML = balance_unit;
  document.getElementById('consumo_actual_kW').innerHTML = consumo_actual_kW.toFixed(1);
  
  let curr_power_kW = tokW(curr_power, curr_power_unit);
  let balance_kW = tokW(balance, balance_unit);
  consumo_actual_kW = curr_power_kW + balance_kW;
  
  if(curr_power_kW > 0.1) {
	document.getElementById('solar_casa_flecha').style.display = "block";
  } else {
	document.getElementById('solar_casa_flecha').style.display = "none";
  }
  
  if(balance_kW < 0.0) {
	document.getElementById('solar_red_flecha').style.display = "block";
	document.getElementById('red_casa_flecha').style.display = "none";
	document.getElementById('solar_casa_kW').innerHTML = consumo_actual_kW.toFixed(1) + " kW";
	document.getElementById('solar_red_kW').innerHTML = (curr_power_kW - consumo_actual_kW).toFixed(1) + " kW";
	document.getElementById('red_casa_kW').innerHTML = "0 kW";
  } else {
	document.getElementById('solar_red_flecha').style.display = "none";
	document.getElementById('red_casa_flecha').style.display = "block";
	document.getElementById('solar_casa_kW').innerHTML = curr_power_kW.toFixed(1) + " kW";
	document.getElementById('solar_red_kW').innerHTML =  "0 kW";
	document.getElementById('red_casa_kW').innerHTML = (consumo_actual_kW - curr_power_kW).toFixed(1) + " kW";
  }
  
  
  
  actualizarGrafica();
}

function inicializarGrafica() {

  const ctx = document.getElementById('myChart');

  grafica = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
		  {
			label: 'Potencia consumida o vertida a la red kW',
			data: balance_kW_array,
			fill: 'origin'
		  },
		  {
			label: 'Potencia consumida kW',
			data: consumo_actual_kW_array,
		  }, 
		  {
			label: 'Potencia placas solares kW',
			data: curr_power_kW_array,
		  },
	  ]
    },
    options: {
      scales: {
        x: {
            type: 'linear',
			position: 'bottom'
        }
      }
    }
  });
}

inicializarGrafica();

function actualizarGrafica() {
	grafica.update();
}

