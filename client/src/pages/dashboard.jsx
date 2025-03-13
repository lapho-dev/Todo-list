import Layout from '../components/layout'
import TodoList from '../components/todo-list'

const Dashboard = () => {

  return (
    <div>
      <Layout>
        <h1>Dashboard</h1>
        <div>
          <TodoList />
        </div>
      </Layout>
    </div>
  )
}

export default Dashboard