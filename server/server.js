import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const ADMIN_SECRET_KEY = "mySuperSecretAdminCode123";
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
console.log("hi");
const password_=process.env.MYSQL_PASSWORD;
console.log(password_);
const PRICE_PER_KG = 0.5;

const authenticateToken = (req, res, next) => {
  const authHeader=req.headers['authorization'];
  const token=authHeader&&authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'No token provided' }); 
  }

  jwt.verify(token,'YOUR_TEMPORARY_SECRET_KEY',(err,user)=>{
    if(err){
      return res.status(403).json({ message: 'Token is invalid' });
    }
    req.user=user;
    next();
  })
}

const isAdmin=(req,res,next)=>{
  if(req.user.role!=='admin'){
    return res.status(403).json({ message: 'Access forbidden: Admins only' });
  }
  next();
}

const isDriver = (req, res, next) => {
  // This runs *after* authenticateToken, so req.user exists
  if (req.user.role !== 'driver') {
    return res.status(403).json({ message: 'Access forbidden: Drivers only' });
  }
  next();
};

const pool=mysql.createPool({
  host:'localhost',
  user:'root',
  password:'DYBYDX2323mysql!',
  database:'waste_management'
});

// app.get('/api/test', (req, res) => {
//   res.json({ message: "Hello from your Express server!" });
// });

app.get('/api/admin/scheduled-collections', authenticateToken, isAdmin, async (req, res) => {
  try {
    // This query joins all the tables to get the names
    const sql = `
      SELECT 
        c.collection_id,
        c.pickup_datetime,
        o.name AS organisation_name,
        e.name AS employee_name,
        v.vehicle_type,
        v.reg_no
      FROM collections c
      JOIN requests r ON c.request_id = r.request_id  -- 1. Link Collection to Request
      JOIN organisation o ON r.org_id = o.id          -- 2. Link Request to Org
      JOIN employees e ON c.employee_id = e.employee_id
      JOIN vehicles v ON c.vehicle_reg = v.reg_no
      WHERE c.status = 'Scheduled'
      ORDER BY c.pickup_datetime ASC
    `;
    const [collections] = await pool.query(sql);
    res.json(collections);
  } catch (err) {
    console.error("Get Scheduled Collections Error:", err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/driver/my-jobs', authenticateToken, isDriver, async (req, res) => {
  try {
    const loggedInDriverId = req.user.userId;

    // This query gets all scheduled jobs for this specific driver
    const sql = `
      SELECT 
        c.collection_id,
        c.pickup_datetime,
        o.name AS organisation_name,
        o.address AS organisation_address,
        v.vehicle_type,
        v.reg_no
      FROM collections c
      JOIN requests r ON c.request_id = r.request_id  -- 1. Link Collection to Request
      JOIN organisation o ON r.org_id = o.id          -- 2. Link Request to Org
      JOIN vehicles v ON c.vehicle_reg = v.reg_no
      WHERE c.status = 'Scheduled' AND c.employee_id = ?
      ORDER BY c.pickup_datetime ASC
    `;
    
    const [jobs] = await pool.query(sql, [loggedInDriverId]);
    res.json(jobs);

  } catch (err) {
    console.error("Driver Get Jobs Error:", err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/admin/employees', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [employees] = await pool.query('SELECT employee_id, name,email,contact FROM employees');
    res.json(employees);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.get('/api/admin/vehicles', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [vehicles] = await pool.query('SELECT reg_no, vehicle_type ,capacity_kg FROM vehicles');
    res.json(vehicles);
  } catch (err) {
    console.error("Get Vehicles Error:", err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/admin/requests',authenticateToken,isAdmin,async(req,res)=>{
  try{

    // const sql = `SELECT r.request_id, r.pickup_date, r.waste_type, r.status, o.name AS organisation_name FROM requests r JOIN organisation o ON r.org_id = o.id WHERE r.status = 'Pending' ORDER BY r.pickup_date ASC`;
    const sql = `SELECT r.request_id, r.pickup_date, wc.category AS waste_type,r.status, o.name AS organisation_name FROM requests r JOIN organisation o ON r.org_id = o.id JOIN waste_categories wc ON r.category_id = wc.category_id WHERE r.status = 'Pending' ORDER BY r.pickup_date ASC`;
    const [requests] = await pool.query(sql);
    res.json(requests);
  }catch (err) {
    console.error("Admin Get Requests Error:", err.message);
    res.status(500).send('Server Error');
  } 

})

app.get('/api/waste-categories', authenticateToken, async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT category_id, category FROM waste_categories');
    res.json(categories);
  } catch (err) {
    console.error("Get Categories Error:", err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/my-payments', authenticateToken, async (req, res) => {
  // Only orgs can see their payments
  if (req.user.role !== 'organisation') {
    return res.status(403).json({ message: 'Access forbidden.' });
  }
  
  try {
    const [payments] = await pool.query(
      "SELECT * FROM payments WHERE org_id = ? ORDER BY payment_date DESC",
      [req.user.userId] // Get ID from the token
    );
    res.json(payments);
  } catch (err) {
    console.error("Get My Payments Error:", err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/admin/schedule', authenticateToken, isAdmin, async (req, res) => {
  const { request_id, employee_id, vehicle_reg, pickup_datetime } = req.body;
  
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    await connection.query(
      "UPDATE requests SET status = 'Scheduled' WHERE request_id = ?",
      [request_id]
    );
    const [rows] = await connection.query(
      "SELECT org_id FROM requests WHERE request_id = ?", 
      [request_id]
    );
    const org_id = rows[0].org_id;
    const collection_sql = `
      INSERT INTO collections (request_id, pickup_datetime, employee_id, vehicle_reg, status)
      VALUES (?, ?, ?, ?, 'Scheduled')
    `;
    await connection.query(collection_sql, [
      request_id,
      pickup_datetime,
      employee_id,
      vehicle_reg
    ]);

    await connection.commit();
    res.status(201).json({ message: 'Request scheduled successfully!' });

  } catch (err) {
    await connection.rollback();
    console.error("Schedule Error:", err);
    res.status(500).json({ message: 'Failed to schedule request.' });
  } finally {
    connection.release();
  }
});

app.post('/api/driver/complete-job', authenticateToken, isDriver, async (req, res) => {
  const { collection_id, weight_kg } = req.body;
  const loggedInDriverId = req.user.userId;

  if (!weight_kg || !collection_id) {
    return res.status(400).json({ message: "Collection ID and weight are required." });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Update 'collections'
    // !! CRITICAL SECURITY CHECK !!
    // We add "AND employee_id = ?" to the query.
    // This makes it IMPOSSIBLE for a driver to complete another driver's job.
    const updateResult = await connection.query(
      "UPDATE collections SET status = 'Completed', weight_kg = ? WHERE collection_id = ? AND employee_id = ?",
      [weight_kg, collection_id, loggedInDriverId]
    );
    
    // Check if the update actually changed a row.
    // If affectedRows is 0, it means the job wasn't theirs.
    if (updateResult[0].affectedRows === 0) {
      throw new Error("Job not found or not assigned to this driver.");
    }

    // 2. Get request_id
    const [rows] = await connection.query(
      `SELECT c.request_id, r.org_id 
       FROM collections c 
       JOIN requests r ON c.request_id = r.request_id 
       WHERE c.collection_id = ?`, 
      [collection_id]
    );
    if (rows.length === 0) {
      throw new Error("Collection not found.");
    }
    const { request_id, org_id } = rows[0];

    // 3. Update 'requests'
    await connection.query(
      "UPDATE requests SET status = 'Completed' WHERE request_id = ?",
      [request_id]
    );

    // 4. Create the bill
    const PRICE_PER_KG = 0.5; // Make sure this is consistent
    const calculatedAmount = weight_kg * PRICE_PER_KG;
    const payment_sql = `
      INSERT INTO payments (org_id, amount, payment_date, payment_method, status)
      VALUES (?, ?, CURDATE(), 'Unpaid', 'Pending')
    `;
    await connection.query(payment_sql, [org_id, calculatedAmount]);

    // 5. COMMIT
    await connection.commit();
    res.status(200).json({ message: 'Collection marked as complete!' });

  } catch (err) {
    await connection.rollback();
    console.error("Driver Complete Job Error:", err);
    res.status(500).json({ message: err.message || 'Failed to complete collection.' });
  } finally {
    connection.release();
  }
});

app.post('/api/pay-bill/:payment_id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'organisation') {
    return res.status(403).json({ message: 'Access forbidden.' });
  }
  
  try {
    const { payment_id } = req.params;
    
    // This is a simple simulation. We just update the status.
    await pool.query(
      "UPDATE payments SET status = 'Paid', payment_method = 'Online' WHERE payment_id = ? AND org_id = ?",
      [payment_id, req.user.userId] // Check org_id to make sure they can only pay their own bills
    );
    res.status(200).json({ message: 'Payment successful!' });
  } catch (err) {
    console.error("Pay Bill Error:", err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/admin/vehicles', authenticateToken, isAdmin, async (req, res) => {
  // 1. Get new vehicle data from the admin's form
  const { reg_no, vehicle_type, capacity_kg } = req.body;

  if (!reg_no || !vehicle_type || !capacity_kg) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // 2. Insert into the 'vehicles' table
    const sql = `
      INSERT INTO vehicles (reg_no, vehicle_type, capacity_kg)
      VALUES (?, ?, ?)
    `;
    await pool.query(sql, [reg_no, vehicle_type, capacity_kg]);

    res.status(201).json({ message: 'Vehicle added successfully!' });

  } catch (err) {
    // 3. Handle duplicate reg_no
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'This registration number already exists.' });
    }
    console.error("Add Vehicle Error:", err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/admin/employees', authenticateToken, isAdmin, async (req, res) => {
  // 1. Get new employee data from the admin's form
  const { name, email, contact, age, password,role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert into the 'employees' table
    const sql = `
      INSERT INTO employees (name, email, contact, age, password, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [name, email, contact, age, hashedPassword,role]);

    res.status(201).json({ message: 'Employee added successfully!' });

  } catch (err) {
    // 4. Handle duplicate email
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'This email is already registered.' });
    }
    console.error("Add Employee Error:", err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/admin/complete-collection', authenticateToken, isAdmin, async (req, res) => {
  const { collection_id, weight_kg } = req.body;
  
  if (!weight_kg || !collection_id) {
    return res.status(400).json({ message: "Collection ID and weight are required." });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Update 'collections' (as before)
    await connection.query(
      "UPDATE collections SET status = 'Completed', weight_kg = ? WHERE collection_id = ?",
      [weight_kg, collection_id]
    );

    // 2. Get request_id and org_id
    const [rows] = await connection.query(
      `SELECT c.request_id, r.org_id 
       FROM collections c 
       JOIN requests r ON c.request_id = r.request_id 
       WHERE c.collection_id = ?`, 
      [collection_id]
    );
    const { request_id, org_id } = rows[0];

    // 3. Update 'requests' (as before)
    await connection.query(
      "UPDATE requests SET status = 'Completed' WHERE request_id = ?",
      [request_id]
    );

    // 4. --- NEW STEP: Create the Bill ---
    const calculatedAmount = weight_kg * PRICE_PER_KG;
    const payment_sql = `
      INSERT INTO payments (org_id, amount, payment_date, payment_method, status)
      VALUES (?, ?, CURDATE(), 'Unpaid', 'Pending')
    `;
    // CURDATE() gets today's date
    await connection.query(payment_sql, [org_id, calculatedAmount]);

    // 5. COMMIT the transaction
    await connection.commit();
    res.status(200).json({ message: 'Collection completed and bill generated!' });

  } catch (err) {
    // 6. ROLL BACK
    await connection.rollback();
    console.error("Complete Collection Error:", err);
    res.status(500).json({ message: 'Failed to complete collection. Operation was rolled back.' });
  } finally {
    // 7. ALWAYS release
    connection.release();
  }
});

app.post('/api/admin/complete-collection', authenticateToken, isAdmin, async (req, res) => {
  const { collection_id, weight_kg } = req.body;
  
  if (!weight_kg || !collection_id) {
    return res.status(400).json({ message: "Collection ID and weight are required." });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query(
      "UPDATE collections SET status = 'Completed', weight_kg = ? WHERE collection_id = ?",
      [weight_kg, collection_id]
    );

    const [rows] = await connection.query(
    `SELECT c.request_id, r.org_id 
    FROM collections c 
    JOIN requests r ON c.request_id = r.request_id 
    WHERE c.collection_id = ?`, 
    [collection_id]
    );
    const { request_id, org_id } = rows[0];

    await connection.query(
      "UPDATE requests SET status = 'Completed' WHERE request_id = ?",
      [request_id]
    );
    const calculatedAmount = weight_kg * 0.5;
    const payment_sql = `
    INSERT INTO payments (org_id, collection_id, amount, payment_date, payment_method, status)
    VALUES (?, ?, ?, CURDATE(), 'Unpaid', 'Pending')
    `;
    await connection.query(payment_sql, [org_id, collection_id, calculatedAmount]);
    await connection.commit();
    res.status(200).json({ message: 'Collection marked as complete!' });

  } catch (err) {
    await connection.rollback();
    console.error("Complete Collection Error:", err);
    res.status(500).json({ message: 'Failed to complete collection. Operation was rolled back.' });
  } finally {
    connection.release();
  }
});

app.post('/api/auth/register-org',async(req,res)=>{
  const {name,address,contact_email,contact_phone,password} =req.body;
  if (!name || !contact_email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }
  try{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await pool.query('INSERT INTO organisation(name,address,contact_email,contact_phone,password) VALUES(?, ?, ?, ?, ?)',[name, address,contact_email,contact_phone,hashedPassword]);

    res.status(201).json({ message: "Organization registered successfully!" });
  }catch(err){
    console.error("Registration Error:", err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "This email is already registered." });
    }
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

app.post('/api/auth/register-admin',async(req,res)=>{
  const { name, email, contact, age, password, adminSecret } = req.body;
  if (adminSecret !== ADMIN_SECRET_KEY) {
    return res.status(401).json({ message: "Invalid Admin Secret Key" });
  } 
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  try{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await pool.query(
      'INSERT INTO employees(name, email, contact, age, password) VALUES(?, ?, ?, ?, ?)',
      [name, email, contact, age, hashedPassword]
    );
    res.status(201).json({ message: "Employee registered successfully!" });
  }catch(err){
    console.error("Employee Register Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

app.post('/api/auth/login',async(req,res)=>{
  try{
    const{email,password}=req.body;

    const [employeeRows] = await pool.query(
      'SELECT * FROM employees WHERE email = ?',
      [email]
    );

    if(employeeRows.length > 0){
      const employee = employeeRows[0];
      const passwordMatch = await bcrypt.compare(password, employee.password);

      if (!passwordMatch) {
        return res.status(400).json({ message: 'Invalid Password for admin' });
      }
      const token=jwt.sign({ userId:employee.employee_id,email:employee.email,role:employee.role},'YOUR_TEMPORARY_SECRET_KEY',{ expiresIn: '1h' } );
      return res.json({ token });
    }
  
    const [orgRows]= await pool.query('SELECT * FROM organisation WHERE contact_email=?',[email]);
    console.log(orgRows);
    if(orgRows.length>0){
      const org = orgRows[0];
      const passwordMatch = await bcrypt.compare(password, org.password);
      if(!passwordMatch){
        return res.status(400).json({message:'Invalid Password for user'});
      }
      const token=jwt.sign({userId:org.id,email:org.contact_email,role:'organisation'},'YOUR_TEMPORARY_SECRET_KEY',{expiresIn:'1h'});
      return res.json({token});
    }
  }catch(err){
    console.error("Login Error",err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/requests',authenticateToken,async(req,res)=>{
  const { category_id, weight_kg, notes, pickup_date } = req.body;
  const loggedInUserId=req.user.userId;
  const userRole=req.user.role;
  // console.log(userRole);
  if(userRole!='organisation'){
    return res.status(403).json({ message: 'Only organizations can create requests' });
  }
  try{
    const sql =`INSERT INTO requests(org_id,category_id,estimated_weight_kg,special_instructions,pickup_date,status) VALUES(?,?,?,?,?,'Pending')`;
    await pool.query(sql, [loggedInUserId, category_id, weight_kg, notes,pickup_date]);
    res.status(201).json({ message: 'Request submitted successfully!' });
  }catch(err){
    console.error("Request Error:", err.message);
    res.status(500).send('Server Error');
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});