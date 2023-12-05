data "aws_lb" "backend" {
   tags = {
     ManagedBy   = "terraform"
     Environment = var.environment
     workspace   = "1851-prod"
     Type        = "Frontend"
   }
}

data "aws_lb_listener" "selected443" {
  load_balancer_arn = data.aws_lb.backend.arn
  port              = 443
}

 