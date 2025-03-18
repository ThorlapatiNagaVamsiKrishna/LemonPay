import React, { useState, useEffect } from 'react'
import { SlOptionsVertical } from "react-icons/sl";
import UUID from 'js-uuid';
import Cookie from 'js-cookie'
import './index.css'
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'

const TaskManager = () => {
    const [selectedTask, setSelectedTask] = useState(null)
    const [menuVisible, setMenuVisible] = useState(false)
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    const [taskDetails, setTaskDetails] = useState({ task: '', description: '', date: '' })
    const [tasksList, setTaskList] = useState([])

    useEffect(() => {
        const jwtToken = Cookie.get('jwtToken')
        const requestConfig = {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
            }
        }
        const fetchData = async () => {
            const data = await fetch('http://localhost:4000/user/allTasks', requestConfig)
            const response = await data.json()
            console.log(response)
            setTaskList(response.tasksList)
        }
        fetchData()
    }, [taskDetails])

    console.log(tasksList)
    const handleOpenAddTask = () => setAddTaskOpen(true);
    const handleCloseAddTask = () => setAddTaskOpen(false);

    const onHandleSubmitTask = async (e) => {
        e.preventDefault()
        try {
            const jwtToken = Cookie.get('jwtToken')
            const requestConfig = {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...taskDetails, id: UUID.v4() })
            }
            const data = await fetch('http://localhost:4000/user/addTask', requestConfig)
            const response = await data.json()
            setTaskDetails({ task: '', description: '', date: '' })
            setAddTaskOpen(false)
            console.log(response)
        }
        catch (e) {
            console.log(e.message)
        }
    }

    const onHandleTaskDetails = (e) => {
        const { name, value } = e.target
        setTaskDetails((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleShowMenu = (event, task) => {
        setSelectedTask(task);
        setMenuVisible(true);
        setMenuPosition({ top: event.clientY, left: event.clientX });
    };

    const handleClose = () => {
        setMenuVisible(false);
        setSelectedTask(null);
    };

    const addTaskPopup = () => {
        return (
            <Dialog open={addTaskOpen} onClose={handleCloseAddTask}>
                <DialogTitle className='login-heading'>Add Task</DialogTitle>
                <DialogContent>
                    <form onSubmit={onHandleSubmitTask}>
                        <TextField
                            fullWidth
                            label="Enter Task Name"
                            name="task"
                            margin="normal"
                            onChange={onHandleTaskDetails}
                            value={taskDetails.task}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            margin="normal"
                            onChange={onHandleTaskDetails}
                            value={taskDetails.description}
                            required
                        />
                        <TextField
                            fullWidth
                            type='date'
                            name="date"
                            margin="normal"
                            onChange={onHandleTaskDetails}
                            value={taskDetails.date}
                            required
                        />
                        <DialogActions>
                            <Button onClick={handleCloseAddTask} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                Save Task
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <div>
            <Typography variant='h4' className='task-heading'>Tasks Management</Typography>
            <button className='add-button' onClick={handleOpenAddTask}>Add task</button>
            <div className='heading-table' style={{ marginLeft: '40px' }}>
                <Typography variant='p' sx={{ width: '4%' }}>No</Typography>
                <Typography variant='p' sx={{ width: '26%' }}>Date & Time</Typography>
                <Typography variant='p' sx={{ width: '13%' }}>Task</Typography>
                <Typography variant='p' sx={{ width: '45%' }}>Description</Typography>
                <Typography variant='p' sx={{ width: '10%' }}>Action</Typography>
            </div>
            <ul style={{ width: '95%' }}>
                {tasksList?.map((each, index) => {
                    return <li key={index + 1} className='heading-table list'>
                        <Typography variant='p' sx={{ width: '2%', textAlign: 'start' }}>{index + 1}</Typography>
                        <Typography variant='p' sx={{ width: '25%' }}>{each.date}</Typography>
                        <Typography variant='p' sx={{ width: '15%' }}>{each.task}</Typography>
                        <Typography variant='p' sx={{ width: '45%' }}>{each.description}</Typography>
                        <Button sx={{ width: '5%', outline: 'none' }} onClick={(event) => handleShowMenu(event, each)}>
                            <SlOptionsVertical />
                        </Button>
                    </li>
                })}
            </ul>
            {menuVisible && (
                <div
                    className="popup-menu"
                    style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                    <button onClick={() => { }}>
                        Edit
                    </button>
                    <button onClick={() => { }}>
                        Delete
                    </button>
                </div>
            )}
            {menuVisible && <div className="backdrop" onClick={handleClose}></div>}
            {addTaskPopup()}
        </div>
    )
}

export default TaskManager