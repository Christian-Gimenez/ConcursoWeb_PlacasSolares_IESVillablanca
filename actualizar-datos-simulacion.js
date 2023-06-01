
let timeout = setInterval(function() {
  tiempo += PERIODO; 
  total_energy += 1;
  today_energy += 1;
  //curr_power = 5.0 * Math.sin(tiempo/3600/48);
  curr_power = 5.0 * Math.sin(tiempo/30.0);
  curr_power *= curr_power;
  //balance = 25.0 * Math.cos(tiempo/3600/48);
  balance = 25.0 * Math.cos(tiempo/50.0) * Math.cos(tiempo/50.0) - curr_power;
  actualizarValores();
  actualizarGUI();
}, PERIODO * 1000);