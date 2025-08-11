import "server-only"

export const getMonitors = async () => {
    try {
      const res =  await fetch('http://localhost:9999/sites')
      const data = await res.json()
      console.log('Monitors:', data)
      return data
    } catch (error) {
      console.error('Error fetching monitors:', error)
      return []
    }
  }