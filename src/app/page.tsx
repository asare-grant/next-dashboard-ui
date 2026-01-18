import AdminLoginPage from "./(auth)/admin-login/page"
import AdminSignupPage from "./(auth)/signup/page"

const Homepage = () => {
  return (
    <div className='flex items-center justify-center gap-5'>
      <AdminLoginPage />
      {/* <AdminSignupPage /> */}
    </div>
  )
}

export default Homepage