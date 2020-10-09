import Knex from 'knex'
import Envs, { development } from '../../knexfile'
import {User} from '../utils/types'
import bcrypt from 'bcrypt'

const environment = process.env.KNEX_ENV || 'development'
const knex = Knex(Envs[environment])

export async function list() {
  const users = await knex.select().from('user')
  return users;
}


export async function registerUser(username, email, password) {
  const hash = await bcrypt.hash(password, 10)
  const id = await knex.returning('id').insert({
    username: username,
    email: email,
    passwordHash: hash,
    isEmailConfirmed : false
  }).into('user');
  return id[0];
}

export async function userInfoIfPassWordValid(email : string, password){
  const user = await knex<User>('user').select().where({email : email}).first()
  const match = await bcrypt.compare(password, user.passwordHash)
  if ( match) {
    delete(user.passwordHash)
    return user
  }
  else {
    return null
  }
}

export async function isPassWordValid(id : number, password){
  const user = await knex<User>('user').select().where({id : id}).first()
  const match = await bcrypt.compare(password, user.passwordHash)
  return ( match )
}


export async function userInfo(id : number){
  const user = await knex<User>('user').select().where({id : id}).first()
  return user
}

export async function userInfoFromUsername(username : string){
  const user = await knex<User>('user').select().where({username : username}).first()
  return user
}

export async function updatePassword(id : number, password : string){
  const hash = await bcrypt.hash(password, 10)
  await knex<User>('user').where({id : id}).update({passwordHash: hash})
}

export async function emailExists(email : string){
  const user = await knex<User>('user').select().where({email : email}).first()
  console.log(user)
  return (user != null)
}

export async function usernameExists(username : string){
  const user = await knex<User>('user').select().where({username : username}).first()
  return (user != null)
}

export async function updateBio(id : number, bio : string){
  await knex<User>('user').where({id : id}).update({bio: bio})
}
