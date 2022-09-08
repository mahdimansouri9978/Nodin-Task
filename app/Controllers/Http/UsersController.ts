import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Drive from '@ioc:Adonis/Core/Drive'
import Task from 'App/Models/Task'

export default class UsersController {
  
  //PAGINATION AND SHOW USER 
    public async show({request, response, auth}: HttpContextContract) {
      
      // Get data from body
        const page = request.input("page", 1)
        const pageSize = request.input("page_size", 10)

        // find user
        const userspage = await Database.from("users").paginate(page, pageSize)
        // const user = await User.find(auth.user!.id)
        const task =await Task.query().where("owner", auth.user!.id).select("*")
        
        // if have image
        try {
          var url = await Drive.getUrl('usersfiles/' + auth.use("api").user!.id + ".jpg")

        } catch(error) {
          url = "User havn't any image"
        }

        return response.json({userspage, task, url})
    }

    // REGISTER USER 
    public async register({request}: HttpContextContract) {

      // Validation Schema for email and password
        const userSchema = schema.create({
            email: schema.string({ trim: true}, [rules.unique({ table:"users", column: "email"}),
             rules.email()]),
            password: schema.string({},[rules.minLength(8)]),
        })

        // Invalid Massages
        const messages = {
            "*": (feild, rule) => {
                return feild +  " faild " + rule + " validation"
            }
        }
        
        // Get data from body:
        const data =await request.validate({schema: userSchema, messages})
        const user = await User.create(data)
        const file = request.file("file")

        // If file was in body:
        if (file) {
          await file.moveToDisk('usersfiles', {
            name: `${user.id}.${file.extname}`
          })
        user.filename = `${user.id}.${file.extname}`
        user.save()
        }

      return user
      }

    // LOGIN USER AND GET TOKEN
    public async login({request, response, auth}: HttpContextContract) {

      // Get data
      const email = request.input('email')
      const password = request.input('password')

      try {
             
      // Lookup user manually
      const user = await User
      .query()
      .where('email', email)
      .firstOrFail()
  
    // Verify password
    if (!(await Hash.verify(user.password, password))) {
      return response.unauthorized('Invalid credentials')
    }
  
    // Generate token
    const token = await auth.use('api').generate(user)

    return token;
      } catch (error) {
        // if email not founded
        return response.json({error: "you first need to register"})
      }
        }

    // RESET PASSWORD
    public async forgot({request, response}: HttpContextContract) {

        try {

          // Find user by email and reset password
            const user = await User.findByOrFail("email", request.input("email"))
            user.password = request.input("password")
            user.save()
            
         return response.json({massage: "password changes succesfully"})

        } catch (error) {

          // if user not found
            return response.json({massage: "you first need register!"})
        }

    }

    //DELETE USER
    public async delete({response, auth}: HttpContextContract) {

        // Find user by auth
        const user = await User.findOrFail(auth.user!.id)
        user.delete()
        
     return response.json({massage: "user delete succesfully"})
    }

    // UPDATE USER
    public async update({request, response, auth}: HttpContextContract) {
      // Get data from bode
        const email = await request.input("email")
        const password = await request.input("password")
        const file = request.file("file")

      // find user by auth
        const user = await User.findOrFail(auth.user!.id)
            
      // if there was file
        if (file) {
          await file.moveToDisk('usersfiles', {
            name: `${user.id}.${file.extname}`
          })
          user.filename = `${user.id}.${file.extname}`
        }
      
      // or if was email
        if (email) {
          user.email = email
        }

      // or if was password
        if (password) {
          user.password = password
        }
        
        await user.save()
    
        return response.json({ user })
      }

}
