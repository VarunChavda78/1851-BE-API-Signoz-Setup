data "aws_vpc" "vpc" {

  filter {
    name   = "tag:Name"
    values = [var.vpc_name]
  }


}

data "aws_subnets" "private_subnets_id" {

  filter {
    name   = "tag:Type"
    values = ["private"]
  }


}
data "aws_subnets" "public_subnets_id" {

  filter {
    name   = "tag:Type"
    values = ["public"]
  }

}