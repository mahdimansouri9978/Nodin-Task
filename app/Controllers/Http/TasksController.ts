import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Task from 'App/Models/Task'

export default class TasksController {
    public async showOne({response, request}: HttpContextContract) {
        const page = request.input("page", 1)
        const pageSize = request.input("page_size", 10)

        const task = await Database.from("tasks").paginate(page, pageSize)

        return response.json({ task })
      }

    public async show({response, auth}: HttpContextContract) {
        try {
          const task = await Task.findByOrFail("owner", auth.user!.id)

          return response.json({ task })
        } catch (error) {
          response.json({massage: "Any task wasn't found"})
        }

      }

    public async create({request, response, auth}: HttpContextContract) {
        const data = request.only(["name", "description", "priority"])
        const file = request.file("file", {
          extnames : ["jpg", "png"]
        })

        const task = await Task.create(data)
        task.owner = auth.use("api").user!.id

        if (file) {
          await file.moveToDisk('tasksfile', {
            name: `${task.id}.${file.extname}`
          })
          task.filename = `${task.id}.${file.extname}`
        }
        await task.save()
        
        return response.json({ task })
      }

      public async update({request, response, params}: HttpContextContract) {
        const data = request.only(["name", "description", "priority"])
        const file = request.file("file", {
          extnames : ["jpg", "png"]
        })

        try {
          const task = await Task.findOrFail(params.id)
                  
          if (file ) {
            await file.moveToDisk('tasksfile', {
            name: `${task.id}.${file.extname}`
          })

          task.filename = `${task.id}.${file.extname}`
        }
        
        task.merge(data)
  
          return response.json({ task })
        } catch (error) {
          return response.json({massage: "task not found!"})
        }

      }

      public async delete({response, params}: HttpContextContract) {
        try {
          const task = await Task.findOrFail(params.id)
          task.delete()
  
          return response.json({ task })
        } catch (error) {
          return response.json({massage: "task not found!"})
        }

      }

      public async search({request, response, auth}: HttpContextContract) {
          const query = request.input("search")
          
          try {
            const task =await Task.query().where("owner", auth.user!.id).where("name", query)

            return response.json({ task })
          } catch (error) {
            return response.json({error: "there's no such a task"})
          }

      }

      public async sort({request, response, auth}: HttpContextContract) {
        const sort = request.input("sort")
        const sortType = request.input("sort_type")

        try {
          const tasks =await Task.query().where("owner", auth.user!.id).orderBy(sort, sortType)

          return response.json({ tasks })
        } catch (error) {
          return response.json({error: "there's no such a task"})
        }

    }
}
