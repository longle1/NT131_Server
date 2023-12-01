const express = require("express");
const admin = require('firebase-admin');
const db = admin.database();
const router = express.Router();
const ref = db.ref('data');
router.get('/login', async (req, res) => {
  try {
    const {username, password} = req.query;

    const usersRef = admin.database().ref('users');

    const searchUsername = 'newuser';

    usersRef.orderByChild('username').equalTo(searchUsername).once('value')
    .then((snapshot) => {
      const userSnapshot = snapshot.val();
      if (userSnapshot) {
        const userKey = Object.keys(userSnapshot)[0];
        const userData = userSnapshot[userKey];
        res.status(200).json({
          status: true,
          "data": userData
        });
      } else {
        res.status(400).json({
          "status": false,
          "data": null
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
          "status": false,
          "data": null
        });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/api/status-door', async (req, res) => {
  try {
    const { username, currentStatus } = req.body;
    const usersRef = admin.database().ref('users');
    const searchUsername = username;
    usersRef.orderByChild('username').equalTo(searchUsername).once('value')
    .then((snapshot) => {
      const userSnapshot = snapshot.val();
      if (userSnapshot) {
        const userKey = Object.keys(userSnapshot)[0];
        const userRef = admin.database().ref(`users/${userKey}`);
        
        const status = currentStatus;
        user = userRef.update({ statusDoor: status });
        
      } else {
        user = null; 
      }
    })
    .then(() => {
      if(user) {
        res.status(200).json({
          "status": true,
          "message": "Update Success"
        })
      }else {
        res.status(400).json({
          "status": false,
          "message": "Update Fail"
        })
      }
    })
    .catch((error) => {
      res.status(400).json({
          "status": false,
          "message": "Update Fail"
        })
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check-password endpoint
router.post('/api/check-password', async (req, res) => {
  try {
    const { uername, password } = req.body;
    
    const usersRef = admin.database().ref('users');

    const searchUsername = username; 
    const currentPs = password;

    usersRef.orderByChild('username').equalTo(searchUsername).once('value')
      .then((snapshot) => {
        const userSnapshot = snapshot.val();
        if (userSnapshot) {
          const userKey = Object.keys(userSnapshot)[0];
          const userData = userSnapshot[userKey];

          let ps = userData.password; 
          if(ps == currentPs) {
            res.status(200).json({
              "status": true,
              "message": "Correct password"
            });
          }else {
            res.status(400).json({
              "status": false,
              "message": "Incorrect password"
            });
          }
        } else {
          res.status(400).json({
            "status": false,
            "message": "User is not exist"
          });
        }
      })
      .catch((error) => {
        console.error('Error checking password:', error);
      });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;