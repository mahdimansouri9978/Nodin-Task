import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Task from 'App/Models/Task'

export default class TasksController {

    //  TASKS PAGINATION
    public async showOne({response, request}: HttpContextContract) {

      // Get data from query
        const page = request.input("page", 1)
        const pageSize = request.input("page_size", 10)

        const task = await Database.from("tasks").paginate(page, pageSize)

        return response.json({ task })
      }

    // FIND ALL USERS TASKS
    public async show({response, auth}: HttpContextContract) {

        try {

          // Find task
          const task = await Task.query().where("owner", auth.user!.id).select("*")

          return response.json({ task })
        } catch (error) {
          response.json({massage: error})
        }
      }

    // CREATE TASK
    public async create({request, response, auth}: HttpContextContract) {
        // Get data from body and query
        const data = request.only(["name", "description", "priority"])
        const file = request.file("file", {
          extnames : ["jpg", "png"]
        })

        // priority code
        switch (data.priority) {
          case "low":
              data.priority = 1;           
            break;
            case "medium":
              data.priority = 2;            
            break;
            case "hard":
              data.priority = 3            
            break;
        
          default:
            break;
        }

        // create task
        const task = await Task.create(data)
        task.owner = auth.use("api").user!.id

        // if theres file
        if (file) {
          await file.moveToDisk('tasksfile', {
            name: `${task.id}.${file.extname}`
          })
          task.filename = `${task.id}.${file.extname}`
        }

        await task.save()
        
        return response.json({ task })
      }

      // UPDATE TASK
      public async update({request, response}: HttpContextContract) {
        
        // Get data from body and query
        const data = request.only(["name", "description", "priority"])
        const oldName = request.input("old-name")
        const file = request.file("file", {
          extnames : ["jpg", "png"]
        })

        try {

          // find task
          const task = await Task.findByOrFail("name", oldName)
                
          // if theres file
            if (file ) {
              await file.moveToDisk('tasksfile', {
              name: `${task.id}.${file.extname}`
            })
            task.filename = `${task.id}.${file.extname}`
            }

            // if theres priotity
            if (data.priority) {
              switch (data.priority) {
                case "low":
                    data.priority = 1;           
                  break;
                  case "medium":
                    data.priority = 2;            
                  break;
                  case "hard":
                    data.priority = 3;            
                  break;
              
                default:
                  break;
          }
            }

            task.merge(data)
            task.save()
  
          return response.json({ task })
        } catch (error) {
          return response.json({massage: "task not found!"})
        }

      }

      // DELETE TASk
      public async delete({response, request}: HttpContextContract) {

        try {

          // find task by name
          const task = await Task.findByOrFail("name", request.input("name"))
          task.delete()
  
          return response.json({ massage: "task deleted"})
        } catch (error) {
          return response.json({massage: "task not found!"})
        }

      }

      // SEARCH IN TASKS OF USER
      public async search({request, response, auth}: HttpContextContract) {

        // Get data in query
          const query = request.input("search")
        
          // Find users task
          const task =await Task.query().where("owner", auth.user!.id).andWhere("name", query)

            return response.json({ task })
          }

      // SORT TASKS
      public async sort({request, response, auth}: HttpContextContract) {

        // Get data from query
        const sort = request.input("sort")
        const sortType = request.input("sort_type")

        try {

          // Find and sort
          const tasks =await Task.query().where("owner", auth.user!.id).orderBy(sort, sortType)

          return response.json({ tasks })
        } catch (error) {
          return response.json({error: "there's no such a task"})
        }

    }
}
