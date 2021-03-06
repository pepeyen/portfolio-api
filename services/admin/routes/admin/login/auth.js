const express = require('express');
const jwt = require('jsonwebtoken');

//Models
const getConnection = require('../../../models/createPool');
const getQuery = require('../../../models/createQuery');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(405).json({
        success: false,
        description: 'Invalid method, please use POST'
    });
})

router.post('/', (req, res) => {
    getConnection(async (error,connection) => {
        if(!error && connection){
            await getQuery(connection, {
                queryRequest:{
                    email: req.body.email,
                    password: req.body.password
                },
                queryTargetItems: 'user_name,user_is_admin',
                queryTargetTable: 'users',
                queryIsBinary: true  
            })
            .then(result => {
                if(result.length === 0){
                    res.status(401).json({
                        success: false,
                        description: 'Invalid username or password'
                    });
                }else{
                    if(result[0].user_is_admin === 1){
                        const userName = result[0].user_name;
                    
                        const accessToken = jwt.sign({userName}, process.env.SECRET, {
                            expiresIn: 1800
                        });
                        
                        res.cookie('logged_user', userName, {
                            secure: true,
                            sameSite: "strict"
                        });
                        res.cookie('access_token', accessToken, {
                            httpOnly: true, 
                            secure: true,
                            sameSite: "strict"
                        });
                        res.status(200).json({
                            success: true
                        });
                    }else{
                        res.status(401).json({
                            success: false,
                            description: 'This user doesn`t have access to this realm'
                        });
                    }   
                };
            })
            .catch(() => {
                res.status(500).json({
                    success: false,
                    description: 'Server error, please try again'
                });
            })

            connection.release();
        }else{
            res.status(500).json({
                success: false,
                description: 'Server error, please try again'
            });
        }
    });
});

module.exports = router;