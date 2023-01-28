import { useEffect, useState } from 'react'
import { Refresh } from 'tabler-icons-react'
import './App.css'

const INITIAL_TASK_COUNT = 1

function App() {
  const [ip, setIp] = useState()
  const [detail, setDetail] = useState({})
  const [taskLeft, setTaskLeft] = useState(INITIAL_TASK_COUNT)

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (taskLeft !== INITIAL_TASK_COUNT) return

    fetch('/api/request')
      .then(data => data.json({}))
      .then(data => {
        setIp(data.ip)
        setDetail({...detail, ...data.detail})
        setTaskLeft(taskLeft - 1)
      })
  }, [taskLeft])
  
  function getData() {
    setDetail({})
    setTaskLeft(INITIAL_TASK_COUNT)
  }

  return (
    <div className="container">
      {!taskLeft ? (
        <>
          <div className="solid-container">
            <div className="item">
              <p className="tag">IP Address</p>
              <p className="value">{ip || '-'}</p>
            </div>

            <div className="refresh" onClick={getData}>
              <Refresh color={'#FFFFFF'} size={26} />
            </div>
          </div>

          <div className="glass-container">
            <p className="title">Request Detail</p>
            <p className="subtitle">Geolocation & DNS detail powered by ip-api.com</p>

            <div className="items">
              {Object.keys(detail).map((key) => (
                <div className="item" key={key}>
                  <p className="tag">{key}</p>
                  <p className="value">{detail[key] || '-'}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={{ width: '100%', height: '100vh', display: 'grid', placeItems: 'center' }}>
          <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
      )}
    </div>
  )
}

export default App
