data "aws_ecr_repository" "app" {
  name = "supplier-api"
}

data "aws_ecr_repository" "nginx" {
  name = "supplier-api-nginx"
}
