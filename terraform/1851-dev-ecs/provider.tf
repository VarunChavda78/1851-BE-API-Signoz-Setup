provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      ManagedBy = "terraform"
      Workspace = terraform.workspace
      Project   = "Supplier-Database"
      Billing = "API"
    }
  }
}

terraform {
  backend "s3" {
    bucket = "1851-stg-terraform-state"
    key = "ecsfrontend-supplier-api/terraform.tfstate"
    region = "us-east-1"
}
}





