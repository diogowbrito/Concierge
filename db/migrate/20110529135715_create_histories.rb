class CreateHistories < ActiveRecord::Migration
  def self.up
    create_table :histories do |t|
      t.integer :user_id
      t.datetime :time
      t.string :description
      t.string :url

      t.timestamps
    end
  end

  def self.down
    drop_table :histories
  end
end
