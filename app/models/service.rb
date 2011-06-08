class Service < ActiveRecord::Base
  has_many :infEntities
  has_many :refEntities
  has_many :tags
  has_many :competences

  has_attached_file :icon
end
