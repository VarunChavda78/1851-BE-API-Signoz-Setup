data "aws_lb" "backend" {
   tags = {
     ManagedBy   = "terraform"
     Environment = var.environment
     Project     = var.ProjectName
     workspace   = terraform.workspace
     Type        = "Backend"
   }
}

data "aws_lb_listener" "selected443" {
  load_balancer_arn = data.aws_lb.backend.arn
  port              = 443
}

 