import { useState } from 'react'
import axios from 'axios';
import './App.css'


function App() {
  const [subject, setSubject] = useState('')
  const [classNumber, setClassNumber] = useState('')
  const [section, setSection] = useState('')
  const [email, setEmail] = useState('')
  const [classData, setClassData] = useState([])

  const insertIntoDatabase = async () => {

    await axios.post("/api", {
      row: {email: email, class_name: subject + "-" + classNumber, class_sections: section}
    }).then(response => {
        console.log(response.data["message"])
      }).catch(error => {
        console.log(error)
      });
  }


  const handleClassSubmit = async () => {

    if (subject === '' || classNumber === '' || section === '' || email === '') {
      alert('Please fill out all fields')
      return
    }

    if (section !== 'ALL') {
      const sectionArr = section.split(',')
      for (let i = 0; i < sectionArr.length; i++) {
        if (sectionArr[i].length !== 3) {
          alert('Please enter a valid section number')
          return
        }
      }
    }

    setSubject('')
    setClassNumber('')
    setSection('')
    await insertIntoDatabase()
  }

  const checkClasses = () => {

    axios.get("/api", {
      params: {
        email: email
      }
    }).then(response => {
        setClassData(response.data)
      }).catch(error => {
        console.log(error)
      });
  }

  const deleteClass = async (id: number) => {
    await axios.delete("/api", {
      params: {
        id: id,
        email: email
      } 
    }).then(response => {
      console.log(response.data["message"])
    }).catch(error => {
      console.log(error)
    });
  }


  return (
    <>
      <div className="container">
        <div className="check-classes">
          <h2>Check classes currently on your watchlist</h2>
        </div> 
        <div className="email-form">
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email"/>
        </div>
        <div className="email-submit">
          <button onClick={checkClasses}>Submit</button>
        </div>
        <div className="check-classes-output">
          <table>
            <thead>
              {classData.length > 0 ?
              <tr>
                <th>Email</th>
                <th>Class Name</th>
                <th>Class Sections</th>
              </tr>
              : <tr><th>No Classes</th></tr>}
            </thead>
            <tbody> 
              {classData.map((row) => {
                return (
                  <tr key={row['id']}>
                    <td>{row['email']}</td>
                    <td>{row['class_name']}</td>
                    <td>{row['class_sections']}</td>
                    <td><button onClick={() => {deleteClass(row['id']).then(() => {checkClasses()})}}>Remove</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="class-forms">
            <h2>Add a class to your watchlist</h2>
            <label>Subject (CSCE, MEEN, ENGR, etc.):</label>
            <input type="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject"/>
            <br/>
            <label>Class number (101, 201, 120, etc):</label>
            <input type="classNumber" value={classNumber} onChange={e => setClassNumber(e.target.value)} placeholder="Class number"/>
            <br/>
            <label>Section number(s) (numbers seperated by commas or type ALL):</label>
            <input type="section" value={section} onChange={e => setSection(e.target.value)} placeholder="Section number"/>
            <br/>
            <label>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email"/>
          </div>
        <div className="class-submit">
          <button onClick={() => {handleClassSubmit().then(() => {checkClasses();})}}>Submit</button>
        </div>
        <div className="footnote">
          <p>Created by Christian Zech</p>
        </div>
      </div>
    </>
  )
}

export default App
