'use client'

import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
  Checkbox
} from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import {
  fetchTasks,
  deleteTask,
  updateTask,
  createTask
} from '@/redux/slices/tasksSlice'
import { useRouter } from 'next/navigation'
import { clearAuthState } from '@/redux/slices/authSlice'

// Define the Task interface for type safety
interface Task {
  _id: string
  title: string
  description: string
  completed: boolean
}

const Tasks: React.FC = () => {
  const dispatch = useAppDispatch()
  const { tasks, loading } = useAppSelector(state => state.tasks)
  const router = useRouter()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [form] = Form.useForm()

  // Fetch tasks when the component mounts
  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  // Function to show the modal for adding or editing a task
  const showModal = (task: Task | null = null) => {
    if (task) {
      setIsEditing(true)
      setCurrentTask(task)
      form.setFieldsValue(task)
    } else {
      setIsEditing(false)
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  // Function to handle modal cancellation
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  // Function to handle task deletion
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteTask(id)).unwrap()
      message.success('Task deleted successfully!')
      dispatch(fetchTasks()) // Refresh tasks
    } catch (error) {
      message.error('Task deletion failed.')
    }
  }

  // Function to handle form submission for adding/editing tasks
  const handleFinish = async (values: Omit<Task, '_id' | 'completed'>) => {
    try {
      if (isEditing && currentTask) {
        await dispatch(
          updateTask({ id: currentTask._id, taskData: values })
        ).unwrap()
        message.success('Task updated successfully!')
      } else {
        await dispatch(createTask({ ...values, completed: false })).unwrap()
        message.success('Task added successfully!')
      }
      setIsModalVisible(false)
      dispatch(fetchTasks()) // Refresh tasks
    } catch (error) {
      message.error('Task saving failed.')
    }
  }

  // Function to handle toggling task completion status
  const handleComplete = async (task: Task) => {
    try {
      await dispatch(
        updateTask({ id: task._id, taskData: { completed: !task.completed } })
      ).unwrap()
      message.success(
        `Task marked as ${!task.completed ? 'completed' : 'incomplete'}!`
      )
      dispatch(fetchTasks()) // Refresh tasks
    } catch (error) {
      message.error('Failed to update task completion status.')
    }
  }

  // Define the columns for the Ant Design Table
  const columns: ColumnsType<Task> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: text => <span>{text}</span>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
      render: text => <span>{text}</span>
    },
    {
      title: 'Completed',
      key: 'completed',
      render: (_, record) => (
        <Checkbox
          checked={record.completed}
          onChange={() => handleComplete(record)}
        >
          {record.completed ? 'Completed' : 'Incomplete'}
        </Checkbox>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type='link' onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title='Are you sure you want to delete this task?'
            onConfirm={() => handleDelete(record._id)}
            okText='Yes'
            cancelText='No'
          >
            <Button type='link' danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      )
    }
  ]

  return (
    <div className='container mx-auto py-6'>
      <h2 className='text-2xl font-semibold text-center mb-4'>Your Tasks</h2>
      <div className='flex gap-2'>
        <Button type='primary' className='mb-4' onClick={() => showModal()}>
          Add New Task
        </Button>
        <Button
          color='danger'
          variant='solid'
          onClick={() => dispatch(clearAuthState())}
        >
          Log out
        </Button>
      </div>
      <Table
        dataSource={tasks}
        columns={columns}
        tableLayout='fixed'
        rowKey='id' // Ensure this matches the unique identifier of your tasks
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={isEditing ? 'Edit Task' : 'Add Task'}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={isEditing ? 'Update' : 'Create'}
      >
        <Form form={form} layout='vertical' onFinish={handleFinish}>
          <Form.Item
            name='title'
            label='Title'
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input placeholder='Enter task title' />
          </Form.Item>
          <Form.Item
            name='description'
            label='Description'
            rules={[
              { required: true, message: 'Please input the description!' }
            ]}
          >
            <Input.TextArea placeholder='Enter task description' rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Tasks
