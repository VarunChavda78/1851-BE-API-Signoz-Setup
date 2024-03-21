provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      ManagedBy = "terraform"
      Workspace = terraform.workspace
      Project   = "1851"
      Billing = "API"
    }
  }
}

terraform {
  backend "s3" {
    bucket = "1851-terraform-state"
    key = "1851-Admin-API/prod/terraform.tfstate"
    region = "us-east-1"
}
}





