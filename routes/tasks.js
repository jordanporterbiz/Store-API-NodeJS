// APP JS

const express = require('express');
const app = express();
const taskRoutes = require('./routes/tasks')
const connectDb = require('./db/connect')
require('dotenv').config()

const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
// middleware
app.use(express.static('./public'))
app.use(express.json())



// routes
app.use('/api/v1/tasks', taskRoutes)

app.use(notFound)
app.use(errorHandlerMiddleware)
// app.get('/api/v1/tasks')            - Get all tasks
// app.post('/api/v1/tasks')           - Create a new task
// app.get('/api/v1/tasks/:id)         - Get a single task
// app.patch('/api/v1/tasks/:id')      - Update a task
// app.delete('/api/v1/tasks/:id')     - Delete a task

const port = process.env.PORT || 3000
const start = async () => {
    try{
        await connectDb(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (error) { 
        console.log(error)
    }
}

start()



// ROUTES
const express = require('express')
const router = express.Router();
const {    
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
 } = require('../controllers/taskController')

router.route('/').get(getAllTasks).post(createTask)
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask)
module.exports = router

// CONTROLLER FUNCTIONS
const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const { createCustomErorr, createCustomError } = require('../errors/custom-error')
const getAllTasks = asyncWrapper(async (req,res) => {
        const tasks = await Task.find({})
        res.status(200).json({ tasks })
})

const createTask = asyncWrapper(async (req,res) => {
        const task = await Task.create(req.body)
        res.status(201).json({ task })
    
})
   

const getTask = asyncWrapper(async (req,res) => {
        const id = req.params.id
        const task = await Task.findOne({_id: id})
        if(!task) {
            return next(createCustomError(`No task with ID: ${id}`, 404))
            }
        res.status(200).json({ task })

})

const updateTask = asyncWrapper(async (req, res) => {
        const id = req.params.id
        const task = await Task.findOneAndUpdate({_id: id}, req.body, {
            new:true,
            runValidators:true,
        });

        if(!task) {
            return next(createCustomError(`No task with ID: ${id}`, 404))
        }

        res.status(200).json({ task })

})

const deleteTask = asyncWrapper(async (req,res) => {
        const id = req.params.id
        const task = await Task.findOneAndDelete({_id: id})

        if(!task) {
            return next(createCustomError(`No task with ID: ${id}`, 404))
        }

        res.status(200).json({ task })

})


module.exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask

}

// MIDDLEWARES
// Error Handling
const { CustomAPIError} = require('../errors/custom-error')

const errorHandlerMiddleware = (err, req, res, next) => {
    if(err instanceof CustomAPIError){
        return res.status(err.statusCode).json({msg: err.message })
    }
    return res.status(500).json({ error: 'Something went wrong, please try again'})
}

module.exports = errorHandlerMiddleware
// Async Handling 
const asyncWrapper = (fn) => {
    return async (req,res,next) => {
        try{
            await fn(req,res,next)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = asyncWrapper
// Not Found 

const notFound = (req,res) => res.status(404).send('Route does not exist')

module.exports = notFound


// DB -  Connect DB
const mongoose = require('mongoose')


const connectDb = (url) => {
   return mongoose.connect(url, {
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useFindAndModify: false, 
        useCreateIndex: true,
    })
}


module.exports = connectDb

// MODELS 
const mongoose = require('mongoose')


 const TaskSchema = new mongoose.Schema({
     name: {
         type: String,
         required: [true, 'You must provide a name'],
         trim: true,
         maxLength: [30, 'Name must be less than 30 characters']
        },
     completed: {
         type: Boolean,
         default: false,
        },
 })

 module.exports = mongoose.model('Task', TaskSchema)


 // DEPENDENCIES 
//  "dotenv": "^8.2.0",
//  "express": "^4.17.1",
//  "mongoose": "^5.11.10"
// },
// "devDependencies": {
//  "nodemon": "^2.0.7"


