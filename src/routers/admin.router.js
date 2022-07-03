const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')

const mongoose = require('mongoose')

AdminBro.registerAdapter(AdminBroMongoose)

// const Faculty = mongoose.model('faculty',{
//     username: String,
//     password: String
// })
// const Studnent = mongoose.model('student',{
//     username: String,
//     password: String
// })

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
  branding:{
    logo: 'https://upload.wikimedia.org/wikipedia/en/d/db/C-DAC_LogoTransp.png',
    companyName: 'CDAC Silchar',
  }
})

const ADMIN = {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'admin',

}

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro,{
    cookieName: process.env.ADMIN_COOKIE_NAME || 'admin-bro',
    cookiePassword: process.env.ADMIN_COOKIE_PASS || 'admin',
    authenticate: async(email, password) => {
        if(email === ADMIN.email && password === ADMIN.password){
            return ADMIN
        }
        return null
    }
})

module.exports = router