import { useEffect, useState } from 'react'
import { fetchProtectedInfo } from '../api/auth-api'
import Layout from '../components/layout'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [protectedData, setProtectedData] = useState(null)


  const protectedInfo = async () => {
    try {
      const { data } = await fetchProtectedInfo()

      setProtectedData(data.info)

      setLoading(false)
    } catch (error) {
      logout()
    }
  }

  useEffect(() => {
    protectedInfo()
  }, [])

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div>
      <Layout>
        <h1>Dashboard</h1>
        <h2>{protectedData}</h2>
      </Layout>
    </div>
  )
}

export default Dashboard