const  connection = require("../Database/connect");


const getEmployees = async (req,res) => {
    const payload = {...req.body,...req.params};
    const {pageNo, pageSize} = payload;
    const offset = (pageNo - 1) * pageSize;
    const pool = await connection;
    const request = pool.request();
    
    const query = `SELECT EmployeeID AS id, FirstName, LastName, Country, PhoneNumber,BirthDate, (SELECT COUNT(*) FROM Employee WHERE IsDeleted = 0) AS TotalRows 
    FROM Employee
    WHERE IsDeleted = 0 
    ORDER BY EmployeeID
    OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;

    try {
    const result = await request.query(query);

    const data = result.recordset;
    const rowCount = result.recordset[0].TotalRows

    res.status(200).json({data,totalRowCount:rowCount})
    } catch (error) {
        console.log(error);
    }
}

const insertAndUpdate = async (req, res) => {
    try {
      const payload = {...req.body,...req.params}

      const { firstName, lastName, country, phoneNumber, birthDate, employeeID } = payload;
  
      const pool = await connection;
      const request = pool.request();
  
      if (employeeID) {
        // Update logic
        const updateQuery = `UPDATE Employee
                             SET FirstName = @firstName, LastName = @lastName, Country = @country, PhoneNumber = @phoneNumber, BirthDate = @birthDate
                             WHERE EmployeeID = @employeeID`;
  
        request.input('employeeID', employeeID);
        request.input('firstName', firstName);
        request.input('lastName', lastName);
        request.input('country', country);
        request.input('phoneNumber', phoneNumber);
        request.input('birthDate', birthDate);
  
        await request.query(updateQuery);
  
        res.status(200).json({ message: 'Update completed successfully' });
      } else {
        // Insert logic
        const insertQuery = `INSERT INTO Employee (FirstName, LastName, Country, PhoneNumber, BirthDate)
                             VALUES (@firstName, @lastName, @country, @phoneNumber, @birthDate)`;
  
        request.input('firstName', firstName);
        request.input('lastName', lastName);
        request.input('country', country);
        request.input('phoneNumber', phoneNumber);
        request.input('birthDate', birthDate);
  
        await request.query(insertQuery);
  
        res.status(200).json({ message: 'Insert completed successfully' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };

  const deleteEmployee = async (req, res) => {
    const payload = {...req.body,...req.params};
    const { employeeIDs } = payload;
    try {
      const pool = await connection;
      const request = pool.request();
  
      const deleteQuery = `UPDATE Employee
                           SET IsDeleted = 1
                           WHERE EmployeeID IN (${employeeIDs.join(',')})`;
  
      await request.query(deleteQuery);
  
      // Refresh the list of employees
       await getEmployees(req, res);
  
      res.status(200).json("Deleted Successfully");
    } catch (error) {
      console.error('Error deleting employees:', error);
      res.status(500).json({ error: 'An error occurred while deleting the employees.' });
    }
  };
  
module.exports = {getEmployees,insertAndUpdate,deleteEmployee};