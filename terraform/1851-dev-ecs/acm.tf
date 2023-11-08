# Find a certificate issued by (not imported into) ACM
data "aws_acm_certificate" "cert" {
  domain      = var.domain_name
  types       = ["AMAZON_ISSUED"]
  most_recent = true
}


resource "aws_acm_certificate_validation" "cert" {
  # api-gateway / cloudfront certificates need to use the us-east-1 region
  certificate_arn = data.aws_acm_certificate.cert.arn
  timeouts {
    create = "45m"
  }
}
 