data "aws_ecr_repository" "app" {
  name = "1851-admin-be-api"
}

data "aws_ecr_repository" "nginx" {
  name = "1851-admin-be-nginx"
}
