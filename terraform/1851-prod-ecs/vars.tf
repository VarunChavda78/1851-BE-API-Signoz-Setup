variable "region" {
  default = "us-east-1"
}
variable "ProjectName" {
  default = "1851"
}
variable "tf_backend_bucket_name" {
  default = "1851-terraform-state"
}
variable "environment" {
  description = "Deployment Environment"
  default = "prod"
}
variable "as_max_count" {
  type = number
  default = 3
}
variable "allow_overwrite" {
  type = bool
  default = true
}
variable "source_branch_name" {
  default = "development"
}

variable "domain_name" {
  default = "1851franchise.com"
}

variable "task_count" {
  type = number
  default = 1
}
variable "container_port" {
  type = number
  default = 3000
}

variable "nginx_container_port" {
  type    = number
  default = 80
}
variable "vpc_name"{
  default = "1851-prod-vpc"
}

variable "Product"{
  default = "Admin-BE-API"

}

variable "secret_manager_arn" {
  default = "arn:aws:secretsmanager:us-east-1:580880756845:secret:1851-Admin-BE-API-Prod-hilfCK"
}

