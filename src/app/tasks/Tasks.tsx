'use client'

import React, { useEffect, useState } from 'react'
import { Pie } from '@nivo/pie'
import {
  Box,
  Button,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Modal,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PieChartIcon from '@mui/icons-material/PieChart'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import {
  fetchTasks,
  deleteTask,
  updateTask,
  createTask,
  fetchTaskMetrics
} from '@/redux/slices/tasksSlice'
import { clearAuthState } from '@/redux/slices/authSlice'
import { useRouter } from 'next/navigation'

export interface Task {
  _id: string
  title: string
  description: string
  completed: boolean
  completedts?: Date
}

const Tasks: React.FC = () => {
  const dispatch = useAppDispatch()
  const { tasks, metrics } = useAppSelector(state => state.tasks)
  const user = useAppSelector(state => state.auth.user)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [formValues, setFormValues] = useState({ title: '', description: '' })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [isMetricsDialogOpen, setIsMetricsDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchTasks())
    dispatch(fetchTaskMetrics())
  }, [dispatch])

  const pieData = [
    {
      id: 'Completed Tasks',
      label: 'Completed',
      value: metrics?.completedTasks || 0,
      color: 'hsl(134, 70%, 50%)'
    },
    {
      id: 'Remaining Tasks',
      label: 'Remaining',
      value: metrics?.remainingTasks || 0,
      color: 'red'
    }
  ]

  const showModal = (task: Task | null = null) => {
    if (task) {
      setIsEditing(true)
      setCurrentTask(task)
      setFormValues({ title: task.title, description: task.description })
    } else {
      setIsEditing(false)
      setFormValues({ title: '', description: '' })
    }
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
  }

  const handleDelete = async () => {
    if (taskToDelete) {
      try {
        await dispatch(deleteTask(taskToDelete._id)).unwrap()
        dispatch(fetchTasks())
        dispatch(fetchTaskMetrics())
      } catch (error) {
      } finally {
        setIsDialogOpen(false)
        setTaskToDelete(null)
      }
    }
  }

  const handleSubmit = async () => {
    try {
      if (isEditing && currentTask) {
        await dispatch(
          updateTask({ id: currentTask._id, taskData: formValues })
        ).unwrap()
      } else {
        await dispatch(createTask({ ...formValues, completed: false })).unwrap()
      }
      dispatch(fetchTaskMetrics())
      setIsModalOpen(false)
    } catch (error) {
      console.error('Task saving failed:', error)
    }
  }

  const handleComplete = async (task: Task) => {
    try {
      await dispatch(
        updateTask({ id: task._id, taskData: { completed: !task.completed } })
      ).unwrap()
      dispatch(fetchTaskMetrics())
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const confirmDelete = (task: Task) => {
    setTaskToDelete(task)
    setIsDialogOpen(true)
    dispatch(fetchTaskMetrics())
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setTaskToDelete(null)
  }

  const handleMetricsDialogOpen = () => {
    setIsMetricsDialogOpen(true)
  }

  const handleMetricsDialogClose = () => {
    setIsMetricsDialogOpen(false)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' align='center' gutterBottom>
        {user?.name} Tasks
      </Typography>

      <Box display='flex' gap={2} mb={2}>
        <Button variant='contained' onClick={() => showModal()}>
          Add New Task
        </Button>
        <Button
          variant='outlined'
          color='error'
          onClick={() => dispatch(clearAuthState())}
        >
          Log out
        </Button>
        <Button
          variant='outlined'
          startIcon={<PieChartIcon />}
          onClick={handleMetricsDialogOpen}
        >
          Show Task Metrics
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task: any) => (
              <TableRow key={task?._id}>
                <TableCell>{task?.title}</TableCell>
                <TableCell>{task?.description}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={task?.completed}
                    onChange={() => handleComplete(task)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => showModal(task)} aria-label='edit'>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => confirmDelete(task)}
                    aria-label='delete'
                    color='error'
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for creating/updating tasks */}
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography variant='h6' component='h2'>
            {isEditing ? 'Edit Task' : 'Add Task'}
          </Typography>
          <TextField
            label='Title'
            value={formValues.title}
            onChange={e =>
              setFormValues({ ...formValues, title: e.target.value })
            }
            fullWidth
            margin='normal'
            required
          />
          <TextField
            label='Description'
            value={formValues.description}
            onChange={e =>
              setFormValues({ ...formValues, description: e.target.value })
            }
            fullWidth
            margin='normal'
            multiline
            rows={4}
            required
          />
          <Box display='flex' justifyContent='flex-end' mt={2}>
            <Button variant='outlined' onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant='contained' onClick={handleSubmit}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDelete} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Metrics Dialog */}
      <Dialog
        open={isMetricsDialogOpen}
        onClose={handleMetricsDialogClose}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Task Metrics</DialogTitle>
        <DialogContent>
          <Pie
            data={pieData}
            innerRadius={0.5}
            colors={{ datum: 'data.color' }}
            arcLinkLabelsThickness={0}
            height={300}
            width={300}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMetricsDialogClose} variant='contained'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Tasks
