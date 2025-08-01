import { exit } from 'node:process'
import db from '../config/db'
import colors from 'colors'

//Clear the DB after a test
const clearDB = async () => {
  try {
    await db.sync({force: true})
    console.log(colors.red.bold("Datos de la DB eliminados correctamente."))
    exit(0)
  } catch (error) {
    console.log(error)
    exit(1)
  }
}

if(process.argv[2] === '--clear') {
  clearDB()
}