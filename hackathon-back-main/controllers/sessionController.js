const User = require("../models/user");

// Controlador para registrar un usuario
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userSearch = await User.findOne({ email });
    if (userSearch) {
      return res
        .status(400)
        .json({ error: "El correo electronico ya se encuentra registrado" });
    }

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Genera el controlador para iniciar sesión con email y contraseña
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);

    res.status(200).json({ user, message: "Inicio de sesión exitoso" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTelephone = async (req, res) => {
  try{
    const { email, telephone } = req.body;
    const userToUpdate = await User.findOne({ email: email })
    if(!userToUpdate){
      return res.status(400).json({ error: "Usuario no encontrado" });
    }
    userToUpdate.telephone = telephone;
    await user.save();
  }catch(err){
    res.status(400).json({ error: err.message });
  }

}

//método de actualizar cualquier campo del usuario según lo que llegue por el body
exports.updateUser = async (req, res) => {
  try {
    const { id, ...rest } = req.body;
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }
    
    let updated = false;
    for (let key in rest) {
      if (rest[key] !== undefined && rest[key] !== null && rest[key] !== '') {
        userToUpdate[key] = rest[key];
        updated = true;
      }
    }

    if (!updated) {
      return res.status(400).json({ error: "No se actualizó ningún campo" });
    }

    await userToUpdate.save();
    res.status(200).json({ message: "Usuario actualizado correctamente" });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
}

exports.seedSuperAdmins = async (req, res) => {
  try {
    await User.insertMany([
      {
        name: "Secretaria de movilidad",
        email: "secretaria@test.com",
        isAdmin: true,
        password: "12345",
      },
    ]);
    res.status(201).json({ message: "SuperAdmins seeded successfully" });
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
};

exports.seedNotifyTrafficDecrees = async (req, res) => {
  try {
    const { id, notify } = req.body;
    console.log(typeof notify);
    
    if (typeof notify !== 'boolean') {
      return res.status(400).json({ error: "El campo 'notify' debe ser un booleano" });
    }
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }
    userToUpdate.notifyTrafficDecree = notify;
    await userToUpdate.save();
    res.status(200).json({ message: "Notificación de decretos de tráfico actualizada correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
