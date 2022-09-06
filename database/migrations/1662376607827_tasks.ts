import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string("name").notNullable()
      table.text("description").nullable()
      table.integer("priority").unsigned().nullable().defaultTo(1)
      table.integer("owner").unsigned().references("id").inTable("users")
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

