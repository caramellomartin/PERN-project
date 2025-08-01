import express from "express"
import colors from 'colors'
import cors, { CorsOptions } from "cors"
import swaggerUi from "swagger-ui-express"
import swaggerSpec, { swaggerUiOptions } from "./config/swagger"
import router from "./routes/router"
import db from "./config/db"
import morgan from "morgan"

//DB Connect
export async function connectDB() {
  try {
    await db.authenticate()
    db.sync()
    console.log(colors.magenta.bold('Conexión exitosa en la DB'))
  } catch (error) {
    console.log(colors.red.bold('Hubo un error al conectar con la DB.'))
  }
}
connectDB()

//Express Instance
const server = express()

//CORS
const corsOptions: CorsOptions = {
  origin: function(origin, callback) {
    if (origin === process.env.FRONTEND_URL)
      callback(null, true)
    else
      callback(new Error('Error de CORS'))
  }
}
server.use(cors(corsOptions))

//Reading data from forms
server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', router)

//Swagger DOCS
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server