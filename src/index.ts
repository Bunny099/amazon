import app from "./app.js"
const PORT = process.env.PORT;
if(!PORT){
    throw new Error("Port not found!")
}
app.listen(PORT,()=>{console.log(`Server is running on PORT: ${PORT}`)})