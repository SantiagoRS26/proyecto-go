exports.vehicleTypes = {
    publicVehicle: "Taxi",
    privateVehicle: "Vehículo particular",
    heavyVehicle: "Vehículo pesado",
    motorcycle: "Moto",
    toEnum: function () { return Object.keys(this); } ,
    findType: function (type) { return this[type]; }
  };
  