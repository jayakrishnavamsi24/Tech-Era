import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Header from '../Header'
import Failure from '../Failure'
import CourseItem from '../CourseItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'Failure',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {apiStatus: apiStatusConstants.initial, courseStack: []}

  componentDidMount() {
    this.getCourseStack()
  }

  getCourseStack = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const coursesUrl = 'https://apis.ccbp.in/te/courses'
    const options = {
      method: 'GET',
    }
    const response = await fetch(coursesUrl, options)
    if (response.ok === true) {
      const coursesData = await response.json()
      const formattedCoursesData = coursesData.courses.map(eachCourse => ({
        id: eachCourse.id,
        logoUrl: eachCourse.logo_url,
        name: eachCourse.name,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        courseStack: formattedCoursesData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" height={50} width={50} color="#4656a1" />
    </div>
  )

  appendCourses = () => {
    const {courseStack} = this.state

    return (
      <>
        <Header />
        <div className="home-container">
          <h1 className="heading">Courses</h1>
          <ul className="courses-container">
            {courseStack.map(eachCourse => (
              <CourseItem key={eachCourse.id} courseDetails={eachCourse} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  onRetryFetch = () => {
    this.setState({apiStatus: apiStatusConstants.initial}, this.getCourseStack)
  }

  renderFailureView = () => <Failure onRetry={this.onRetryFetch} />

  appendApiResults = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.appendCourses()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return <div className="main-container">{this.appendApiResults()}</div>
  }
}

export default Home
