# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140523002943) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "campaigns", force: true do |t|
    t.integer  "user_id",     null: false
    t.string   "location",    null: false
    t.boolean  "public"
    t.string   "description"
    t.text     "rules"
    t.integer  "num_members", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title",       null: false
    t.string   "game_style",  null: false
    t.string   "game_system", null: false
    t.string   "setting"
    t.datetime "start_date"
    t.datetime "end_date"
  end

  add_index "campaigns", ["location"], name: "index_campaigns_on_location", using: :btree
  add_index "campaigns", ["num_members"], name: "index_campaigns_on_num_members", using: :btree
  add_index "campaigns", ["user_id"], name: "index_campaigns_on_user_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "session_token",                   null: false
    t.string   "password_digest",                 null: false
    t.string   "email",                           null: false
    t.integer  "age"
    t.string   "gender"
    t.text     "about"
    t.string   "phone_number"
    t.boolean  "verified",        default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "fname"
    t.string   "lname"
  end

  add_index "users", ["email"], name: "index_users_on_email", using: :btree

end
