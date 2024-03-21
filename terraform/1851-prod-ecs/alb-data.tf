data "aws_lb" "backend" {
   tags = {
     ManagedBy   = "terraform"
     Type        = "Api"
     Usage =   "Backend"
   }
}

data "aws_lb_listener" "selected443" {
  load_balancer_arn = data.aws_lb.backend.arn
  port              = 443
}

 