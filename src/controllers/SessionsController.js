const knex = require('../database/knex');
const AppError = require('../utils/AppError').default;
const { compare } = require('bcrypt');

const authConfig = require('../configs/auth')
const { sign } = require('jsonwebtoken');

class SessionsController {
  async create(request, response){
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first()

    if(!user){
      throw new AppError("Email e/ou senha incorretos", 401);
    }

    const checkPassword = await compare(password, user.password);

    if(!checkPassword){
      throw new AppError("Email e/ou senha incorretos", 401);
    }
    
    const { secret, expiresIn} = authConfig.jwt
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })

    return response.json({ user, token });
  }
}

module.exports = SessionsController;