//Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node. js. 
const mongoose = require('mongoose');
const Student = require('./model/Student'); // Student is a model we are going to use here
// require and set-up express 
const express = require('express');
const app = express();
// **requires body-parser
const bodyParser = require('body-parser');
const { get } = require('http');

app.use(bodyParser.json());
// when true takes any type of encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // when false takes object with keys & values

// Mongoose by default doesn't support promises so we are adding this to support promises
mongoose.Promise = global.Promise; 

url = 'mongodb://localhost:27017/StudentDetails'; // database name is StudentDetails
mongoose.connect( url, {useNewUrlParser : true},{useMongoClient : true});
mongoose.connection
    .once('open', ()=>console.log('CONNECTED'))
    .on('error', (err)=>{

        console.log(`could not connect`, err)
    });

// use default env port or use local port 8081
const port = 8081 || process.env.PORT;
    
// listen to port
app.listen(port, ()=>{
    console.log(`Listening on ${port}`);
});

// Get request :localhost:8081
app.get('/', (req, res)=>{
    res.send('I am Root');
});

// CRUD operations
// Route to save a new student
// Using Api to save(create) data to database using postman
// use: As Post request : localhost:8081/students 
// CREATE
app.post('/students', (req, res)=>{
    const newStudent = new Student({
// we are able to get this body property attached to request using body-parser 
        firstName: req.body.firstName, // make sure to use min length as defined in models otherwise it will throw error
        lastName:  req.body.lastName,
        branch:    req.body.branch,
        rollNo:    req.body.rollNo
    });
    
    newStudent.save().then(savedStudent=>{
        res.send('Saved Student');
    }).catch(err=>{
        res.status(404).send('Error saving student');
    });

});

// READ
// use GET : localhost:8081/students to get all students
app.get('/students', (req, res)=>{
    Student.find({}).then(students=>{
        res.send(students);
    }).catch(err=>{
        res.status(503).send('Error fetching students');
    });
});


// UPDATE
//** PATCH request to update a student, PATCH is used to update specific fields ex. Only firstName
app.patch('/students/:id', (req, res)=>{

    const id = req.params.id;
    const firstName = req.body.firstName; // we are getting this from body-parser  // We want to get this data from POSTMAN to update

    Student.findByIdAndUpdate(id, {$set: {firstName: firstName}}, {new: true})
    .then(savedUser=>{
        res.send('Student Details updated using PATCH method');

    })

});

// PUT is used to update all fields ex. firstName, lastName, branch, rollNo

// ** PUT version 1 :request to update a student 
app.put('/students/:id', (req, res)=>{

    const id = req.params.id;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const branch = req.body.branch;
    const rollNo = req.body.rollNo;

    Student.findByIdAndUpdate(id, {$set: {firstName: firstName, lastName: lastName , branch: branch, rollNo: rollNo}}, {new: true})
        .then(savedUser=>{
            res.send('Student saved using PUT method version 1');
        })

});


// DELETE
// use DELETE : localhost:8081/students/rollNo to delete a student (removes first match)
app.delete('/students/:rollNo', (req, res)=>{
    Student.findOne({rollNo: req.params.rollNo}).then(student=>{
        student.remove().then(studentRemoved=>{
            res.send('student remove' + studentRemoved);
        });
    });
});

// use DELETE : localhost:8081/students to delete all students with matching rollNo 
// app.delete('/students/:rollNo', (req, res)=>{
//     Student.deleteMany({rollNo: req.params.rollNo}).then(studentRemoved=>{
//             res.send('Deleted all students with rollNo ' + req.params.rollNo);
//         });
// });


// ** PUT :version 2
// app.put('/students/:id', (req, res)=>{

//     Student.findOne({_id: req.params.id}).then(student=>{
//         student.firstName = req.body.firstName;
//         student.lastName = req.body.lastName;
//         student.branch = req.body.branch;
//         student.rollNo = req.body.rollNo;

//         student.save().then(studentSaved=>{
//             res.send(studentSaved);

//         }).catch(err=>console.log(err));
//     });

// });


//** Delete v1 by findOne method using object id
// app.delete('/students/:id', (req, res)=>{
//     Student.findOne({_id: req.params.id}).then(student=>{
//         student.remove().then(studentRemoved=>{
//             res.send('student remove' + studentRemoved);
//         });
//     });
// });



//** Delete v2 Remove method
// app.delete('/students/:id', (req, res)=>{
//     Student.remove({_id: req.params.id}).then(studentRemoved=>{
//         res.send(`Student ${studentRemoved.firstName} removed`);
//     });
// });


//** Delete v3 findByIdAndRemove method
// app.delete('/students/:id', (req, res)=>{
//     Student.findByIdAndRemove(req.params.id).then(studentRemoved=>{
//         res.send(`Student ${studentRemoved.firstName} removed`);
//     });
// });
   

// const newStudent = new Student({ // another way to save a new student

    //     firstName : 'Anuj',
    //     lastName : 'Nandeshwar',
    //     branch : 'CSE',
    //     rollNo : 1
    // });

    // newStudent.save(function(err, dataSaved){
    //     if(err) return console.log(err);
    //     console.error(dataSaved);
    // }); 