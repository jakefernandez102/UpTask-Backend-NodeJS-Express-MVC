import mongoose from 'mongoose';

const taskSchema = mongoose.Schema( {
    name: {
        type: String,
        trim: true,
        require: true
    },
    description: {
        type: String,
        trim: true,
        require: true
    },
    status: {
        type: Boolean,
        default: false,
    },
    deliveryDate: {
        type: Date,
        require: true,
        default: Date.now()
    },
    priority: {
        type: String,
        require: true,
        enum: ['Low', "Medium", "High"]
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    completed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
    {
        timestamps: true
    } );

const Task = mongoose.model( "Task", taskSchema );

export default Task;