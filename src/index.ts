import app from "./app.js"
import "dotenv/config"

const PORT = Number( process.env.PORT) || 3000;
if(!PORT){
    throw new Error("Port not found!")
}
app.listen(PORT,()=>{console.log(`Server is running on PORT: ${PORT}`)})