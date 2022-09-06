import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Task from 'App/Models/Task'

export default class UsersController {
    public async show({request, response,auth}: HttpContextContract) {
        const page = request.input("page", 1)
        const pageSize = request.input("page_size", 10)

        const user = await Database.from("users").paginate(page, pageSize)
        const tasks = await Task.findBy("owner", auth.use("api").user!.id)

        return response.json({ user, tasks})
    }

    public async register({request}: HttpContextContract) {
        const userSchema = schema.create({
            email: schema.string({ trim: true}, [rules.unique({ table:"users", column: "email"}),
             rules.email()]),
            password: schema.string({},[rules.minLength(8)])
        })

        const messages = {
            "*": (feild, rule) => {
                return feild +  " faild " + rule + " validation"
            }
        }
        
        const data =await request.validate({schema: userSchema, messages})

        const user = await User.create(data)

      return user
      }
    
    public async login({request, response, auth}: HttpContextContract) {
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
        return response.json({error: "you first need to register"})
      }
        }

    public async forgot({request, response}: HttpContextContract) {
        try {
            const hashedPassword = await Hash.make(request.input("password"))

            const user = await User.findByOrFail("email", request.input("email"))
            user.password = hashedPassword
            user.save()
            
         return response.json({massage: "password changes succesfully"})

        } catch (error) {
            return response.json({massage: "you first need register!"})
        }

    }

    public async delete({request, response}: HttpContextContract) {
        try {
            const user = await User.findByOrFail("email", request.input("email"))
            user.delete()
            
         return response.json({massage: "user delete succesfully"})

        } catch (error) {
            return response.json({massage: "you have not any account!"})
        }

    }

    public async update({request, response}: HttpContextContract) {
        const email = request.input("email")
        const password = request.input("password")

        try {
            const user = await User.findByOrFail("email", email)
            user.merge({email: email, password: password})
            await user.save()
    
            return response.json({ user })
        } catch (error) {
            return response.json({massage: "User not found!"})
        }
      }

}