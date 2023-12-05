data "aws_secretsmanager_secret" "by-arn" {
  arn = var.secret_manager_arn
}

data "aws_secretsmanager_secret_version" "by-version-stage" {
  secret_id = data.aws_secretsmanager_secret.by-arn.id

}

locals {
  secret_data = jsondecode(data.aws_secretsmanager_secret_version.by-version-stage.secret_string)
  secret_keys = [for v in keys(local.secret_data) : v]
  secret      = [for k in local.secret_keys : { Name = k, valueFrom ="${var.secret_manager_arn}:${k}::" }]
}