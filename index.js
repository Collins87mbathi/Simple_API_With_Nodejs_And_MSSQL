const express = require("express");
const cors = require("cors");
const EmployeesRouter = require("./routers/index");

const PORT = 5000;
const app = express();

//middleware 
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));

//routes
app.use('/api/employees',EmployeesRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
