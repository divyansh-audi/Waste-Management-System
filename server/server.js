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

const pool=mysql.createPool({
  host:'localhost',
  user:'root',
  password:'DYBYDX2323mysql!',
  database:'waste_management'
});

// app.get('/api/test', (req, res) => {
//   res.json({ message: "Hello from your Express server!" });
// });

app.get('/api/admin/requests',authenticateToken,isAdmin,async(req,res)=>{
  try{
    const sql = `SELECT r.request_id, r.pickup_date, r.waste_type, r.status, o.name AS organisation_name FROM requests r JOIN organisation o ON r.org_id = o.id WHERE r.status = 'Pending' ORDER BY r.pickup_date ASC`;
    const [requests] = await pool.query(sql);
    res.json(requests);
  }catch (err) {
    console.error("Admin Get Requests Error:", err.message);
    res.status(500).send('Server Error');
  } 

})

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
      const token=jwt.sign({ userId:employee.employee_id,email:employee.email,role:'admin'},'YOUR_TEMPORARY_SECRET_KEY',{ expiresIn: '1h' } );
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
  const {category,weight_kg,notes,pickup_date}=req.body;
  const loggedInUserId=req.user.userId;
  const userRole=req.user.role;
  // console.log(userRole);
  if(userRole!='organisation'){
    return res.status(403).json({ message: 'Only organizations can create requests' });
  }
  try{
    const sql =`INSERT INTO requests(org_id,waste_type,estimated_weight_kg,special_instructions,pickup_date,status) VALUES(?,?,?,?,?,'Pending')`;
    await pool.query(sql, [loggedInUserId, category, weight_kg, notes,pickup_date]);
    res.status(201).json({ message: 'Request submitted successfully!' });
  }catch(err){
    console.error("Request Error:", err.message);
    res.status(500).send('Server Error');
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});