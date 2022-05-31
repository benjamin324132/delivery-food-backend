const express = require("express")
const colors = require("colors")
const cors = require("cors")
const morgan = require("morgan")
const conectDB = require("./config/db")

const userRoutes = require("./routes/userRoutes")
const dishRoutes = require("./routes/dishRoutes")
const orderRoutes = require("./routes/orderRoutes")
const adminRoutes = require("./routes/adminRoutes")
const analyticRoutes = require("./routes/analyticRoutes")


conectDB()


const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cors())


app.use("/api/v1/users", userRoutes)
app.use("/api/v1/dishes", dishRoutes)
app.use("/api/v1/orders", orderRoutes)
app.use("/api/v1/admins", adminRoutes)
app.use("/api/v1/analytics", analyticRoutes)

app.get("/",(req, res) => {
    res.send("Delivery Server")
})

const PORT = 5000

app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold))
