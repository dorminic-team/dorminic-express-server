const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(session({
    secret: 'd45f9c0c8c755519c5d8b55ecf73bda51034c537a04fd79c67d508f0cce20fd9',
    resave: false,
    saveUninitialized: false
}));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'yourdb'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

function generateRandomCode(length = 8) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}

async function fetchRoomsAndUserInfo(orgCode) {
    const tableName = `organization_${orgCode}`; // Generate table name based on orgCode
    const getAllRoomQuery = `SELECT * FROM ${tableName}`; // Query to retrieve all rooms

    const rooms = await new Promise((resolve, reject) => {
        connection.query(getAllRoomQuery, async (error, result) => {
            if (error) {
                reject('Error fetching rooms');
            } else {
                const roomsWithUserInfo = await Promise.all(result.map(async (room) => {
                    if (room.tenant_id) {
                        const getUserQuery = `SELECT * FROM _user WHERE uuid = ?`;
                        const userData = await new Promise((resolve, reject) => {
                            connection.query(getUserQuery, [room.tenant_id], (err, userResult) => {
                                if (err) reject(err);
                                else resolve(userResult[0]); // Assuming tenant_id is unique
                            });
                        });
                        room.user_info = userData; // Add user information to the room object
                    }
                    return room;
                }));
                resolve(roomsWithUserInfo);
            }
        });
    });

    return rooms;
}

app.post('/admin/register', async (req, res) => {
    const { username, password, firstname, lastname, org_code, verify_code } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const uuid = uuidv4();
    const role = 'ADMIN'; // Assign the role directly to 'ADMIN'

    // Verify org_code and verify_code before registration
    connection.query(
        'SELECT * FROM _organization WHERE org_code = ? AND verify_code = ?',
        [org_code, verify_code],
        async (err, results) => {
            if (err) {
                console.error('Error checking organization verification:', err);
                res.status(500).send('Error checking organization verification');
                return;
            }

            if (results.length === 0) {
                res.status(400).send('Invalid organization code or verification code');
                return;
            }

            // Check if username already exists
            connection.query('SELECT * FROM _user WHERE username = ?', [username], async (err, results) => {
                if (err) {
                    console.error('Error checking username:', err);
                    res.status(500).send('Error checking username');
                    return;
                }

                if (results.length > 0) {
                    res.status(400).send('Username already exists');
                    return;
                }

                // Username is available, proceed with registration
                const newUser = { username, password: hashedPassword, uuid, firstname, lastname, role, org_code };
                connection.query('INSERT INTO _user SET ?', newUser, (err, results) => {
                    if (err) {
                        console.error('Error registering user:', err);
                        res.status(500).send('Error registering user');
                        return;
                    }
                    res.status(201).send('User registered successfully');
                });
            });
        }
    );
});

app.post('/register', async (req, res) => {
    const Roles = {
        USER: 'USER',
        ADMIN: 'ADMIN',
        MODERATOR: 'MODERATOR',
      };
    const { username, password, firstname, lastname, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const uuid = uuidv4(); 

    // Check if username already exists
    connection.query('SELECT * FROM _user WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Error checking username:', err);
            res.status(500).send('Error checking username');
            return;
        }

        if (results.length > 0) {
            res.status(400).send('Username already exists');
            return;
        }

        if (!Object.values(Roles).includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
          }

        // Username is available, proceed with registration
        const newUser = { username, password: hashedPassword, uuid, firstname, lastname, role };
        connection.query('INSERT INTO _user SET ?', newUser, (err, results) => {
            if (err) {
                console.error('Error registering user:', err);
                res.status(500).send('Error registering user');
                return;
            }
            res.status(201).send('User registered successfully');
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    connection.query('SELECT * FROM _user WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            res.status(500).send('Error logging in');
            return;
        }
        if (results.length === 0) {
            res.status(401).send('Invalid username or password');
            return;
        }
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).send('Invalid username or password');
            return;
        }
        const userData = {
            userId: user.uuid,
            username: user.username,
            org_code: user.org_code,
            firstname: user.firstname,
            lastname: user.lastname
          };
        const token = jwt.sign({ userId: user.uuid}, 'secretKey', { expiresIn: '3m' });
        const refreshToken = jwt.sign({ userId: user.uuid }, 'refreshsecretKey', { expiresIn: '1d' });
        res.status(200).json({ token,  refreshToken, userData});
    });
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    connection.query('SELECT * FROM _user WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
        return;
      }
      if (results.length === 0) {
        res.status(401).send('Invalid username or password');
        return;
      }
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).send('Invalid username or password');
        return;
      }
  
      // Check if user has the ADMIN role
      if (user.role !== 'ADMIN') {
        res.status(403).send('Access denied. Only ADMIN users are allowed to login.');
        return;
      }
  
      req.session.userId = user.uuid;
      req.session.role = user.role;
  
      const token = jwt.sign({ userId: user.uuid }, 'secretKey', { expiresIn: '3m' });
      const refreshToken = jwt.sign({ userId: user.uuid }, 'refreshsecretKey', { expiresIn: '1d' });
      const userData = {
        userId: user.uuid,
        username: user.username,
        org_code: user.org_code,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role
      };
      res.status(200).json({ token, refreshToken, userData });
    });
  });
  

app.post('/organization/add', (req, res) => {
    let org_code;
    let verify_code = generateRandomCode(); // Generate verify_code
    const { name, description } = req.body;

    function checkOrgName() {
        connection.query(
            'SELECT COUNT(*) AS count FROM _organization WHERE name = ?',
            [name],
            (error, results) => {
                if (error) {
                    console.error('Error checking organization name uniqueness:', error);
                    res.status(500).send('Error checking organization name uniqueness');
                } else {
                    const count = results[0].count;
                    if (count === 0) {
                        checkOrgCode(); // Proceed to check org_code uniqueness
                    } else {
                        res.status(400).send('Organization name already exists');
                    }
                }
            }
        );
    }

    function checkOrgCode() {
        org_code = generateRandomCode(); // Generate org_code
        connection.query(
            'SELECT COUNT(*) AS count FROM _organization WHERE org_code = ?',
            [org_code],
            (error, results) => {
                if (error) {
                    console.error('Error checking org_code uniqueness:', error);
                    res.status(500).send('Error checking org_code uniqueness');
                } else {
                    const count = results[0].count;
                    if (count === 0) {
                        insertOrganization();
                        createOrganizationTable();
                    } else {
                        checkOrgCode(); // Generate new org_code and check again
                    }
                }
            }
        );
    }

    function insertOrganization() {
        connection.query(
            'INSERT INTO _organization (name, description, org_code, verify_code) VALUES (?, ?, ?, ?)',
            [name, description, org_code, verify_code],
            (error, result) => {
                if (error) {
                    console.error('Error adding organization:', error);
                    res.status(500).send('Error adding organization');
                } else {
                    res.status(201).send('Organization added successfully');
                }
            }
        );
    }

    function createOrganizationTable() {
        const tableName = `organization_${org_code}`; // Generate table name based on org_code
        const createTableQuery = `
            CREATE TABLE ${tableName} (
                room_number VARCHAR(10) PRIMARY KEY,
                isRent BOOLEAN DEFAULT FALSE,
                isPaidByTenant BOOLEAN DEFAULT FALSE,
                tenant_id VARCHAR(36),
                FOREIGN KEY (tenant_id) REFERENCES _user (uuid) ON DELETE SET NULL
            )
        `;
        connection.query(createTableQuery, (error, result) => {
            if (error) {
                console.error('Error creating organization table:', error);
                res.status(500).send('Error creating organization table');
            }
        });
    }

    checkOrgName(); // Start the process to check organization name uniqueness
});

app.post('/admin/organization/getdetails', (req, res) => {
    const { org_code } = req.body;

    // Check if org_code is provided in the request body
    if (!org_code) {
        return res.status(400).json({ error: 'org_code is required' });
    }

    // Query to fetch organization details based on org_code
    const query = 'SELECT * FROM _organization WHERE org_code = ?';

    connection.query(query, [org_code], (err, results) => {
        if (err) {
            console.error('Error fetching organization details:', err);
            return res.status(500).json({ error: 'Error fetching organization details' });
        }

        // Check if organization exists
        if (results.length === 0) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        // Send the organization details as a JSON response
        res.status(200).json({ organization: results[0] });
    });
});



app.post('/admin/organization/getallroom', async (req, res) => {
    const { org_code } = req.body;

    try {
        const roomsWithUserInfo = await fetchRoomsAndUserInfo(org_code);
        res.json(roomsWithUserInfo);
    } catch (error) {
        res.status(500).send(error);
    }
});


app.post('/admin/organization/addroom', (req, res) => {
    const { org_code, room_number } = req.body;

    if (!org_code || !room_number) {
        return res.status(400).send('Invalid request. Missing org_code or room_number.');
    }

    const tableName = `organization_${org_code}`; // Generate table name based on org_code

    // Check if room_number already exists
    const checkRoomQuery = `
        SELECT * FROM ${tableName}
        WHERE room_number = ?
    `;
    const checkValues = [room_number];

    connection.query(checkRoomQuery, checkValues, (checkError, checkResult) => {
        if (checkError) {
            console.error('Error checking room existence:', checkError);
            return res.status(500).send('Error checking room existence');
        }

        if (checkResult.length > 0) {
            // Room number already exists, send a conflict response
            return res.status(409).send('Room number already exists');
        }

        // Room number doesn't exist, proceed with adding it
        const addRoomQuery = `
            INSERT INTO ${tableName} (room_number)
            VALUES (?)
        `;
        const addValues = [room_number];

        connection.query(addRoomQuery, addValues, (addError, addResult) => {
            if (addError) {
                console.error('Error adding room to organization:', addError);
                return res.status(500).send('Error adding room');
            }

            res.status(201).send('Room added successfully');
        });
    });
});




app.post('/organization/user', (req, res) => {
    const { org_code } = req.body;

    // Check if org_code is provided in the request body
    if (!org_code) {
        return res.status(400).json({ error: 'org_code is required' });
    }

    // Query to fetch users based on org_code
    const query = `
    SELECT u.uuid, u.username, u.firstname, u.lastname
        FROM _user u
        JOIN _organization o ON u.org_code = o.org_code
        WHERE o.org_code = ? AND u.role = 'USER';
    `;

    connection.query(query, [org_code], (err, results) => {
        if (err) {
            console.error('Error fetching users by org_code:', err);
            return res.status(500).json({ error: 'Error fetching users' });
        }

        // Send the list of users as a JSON response
        res.status(200).json({ users: results });
    });
});

app.post('/admin/register-user-to-organization', (req, res) => {
    const { org_code, username } = req.body;

    // Check if org_code and username are provided in the request body
    if (!org_code || !username) {
        return res.status(400).json({ error: 'org_code and username are required' });
    }

    // Query to check if org_code in _user is null for the given username
    const checkQuery = 'SELECT org_code FROM _user WHERE username = ?';
    connection.query(checkQuery, [username], (err, results) => {
        if (err) {
            console.error('Error checking user organization:', err);
            return res.status(500).json({ error: 'Error checking user organization' });
        }

        // Check if org_code is null for the user
        if (results.length === 0 || results[0].org_code !== null) {
            return res.status(400).json({ error: 'User is already registered to an organization' });
        }

        // Query to update org_code in _user table based on username
        const updateQuery = 'UPDATE _user SET org_code = ? WHERE username = ?';
        connection.query(updateQuery, [org_code, username], (err, updateResults) => {
            if (err) {
                console.error('Error updating user organization:', err);
                return res.status(500).json({ error: 'Error updating user organization' });
            }

            // Check if the update operation affected any rows
            if (updateResults.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            // User organization updated successfully
            res.status(200).json({ message: 'User organization updated successfully' });
        });
    });
});


app.post('/admin/room/add-tenant', (req, res) => {
    const { room_number, tenant_id, org_code } = req.body;

    const tableName = `organization_${org_code}`; // Generate table name based on org_code
    const updateRoomQuery = `
        UPDATE ${tableName}
        SET tenant_id = ?
        WHERE room_number = ?
    `;

    connection.query(updateRoomQuery, [tenant_id, room_number], (error, result) => {
        if (error) {
            console.error('Error adding tenant to room:', error);
            res.status(500).send('Error adding tenant to room');
        } else {
            res.status(200).send('Tenant added to room successfully');
        }
    });
});

app.post('/admin/room/remove-tenant', (req, res) => {
    const { room_number, org_code } = req.body;

    const tableName = `organization_${org_code}`; // Generate table name based on org_code
    const updateRoomQuery = `
        UPDATE ${tableName}
        SET tenant_id = NULL
        WHERE room_number = ?
    `;

    connection.query(updateRoomQuery, [room_number], (error, result) => {
        if (error) {
            console.error('Error removing tenant from room:', error);
            res.status(500).send('Error removing tenant from room');
        } else {
            res.status(200).send('Tenant removed from room successfully');
        }
    });
});



app.post('/admin/bill/add', (req, res) => {
    const { waterFee, electricFee, rentalFee, month, year, userId } = req.body;

    // Check if waterFee, electricFee, rentalFee, month, year, and userId are provided in the request body
    if (!waterFee || !electricFee || !rentalFee || !month || !year || !userId) {
        return res.status(400).json({ error: 'waterFee, electricFee, rentalFee, month, year, and userId are required' });
    }

    // Check if the organization code in the bill matches the organization code of the user
    const orgCheckQuery = 'SELECT * FROM _user WHERE uuid = ?';
    connection.query(orgCheckQuery, [userId], (orgCheckErr, orgCheckResults) => {
        if (orgCheckErr) {
            console.error('Error checking organization:', orgCheckErr);
            return res.status(500).json({ error: 'Error checking organization' });
        }

        if (orgCheckResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userOrgCode = orgCheckResults[0].org_code;

        // Insert the bill details into the database
        const query = 'INSERT INTO _bills (org_code, water_fee, electric_fee, rental_fee, month, year, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(query, [userOrgCode, waterFee, electricFee, rentalFee, month, year, userId], (err, results) => {
            if (err) {
                console.error('Error adding bill:', err);
                return res.status(500).json({ error: 'Error adding bill' });
            }

            // Bill added successfully
            res.status(201).json({ message: 'Bill added successfully' });
        });
    });
});

app.post('/admin/other-bill/add', (req, res) => {
    const { billName, description, amount, month, year, userId } = req.body;

    // Check if billName, description, amount, month, year, and userId are provided in the request body
    if (!billName || !description || !amount || !month || !year || !userId) {
        return res.status(400).json({ error: 'billName, description, amount, month, year, and userId are required' });
    }

    // Check if the organization code in the bill matches the organization code of the user
    const orgCheckQuery = 'SELECT org_code FROM _user WHERE uuid = ?';
    connection.query(orgCheckQuery, [userId], (orgCheckErr, orgCheckResults) => {
        if (orgCheckErr) {
            console.error('Error checking organization:', orgCheckErr);
            return res.status(500).json({ error: 'Error checking organization' });
        }

        if (orgCheckResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userOrgCode = orgCheckResults[0].org_code;

        // Insert the bill details into the database
        const query = 'INSERT INTO _otherbills (org_code, bill_name, description, amount, month, year, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(query, [userOrgCode, billName, description, amount, month, year, userId], (err, results) => {
            if (err) {
                console.error('Error adding bill:', err);
                return res.status(500).json({ error: 'Error adding bill' });
            }

            // Bill added successfully
            res.status(201).json({ message: 'Bill added successfully' });
        });
    });
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
